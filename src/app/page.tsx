import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-16">
        <div className="max-w-3xl space-y-6">
          <p className="text-sm font-medium text-emerald-700">
            Planificateur de repas hebdomadaire
          </p>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Organise tes recettes, ton planning et tes courses au meme endroit.
          </h1>
          <p className="max-w-2xl text-base leading-7 text-slate-600">
            Meal Planner est une application full stack construite avec
            Next.js, TypeScript, PostgreSQL, Prisma et NextAuth.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/auth/sign-up"
              className="inline-flex justify-center rounded-md bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-800"
            >
              Creer un compte
            </Link>
            <Link
              href="/auth/sign-in"
              className="inline-flex justify-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-100"
            >
              Se connecter
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
