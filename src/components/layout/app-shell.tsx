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
  return (
    <div className="flex flex-1 flex-col bg-slate-50 text-slate-950">
      <AppHeader showAdminNav={showAdminNav} />

      <main
        id="main-content"
        tabIndex={-1}
        className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 sm:py-8"
      >
        {children}
      </main>
    </div>
  );
}

export function AppHeader({ showAdminNav = false }: Pick<AppShellProps, "showAdminNav">) {
  const items = showAdminNav
    ? [...navigationItems, { href: "/admin", label: "Admin" }]
    : navigationItems;

  return (
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
  );
}
