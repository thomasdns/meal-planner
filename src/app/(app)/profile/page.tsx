import { ProfileForm } from "@/features/profile/profile-form";
import { ProfileSummary } from "@/features/profile/profile-summary";
import { getCurrentUserProfile } from "@/features/profile/profile.data";

export default async function ProfilePage() {
  const profile = await getCurrentUserProfile();

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <div className="space-y-6">
        <div className="space-y-2">
          <p className="text-sm font-medium text-emerald-700">Compte</p>
          <h1 className="text-3xl font-semibold tracking-tight">Profil</h1>
          <p className="max-w-2xl text-sm text-slate-600">
            Consulte les informations de ton compte et mets a jour ton nom
            affiche.
          </p>
        </div>

        <ProfileForm name={profile.name} email={profile.email} />
      </div>

      <aside>
        <ProfileSummary profile={profile} />
      </aside>
    </div>
  );
}
