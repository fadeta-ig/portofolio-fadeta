const TURNSTILE_ENDPOINT = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 8;
const MIN_FORM_FILL_MS = 2_000;
const MAX_FORM_AGE_MS = 24 * 60 * 60 * 1000;
const TURNSTILE_TIMEOUT_MS = 6_000;
const MAX_RATE_LIMIT_BUCKETS = 5_000;

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
  if (rateLimitBuckets.size > MAX_RATE_LIMIT_BUCKETS) {
    for (const [bucketKey, timestamps] of rateLimitBuckets) {
      if (!timestamps.length || timestamps.at(-1) <= now - RATE_LIMIT_WINDOW_MS) {
        rateLimitBuckets.delete(bucketKey);
      }
    }
  }

  const timestamps = (rateLimitBuckets.get(key) ?? [])
    .filter((timestamp) => timestamp > now - RATE_LIMIT_WINDOW_MS);

  if (timestamps.length >= RATE_LIMIT_MAX_REQUESTS) {
    const retryAfterMs = Math.max(1_000, timestamps[0] + RATE_LIMIT_WINDOW_MS - now);
    rateLimitBuckets.set(key, timestamps);
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds: Math.ceil(retryAfterMs / 1_000)
    };
  }

  timestamps.push(now);
  rateLimitBuckets.set(key, timestamps);
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

    const result = await response.json();
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
