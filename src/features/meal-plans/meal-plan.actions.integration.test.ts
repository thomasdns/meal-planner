import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  deleteMealPlanForCurrentUser: vi.fn(),
  logError: vi.fn(),
  upsertMealPlanForCurrentUser: vi.fn(),
}));

vi.mock("@/features/meal-plans/meal-plans.data", () => ({
  deleteMealPlanForCurrentUser: mocks.deleteMealPlanForCurrentUser,
  upsertMealPlanForCurrentUser: mocks.upsertMealPlanForCurrentUser,
}));

vi.mock("@/lib/logger", () => ({
  logError: mocks.logError,
}));

import {
  deleteMealPlanAction,
  upsertMealPlanAction,
} from "@/features/meal-plans/meal-plan.actions";

describe("meal plan actions integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.deleteMealPlanForCurrentUser.mockResolvedValue(undefined);
    mocks.upsertMealPlanForCurrentUser.mockResolvedValue(undefined);
  });

  it("returns the refreshed week after planning a meal", async () => {
    const formData = new FormData();
    formData.set("date", "2026-06-22");
    formData.set("mealType", "DINNER");
    formData.set("recipeId", "cm12345678901234567890123");

    const result = await upsertMealPlanAction({}, formData);

    expect(result).toEqual({
      success: "Repas planifie.",
      redirectTo: "/meal-plan?week=2026-06-22&status=planned",
    });
    expect(mocks.upsertMealPlanForCurrentUser).toHaveBeenCalledWith({
      date: "2026-06-22",
      mealType: "DINNER",
      recipeId: "cm12345678901234567890123",
    });
  });

  it("confirms removal of a meal", async () => {
    const result = await deleteMealPlanAction("meal-plan-1");

    expect(mocks.deleteMealPlanForCurrentUser).toHaveBeenCalledWith(
      "meal-plan-1",
    );
    expect(result).toEqual({ success: true });
  });
});
