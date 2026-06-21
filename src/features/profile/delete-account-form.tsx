"use client";

import { signOut } from "next-auth/react";
import {
  useActionState,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";

import { deleteAccountAction } from "@/features/profile/profile.actions";

const initialState = {
  error: undefined,
  success: false,
};

export function DeleteAccountForm() {
  const [isOpen, setIsOpen] = useState(false);
  const titleId = useId();
  const descriptionId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const [state, formAction, isPending] = useActionState(
    deleteAccountAction,
    initialState,
  );

  useEffect(() => {
    if (state.success) {
      void signOut({ callbackUrl: "/auth/sign-in" });
    }
  }, [state.success]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const triggerElement = triggerRef.current;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const focusableElements = dialogRef.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), input:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
      );

      if (!focusableElements?.length) {
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      triggerElement?.focus();
    };
  }, [isOpen]);

  return (
    <section className="space-y-4 rounded-lg border border-red-200 bg-white p-5">
      <div>
        <h2 className="text-lg font-semibold text-red-700">Zone dangereuse</h2>
        <p className="mt-2 text-sm text-slate-600">
          Cette action supprime ton compte, tes recettes, tes categories, ton
          planning et tes sessions. Elle est definitive.
        </p>
      </div>

      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex rounded-md border border-red-300 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Supprimer mon compte
      </button>

      {isOpen ? (
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={descriptionId}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4"
        >
          <form
            action={formAction}
            className="w-full max-w-md space-y-4 rounded-lg bg-white p-6 shadow-xl"
          >
            <div>
              <h3 id={titleId} className="text-lg font-semibold text-red-700">
                Confirmer la suppression
              </h3>
              <p id={descriptionId} className="mt-2 text-sm text-slate-600">
                Cette action est irreversible. Toutes tes donnees personnelles
                seront supprimees.
              </p>
            </div>

            {state.error ? (
              <p role="alert" className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {state.error}
              </p>
            ) : null}

            <div className="space-y-1">
              <label
                htmlFor="delete-confirmation"
                className="text-sm font-medium"
              >
                Tape SUPPRIMER pour confirmer
              </label>
              <input
                id="delete-confirmation"
                name="confirmation"
                type="text"
                autoComplete="off"
                required
                autoFocus
                className="w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-red-600"
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={isPending}
                className="inline-flex rounded-md bg-red-700 px-4 py-2 text-sm font-medium text-white hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isPending ? "Suppression..." : "Confirmer"}
              </button>
              <button
                type="button"
                disabled={isPending}
                onClick={() => setIsOpen(false)}
                className="button-secondary"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </section>
  );
}
