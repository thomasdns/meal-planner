import type { CurrentUserProfile } from "@/features/profile/profile.data";

type ProfileSummaryProps = {
  profile: CurrentUserProfile;
};

export function ProfileSummary({ profile }: ProfileSummaryProps) {
  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-slate-200 bg-white p-5">
        <p className="text-sm font-medium text-slate-600">Compte cree le</p>
        <p className="mt-2 text-lg font-semibold">
          {new Intl.DateTimeFormat("fr-FR", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          }).format(profile.createdAt)}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
        <Stat label="Recettes" value={profile.stats.recipesCount} />
        <Stat label="Categories" value={profile.stats.categoriesCount} />
        <Stat label="Repas planifies" value={profile.stats.plannedMealsCount} />
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5">
      <p className="text-sm font-medium text-slate-600">{label}</p>
      <p className="mt-3 text-3xl font-semibold">{value}</p>
    </div>
  );
}
