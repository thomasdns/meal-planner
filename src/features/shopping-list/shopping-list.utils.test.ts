import { describe, expect, it } from "vitest";

import { aggregateShoppingListItems } from "@/features/shopping-list/shopping-list.utils";

describe("aggregateShoppingListItems", () => {
  it("groups ingredients by normalized name and unit", () => {
    const items = aggregateShoppingListItems([
      {
        recipeTitle: "Pates au pesto",
        ingredient: {
          name: "Tomates",
          quantity: 2,
          unit: "piece",
        },
      },
      {
        recipeTitle: "Salade",
        ingredient: {
          name: " tomates ",
          quantity: 3,
          unit: "piece",
        },
      },
    ]);

    expect(items).toEqual([
      {
        key: "tomates::piece",
        name: "Tomates",
        quantity: 5,
        unit: "piece",
        checked: false,
        recipeTitles: ["Pates au pesto", "Salade"],
      },
    ]);
  });

  it("keeps separate quantities when units differ", () => {
    const items = aggregateShoppingListItems([
      {
        recipeTitle: "Sauce",
        ingredient: {
          name: "Creme",
          quantity: 20,
          unit: "cl",
        },
      },
      {
        recipeTitle: "Dessert",
        ingredient: {
          name: "Creme",
          quantity: 200,
          unit: "g",
        },
      },
    ]);

    expect(items).toHaveLength(2);
  });
});
