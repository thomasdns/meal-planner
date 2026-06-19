"use client";

import { useActionState } from "react";

import { ActionMessage } from "@/components/ui/action-message";
import { createCategoryAction } from "@/features/categories/category.actions";

const initialState = {
  error: undefined,
};

const defaultColor = "#047857";

export function CreateCategoryForm() {
  const [state, formAction, isPending] = useActionState(
    createCategoryAction,
    initialState,
  );

  return (
    <form
      action={formAction}
      className="space-y-4 rounded-lg border border-slate-200 bg-white p-5"
    >
      <div>
        <h2 className="text-lg font-semibold">Nouvelle categorie</h2>
        <p className="text-sm text-slate-600">
          Les categories permettront de filtrer les recettes plus facilement.
        </p>
      </div>

      {state.error ? (
        <ActionMessage tone="error">{state.error}</ActionMessage>
      ) : null}

      <div className="space-y-1">
        <label htmlFor="category-name" className="text-sm font-medium">
          Nom
        </label>
        <input
          id="category-name"
          name="name"
          type="text"
          required
          className="w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-emerald-600"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="category-color" className="text-sm font-medium">
          Couleur
        </label>
        <input
          id="category-color"
          name="color"
          type="color"
          defaultValue={defaultColor}
          className="h-10 w-full rounded-md border border-slate-300 bg-transparent px-2 py-1"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex rounded-md bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Creation..." : "Creer la categorie"}
      </button>
    </form>
  );
}
