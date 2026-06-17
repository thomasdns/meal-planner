"use client";

import { useActionState } from "react";

import { createRecipeAction } from "@/features/recipes/recipe.actions";

const initialState = {
  error: undefined,
};

type CreateRecipeFormProps = {
  categories: {
    id: string;
    name: string;
  }[];
};

export function CreateRecipeForm({ categories }: CreateRecipeFormProps) {
  const [state, formAction, isPending] = useActionState(
    createRecipeAction,
    initialState,
  );

  return (
    <form
      action={formAction}
      className="space-y-4 rounded-lg border border-slate-200 bg-white p-5"
    >
      <div>
        <h2 className="text-lg font-semibold">Nouvelle recette</h2>
        <p className="text-sm text-slate-600">
          Commence avec les informations essentielles. Les ingredients seront
          ajoutes depuis la page de detail.
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

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <label htmlFor="prepTime" className="text-sm font-medium">
            Preparation (min)
          </label>
          <input
            id="prepTime"
            name="prepTime"
            type="number"
            min={0}
            max={1440}
            placeholder="15"
            className="w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-emerald-600"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="cookTime" className="text-sm font-medium">
            Cuisson (min)
          </label>
          <input
            id="cookTime"
            name="cookTime"
            type="number"
            min={0}
            max={1440}
            placeholder="20"
            className="w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-emerald-600"
          />
        </div>
      </div>

      <div className="space-y-1">
        <label htmlFor="steps" className="text-sm font-medium">
          Etapes de preparation
        </label>
        <textarea
          id="steps"
          name="steps"
          rows={5}
          placeholder={"1. Preparer les ingredients\n2. Cuire\n3. Servir"}
          className="w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-emerald-600"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="imageUrl" className="text-sm font-medium">
          Image URL
        </label>
        <input
          id="imageUrl"
          name="imageUrl"
          type="url"
          placeholder="https://example.com/recette.jpg"
          className="w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-emerald-600"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="categoryId" className="text-sm font-medium">
          Categorie
        </label>
        <select
          id="categoryId"
          name="categoryId"
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
        {isPending ? "Creation..." : "Creer la recette"}
      </button>
    </form>
  );
}
