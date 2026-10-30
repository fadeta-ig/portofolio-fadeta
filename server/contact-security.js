const TURNSTILE_ENDPOINT = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 8;
const MIN_FORM_FILL_MS = 2_000;
const MAX_FORM_AGE_MS = 24 * 60 * 60 * 1000;
const TURNSTILE_TIMEOUT_MS = 6_000;
const MAX_RATE_LIMIT_BUCKETS = 5_000;
// Single server-side source for the Turnstile widget action. The client keeps
// its own mirror constant in TurnstileWidget.vue (no server→client import);
// both strings must stay identical (see tests/contact-security.test.mjs).
export const TURNSTILE_ACTION = 'turnstile-spin-v2';

const rateLimitBuckets = globalThis.__gandivaContactRateLimits ?? new Map();
globalThis.__gandivaContactRateLimits = rateLimitBuckets;

export function getClientIp(req) {
  const forwarded = req.headers?.['x-vercel-forwarded-for']
    ?? req.headers?.['x-forwarded-for']
    ?? req.headers?.['x-real-ip']
    ?? req.socket?.remoteAddress
    ?? '';

  return String(forwarded).split(',')[0].trim() || 'unknown';
}

export function consumeRateLimit(key, now = Date.now()) {
  // Requests without any IP signal must not share one global 'unknown' bucket
  // (one actor could exhaust it for everyone); slice them per minute instead.
  const bucketKey = key === 'unknown' ? `unknown:${Math.floor(now / 60_000)}` : key;

  if (rateLimitBuckets.size >= MAX_RATE_LIMIT_BUCKETS) {
    for (const [storedKey, timestamps] of rateLimitBuckets) {
      if (!timestamps.length || timestamps.at(-1) <= now - RATE_LIMIT_WINDOW_MS) {
        rateLimitBuckets.delete(storedKey);
      }
    }
    // A flood of unique keys within one window expires nothing; evict the
    // oldest-inserted buckets so the Map stays bounded regardless.
    while (rateLimitBuckets.size >= MAX_RATE_LIMIT_BUCKETS) {
      const oldest = rateLimitBuckets.keys().next();
      if (oldest.done) break;
      rateLimitBuckets.delete(oldest.value);
    }
  }

  const timestamps = (rateLimitBuckets.get(bucketKey) ?? [])
    .filter((timestamp) => timestamp > now - RATE_LIMIT_WINDOW_MS);

  if (timestamps.length >= RATE_LIMIT_MAX_REQUESTS) {
    const retryAfterMs = Math.max(1_000, timestamps[0] + RATE_LIMIT_WINDOW_MS - now);
    rateLimitBuckets.set(bucketKey, timestamps);
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds: Math.ceil(retryAfterMs / 1_000)
    };
  }

  timestamps.push(now);
  rateLimitBuckets.set(bucketKey, timestamps);
  return {
    allowed: true,
    remaining: RATE_LIMIT_MAX_REQUESTS - timestamps.length,
    retryAfterSeconds: 0
  };
}

export function validateSubmissionTiming(value, now = Date.now()) {
  const startedAt = Number(value);
  if (!Number.isFinite(startedAt) || startedAt <= 0) {
    return { valid: false, reason: 'missing' };
  }

  const elapsed = now - startedAt;
  if (elapsed < MIN_FORM_FILL_MS) return { valid: false, reason: 'too-fast' };
  if (elapsed > MAX_FORM_AGE_MS) return { valid: false, reason: 'expired' };
  return { valid: true, reason: '' };
}

function normalizedHost(value) {
  return String(value || '').trim().toLowerCase().split(':')[0];
}

export async function verifyTurnstile({
  token,
  secret,
  remoteIp,
  expectedHostname,
  expectedAction,
  fetchImpl = fetch
}) {
  // Fail-open by design when no secret is configured (local/preview without
  // Turnstile). Production stays fail-closed: api/contact.js returns 503 when
  // VERCEL_ENV is production and TURNSTILE_SECRET is missing.
  if (!secret) return { success: true, skipped: true };
  if (typeof token !== 'string' || !token.trim() || token.length > 2_048) {
    return { success: false, error: 'missing-token' };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TURNSTILE_TIMEOUT_MS);

  try {
    const payload = new URLSearchParams({
      secret,
      response: token.trim()
    });
    if (remoteIp && remoteIp !== 'unknown') payload.set('remoteip', remoteIp);

    const response = await fetchImpl(TURNSTILE_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: payload,
      signal: controller.signal
    });

    if (!response.ok) return { success: false, error: 'verification-unavailable' };

    const result = await response.json().catch(() => null);
    if (!result || typeof result !== 'object') return { success: false, error: 'verification-unavailable' };
    if (!result.success) {
      return {
        success: false,
        error: 'verification-failed',
        errorCodes: Array.isArray(result['error-codes']) ? result['error-codes'] : []
      };
    }

    const expected = normalizedHost(expectedHostname);
    const verified = normalizedHost(result.hostname);
    if (expected && verified && expected !== verified) {
      return { success: false, error: 'hostname-mismatch' };
    }

    if (expectedAction && result.action !== expectedAction) {
      return { success: false, error: 'action-mismatch' };
    }

    return { success: true, skipped: false };
  } catch (error) {
    return {
      success: false,
      error: error?.name === 'AbortError' ? 'verification-timeout' : 'verification-unavailable'
    };
  } finally {
    clearTimeout(timeout);
  }
}

export function resetRateLimitsForTests() {
  rateLimitBuckets.clear();
}

export const contactSecurityConfig = Object.freeze({
  rateLimitWindowMs: RATE_LIMIT_WINDOW_MS,
  rateLimitMaxRequests: RATE_LIMIT_MAX_REQUESTS,
  minFormFillMs: MIN_FORM_FILL_MS,
  maxFormAgeMs: MAX_FORM_AGE_MS
});
