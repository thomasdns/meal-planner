"use client";

import { deleteRecipeAction } from "@/features/recipes/recipe.actions";
import { confirmationMessages } from "@/lib/confirmation-messages";

type DeleteRecipeFormProps = {
  recipeId: string;
};

export function DeleteRecipeForm({ recipeId }: DeleteRecipeFormProps) {
  return (
    <form
      action={deleteRecipeAction.bind(null, recipeId)}
      onSubmit={(event) => {
        if (
          !window.confirm(confirmationMessages.deleteRecipe)
        ) {
          event.preventDefault();
        }
      }}
      className="rounded-lg border border-red-200 bg-white p-5"
    >
      <h2 className="text-lg font-semibold text-red-700">Zone dangereuse</h2>
      <p className="mt-2 text-sm text-slate-600">
        La suppression est definitive. Elle retire aussi cette recette du
        planning et de la liste de courses generee.
      </p>

      <button
        type="submit"
        className="mt-4 inline-flex rounded-md border border-red-300 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
      >
        Supprimer la recette
      </button>
    </form>
  );
}
