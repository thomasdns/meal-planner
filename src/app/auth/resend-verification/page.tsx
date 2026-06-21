import { ResendEmailVerificationForm } from "@/features/auth/resend-email-verification-form";

export const metadata = { title: "Renvoyer la verification email" };

export default function ResendEmailVerificationPage() {
  return (
    <main id="main-content" tabIndex={-1} className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6">
      <div className="mb-8 space-y-3">
        <p className="text-sm font-medium text-emerald-700">Meal Planner</p>
        <h1 className="text-3xl font-semibold tracking-tight">
          Verification email
        </h1>
        <p className="text-sm text-gray-600">
          Renseigne ton adresse pour recevoir un nouveau lien de verification
          valable pendant 24 heures.
        </p>
      </div>

      <ResendEmailVerificationForm />
    </main>
  );
}
