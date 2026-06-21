"use client";

/* eslint-disable react/no-unescaped-entities */

import { useEffect, useId, useMemo, useRef, useState, useSyncExternalStore } from "react";

import {
  getConsentSnapshot,
  getServerConsentSnapshot,
  migrateLegacyConsent,
  parseConsentSnapshot,
  saveConsent,
  subscribeToConsent,
} from "@/components/privacy/consent-storage";

export function CookieConsent() {
  const [isManuallyOpen, setIsManuallyOpen] = useState(false);
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);

  const consentSnapshot = useSyncExternalStore(subscribeToConsent, getConsentSnapshot, getServerConsentSnapshot);
  const consent = useMemo(() => parseConsentSnapshot(consentSnapshot), [consentSnapshot]);
  const isOpen = isManuallyOpen || !consent;

  useEffect(() => {
    migrateLegacyConsent();
  }, []);

  useEffect(() => {
    function openPreferences() {
      setIsManuallyOpen(true);
    }

    window.addEventListener("meal-planner:open-cookie-preferences", openPreferences);
    return () => window.removeEventListener("meal-planner:open-cookie-preferences", openPreferences);
  }, []);

  useEffect(() => {
    if (isOpen) {
      panelRef.current?.focus();
    }
  }, [isOpen]);

  function choose(value: boolean) {
    saveConsent(value);
    setIsManuallyOpen(false);
  }

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-700 bg-slate-950 p-4 text-white shadow-[0_-8px_30px_rgba(15,23,42,0.35)] sm:p-5">
      <section
        ref={panelRef}
        tabIndex={-1}
        aria-labelledby={titleId}
        className="mx-auto grid max-w-6xl gap-4 outline-none lg:grid-cols-[1fr_auto] lg:items-center"
      >
        <div>
          <h2 id={titleId} className="sr-only">Choix des cookies</h2>
          <p className="max-w-4xl text-sm leading-6 text-slate-100">
            Ce site utilise des cookies necessaires au fonctionnement du compte.
            Google Analytics mesure l'audience et certaines interactions
            uniquement apres ton accord, sans recevoir le contenu saisi dans
            les formulaires.{" "}
            <a href="/politique-de-confidentialite#cookies" className="font-semibold text-white underline underline-offset-2">
              En savoir plus.
            </a>
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={() => choose(false)} className="rounded-md bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-200">
            Refuser
          </button>
          <button type="button" onClick={() => choose(true)} className="rounded-md bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-200">
            Accepter
          </button>
        </div>
      </section>
    </div>
  );
}
