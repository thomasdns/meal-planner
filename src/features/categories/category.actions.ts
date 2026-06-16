"use server";

import { revalidatePath } from "next/cache";

import { createCategorySchema } from "@/features/categories/category.validation";
import { createCategoryForCurrentUser } from "@/features/categories/categories.data";

export type CreateCategoryState = {
  error?: string;
};

export async function createCategoryAction(
  _previousState: CreateCategoryState,
  formData: FormData,
): Promise<CreateCategoryState> {
  const parsed = createCategorySchema.safeParse({
    name: formData.get("name"),
    color: formData.get("color"),
  });

  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Donnees invalides.",
    };
  }

  try {
    await createCategoryForCurrentUser(parsed.data);
  } catch {
    return {
      error: "Une categorie avec ce nom existe deja.",
    };
  }

  revalidatePath("/recipes");

  return {};
}
