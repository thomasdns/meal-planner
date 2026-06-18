import Link from "next/link";

import type { AdminUserListItem } from "@/features/admin/admin.data";

type AdminUserListProps = {
  users: AdminUserListItem[];
};

export function AdminUserList({ users }: AdminUserListProps) {
  if (users.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center">
        <h2 className="text-lg font-semibold">Aucun utilisateur</h2>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3 md:hidden">
        {users.map((user) => (
          <article
            key={user.id}
            className="rounded-lg border border-slate-200 bg-white p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="truncate text-sm font-semibold">
                  {user.name ?? "Sans nom"}
                </h3>
                <p className="mt-1 break-all text-sm text-slate-600">
                  {user.email}
                </p>
              </div>
              <RoleBadge role={user.role} />
            </div>

            <dl className="mt-4 grid grid-cols-3 gap-3 text-sm">
              <Stat label="Recettes" value={user.recipesCount} />
              <Stat label="Categories" value={user.categoriesCount} />
              <Stat label="Repas" value={user.plannedMealsCount} />
            </dl>

            <div className="mt-4 flex items-center justify-between gap-3">
              <p className="text-xs text-slate-500">
                Inscrit le {user.createdAt.toLocaleDateString("fr-FR")}
              </p>
              <Link
                href={`/admin/users/${user.id}`}
                className="inline-flex rounded-md bg-emerald-700 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-800"
              >
                Gerer
              </Link>
            </div>
          </article>
        ))}
      </div>

      <div className="hidden overflow-hidden rounded-lg border border-slate-200 bg-white md:block">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-slate-600">
            <tr>
              <th className="px-4 py-3 font-medium">Utilisateur</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Recettes</th>
              <th className="px-4 py-3 font-medium">Repas planifies</th>
              <th className="px-4 py-3 font-medium">Inscription</th>
              <th className="px-4 py-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-4 py-3">
                  <p className="font-medium">{user.name ?? "Sans nom"}</p>
                  <p className="text-slate-600">{user.email}</p>
                </td>
                <td className="px-4 py-3">
                  <RoleBadge role={user.role} />
                </td>
                <td className="px-4 py-3">{user.recipesCount}</td>
                <td className="px-4 py-3">{user.plannedMealsCount}</td>
                <td className="px-4 py-3">
                  {user.createdAt.toLocaleDateString("fr-FR")}
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/users/${user.id}`}
                    className="font-medium text-emerald-700 hover:text-emerald-800"
                  >
                    Gerer
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function RoleBadge({ role }: { role: AdminUserListItem["role"] }) {
  const isAdmin = role === "ADMIN";

  return (
    <span
      className={`shrink-0 rounded-full px-2 py-1 text-xs font-medium ${
        isAdmin
          ? "bg-emerald-100 text-emerald-800"
          : "bg-slate-100 text-slate-700"
      }`}
    >
      {isAdmin ? "Administrateur" : "Utilisateur"}
    </span>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <dt className="text-xs text-slate-500">{label}</dt>
      <dd className="mt-1 font-semibold">{value}</dd>
    </div>
  );
}
