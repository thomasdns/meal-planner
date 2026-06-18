import "server-only";

import {
  type AdminStatisticsPeriod,
  type AdminUserFilters,
  updateAdminUserSchema,
} from "@/features/admin/admin.validation";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import type { UserRole } from "@/lib/roles";

export type AdminUserListItem = {
  id: string;
  name: string | null;
  email: string;
  role: UserRole;
  createdAt: Date;
  recipesCount: number;
  categoriesCount: number;
  plannedMealsCount: number;
};

const adminUsersPageSize = 20;

export async function getAdminStatisticsData(periodDays: AdminStatisticsPeriod) {
  await requireAdmin();

  const periodStart = startOfDayDaysAgo(periodDays);
  const previousPeriodStart = startOfDayDaysAgo(periodDays * 2);

  const [
    usersCount,
    recipesCount,
    categoriesCount,
    ingredientsCount,
    mealPlansCount,
    newUsersCount,
    previousNewUsersCount,
    newRecipesCount,
    previousNewRecipesCount,
    newMealPlansCount,
    previousNewMealPlansCount,
    usersWithoutRecipesCount,
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
          gte: periodStart,
        },
      },
    }),
    prisma.user.count({
      where: {
        createdAt: {
          gte: previousPeriodStart,
          lt: periodStart,
        },
      },
    }),
    prisma.recipe.count({ where: { createdAt: { gte: periodStart } } }),
    prisma.recipe.count({
      where: { createdAt: { gte: previousPeriodStart, lt: periodStart } },
    }),
    prisma.mealPlan.count({ where: { createdAt: { gte: periodStart } } }),
    prisma.mealPlan.count({
      where: { createdAt: { gte: previousPeriodStart, lt: periodStart } },
    }),
    prisma.user.count({
      where: {
        recipes: {
          none: {},
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
      where: {
        createdAt: {
          gte: periodStart,
        },
      },
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
      usersWithRecipesRate:
        usersCount === 0
          ? 0
          : Math.round(
              ((usersCount - usersWithoutRecipesCount) / usersCount) * 100,
            ),
      usersWithoutRecipesCount,
      averageRecipesPerUser:
        usersCount === 0 ? 0 : Number((recipesCount / usersCount).toFixed(1)),
    },
    activity: {
      periodDays,
      newUsers: {
        current: newUsersCount,
        previous: previousNewUsersCount,
      },
      newRecipes: {
        current: newRecipesCount,
        previous: previousNewRecipesCount,
      },
      plannedMeals: {
        current: newMealPlansCount,
        previous: previousNewMealPlansCount,
      },
    },
    mostPlannedRecipes: mostPlannedRecipes
      .map((recipe) => ({
        id: recipe.id,
        title: recipe.title,
        ownerEmail: recipe.user.email,
        plannedCount: recipe._count.mealPlans,
      }))
      .filter((recipe) => recipe.plannedCount > 0),
    mealTypeStats: mealTypeStats.map((item) => ({
      mealType: item.mealType,
      count: item._count.mealType,
    })),
    recentRecipes,
  };
}

export async function getAdminUsersData(filters: AdminUserFilters) {
  await requireAdmin();

  const where = buildAdminUserWhere(filters);
  const filteredUsersCount = await prisma.user.count({ where });
  const totalPages = Math.max(
    1,
    Math.ceil(filteredUsersCount / adminUsersPageSize),
  );
  const currentPage = Math.min(filters.page, totalPages);
  const users = await prisma.user.findMany({
    where,
    orderBy: [{ createdAt: "desc" }, { id: "asc" }],
    skip: (currentPage - 1) * adminUsersPageSize,
    take: adminUsersPageSize,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      _count: {
        select: {
          recipes: true,
          categories: true,
          mealPlans: true,
        },
      },
    },
  });

  return {
    users: users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      recipesCount: user._count.recipes,
      categoriesCount: user._count.categories,
      plannedMealsCount: user._count.mealPlans,
    })),
    pagination: {
      currentPage,
      totalPages,
      totalItems: filteredUsersCount,
      pageSize: adminUsersPageSize,
    },
  };
}

function startOfDayDaysAgo(days: number) {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() - days);
  return date;
}

function buildAdminUserWhere(filters: AdminUserFilters) {
  return {
    ...(filters.query
      ? {
          OR: [
            {
              name: {
                contains: filters.query,
                mode: "insensitive" as const,
              },
            },
            {
              email: {
                contains: filters.query,
                mode: "insensitive" as const,
              },
            },
          ],
        }
      : {}),
    ...(filters.role ? { role: filters.role } : {}),
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
      role: true,
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
      role: parsed.role,
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
