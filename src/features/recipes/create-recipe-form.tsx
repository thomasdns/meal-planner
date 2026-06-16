"use client";

import { useActionState } from "react";

import { createRecipeAction } from "@/features/recipes/recipe.actions";

const initialState = {
  error: undefined,
};

export function CreateRecipeForm() {
  const [state, formAction, isPending] = useActionState(
    createRecipeAction,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-4 rounded-lg border border-slate-200 bg-white p-5">
      <div>
        <h2 className="text-lg font-semibold">Nouvelle recette</h2>
        <p className="text-sm text-slate-600">
          Commence avec les informations essentielles. Les ingredients et les
          categories seront ajoutes dans les prochaines etapes.
        </p>
      </div>

      {state.error ? (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      ) : null}

      <div className="space-y-1">
        <label htmlFor="title" className="text-sm font-medium">
          Titre
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          className="w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-emerald-600"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="description" className="text-sm font-medium">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          className="w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-emerald-600"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="servings" className="text-sm font-medium">
          Portions
        </label>
        <input
          id="servings"
          name="servings"
          type="number"
          min={1}
          max={20}
          defaultValue={1}
          required
          className="w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-emerald-600"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex rounded-md bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Creation..." : "Creer la recette"}
      </button>
    </form>
  );
}
