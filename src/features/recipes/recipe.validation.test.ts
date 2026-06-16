import { describe, expect, it } from "vitest";

import { createIngredientSchema } from "@/features/recipes/ingredient.validation";
import {
  createRecipeSchema,
  updateRecipeSchema,
} from "@/features/recipes/recipe.validation";

describe("recipe validation", () => {
  it("accepts a valid recipe payload", () => {
    const result = createRecipeSchema.safeParse({
      title: "Pates au pesto",
      description: "",
      servings: "4",
      categoryId: "",
    });

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data).toEqual({
        title: "Pates au pesto",
        description: undefined,
        servings: 4,
        categoryId: undefined,
      });
    }
  });

  it("rejects invalid servings", () => {
    const result = createRecipeSchema.safeParse({
      title: "Pates",
      servings: "0",
    });

    expect(result.success).toBe(false);
  });

  it("accepts a valid update payload", () => {
    const result = updateRecipeSchema.safeParse({
      title: "Pates au pesto rosso",
      description: "Version mise a jour",
      servings: "3",
      categoryId: "",
    });

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data).toEqual({
        title: "Pates au pesto rosso",
        description: "Version mise a jour",
        servings: 3,
        categoryId: undefined,
      });
    }
  });
});

describe("ingredient validation", () => {
  it("accepts an ingredient without quantity", () => {
    const result = createIngredientSchema.safeParse({
      name: "Tomates",
      quantity: "",
      unit: "",
    });

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data).toEqual({
        name: "Tomates",
        quantity: undefined,
        unit: undefined,
      });
    }
  });
});
