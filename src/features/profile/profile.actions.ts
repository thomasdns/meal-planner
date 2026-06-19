"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  deleteCurrentUserAccount,
  updateCurrentUserProfile,
  validateCurrentUserProfileUpdate,
} from "@/features/profile/profile.data";
import { createEmailVerificationLink } from "@/features/auth/email-verification.actions";
import { sendEmailVerificationEmail } from "@/lib/email";
import { logError } from "@/lib/logger";
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

  let updateContext: Awaited<
    ReturnType<typeof validateCurrentUserProfileUpdate>
  >;

  try {
    updateContext = await validateCurrentUserProfileUpdate(parsed.data);
  } catch (error) {
    await logError("server_action_failed", error, {
      action: "validateProfileUpdate",
    });
    return {
      error: "Cette adresse email est deja utilisee.",
    };
  }

  if (updateContext.hasEmailChanged) {
    const verificationLink = await createEmailVerificationLink(
      parsed.data.email,
    );
    const emailResult = await sendEmailVerificationEmail(
      parsed.data.email,
      verificationLink,
    );

    if (!emailResult.delivered) {
      return {
        error:
          "Impossible d'envoyer le lien de verification. Ton profil n'a pas ete modifie.",
      };
    }
  }

  try {
    await updateCurrentUserProfile(
      updateContext.userId,
      parsed.data,
      updateContext.hasEmailChanged,
    );
  } catch (error) {
    await logError("server_action_failed", error, {
      action: "updateProfile",
      userId: updateContext.userId,
    });
    return {
      error: "Impossible de mettre a jour le profil.",
    };
  }

  revalidatePath("/profile");
  revalidatePath("/dashboard");

  if (updateContext.hasEmailChanged) {
    redirect("/auth/sign-in?emailChanged=1");
  }

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
