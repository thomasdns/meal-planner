"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { updateAdminUserSchema } from "@/features/admin/admin.validation";
import {
  deleteUserAsAdmin,
  updateUserAsAdmin,
  validateUserUpdateAsAdmin,
} from "@/features/admin/admin.data";
import { createEmailVerificationLink } from "@/features/auth/email-verification.actions";
import { sendEmailVerificationEmail } from "@/lib/email";
import { logError } from "@/lib/logger";

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

  let updateContext: Awaited<ReturnType<typeof validateUserUpdateAsAdmin>>;

  try {
    updateContext = await validateUserUpdateAsAdmin(userId, parsed.data);
  } catch (error) {
    await logError("server_action_failed", error, {
      action: "validateAdminUserUpdate",
      userId,
    });
    return {
      error: "Impossible de mettre a jour cet utilisateur.",
    };
  }

  if (updateContext.emailChanged) {
    const verificationLink = await createEmailVerificationLink(
      updateContext.input.email,
    );
    const emailResult = await sendEmailVerificationEmail(
      updateContext.input.email,
      verificationLink,
    );

    if (!emailResult.delivered) {
      return {
        error:
          "Impossible d'envoyer le lien de verification. L'utilisateur n'a pas ete modifie.",
      };
    }
  }

  try {
    await updateUserAsAdmin(
      userId,
      updateContext.input,
      updateContext.emailChanged,
      updateContext.securityChanged,
    );
  } catch (error) {
    await logError("server_action_failed", error, {
      action: "updateAdminUser",
      userId,
    });
    return {
      error: "Impossible de mettre a jour cet utilisateur.",
    };
  }

  revalidatePath("/admin");

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
  } catch (error) {
    await logError("server_action_failed", error, {
      action: "deleteAdminUser",
      userId,
    });
    return {
      error: "Impossible de supprimer cet utilisateur.",
    };
  }

  revalidatePath("/admin");
  redirect("/admin");
}
