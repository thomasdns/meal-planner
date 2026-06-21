import Link from "next/link";

export default function NotFoundPage() {
  return (
    <main id="main-content" tabIndex={-1} className="mx-auto flex min-h-screen max-w-xl flex-col justify-center px-6 py-12">
      <p className="text-sm font-medium text-emerald-700">Erreur 404</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">
        Page introuvable
      </h1>
      <p className="mt-3 text-sm text-slate-600">
        Cette page n&apos;existe pas ou tu n&apos;as pas acces a son contenu.
      </p>
      <Link
        href="/dashboard"
        className="mt-6 inline-flex w-fit rounded-md bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-800"
      >
        Retour au tableau de bord
      </Link>
    </main>
  );
}
