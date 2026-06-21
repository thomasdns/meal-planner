import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import ExcelJS from "exceljs";

import { createTestUser, deleteTestUsers } from "./helpers/database";

const password = "Password1234";

test("legal pages and privacy choices are accessible", async ({ page }) => {
  await page.goto("/");

  const consentPanel = page.getByRole("region", { name: "Choix des cookies" });
  await expect(consentPanel).toBeVisible();
  await expect(page.getByRole("contentinfo")).toHaveCount(0);
  await expect(page.locator('script[src*="googletagmanager.com"]')).toHaveCount(0);
  await page.getByRole("button", { name: "Refuser" }).click();
  await expect(consentPanel).toBeHidden();

  await page.goto("/mentions-legales");
  const footer = page.getByRole("contentinfo");
  await expect(page.getByRole("banner")).toBeVisible();
  await expect(page.getByRole("link", { name: "Retour à l'accueil" })).toHaveAttribute(
    "href",
    "/dashboard",
  );

  for (const linkName of [
    "Mentions legales",
    "Politique de confidentialité",
    "LinkedIn",
    "GitHub",
  ]) {
    await expect(footer.getByRole("link", { name: linkName })).toBeVisible();
  }

  await footer.getByRole("link", { name: "Politique de confidentialité" }).click();
  await expect(page).toHaveURL(/\/politique-de-confidentialite$/);
  await expect(
    page.getByRole("heading", { name: "Politique de confidentialité", exact: true }),
  ).toBeVisible();

  const accessibilityScanResults = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  expect(accessibilityScanResults.violations).toEqual([]);

  await footer.getByRole("button", { name: "Modifier mes preferences cookies" }).click();
  await expect(consentPanel).toBeVisible();
  await expect(page.getByRole("checkbox")).toHaveCount(0);
  await page.getByRole("button", { name: "Accepter" }).click();
  await expect(consentPanel).toBeHidden();
  await expect.poll(() => page.evaluate(() => localStorage.getItem("analytics-consent"))).toBe("accepted");
  await expect.poll(() => page.evaluate(() => localStorage.getItem("analytics-consent-expires-at"))).not.toBeNull();
  await expect(page.locator('script[src*="googletagmanager.com"]')).toHaveCount(1);

  await footer.getByRole("button", { name: "Modifier mes preferences cookies" }).click();
  await expect(consentPanel).toBeVisible();
  await page.getByRole("button", { name: "Refuser" }).click();
  await expect(consentPanel).toBeHidden();
  await expect.poll(() => page.evaluate(() => localStorage.getItem("analytics-consent"))).toBe("refused");
  await expect.poll(() => page.evaluate(() => Reflect.get(window, "ga-disable-G-EW6E6HMVFC"))).toBe(true);
  await expect(page.context().cookies()).resolves.not.toEqual(
    expect.arrayContaining([
      expect.objectContaining({ name: expect.stringMatching(/^_ga/) }),
    ]),
  );
});

test("mobile navigation works with keyboard and has no accessibility violation", async ({
  page,
}) => {
  const email = `e2e-accessibility-${Date.now()}@example.com`;
  await deleteTestUsers(email);

  try {
    await createTestUser({ email, password });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/auth/sign-in");
    await page.getByLabel("Email").fill(email);
    await page.getByLabel("Mot de passe").fill(password);
    await page.getByRole("button", { name: "Se connecter" }).click();
    await expect(page).toHaveURL(/\/dashboard$/);

    await page.getByRole("button", { name: "Ouvrir le menu" }).focus();
    await page.keyboard.press("Enter");
    await expect(page.getByRole("navigation", { name: "Navigation principale" })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("button", { name: "Ouvrir le menu" })).toBeFocused();

    await page.keyboard.press("Enter");
    await expect(page.getByRole("navigation", { name: "Navigation principale" })).toBeVisible();

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  } finally {
    await deleteTestUsers(email);
  }
});

test("authenticated user can export personal data without security secrets", async ({ page }) => {
  const email = `e2e-export-${Date.now()}@example.com`;
  await deleteTestUsers(email);

  try {
    await createTestUser({ email, password, name: "Export E2E" });
    await page.goto("/auth/sign-in");
    await page.getByLabel("Email").fill(email);
    await page.getByLabel("Mot de passe").fill(password);
    await page.getByRole("button", { name: "Se connecter" }).click();
    await expect(page).toHaveURL(/\/dashboard$/, { timeout: 15_000 });
    await page.goto("/profile");

    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("link", { name: "Exporter mes donnees Excel" }).click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/meal-planner-export-\d{4}-\d{2}-\d{2}\.xlsx/);
    const stream = await download.createReadStream();
    const chunks: Buffer[] = [];

    for await (const chunk of stream) {
      chunks.push(Buffer.from(chunk));
    }

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(Buffer.concat(chunks));
    const profileSheet = workbook.getWorksheet("Profil");
    expect(profileSheet).toBeDefined();
    expect(workbook.getWorksheet("Courses")).toBeUndefined();

    const emailRow = profileSheet?.getRows(1, profileSheet.rowCount)
      ?.find((row) => row.getCell(1).value === "Email");
    expect(emailRow?.getCell(2).value).toBe(email);

    const exportedText = JSON.stringify(workbook.model);
    expect(exportedText).not.toContain("password");
    expect(exportedText).not.toContain("sessionVersion");
    expect(exportedText).not.toContain("token");
  } finally {
    await deleteTestUsers(email);
  }
});
