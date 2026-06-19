"use server";

import { upsertMealPlanSchema } from "@/features/meal-plans/meal-plan.validation";
import {
  deleteMealPlanForCurrentUser,
  upsertMealPlanForCurrentUser,
} from "@/features/meal-plans/meal-plans.data";
import { logError } from "@/lib/logger";

export type UpsertMealPlanState = {
  error?: string;
  success?: string;
  redirectTo?: string;
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
  } catch (error) {
    await logError("server_action_failed", error, {
      action: "upsertMealPlan",
    });
    return {
      error: "Impossible de planifier cette recette.",
    };
  }

  return {
    success: "Repas planifie.",
    redirectTo: `/meal-plan?week=${parsed.data.date}&status=planned`,
  };
}

export async function deleteMealPlanAction(mealPlanId: string) {
  try {
    await deleteMealPlanForCurrentUser(mealPlanId);
  } catch (error) {
    await logError("server_action_failed", error, {
      action: "deleteMealPlan",
      mealPlanId,
    });
    return;
  }

  return { success: true as const };
}
