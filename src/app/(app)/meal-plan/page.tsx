import Link from "next/link";

import { ActionMessage } from "@/components/ui/action-message";
import { MealPlanForm } from "@/features/meal-plans/meal-plan-form";
import { WeeklyMealPlan } from "@/features/meal-plans/weekly-meal-plan";
import {
  getCurrentUserRecipeOptions,
  getCurrentUserWeeklyMealPlan,
} from "@/features/meal-plans/meal-plans.data";

export const metadata = { title: "Planning hebdomadaire" };

type MealPlanPageProps = {
  searchParams: Promise<{
    week?: string;
    status?: string;
  }>;
};

export default async function MealPlanPage({
  searchParams,
}: MealPlanPageProps) {
  const { week, status } = await searchParams;
  const [weeklyMealPlan, recipes] = await Promise.all([
    getCurrentUserWeeklyMealPlan(week),
    getCurrentUserRecipeOptions(),
  ]);

  return (
    <div className="grid min-w-0 gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
      <div className="min-w-0 space-y-6">
        {status === "planned" ? (
          <ActionMessage tone="success">Repas planifie.</ActionMessage>
        ) : null}
        {status === "removed" ? (
          <ActionMessage tone="success">Repas retire du planning.</ActionMessage>
        ) : null}
        <div className="space-y-2">
          <p className="text-sm font-medium text-emerald-700">Organisation</p>
          <h1 className="text-3xl font-semibold tracking-tight break-words">
            Planning hebdomadaire
          </h1>
          <p className="max-w-2xl text-sm text-slate-600">
            Associe une recette a un jour et a un type de repas pour construire
            ta semaine.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3 lg:flex lg:flex-wrap lg:items-center">
          <Link
            href={`/meal-plan?week=${weeklyMealPlan.previousWeekStartDate}`}
            className="button-secondary px-3"
          >
            Semaine precedente
          </Link>
          <Link
            href={`/meal-plan?week=${weeklyMealPlan.currentWeekStartDate}`}
            className="inline-flex justify-center rounded-md bg-emerald-700 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-800"
          >
            Semaine actuelle
          </Link>
          <Link
            href={`/meal-plan?week=${weeklyMealPlan.nextWeekStartDate}`}
            className="button-secondary px-3"
          >
            Semaine suivante
          </Link>
          <p className="text-sm text-slate-600 sm:col-span-3 lg:col-span-1">
            Du {formatDate(weeklyMealPlan.startDate)} au{" "}
            {formatDate(weeklyMealPlan.endDate)}
          </p>
        </div>

        <div className="min-w-0">
          <WeeklyMealPlan
            days={weeklyMealPlan.days}
            meals={weeklyMealPlan.meals}
          />
        </div>
      </div>

      <aside className="min-w-0">
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
