import Link from "next/link";
import { notFound } from "next/navigation";

import { getCurrentUserCategories } from "@/features/categories/categories.data";
import { CreateIngredientForm } from "@/features/recipes/create-ingredient-form";
import { DeleteRecipeForm } from "@/features/recipes/delete-recipe-form";
import { EditRecipeForm } from "@/features/recipes/edit-recipe-form";
import { IngredientList } from "@/features/recipes/ingredient-list";
import { getCurrentUserRecipeDetail } from "@/features/recipes/recipes.data";

type RecipeDetailPageProps = {
  params: Promise<{
    recipeId: string;
  }>;
};

export default async function RecipeDetailPage({
  params,
}: RecipeDetailPageProps) {
  const { recipeId } = await params;
  const [recipe, categories] = await Promise.all([
    getCurrentUserRecipeDetail(recipeId),
    getCurrentUserCategories(),
  ]);

  if (!recipe) {
    notFound();
  }

  const categoryOptions = categories.map((category) => ({
    id: category.id,
    name: category.name,
  }));

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <div className="space-y-6">
        <div className="space-y-3">
          <Link
            href="/recipes"
            className="text-sm font-medium text-emerald-700 hover:text-emerald-800"
          >
            Retour aux recettes
          </Link>
          <div>
            <p className="text-sm font-medium text-emerald-700">
              {recipe.categoryName ?? "Sans categorie"}
            </p>
            <h1 className="text-3xl font-semibold tracking-tight">
              {recipe.title}
            </h1>
            {recipe.description ? (
              <p className="mt-2 max-w-2xl text-sm text-slate-600">
                {recipe.description}
              </p>
            ) : null}
          </div>
        </div>

        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <p className="text-sm font-medium text-slate-600">Portions</p>
            <p className="mt-3 text-3xl font-semibold">{recipe.servings}</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <p className="text-sm font-medium text-slate-600">Ingredients</p>
            <p className="mt-3 text-3xl font-semibold">
              {recipe.ingredients.length}
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <p className="text-sm font-medium text-slate-600">Temps total</p>
            <p className="mt-3 text-3xl font-semibold">-</p>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Ingredients</h2>
          <IngredientList ingredients={recipe.ingredients} />
        </section>
      </div>

      <aside className="space-y-6">
        <EditRecipeForm recipe={recipe} categories={categoryOptions} />
        <CreateIngredientForm recipeId={recipe.id} />
        <DeleteRecipeForm recipeId={recipe.id} />
      </aside>
    </div>
  );
}
