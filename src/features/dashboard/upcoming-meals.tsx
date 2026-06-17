import Link from "next/link";

import type { UpcomingMeal } from "@/features/dashboard/dashboard.data";

type UpcomingMealsProps = {
  meals: UpcomingMeal[];
};

export function UpcomingMeals({ meals }: UpcomingMealsProps) {
  if (meals.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center">
        <h2 className="text-lg font-semibold">Aucun repas planifie</h2>
        <p className="mt-2 text-sm text-slate-600">
          Ajoute des recettes au planning pour voir ta semaine se remplir ici.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <div className="border-b border-slate-200 px-5 py-4">
        <h2 className="text-lg font-semibold">Prochains repas</h2>
      </div>
      <ul className="divide-y divide-slate-200">
        {meals.map((meal) => (
          <li key={meal.id} className="flex items-center justify-between gap-4 p-5">
            <div>
              <p className="text-sm font-medium text-slate-950">
                {meal.dateLabel} - {meal.mealTypeLabel}
              </p>
              <Link
                href={`/recipes/${meal.recipe.id}`}
                className="mt-1 inline-flex text-sm text-emerald-700 hover:text-emerald-800"
              >
                {meal.recipe.title}
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
