import "server-only";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";

export type CategoryListItem = {
  id: string;
  name: string;
  color: string | null;
  recipesCount: number;
};

export async function getCurrentUserCategories(): Promise<CategoryListItem[]> {
  const user = await requireUser();

  const categories = await prisma.category.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      name: "asc",
    },
    select: {
      id: true,
      name: true,
      color: true,
      _count: {
        select: {
          recipes: true,
        },
      },
    },
  });

  return categories.map((category) => ({
    id: category.id,
    name: category.name,
    color: category.color,
    recipesCount: category._count.recipes,
  }));
}

export async function createCategoryForCurrentUser(input: {
  name: string;
  color?: string;
}) {
  const user = await requireUser();

  await prisma.category.create({
    data: {
      name: input.name,
      color: input.color,
      userId: user.id,
    },
  });
}

export async function updateCategoryForCurrentUser(
  categoryId: string,
  input: {
    name: string;
    color?: string;
  },
) {
  const user = await requireUser();

  const category = await prisma.category.findFirst({
    where: {
      id: categoryId,
      userId: user.id,
    },
    select: {
      id: true,
    },
  });

  if (!category) {
    throw new Error("Category not found");
  }

  await prisma.category.update({
    where: {
      id: category.id,
    },
    data: {
      name: input.name,
      color: input.color,
    },
  });
}

export async function deleteCategoryForCurrentUser(categoryId: string) {
  const user = await requireUser();

  const category = await prisma.category.findFirst({
    where: {
      id: categoryId,
      userId: user.id,
    },
    select: {
      id: true,
    },
  });

  if (!category) {
    throw new Error("Category not found");
  }

  await prisma.category.delete({
    where: {
      id: category.id,
    },
  });
}
