import Link from "next/link";
import { redirect } from "next/navigation";

type VerifyEmailPageProps = {
  searchParams: Promise<{
    status?: string;
    token?: string;
  }>;
};

export default async function VerifyEmailPage({
  searchParams,
}: VerifyEmailPageProps) {
  const { status, token } = await searchParams;

  if (token) {
    redirect(`/auth/verify-email/confirm?token=${encodeURIComponent(token)}`);
  }

  const result =
    status === "success"
      ? {
          success: true,
          message: "Email verifie avec succes.",
        }
      : {
          success: false,
          message:
            status === "invalid"
              ? "Ce lien de verification est invalide ou expire."
              : "Lien de verification manquant.",
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
