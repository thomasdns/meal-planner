"use client";

import {
  resetShoppingListChecksAction,
  toggleShoppingListItemAction,
} from "@/features/shopping-list/shopping-list.actions";
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
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 print:hidden">
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-100"
        >
          Imprimer
        </button>
        <a
          href={createCsvDataUrl(shoppingList.items)}
          download={`liste-courses-${shoppingList.startDate}.csv`}
          className="inline-flex rounded-md bg-emerald-700 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-800"
        >
          Exporter CSV
        </a>
        <form
          action={resetShoppingListChecksAction}
          onSubmit={(event) => {
            if (!window.confirm("Reinitialiser tous les elements coches ?")) {
              event.preventDefault();
            }
          }}
        >
          <button
            type="submit"
            className="inline-flex rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-100"
          >
            Reinitialiser
          </button>
        </form>
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 text-slate-600">
            <tr>
              <th className="px-4 py-3 font-medium print:hidden">Fait</th>
              <th className="px-4 py-3 font-medium">Ingredient</th>
              <th className="px-4 py-3 font-medium">Quantite</th>
              <th className="px-4 py-3 font-medium">Recettes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {shoppingList.items.map((item) => {
              const checkedClass = item.checked
                ? "text-slate-400 line-through"
                : "";

              return (
                <tr
                  key={item.key}
                  className={item.checked ? "bg-slate-50" : ""}
                >
                  <td className="px-4 py-3 print:hidden">
                    <form action={toggleShoppingListItemAction}>
                      <input type="hidden" name="name" value={item.name} />
                      <input
                        type="hidden"
                        name="unit"
                        value={item.unit ?? ""}
                      />
                      <input
                        name="checked"
                        type="checkbox"
                        defaultChecked={item.checked}
                        onChange={(event) =>
                          event.currentTarget.form?.requestSubmit()
                        }
                        className="h-4 w-4 rounded border-slate-300 text-emerald-700"
                        aria-label={`Marquer ${item.name}`}
                      />
                    </form>
                  </td>
                  <td className={`px-4 py-3 font-medium ${checkedClass}`}>
                    {item.name}
                  </td>
                  <td className={`px-4 py-3 ${checkedClass || "text-slate-700"}`}>
                    {formatQuantity(item.quantity, item.unit)}
                  </td>
                  <td className={`px-4 py-3 ${checkedClass || "text-slate-600"}`}>
                    {item.recipeTitles.join(", ")}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function formatQuantity(quantity: number | null, unit: string | null) {
  if (!quantity && !unit) {
    return "Non precisee";
  }

  return [quantity, unit].filter(Boolean).join(" ");
}

function createCsvDataUrl(items: WeeklyShoppingList["items"]) {
  const rows = [
    ["Ingredient", "Quantite", "Unite", "Coche", "Recettes"],
    ...items.map((item) => [
      item.name,
      item.quantity?.toString() ?? "",
      item.unit ?? "",
      item.checked ? "oui" : "non",
      item.recipeTitles.join(", "),
    ]),
  ];
  const separator = ";";
  const csv = rows
    .map((row) =>
      row
        .map((cell) => `"${cell.replaceAll('"', '""')}"`)
        .join(separator),
    )
    .join("\r\n");

  return `data:text/csv;charset=utf-8,${encodeURIComponent(`\uFEFF${csv}`)}`;
}
