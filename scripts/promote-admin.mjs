import pg from "pg";

const { Client } = pg;

async function main() {
  const email = process.argv[2]?.trim().toLowerCase();
  const databaseUrl = process.env.DATABASE_URL;

  if (!email) {
    console.error("Usage: npm run admin:promote -- user@example.com");
    process.exit(1);
  }

  if (!databaseUrl) {
    console.error("DATABASE_URL is required.");
    process.exit(1);
  }

  const client = new Client({
    connectionString: databaseUrl,
    ssl: databaseUrl.includes("localhost")
      ? false
      : { rejectUnauthorized: false },
  });

  await client.connect();

  const result = await client.query(
    `UPDATE "User"
     SET "role" = 'ADMIN',
         "sessionVersion" = "sessionVersion" + 1,
         "updatedAt" = NOW()
     WHERE LOWER("email") = LOWER($1)
     RETURNING "id", "email", "role"`,
    [email],
  );

  await client.end();

  const user = result.rows[0];

  if (!user) {
    console.error(`No user found for email: ${email}`);
    process.exit(1);
  }

  console.log(`${user.email} is now ${user.role}.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
