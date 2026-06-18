import Link from "next/link";

import { AppNavigation } from "@/components/layout/app-navigation";

const navigationItems = [
  { href: "/dashboard", label: "Tableau de bord" },
  { href: "/recipes", label: "Recettes" },
  { href: "/meal-plan", label: "Planning" },
  { href: "/shopping-list", label: "Courses" },
  { href: "/profile", label: "Profil" },
];

type AppShellProps = {
  children: React.ReactNode;
  showAdminNav?: boolean;
};

export function AppShell({ children, showAdminNav = false }: AppShellProps) {
  const items = showAdminNav
    ? [...navigationItems, { href: "/admin", label: "Admin" }]
    : navigationItems;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <a
        href="#main-content"
        className="fixed left-4 top-4 z-[60] -translate-y-24 rounded-md bg-emerald-700 px-4 py-2 font-medium text-white focus:translate-y-0"
      >
        Aller au contenu principal
      </a>
      <header className="border-b border-slate-200 bg-white">
        <div className="relative mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div>
            <Link href="/dashboard" className="text-lg font-semibold">
              Meal Planner
            </Link>
          </div>

          <AppNavigation items={items} />
        </div>
      </header>

      <main
        id="main-content"
        tabIndex={-1}
        className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8"
      >
        {children}
      </main>
    </div>
  );
}
