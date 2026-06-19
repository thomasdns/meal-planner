"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";

import { ActionMessage } from "@/components/ui/action-message";
import { updateRecipeAction } from "@/features/recipes/recipe.actions";

type EditRecipeFormProps = {
  recipe: {
    id: string;
    title: string;
    description: string | null;
    servings: number;
    prepTime: number | null;
    cookTime: number | null;
    steps: string | null;
    imageUrl: string | null;
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
  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      router.refresh();
    }
  }, [router, state.success]);

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
        <ActionMessage tone="error">{state.error}</ActionMessage>
      ) : null}

      {state.success ? (
        <ActionMessage tone="success">{state.success}</ActionMessage>
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

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <label htmlFor="edit-prepTime" className="text-sm font-medium">
            Preparation (min)
          </label>
          <input
            id="edit-prepTime"
            name="prepTime"
            type="number"
            min={0}
            max={1440}
            defaultValue={recipe.prepTime ?? ""}
            className="w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-emerald-600"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="edit-cookTime" className="text-sm font-medium">
            Cuisson (min)
          </label>
          <input
            id="edit-cookTime"
            name="cookTime"
            type="number"
            min={0}
            max={1440}
            defaultValue={recipe.cookTime ?? ""}
            className="w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-emerald-600"
          />
        </div>
      </div>

      <div className="space-y-1">
        <label htmlFor="edit-steps" className="text-sm font-medium">
          Etapes de preparation
        </label>
        <textarea
          id="edit-steps"
          name="steps"
          rows={6}
          defaultValue={recipe.steps ?? ""}
          className="w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-emerald-600"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="edit-imageUrl" className="text-sm font-medium">
          Image URL
        </label>
        <input
          id="edit-imageUrl"
          name="imageUrl"
          type="url"
          defaultValue={recipe.imageUrl ?? ""}
          placeholder="https://example.com/recette.jpg"
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
