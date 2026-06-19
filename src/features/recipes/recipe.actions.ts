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
import { logError } from "@/lib/logger";

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
    imageUrl: formData.get("imageUrl"),
    categoryId: formData.get("categoryId"),
  });

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Donnees invalides.",
    };
  }

  try {
    await createRecipeForCurrentUser(parsed.data);
  } catch (error) {
    await logError("server_action_failed", error, {
      action: "createRecipe",
    });
    return {
      error: "Impossible de creer la recette avec cette categorie.",
    };
  }

  revalidatePath("/recipes");
  redirect("/recipes?status=recipe-created");
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
    imageUrl: formData.get("imageUrl"),
    categoryId: formData.get("categoryId"),
  });

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Donnees invalides.",
    };
  }

  try {
    await updateRecipeForCurrentUser(recipeId, parsed.data);
  } catch (error) {
    await logError("server_action_failed", error, {
      action: "updateRecipe",
      recipeId,
    });
    return {
      error: "Impossible de modifier cette recette.",
    };
  }

  revalidatePath("/recipes");
  revalidatePath(`/recipes/${recipeId}`);
  redirect(`/recipes/${recipeId}?status=recipe-updated`);
}

export async function deleteRecipeAction(recipeId: string) {
  try {
    await deleteRecipeForCurrentUser(recipeId);
  } catch (error) {
    await logError("server_action_failed", error, {
      action: "deleteRecipe",
      recipeId,
    });
    return;
  }

  revalidatePath("/recipes");
  revalidatePath("/meal-plan");
  revalidatePath("/shopping-list");
  revalidatePath("/dashboard");

  redirect("/recipes");
}
