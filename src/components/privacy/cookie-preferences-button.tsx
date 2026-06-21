"use client";

type CookiePreferencesButtonProps = {
  variant?: "button" | "link";
};

export function CookiePreferencesButton({
  variant = "button",
}: CookiePreferencesButtonProps) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event("meal-planner:open-cookie-preferences"))}
      className={
        variant === "link"
          ? "text-left hover:text-emerald-700 hover:underline"
          : "button-secondary"
      }
    >
      Modifier mes preferences cookies
    </button>
  );
}
