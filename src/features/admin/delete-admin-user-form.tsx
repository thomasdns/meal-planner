"use client";

import { useActionState } from "react";

import { ActionMessage } from "@/components/ui/action-message";
import { deleteAdminUserAction } from "@/features/admin/admin.actions";
import { confirmationMessages } from "@/lib/confirmation-messages";

type DeleteAdminUserFormProps = {
  userId: string;
  isCurrentAdmin: boolean;
};

const initialState = {
  error: undefined,
};

export function DeleteAdminUserForm({
  userId,
  isCurrentAdmin,
}: DeleteAdminUserFormProps) {
  const [state, formAction, isPending] = useActionState(
    deleteAdminUserAction.bind(null, userId),
    initialState,
  );

  return (
    <form
      action={formAction}
      onSubmit={(event) => {
        if (!window.confirm(confirmationMessages.deleteAdminUser)) {
          event.preventDefault();
        }
      }}
      className="rounded-lg border border-red-200 bg-white p-5"
    >
      <h2 className="text-lg font-semibold text-red-700">Zone dangereuse</h2>
      <p className="mt-2 text-sm text-slate-600">
        La suppression retire aussi les recettes, categories, ingredients,
        plannings et sessions de cet utilisateur.
      </p>

      {state.error ? (
        <ActionMessage tone="error" className="mt-3">
          {state.error}
        </ActionMessage>
      ) : null}

      <button
        type="submit"
        disabled={isCurrentAdmin || isPending}
        className="mt-4 inline-flex rounded-md border border-red-300 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isCurrentAdmin ? "Compte admin courant protege" : "Supprimer"}
      </button>
    </form>
  );
}
