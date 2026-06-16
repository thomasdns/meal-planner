"use server";

import { revalidatePath } from "next/cache";

import { updateCurrentUserProfile } from "@/features/profile/profile.data";
import { updateProfileSchema } from "@/features/profile/profile.validation";

export type UpdateProfileState = {
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
