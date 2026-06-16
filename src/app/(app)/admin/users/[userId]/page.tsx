import Link from "next/link";
import { notFound } from "next/navigation";

import { AdminUserForm } from "@/features/admin/admin-user-form";
import { DeleteAdminUserForm } from "@/features/admin/delete-admin-user-form";
import { getAdminUserDetail } from "@/features/admin/admin.data";

type AdminUserDetailPageProps = {
  params: Promise<{
    userId: string;
  }>;
};

export default async function AdminUserDetailPage({
  params,
}: AdminUserDetailPageProps) {
  const { userId } = await params;
  const detail = await getAdminUserDetail(userId);

  if (!detail) {
    notFound();
  }

  const { adminId, user } = detail;

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <div className="space-y-6">
        <div className="space-y-3">
          <Link
            href="/admin"
            className="text-sm font-medium text-emerald-700 hover:text-emerald-800"
          >
            Retour a l&apos;administration
          </Link>
          <div>
            <p className="text-sm font-medium text-emerald-700">Utilisateur</p>
            <h1 className="text-3xl font-semibold tracking-tight">
              {user.name ?? "Sans nom"}
            </h1>
            <p className="mt-2 text-sm text-slate-600">{user.email}</p>
          </div>
        </div>

        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <p className="text-sm font-medium text-slate-600">Recettes</p>
            <p className="mt-3 text-3xl font-semibold">
              {user._count.recipes}
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <p className="text-sm font-medium text-slate-600">Categories</p>
            <p className="mt-3 text-3xl font-semibold">
              {user._count.categories}
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <p className="text-sm font-medium text-slate-600">
              Repas planifies
            </p>
            <p className="mt-3 text-3xl font-semibold">
              {user._count.mealPlans}
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <div>
              <h2 className="text-xl font-semibold">
                Recettes de l&apos;utilisateur
              </h2>
            <p className="text-sm text-slate-600">
              Liste des recettes associees a ce compte.
            </p>
          </div>

          {user.recipes.length > 0 ? (
            <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-slate-200 bg-slate-50 text-slate-600">
                  <tr>
                    <th className="px-4 py-3 font-medium">Recette</th>
                    <th className="px-4 py-3 font-medium">Categorie</th>
                    <th className="px-4 py-3 font-medium">Ingredients</th>
                    <th className="px-4 py-3 font-medium">Planifications</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {user.recipes.map((recipe) => (
                    <tr key={recipe.id}>
                      <td className="px-4 py-3">
                        <p className="font-medium">{recipe.title}</p>
                        <p className="text-slate-600">
                          {recipe.description ?? "Sans description"}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        {recipe.category?.name ?? "Sans categorie"}
                      </td>
                      <td className="px-4 py-3">
                        {recipe._count.ingredients}
                      </td>
                      <td className="px-4 py-3">{recipe._count.mealPlans}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center">
              <h3 className="text-lg font-semibold">Aucune recette</h3>
            </div>
          )}
        </section>
      </div>

      <aside className="space-y-6">
        <AdminUserForm user={user} />
        <DeleteAdminUserForm
          userId={user.id}
          isCurrentAdmin={adminId === user.id}
        />
      </aside>
    </div>
  );
}
