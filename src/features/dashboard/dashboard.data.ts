import "server-only";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { mealTypeLabels } from "@/features/meal-plans/meal-plan.constants";
import {
  dateStringToUtcDate,
  dateToDateInputValue,
  getCurrentWeekDays,
} from "@/features/meal-plans/meal-plans.data";
import { getCurrentUserWeeklyShoppingList } from "@/features/shopping-list/shopping-list.data";

export type DashboardSummary = {
  recipesCount: number;
  plannedMealsCount: number;
  shoppingItemsCount: number;
  categoriesCount: number;
};

export type UpcomingMeal = {
  id: string;
  date: string;
  dateLabel: string;
  mealTypeLabel: string;
  recipe: {
    id: string;
    title: string;
  };
};

export type DashboardData = {
  summary: DashboardSummary;
  upcomingMeals: UpcomingMeal[];
};

export async function getCurrentUserDashboardData(): Promise<DashboardData> {
  const user = await requireUser();
  const weekDays = getCurrentWeekDays();
  const startDate = dateStringToUtcDate(weekDays[0].date);
  const endDate = dateStringToUtcDate(weekDays[weekDays.length - 1].date);
  endDate.setUTCDate(endDate.getUTCDate() + 1);

  const [recipesCount, categoriesCount, plannedMeals, shoppingList] =
    await Promise.all([
      prisma.recipe.count({
        where: {
          userId: user.id,
        },
      }),
      prisma.category.count({
        where: {
          userId: user.id,
        },
      }),
      prisma.mealPlan.findMany({
        where: {
          userId: user.id,
          date: {
            gte: startDate,
            lt: endDate,
          },
        },
        orderBy: [{ date: "asc" }, { mealType: "asc" }],
        select: {
          id: true,
          date: true,
          mealType: true,
          recipe: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      }),
      getCurrentUserWeeklyShoppingList(),
    ]);

  return {
    summary: {
      recipesCount,
      categoriesCount,
      plannedMealsCount: plannedMeals.length,
      shoppingItemsCount: shoppingList.items.length,
    },
    upcomingMeals: plannedMeals.slice(0, 5).map((meal) => ({
      id: meal.id,
      date: dateToDateInputValue(meal.date),
      dateLabel: formatDashboardDate(meal.date),
      mealTypeLabel: mealTypeLabels[meal.mealType],
      recipe: {
        id: meal.recipe.id,
        title: meal.recipe.title,
      },
    })),
  };
}

function formatDashboardDate(date: Date) {
  return new Intl.DateTimeFormat("fr-FR", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
    timeZone: "UTC",
  }).format(date);
}
