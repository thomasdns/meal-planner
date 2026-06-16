import { z } from "zod";

const emptyToUndefined = (value: unknown) =>
  typeof value === "string" && value.trim() === "" ? undefined : value;

export const createCategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Le nom doit contenir au moins 2 caracteres.")
    .max(40, "Le nom ne doit pas depasser 40 caracteres."),
  color: z.preprocess(
    emptyToUndefined,
    z
      .string()
      .regex(/^#[0-9a-fA-F]{6}$/, "La couleur doit etre au format hex.")
      .optional(),
  ),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;

export const updateCategorySchema = createCategorySchema;

export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
