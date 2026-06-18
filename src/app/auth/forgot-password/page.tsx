import { ForgotPasswordForm } from "@/features/auth/forgot-password-form";

export const metadata = { title: "Mot de passe oublie" };

export default function ForgotPasswordPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6">
      <div className="mb-8 space-y-3">
        <p className="text-sm font-medium text-emerald-700">Meal Planner</p>
        <h1 className="text-3xl font-semibold tracking-tight">
          Mot de passe oublie
        </h1>
        <p className="text-sm text-gray-600">
          Renseigne ton email pour generer un lien de reinitialisation.
        </p>
      </div>

      <ForgotPasswordForm />
    </main>
  );
}
