"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
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
      where: {
        id: existingItem.id,
      },
      data: {
        checked,
      },
    });
  } else if (existingItem) {
    await prisma.shoppingListItem.delete({
      where: {
        id: existingItem.id,
      },
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

  revalidatePath("/shopping-list");
}

export async function resetShoppingListChecksAction() {
  const user = await requireUser();

  await prisma.shoppingListItem.deleteMany({
    where: {
      userId: user.id,
    },
  });

  redirect("/shopping-list");
}
