import { describe, expect, it, vi } from "vitest";

import { logError, logEvent } from "@/lib/logger";

describe("logger", () => {
  it("writes structured JSON and redacts sensitive fields", async () => {
    const consoleSpy = vi.spyOn(console, "info").mockImplementation(() => {});

    await logEvent("info", "test_event", {
      userId: "user-1",
      token: "secret-token",
    });

    const payload = JSON.parse(String(consoleSpy.mock.calls[0]?.[0]));
    expect(payload.event).toBe("test_event");
    expect(payload.userId).toBe("user-1");
    expect(payload.token).toBe("[REDACTED]");
  });

  it("writes normalized errors to stderr", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    await logError("smtp_email_failed", new Error("SMTP unavailable"));

    const payload = JSON.parse(String(consoleSpy.mock.calls[0]?.[0]));
    expect(payload.level).toBe("error");
    expect(payload.event).toBe("smtp_email_failed");
    expect(payload.error).toEqual(
      expect.objectContaining({
        name: "Error",
        message: "SMTP unavailable",
      }),
    );
  });
});
