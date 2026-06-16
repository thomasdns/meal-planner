type RateLimitOptions = {
  limit: number;
  windowMs: number;
};

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const rateLimitStore = new Map<string, RateLimitEntry>();

export function checkRateLimit(
  key: string,
  options: RateLimitOptions,
  now = Date.now(),
) {
  const normalizedKey = key.trim().toLowerCase();
  const current = rateLimitStore.get(normalizedKey);

  if (!current || current.resetAt <= now) {
    rateLimitStore.set(normalizedKey, {
      count: 1,
      resetAt: now + options.windowMs,
    });

    return {
      allowed: true,
      remaining: options.limit - 1,
      resetAt: now + options.windowMs,
    };
  }

  if (current.count >= options.limit) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: current.resetAt,
    };
  }

  current.count += 1;
  rateLimitStore.set(normalizedKey, current);

  return {
    allowed: true,
    remaining: options.limit - current.count,
    resetAt: current.resetAt,
  };
}

export function clearRateLimitStore() {
  rateLimitStore.clear();
}
