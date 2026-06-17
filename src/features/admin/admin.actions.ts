"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { updateAdminUserSchema } from "@/features/admin/admin.validation";
import { deleteUserAsAdmin, updateUserAsAdmin } from "@/features/admin/admin.data";

export type UpdateAdminUserState = {
  error?: string;
  success?: string;
};

export type DeleteAdminUserState = {
  error?: string;
};

export async function updateAdminUserAction(
  userId: string,
  _previousState: UpdateAdminUserState,
  formData: FormData,
): Promise<UpdateAdminUserState> {
  const parsed = updateAdminUserSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    role: formData.get("role"),
  });

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Donnees invalides.",
    };
  }

  try {
    await updateUserAsAdmin(userId, parsed.data);
  } catch {
    return {
      error: "Impossible de mettre a jour cet utilisateur.",
    };
  }

  revalidatePath("/admin");
  revalidatePath(`/admin/users/${userId}`);

  return {
    success: "Utilisateur mis a jour.",
  };
}

export async function deleteAdminUserAction(
  userId: string,
  _previousState: DeleteAdminUserState,
): Promise<DeleteAdminUserState> {
  void _previousState;

  try {
    await deleteUserAsAdmin(userId);
  } catch {
    return {
      error: "Impossible de supprimer cet utilisateur.",
    };
  }

  revalidatePath("/admin");
  redirect("/admin");
}
