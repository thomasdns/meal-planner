import { describe, expect, it } from "vitest";

import { updateProfileSchema } from "@/features/profile/profile.validation";

describe("profile validation", () => {
  it("accepts a valid profile update", () => {
    const result = updateProfileSchema.safeParse({
      name: "Utilisateur Test",
      email: "USER@example.COM",
    });

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data).toEqual({
        name: "Utilisateur Test",
        email: "user@example.com",
      });
    }
  });

  it("rejects an invalid email", () => {
    const result = updateProfileSchema.safeParse({
      name: "Utilisateur Test",
      email: "pas-un-email",
    });

    expect(result.success).toBe(false);
  });
});
