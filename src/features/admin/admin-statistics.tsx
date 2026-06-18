import Link from "next/link";

import type { getAdminStatisticsData } from "@/features/admin/admin.data";
import type { AdminStatisticsPeriod } from "@/features/admin/admin.validation";

type AdminStatisticsProps = {
  data: Awaited<ReturnType<typeof getAdminStatisticsData>>;
  periodDays: AdminStatisticsPeriod;
};

const mealTypeLabels: Record<string, string> = {
  BREAKFAST: "Petit-dejeuner",
  LUNCH: "Dejeuner",
  DINNER: "Diner",
  SNACK: "Snack",
};

const periods: AdminStatisticsPeriod[] = [7, 30, 90];

export function AdminStatistics({ data, periodDays }: AdminStatisticsProps) {
  const mealTypeTotal = data.mealTypeStats.reduce(
    (total, item) => total + item.count,
    0,
  );
  const mostPlannedCount = Math.max(
    ...data.mostPlannedRecipes.map((recipe) => recipe.plannedCount),
    1,
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold">Statistiques</h2>
          <p className="text-sm text-slate-600">
            Analyse l&apos;activite actuelle et son evolution dans le temps.
          </p>
        </div>
        <div>
          <p className="mb-2 text-xs font-medium text-slate-500">Periode analysee</p>
          <div
            className="inline-flex overflow-hidden rounded-md border border-slate-300 bg-white"
            aria-label="Periode des statistiques"
          >
            {periods.map((period) => (
              <Link
                key={period}
                href={`/admin?view=statistics&period=${period}`}
                aria-current={period === periodDays ? "page" : undefined}
                className={`border-r border-slate-300 px-4 py-2 text-sm font-medium last:border-r-0 ${
                  period === periodDays
                    ? "bg-emerald-700 text-white"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                {period} jours
              </Link>
            ))}
          </div>
        </div>
      </div>

      <section aria-labelledby="global-stats-title" className="space-y-3">
        <h3 id="global-stats-title" className="text-sm font-semibold text-slate-700">
          Totaux de l&apos;application
        </h3>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <AdminStatCard label="Utilisateurs" value={data.stats.usersCount} />
          <AdminStatCard label="Recettes" value={data.stats.recipesCount} />
          <AdminStatCard label="Ingredients" value={data.stats.ingredientsCount} />
          <AdminStatCard label="Repas planifies" value={data.stats.mealPlansCount} />
        </div>
      </section>

      <section aria-labelledby="activity-stats-title" className="space-y-3">
        <div>
          <h3 id="activity-stats-title" className="text-lg font-semibold">
            Activite sur {periodDays} jours
          </h3>
          <p className="text-sm text-slate-600">
            Comparaison avec les {periodDays} jours precedents.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <TrendCard label="Nouveaux utilisateurs" {...data.activity.newUsers} />
          <TrendCard label="Recettes creees" {...data.activity.newRecipes} />
          <TrendCard label="Repas planifies" {...data.activity.plannedMeals} />
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <h3 className="text-lg font-semibold">Adoption des recettes</h3>
          <p className="mt-1 text-sm text-slate-600">
            Part des utilisateurs ayant cree au moins une recette.
          </p>
          <p className="mt-5 text-3xl font-semibold">
            {data.stats.usersWithRecipesRate} %
          </p>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full bg-emerald-600"
              style={{ width: `${data.stats.usersWithRecipesRate}%` }}
            />
          </div>
          <dl className="mt-6 grid grid-cols-3 gap-4 border-t border-slate-100 pt-4">
            <Metric
              label="Sans recette"
              value={data.stats.usersWithoutRecipesCount}
            />
            <Metric
              label="Moyenne par utilisateur"
              value={data.stats.averageRecipesPerUser}
            />
            <Metric label="Categories" value={data.stats.categoriesCount} />
          </dl>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <h3 className="text-lg font-semibold">
            Repartition des repas sur {periodDays} jours
          </h3>
          <div className="mt-5 space-y-4">
            {data.mealTypeStats.length > 0 ? (
              data.mealTypeStats.map((item) => {
                const percentage = Math.round((item.count / mealTypeTotal) * 100);

                return (
                  <div key={item.mealType}>
                    <div className="flex items-center justify-between gap-4 text-sm">
                      <span>{mealTypeLabels[item.mealType] ?? item.mealType}</span>
                      <span className="font-semibold">
                        {item.count} ({percentage} %)
                      </span>
                    </div>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full bg-sky-600"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <EmptyMessage>Aucun repas planifie sur cette periode.</EmptyMessage>
            )}
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <h3 className="text-lg font-semibold">Recettes les plus planifiees</h3>
          <div className="mt-5 space-y-4">
            {data.mostPlannedRecipes.length > 0 ? (
              data.mostPlannedRecipes.map((recipe) => (
                <div key={recipe.id}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="truncate font-medium">{recipe.title}</p>
                      <p className="truncate text-sm text-slate-600">
                        {recipe.ownerEmail}
                      </p>
                    </div>
                    <span className="shrink-0 text-sm font-semibold">
                      {recipe.plannedCount}
                    </span>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full bg-emerald-600"
                      style={{
                        width: `${Math.round(
                          (recipe.plannedCount / mostPlannedCount) * 100,
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <EmptyMessage>Aucune recette planifiee pour le moment.</EmptyMessage>
            )}
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <h3 className="text-lg font-semibold">Dernieres recettes</h3>
          <div className="mt-4 space-y-3">
            {data.recentRecipes.length > 0 ? (
              data.recentRecipes.map((recipe) => (
                <div
                  key={recipe.id}
                  className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3 last:border-0 last:pb-0"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium">{recipe.title}</p>
                    <p className="truncate text-sm text-slate-600">
                      {recipe.user.email}
                    </p>
                  </div>
                  <span className="shrink-0 text-sm text-slate-500">
                    {recipe.createdAt.toLocaleDateString("fr-FR")}
                  </span>
                </div>
              ))
            ) : (
              <EmptyMessage>Aucune recette creee pour le moment.</EmptyMessage>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function AdminStatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5">
      <p className="text-sm font-medium text-slate-600">{label}</p>
      <p className="mt-3 text-3xl font-semibold">{value}</p>
    </div>
  );
}

function TrendCard({
  label,
  current,
  previous,
}: {
  label: string;
  current: number;
  previous: number;
}) {
  const trend = getTrend(current, previous);

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5">
      <p className="text-sm font-medium text-slate-600">{label}</p>
      <div className="mt-3 flex items-end justify-between gap-3">
        <p className="text-3xl font-semibold">{current}</p>
        <p className={`text-xs font-semibold ${trend.className}`}>{trend.label}</p>
      </div>
      <p className="mt-2 text-xs text-slate-500">Periode precedente : {previous}</p>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <dt className="text-xs text-slate-500">{label}</dt>
      <dd className="mt-1 text-lg font-semibold">{value}</dd>
    </div>
  );
}

function getTrend(current: number, previous: number) {
  if (previous === 0) {
    return current === 0
      ? { label: "Stable", className: "text-slate-500" }
      : { label: "Nouvelle activite", className: "text-emerald-700" };
  }

  const percentage = Math.round(((current - previous) / previous) * 100);

  if (percentage === 0) {
    return { label: "Stable", className: "text-slate-500" };
  }

  return {
    label: `${percentage > 0 ? "+" : ""}${percentage} %`,
    className: percentage > 0 ? "text-emerald-700" : "text-amber-700",
  };
}

function EmptyMessage({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-slate-600">{children}</p>;
}
