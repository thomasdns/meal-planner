import { AdminUserList } from "@/features/admin/admin-user-list";
import { getAdminDashboardData } from "@/features/admin/admin.data";

const mealTypeLabels: Record<string, string> = {
  BREAKFAST: "Petit-dejeuner",
  LUNCH: "Dejeuner",
  DINNER: "Diner",
  SNACK: "Snack",
};

export default async function AdminPage() {
  const data = await getAdminDashboardData();

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <p className="text-sm font-medium text-emerald-700">Administration</p>
        <h1 className="text-3xl font-semibold tracking-tight">
          Pilotage de l&apos;application
        </h1>
        <p className="max-w-2xl text-sm text-slate-600">
          Suis l&apos;activite globale, controle les utilisateurs et verifie les
          contenus crees dans l&apos;application.
        </p>
      </div>

      <section className="grid gap-4 md:grid-cols-4">
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
          <h2 className="text-lg font-semibold">Recettes les plus planifiees</h2>
          <div className="mt-4 space-y-3">
            {data.mostPlannedRecipes.map((recipe) => (
              <div
                key={recipe.id}
                className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3 last:border-0 last:pb-0"
              >
                <div>
                  <p className="font-medium">{recipe.title}</p>
                  <p className="text-sm text-slate-600">{recipe.ownerEmail}</p>
                </div>
                <span className="text-sm font-semibold">
                  {recipe.plannedCount}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <h2 className="text-lg font-semibold">Repartition des repas</h2>
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
              <p className="text-sm text-slate-600">
                Aucun repas planifie pour le moment.
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold">Dernieres recettes</h2>
        </div>
        <div className="mt-4 space-y-3">
          {data.recentRecipes.map((recipe) => (
            <div
              key={recipe.id}
              className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3 last:border-0 last:pb-0"
            >
              <div>
                <p className="font-medium">{recipe.title}</p>
                <p className="text-sm text-slate-600">{recipe.user.email}</p>
              </div>
              <span className="text-sm text-slate-500">
                {recipe.createdAt.toLocaleDateString("fr-FR")}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold">Utilisateurs</h2>
          <p className="text-sm text-slate-600">
            Accede au detail pour modifier un utilisateur, le supprimer ou
            consulter ses recettes.
          </p>
        </div>
        <AdminUserList users={data.users} />
      </section>
    </div>
  );
}

type AdminStatCardProps = {
  label: string;
  value: number;
  detail?: string;
};

function AdminStatCard({ label, value, detail }: AdminStatCardProps) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5">
      <p className="text-sm font-medium text-slate-600">{label}</p>
      <p className="mt-3 text-3xl font-semibold">{value}</p>
      {detail ? <p className="mt-2 text-xs text-slate-500">{detail}</p> : null}
    </div>
  );
}
