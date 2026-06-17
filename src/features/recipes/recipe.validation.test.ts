import { describe, expect, it } from "vitest";

import {
  createIngredientSchema,
  updateIngredientSchema,
} from "@/features/recipes/ingredient.validation";
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
      imageUrl: "",
    });

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data).toEqual({
        title: "Pates au pesto",
        description: undefined,
        servings: 4,
        prepTime: undefined,
        cookTime: undefined,
        steps: undefined,
        imageUrl: undefined,
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
      prepTime: "10",
      cookTime: "15",
      steps: "Melanger puis servir.",
      imageUrl: "https://example.com/pates.jpg",
      categoryId: "",
    });

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data).toEqual({
        title: "Pates au pesto rosso",
        description: "Version mise a jour",
        servings: 3,
        prepTime: 10,
        cookTime: 15,
        steps: "Melanger puis servir.",
        imageUrl: "https://example.com/pates.jpg",
        categoryId: undefined,
      });
    }
  });

  it("rejects invalid recipe time", () => {
    const result = updateRecipeSchema.safeParse({
      title: "Pates",
      servings: "2",
      prepTime: "-1",
    });

    expect(result.success).toBe(false);
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

  it("accepts an ingredient update", () => {
    const result = updateIngredientSchema.safeParse({
      name: "Tomates cerises",
      quantity: "250",
      unit: "g",
    });

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data).toEqual({
        name: "Tomates cerises",
        quantity: 250,
        unit: "g",
      });
    }
  });
});
