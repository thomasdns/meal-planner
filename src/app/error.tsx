"use client";

import Link from "next/link";

type ErrorPageProps = {
  error: Error & { digest?: string };
  unstable_retry: () => void;
};

export default function ErrorPage({ error, unstable_retry }: ErrorPageProps) {
  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col justify-center px-6 py-12">
      <p className="text-sm font-medium text-red-700">Erreur inattendue</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">
        Une erreur est survenue
      </h1>
      <p className="mt-3 text-sm text-slate-600">
        L&apos;incident a ete journalise. Tu peux reessayer ou revenir au tableau
        de bord.
      </p>
      {error.digest ? (
        <p className="mt-3 text-xs text-slate-500">
          Reference : {error.digest}
        </p>
      ) : null}
      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => unstable_retry()}
          className="rounded-md bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-800"
        >
          Reessayer
        </button>
        <Link
          href="/dashboard"
          className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Retour au tableau de bord
        </Link>
      </div>
    </main>
  );
}
