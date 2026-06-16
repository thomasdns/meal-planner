import { SignUpForm } from "@/features/auth/sign-up-form";

export default function SignUpPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6">
      <div className="mb-8 space-y-3">
        <p className="text-sm font-medium text-emerald-700">Meal Planner</p>
        <h1 className="text-3xl font-semibold tracking-tight">
          Creer un compte
        </h1>
        <p className="text-sm text-gray-600">
          Cree ton espace pour organiser tes recettes et planifier tes repas.
        </p>
      </div>

      <SignUpForm />
    </main>
  );
}
