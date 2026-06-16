type RecipeFiltersProps = {
  categories: {
    id: string;
    name: string;
  }[];
  defaultValues: {
    query?: string;
    categoryId?: string;
    maxTotalTime?: string;
  };
};

export function RecipeFilters({
  categories,
  defaultValues,
}: RecipeFiltersProps) {
  return (
    <form className="rounded-lg border border-slate-200 bg-white p-5">
      <div className="grid gap-4 md:grid-cols-[1fr_180px_160px_auto] md:items-end">
        <div className="space-y-1">
          <label htmlFor="query" className="text-sm font-medium">
            Recherche
          </label>
          <input
            id="query"
            name="query"
            type="search"
            defaultValue={defaultValues.query ?? ""}
            placeholder="Nom ou description"
            className="w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-emerald-600"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="categoryId" className="text-sm font-medium">
            Categorie
          </label>
          <select
            id="categoryId"
            name="categoryId"
            defaultValue={defaultValues.categoryId ?? ""}
            className="w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-emerald-600"
          >
            <option value="">Toutes</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label htmlFor="maxTotalTime" className="text-sm font-medium">
            Temps max
          </label>
          <input
            id="maxTotalTime"
            name="maxTotalTime"
            type="number"
            min={1}
            placeholder="min"
            defaultValue={defaultValues.maxTotalTime ?? ""}
            className="w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-emerald-600"
          />
        </div>

        <button
          type="submit"
          className="inline-flex justify-center rounded-md bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-800"
        >
          Filtrer
        </button>
      </div>
    </form>
  );
}
