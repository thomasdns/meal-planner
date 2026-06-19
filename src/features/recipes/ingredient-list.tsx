"use client";

import { useActionState } from "react";

import { ActionMessage } from "@/components/ui/action-message";
import {
  deleteIngredientAction,
  updateIngredientAction,
} from "@/features/recipes/ingredient.actions";
import type { RecipeIngredientItem } from "@/features/recipes/recipes.data";
import { confirmationMessages } from "@/lib/confirmation-messages";

type IngredientListProps = {
  ingredients: RecipeIngredientItem[];
};

export function IngredientList({ ingredients }: IngredientListProps) {
  if (ingredients.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center">
        <h2 className="text-lg font-semibold">Aucun ingredient</h2>
        <p className="mt-2 text-sm text-slate-600">
          Ajoute les ingredients necessaires pour preparer cette recette.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {ingredients.map((ingredient) => (
        <EditableIngredientItem key={ingredient.id} ingredient={ingredient} />
      ))}
    </div>
  );
}

type EditableIngredientItemProps = {
  ingredient: RecipeIngredientItem;
};

const initialState = {
  error: undefined,
  success: undefined,
};

function EditableIngredientItem({ ingredient }: EditableIngredientItemProps) {
  const [state, formAction, isPending] = useActionState(
    updateIngredientAction.bind(null, ingredient.id),
    initialState,
  );
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <form action={formAction} className="space-y-3">
        <div className="grid gap-3 md:grid-cols-[1fr_120px_140px_auto] md:items-end">
          <div className="space-y-1">
            <label
              htmlFor={`ingredient-name-${ingredient.id}`}
              className="text-sm font-medium"
            >
              Ingredient
            </label>
            <input
              id={`ingredient-name-${ingredient.id}`}
              name="name"
              type="text"
              defaultValue={ingredient.name}
              required
              className="w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-emerald-600"
            />
          </div>

          <div className="space-y-1">
            <label
              htmlFor={`ingredient-quantity-${ingredient.id}`}
              className="text-sm font-medium"
            >
              Quantite
            </label>
            <input
              id={`ingredient-quantity-${ingredient.id}`}
              name="quantity"
              type="number"
              min="0"
              step="0.01"
              defaultValue={ingredient.quantity ?? ""}
              className="w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-emerald-600"
            />
          </div>

          <div className="space-y-1">
            <label
              htmlFor={`ingredient-unit-${ingredient.id}`}
              className="text-sm font-medium"
            >
              Unite
            </label>
            <input
              id={`ingredient-unit-${ingredient.id}`}
              name="unit"
              type="text"
              defaultValue={ingredient.unit ?? ""}
              className="w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-emerald-600"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex justify-center rounded-md bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? "..." : "Enregistrer"}
            </button>

            <button
              type="submit"
              form={`delete-ingredient-${ingredient.id}`}
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-red-300 text-red-700 hover:bg-red-50"
              aria-label="Supprimer cet ingredient"
              title="Supprimer cet ingredient"
            >
              <svg
                aria-hidden="true"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M3 6h18" />
                <path d="M8 6V4h8v2" />
                <path d="M19 6l-1 14H6L5 6" />
                <path d="M10 11v5" />
                <path d="M14 11v5" />
              </svg>
            </button>
          </div>
        </div>

        {state.error ? (
          <ActionMessage tone="error">{state.error}</ActionMessage>
        ) : null}

        {state.success ? (
          <ActionMessage tone="success">{state.success}</ActionMessage>
        ) : null}
      </form>

      <form
        id={`delete-ingredient-${ingredient.id}`}
        action={deleteIngredientAction.bind(null, ingredient.id)}
        onSubmit={(event) => {
          if (!window.confirm(confirmationMessages.deleteIngredient)) {
            event.preventDefault();
          }
        }}
      />
    </div>
  );
}
