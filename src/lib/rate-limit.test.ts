import { afterEach, describe, expect, it, vi } from "vitest";

import { checkRateLimit, clearRateLimitStore } from "@/lib/rate-limit";

describe("checkRateLimit", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("blocks requests after the configured limit", async () => {
    vi.stubEnv("UPSTASH_REDIS_REST_URL", "");
    vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "");
    clearRateLimitStore();

    const options = {
      limit: 2,
      windowMs: 1000,
    };

    expect((await checkRateLimit("User@Example.com", options, 0)).allowed).toBe(
      true,
    );
    expect(
      (await checkRateLimit("user@example.com", options, 100)).allowed,
    ).toBe(true);
    expect(
      (await checkRateLimit("USER@example.com", options, 200)).allowed,
    ).toBe(false);
  });

  it("allows requests again after the window reset", async () => {
    vi.stubEnv("UPSTASH_REDIS_REST_URL", "");
    vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "");
    clearRateLimitStore();

    const options = {
      limit: 1,
      windowMs: 1000,
    };

    expect((await checkRateLimit("user@example.com", options, 0)).allowed).toBe(
      true,
    );
    expect(
      (await checkRateLimit("user@example.com", options, 500)).allowed,
    ).toBe(false);
    expect(
      (await checkRateLimit("user@example.com", options, 1001)).allowed,
    ).toBe(true);
  });

  it("uses the shared Redis limit without exposing the raw key", async () => {
    vi.stubEnv("UPSTASH_REDIS_REST_URL", "https://example.upstash.io");
    vi.stubEnv("UPSTASH_REDIS_REST_TOKEN", "test-token");
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ result: [1, 2, 60] }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const result = await checkRateLimit(
      "sign-in:user@example.com",
      { limit: 10, windowMs: 60_000 },
      1_000,
    );

    expect(result).toEqual({
      allowed: true,
      remaining: 8,
      resetAt: 61_000,
    });
    const requestBody = String(fetchMock.mock.calls[0]?.[1]?.body);
    expect(requestBody).not.toContain("user@example.com");
  });
});
