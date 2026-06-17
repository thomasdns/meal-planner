"use client";

import Link from "next/link";
import { useActionState } from "react";

import { requestEmailVerificationAction } from "@/features/auth/email-verification.actions";

const initialState = {
  error: undefined,
  success: undefined,
  verificationLink: undefined,
};

type EmailVerificationFormProps = {
  emailVerified: Date | null;
};

export function EmailVerificationForm({
  emailVerified,
}: EmailVerificationFormProps) {
  const [state, formAction, isPending] = useActionState(
    requestEmailVerificationAction,
    initialState,
  );

  return (
    <form
      action={formAction}
      className="rounded-lg border border-slate-200 bg-white p-5"
    >
      <h2 className="text-lg font-semibold">Verification email</h2>
      <p className="mt-2 text-sm text-slate-600">
        {emailVerified
          ? "Ton email est verifie."
          : "Verifie ton email pour securiser ton compte."}
      </p>

      {state.error ? (
        <p className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      ) : null}

      {state.success ? (
        <div className="mt-3 space-y-2 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          <p>{state.success}</p>
          {state.verificationLink ? (
            <Link href={state.verificationLink} className="font-medium underline">
              Ouvrir le lien de verification
            </Link>
          ) : null}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={Boolean(emailVerified) || isPending}
        className="mt-4 inline-flex rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending ? "Generation..." : "Generer un lien"}
      </button>
    </form>
  );
}
