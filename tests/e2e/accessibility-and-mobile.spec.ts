import AxeBuilder from "@axe-core/playwright";
import { expect, type Page, test } from "@playwright/test";

import { createTestUser, deleteTestUsers } from "./helpers/database";

const password = "Password1234";
const mobileViewport = { width: 390, height: 844 };

test("public pages meet accessibility rules on mobile", async ({ page }) => {
  await page.setViewportSize(mobileViewport);

  for (const path of [
    "/",
    "/auth/sign-in",
    "/auth/sign-up",
    "/auth/forgot-password",
    "/auth/resend-verification",
  ]) {
    await page.goto(path);
    await expectNoSeriousAccessibilityViolations(page);
    await expectNoHorizontalPageOverflow(page);
  }
});

test("authenticated mobile navigation is accessible", async ({ page }) => {
  const email = `e2e-accessibility-${Date.now()}@example.com`;
  await deleteTestUsers(email);

  try {
    await createTestUser({ email, password });
    await signIn(page, email);
    await page.setViewportSize(mobileViewport);

    const menuButton = page.locator('[aria-controls="mobile-navigation"]');
    await expect(menuButton).toBeVisible();
    await menuButton.click();
    await expect(menuButton).toHaveAttribute("aria-expanded", "true");
    await expect(page.getByRole("navigation", { name: "Navigation principale" }))
      .toBeVisible();

    await page.keyboard.press("Escape");
    await expect(menuButton).toHaveAttribute("aria-expanded", "false");
    await expect(menuButton).toBeFocused();

    for (const path of [
      "/dashboard",
      "/recipes",
      "/meal-plan",
      "/shopping-list",
      "/profile",
    ]) {
      await page.goto(path);
      await expectNoSeriousAccessibilityViolations(page);
      await expectNoHorizontalPageOverflow(page);
    }
  } finally {
    await deleteTestUsers(email);
  }
});

test("admin pages remain accessible on mobile", async ({ page }) => {
  const email = `e2e-accessibility-admin-${Date.now()}@example.com`;
  await deleteTestUsers(email);

  try {
    const admin = await createTestUser({
      email,
      password,
      role: "ADMIN",
      name: "Administrateur accessibilite E2E",
    });
    await signIn(page, email);
    await page.setViewportSize(mobileViewport);

    for (const path of [
      "/admin",
      "/admin?view=users",
      `/admin/users/${admin.id}`,
    ]) {
      await page.goto(path);
      await expectNoSeriousAccessibilityViolations(page);
      await expectNoHorizontalPageOverflow(page);
    }
  } finally {
    await deleteTestUsers(email);
  }
});

async function signIn(page: Page, email: string) {
  await page.goto("/auth/sign-in");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Mot de passe").fill(password);
  await page.getByRole("button", { name: "Se connecter" }).click();
  await expect(page).toHaveURL(/\/dashboard$/, { timeout: 15_000 });
}

async function expectNoSeriousAccessibilityViolations(page: Page) {
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();

  const seriousViolations = results.violations.filter((violation) =>
    ["serious", "critical"].includes(violation.impact ?? ""),
  );

  expect(seriousViolations).toEqual([]);
}

async function expectNoHorizontalPageOverflow(page: Page) {
  const dimensions = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));

  expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth + 1);
}
