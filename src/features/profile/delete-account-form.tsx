"use client";

import { signOut } from "next-auth/react";
import { useActionState, useEffect } from "react";

import { deleteAccountAction } from "@/features/profile/profile.actions";

const initialState = {
  error: undefined,
  success: false,
};

export function DeleteAccountForm() {
  const [state, formAction, isPending] = useActionState(
    deleteAccountAction,
    initialState,
  );

  useEffect(() => {
    if (state.success) {
      void signOut({ callbackUrl: "/auth/sign-in" });
    }
  }, [state.success]);

  return (
    <form
      action={formAction}
      className="space-y-4 rounded-lg border border-red-200 bg-white p-5"
    >
      <div>
        <h2 className="text-lg font-semibold text-red-700">Zone dangereuse</h2>
        <p className="mt-2 text-sm text-slate-600">
          Cette action supprime ton compte, tes recettes, tes categories, ton
          planning et tes sessions. Elle est definitive.
        </p>
      </div>

      {state.error ? (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      ) : null}

      <div className="space-y-1">
        <label htmlFor="delete-confirmation" className="text-sm font-medium">
          Tape SUPPRIMER pour confirmer
        </label>
        <input
          id="delete-confirmation"
          name="confirmation"
          type="text"
          autoComplete="off"
          required
          className="w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-red-600"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex rounded-md border border-red-300 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending ? "Suppression..." : "Supprimer mon compte"}
      </button>
    </form>
  );
}
