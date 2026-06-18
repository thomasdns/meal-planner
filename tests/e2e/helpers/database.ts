import { createHash, randomBytes } from "node:crypto";

import bcrypt from "bcryptjs";
import "dotenv/config";
import pg from "pg";

const { Client } = pg;

type UserRole = "USER" | "ADMIN";

type TestUserInput = {
  email: string;
  password: string;
  name?: string;
  role?: UserRole;
  verified?: boolean;
};

type TestRecipeInput = {
  userId: string;
  categoryName: string;
  recipeTitle: string;
  ingredientName: string;
  quantity?: number;
  unit?: string;
};

async function withClient<T>(
  callback: (client: pg.Client) => Promise<T>,
): Promise<T> {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is required for E2E tests.");
  }

  const client = new Client({
    connectionString: databaseUrl,
    ssl: databaseUrl.includes("localhost")
      ? false
      : { rejectUnauthorized: false },
  });

  await client.connect();

  try {
    return await callback(client);
  } finally {
    await client.end();
  }
}

export async function createTestUser({
  email,
  password,
  name = "Utilisateur E2E",
  role = "USER",
  verified = true,
}: TestUserInput) {
  const id = createTestId();
  const hashedPassword = await bcrypt.hash(password, 12);

  await withClient(async (client) => {
    await client.query(
      `INSERT INTO "User"
       ("id", "name", "email", "emailVerified", "password", "role", "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())`,
      [
        id,
        name,
        email.toLowerCase(),
        verified ? new Date() : null,
        hashedPassword,
        role,
      ],
    );
  });

  return {
    id,
    email: email.toLowerCase(),
    password,
  };
}

export async function createEmailVerificationToken(
  email: string,
  token: string,
) {
  return createVerificationToken(
    `email-verification:${email.toLowerCase()}`,
    token,
  );
}

export async function createPasswordResetToken(email: string, token: string) {
  return createVerificationToken(`password-reset:${email.toLowerCase()}`, token);
}

async function createVerificationToken(identifier: string, token: string) {
  await withClient(async (client) => {
    await client.query(
      `DELETE FROM "VerificationToken"
       WHERE "identifier" = $1`,
      [identifier],
    );

    await client.query(
      `INSERT INTO "VerificationToken" ("identifier", "token", "expires")
       VALUES ($1, $2, NOW() + INTERVAL '1 day')`,
      [
        identifier,
        createHash("sha256").update(token).digest("hex"),
      ],
    );
  });
}

export async function createRecipeWithIngredient({
  userId,
  categoryName,
  recipeTitle,
  ingredientName,
  quantity = 2,
  unit = "piece",
}: TestRecipeInput) {
  const categoryId = createTestId();
  const recipeId = createTestId();
  const ingredientId = createTestId();

  await withClient(async (client) => {
    await client.query(
      `INSERT INTO "Category"
       ("id", "name", "color", "userId", "createdAt", "updatedAt")
       VALUES ($1, $2, '#047857', $3, NOW(), NOW())`,
      [categoryId, categoryName, userId],
    );

    await client.query(
      `INSERT INTO "Recipe"
       ("id", "title", "description", "servings", "prepTime", "cookTime", "steps", "userId", "categoryId", "createdAt", "updatedAt")
       VALUES ($1, $2, 'Recette preparee pour les tests E2E.', 2, 10, 20, '1. Preparer', $3, $4, NOW(), NOW())`,
      [recipeId, recipeTitle, userId, categoryId],
    );

    await client.query(
      `INSERT INTO "RecipeIngredient"
       ("id", "name", "quantity", "unit", "recipeId", "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, $5, NOW(), NOW())`,
      [ingredientId, ingredientName, quantity, unit, recipeId],
    );
  });

  return {
    categoryId,
    recipeId,
    ingredientId,
  };
}

export async function deleteTestUsers(...emails: string[]) {
  await withClient(async (client) => {
    for (const email of emails) {
      await client.query(
        `DELETE FROM "VerificationToken"
         WHERE "identifier" LIKE $1`,
        [`%:${email.toLowerCase()}`],
      );
      await client.query(`DELETE FROM "User" WHERE LOWER("email") = LOWER($1)`, [
        email,
      ]);
    }
  });
}

export async function getUserSecurityState(email: string) {
  return withClient(async (client) => {
    const userResult = await client.query<{
      emailVerified: Date | null;
      sessionVersion: number;
    }>(
      `SELECT "emailVerified", "sessionVersion"
       FROM "User"
       WHERE LOWER("email") = LOWER($1)`,
      [email],
    );
    const tokenResult = await client.query<{ count: string }>(
      `SELECT COUNT(*)::text AS count
       FROM "VerificationToken"
       WHERE "identifier" = $1`,
      [`email-verification:${email.toLowerCase()}`],
    );

    return {
      user: userResult.rows[0] ?? null,
      verificationTokenCount: Number(tokenResult.rows[0]?.count ?? 0),
    };
  });
}

function createTestId() {
  return `c${randomBytes(12).toString("hex")}`;
}
