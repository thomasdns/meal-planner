import "server-only";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";

export type CurrentUserProfile = {
  id: string;
  name: string | null;
  email: string | null;
  createdAt: Date;
  stats: {
    recipesCount: number;
    categoriesCount: number;
    plannedMealsCount: number;
  };
};

export async function getCurrentUserProfile(): Promise<CurrentUserProfile> {
  const user = await requireUser();

  const [profile, recipesCount, categoriesCount, plannedMealsCount] =
    await Promise.all([
      prisma.user.findUniqueOrThrow({
        where: {
          id: user.id,
        },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
        },
      }),
      prisma.recipe.count({
        where: {
          userId: user.id,
        },
      }),
      prisma.category.count({
        where: {
          userId: user.id,
        },
      }),
      prisma.mealPlan.count({
        where: {
          userId: user.id,
        },
      }),
    ]);

  return {
    ...profile,
    stats: {
      recipesCount,
      categoriesCount,
      plannedMealsCount,
    },
  };
}

export async function updateCurrentUserProfile(input: {
  name: string;
  email: string;
}) {
  const user = await requireUser();

  const existingUser = await prisma.user.findFirst({
    where: {
      email: input.email,
      NOT: {
        id: user.id,
      },
    },
    select: {
      id: true,
    },
  });

  if (existingUser) {
    throw new Error("Email already used");
  }

  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      name: input.name,
      email: input.email,
    },
  });
}

export async function deleteCurrentUserAccount() {
  const user = await requireUser();

  await prisma.user.delete({
    where: {
      id: user.id,
    },
  });
}
