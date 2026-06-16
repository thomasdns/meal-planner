export type ShoppingListIngredientSource = {
  recipeTitle: string;
  ingredient: {
    name: string;
    quantity: number | null;
    unit: string | null;
  };
};

export type ShoppingListItemView = {
  key: string;
  name: string;
  quantity: number | null;
  unit: string | null;
  recipeTitles: string[];
};

export function aggregateShoppingListItems(
  sources: ShoppingListIngredientSource[],
): ShoppingListItemView[] {
  const groupedItems = new Map<string, ShoppingListItemView>();

  for (const source of sources) {
    const key = getIngredientKey(source.ingredient.name, source.ingredient.unit);
    const existingItem = groupedItems.get(key);

    if (existingItem) {
      existingItem.quantity = addQuantities(
        existingItem.quantity,
        source.ingredient.quantity,
      );
      if (!existingItem.recipeTitles.includes(source.recipeTitle)) {
        existingItem.recipeTitles.push(source.recipeTitle);
      }
      continue;
    }

    groupedItems.set(key, {
      key,
      name: source.ingredient.name,
      quantity: source.ingredient.quantity,
      unit: source.ingredient.unit,
      recipeTitles: [source.recipeTitle],
    });
  }

  return Array.from(groupedItems.values()).sort((left, right) =>
    left.name.localeCompare(right.name, "fr-FR"),
  );
}

function getIngredientKey(name: string, unit: string | null) {
  return `${name.trim().toLowerCase()}::${unit?.trim().toLowerCase() ?? ""}`;
}

function addQuantities(left: number | null, right: number | null) {
  if (left === null || right === null) {
    return left ?? right;
  }

  return left + right;
}
