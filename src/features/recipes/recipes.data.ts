import "server-only";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";

export type RecipeListItem = {
  id: string;
  title: string;
  description: string | null;
  servings: number;
  categoryName: string | null;
  ingredientsCount: number;
  createdAt: Date;
};

export type RecipeIngredientItem = {
  id: string;
  name: string;
  quantity: number | null;
  unit: string | null;
};

export type RecipeDetail = {
  id: string;
  title: string;
  description: string | null;
  servings: number;
  prepTime: number | null;
  cookTime: number | null;
  steps: string | null;
  categoryId: string | null;
  categoryName: string | null;
  ingredients: RecipeIngredientItem[];
};

export async function getCurrentUserRecipes(): Promise<RecipeListItem[]> {
  const user = await requireUser();

  const recipes = await prisma.recipe.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      title: true,
      description: true,
      servings: true,
      createdAt: true,
      category: {
        select: {
          name: true,
        },
      },
      _count: {
        select: {
          ingredients: true,
        },
      },
    },
  });

  return recipes.map((recipe) => ({
    id: recipe.id,
    title: recipe.title,
    description: recipe.description,
    servings: recipe.servings,
    categoryName: recipe.category?.name ?? null,
    ingredientsCount: recipe._count.ingredients,
    createdAt: recipe.createdAt,
  }));
}

export async function getCurrentUserRecipeDetail(
  recipeId: string,
): Promise<RecipeDetail | null> {
  const user = await requireUser();

  const recipe = await prisma.recipe.findFirst({
    where: {
      id: recipeId,
      userId: user.id,
    },
    select: {
      id: true,
      title: true,
      description: true,
      servings: true,
      prepTime: true,
      cookTime: true,
      steps: true,
      categoryId: true,
      category: {
        select: {
          name: true,
        },
      },
      ingredients: {
        orderBy: {
          createdAt: "asc",
        },
        select: {
          id: true,
          name: true,
          quantity: true,
          unit: true,
        },
      },
    },
  });

  if (!recipe) {
    return null;
  }

  return {
    id: recipe.id,
    title: recipe.title,
    description: recipe.description,
    servings: recipe.servings,
    prepTime: recipe.prepTime,
    cookTime: recipe.cookTime,
    steps: recipe.steps,
    categoryId: recipe.categoryId,
    categoryName: recipe.category?.name ?? null,
    ingredients: recipe.ingredients,
  };
}

export async function createRecipeForCurrentUser(input: {
  title: string;
  description?: string;
  servings: number;
  prepTime?: number;
  cookTime?: number;
  steps?: string;
  categoryId?: string;
}) {
  const user = await requireUser();

  const category = input.categoryId
    ? await prisma.category.findFirst({
        where: {
          id: input.categoryId,
          userId: user.id,
        },
        select: {
          id: true,
        },
      })
    : null;

  if (input.categoryId && !category) {
    throw new Error("Forbidden category");
  }

  await prisma.recipe.create({
    data: {
      title: input.title,
      description: input.description,
      servings: input.servings,
      prepTime: input.prepTime,
      cookTime: input.cookTime,
      steps: input.steps,
      userId: user.id,
      categoryId: category?.id,
    },
  });
}

export async function updateRecipeForCurrentUser(
  recipeId: string,
  input: {
    title: string;
    description?: string;
    servings: number;
    prepTime?: number;
    cookTime?: number;
    steps?: string;
    categoryId?: string;
  },
) {
  const user = await requireUser();

  const recipe = await prisma.recipe.findFirst({
    where: {
      id: recipeId,
      userId: user.id,
    },
    select: {
      id: true,
    },
  });

  if (!recipe) {
    throw new Error("Recipe not found");
  }

  const category = input.categoryId
    ? await prisma.category.findFirst({
        where: {
          id: input.categoryId,
          userId: user.id,
        },
        select: {
          id: true,
        },
      })
    : null;

  if (input.categoryId && !category) {
    throw new Error("Forbidden category");
  }

  await prisma.recipe.update({
    where: {
      id: recipe.id,
    },
    data: {
      title: input.title,
      description: input.description,
      servings: input.servings,
      prepTime: input.prepTime ?? null,
      cookTime: input.cookTime ?? null,
      steps: input.steps ?? null,
      categoryId: category?.id ?? null,
    },
  });
}

export async function deleteRecipeForCurrentUser(recipeId: string) {
  const user = await requireUser();

  const recipe = await prisma.recipe.findFirst({
    where: {
      id: recipeId,
      userId: user.id,
    },
    select: {
      id: true,
    },
  });

  if (!recipe) {
    throw new Error("Recipe not found");
  }

  await prisma.recipe.delete({
    where: {
      id: recipe.id,
    },
  });
}

export async function createIngredientForCurrentUserRecipe(
  recipeId: string,
  input: {
    name: string;
    quantity?: number;
    unit?: string;
  },
) {
  const user = await requireUser();

  const recipe = await prisma.recipe.findFirst({
    where: {
      id: recipeId,
      userId: user.id,
    },
    select: {
      id: true,
    },
  });

  if (!recipe) {
    throw new Error("Recipe not found");
  }

  await prisma.recipeIngredient.create({
    data: {
      name: input.name,
      quantity: input.quantity,
      unit: input.unit,
      recipeId: recipe.id,
    },
  });
}

export async function updateIngredientForCurrentUser(
  ingredientId: string,
  input: {
    name: string;
    quantity?: number;
    unit?: string;
  },
) {
  const user = await requireUser();

  const ingredient = await prisma.recipeIngredient.findFirst({
    where: {
      id: ingredientId,
      recipe: {
        userId: user.id,
      },
    },
    select: {
      id: true,
      recipeId: true,
    },
  });

  if (!ingredient) {
    throw new Error("Ingredient not found");
  }

  await prisma.recipeIngredient.update({
    where: {
      id: ingredient.id,
    },
    data: {
      name: input.name,
      quantity: input.quantity ?? null,
      unit: input.unit ?? null,
    },
  });

  return ingredient.recipeId;
}

export async function deleteIngredientForCurrentUser(ingredientId: string) {
  const user = await requireUser();

  const ingredient = await prisma.recipeIngredient.findFirst({
    where: {
      id: ingredientId,
      recipe: {
        userId: user.id,
      },
    },
    select: {
      id: true,
      recipeId: true,
    },
  });

  if (!ingredient) {
    throw new Error("Ingredient not found");
  }

  await prisma.recipeIngredient.delete({
    where: {
      id: ingredient.id,
    },
  });

  return ingredient.recipeId;
}
