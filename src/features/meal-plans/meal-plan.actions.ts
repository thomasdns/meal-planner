"use server";

import { revalidatePath } from "next/cache";

import { upsertMealPlanSchema } from "@/features/meal-plans/meal-plan.validation";
import { upsertMealPlanForCurrentUser } from "@/features/meal-plans/meal-plans.data";

export type UpsertMealPlanState = {
  error?: string;
};

export async function upsertMealPlanAction(
  _previousState: UpsertMealPlanState,
  formData: FormData,
): Promise<UpsertMealPlanState> {
  const parsed = upsertMealPlanSchema.safeParse({
    date: formData.get("date"),
    mealType: formData.get("mealType"),
    recipeId: formData.get("recipeId"),
  });

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Donnees invalides.",
    };
  }

  try {
    await upsertMealPlanForCurrentUser(parsed.data);
  } catch {
    return {
      error: "Impossible de planifier cette recette.",
    };
  }

  revalidatePath("/meal-plan");

  return {};
}
