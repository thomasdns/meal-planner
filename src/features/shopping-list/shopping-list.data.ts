import "server-only";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import {
  dateStringToUtcDate,
  dateToDateInputValue,
  getCurrentWeekDays,
} from "@/features/meal-plans/meal-plans.data";

export type ShoppingListItemView = {
  key: string;
  name: string;
  quantity: number | null;
  unit: string | null;
  recipeTitles: string[];
};

export type WeeklyShoppingList = {
  startDate: string;
  endDate: string;
  items: ShoppingListItemView[];
};

export async function getCurrentUserWeeklyShoppingList(): Promise<WeeklyShoppingList> {
  const user = await requireUser();
  const days = getCurrentWeekDays();
  const startDate = dateStringToUtcDate(days[0].date);
  const endDate = dateStringToUtcDate(days[days.length - 1].date);
  endDate.setUTCDate(endDate.getUTCDate() + 1);

  const plannedMeals = await prisma.mealPlan.findMany({
    where: {
      userId: user.id,
      date: {
        gte: startDate,
        lt: endDate,
      },
    },
    select: {
      recipe: {
        select: {
          title: true,
          ingredients: {
            select: {
              name: true,
              quantity: true,
              unit: true,
            },
          },
        },
      },
    },
  });

  const groupedItems = new Map<string, ShoppingListItemView>();

  for (const meal of plannedMeals) {
    for (const ingredient of meal.recipe.ingredients) {
      const key = getIngredientKey(ingredient.name, ingredient.unit);
      const existingItem = groupedItems.get(key);

      if (existingItem) {
        existingItem.quantity = addQuantities(
          existingItem.quantity,
          ingredient.quantity,
        );
        if (!existingItem.recipeTitles.includes(meal.recipe.title)) {
          existingItem.recipeTitles.push(meal.recipe.title);
        }
        continue;
      }

      groupedItems.set(key, {
        key,
        name: ingredient.name,
        quantity: ingredient.quantity,
        unit: ingredient.unit,
        recipeTitles: [meal.recipe.title],
      });
    }
  }

  return {
    startDate: days[0].date,
    endDate: dateToDateInputValue(new Date(endDate.getTime() - 1)),
    items: Array.from(groupedItems.values()).sort((left, right) =>
      left.name.localeCompare(right.name, "fr-FR"),
    ),
  };
}

function getIngredientKey(name: string, unit: string | null) {
  return `${name.trim().toLowerCase()}::${unit?.trim().toLowerCase() ?? ""}`;
}

function addQuantities(left: number | null, right: number | null) {
  if (left === null || right === null) {
    return left ?? right;
  }

  return left + right;
}
