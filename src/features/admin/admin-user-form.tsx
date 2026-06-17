"use client";

import { useActionState } from "react";

import { updateAdminUserAction } from "@/features/admin/admin.actions";
import { UserRole } from "@/lib/roles";

type AdminUserFormProps = {
  user: {
    id: string;
    name: string | null;
    email: string;
    role: UserRole;
  };
};

const initialState = {
  error: undefined,
  success: undefined,
};

export function AdminUserForm({ user }: AdminUserFormProps) {
  const [state, formAction, isPending] = useActionState(
    updateAdminUserAction.bind(null, user.id),
    initialState,
  );

  return (
    <form
      action={formAction}
      className="space-y-4 rounded-lg border border-slate-200 bg-white p-5"
    >
      <div>
        <h2 className="text-lg font-semibold">Modifier l&apos;utilisateur</h2>
        <p className="text-sm text-slate-600">
          L&apos;email sert d&apos;identifiant de connexion. Il doit rester
          unique.
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
        <label htmlFor="admin-user-name" className="text-sm font-medium">
          Nom
        </label>
        <input
          id="admin-user-name"
          name="name"
          type="text"
          defaultValue={user.name ?? ""}
          className="w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-emerald-600"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="admin-user-email" className="text-sm font-medium">
          Email
        </label>
        <input
          id="admin-user-email"
          name="email"
          type="email"
          required
          defaultValue={user.email}
          className="w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-emerald-600"
        />
      </div>

      <div className="space-y-1">
        <label htmlFor="admin-user-role" className="text-sm font-medium">
          Role
        </label>
        <select
          id="admin-user-role"
          name="role"
          required
          defaultValue={user.role}
          className="w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-emerald-600"
        >
          <option value={UserRole.USER}>Utilisateur</option>
          <option value={UserRole.ADMIN}>Administrateur</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex rounded-md bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Enregistrement..." : "Enregistrer"}
      </button>
    </form>
  );
}
