"use server";

import { resendEmailVerificationSchema } from "@/features/auth/auth.validation";
import {
  authTokenPurpose,
  consumeAuthToken,
  createAppUrl,
  createAuthToken,
  createAuthTokenIdentifier,
} from "@/lib/auth-tokens";
import { authTokenPolicy } from "@/lib/auth-token-policy";
import { sendEmailVerificationEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rate-limit";

export type ResendEmailVerificationState = {
  error?: string;
  success?: string;
};

export async function resendEmailVerificationAction(
  _previousState: ResendEmailVerificationState,
  formData: FormData,
): Promise<ResendEmailVerificationState> {
  const parsed = resendEmailVerificationSchema.safeParse({
    email: formData.get("email"),
  });

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Email invalide.",
    };
  }

  const rateLimit = await checkRateLimit(
    `verify-email:${parsed.data.email}`,
    {
      limit: 3,
      windowMs: 60 * 60 * 1000,
    },
  );

  if (!rateLimit.allowed) {
    return {
      error: "Trop de demandes. Reessaie plus tard.",
    };
  }

  const user = await prisma.user.findUnique({
    where: {
      email: parsed.data.email,
    },
    select: {
      email: true,
      emailVerified: true,
    },
  });

  if (user && !user.emailVerified) {
    const verificationLink = await createEmailVerificationLink(user.email);
    await sendEmailVerificationEmail(user.email, verificationLink);
  }

  return {
    success:
      "Si un compte non verifie existe avec cet email, un nouveau lien valable 24 heures a ete envoye.",
  };
}

export async function createEmailVerificationLink(email: string) {
  const token = await createAuthToken(
    createAuthTokenIdentifier(authTokenPurpose.emailVerification, email),
    authTokenPolicy.emailVerification.ttlMs,
  );

  return createAppUrl(`/auth/verify-email/confirm?token=${token}`);
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

  return {
    success: true,
    message: "Email verifie avec succes.",
  };
}
