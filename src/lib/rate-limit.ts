import { createHash } from "node:crypto";

type RateLimitOptions = {
  limit: number;
  windowMs: number;
};

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  resetAt: number;
};

const rateLimitStore = new Map<string, RateLimitEntry>();
let hasLoggedMissingRedisConfiguration = false;

const rateLimitScript = `
local count = redis.call("INCR", KEYS[1])
if count == 1 then
  redis.call("EXPIRE", KEYS[1], ARGV[2])
end
local ttl = redis.call("TTL", KEYS[1])
local allowed = 0
if count <= tonumber(ARGV[1]) then
  allowed = 1
end
return {allowed, count, ttl}
`;

export async function checkRateLimit(
  key: string,
  options: RateLimitOptions,
  now = Date.now(),
): Promise<RateLimitResult> {
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (redisUrl && redisToken) {
    try {
      return await checkDistributedRateLimit(
        key,
        options,
        now,
        redisUrl,
        redisToken,
      );
    } catch (error) {
      console.error(
        JSON.stringify({
          event: "rate_limit_redis_failed",
          error: normalizeError(error),
        }),
      );
    }
  } else if (
    process.env.NODE_ENV === "production" &&
    !hasLoggedMissingRedisConfiguration
  ) {
    hasLoggedMissingRedisConfiguration = true;
    console.warn(
      JSON.stringify({
        event: "rate_limit_redis_not_configured",
        message: "Falling back to process-local rate limiting.",
      }),
    );
  }

  return checkLocalRateLimit(key, options, now);
}

async function checkDistributedRateLimit(
  key: string,
  options: RateLimitOptions,
  now: number,
  redisUrl: string,
  redisToken: string,
) {
  const redisKey = `meal-planner:rate-limit:${hashKey(key)}`;
  const windowSeconds = Math.max(1, Math.ceil(options.windowMs / 1000));
  const response = await fetch(redisUrl.replace(/\/$/, ""), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${redisToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify([
      "EVAL",
      rateLimitScript,
      "1",
      redisKey,
      String(options.limit),
      String(windowSeconds),
    ]),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Upstash returned HTTP ${response.status}.`);
  }

  const payload = (await response.json()) as {
    result?: [number, number, number];
    error?: string;
  };

  if (!payload.result || payload.error) {
    throw new Error(payload.error ?? "Invalid Upstash response.");
  }

  const [allowed, count, ttl] = payload.result;

  return {
    allowed: allowed === 1,
    remaining: Math.max(0, options.limit - count),
    resetAt: now + Math.max(0, ttl) * 1000,
  };
}

function checkLocalRateLimit(
  key: string,
  options: RateLimitOptions,
  now: number,
): RateLimitResult {
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

function hashKey(key: string) {
  return createHash("sha256").update(key.trim().toLowerCase()).digest("hex");
}

function normalizeError(error: unknown) {
  return error instanceof Error
    ? { name: error.name, message: error.message }
    : { name: "UnknownError", message: "Unknown rate limit error" };
}

export function clearRateLimitStore() {
  rateLimitStore.clear();
}
