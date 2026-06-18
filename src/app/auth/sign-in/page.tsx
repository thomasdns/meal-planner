import { SignInForm } from "@/features/auth/sign-in-form";

export const metadata = { title: "Connexion" };

type SignInPageProps = {
  searchParams: Promise<{
    registered?: string;
    emailChanged?: string;
  }>;
};

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const { registered, emailChanged } = await searchParams;

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6">
      <div className="mb-8 space-y-3">
        <p className="text-sm font-medium text-emerald-700">Meal Planner</p>
        <h1 className="text-3xl font-semibold tracking-tight">Connexion</h1>
        <p className="text-sm text-gray-600">
          Connecte-toi pour retrouver tes recettes et ton planning.
        </p>
      </div>

      {registered === "1" ? (
        <div className="mb-4 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          Compte cree. Verifie ton adresse email avant de te connecter.
        </div>
      ) : null}

      {emailChanged === "1" ? (
        <div className="mb-4 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          Adresse modifiee. Verifie le nouvel email avant de te reconnecter.
        </div>
      ) : null}

      <SignInForm />
    </main>
  );
}
