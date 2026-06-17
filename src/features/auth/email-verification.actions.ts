"use server";

import { revalidatePath } from "next/cache";

import {
  authTokenPurpose,
  canExposeAuthLinks,
  consumeAuthToken,
  createAppUrl,
  createAuthToken,
  createAuthTokenIdentifier,
} from "@/lib/auth-tokens";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rate-limit";
import { requireUser } from "@/lib/session";

const emailVerificationTokenTtlMs = 24 * 60 * 60 * 1000;

export type RequestEmailVerificationState = {
  error?: string;
  success?: string;
  verificationLink?: string;
};

export async function requestEmailVerificationAction(
  _previousState: RequestEmailVerificationState,
): Promise<RequestEmailVerificationState> {
  void _previousState;

  const currentUser = await requireUser();

  if (!currentUser.email) {
    return {
      error: "Aucun email n'est associe a ce compte.",
    };
  }

  const rateLimit = checkRateLimit(`email-verification:${currentUser.id}`, {
    limit: 5,
    windowMs: 60 * 60 * 1000,
  });

  if (!rateLimit.allowed) {
    return {
      error: "Trop de demandes. Reessaie plus tard.",
    };
  }

  const user = await prisma.user.findUnique({
    where: {
      id: currentUser.id,
    },
    select: {
      email: true,
      emailVerified: true,
    },
  });

  if (!user) {
    return {
      error: "Compte introuvable.",
    };
  }

  if (user.emailVerified) {
    return {
      success: "Ton email est deja verifie.",
    };
  }

  const token = await createAuthToken(
    createAuthTokenIdentifier(authTokenPurpose.emailVerification, user.email),
    emailVerificationTokenTtlMs,
  );
  const verificationLink = createAppUrl(`/auth/verify-email?token=${token}`);

  console.info(`Email verification link for ${user.email}: ${verificationLink}`);

  return {
    success: "Lien de verification genere.",
    verificationLink: canExposeAuthLinks() ? verificationLink : undefined,
  };
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
