"use client";

import { useState } from "react";

import { deleteMealPlanAction } from "@/features/meal-plans/meal-plan.actions";
import { confirmationMessages } from "@/lib/confirmation-messages";

type DeleteMealPlanFormProps = {
  mealPlanId: string;
};

export function DeleteMealPlanForm({ mealPlanId }: DeleteMealPlanFormProps) {
  const [isPending, setIsPending] = useState(false);

  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault();
        if (!window.confirm(confirmationMessages.deleteMealPlan)) {
          return;
        }

        setIsPending(true);
        const result = await deleteMealPlanAction(mealPlanId);
        if (result?.success) {
          window.location.assign("/meal-plan?status=removed");
          return;
        }
        setIsPending(false);
      }}
      className="shrink-0"
    >
      <button
        type="submit"
        disabled={isPending}
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
