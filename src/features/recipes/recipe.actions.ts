"use server";

import { revalidatePath } from "next/cache";

import { createRecipeSchema } from "@/features/recipes/recipe.validation";
import { createRecipeForCurrentUser } from "@/features/recipes/recipes.data";

export type CreateRecipeState = {
  error?: string;
};

export async function createRecipeAction(
  _previousState: CreateRecipeState,
  formData: FormData,
): Promise<CreateRecipeState> {
  const parsed = createRecipeSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    servings: formData.get("servings"),
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
