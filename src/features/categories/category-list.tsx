import type { CategoryListItem } from "@/features/categories/categories.data";

type CategoryListProps = {
  categories: CategoryListItem[];
};

export function CategoryList({ categories }: CategoryListProps) {
  if (categories.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 bg-white p-5">
        <h2 className="text-base font-semibold">Aucune categorie</h2>
        <p className="mt-2 text-sm text-slate-600">
          Ajoute une premiere categorie pour organiser tes recettes.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {categories.map((category) => (
        <div
          key={category.id}
          className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4"
        >
          <div className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className="h-4 w-4 rounded-full border border-slate-200"
              style={{ backgroundColor: category.color ?? "#047857" }}
            />
            <div>
              <h3 className="text-sm font-semibold">{category.name}</h3>
              <p className="text-xs text-slate-500">
                {category.recipesCount} recette
                {category.recipesCount > 1 ? "s" : ""}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
