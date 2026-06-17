"use server";

import { revalidatePath } from "next/cache";

import {
  deleteCurrentUserAccount,
  updateCurrentUserProfile,
} from "@/features/profile/profile.data";
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
