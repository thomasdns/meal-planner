export const mealTypes = ["BREAKFAST", "LUNCH", "DINNER", "SNACK"] as const;

export type MealTypeValue = (typeof mealTypes)[number];

export const mealTypeLabels: Record<MealTypeValue, string> = {
  BREAKFAST: "Petit-dejeuner",
  LUNCH: "Dejeuner",
  DINNER: "Diner",
  SNACK: "Collation",
};
