import "server-only";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import {
  dateStringToUtcDate,
  dateToDateInputValue,
  getCurrentWeekDays,
} from "@/features/meal-plans/meal-plans.data";
import {
  aggregateShoppingListItems,
  type ShoppingListItemView,
} from "@/features/shopping-list/shopping-list.utils";

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

  const items = aggregateShoppingListItems(
    plannedMeals.flatMap((meal) =>
      meal.recipe.ingredients.map((ingredient) => ({
        recipeTitle: meal.recipe.title,
        ingredient,
      })),
    ),
  );

  return {
    startDate: days[0].date,
    endDate: dateToDateInputValue(new Date(endDate.getTime() - 1)),
    items,
  };
}
