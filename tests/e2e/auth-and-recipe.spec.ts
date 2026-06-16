import { expect, test } from "@playwright/test";

test("user can sign up, sign in and create a recipe", async ({ page }) => {
  const uniqueId = Date.now();
  const email = `e2e-${uniqueId}@example.com`;
  const password = "Password1234";
  const recipeTitle = `Recette E2E ${uniqueId}`;

  await page.goto("/");
  await expect(
    page.getByRole("heading", {
      name: /organise tes recettes, ton planning et tes courses/i,
    }),
  ).toBeVisible();

  await page.getByRole("link", { name: "Creer un compte" }).click();
  await page.getByLabel("Nom").fill("Utilisateur E2E");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Mot de passe").fill(password);
  await page.getByRole("button", { name: "Creer mon compte" }).click();

  await expect(
    page.getByRole("heading", { name: "Connexion" }),
  ).toBeVisible();

  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Mot de passe").fill(password);
  await page.getByRole("button", { name: "Se connecter" }).click();

  await expect(
    page.getByRole("heading", { name: "Tableau de bord" }),
  ).toBeVisible();

  await page.getByRole("link", { name: "Recettes" }).click();
  await expect(page.getByRole("heading", { name: "Recettes" })).toBeVisible();

  await page.getByLabel("Titre").fill(recipeTitle);
  await page.getByLabel("Description").fill("Recette creee par Playwright.");
  await page.getByLabel("Portions").fill("2");
  await page.getByLabel("Preparation (min)").fill("10");
  await page.getByLabel("Cuisson (min)").fill("20");
  await page
    .getByLabel("Etapes de preparation")
    .fill("1. Preparer\n2. Cuire\n3. Servir");
  await page.getByRole("button", { name: "Creer la recette" }).click();

  await expect(page.getByRole("link", { name: recipeTitle })).toBeVisible();
});
