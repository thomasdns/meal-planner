import { CategoryList } from "@/features/categories/category-list";
import { CreateCategoryForm } from "@/features/categories/create-category-form";
import { getCurrentUserCategories } from "@/features/categories/categories.data";
import { CreateRecipeForm } from "@/features/recipes/create-recipe-form";
import { RecipeFilters } from "@/features/recipes/recipe-filters";
import { RecipeList } from "@/features/recipes/recipe-list";
import { getCurrentUserRecipes } from "@/features/recipes/recipes.data";

export const metadata = { title: "Recettes" };

type RecipesPageProps = {
  searchParams: Promise<{
    query?: string;
    categoryId?: string;
    maxTotalTime?: string;
  }>;
};

export default async function RecipesPage({ searchParams }: RecipesPageProps) {
  const filters = await searchParams;
  const maxTotalTime = filters.maxTotalTime
    ? Number(filters.maxTotalTime)
    : undefined;
  const [recipes, categories] = await Promise.all([
    getCurrentUserRecipes({
      query: filters.query,
      categoryId: filters.categoryId,
      maxTotalTime:
        maxTotalTime && Number.isFinite(maxTotalTime) ? maxTotalTime : undefined,
    }),
    getCurrentUserCategories(),
  ]);

  const categoryOptions = categories.map((category) => ({
    id: category.id,
    name: category.name,
  }));

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <div className="space-y-6">
        <div className="space-y-2">
          <p className="text-sm font-medium text-emerald-700">Bibliotheque</p>
          <h1 className="text-3xl font-semibold tracking-tight">Recettes</h1>
          <p className="max-w-2xl text-sm text-slate-600">
            Cree et retrouve les recettes qui serviront ensuite a construire ton
            planning hebdomadaire.
          </p>
        </div>

        <RecipeFilters
          categories={categoryOptions}
          defaultValues={{
            query: filters.query,
            categoryId: filters.categoryId,
            maxTotalTime: filters.maxTotalTime,
          }}
        />

        <RecipeList recipes={recipes} />
      </div>

      <aside className="space-y-6">
        <CreateRecipeForm categories={categoryOptions} />
        <CreateCategoryForm />
        <CategoryList categories={categories} />
      </aside>
    </div>
  );
}
