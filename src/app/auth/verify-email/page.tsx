import Link from "next/link";

import { verifyEmailToken } from "@/features/auth/email-verification.actions";

type VerifyEmailPageProps = {
  searchParams: Promise<{
    token?: string;
  }>;
};

export default async function VerifyEmailPage({
  searchParams,
}: VerifyEmailPageProps) {
  const { token } = await searchParams;
  const result = token
    ? await verifyEmailToken(token)
    : {
        success: false,
        message: "Lien de verification manquant.",
      };

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6">
      <div className="mb-8 space-y-3">
        <p className="text-sm font-medium text-emerald-700">Meal Planner</p>
        <h1 className="text-3xl font-semibold tracking-tight">
          Verification email
        </h1>
        <p className="text-sm text-gray-600">{result.message}</p>
      </div>

      <Link
        href={result.success ? "/profile" : "/auth/sign-in"}
        className="inline-flex justify-center rounded-md bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-800"
      >
        {result.success ? "Retour au profil" : "Retour a la connexion"}
      </Link>
    </main>
  );
}
