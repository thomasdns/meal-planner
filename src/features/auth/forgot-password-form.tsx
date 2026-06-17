"use client";

import Link from "next/link";
import { useActionState } from "react";

import { requestPasswordResetAction } from "@/features/auth/password-reset.actions";

const initialState = {
  error: undefined,
  success: undefined,
  resetLink: undefined,
};

export function ForgotPasswordForm() {
  const [state, formAction, isPending] = useActionState(
    requestPasswordResetAction,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-4">
      {state.error ? (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      ) : null}

      {state.success ? (
        <div className="space-y-2 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          <p>{state.success}</p>
          {state.resetLink ? (
            <Link href={state.resetLink} className="font-medium underline">
              Ouvrir le lien de reinitialisation
            </Link>
          ) : null}
        </div>
      ) : null}

      <div className="space-y-1">
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-emerald-600"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-md bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Generation..." : "Recevoir un lien"}
      </button>

      <p className="text-sm text-gray-600">
        Tu as retrouve ton mot de passe ?{" "}
        <Link href="/auth/sign-in" className="font-medium text-emerald-700">
          Se connecter
        </Link>
      </p>
    </form>
  );
}
