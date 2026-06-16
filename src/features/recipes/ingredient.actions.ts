"use server";

import { revalidatePath } from "next/cache";

import {
  createIngredientSchema,
  updateIngredientSchema,
} from "@/features/recipes/ingredient.validation";
import {
  createIngredientForCurrentUserRecipe,
  deleteIngredientForCurrentUser,
  updateIngredientForCurrentUser,
} from "@/features/recipes/recipes.data";

export type CreateIngredientState = {
  error?: string;
};

export type UpdateIngredientState = {
  error?: string;
  success?: string;
};

export async function createIngredientAction(
  recipeId: string,
  _previousState: CreateIngredientState,
  formData: FormData,
): Promise<CreateIngredientState> {
  const parsed = createIngredientSchema.safeParse({
    name: formData.get("name"),
    quantity: formData.get("quantity"),
    unit: formData.get("unit"),
  });

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Donnees invalides.",
    };
  }

  try {
    await createIngredientForCurrentUserRecipe(recipeId, parsed.data);
  } catch {
    return {
      error: "Impossible d'ajouter cet ingredient a cette recette.",
    };
  }

  revalidatePath(`/recipes/${recipeId}`);
  revalidatePath("/recipes");

  return {};
}

export async function updateIngredientAction(
  ingredientId: string,
  _previousState: UpdateIngredientState,
  formData: FormData,
): Promise<UpdateIngredientState> {
  const parsed = updateIngredientSchema.safeParse({
    name: formData.get("name"),
    quantity: formData.get("quantity"),
    unit: formData.get("unit"),
  });

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Donnees invalides.",
    };
  }

  try {
    const recipeId = await updateIngredientForCurrentUser(
      ingredientId,
      parsed.data,
    );

    revalidatePath(`/recipes/${recipeId}`);
    revalidatePath("/recipes");
    revalidatePath("/shopping-list");
    revalidatePath("/dashboard");
  } catch {
    return {
      error: "Impossible de modifier cet ingredient.",
    };
  }

  return {
    success: "Ingredient mis a jour.",
  };
}

export async function deleteIngredientAction(ingredientId: string) {
  try {
    const recipeId = await deleteIngredientForCurrentUser(ingredientId);

    revalidatePath(`/recipes/${recipeId}`);
    revalidatePath("/recipes");
    revalidatePath("/shopping-list");
    revalidatePath("/dashboard");
  } catch {
    return;
  }
}
