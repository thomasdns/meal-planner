import Link from "next/link";

import { AdminStatistics } from "@/features/admin/admin-statistics";
import { AdminUsersPanel } from "@/features/admin/admin-users-panel";
import {
  getAdminStatisticsData,
  getAdminUsersData,
} from "@/features/admin/admin.data";
import {
  adminStatisticsPeriodSchema,
  adminUserFiltersSchema,
} from "@/features/admin/admin.validation";

type AdminView = "users" | "statistics";

type AdminPageProps = {
  searchParams: Promise<{
    view?: string | string[];
    q?: string | string[];
    role?: string | string[];
    page?: string | string[];
    period?: string | string[];
  }>;
};

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const params = await searchParams;
  const activeView: AdminView =
    firstSearchParam(params.view) === "statistics" ? "statistics" : "users";
  const filters = adminUserFiltersSchema.parse({
    query: firstSearchParam(params.q),
    role: firstSearchParam(params.role) || undefined,
    page: firstSearchParam(params.page),
  });
  const statisticsPeriod = adminStatisticsPeriodSchema.parse(
    firstSearchParam(params.period),
  );

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <p className="text-sm font-medium text-emerald-700">Administration</p>
        <h1 className="text-3xl font-semibold tracking-tight">
          Pilotage de l&apos;application
        </h1>
        <p className="max-w-2xl text-sm text-slate-600">
          Gere les utilisateurs et consulte les indicateurs de l&apos;application.
        </p>
      </div>

      <nav
        aria-label="Sections de l'administration"
        className="flex gap-6 border-b border-slate-200"
      >
        <AdminTab href="/admin?view=users" active={activeView === "users"}>
          Utilisateurs
        </AdminTab>
        <AdminTab
          href="/admin?view=statistics"
          active={activeView === "statistics"}
        >
          Statistiques
        </AdminTab>
      </nav>

      {activeView === "statistics" ? (
        <AdminStatistics
          data={await getAdminStatisticsData(statisticsPeriod)}
          periodDays={statisticsPeriod}
        />
      ) : (
        <AdminUsersPanel
          data={await getAdminUsersData(filters)}
          filters={filters}
        />
      )}
    </div>
  );
}

function AdminTab({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`border-b-2 px-1 pb-3 text-sm font-medium ${
        active
          ? "border-emerald-700 text-emerald-800"
          : "border-transparent text-slate-600 hover:border-slate-300 hover:text-slate-950"
      }`}
    >
      {children}
    </Link>
  );
}

function firstSearchParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] ?? "" : value ?? "";
}
