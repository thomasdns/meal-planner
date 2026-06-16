import "server-only";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import type { MealTypeValue } from "@/features/meal-plans/meal-plan.constants";

export type MealPlanRecipeOption = {
  id: string;
  title: string;
};

export type WeekDay = {
  date: string;
  label: string;
};

export type PlannedMeal = {
  id: string;
  date: string;
  mealType: MealTypeValue;
  recipe: {
    id: string;
    title: string;
    categoryName: string | null;
  };
};

export type WeeklyMealPlan = {
  days: WeekDay[];
  meals: PlannedMeal[];
};

export async function getCurrentUserRecipeOptions(): Promise<
  MealPlanRecipeOption[]
> {
  const user = await requireUser();

  return prisma.recipe.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      title: "asc",
    },
    select: {
      id: true,
      title: true,
    },
  });
}

export async function getCurrentUserWeeklyMealPlan(): Promise<WeeklyMealPlan> {
  const user = await requireUser();
  const days = getCurrentWeekDays();
  const startDate = dateStringToUtcDate(days[0].date);
  const endDate = dateStringToUtcDate(days[days.length - 1].date);
  endDate.setUTCDate(endDate.getUTCDate() + 1);

  const mealPlans = await prisma.mealPlan.findMany({
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
          category: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  return {
    days,
    meals: mealPlans.map((mealPlan) => ({
      id: mealPlan.id,
      date: dateToDateInputValue(mealPlan.date),
      mealType: mealPlan.mealType,
      recipe: {
        id: mealPlan.recipe.id,
        title: mealPlan.recipe.title,
        categoryName: mealPlan.recipe.category?.name ?? null,
      },
    })),
  };
}

export async function upsertMealPlanForCurrentUser(input: {
  date: string;
  mealType: MealTypeValue;
  recipeId: string;
}) {
  const user = await requireUser();
  const date = dateStringToUtcDate(input.date);

  const recipe = await prisma.recipe.findFirst({
    where: {
      id: input.recipeId,
      userId: user.id,
    },
    select: {
      id: true,
    },
  });

  if (!recipe) {
    throw new Error("Recipe not found");
  }

  await prisma.mealPlan.upsert({
    where: {
      userId_date_mealType: {
        userId: user.id,
        date,
        mealType: input.mealType,
      },
    },
    create: {
      userId: user.id,
      date,
      mealType: input.mealType,
      recipeId: recipe.id,
    },
    update: {
      recipeId: recipe.id,
    },
  });
}

export function getCurrentWeekDays(): WeekDay[] {
  const today = new Date();
  const utcToday = new Date(
    Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()),
  );
  const day = utcToday.getUTCDay();
  const daysSinceMonday = day === 0 ? 6 : day - 1;
  const monday = new Date(utcToday);
  monday.setUTCDate(utcToday.getUTCDate() - daysSinceMonday);

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(monday);
    date.setUTCDate(monday.getUTCDate() + index);

    return {
      date: dateToDateInputValue(date),
      label: formatWeekDayLabel(date),
    };
  });
}

export function dateStringToUtcDate(value: string) {
  return new Date(`${value}T00:00:00.000Z`);
}

export function dateToDateInputValue(date: Date) {
  return date.toISOString().slice(0, 10);
}

function formatWeekDayLabel(date: Date) {
  return new Intl.DateTimeFormat("fr-FR", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
    timeZone: "UTC",
  }).format(date);
}
