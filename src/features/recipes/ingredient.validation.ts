import { z } from "zod";

const emptyToUndefined = (value: unknown) =>
  typeof value === "string" && value.trim() === "" ? undefined : value;

export const createIngredientSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Le nom doit contenir au moins 2 caracteres.")
    .max(80, "Le nom ne doit pas depasser 80 caracteres."),
  quantity: z.preprocess(
    emptyToUndefined,
    z.coerce
      .number()
      .positive("La quantite doit etre superieure a 0.")
      .max(9999, "La quantite est trop elevee.")
      .optional(),
  ),
  unit: z.preprocess(
    emptyToUndefined,
    z
      .string()
      .trim()
      .max(20, "L'unite ne doit pas depasser 20 caracteres.")
      .optional(),
  ),
});

export type CreateIngredientInput = z.infer<typeof createIngredientSchema>;

export const updateIngredientSchema = createIngredientSchema;

export type UpdateIngredientInput = z.infer<typeof updateIngredientSchema>;
