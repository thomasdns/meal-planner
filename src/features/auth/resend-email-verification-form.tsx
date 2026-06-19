"use client";

import Link from "next/link";
import { useActionState } from "react";

import { resendEmailVerificationAction } from "@/features/auth/email-verification.actions";

const initialState = {
  error: undefined,
  success: undefined,
};

export function ResendEmailVerificationForm() {
  const [state, formAction, isPending] = useActionState(
    resendEmailVerificationAction,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-4">
      {state.error ? (
        <p
          role="alert"
          className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
        >
          {state.error}
        </p>
      ) : null}

      {state.success ? (
        <p
          role="status"
          className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800"
        >
          {state.success}
        </p>
      ) : null}

      <div className="space-y-1">
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-emerald-600"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-md bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Envoi..." : "Renvoyer le lien"}
      </button>

      <p className="text-sm text-gray-600">
        Ton adresse est deja verifiee ?{" "}
        <Link href="/auth/sign-in" className="font-medium text-emerald-700">
          Se connecter
        </Link>
      </p>
    </form>
  );
}
