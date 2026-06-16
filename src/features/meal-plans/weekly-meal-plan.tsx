import Link from "next/link";

import {
  mealTypeLabels,
  mealTypes,
} from "@/features/meal-plans/meal-plan.constants";
import { DeleteMealPlanForm } from "@/features/meal-plans/delete-meal-plan-form";
import type { PlannedMeal, WeekDay } from "@/features/meal-plans/meal-plans.data";

type WeeklyMealPlanProps = {
  days: WeekDay[];
  meals: PlannedMeal[];
};

export function WeeklyMealPlan({ days, meals }: WeeklyMealPlanProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <div className="grid min-w-[760px] grid-cols-[150px_repeat(7,minmax(120px,1fr))]">
        <div className="border-b border-r border-slate-200 bg-slate-50 p-3 text-sm font-semibold text-slate-600">
          Repas
        </div>
        {days.map((day) => (
          <div
            key={day.date}
            className="border-b border-r border-slate-200 bg-slate-50 p-3 text-sm font-semibold text-slate-700 last:border-r-0"
          >
            {day.label}
          </div>
        ))}

        {mealTypes.map((mealType) => (
          <Row
            key={mealType}
            mealType={mealType}
            days={days}
            meals={meals}
          />
        ))}
      </div>
    </div>
  );
}

function Row({
  mealType,
  days,
  meals,
}: {
  mealType: PlannedMeal["mealType"];
  days: WeekDay[];
  meals: PlannedMeal[];
}) {
  return (
    <>
      <div className="border-b border-r border-slate-200 p-3 text-sm font-semibold text-slate-700">
        {mealTypeLabels[mealType]}
      </div>
      {days.map((day) => {
        const meal = meals.find(
          (item) => item.date === day.date && item.mealType === mealType,
        );

        return (
          <div
            key={`${day.date}-${mealType}`}
            className="min-h-24 border-b border-r border-slate-200 p-3 last:border-r-0"
          >
            {meal ? (
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1">
                  <Link
                    href={`/recipes/${meal.recipe.id}`}
                    className="text-sm font-semibold text-slate-950 hover:text-emerald-700"
                  >
                    {meal.recipe.title}
                  </Link>
                  <p className="text-xs text-slate-500">
                    {meal.recipe.categoryName ?? "Sans categorie"}
                  </p>
                </div>
                <DeleteMealPlanForm mealPlanId={meal.id} />
              </div>
            ) : (
              <p className="text-sm text-slate-400">Libre</p>
            )}
          </div>
        );
      })}
    </>
  );
}
