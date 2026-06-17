"use client";

import { useActionState } from "react";

import { resendVerificationEmailAction } from "@/features/profile/profile.actions";

const initialState = {
  error: undefined,
  success: undefined,
};

export function ResendVerificationEmailForm() {
  const [state, formAction, isPending] = useActionState(
    resendVerificationEmailAction,
    initialState,
  );

  return (
    <form action={formAction} className="mt-4 space-y-3">
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

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex w-full justify-center rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Envoi..." : "Renvoyer l'email"}
      </button>
    </form>
  );
}
