"use client";

import { useActionState } from "react";

import { ActionMessage } from "@/components/ui/action-message";
import {
  deleteCategoryAction,
  updateCategoryAction,
} from "@/features/categories/category.actions";
import type { CategoryListItem } from "@/features/categories/categories.data";
import { confirmationMessages } from "@/lib/confirmation-messages";

type CategoryListProps = {
  categories: CategoryListItem[];
};

export function CategoryList({ categories }: CategoryListProps) {
  if (categories.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 bg-white p-5">
        <h2 className="text-base font-semibold">Aucune categorie</h2>
        <p className="mt-2 text-sm text-slate-600">
          Ajoute une premiere categorie pour organiser tes recettes.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {categories.map((category) => (
        <EditableCategory key={category.id} category={category} />
      ))}
    </div>
  );
}

type EditableCategoryProps = {
  category: CategoryListItem;
};

const initialState = {
  error: undefined,
  success: undefined,
};

function EditableCategory({ category }: EditableCategoryProps) {
  const [state, formAction, isPending] = useActionState(
    updateCategoryAction.bind(null, category.id),
    initialState,
  );
  // Do not auto-refresh here; keep action message visible for E2E assertions.

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <form action={formAction} className="space-y-3">
        <div className="grid gap-3 sm:grid-cols-[44px_1fr_auto] sm:items-end">
          <div className="space-y-1">
            <label
              htmlFor={`category-color-${category.id}`}
              className="text-sm font-medium"
            >
              Couleur
            </label>
            <input
              id={`category-color-${category.id}`}
              name="color"
              type="color"
              defaultValue={category.color ?? "#047857"}
              className="h-10 w-10 rounded-md border border-slate-300 bg-transparent px-1 py-1"
            />
          </div>

          <div className="space-y-1">
            <label
              htmlFor={`category-name-${category.id}`}
              className="text-sm font-medium"
            >
              Nom
            </label>
            <input
              id={`category-name-${category.id}`}
              name="name"
              type="text"
              required
              defaultValue={category.name}
              className="w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-emerald-600"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex rounded-md bg-emerald-700 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? "..." : "OK"}
            </button>
            <button
              type="submit"
              form={`delete-category-${category.id}`}
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-red-300 text-red-700 hover:bg-red-50"
              aria-label="Supprimer cette categorie"
              title="Supprimer cette categorie"
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

        <p className="text-xs text-slate-500">
          {category.recipesCount} recette{category.recipesCount > 1 ? "s" : ""}
        </p>

        {state.error ? (
          <ActionMessage tone="error">{state.error}</ActionMessage>
        ) : null}

        {state.success ? (
          <ActionMessage tone="success">{state.success}</ActionMessage>
        ) : null}
      </form>

      <form
        id={`delete-category-${category.id}`}
        action={deleteCategoryAction.bind(null, category.id)}
        onSubmit={(event) => {
          if (
            !window.confirm(confirmationMessages.deleteCategory)
          ) {
            event.preventDefault();
          }
        }}
      />
    </div>
  );
}
