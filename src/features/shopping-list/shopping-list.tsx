import type { WeeklyShoppingList } from "@/features/shopping-list/shopping-list.data";

type ShoppingListProps = {
  shoppingList: WeeklyShoppingList;
};

export function ShoppingList({ shoppingList }: ShoppingListProps) {
  if (shoppingList.items.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center">
        <h2 className="text-lg font-semibold">Liste vide</h2>
        <p className="mt-2 text-sm text-slate-600">
          Planifie des recettes avec ingredients pour generer automatiquement ta
          liste de courses.
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
            <th className="px-4 py-3 font-medium">Recettes</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {shoppingList.items.map((item) => (
            <tr key={item.key}>
              <td className="px-4 py-3 font-medium">{item.name}</td>
              <td className="px-4 py-3 text-slate-700">
                {formatQuantity(item.quantity, item.unit)}
              </td>
              <td className="px-4 py-3 text-slate-600">
                {item.recipeTitles.join(", ")}
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
