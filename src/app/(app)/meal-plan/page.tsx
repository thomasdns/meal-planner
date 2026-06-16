import Link from "next/link";

import { MealPlanForm } from "@/features/meal-plans/meal-plan-form";
import { WeeklyMealPlan } from "@/features/meal-plans/weekly-meal-plan";
import {
  getCurrentUserRecipeOptions,
  getCurrentUserWeeklyMealPlan,
} from "@/features/meal-plans/meal-plans.data";

type MealPlanPageProps = {
  searchParams: Promise<{
    week?: string;
  }>;
};

export default async function MealPlanPage({
  searchParams,
}: MealPlanPageProps) {
  const { week } = await searchParams;
  const [weeklyMealPlan, recipes] = await Promise.all([
    getCurrentUserWeeklyMealPlan(week),
    getCurrentUserRecipeOptions(),
  ]);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <div className="space-y-6">
        <div className="space-y-2">
          <p className="text-sm font-medium text-emerald-700">Organisation</p>
          <h1 className="text-3xl font-semibold tracking-tight">
            Planning hebdomadaire
          </h1>
          <p className="max-w-2xl text-sm text-slate-600">
            Associe une recette a un jour et a un type de repas pour construire
            ta semaine.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href={`/meal-plan?week=${weeklyMealPlan.previousWeekStartDate}`}
            className="inline-flex rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-100"
          >
            Semaine precedente
          </Link>
          <Link
            href={`/meal-plan?week=${weeklyMealPlan.currentWeekStartDate}`}
            className="inline-flex rounded-md bg-emerald-700 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-800"
          >
            Semaine actuelle
          </Link>
          <Link
            href={`/meal-plan?week=${weeklyMealPlan.nextWeekStartDate}`}
            className="inline-flex rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-100"
          >
            Semaine suivante
          </Link>
          <p className="text-sm text-slate-600">
            Du {formatDate(weeklyMealPlan.startDate)} au{" "}
            {formatDate(weeklyMealPlan.endDate)}
          </p>
        </div>

        <div className="overflow-x-auto">
          <WeeklyMealPlan
            days={weeklyMealPlan.days}
            meals={weeklyMealPlan.meals}
          />
        </div>
      </div>

      <aside>
        <MealPlanForm days={weeklyMealPlan.days} recipes={recipes} />
      </aside>
    </div>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00.000Z`));
}
