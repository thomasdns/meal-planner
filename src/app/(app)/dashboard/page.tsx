import { getCurrentUserDashboardData } from "@/features/dashboard/dashboard.data";
import { SummaryCard } from "@/features/dashboard/summary-card";
import { UpcomingMeals } from "@/features/dashboard/upcoming-meals";

export const metadata = { title: "Tableau de bord" };

export default async function DashboardPage() {
  const dashboard = await getCurrentUserDashboardData();

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm font-medium text-emerald-700">
          Vue d&apos;ensemble
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">
          Tableau de bord
        </h1>
        <p className="max-w-2xl text-sm text-slate-600">
          Retrouve ici les indicateurs importants de ta semaine : repas
          planifies, recettes recentes et liste de courses a preparer.
        </p>
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          label="Repas planifies"
          value={dashboard.summary.plannedMealsCount}
          helper="Cette semaine"
        />
        <SummaryCard
          label="Recettes"
          value={dashboard.summary.recipesCount}
          helper="Dans ta bibliotheque"
        />
        <SummaryCard
          label="Categories"
          value={dashboard.summary.categoriesCount}
          helper="Pour organiser tes recettes"
        />
        <SummaryCard
          label="Articles de courses"
          value={dashboard.summary.shoppingItemsCount}
          helper="Generes depuis le planning"
        />
      </section>

      <UpcomingMeals meals={dashboard.upcomingMeals} />
    </div>
  );
}
