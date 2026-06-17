"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { SignOutButton } from "@/features/auth/sign-out-button";

type NavigationItem = {
  href: string;
  label: string;
};

type AppNavigationProps = {
  items: NavigationItem[];
};

export function AppNavigation({ items }: AppNavigationProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:flex md:items-center">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-300 text-slate-700 hover:bg-slate-100 md:hidden"
        aria-expanded={isOpen}
        aria-controls="mobile-navigation"
        aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
      >
        <svg
          aria-hidden="true"
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          {isOpen ? (
            <>
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </>
          ) : (
            <>
              <path d="M4 7h16" />
              <path d="M4 12h16" />
              <path d="M4 17h16" />
            </>
          )}
        </svg>
      </button>

      <nav
        id="mobile-navigation"
        aria-label="Navigation principale"
        className={`${isOpen ? "block" : "hidden"} absolute left-0 right-0 top-full z-40 border-b border-slate-200 bg-white px-4 py-4 shadow-sm md:static md:block md:border-0 md:bg-transparent md:p-0 md:shadow-none`}
      >
        <ul className="flex flex-col gap-1 md:flex-row md:flex-wrap md:items-center md:gap-2">
          {items.map((item) => {
            const isActive = pathname === item.href;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex rounded-md px-3 py-2 text-sm font-medium ${
                    isActive
                      ? "bg-emerald-50 text-emerald-800"
                      : "text-slate-700 hover:bg-slate-100 hover:text-slate-950"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
          <li className="pt-2 md:pt-0">
            <SignOutButton />
          </li>
        </ul>
      </nav>
    </div>
  );
}
