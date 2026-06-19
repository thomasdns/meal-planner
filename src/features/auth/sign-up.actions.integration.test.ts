import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  checkRateLimit: vi.fn(),
  createEmailVerificationLink: vi.fn(),
  findUnique: vi.fn(),
  hash: vi.fn(),
  redirect: vi.fn(),
  sendEmailVerificationEmail: vi.fn(),
  userCreate: vi.fn(),
}));

vi.mock("bcryptjs", () => ({
  default: {
    hash: mocks.hash,
  },
}));

vi.mock("next/navigation", () => ({
  redirect: mocks.redirect,
}));

vi.mock("@/features/auth/email-verification.actions", () => ({
  createEmailVerificationLink: mocks.createEmailVerificationLink,
}));

vi.mock("@/lib/email", () => ({
  sendEmailVerificationEmail: mocks.sendEmailVerificationEmail,
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      create: mocks.userCreate,
      findUnique: mocks.findUnique,
    },
  },
}));

vi.mock("@/lib/rate-limit", () => ({
  checkRateLimit: mocks.checkRateLimit,
}));

import { signUpAction } from "@/features/auth/sign-up.actions";

describe("signUpAction integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.checkRateLimit.mockResolvedValue({ allowed: true });
    mocks.findUnique.mockResolvedValue(null);
    mocks.hash.mockResolvedValue("hashed-password");
    mocks.userCreate.mockResolvedValue({ email: "user@example.com" });
    mocks.createEmailVerificationLink.mockResolvedValue(
      "http://localhost:3000/auth/verify-email/confirm?token=test",
    );
    mocks.sendEmailVerificationEmail.mockResolvedValue({ delivered: true });
  });

  it("rejects invalid data before accessing external services", async () => {
    const result = await signUpAction({}, createFormData({
      name: "U",
      email: "invalid",
      password: "weak",
    }));

    expect(result.error).toBeDefined();
    expect(mocks.findUnique).not.toHaveBeenCalled();
    expect(mocks.userCreate).not.toHaveBeenCalled();
  });

  it("creates the account and sends its verification email", async () => {
    await signUpAction({}, validFormData());

    expect(mocks.userCreate).toHaveBeenCalledWith({
      data: {
        name: "Utilisateur Test",
        email: "user@example.com",
        password: "hashed-password",
      },
      select: { email: true },
    });
    expect(mocks.sendEmailVerificationEmail).toHaveBeenCalledOnce();
    expect(mocks.redirect).toHaveBeenCalledWith("/auth/sign-in?registered=1");
  });

  it("returns a useful error when the verification email fails", async () => {
    mocks.sendEmailVerificationEmail.mockResolvedValue({ delivered: false });

    const result = await signUpAction({}, validFormData());

    expect(result).toEqual({
      error: "Compte cree, mais l'email de verification n'a pas pu etre envoye.",
    });
    expect(mocks.redirect).not.toHaveBeenCalled();
  });
});

function validFormData() {
  return createFormData({
    name: "Utilisateur Test",
    email: "USER@example.com",
    password: "Password1234",
  });
}

function createFormData(values: Record<string, string>) {
  const formData = new FormData();

  for (const [key, value] of Object.entries(values)) {
    formData.set(key, value);
  }

  return formData;
}
