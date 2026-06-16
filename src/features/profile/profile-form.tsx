"use client";

import { useActionState } from "react";

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
  const [state, formAction, isPending] = useActionState(
    updateProfileAction,
    initialState,
  );

  return (
    <form
      action={formAction}
      className="space-y-4 rounded-lg border border-slate-200 bg-white p-5"
    >
      <div>
        <h2 className="text-lg font-semibold">Informations personnelles</h2>
        <p className="text-sm text-slate-600">
          Ton email sert d&apos;identifiant de connexion. Si tu le modifies, il
          faudra utiliser le nouvel email a la prochaine connexion.
        </p>
      </div>

      {state.error ? (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      ) : null}

      {state.success ? (
        <p className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          {state.success}
        </p>
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
          defaultValue={name ?? ""}
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
          defaultValue={email ?? ""}
          className="w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-emerald-600"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex rounded-md bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Mise a jour..." : "Mettre a jour"}
      </button>
    </form>
  );
}
