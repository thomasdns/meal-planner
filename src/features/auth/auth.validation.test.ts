import { describe, expect, it } from "vitest";

import {
  forgotPasswordSchema,
  resetPasswordSchema,
  signUpSchema,
} from "@/features/auth/auth.validation";

describe("signUpSchema", () => {
  it("accepts a stronger password", () => {
    const result = signUpSchema.safeParse({
      name: "Utilisateur Test",
      email: "TEST@example.com",
      password: "Password123",
    });

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.email).toBe("test@example.com");
    }
  });

  it("rejects weak passwords", () => {
    const result = signUpSchema.safeParse({
      name: "Utilisateur Test",
      email: "test@example.com",
      password: "password",
    });

    expect(result.success).toBe(false);
  });

  it("accepts a password reset request email", () => {
    const result = forgotPasswordSchema.safeParse({
      email: "USER@example.COM",
    });

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.email).toBe("user@example.com");
    }
  });

  it("accepts a valid password reset payload", () => {
    const result = resetPasswordSchema.safeParse({
      token: "a".repeat(32),
      password: "NewPassword123",
    });

    expect(result.success).toBe(true);
  });
});
