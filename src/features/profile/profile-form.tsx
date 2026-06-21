"use client";

import { useActionState, useState } from "react";

import { ActionMessage } from "@/components/ui/action-message";
import { updateProfileAction } from "@/features/profile/profile.actions";

const initialState = {
  error: undefined,
  success: undefined,
};

type ProfileFormProps = {
  name: string | null;
  email: string | null;
};

export function ProfileForm({ name, email }: ProfileFormProps) {
  const initialName = name ?? "";
  const initialEmail = email ?? "";
  const [currentName, setCurrentName] = useState(initialName);
  const [currentEmail, setCurrentEmail] = useState(initialEmail);
  const [state, formAction, isPending] = useActionState(
    updateProfileAction,
    initialState,
  );
  const hasChanged =
    currentName.trim() !== initialName.trim() ||
    currentEmail.trim().toLowerCase() !== initialEmail.trim().toLowerCase();

  return (
    <form
      action={formAction}
      className="space-y-4 rounded-lg border border-slate-200 bg-white p-5"
    >
      <div>
        <h2 className="text-lg font-semibold">Informations personnelles</h2>
        <p className="text-sm text-slate-600">
          Ton email sert d&apos;identifiant de connexion. Si tu le modifies, il
          faudra verifier la nouvelle adresse avant de te reconnecter.
        </p>
      </div>

      {state.error ? (
        <ActionMessage tone="error">{state.error}</ActionMessage>
      ) : null}

      {state.success ? (
        <ActionMessage tone="success">{state.success}</ActionMessage>
      ) : null}

      <div className="space-y-1">
        <label htmlFor="name" className="text-sm font-medium">
          Nom affiche
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          value={currentName}
          onChange={(event) => setCurrentName(event.target.value)}
          className="w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-emerald-600"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          value={currentEmail}
          onChange={(event) => setCurrentEmail(event.target.value)}
          className="w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-emerald-600"
        />
      </div>

      <button
        type="submit"
        disabled={isPending || !hasChanged}
        className="inline-flex rounded-md bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Mise a jour..." : "Mettre a jour"}
      </button>
    </form>
  );
}
