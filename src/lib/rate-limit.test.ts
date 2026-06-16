import { describe, expect, it } from "vitest";

import { checkRateLimit, clearRateLimitStore } from "@/lib/rate-limit";

describe("checkRateLimit", () => {
  it("blocks requests after the configured limit", () => {
    clearRateLimitStore();

    const options = {
      limit: 2,
      windowMs: 1000,
    };

    expect(checkRateLimit("User@Example.com", options, 0).allowed).toBe(true);
    expect(checkRateLimit("user@example.com", options, 100).allowed).toBe(true);
    expect(checkRateLimit("USER@example.com", options, 200).allowed).toBe(false);
  });

  it("allows requests again after the window reset", () => {
    clearRateLimitStore();

    const options = {
      limit: 1,
      windowMs: 1000,
    };

    expect(checkRateLimit("user@example.com", options, 0).allowed).toBe(true);
    expect(checkRateLimit("user@example.com", options, 500).allowed).toBe(false);
    expect(checkRateLimit("user@example.com", options, 1001).allowed).toBe(true);
  });
});
