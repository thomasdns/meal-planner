export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm font-medium text-emerald-700">Vue d&apos;ensemble</p>
        <h1 className="text-3xl font-semibold tracking-tight">
          Tableau de bord
        </h1>
        <p className="max-w-2xl text-sm text-slate-600">
          Retrouve ici les indicateurs importants de ta semaine : repas
          planifies, recettes recentes et liste de courses a preparer.
        </p>
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <p className="text-sm font-medium text-slate-600">Repas planifies</p>
          <p className="mt-3 text-3xl font-semibold">0</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <p className="text-sm font-medium text-slate-600">Recettes</p>
          <p className="mt-3 text-3xl font-semibold">0</p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <p className="text-sm font-medium text-slate-600">
            Articles de courses
          </p>
          <p className="mt-3 text-3xl font-semibold">0</p>
        </div>
      </section>
    </div>
  );
}
