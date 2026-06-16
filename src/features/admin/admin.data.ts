import "server-only";

import { updateAdminUserSchema } from "@/features/admin/admin.validation";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export type AdminUserListItem = {
  id: string;
  name: string | null;
  email: string;
  createdAt: Date;
  recipesCount: number;
  categoriesCount: number;
  plannedMealsCount: number;
};

export async function getAdminDashboardData() {
  await requireAdmin();

  const since = new Date();
  since.setDate(since.getDate() - 7);

  const [
    usersCount,
    recipesCount,
    categoriesCount,
    ingredientsCount,
    mealPlansCount,
    newUsersCount,
    usersWithoutRecipesCount,
    users,
    mostPlannedRecipes,
    mealTypeStats,
    recentRecipes,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.recipe.count(),
    prisma.category.count(),
    prisma.recipeIngredient.count(),
    prisma.mealPlan.count(),
    prisma.user.count({
      where: {
        createdAt: {
          gte: since,
        },
      },
    }),
    prisma.user.count({
      where: {
        recipes: {
          none: {},
        },
      },
    }),
    prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        _count: {
          select: {
            recipes: true,
            categories: true,
            mealPlans: true,
          },
        },
      },
    }),
    prisma.recipe.findMany({
      orderBy: {
        mealPlans: {
          _count: "desc",
        },
      },
      take: 5,
      select: {
        id: true,
        title: true,
        user: {
          select: {
            email: true,
          },
        },
        _count: {
          select: {
            mealPlans: true,
          },
        },
      },
    }),
    prisma.mealPlan.groupBy({
      by: ["mealType"],
      _count: {
        mealType: true,
      },
      orderBy: {
        mealType: "asc",
      },
    }),
    prisma.recipe.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
      select: {
        id: true,
        title: true,
        createdAt: true,
        user: {
          select: {
            email: true,
          },
        },
      },
    }),
  ]);

  return {
    stats: {
      usersCount,
      recipesCount,
      categoriesCount,
      ingredientsCount,
      mealPlansCount,
      newUsersCount,
      usersWithoutRecipesCount,
      averageRecipesPerUser:
        usersCount === 0 ? 0 : Number((recipesCount / usersCount).toFixed(1)),
    },
    users: users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      recipesCount: user._count.recipes,
      categoriesCount: user._count.categories,
      plannedMealsCount: user._count.mealPlans,
    })),
    mostPlannedRecipes: mostPlannedRecipes.map((recipe) => ({
      id: recipe.id,
      title: recipe.title,
      ownerEmail: recipe.user.email,
      plannedCount: recipe._count.mealPlans,
    })),
    mealTypeStats: mealTypeStats.map((item) => ({
      mealType: item.mealType,
      count: item._count.mealType,
    })),
    recentRecipes,
  };
}

export async function getAdminUserDetail(userId: string) {
  const admin = await requireAdmin();

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      recipes: {
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
              mealPlans: true,
            },
          },
        },
      },
      _count: {
        select: {
          recipes: true,
          categories: true,
          mealPlans: true,
        },
      },
    },
  });

  if (!user) {
    return null;
  }

  return {
    adminId: admin.id,
    user,
  };
}

export async function updateUserAsAdmin(
  userId: string,
  input: unknown,
) {
  await requireAdmin();

  const parsed = updateAdminUserSchema.parse(input);

  const existingUser = await prisma.user.findFirst({
    where: {
      email: parsed.email,
      NOT: {
        id: userId,
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
      id: userId,
    },
    data: {
      name: parsed.name ?? null,
      email: parsed.email,
    },
  });
}

export async function deleteUserAsAdmin(userId: string) {
  const admin = await requireAdmin();

  if (admin.id === userId) {
    throw new Error("Cannot delete current admin");
  }

  await prisma.user.delete({
    where: {
      id: userId,
    },
  });
}
