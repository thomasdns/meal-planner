import Link from "next/link";

import { AdminUserList } from "@/features/admin/admin-user-list";
import type { getAdminUsersData } from "@/features/admin/admin.data";
import type { AdminUserFilters } from "@/features/admin/admin.validation";

type AdminUsersPanelProps = {
  data: Awaited<ReturnType<typeof getAdminUsersData>>;
  filters: AdminUserFilters;
};

export function AdminUsersPanel({ data, filters }: AdminUsersPanelProps) {
  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold">Utilisateurs</h2>
          <p className="text-sm text-slate-600">
            {data.pagination.totalItems} compte
            {data.pagination.totalItems > 1 ? "s" : ""} trouve
            {data.pagination.totalItems > 1 ? "s" : ""}.
          </p>
        </div>
        <p className="text-sm text-slate-500">
          Page {data.pagination.currentPage} sur {data.pagination.totalPages}
        </p>
      </div>

      <form
        action="/admin"
        className="grid gap-3 border-y border-slate-200 py-4 sm:grid-cols-[minmax(0,1fr)_220px_auto]"
      >
        <input type="hidden" name="view" value="users" />
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
              href="/admin?view=users"
              className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              Effacer
            </Link>
          ) : null}
        </div>
      </form>

      <AdminUserList users={data.users} />

      {data.pagination.totalPages > 1 ? (
        <nav
          aria-label="Pagination des utilisateurs"
          className="flex items-center justify-between gap-4 border-t border-slate-200 pt-4"
        >
          {data.pagination.currentPage > 1 ? (
            <PaginationLink
              filters={filters}
              page={data.pagination.currentPage - 1}
            >
              Precedent
            </PaginationLink>
          ) : (
            <span />
          )}
          <span className="text-sm text-slate-600">
            {getPageRange(data.pagination)} sur {data.pagination.totalItems}
          </span>
          {data.pagination.currentPage < data.pagination.totalPages ? (
            <PaginationLink
              filters={filters}
              page={data.pagination.currentPage + 1}
            >
              Suivant
            </PaginationLink>
          ) : (
            <span />
          )}
        </nav>
      ) : null}
    </section>
  );
}

function PaginationLink({
  filters,
  page,
  children,
}: {
  filters: AdminUserFilters;
  page: number;
  children: React.ReactNode;
}) {
  const params = new URLSearchParams({ view: "users", page: String(page) });

  if (filters.query) params.set("q", filters.query);
  if (filters.role) params.set("role", filters.role);

  return (
    <Link
      href={`/admin?${params.toString()}`}
      className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium hover:bg-slate-100"
    >
      {children}
    </Link>
  );
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
