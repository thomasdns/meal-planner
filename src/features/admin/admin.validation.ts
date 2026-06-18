import { z } from "zod";

import { userRoles } from "@/lib/roles";

export const updateAdminUserSchema = z.object({
  name: z
    .string()
    .trim()
    .max(80, "Le nom ne doit pas depasser 80 caracteres.")
    .optional()
    .transform((value) => (value ? value : undefined)),
  email: z.string().trim().email("Adresse email invalide.").toLowerCase(),
  role: z.enum(userRoles),
});

export const adminUserFiltersSchema = z.object({
  query: z.string().trim().max(100).catch(""),
  role: z.enum(userRoles).optional().catch(undefined),
  page: z.coerce.number().int().positive().catch(1),
});

export type UpdateAdminUserInput = z.infer<typeof updateAdminUserSchema>;
export type AdminUserFilters = z.infer<typeof adminUserFiltersSchema>;
