"use client";

import Link from "next/link";
import { useActionState } from "react";

import { resetPasswordAction } from "@/features/auth/password-reset.actions";

const initialState = {
  error: undefined,
  success: undefined,
};

type ResetPasswordFormProps = {
  token: string;
};

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const [state, formAction, isPending] = useActionState(
    resetPasswordAction,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="token" value={token} />

      {state.error ? (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      ) : null}

      {state.success ? (
        <div className="space-y-2 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          <p>{state.success}</p>
          <Link href="/auth/sign-in" className="font-medium underline">
            Aller a la connexion
          </Link>
        </div>
      ) : null}

      <div className="space-y-1">
        <label htmlFor="password" className="text-sm font-medium">
          Nouveau mot de passe
        </label>
        <input
          id="password"
          name="password"
          type="password"
          minLength={10}
          required
          className="w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-emerald-600"
        />
      </div>

      <button
        type="submit"
        disabled={isPending || Boolean(state.success)}
        className="w-full rounded-md bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Mise a jour..." : "Changer le mot de passe"}
      </button>
    </form>
  );
}
