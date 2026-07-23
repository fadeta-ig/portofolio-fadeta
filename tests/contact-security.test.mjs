import assert from 'node:assert/strict';
import test from 'node:test';
import handler, { isAllowedOrigin, normalize, parseBody, validate } from '../api/contact.js';
import {
  consumeRateLimit,
  contactSecurityConfig,
  resetRateLimitsForTests,
  validateSubmissionTiming,
  verifyTurnstile
} from '../server/contact-security.js';

function createResponse() {
  const headers = new Map();
  return {
    statusCode: 200,
    body: '',
    setHeader(name, value) {
      headers.set(name.toLowerCase(), String(value));
    },
    getHeader(name) {
      return headers.get(name.toLowerCase());
    },
    end(value = '') {
      this.body = value;
    }
  };
}

function validBody(overrides = {}) {
  return {
    name: 'Fadeta Indra',
    company: 'Gandiva Labs',
    email: 'halo@example.com',
    whatsapp: '081234567890',
    service: 'Website custom',
    timeline: '1-2 bulan',
    summary: 'Kami membutuhkan website baru untuk menjelaskan layanan perusahaan.',
    source: 'test',
    variant: 'full',
    consent: true,
    submissionId: '12345678-abcd',
    formStartedAt: Date.now() - 3_000,
    website: '',
    ...overrides
  };
}

test('normalisasi dan parser membatasi serta membaca payload dengan aman', () => {
  assert.equal(normalize('  abcdef  ', 4), 'abcd');
  assert.deepEqual(parseBody('{"name":"Fadeta"}'), { name: 'Fadeta' });
  assert.deepEqual(parseBody(null), {});
});

test('validasi form menolak enum dan data wajib yang tidak valid', () => {
  const errors = validate({
    name: 'A',
    email: 'bukan-email',
    whatsapp: '123',
    service: 'Tidak dikenal',
    timeline: '',
    summary: 'Terlalu singkat',
    variant: 'full',
    consent: false,
    submissionId: 'x'
  });

  assert.deepEqual(Object.keys(errors).sort(), [
    'consent',
    'email',
    'name',
    'service',
    'submissionId',
    'summary',
    'timeline',
    'whatsapp'
  ]);
});

test('origin harus sama dengan host atau termasuk allowlist', () => {
  const originalAllowedOrigin = process.env.ALLOWED_ORIGIN;
  delete process.env.ALLOWED_ORIGIN;
  assert.equal(isAllowedOrigin({ headers: { origin: 'https://example.com', host: 'example.com' } }), true);
  assert.equal(isAllowedOrigin({ headers: { origin: 'https://evil.example', host: 'example.com' } }), false);

  process.env.ALLOWED_ORIGIN = 'https://preview.example,https://www.gandivalabs.my.id';
  assert.equal(isAllowedOrigin({ headers: { origin: 'https://preview.example', host: 'other.example' } }), true);
  assert.equal(isAllowedOrigin({ headers: { origin: 'https://unknown.example', host: 'unknown.example' } }), false);

  if (originalAllowedOrigin === undefined) delete process.env.ALLOWED_ORIGIN;
  else process.env.ALLOWED_ORIGIN = originalAllowedOrigin;
});

test('waktu pengisian menolak submit instan dan sesi kedaluwarsa', () => {
  const now = 1_800_000_000_000;
  assert.equal(validateSubmissionTiming(now - contactSecurityConfig.minFormFillMs, now).valid, true);
  assert.equal(validateSubmissionTiming(now - contactSecurityConfig.minFormFillMs + 1, now).reason, 'too-fast');
  assert.equal(validateSubmissionTiming(now - contactSecurityConfig.maxFormAgeMs - 1, now).reason, 'expired');
  assert.equal(validateSubmissionTiming('invalid', now).reason, 'missing');
});

test('rate limit mengizinkan batas yang ditetapkan lalu memberi Retry-After', () => {
  resetRateLimitsForTests();
  const now = 1_800_000_000_000;

  for (let index = 0; index < contactSecurityConfig.rateLimitMaxRequests; index += 1) {
    assert.equal(consumeRateLimit('203.0.113.10', now + index).allowed, true);
  }

  const blocked = consumeRateLimit('203.0.113.10', now + 100);
  assert.equal(blocked.allowed, false);
  assert.ok(blocked.retryAfterSeconds > 0);

  const afterWindow = consumeRateLimit('203.0.113.10', now + contactSecurityConfig.rateLimitWindowMs + 1);
  assert.equal(afterWindow.allowed, true);
});

test('Turnstile dilewati tanpa secret dan wajib valid ketika secret tersedia', async () => {
  assert.deepEqual(
    await verifyTurnstile({ token: '', secret: '', remoteIp: '203.0.113.10' }),
    { success: true, skipped: true }
  );

  const missing = await verifyTurnstile({ token: '', secret: 'secret', remoteIp: '203.0.113.10' });
  assert.equal(missing.success, false);
  assert.equal(missing.error, 'missing-token');

  const success = await verifyTurnstile({
    token: 'verified-token',
    secret: 'secret',
    remoteIp: '203.0.113.10',
    expectedHostname: 'www.gandivalabs.my.id',
    expectedAction: 'contact_form',
    fetchImpl: async (_url, options) => {
      assert.equal(options.body.get('remoteip'), '203.0.113.10');
      return {
        ok: true,
        json: async () => ({ success: true, hostname: 'www.gandivalabs.my.id', action: 'contact_form' })
      };
    }
  });
  assert.deepEqual(success, { success: true, skipped: false });

  const mismatch = await verifyTurnstile({
    token: 'verified-token',
    secret: 'secret',
    expectedHostname: 'www.gandivalabs.my.id',
    fetchImpl: async () => ({
      ok: true,
      json: async () => ({ success: true, hostname: 'evil.example' })
    })
  });
  assert.equal(mismatch.error, 'hostname-mismatch');

  const actionMismatch = await verifyTurnstile({
    token: 'verified-token',
    secret: 'secret',
    expectedHostname: 'www.gandivalabs.my.id',
    expectedAction: 'contact_form',
    fetchImpl: async () => ({
      ok: true,
      json: async () => ({
        success: true,
        hostname: 'www.gandivalabs.my.id',
        action: 'another_form'
      })
    })
  });
  assert.equal(actionMismatch.error, 'action-mismatch');
});

test('endpoint menerapkan metode, honeypot, timing, dan kegagalan konfigurasi dengan status tepat', async () => {
  resetRateLimitsForTests();

  const methodResponse = createResponse();
  await handler({ method: 'GET', headers: {} }, methodResponse);
  assert.equal(methodResponse.statusCode, 405);
  assert.equal(methodResponse.getHeader('allow'), 'POST');

  const honeypotResponse = createResponse();
  await handler({
    method: 'POST',
    headers: { host: 'www.gandivalabs.my.id', 'x-forwarded-for': '203.0.113.11' },
    body: validBody({ website: 'spam.example', formStartedAt: undefined })
  }, honeypotResponse);
  assert.equal(honeypotResponse.statusCode, 200);

  const fastResponse = createResponse();
  await handler({
    method: 'POST',
    headers: { host: 'www.gandivalabs.my.id', 'x-forwarded-for': '203.0.113.12' },
    body: validBody({ formStartedAt: Date.now() })
  }, fastResponse);
  assert.equal(fastResponse.statusCode, 400);

  const originalResendKey = process.env.RESEND_API_KEY;
  const originalTurnstileSecret = process.env.TURNSTILE_SECRET_KEY;
  delete process.env.RESEND_API_KEY;
  delete process.env.TURNSTILE_SECRET_KEY;

  const configurationResponse = createResponse();
  await handler({
    method: 'POST',
    headers: { host: 'www.gandivalabs.my.id', 'x-forwarded-for': '203.0.113.13' },
    body: validBody()
  }, configurationResponse);
  assert.equal(configurationResponse.statusCode, 503);
  assert.equal(configurationResponse.getHeader('cache-control'), 'no-store');

  if (originalResendKey === undefined) delete process.env.RESEND_API_KEY;
  else process.env.RESEND_API_KEY = originalResendKey;
  if (originalTurnstileSecret === undefined) delete process.env.TURNSTILE_SECRET_KEY;
  else process.env.TURNSTILE_SECRET_KEY = originalTurnstileSecret;
});
