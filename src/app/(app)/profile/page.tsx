import { DeleteAccountForm } from "@/features/profile/delete-account-form";
import { DataExportPanel } from "@/features/profile/data-export-panel";
import { ProfileForm } from "@/features/profile/profile-form";
import { ProfileSummary } from "@/features/profile/profile-summary";
import { getCurrentUserProfile } from "@/features/profile/profile.data";
import { SignOutButton } from "@/features/auth/sign-out-button";

export const metadata = { title: "Profil" };

export default async function ProfilePage() {
  const profile = await getCurrentUserProfile();

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <div className="space-y-6">
        <div className="space-y-2">
          <p className="text-sm font-medium text-emerald-700">Compte</p>
          <h1 className="text-3xl font-semibold tracking-tight">Profil</h1>
          <p className="max-w-2xl text-sm text-slate-600">
            Consulte les informations de ton compte et mets a jour ton nom ou
            ton email.
          </p>
        </div>

        <ProfileForm name={profile.name} email={profile.email} />
        <section className="space-y-4 rounded-lg border border-slate-200 bg-white p-5">
          <div>
            <h2 className="text-lg font-semibold">Session</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Termine ta session sur cet appareil lorsque tu as fini
              d&apos;utiliser l&apos;application.
            </p>
          </div>
          <SignOutButton />
        </section>
        <DataExportPanel />
        {profile.role === "ADMIN" ? (
          <section className="space-y-2 rounded-lg border border-amber-200 bg-amber-50 p-5">
            <h2 className="text-lg font-semibold text-amber-900">
              Suppression du compte indisponible
            </h2>
            <p className="text-sm leading-6 text-amber-900">
              Un compte administrateur ne peut pas etre supprime depuis le
              profil afin de proteger l&apos;administration de l&apos;application.
            </p>
          </section>
        ) : (
          <DeleteAccountForm />
        )}
      </div>

      <aside>
        <ProfileSummary profile={profile} />
      </aside>
    </div>
  );
}
