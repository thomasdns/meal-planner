import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  createRecipeForCurrentUser: vi.fn(),
  logError: vi.fn(),
  revalidatePath: vi.fn(),
}));

vi.mock("next/cache", () => ({
  revalidatePath: mocks.revalidatePath,
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

vi.mock("@/features/recipes/recipes.data", () => ({
  createRecipeForCurrentUser: mocks.createRecipeForCurrentUser,
  deleteRecipeForCurrentUser: vi.fn(),
  updateRecipeForCurrentUser: vi.fn(),
}));

vi.mock("@/lib/logger", () => ({
  logError: mocks.logError,
}));

import { createRecipeAction } from "@/features/recipes/recipe.actions";

describe("createRecipeAction integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.createRecipeForCurrentUser.mockResolvedValue({ id: "recipe-1" });
  });

  it("rejects invalid recipe data", async () => {
    const result = await createRecipeAction({}, createRecipeFormData(""));

    expect(result.error).toBeDefined();
    expect(mocks.createRecipeForCurrentUser).not.toHaveBeenCalled();
  });

  it("creates a valid recipe and revalidates the list", async () => {
    const result = await createRecipeAction(
      {},
      createRecipeFormData("Soupe de legumes"),
    );

    expect(result).toEqual({});
    expect(mocks.createRecipeForCurrentUser).toHaveBeenCalledOnce();
    expect(mocks.revalidatePath).toHaveBeenCalledWith("/recipes");
  });

  it("logs an unexpected persistence failure", async () => {
    const databaseError = new Error("database unavailable");
    mocks.createRecipeForCurrentUser.mockRejectedValue(databaseError);

    const result = await createRecipeAction(
      {},
      createRecipeFormData("Soupe de legumes"),
    );

    expect(result).toEqual({
      error: "Impossible de creer la recette avec cette categorie.",
    });
    expect(mocks.logError).toHaveBeenCalledWith(
      "server_action_failed",
      databaseError,
      { action: "createRecipe" },
    );
  });
});

function createRecipeFormData(title: string) {
  const formData = new FormData();
  formData.set("title", title);
  formData.set("description", "Une recette de test.");
  formData.set("servings", "2");
  formData.set("prepTime", "10");
  formData.set("cookTime", "20");
  formData.set("steps", "Preparer puis servir.");
  formData.set("imageUrl", "");
  formData.set("categoryId", "");
  return formData;
}
