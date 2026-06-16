import { describe, expect, it } from "vitest";

import { updateAdminUserSchema } from "@/features/admin/admin.validation";

describe("admin user validation", () => {
  it("accepts a valid admin user update", () => {
    const result = updateAdminUserSchema.safeParse({
      name: "Utilisateur",
      email: "USER@example.COM",
    });

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data).toEqual({
        name: "Utilisateur",
        email: "user@example.com",
      });
    }
  });

  it("rejects invalid email", () => {
    const result = updateAdminUserSchema.safeParse({
      name: "Utilisateur",
      email: "email-invalide",
    });

    expect(result.success).toBe(false);
  });
});
