import type { RecipeIngredientItem } from "@/features/recipes/recipes.data";

type IngredientListProps = {
  ingredients: RecipeIngredientItem[];
};

export function IngredientList({ ingredients }: IngredientListProps) {
  if (ingredients.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center">
        <h2 className="text-lg font-semibold">Aucun ingredient</h2>
        <p className="mt-2 text-sm text-slate-600">
          Ajoute les ingredients necessaires pour preparer cette recette.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-slate-200 bg-slate-50 text-slate-600">
          <tr>
            <th className="px-4 py-3 font-medium">Ingredient</th>
            <th className="px-4 py-3 font-medium">Quantite</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {ingredients.map((ingredient) => (
            <tr key={ingredient.id}>
              <td className="px-4 py-3 font-medium">{ingredient.name}</td>
              <td className="px-4 py-3 text-slate-600">
                {formatQuantity(ingredient.quantity, ingredient.unit)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function formatQuantity(quantity: number | null, unit: string | null) {
  if (!quantity && !unit) {
    return "Non precisee";
  }

  return [quantity, unit].filter(Boolean).join(" ");
}
