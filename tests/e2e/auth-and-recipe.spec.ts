import { expect, type Page, test } from "@playwright/test";

import {
  createEmailVerificationToken,
  createPasswordResetToken,
  createRecipeWithIngredient,
  createTestUser,
  deleteTestUsers,
  getUserSecurityState,
} from "./helpers/database";

const password = "Password1234";

test("email verification is required before sign in", async ({ page }) => {
  const uniqueId = Date.now();
  const email = `e2e-unverified-${uniqueId}@example.com`;
  const verificationToken = `verify-${uniqueId}`;

  await deleteTestUsers(email);

  try {
    await createTestUser({
      email,
      password,
      verified: false,
    });
    await createEmailVerificationToken(email, verificationToken);

    await signIn(page, email, password, {
      expectedError: "Verifie ton adresse email avant de te connecter.",
    });
    await expect(
      page.getByRole("link", { name: "Renvoyer le lien de verification" }),
    ).toBeVisible();

    await page.goto(`/auth/verify-email/confirm?token=${verificationToken}`);
    await expect(
      page.getByRole("heading", { name: "Verification email" }),
    ).toBeVisible();
    await expect(page.getByText("Email verifie avec succes.")).toBeVisible();

    await signIn(page, email, password);
    await expect(
      page.getByRole("heading", { name: "Tableau de bord" }),
    ).toBeVisible();
  } finally {
    await deleteTestUsers(email);
  }
});

test("an unverified user can request a new verification link", async ({
  page,
}) => {
  const email = `e2e-resend-verification-${Date.now()}@example.com`;

  await deleteTestUsers(email);

  try {
    await createTestUser({ email, password, verified: false });

    await page.goto("/auth/resend-verification");
    await page.getByLabel("Email").fill(email);
    await page.getByRole("button", { name: "Renvoyer le lien" }).click();

    await expect(
      page.getByText(
        "Si un compte non verifie existe avec cet email, un nouveau lien a ete envoye.",
      ),
    ).toBeVisible();

    const securityState = await getUserSecurityState(email);
    expect(securityState.verificationTokenCount).toBe(1);
  } finally {
    await deleteTestUsers(email);
  }
});

test("resetting a password revokes the existing session", async ({ page }) => {
  const uniqueId = Date.now();
  const email = `e2e-password-${uniqueId}@example.com`;
  const resetToken = `reset-token-${uniqueId}`;
  const newPassword = "NewPassword1234";

  await deleteTestUsers(email);

  try {
    await createTestUser({ email, password });
    await signIn(page, email, password);
    await createPasswordResetToken(email, resetToken);

    await page.goto(`/auth/reset-password?token=${resetToken}`);
    await page.getByLabel("Nouveau mot de passe").fill(newPassword);
    await page.getByRole("button", { name: "Changer le mot de passe" }).click();
    await expect(page.getByText("Mot de passe mis a jour.")).toBeVisible();

    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/auth\/sign-in/);

    await signIn(page, email, newPassword);
  } finally {
    await deleteTestUsers(email);
  }
});

test("changing email creates a verification and revokes the session", async ({
  page,
}) => {
  const uniqueId = Date.now();
  const email = `e2e-profile-${uniqueId}@example.com`;
  const updatedEmail = `e2e-profile-updated-${uniqueId}@example.com`;

  await deleteTestUsers(email, updatedEmail);

  try {
    await createTestUser({ email, password });
    await signIn(page, email, password);

    await page.goto("/profile");
    await page.getByLabel("Email").fill(updatedEmail);
    await page.getByRole("button", { name: "Mettre a jour" }).click();

    await expect(page).toHaveURL(/\/auth\/sign-in\?emailChanged=1/);
    await expect(
      page.getByText(
        "Adresse modifiee. Verifie le nouvel email avant de te reconnecter.",
      ),
    ).toBeVisible();

    const securityState = await getUserSecurityState(updatedEmail);
    expect(securityState.user?.emailVerified).toBeNull();
    expect(securityState.user?.sessionVersion).toBe(1);
    expect(securityState.verificationTokenCount).toBe(1);

    await signIn(page, updatedEmail, password, {
      expectedError: "Verifie ton adresse email avant de te connecter.",
    });
  } finally {
    await deleteTestUsers(email, updatedEmail);
  }
});

test("user can manage categories, recipes and ingredients", async ({ page }) => {
  const uniqueId = Date.now();
  const email = `e2e-recipes-${uniqueId}@example.com`;
  const categoryName = `Categorie E2E ${uniqueId}`;
  const updatedCategoryName = `Categorie modifiee ${uniqueId}`;
  const recipeTitle = `Recette E2E ${uniqueId}`;
  const updatedRecipeTitle = `Recette modifiee ${uniqueId}`;
  const ingredientName = `Ingredient E2E ${uniqueId}`;
  const updatedIngredientName = `Ingredient modifie ${uniqueId}`;

  await deleteTestUsers(email);

  try {
    await createTestUser({ email, password });
    await signIn(page, email, password);

    await page.goto("/recipes");
    await expect(page.getByRole("heading", { name: "Recettes" })).toBeVisible();

    await page.locator("#category-name").fill(categoryName);
    await page.getByRole("button", { name: "Creer la categorie" }).click();
    const categoryInput = page.locator(
      `input[id^="category-name-"][value="${categoryName}"]`,
    );
    await expect(categoryInput).toBeVisible();

    await categoryInput.fill(updatedCategoryName);
    await categoryInput
      .locator("xpath=ancestor::form")
      .getByRole("button", { name: "OK" })
      .click();
    await expect(page.getByText("Categorie mise a jour.")).toBeVisible();

    await page.locator("#title").fill(recipeTitle);
    await page.locator("#description").fill("Recette creee par Playwright.");
    await page.locator("#servings").fill("2");
    await page.locator("#prepTime").fill("15");
    await page.locator("#cookTime").fill("25");
    await page.locator("#steps").fill("1. Preparer\n2. Cuire\n3. Servir");
    const createRecipeForm = page
      .locator("form")
      .filter({ has: page.getByRole("heading", { name: "Nouvelle recette" }) });
    await createRecipeForm
      .locator("#categoryId")
      .selectOption({ label: updatedCategoryName });
    await createRecipeForm
      .getByRole("button", { name: "Creer la recette" })
      .click();
    await expect(page.getByRole("link", { name: recipeTitle })).toBeVisible();

    await page.locator("#query").fill(recipeTitle);
    await page.getByRole("button", { name: "Filtrer" }).click();
    await expect(page.getByRole("link", { name: recipeTitle })).toBeVisible();

    await page.locator("#maxTotalTime").fill("10");
    await page.getByRole("button", { name: "Filtrer" }).click();
    await expect(page.getByRole("link", { name: recipeTitle })).toBeHidden();
    await expect(page.getByText("Aucune recette pour le moment")).toBeVisible();

    await page.goto("/recipes");
    await page.getByRole("link", { name: recipeTitle }).click();
    await expect(page.getByRole("heading", { name: recipeTitle })).toBeVisible();

    await page.locator("#edit-title").fill(updatedRecipeTitle);
    await page.locator("#edit-prepTime").fill("20");
    await page.locator("#edit-cookTime").fill("30");
    await page.locator("#edit-steps").fill("1. Couper\n2. Melanger\n3. Servir");
    await page.getByRole("button", { name: "Enregistrer" }).click();
    await expect(page.getByText("Recette mise a jour.")).toBeVisible();

    await page.locator("#ingredient-name").fill(ingredientName);
    await page.locator("#ingredient-quantity").fill("3");
    await page.locator("#ingredient-unit").fill("piece");
    await page.getByRole("button", { name: "Ajouter l'ingredient" }).click();
    const ingredientInput = page.locator(
      `input[id^="ingredient-name-"][value="${ingredientName}"]`,
    );
    await expect(ingredientInput).toBeVisible();

    await ingredientInput.fill(updatedIngredientName);
    const ingredientForm = ingredientInput.locator("xpath=ancestor::form");
    await ingredientForm.locator('input[name="quantity"]').fill("4");
    await ingredientForm.locator('input[name="unit"]').fill("g");
    await ingredientForm.getByRole("button", { name: "Enregistrer" }).click();
    await expect(page.getByText("Ingredient mis a jour.")).toBeVisible();

    page.once("dialog", (dialog) => dialog.accept());
    await page.getByRole("button", { name: "Supprimer cet ingredient" }).click();
    await expect(page.getByText("Aucun ingredient")).toBeVisible();

    page.once("dialog", (dialog) => dialog.accept());
    await page.getByRole("button", { name: "Supprimer la recette" }).click();
    await expect(page).toHaveURL(/\/recipes$/);
    await expect(
      page.getByRole("link", { name: updatedRecipeTitle }),
    ).toBeHidden();
  } finally {
    await deleteTestUsers(email);
  }
});

test("weekly planning generates and updates the shopping list", async ({
  page,
}) => {
  const uniqueId = Date.now();
  const email = `e2e-planning-${uniqueId}@example.com`;
  const ingredientName = `Ingredient courses ${uniqueId}`;
  const recipeTitle = `Recette planning ${uniqueId}`;

  await deleteTestUsers(email);

  try {
    const user = await createTestUser({ email, password });
    await createRecipeWithIngredient({
      userId: user.id,
      categoryName: `Categorie planning ${uniqueId}`,
      recipeTitle,
      ingredientName,
      quantity: 5,
      unit: "g",
    });

    await signIn(page, email, password);

    await page.goto("/meal-plan");
    await expect(
      page.getByRole("heading", { name: "Planning hebdomadaire" }),
    ).toBeVisible();
    await page.locator("#recipeId").selectOption({ label: recipeTitle });
    await page.locator("#mealType").selectOption("DINNER");
    await page.getByRole("button", { name: "Planifier" }).click();
    await expect(page.getByRole("link", { name: recipeTitle })).toBeVisible();

    await page.goto("/shopping-list");
    await expect(
      page.getByRole("heading", { name: "Liste de courses" }),
    ).toBeVisible();
    const itemRow = page.getByRole("row", {
      name: new RegExp(escapeRegExp(ingredientName)),
    });
    await expect(itemRow).toContainText("5 g");
    await expect(itemRow).toContainText(recipeTitle);

    const itemCheckbox = itemRow.getByRole("checkbox");
    await itemCheckbox.click();
    await expect(itemCheckbox).toBeChecked();
    await expect(itemRow.locator("td").nth(1)).toHaveClass(/line-through/);
    await expect(itemRow.locator("td").nth(2)).toHaveClass(/line-through/);
    await expect(itemRow.locator("td").nth(3)).toHaveClass(/line-through/);

    page.once("dialog", (dialog) => dialog.accept());
    await page.getByRole("button", { name: "Reinitialiser" }).click();
    await expect(itemCheckbox).not.toBeChecked();

    await page.goto("/meal-plan");
    page.once("dialog", (dialog) => dialog.accept());
    const removeMealButton = page.getByRole("button", {
      name: "Retirer ce repas du planning",
    });
    await expect(removeMealButton).toBeVisible();
    await removeMealButton.evaluate((button) => {
      if (!(button instanceof HTMLButtonElement)) {
        throw new Error("Expected a button element.");
      }

      button.form?.requestSubmit(button);
    });
    await expect(page.getByRole("link", { name: recipeTitle })).toBeHidden();

    await page.goto("/shopping-list");
    await expect(page.getByText("Liste vide")).toBeVisible();
  } finally {
    await deleteTestUsers(email);
  }
});

test("a user cannot access another user's recipe", async ({ page }) => {
  const uniqueId = Date.now();
  const ownerEmail = `e2e-owner-${uniqueId}@example.com`;
  const visitorEmail = `e2e-visitor-${uniqueId}@example.com`;

  await deleteTestUsers(ownerEmail, visitorEmail);

  try {
    const owner = await createTestUser({ email: ownerEmail, password });
    const recipe = await createRecipeWithIngredient({
      userId: owner.id,
      categoryName: `Categorie privee ${uniqueId}`,
      recipeTitle: `Recette privee ${uniqueId}`,
      ingredientName: `Ingredient prive ${uniqueId}`,
    });
    await createTestUser({ email: visitorEmail, password });
    await signIn(page, visitorEmail, password);

    const response = await page.goto(`/recipes/${recipe.recipeId}`);
    expect(response?.status()).toBe(404);
  } finally {
    await deleteTestUsers(ownerEmail, visitorEmail);
  }
});

test("a user can permanently delete their own account", async ({ page }) => {
  const email = `e2e-delete-account-${Date.now()}@example.com`;

  await deleteTestUsers(email);

  try {
    await createTestUser({ email, password });
    await signIn(page, email, password);

    await page.goto("/profile");
    await page.getByRole("button", { name: "Supprimer mon compte" }).click();
    const dialog = page.getByRole("dialog", {
      name: "Confirmer la suppression",
    });
    await dialog
      .getByLabel("Tape SUPPRIMER pour confirmer")
      .fill("SUPPRIMER");
    await dialog.getByRole("button", { name: "Confirmer" }).click();

    await expect(page).toHaveURL(/\/auth\/sign-in$/, { timeout: 15_000 });
    const securityState = await getUserSecurityState(email);
    expect(securityState.user).toBeNull();
  } finally {
    await deleteTestUsers(email);
  }
});

test("admin can inspect, edit and delete a user", async ({ page, browser }) => {
  test.setTimeout(60_000);

  const uniqueId = Date.now();
  const adminEmail = `e2e-admin-${uniqueId}@example.com`;
  const userEmail = `e2e-admin-user-${uniqueId}@example.com`;
  const updatedUserEmail = `e2e-admin-user-updated-${uniqueId}@example.com`;
  const userRecipeTitle = `Recette utilisateur admin ${uniqueId}`;
  const updatedName = `Utilisateur gere ${uniqueId}`;

  await deleteTestUsers(adminEmail, userEmail, updatedUserEmail);

  try {
    await createTestUser({
      email: adminEmail,
      password,
      name: "Admin E2E",
      role: "ADMIN",
    });
    const user = await createTestUser({
      email: userEmail,
      password,
      name: "Utilisateur admin E2E",
    });
    await createRecipeWithIngredient({
      userId: user.id,
      categoryName: `Categorie admin ${uniqueId}`,
      recipeTitle: userRecipeTitle,
      ingredientName: `Ingredient admin ${uniqueId}`,
    });

    const userPage = await browser.newPage();
    await signIn(userPage, userEmail, password);

    await signIn(page, adminEmail, password);
    await page.goto("/admin");
    await expect(
      page.getByRole("heading", { name: "Pilotage de l'application" }),
    ).toBeVisible();
    await page.getByRole("link", { name: "Statistiques" }).click();
    await expect(page.getByRole("heading", { name: "Statistiques" })).toBeVisible();
    await expect(page.getByText(userRecipeTitle).first()).toBeVisible();

    await page.getByRole("link", { name: "Utilisateurs" }).click();
    const userRow = page.getByRole("row", {
      name: new RegExp(escapeRegExp(userEmail)),
    });
    await expect(userRow).toBeVisible();
    await userRow.getByRole("link", { name: "Gerer" }).click();
    await expect(page.getByRole("heading", { name: "Utilisateur admin E2E" }))
      .toBeVisible();
    await expect(page.getByText(userRecipeTitle)).toBeVisible();

    await page.locator("#admin-user-name").fill(updatedName);
    await page.locator("#admin-user-email").fill(updatedUserEmail);
    await page.locator("#admin-user-role").selectOption("ADMIN");
    await page.getByRole("button", { name: "Enregistrer" }).click();
    await expect(page.getByText("Utilisateur mis a jour.")).toBeVisible();

    await userPage.goto("/dashboard");
    await expect(userPage).toHaveURL(/\/auth\/sign-in/);
    await userPage.close();

    page.once("dialog", (dialog) => dialog.accept());
    await page.getByRole("button", { name: "Supprimer" }).click();
    await expect(page).toHaveURL(/\/admin$/);
    await expect(page.getByText(updatedUserEmail)).toBeHidden();
  } finally {
    await deleteTestUsers(adminEmail, userEmail, updatedUserEmail);
  }
});

async function signIn(
  page: Page,
  email: string,
  userPassword: string,
  options: { expectedError?: string } = {},
) {
  await page.goto("/auth/sign-in");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Mot de passe").fill(userPassword);
  await page.getByRole("button", { name: "Se connecter" }).click();

  if (options.expectedError) {
    await expect(page.getByText(options.expectedError)).toBeVisible();
    return;
  }

  await expect(page).toHaveURL(/\/dashboard$/, { timeout: 15_000 });
  await expect(page.getByRole("heading", { name: "Tableau de bord" }))
    .toBeVisible();
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
