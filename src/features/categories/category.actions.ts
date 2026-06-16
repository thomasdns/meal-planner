"use server";

import { revalidatePath } from "next/cache";

import {
  createCategorySchema,
  updateCategorySchema,
} from "@/features/categories/category.validation";
import {
  createCategoryForCurrentUser,
  deleteCategoryForCurrentUser,
  updateCategoryForCurrentUser,
} from "@/features/categories/categories.data";

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
  } catch {
    return {
      error: "Une categorie avec ce nom existe deja.",
    };
  }

  revalidatePath("/recipes");

  return {};
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
  } catch {
    return {
      error: "Impossible de modifier cette categorie.",
    };
  }

  revalidatePath("/recipes");
  revalidatePath("/meal-plan");
  revalidatePath("/shopping-list");
  revalidatePath("/dashboard");

  return {
    success: "Categorie mise a jour.",
  };
}

export async function deleteCategoryAction(categoryId: string) {
  try {
    await deleteCategoryForCurrentUser(categoryId);
  } catch {
    return;
  }

  revalidatePath("/recipes");
  revalidatePath("/meal-plan");
  revalidatePath("/shopping-list");
  revalidatePath("/dashboard");
}
