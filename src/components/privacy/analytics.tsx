"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useSyncExternalStore } from "react";

import {
  getConsentSnapshot,
  getServerConsentSnapshot,
  parseConsentSnapshot,
  subscribeToConsent,
} from "@/components/privacy/consent-storage";

const configuredGoogleAnalyticsId = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID;
const googleAnalyticsId =
  configuredGoogleAnalyticsId && /^G-[A-Z0-9]+$/.test(configuredGoogleAnalyticsId)
    ? configuredGoogleAnalyticsId
    : undefined;

export function PrivacyAnalytics() {
  const pathname = usePathname();
  const consentSnapshot = useSyncExternalStore(
    subscribeToConsent,
    getConsentSnapshot,
    getServerConsentSnapshot,
  );
  const consent = useMemo(
    () => parseConsentSnapshot(consentSnapshot),
    [consentSnapshot],
  );

  useEffect(() => {
    if (!googleAnalyticsId) {
      return;
    }

    const disableKey = `ga-disable-${googleAnalyticsId}`;
    const analyticsPath = sanitizeAnalyticsPath(pathname);
    const analyticsAllowed = Boolean(consent?.audience && analyticsPath);
    Reflect.set(window, disableKey, !analyticsAllowed);

    if (!analyticsAllowed || !analyticsPath) {
      window.gtag?.("consent", "update", deniedGoogleConsent);
      return;
    }

    configureGoogleAnalytics(analyticsPath);
  }, [consent?.audience, pathname]);

  return (
    <>
      {googleAnalyticsId && consent?.audience ? (
        <>
          <Script
            id="google-analytics"
            src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`}
            strategy="afterInteractive"
          />
        </>
      ) : null}
    </>
  );
}

const deniedGoogleConsent = {
  analytics_storage: "denied",
  ad_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied",
};

const grantedGoogleConsent = {
  ...deniedGoogleConsent,
  analytics_storage: "granted",
};

function configureGoogleAnalytics(pathname: string) {
  if (!googleAnalyticsId) {
    return;
  }

  Reflect.set(window, `ga-disable-${googleAnalyticsId}`, false);
  window.dataLayer ??= [];

  if (!window.gtag) {
    window.gtag = (...args: unknown[]) => {
      window.dataLayer?.push(args);
    };
    window.gtag("consent", "default", deniedGoogleConsent);
    window.gtag("js", new Date());
  }

  window.gtag("consent", "update", grantedGoogleConsent);
  window.gtag("config", googleAnalyticsId, {
    page_path: pathname,
    anonymize_ip: true,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  });
}

function sanitizeAnalyticsPath(pathname: string) {
  if (
    pathname.startsWith("/auth/reset-password") ||
    pathname.startsWith("/auth/verify-email/confirm")
  ) {
    return null;
  }

  return pathname
    .replace(/^\/recipes\/[^/]+$/, "/recipes/[recipeId]")
    .replace(/^\/admin\/users\/[^/]+$/, "/admin/users/[userId]");
}

declare global {
  interface Window {
    [key: string]: unknown;
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}
