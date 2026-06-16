import { z } from "zod";

import { mealTypes } from "@/features/meal-plans/meal-plan.constants";

export const upsertMealPlanSchema = z.object({
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "La date est invalide."),
  mealType: z.enum(mealTypes, "Le type de repas est invalide."),
  recipeId: z.string().cuid("La recette selectionnee est invalide."),
});

export type UpsertMealPlanInput = z.infer<typeof upsertMealPlanSchema>;
