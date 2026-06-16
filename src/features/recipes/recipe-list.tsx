import Link from "next/link";

import type { RecipeListItem } from "@/features/recipes/recipes.data";

type RecipeListProps = {
  recipes: RecipeListItem[];
};

export function RecipeList({ recipes }: RecipeListProps) {
  if (recipes.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center">
        <h2 className="text-lg font-semibold">Aucune recette pour le moment</h2>
        <p className="mt-2 text-sm text-slate-600">
          Cree ta premiere recette pour commencer a construire ton planning.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {recipes.map((recipe) => (
        <article
          key={recipe.id}
          className="rounded-lg border border-slate-200 bg-white p-5"
        >
          <div className="space-y-2">
            <div>
              <p className="text-xs font-medium uppercase text-emerald-700">
                {recipe.categoryName ?? "Sans categorie"}
              </p>
              <h2 className="mt-1 text-lg font-semibold">
                <Link
                  href={`/recipes/${recipe.id}`}
                  className="hover:text-emerald-700"
                >
                  {recipe.title}
                </Link>
              </h2>
            </div>
            {recipe.description ? (
              <p className="text-sm text-slate-600">{recipe.description}</p>
            ) : null}
          </div>

          <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <div>
              <dt className="text-slate-500">Portions</dt>
              <dd className="font-medium">{recipe.servings}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Ingredients</dt>
              <dd className="font-medium">{recipe.ingredientsCount}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Temps</dt>
              <dd className="font-medium">
                {recipe.totalTime ? `${recipe.totalTime} min` : "-"}
              </dd>
            </div>
          </dl>

          <Link
            href={`/recipes/${recipe.id}`}
            className="mt-4 inline-flex text-sm font-medium text-emerald-700 hover:text-emerald-800"
          >
            Voir la recette
          </Link>
        </article>
      ))}
    </div>
  );
}
