"use server";

import { prisma } from "@/lib/prisma";
import { logError } from "@/lib/logger";
import { requireUser } from "@/lib/session";

export async function toggleShoppingListItemAction(formData: FormData) {
  const user = await requireUser();
  const name = formData.get("name");
  const unit = formData.get("unit");
  const checked = formData.get("checked") === "on";

  if (typeof name !== "string" || name.trim().length === 0) {
    return;
  }

  const normalizedName = name.trim();
  const normalizedUnit = typeof unit === "string" && unit.trim() ? unit.trim() : null;

  try {
    const existingItem = await prisma.shoppingListItem.findFirst({
      where: {
        userId: user.id,
        name: normalizedName,
        unit: normalizedUnit,
      },
      select: {
        id: true,
      },
    });

    if (existingItem && checked) {
      await prisma.shoppingListItem.update({
        where: { id: existingItem.id },
        data: { checked },
      });
    } else if (existingItem) {
      await prisma.shoppingListItem.delete({
        where: { id: existingItem.id },
      });
    } else if (checked) {
      await prisma.shoppingListItem.create({
        data: {
          userId: user.id,
          name: normalizedName,
          unit: normalizedUnit,
          checked,
        },
      });
    }
  } catch (error) {
    await logError("server_action_failed", error, {
      action: "toggleShoppingListItem",
    });
    return {
      success: false as const,
      error: "Impossible de mettre a jour cet article.",
    };
  }

  return { success: true as const, checked };
}

export async function resetShoppingListChecksAction() {
  const user = await requireUser();

  try {
    await prisma.shoppingListItem.deleteMany({
      where: {
        userId: user.id,
      },
    });
  } catch (error) {
    await logError("server_action_failed", error, {
      action: "resetShoppingListChecks",
    });
    return {
      success: false as const,
      error: "Impossible de reinitialiser la liste.",
    };
  }

  return { success: true as const };
}
