"use client";

import { deleteMealPlanAction } from "@/features/meal-plans/meal-plan.actions";

type DeleteMealPlanFormProps = {
  mealPlanId: string;
};

export function DeleteMealPlanForm({ mealPlanId }: DeleteMealPlanFormProps) {
  return (
    <form
      action={deleteMealPlanAction.bind(null, mealPlanId)}
      onSubmit={(event) => {
        if (!window.confirm("Retirer ce repas du planning ?")) {
          event.preventDefault();
        }
      }}
    >
      <button
        type="submit"
        className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-red-200 text-red-700 hover:bg-red-50"
        aria-label="Retirer ce repas du planning"
        title="Retirer ce repas du planning"
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
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </svg>
      </button>
    </form>
  );
}
