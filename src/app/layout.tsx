import type { Metadata } from "next";

import { CookieConsent } from "@/components/privacy/cookie-consent";
import { PrivacyAnalytics } from "@/components/privacy/analytics";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Meal Planner",
    template: "%s | Meal Planner",
  },
  description: "Planificateur de repas hebdomadaire",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="h-full antialiased">
      <body className="flex min-h-full flex-col">
        <a
          href="#main-content"
          className="fixed left-4 top-4 z-[60] -translate-y-24 rounded-md bg-emerald-700 px-4 py-2 font-medium text-white focus:translate-y-0"
        >
          Aller au contenu principal
        </a>
        {children}
        <CookieConsent />
        <PrivacyAnalytics />
      </body>
    </html>
  );
}
