"use server";

import { revalidatePath } from "next/cache";

import { createIngredientSchema } from "@/features/recipes/ingredient.validation";
import { createIngredientForCurrentUserRecipe } from "@/features/recipes/recipes.data";

export type CreateIngredientState = {
  error?: string;
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
