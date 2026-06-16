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
    categoryName: recipe.category?.name ?? null,
    ingredients: recipe.ingredients,
  };
}

export async function createRecipeForCurrentUser(input: {
  title: string;
  description?: string;
  servings: number;
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
      userId: user.id,
      categoryId: category?.id,
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
