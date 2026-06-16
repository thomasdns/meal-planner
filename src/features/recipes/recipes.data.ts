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

export async function createRecipeForCurrentUser(input: {
  title: string;
  description?: string;
  servings: number;
}) {
  const user = await requireUser();

  await prisma.recipe.create({
    data: {
      title: input.title,
      description: input.description,
      servings: input.servings,
      userId: user.id,
    },
  });
}
