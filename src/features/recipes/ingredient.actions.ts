"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  createIngredientSchema,
  updateIngredientSchema,
} from "@/features/recipes/ingredient.validation";
import {
  createIngredientForCurrentUserRecipe,
  deleteIngredientForCurrentUser,
  updateIngredientForCurrentUser,
} from "@/features/recipes/recipes.data";
import { logError } from "@/lib/logger";

export type CreateIngredientState = {
  error?: string;
  success?: string;
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
  } catch (error) {
    await logError("server_action_failed", error, {
      action: "createIngredient",
      recipeId,
    });
    return {
      error: "Impossible d'ajouter cet ingredient a cette recette.",
    };
  }

  revalidatePath("/recipes");
  revalidatePath(`/recipes/${recipeId}`);
  redirect(`/recipes/${recipeId}?status=ingredient-created`);
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

  let recipeId: string;

  try {
    recipeId = await updateIngredientForCurrentUser(
      ingredientId,
      parsed.data,
    );

    revalidatePath(`/recipes/${recipeId}`);
    revalidatePath("/recipes");
    revalidatePath("/shopping-list");
    revalidatePath("/dashboard");
  } catch (error) {
    await logError("server_action_failed", error, {
      action: "updateIngredient",
      ingredientId,
    });
    return {
      error: "Impossible de modifier cet ingredient.",
    };
  }

  redirect(`/recipes/${recipeId}?status=ingredient-updated`);
}

export async function deleteIngredientAction(ingredientId: string) {
  let recipeId: string;

  try {
    recipeId = await deleteIngredientForCurrentUser(ingredientId);

    revalidatePath(`/recipes/${recipeId}`);
    revalidatePath("/recipes");
    revalidatePath("/shopping-list");
    revalidatePath("/dashboard");
  } catch (error) {
    await logError("server_action_failed", error, {
      action: "deleteIngredient",
      ingredientId,
    });
    return;
  }

  redirect(`/recipes/${recipeId}`);
}
