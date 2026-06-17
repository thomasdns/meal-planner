"use server";

import { revalidatePath } from "next/cache";

import {
  authTokenPurpose,
  consumeAuthToken,
  createAppUrl,
  createAuthToken,
  createAuthTokenIdentifier,
} from "@/lib/auth-tokens";
import { prisma } from "@/lib/prisma";

const emailVerificationTokenTtlMs = 24 * 60 * 60 * 1000;

export async function createEmailVerificationLink(email: string) {
  const token = await createAuthToken(
    createAuthTokenIdentifier(authTokenPurpose.emailVerification, email),
    emailVerificationTokenTtlMs,
  );

  return createAppUrl(`/auth/verify-email?token=${token}`);
}

export async function verifyEmailToken(token: string) {
  const email = await consumeAuthToken(authTokenPurpose.emailVerification, token);

  if (!email) {
    return {
      success: false,
      message: "Ce lien de verification est invalide ou expire.",
    };
  }

  await prisma.user.update({
    where: {
      email,
    },
    data: {
      emailVerified: new Date(),
    },
  });

  revalidatePath("/profile");

  return {
    success: true,
    message: "Email verifie avec succes.",
  };
}
