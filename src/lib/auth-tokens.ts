import "server-only";

import { createHash, randomBytes } from "node:crypto";

import { prisma } from "@/lib/prisma";

export const authTokenPurpose = {
  passwordReset: "password-reset",
  emailVerification: "email-verification",
} as const;

type AuthTokenPurpose =
  (typeof authTokenPurpose)[keyof typeof authTokenPurpose];

const tokenByteLength = 32;

export function createAuthTokenIdentifier(
  purpose: AuthTokenPurpose,
  email: string,
) {
  return `${purpose}:${email.trim().toLowerCase()}`;
}

export function createAppUrl(path: string) {
  const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
  return new URL(path, baseUrl).toString();
}

export function canExposeAuthLinks() {
  return process.env.NODE_ENV !== "production";
}

export async function createAuthToken(identifier: string, ttlMs: number) {
  const token = randomBytes(tokenByteLength).toString("base64url");
  const hashedToken = hashAuthToken(token);

  await prisma.verificationToken.deleteMany({
    where: {
      identifier,
    },
  });

  await prisma.verificationToken.create({
    data: {
      identifier,
      token: hashedToken,
      expires: new Date(Date.now() + ttlMs),
    },
  });

  return token;
}

export async function consumeAuthToken(
  purpose: AuthTokenPurpose,
  token: string,
) {
  const hashedToken = hashAuthToken(token);
  const verificationToken = await prisma.verificationToken.findUnique({
    where: {
      token: hashedToken,
    },
  });

  if (
    !verificationToken ||
    verificationToken.expires <= new Date() ||
    !verificationToken.identifier.startsWith(`${purpose}:`)
  ) {
    if (verificationToken) {
      await prisma.verificationToken.delete({
        where: {
          token: hashedToken,
        },
      });
    }

    return null;
  }

  await prisma.verificationToken.delete({
    where: {
      token: hashedToken,
    },
  });

  return verificationToken.identifier.slice(`${purpose}:`.length);
}

function hashAuthToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}
