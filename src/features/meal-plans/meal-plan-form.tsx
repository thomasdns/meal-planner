"use client";

import { useActionState } from "react";

import { ActionMessage } from "@/components/ui/action-message";
import {
  mealTypeLabels,
  mealTypes,
} from "@/features/meal-plans/meal-plan.constants";
import { upsertMealPlanAction } from "@/features/meal-plans/meal-plan.actions";
import type { MealPlanRecipeOption, WeekDay } from "@/features/meal-plans/meal-plans.data";

const initialState = {
  error: undefined,
};

type MealPlanFormProps = {
  days: WeekDay[];
  recipes: MealPlanRecipeOption[];
};

export function MealPlanForm({ days, recipes }: MealPlanFormProps) {
  const [state, formAction, isPending] = useActionState(
    upsertMealPlanAction,
    initialState,
  );
  return (
    <form
      action={formAction}
      className="space-y-4 rounded-lg border border-slate-200 bg-white p-5"
    >
      <div>
        <h2 className="text-lg font-semibold">Planifier un repas</h2>
        <p className="text-sm text-slate-600">
          Choisis une recette, un jour et un type de repas.
        </p>
      </div>

      {state.error ? (
        <ActionMessage tone="error">{state.error}</ActionMessage>
      ) : null}

      <div className="space-y-1">
        <label htmlFor="recipeId" className="text-sm font-medium">
          Recette
        </label>
        <select
          id="recipeId"
          name="recipeId"
          required
          className="w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-emerald-600"
        >
          <option value="">Selectionner une recette</option>
          {recipes.map((recipe) => (
            <option key={recipe.id} value={recipe.id}>
              {recipe.title}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-1">
        <label htmlFor="date" className="text-sm font-medium">
          Jour
        </label>
        <select
          id="date"
          name="date"
          required
          className="w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-emerald-600"
        >
          {days.map((day) => (
            <option key={day.date} value={day.date}>
              {day.label}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-1">
        <label htmlFor="mealType" className="text-sm font-medium">
          Repas
        </label>
        <select
          id="mealType"
          name="mealType"
          required
          className="w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-emerald-600"
        >
          {mealTypes.map((mealType) => (
            <option key={mealType} value={mealType}>
              {mealTypeLabels[mealType]}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={isPending || recipes.length === 0}
        className="inline-flex rounded-md bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Planification..." : "Planifier"}
      </button>
    </form>
  );
}
