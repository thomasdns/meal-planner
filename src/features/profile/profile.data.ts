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

type ProfileUpdateInput = {
  name: string;
  email: string;
};

export async function validateCurrentUserProfileUpdate(input: ProfileUpdateInput) {
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

  const currentUser = await prisma.user.findUniqueOrThrow({
    where: {
      id: user.id,
    },
    select: {
      email: true,
    },
  });
  const hasEmailChanged = currentUser.email !== input.email;

  return {
    userId: user.id,
    hasEmailChanged,
  };
}

export async function updateCurrentUserProfile(
  userId: string,
  input: ProfileUpdateInput,
  hasEmailChanged: boolean,
) {
  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      name: input.name,
      email: input.email,
      ...(hasEmailChanged
        ? {
            emailVerified: null,
            sessionVersion: {
              increment: 1,
            },
          }
        : {}),
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
