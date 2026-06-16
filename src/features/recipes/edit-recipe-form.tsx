"use client";

import { useActionState } from "react";

import { updateRecipeAction } from "@/features/recipes/recipe.actions";

type EditRecipeFormProps = {
  recipe: {
    id: string;
    title: string;
    description: string | null;
    servings: number;
    categoryId: string | null;
  };
  categories: {
    id: string;
    name: string;
  }[];
};

const initialState = {
  error: undefined,
  success: undefined,
};

export function EditRecipeForm({ recipe, categories }: EditRecipeFormProps) {
  const [state, formAction, isPending] = useActionState(
    updateRecipeAction.bind(null, recipe.id),
    initialState,
  );

  return (
    <form
      action={formAction}
      className="space-y-4 rounded-lg border border-slate-200 bg-white p-5"
    >
      <div>
        <h2 className="text-lg font-semibold">Modifier la recette</h2>
        <p className="text-sm text-slate-600">
          Mets a jour les informations principales de cette recette.
        </p>
      </div>

      {state.error ? (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      ) : null}

      {state.success ? (
        <p className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          {state.success}
        </p>
      ) : null}

      <div className="space-y-1">
        <label htmlFor="edit-title" className="text-sm font-medium">
          Titre
        </label>
        <input
          id="edit-title"
          name="title"
          type="text"
          defaultValue={recipe.title}
          required
          className="w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-emerald-600"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="edit-description" className="text-sm font-medium">
          Description
        </label>
        <textarea
          id="edit-description"
          name="description"
          rows={3}
          defaultValue={recipe.description ?? ""}
          className="w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-emerald-600"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="edit-servings" className="text-sm font-medium">
          Portions
        </label>
        <input
          id="edit-servings"
          name="servings"
          type="number"
          min={1}
          max={20}
          defaultValue={recipe.servings}
          required
          className="w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-emerald-600"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="edit-categoryId" className="text-sm font-medium">
          Categorie
        </label>
        <select
          id="edit-categoryId"
          name="categoryId"
          defaultValue={recipe.categoryId ?? ""}
          className="w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-emerald-600"
        >
          <option value="">Sans categorie</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex rounded-md bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Enregistrement..." : "Enregistrer"}
      </button>
    </form>
  );
}
