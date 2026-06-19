"use client";

import { useState } from "react";

import { ActionMessage } from "@/components/ui/action-message";
import {
  resetShoppingListChecksAction,
  toggleShoppingListItemAction,
} from "@/features/shopping-list/shopping-list.actions";
import type { WeeklyShoppingList } from "@/features/shopping-list/shopping-list.data";
import { confirmationMessages } from "@/lib/confirmation-messages";

type ShoppingListProps = {
  shoppingList: WeeklyShoppingList;
};

export function ShoppingList({ shoppingList }: ShoppingListProps) {
  const [items, setItems] = useState(shoppingList.items);
  const [isResetting, setIsResetting] = useState(false);
  const [error, setError] = useState<string>();

  if (items.length === 0) {
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
      {error ? <ActionMessage tone="error">{error}</ActionMessage> : null}
      <div className="flex flex-wrap gap-3 print:hidden">
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-100"
        >
          Imprimer
        </button>
        <a
          href={createCsvDataUrl(items)}
          download={`liste-courses-${shoppingList.startDate}.csv`}
          className="inline-flex rounded-md bg-emerald-700 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-800"
        >
          Exporter CSV
        </a>
        <form
          onSubmit={async (event) => {
            event.preventDefault();
            if (!window.confirm(confirmationMessages.resetShoppingList)) {
              return;
            }

            setIsResetting(true);
            setError(undefined);
            const result = await resetShoppingListChecksAction();
            if (result?.success) {
              setItems((currentItems) =>
                currentItems.map((item) => ({ ...item, checked: false })),
              );
            } else if (result?.error) {
              setError(result.error);
            }
            setIsResetting(false);
          }}
        >
          <button
            type="submit"
            disabled={isResetting}
            className="inline-flex rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-800 hover:bg-slate-100"
          >
            {isResetting ? "Reinitialisation..." : "Reinitialiser"}
          </button>
        </form>
      </div>

      <div className="space-y-3 md:hidden">
        {items.map((item) => {
          const checkedClass = item.checked
            ? "text-slate-600 line-through"
            : "";

          return (
            <article
              key={item.key}
              className={`rounded-lg border border-slate-200 bg-white p-4 ${
                item.checked ? "bg-slate-50" : ""
              }`}
            >
              <div className="flex items-start gap-3">
                <ShoppingCheckForm
                  key={`${item.key}-${item.checked}`}
                  item={item}
                  onCheckedChange={(checked) => {
                    setItems((currentItems) =>
                      currentItems.map((currentItem) =>
                        currentItem.key === item.key
                          ? { ...currentItem, checked }
                          : currentItem,
                      ),
                    );
                  }}
                  onError={setError}
                />
                <div className={`min-w-0 flex-1 ${checkedClass}`}>
                  <h2 className="break-words font-semibold">{item.name}</h2>
                  <p className="mt-1 text-sm">
                    {formatQuantity(item.quantity, item.unit)}
                  </p>
                  <p className="mt-2 break-words text-sm text-slate-600">
                    {item.recipeTitles.join(", ")}
                  </p>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <div className="hidden overflow-x-auto rounded-lg border border-slate-200 bg-white md:block">
        <table className="w-full text-left text-sm">
          <caption className="sr-only">
            Ingredients de la liste de courses
          </caption>
          <thead className="border-b border-slate-200 bg-slate-50 text-slate-600">
            <tr>
              <th scope="col" className="px-4 py-3 font-medium print:hidden">Fait</th>
              <th scope="col" className="px-4 py-3 font-medium">Ingredient</th>
              <th scope="col" className="px-4 py-3 font-medium">Quantite</th>
              <th scope="col" className="px-4 py-3 font-medium">Recettes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {items.map((item) => {
              const checkedClass = item.checked
                ? "text-slate-600 line-through"
                : "";

              return (
                <tr
                  key={item.key}
                  className={item.checked ? "bg-slate-50" : ""}
                >
                  <td className="px-4 py-3 print:hidden">
                    <ShoppingCheckForm
                      key={`${item.key}-${item.checked}`}
                      item={item}
                      onCheckedChange={(checked) => {
                        setItems((currentItems) =>
                          currentItems.map((currentItem) =>
                            currentItem.key === item.key
                              ? { ...currentItem, checked }
                              : currentItem,
                          ),
                        );
                      }}
                      onError={setError}
                    />
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

function ShoppingCheckForm({
  item,
  onCheckedChange,
  onError,
}: {
  item: WeeklyShoppingList["items"][number];
  onCheckedChange: (checked: boolean) => void;
  onError: (error: string | undefined) => void;
}) {
  const [isPending, setIsPending] = useState(false);

  return (
    <form
      className="shrink-0"
      onSubmit={async (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        setIsPending(true);
        onError(undefined);
        const result = await toggleShoppingListItemAction(formData);
        if (result?.success) {
          onCheckedChange(result.checked);
        } else if (result?.error) {
          onError(result.error);
        }
        setIsPending(false);
      }}
    >
      <input type="hidden" name="name" value={item.name} />
      <input type="hidden" name="unit" value={item.unit ?? ""} />
      <input
        type="hidden"
        name="checked"
        value={item.checked ? "off" : "on"}
      />
      <button
        type="submit"
        disabled={isPending}
        aria-pressed={item.checked}
        aria-label={`${
          item.checked ? "Marquer comme non achete" : "Marquer comme achete"
        } : ${item.name}`}
        className="flex h-10 w-10 items-center justify-center rounded-md hover:bg-slate-100"
      >
        <span
          aria-hidden="true"
          className={`flex h-5 w-5 items-center justify-center rounded border text-sm font-bold ${
            item.checked
              ? "border-emerald-700 bg-emerald-700 text-white"
              : "border-slate-300 bg-white text-transparent"
          }`}
        >
          {"\u2713"}
        </span>
      </button>
    </form>
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
