import { describe, expect, it } from "vitest";

import {
  adminStatisticsPeriodSchema,
  adminUserFiltersSchema,
  updateAdminUserSchema,
} from "@/features/admin/admin.validation";

describe("admin user validation", () => {
  it("accepts a valid admin user update", () => {
    const result = updateAdminUserSchema.safeParse({
      name: "Utilisateur",
      email: "USER@example.COM",
      role: "ADMIN",
    });

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data).toEqual({
        name: "Utilisateur",
        email: "user@example.com",
        role: "ADMIN",
      });
    }
  });

  it("rejects invalid email", () => {
    const result = updateAdminUserSchema.safeParse({
      name: "Utilisateur",
      email: "email-invalide",
      role: "USER",
    });

    expect(result.success).toBe(false);
  });

  it("rejects invalid role", () => {
    const result = updateAdminUserSchema.safeParse({
      name: "Utilisateur",
      email: "user@example.com",
      role: "OWNER",
    });

    expect(result.success).toBe(false);
  });
});

describe("admin statistics period", () => {
  it("accepts a supported period", () => {
    expect(adminStatisticsPeriodSchema.parse("90")).toBe(90);
  });

  it("falls back to 30 days", () => {
    expect(adminStatisticsPeriodSchema.parse("365")).toBe(30);
  });
});

describe("admin user filters", () => {
  it("normalizes valid search filters", () => {
    const result = adminUserFiltersSchema.parse({
      query: "  thomas@example.com  ",
      role: "ADMIN",
      page: "3",
    });

    expect(result).toEqual({
      query: "thomas@example.com",
      role: "ADMIN",
      page: 3,
    });
  });

  it("falls back to the first page for invalid values", () => {
    const result = adminUserFiltersSchema.parse({
      query: "",
      role: "OWNER",
      page: "invalid",
    });

    expect(result).toEqual({
      query: "",
      role: undefined,
      page: 1,
    });
  });
});
