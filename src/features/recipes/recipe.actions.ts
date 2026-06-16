"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  createRecipeSchema,
  updateRecipeSchema,
} from "@/features/recipes/recipe.validation";
import {
  createRecipeForCurrentUser,
  deleteRecipeForCurrentUser,
  updateRecipeForCurrentUser,
} from "@/features/recipes/recipes.data";

export type CreateRecipeState = {
  error?: string;
  success?: string;
};

export type UpdateRecipeState = {
  error?: string;
  success?: string;
};

export async function createRecipeAction(
  _previousState: CreateRecipeState,
  formData: FormData,
): Promise<CreateRecipeState> {
  const parsed = createRecipeSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    servings: formData.get("servings"),
    prepTime: formData.get("prepTime"),
    cookTime: formData.get("cookTime"),
    steps: formData.get("steps"),
    categoryId: formData.get("categoryId"),
  });

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Donnees invalides.",
    };
  }

  try {
    await createRecipeForCurrentUser(parsed.data);
  } catch {
    return {
      error: "Impossible de creer la recette avec cette categorie.",
    };
  }

  revalidatePath("/recipes");

  return {};
}

export async function updateRecipeAction(
  recipeId: string,
  _previousState: UpdateRecipeState,
  formData: FormData,
): Promise<UpdateRecipeState> {
  const parsed = updateRecipeSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    servings: formData.get("servings"),
    prepTime: formData.get("prepTime"),
    cookTime: formData.get("cookTime"),
    steps: formData.get("steps"),
    categoryId: formData.get("categoryId"),
  });

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Donnees invalides.",
    };
  }

  try {
    await updateRecipeForCurrentUser(recipeId, parsed.data);
  } catch {
    return {
      error: "Impossible de modifier cette recette.",
    };
  }

  revalidatePath("/recipes");
  revalidatePath(`/recipes/${recipeId}`);

  return {
    success: "Recette mise a jour.",
  };
}

export async function deleteRecipeAction(recipeId: string) {
  try {
    await deleteRecipeForCurrentUser(recipeId);
  } catch {
    return;
  }

  revalidatePath("/recipes");
  revalidatePath("/meal-plan");
  revalidatePath("/shopping-list");
  revalidatePath("/dashboard");

  redirect("/recipes");
}
