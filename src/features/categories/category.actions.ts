"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  createCategorySchema,
  updateCategorySchema,
} from "@/features/categories/category.validation";
import {
  createCategoryForCurrentUser,
  deleteCategoryForCurrentUser,
  updateCategoryForCurrentUser,
} from "@/features/categories/categories.data";
import { logError } from "@/lib/logger";

export type CreateCategoryState = {
  error?: string;
};

export type UpdateCategoryState = {
  error?: string;
  success?: string;
};

export async function createCategoryAction(
  _previousState: CreateCategoryState,
  formData: FormData,
): Promise<CreateCategoryState> {
  const parsed = createCategorySchema.safeParse({
    name: formData.get("name"),
    color: formData.get("color"),
  });

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Donnees invalides.",
    };
  }

  try {
    await createCategoryForCurrentUser(parsed.data);
  } catch (error) {
    await logError("server_action_failed", error, {
      action: "createCategory",
    });
    return {
      error: "Une categorie avec ce nom existe deja.",
    };
  }

  revalidatePath("/recipes");

  redirect("/recipes?status=category-created");
}

export async function updateCategoryAction(
  categoryId: string,
  _previousState: UpdateCategoryState,
  formData: FormData,
): Promise<UpdateCategoryState> {
  const parsed = updateCategorySchema.safeParse({
    name: formData.get("name"),
    color: formData.get("color"),
  });

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Donnees invalides.",
    };
  }

  try {
    await updateCategoryForCurrentUser(categoryId, parsed.data);
  } catch (error) {
    await logError("server_action_failed", error, {
      action: "updateCategory",
      categoryId,
    });
    return {
      error: "Impossible de modifier cette categorie.",
    };
  }

  revalidatePath("/recipes");
  revalidatePath("/meal-plan");
  revalidatePath("/shopping-list");
  revalidatePath("/dashboard");

  redirect("/recipes?status=category-updated");
}

export async function deleteCategoryAction(categoryId: string) {
  try {
    await deleteCategoryForCurrentUser(categoryId);
  } catch (error) {
    await logError("server_action_failed", error, {
      action: "deleteCategory",
      categoryId,
    });
    return;
  }

  revalidatePath("/recipes");
  revalidatePath("/meal-plan");
  revalidatePath("/shopping-list");
  revalidatePath("/dashboard");

  redirect("/recipes?status=category-deleted");
}
