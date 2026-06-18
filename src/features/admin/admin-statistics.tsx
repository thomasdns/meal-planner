import type { getAdminStatisticsData } from "@/features/admin/admin.data";

type AdminStatisticsProps = {
  data: Awaited<ReturnType<typeof getAdminStatisticsData>>;
};

const mealTypeLabels: Record<string, string> = {
  BREAKFAST: "Petit-dejeuner",
  LUNCH: "Dejeuner",
  DINNER: "Diner",
  SNACK: "Snack",
};

export function AdminStatistics({ data }: AdminStatisticsProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Statistiques</h2>
        <p className="text-sm text-slate-600">
          Vue d&apos;ensemble de l&apos;activite et des contenus de l&apos;application.
        </p>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard label="Utilisateurs" value={data.stats.usersCount} />
        <AdminStatCard label="Recettes" value={data.stats.recipesCount} />
        <AdminStatCard label="Ingredients" value={data.stats.ingredientsCount} />
        <AdminStatCard label="Repas planifies" value={data.stats.mealPlansCount} />
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <AdminStatCard
          label="Nouveaux utilisateurs"
          value={data.stats.newUsersCount}
          detail="Sur les 7 derniers jours"
        />
        <AdminStatCard
          label="Sans recette"
          value={data.stats.usersWithoutRecipesCount}
          detail="Utilisateurs a accompagner"
        />
        <AdminStatCard
          label="Moyenne recettes"
          value={data.stats.averageRecipesPerUser}
          detail="Par utilisateur"
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <h3 className="text-lg font-semibold">Recettes les plus planifiees</h3>
          <div className="mt-4 space-y-3">
            {data.mostPlannedRecipes.length > 0 ? (
              data.mostPlannedRecipes.map((recipe) => (
                <div
                  key={recipe.id}
                  className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3 last:border-0 last:pb-0"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium">{recipe.title}</p>
                    <p className="truncate text-sm text-slate-600">
                      {recipe.ownerEmail}
                    </p>
                  </div>
                  <span className="text-sm font-semibold">{recipe.plannedCount}</span>
                </div>
              ))
            ) : (
              <EmptyMessage>Aucune recette planifiee pour le moment.</EmptyMessage>
            )}
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <h3 className="text-lg font-semibold">Repartition des repas</h3>
          <div className="mt-4 space-y-3">
            {data.mealTypeStats.length > 0 ? (
              data.mealTypeStats.map((item) => (
                <div
                  key={item.mealType}
                  className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3 last:border-0 last:pb-0"
                >
                  <span>{mealTypeLabels[item.mealType] ?? item.mealType}</span>
                  <span className="font-semibold">{item.count}</span>
                </div>
              ))
            ) : (
              <EmptyMessage>Aucun repas planifie pour le moment.</EmptyMessage>
            )}
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5">
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
      </section>
    </div>
  );
}

function AdminStatCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: number;
  detail?: string;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5">
      <p className="text-sm font-medium text-slate-600">{label}</p>
      <p className="mt-3 text-3xl font-semibold">{value}</p>
      {detail ? <p className="mt-2 text-xs text-slate-500">{detail}</p> : null}
    </div>
  );
}

function EmptyMessage({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-slate-600">{children}</p>;
}
