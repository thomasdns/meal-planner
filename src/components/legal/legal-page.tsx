import type { ReactNode } from "react";
import Link from "next/link";

type LegalPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
};

export function LegalPage({
  eyebrow,
  title,
  description,
  children,
}: LegalPageProps) {
  return (
    <main id="main-content" tabIndex={-1} className="bg-slate-50 text-slate-950">
      <article className="mx-auto my-8 w-[calc(100%-2rem)] max-w-4xl rounded-md border border-slate-300 bg-white px-5 py-8 shadow-sm sm:my-12 sm:px-8 sm:py-10">
        <header className="border-b border-slate-200 pb-8">
          <p className="text-sm font-medium text-emerald-700">{eyebrow}</p>
          <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">{title}</h1>
          <p className="mt-4 max-w-3xl leading-7 text-slate-600">{description}</p>
        </header>
        <div className="legal-content mt-8 space-y-8">{children}</div>
        <div className="mt-10 border-t border-slate-300 pt-6">
          <Link className="font-semibold text-emerald-700 hover:underline" href="/dashboard">
            Retour à l&apos;accueil
          </Link>
        </div>
      </article>
    </main>
  );
}

export function LegalSection({
  id,
  title,
  children,
}: {
  id?: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-6 space-y-3">
      <h2 className="text-xl font-semibold">{title}</h2>
      <div className="space-y-3 leading-7 text-slate-700">{children}</div>
    </section>
  );
}
