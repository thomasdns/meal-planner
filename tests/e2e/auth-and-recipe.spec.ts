import { expect, test } from "@playwright/test";

test("user can complete the core meal-planning journey", async ({ page }) => {
  const uniqueId = Date.now();
  const email = `e2e-${uniqueId}@example.com`;
  const password = "Password1234";
  const recipeTitle = `Recette E2E ${uniqueId}`;
  const categoryName = `Categorie E2E ${uniqueId}`;
  const ingredientName = `Ingredient E2E ${uniqueId}`;
  const updatedName = `Utilisateur E2E ${uniqueId}`;

  await page.goto("/");
  await expect(
    page.getByRole("heading", {
      name: /organise tes recettes, ton planning et tes courses/i,
    }),
  ).toBeVisible();

  await expect(
    page.getByRole("link", { name: "Creer un compte" }),
  ).toHaveAttribute("href", "/auth/sign-up");

  await page.goto("/auth/sign-up");
  await expect(
    page.getByRole("heading", { name: "Creer un compte" }),
  ).toBeVisible();

  await page.getByLabel("Nom").fill("Utilisateur E2E");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Mot de passe").fill(password);
  await page.getByRole("button", { name: "Creer mon compte" }).click();

  await expect(
    page.getByRole("heading", { name: "Connexion" }),
  ).toBeVisible();
  await page.waitForLoadState("networkidle");

  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Mot de passe").fill(password);
  await Promise.all([
    page.waitForURL("**/dashboard"),
    page.getByRole("button", { name: "Se connecter" }).click(),
  ]);

  await expect(
    page.getByRole("heading", { name: "Tableau de bord" }),
  ).toBeVisible();

  await page.getByRole("link", { name: "Recettes" }).click();
  await expect(page.getByRole("heading", { name: "Recettes" })).toBeVisible();

  await page.locator("#category-name").fill(categoryName);
  await page.getByRole("button", { name: "Creer la categorie" }).click();
  await expect(
    page.locator(`input[id^="category-name-"][value="${categoryName}"]`),
  ).toBeVisible();

  await page.locator("#title").fill(recipeTitle);
  await page.locator("#description").fill("Recette creee par Playwright.");
  await page.locator("#servings").fill("2");
  await page.locator("#prepTime").fill("10");
  await page.locator("#cookTime").fill("20");
  await page.locator("#steps")
    .fill("1. Preparer\n2. Cuire\n3. Servir");
  const createRecipeForm = page
    .locator("form")
    .filter({ has: page.getByRole("heading", { name: "Nouvelle recette" }) });
  await createRecipeForm
    .locator("#categoryId")
    .selectOption({ label: categoryName });
  await createRecipeForm
    .getByRole("button", { name: "Creer la recette" })
    .click();

  await expect(page.getByRole("link", { name: recipeTitle })).toBeVisible();

  await page.getByRole("link", { name: recipeTitle }).click();
  await expect(page.getByRole("heading", { name: recipeTitle })).toBeVisible();
  await page.locator("#ingredient-name").fill(ingredientName);
  await page.locator("#ingredient-quantity").fill("3");
  await page.locator("#ingredient-unit").fill("piece");
  await page.getByRole("button", { name: "Ajouter l'ingredient" }).click();
  await expect(
    page.locator(`input[id^="ingredient-name-"][value="${ingredientName}"]`),
  ).toBeVisible();

  await page.getByRole("link", { name: "Planning" }).click();
  await expect(
    page.getByRole("heading", { name: "Planning hebdomadaire" }),
  ).toBeVisible();
  await page.locator("#recipeId").selectOption({ label: recipeTitle });
  await page.locator("#mealType").selectOption("DINNER");
  await page.getByRole("button", { name: "Planifier" }).click();
  await expect(page.getByRole("link", { name: recipeTitle })).toBeVisible();

  await page.getByRole("link", { name: "Courses" }).click();
  await expect(page.getByRole("heading", { name: "Liste de courses" })).toBeVisible();
  await expect(page.getByText(ingredientName)).toBeVisible();
  await expect(page.getByText("3 piece")).toBeVisible();

  await page.getByRole("link", { name: "Profil" }).click();
  await expect(page.getByRole("heading", { name: "Profil" })).toBeVisible();
  await page.locator("#name").fill(updatedName);
  await page.getByRole("button", { name: "Mettre a jour" }).click();
  await expect(page.getByText("Profil mis a jour.")).toBeVisible();
});
