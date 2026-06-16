"use client";

import { useActionState } from "react";

import { createIngredientAction } from "@/features/recipes/ingredient.actions";

const initialState = {
  error: undefined,
};

type CreateIngredientFormProps = {
  recipeId: string;
};

export function CreateIngredientForm({ recipeId }: CreateIngredientFormProps) {
  const [state, formAction, isPending] = useActionState(
    createIngredientAction.bind(null, recipeId),
    initialState,
  );

  return (
    <form
      action={formAction}
      className="space-y-4 rounded-lg border border-slate-200 bg-white p-5"
    >
      <div>
        <h2 className="text-lg font-semibold">Nouvel ingredient</h2>
        <p className="text-sm text-slate-600">
          Ces ingredients serviront ensuite a generer la liste de courses.
        </p>
      </div>

      {state.error ? (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      ) : null}

      <div className="space-y-1">
        <label htmlFor="ingredient-name" className="text-sm font-medium">
          Nom
        </label>
        <input
          id="ingredient-name"
          name="name"
          type="text"
          required
          className="w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-emerald-600"
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1">
          <label htmlFor="ingredient-quantity" className="text-sm font-medium">
            Quantite
          </label>
          <input
            id="ingredient-quantity"
            name="quantity"
            type="number"
            min="0"
            step="0.01"
            className="w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-emerald-600"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="ingredient-unit" className="text-sm font-medium">
            Unite
          </label>
          <input
            id="ingredient-unit"
            name="unit"
            type="text"
            placeholder="g, ml, piece"
            className="w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-emerald-600"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex rounded-md bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Ajout..." : "Ajouter l'ingredient"}
      </button>
    </form>
  );
}
