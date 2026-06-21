export const consentStorageKey = "analytics-consent";
export const consentExpirationStorageKey = "analytics-consent-expires-at";
export const consentDurationMs = 183 * 24 * 60 * 60 * 1000;

const legacyConsentStorageKey = "meal-planner-consent-v1";

export type ConsentChoice = {
  audience: boolean;
};

export function subscribeToConsent(onStoreChange: () => void) {
  function handleStorage(event: StorageEvent) {
    if (
      event.key === consentStorageKey ||
      event.key === consentExpirationStorageKey ||
      event.key === legacyConsentStorageKey
    ) {
      onStoreChange();
    }
  }

  window.addEventListener("storage", handleStorage);
  window.addEventListener("meal-planner:consent-changed", onStoreChange);
  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener("meal-planner:consent-changed", onStoreChange);
  };
}

export function getConsentSnapshot() {
  const choice = window.localStorage.getItem(consentStorageKey);
  const expiresAt = window.localStorage.getItem(consentExpirationStorageKey);

  if (choice && expiresAt) {
    return `${choice}|${expiresAt}`;
  }

  return readLegacyConsentSnapshot();
}

export function getServerConsentSnapshot() {
  return null;
}

export function parseConsentSnapshot(rawValue: string | null): ConsentChoice | null {
  if (!rawValue) {
    return null;
  }

  const separatorIndex = rawValue.indexOf("|");
  const choice = rawValue.slice(0, separatorIndex);
  const expiresAt = rawValue.slice(separatorIndex + 1);

  if (
    separatorIndex === -1 ||
    (choice !== "accepted" && choice !== "refused") ||
    !expiresAt ||
    new Date(expiresAt).getTime() <= Date.now()
  ) {
    return null;
  }

  return {
    audience: choice === "accepted",
  };
}

export function readConsent(): ConsentChoice | null {
  const choice = parseConsentSnapshot(getConsentSnapshot());
  if (!choice) {
    clearStoredConsent();
  }

  return choice;
}

export function migrateLegacyConsent() {
  const legacySnapshot = readLegacyConsentSnapshot();

  if (!legacySnapshot) {
    return;
  }

  const [choice, expiresAt] = legacySnapshot.split("|");

  if (!parseConsentSnapshot(legacySnapshot) || !expiresAt) {
    window.localStorage.removeItem(legacyConsentStorageKey);
    return;
  }

  window.localStorage.setItem(consentStorageKey, choice);
  window.localStorage.setItem(consentExpirationStorageKey, expiresAt);
  window.localStorage.removeItem(legacyConsentStorageKey);
  window.dispatchEvent(new Event("meal-planner:consent-changed"));
}

export function saveConsent(audience: boolean) {
  const expiresAt = new Date(Date.now() + consentDurationMs).toISOString();

  window.localStorage.setItem(
    consentStorageKey,
    audience ? "accepted" : "refused",
  );
  window.localStorage.setItem(consentExpirationStorageKey, expiresAt);
  window.localStorage.removeItem(legacyConsentStorageKey);
  window.dispatchEvent(new Event("meal-planner:consent-changed"));

  if (!audience) {
    deleteGoogleAnalyticsCookies();
  }

  return {
    audience,
  };
}

function readLegacyConsentSnapshot() {
  const rawLegacyChoice = window.localStorage.getItem(legacyConsentStorageKey);

  if (!rawLegacyChoice) {
    return null;
  }

  try {
    const legacyChoice = JSON.parse(rawLegacyChoice) as {
      audience?: unknown;
      expiresAt?: unknown;
    };

    if (
      typeof legacyChoice.audience !== "boolean" ||
      typeof legacyChoice.expiresAt !== "string"
    ) {
      return null;
    }

    return `${legacyChoice.audience ? "accepted" : "refused"}|${legacyChoice.expiresAt}`;
  } catch {
    return null;
  }
}

function clearStoredConsent() {
  window.localStorage.removeItem(consentStorageKey);
  window.localStorage.removeItem(consentExpirationStorageKey);
  window.localStorage.removeItem(legacyConsentStorageKey);
}

function deleteGoogleAnalyticsCookies() {
  document.cookie.split(";").forEach((cookie) => {
    const name = cookie.split("=")[0]?.trim();

    if (name && (name === "_ga" || name === "_gid" || name.startsWith("_ga_"))) {
      document.cookie = `${name}=; Max-Age=0; path=/; SameSite=Lax`;
      document.cookie = `${name}=; Max-Age=0; path=/; domain=${window.location.hostname}; SameSite=Lax`;
    }
  });
}
