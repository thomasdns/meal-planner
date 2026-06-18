import Link from "next/link";

import { ResetPasswordForm } from "@/features/auth/reset-password-form";

export const metadata = { title: "Reinitialiser le mot de passe" };

type ResetPasswordPageProps = {
  searchParams: Promise<{
    token?: string;
  }>;
};

export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const { token } = await searchParams;

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6">
      <div className="mb-8 space-y-3">
        <p className="text-sm font-medium text-emerald-700">Meal Planner</p>
        <h1 className="text-3xl font-semibold tracking-tight">
          Nouveau mot de passe
        </h1>
        <p className="text-sm text-gray-600">
          Choisis un nouveau mot de passe robuste.
        </p>
      </div>

      {token ? (
        <ResetPasswordForm token={token} />
      ) : (
        <div className="space-y-3 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <p>Lien de reinitialisation manquant.</p>
          <Link href="/auth/forgot-password" className="font-medium underline">
            Demander un nouveau lien
          </Link>
        </div>
      )}
    </main>
  );
}
