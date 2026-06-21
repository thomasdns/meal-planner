import Link from "next/link";

import { CookiePreferencesButton } from "@/components/privacy/cookie-preferences-button";
import { legalConfig } from "@/lib/legal";

const appLinks = [
  { href: "/dashboard", label: "Tableau de bord" },
  { href: "/recipes", label: "Recettes" },
  { href: "/meal-plan", label: "Planning" },
  { href: "/shopping-list", label: "Courses" },
  { href: "/profile", label: "Profil" },
];

const legalLinks = [
  { href: "/mentions-legales", label: "Mentions legales" },
  { href: "/politique-de-confidentialite", label: "Politique de confidentialité" },
];

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-slate-900 bg-slate-50 text-slate-700">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-10 text-sm sm:px-6 md:grid-cols-3">
        <nav aria-label="Plan du site">
          <h2 className="text-base font-semibold text-slate-950">Plan du site</h2>
          <ul className="mt-4 space-y-3">
            {appLinks.map((link) => (
              <li key={link.href}>
                <Link className="hover:text-emerald-700" href={link.href}>
                  {link.label}
                </Link>
              </li>
            ))}
            {legalLinks.map((link) => (
              <li key={link.href}>
                <Link className="hover:text-emerald-700 hover:underline" href={link.href}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="text-base font-semibold text-slate-950">Reseau</h2>
          <ul className="mt-4 space-y-3">
            <li>
              <a
                className="inline-flex items-center gap-2 hover:text-emerald-700"
                href="https://www.linkedin.com/in/thomas-das-neves/"
                rel="noreferrer"
                target="_blank"
              >
                <LinkedInIcon />
                <span>LinkedIn</span>
              </a>
            </li>
            <li>
              <a
                className="inline-flex items-center gap-2 hover:text-emerald-700"
                href="https://github.com/thomasdns/"
                rel="noreferrer"
                target="_blank"
              >
                <GitHubIcon />
                <span>GitHub</span>
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-base font-semibold text-slate-950">Contact</h2>
          <address className="mt-4 not-italic leading-6">
            {legalConfig.publisherName}
            <br />
            <a className="hover:text-emerald-700 hover:underline" href={`mailto:${legalConfig.privacyEmail}`}>
              {legalConfig.privacyEmail}
            </a>
          </address>
          <div className="mt-4">
            <CookiePreferencesButton variant="link" />
          </div>
        </div>
      </div>
      <div className="border-t border-slate-900 px-4 py-4 text-center text-sm text-slate-600">
        &copy; 2026 Meal Planner. Tous droits reserves.
      </div>
    </footer>
  );
}

function LinkedInIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4 shrink-0"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M20.45 20.45h-3.56v-5.58c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.95v5.67H9.34V8.98h3.42v1.57h.05a3.75 3.75 0 0 1 3.37-1.85c3.61 0 4.27 2.38 4.27 5.47v6.28ZM5.32 7.41a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14Zm1.78 13.04H3.53V8.98H7.1v11.47ZM22.23 0H1.77C.8 0 0 .77 0 1.72v20.56C0 23.23.8 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.72V1.72C24 .77 23.2 0 22.23 0Z" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4 shrink-0"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M12 .3a12 12 0 0 0-3.8 23.38c.6.1.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.08 1.83 2.82 1.3 3.5.99.12-.78.43-1.3.78-1.6-2.66-.3-5.46-1.33-5.46-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.17 0 0 1-.32 3.22 1.23a11.1 11.1 0 0 1 5.86 0c2.22-1.5 3.22-1.23 3.22-1.23.66 1.65.24 2.87.12 3.17.77.84 1.23 1.91 1.23 3.22 0 4.61-2.8 5.63-5.48 5.93.44.38.83 1.12.83 2.26v3.35c0 .32.22.7.83.58A12 12 0 0 0 12 .3Z" />
    </svg>
  );
}
