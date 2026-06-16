import { CreateRecipeForm } from "@/features/recipes/create-recipe-form";
import { RecipeList } from "@/features/recipes/recipe-list";
import { getCurrentUserRecipes } from "@/features/recipes/recipes.data";

export default async function RecipesPage() {
  const recipes = await getCurrentUserRecipes();

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

        <RecipeList recipes={recipes} />
      </div>

      <aside>
        <CreateRecipeForm />
      </aside>
    </div>
  );
}
