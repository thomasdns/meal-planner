"use server";

import { revalidatePath } from "next/cache";

import {
  deleteCurrentUserAccount,
  getCurrentUserProfile,
  updateCurrentUserProfile,
} from "@/features/profile/profile.data";
import { createEmailVerificationLink } from "@/features/auth/email-verification.actions";
import { sendEmailVerificationEmail } from "@/lib/email";
import { checkRateLimit } from "@/lib/rate-limit";
import {
  deleteAccountSchema,
  updateProfileSchema,
} from "@/features/profile/profile.validation";

export type UpdateProfileState = {
  error?: string;
  success?: string;
};

export type DeleteAccountState = {
  error?: string;
  success?: boolean;
};

export type ResendVerificationEmailState = {
  error?: string;
  success?: string;
};

export async function updateProfileAction(
  _previousState: UpdateProfileState,
  formData: FormData,
): Promise<UpdateProfileState> {
  const parsed = updateProfileSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
  });

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Donnees invalides.",
    };
  }

  try {
    await updateCurrentUserProfile(parsed.data);
  } catch {
    return {
      error: "Cette adresse email est deja utilisee.",
    };
  }

  revalidatePath("/profile");
  revalidatePath("/dashboard");

  return {
    success: "Profil mis a jour.",
  };
}

export async function deleteAccountAction(
  _previousState: DeleteAccountState,
  formData: FormData,
): Promise<DeleteAccountState> {
  const parsed = deleteAccountSchema.safeParse({
    confirmation: formData.get("confirmation"),
  });

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Confirmation invalide.",
      success: false,
    };
  }

  await deleteCurrentUserAccount();

  return {
    success: true,
  };
}

export async function resendVerificationEmailAction(
  _previousState: ResendVerificationEmailState,
): Promise<ResendVerificationEmailState> {
  void _previousState;

  const profile = await getCurrentUserProfile();

  if (!profile.email) {
    return {
      error: "Aucune adresse email n'est associee a ce compte.",
    };
  }

  if (profile.emailVerified) {
    return {
      success: "Cette adresse email est deja verifiee.",
    };
  }

  const rateLimit = checkRateLimit(`verify-email:${profile.email}`, {
    limit: 3,
    windowMs: 60 * 60 * 1000,
  });

  if (!rateLimit.allowed) {
    return {
      error: "Trop de demandes. Reessaie plus tard.",
    };
  }

  const verificationLink = await createEmailVerificationLink(profile.email);
  const emailResult = await sendEmailVerificationEmail(
    profile.email,
    verificationLink,
  );

  if (!emailResult.delivered) {
    return {
      error: "Impossible d'envoyer l'email de verification pour le moment.",
    };
  }

  return {
    success: "Email de verification renvoye.",
  };
}
