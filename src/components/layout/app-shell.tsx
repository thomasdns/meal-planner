import Link from "next/link";

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
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-4 md:flex-row md:items-center md:justify-between">
          <div>
            <Link href="/dashboard" className="text-lg font-semibold">
              Meal Planner
            </Link>
          </div>

          <nav aria-label="Navigation principale">
            <ul className="flex flex-wrap gap-2">
              {items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="inline-flex rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-950"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-6 py-8">{children}</main>
    </div>
  );
}
