import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/sign-in");
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <div className="space-y-2">
        <p className="text-sm font-medium text-emerald-700">Meal Planner</p>
        <h1 className="text-3xl font-semibold tracking-tight">
          Tableau de bord
        </h1>
        <p className="text-sm text-gray-600">
          Bienvenue {session.user.name ?? session.user.email}.
        </p>
      </div>
    </main>
  );
}
