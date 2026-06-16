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
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-slate-200 bg-slate-50 text-slate-600">
          <tr>
            <th className="px-4 py-3 font-medium">Utilisateur</th>
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
  );
}
