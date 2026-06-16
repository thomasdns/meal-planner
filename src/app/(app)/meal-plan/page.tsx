import { MealPlanForm } from "@/features/meal-plans/meal-plan-form";
import { WeeklyMealPlan } from "@/features/meal-plans/weekly-meal-plan";
import {
  getCurrentUserRecipeOptions,
  getCurrentUserWeeklyMealPlan,
} from "@/features/meal-plans/meal-plans.data";

export default async function MealPlanPage() {
  const [weeklyMealPlan, recipes] = await Promise.all([
    getCurrentUserWeeklyMealPlan(),
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
