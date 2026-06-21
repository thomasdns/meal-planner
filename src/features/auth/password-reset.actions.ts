"use server";

import bcrypt from "bcryptjs";

import {
  forgotPasswordSchema,
  resetPasswordSchema,
} from "@/features/auth/auth.validation";
import {
  authTokenPurpose,
  canExposeAuthLinks,
  consumeAuthToken,
  createAppUrl,
  createAuthToken,
  createAuthTokenIdentifier,
} from "@/lib/auth-tokens";
import { authTokenPolicy } from "@/lib/auth-token-policy";
import { sendPasswordResetEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rate-limit";

export type ForgotPasswordState = {
  error?: string;
  success?: string;
  resetLink?: string;
};

export type ResetPasswordState = {
  error?: string;
  success?: string;
};

export async function requestPasswordResetAction(
  _previousState: ForgotPasswordState,
  formData: FormData,
): Promise<ForgotPasswordState> {
  const parsed = forgotPasswordSchema.safeParse({
    email: formData.get("email"),
  });

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Email invalide.",
    };
  }

  const rateLimit = await checkRateLimit(`password-reset:${parsed.data.email}`, {
    limit: 3,
    windowMs: 60 * 60 * 1000,
  });

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
    },
  });

  let resetLink: string | undefined;

  if (user) {
    const token = await createAuthToken(
      createAuthTokenIdentifier(authTokenPurpose.passwordReset, user.email),
      authTokenPolicy.passwordReset.ttlMs,
    );

    resetLink = createAppUrl(`/auth/reset-password?token=${token}`);
    const emailResult = await sendPasswordResetEmail(user.email, resetLink);

    if (!emailResult.delivered) {
      return {
        error:
          "Impossible d'envoyer l'email de reinitialisation pour le moment.",
      };
    }
  }

  return {
    success:
      "Si un compte existe avec cet email, un lien de reinitialisation valable 30 minutes a ete envoye.",
    resetLink: canExposeAuthLinks() ? resetLink : undefined,
  };
}

export async function resetPasswordAction(
  _previousState: ResetPasswordState,
  formData: FormData,
): Promise<ResetPasswordState> {
  const parsed = resetPasswordSchema.safeParse({
    token: formData.get("token"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Donnees invalides.",
    };
  }

  const email = await consumeAuthToken(
    authTokenPurpose.passwordReset,
    parsed.data.token,
  );

  if (!email) {
    return {
      error: "Ce lien de reinitialisation est invalide ou expire.",
    };
  }

  await prisma.user.update({
    where: {
      email,
    },
    data: {
      password: await bcrypt.hash(parsed.data.password, 12),
      sessionVersion: {
        increment: 1,
      },
    },
  });

  return {
    success: "Mot de passe mis a jour. Tu peux maintenant te connecter.",
  };
}
