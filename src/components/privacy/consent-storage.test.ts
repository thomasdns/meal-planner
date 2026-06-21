import { describe, expect, it, vi } from "vitest";

import { parseConsentSnapshot } from "@/components/privacy/consent-storage";

describe("parseConsentSnapshot", () => {
  it("reads accepted and refused choices before expiration", () => {
    vi.setSystemTime(new Date("2026-06-21T10:00:00.000Z"));

    expect(
      parseConsentSnapshot("accepted|2026-12-21T10:00:00.000Z"),
    ).toEqual({ audience: true });
    expect(
      parseConsentSnapshot("refused|2026-12-21T10:00:00.000Z"),
    ).toEqual({ audience: false });

    vi.useRealTimers();
  });

  it("rejects expired or malformed choices", () => {
    vi.setSystemTime(new Date("2026-06-21T10:00:00.000Z"));

    expect(
      parseConsentSnapshot("accepted|2026-06-20T10:00:00.000Z"),
    ).toBeNull();
    expect(parseConsentSnapshot("accepted")).toBeNull();
    expect(parseConsentSnapshot("unknown|2026-12-21T10:00:00.000Z")).toBeNull();

    vi.useRealTimers();
  });
});
