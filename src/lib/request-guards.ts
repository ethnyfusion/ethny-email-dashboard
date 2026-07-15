const rateLimits = new Map<string, { count: number; resetAt: number }>();
const idempotencyKeys = new Map<string, number>();

const defaultRateLimit = {
  maxRequests: 20,
  windowMs: 60_000,
};

const idempotencyTtlMs = 15 * 60_000;

export function consumeRateLimit(key: string) {
  const now = Date.now();
  const current = rateLimits.get(key);

  if (!current || current.resetAt <= now) {
    rateLimits.set(key, {
      count: 1,
      resetAt: now + defaultRateLimit.windowMs,
    });
    return { allowed: true, remaining: defaultRateLimit.maxRequests - 1 };
  }

  if (current.count >= defaultRateLimit.maxRequests) {
    return { allowed: false, remaining: 0 };
  }

  current.count += 1;
  rateLimits.set(key, current);
  return { allowed: true, remaining: defaultRateLimit.maxRequests - current.count };
}

export function claimIdempotencyKey(key: string) {
  const now = Date.now();
  cleanupExpiredIdempotencyKeys(now);

  if (idempotencyKeys.has(key)) {
    return false;
  }

  idempotencyKeys.set(key, now + idempotencyTtlMs);
  return true;
}

function cleanupExpiredIdempotencyKeys(now: number) {
  for (const [key, expiresAt] of idempotencyKeys.entries()) {
    if (expiresAt <= now) {
      idempotencyKeys.delete(key);
    }
  }
}
