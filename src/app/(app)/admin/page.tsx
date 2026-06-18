import Link from "next/link";

import { AdminUserList } from "@/features/admin/admin-user-list";
import { getAdminDashboardData } from "@/features/admin/admin.data";
import { adminUserFiltersSchema } from "@/features/admin/admin.validation";

const mealTypeLabels: Record<string, string> = {
  BREAKFAST: "Petit-dejeuner",
  LUNCH: "Dejeuner",
  DINNER: "Diner",
  SNACK: "Snack",
};

type AdminPageProps = {
  searchParams: Promise<{
    q?: string | string[];
    role?: string | string[];
    page?: string | string[];
  }>;
};

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const params = await searchParams;
  const query = firstSearchParam(params.q);
  const role = firstSearchParam(params.role);
  const filters = adminUserFiltersSchema.parse({
    query,
    role: role || undefined,
    page: firstSearchParam(params.page),
  });
  const data = await getAdminDashboardData(filters);

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
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold">Utilisateurs</h2>
            <p className="text-sm text-slate-600">
              {data.usersPagination.totalItems} compte
              {data.usersPagination.totalItems > 1 ? "s" : ""} trouve
              {data.usersPagination.totalItems > 1 ? "s" : ""}.
            </p>
          </div>
          <p className="text-sm text-slate-500">
            Page {data.usersPagination.currentPage} sur {data.usersPagination.totalPages}
          </p>
        </div>

        <form
          action="/admin"
          className="grid gap-3 border-y border-slate-200 py-4 sm:grid-cols-[minmax(0,1fr)_220px_auto]"
        >
          <div>
            <label htmlFor="admin-user-query" className="text-sm font-medium">
              Rechercher
            </label>
            <input
              id="admin-user-query"
              name="q"
              type="search"
              defaultValue={filters.query}
              placeholder="Nom ou adresse email"
              className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-600"
            />
          </div>
          <div>
            <label htmlFor="admin-user-role-filter" className="text-sm font-medium">
              Role
            </label>
            <select
              id="admin-user-role-filter"
              name="role"
              defaultValue={filters.role ?? ""}
              className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-600"
            >
              <option value="">Tous les roles</option>
              <option value="USER">Utilisateurs</option>
              <option value="ADMIN">Administrateurs</option>
            </select>
          </div>
          <div className="flex items-end gap-2">
            <button
              type="submit"
              className="rounded-md bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-800"
            >
              Filtrer
            </button>
            {filters.query || filters.role ? (
              <Link
                href="/admin"
                className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                Effacer
              </Link>
            ) : null}
          </div>
        </form>

        <AdminUserList users={data.users} />

        {data.usersPagination.totalPages > 1 ? (
          <nav
            aria-label="Pagination des utilisateurs"
            className="flex items-center justify-between gap-4 border-t border-slate-200 pt-4"
          >
            {data.usersPagination.currentPage > 1 ? (
              <Link
                href={buildAdminPageHref(filters, data.usersPagination.currentPage - 1)}
                className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium hover:bg-slate-100"
              >
                Precedent
              </Link>
            ) : (
              <span />
            )}
            <span className="text-sm text-slate-600">
              {getPageRange(data.usersPagination)} sur {data.usersPagination.totalItems}
            </span>
            {data.usersPagination.currentPage < data.usersPagination.totalPages ? (
              <Link
                href={buildAdminPageHref(filters, data.usersPagination.currentPage + 1)}
                className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium hover:bg-slate-100"
              >
                Suivant
              </Link>
            ) : (
              <span />
            )}
          </nav>
        ) : null}
      </section>
    </div>
  );
}

function firstSearchParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}

function buildAdminPageHref(
  filters: { query: string; role?: "USER" | "ADMIN" },
  page: number,
) {
  const params = new URLSearchParams();

  if (filters.query) params.set("q", filters.query);
  if (filters.role) params.set("role", filters.role);
  params.set("page", String(page));

  return `/admin?${params.toString()}`;
}

function getPageRange(pagination: {
  currentPage: number;
  pageSize: number;
  totalItems: number;
}) {
  const first = (pagination.currentPage - 1) * pagination.pageSize + 1;
  const last = Math.min(
    pagination.currentPage * pagination.pageSize,
    pagination.totalItems,
  );

  return `${first}-${last}`;
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
