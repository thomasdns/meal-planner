import { spawnSync } from "node:child_process";
import { setTimeout } from "node:timers/promises";

const commands = [
  {
    label: "Generate Prisma Client",
    command: "npx",
    args: ["prisma", "generate"],
  },
  {
    label: "Deploy Prisma migrations",
    command: "npx",
    args: ["prisma", "migrate", "deploy"],
    retries: 5,
  },
  {
    label: "Build Next.js application",
    command: "npx",
    args: ["next", "build"],
  },
];

async function runCommand({ label, command, args, retries = 0 }) {
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    console.log(`\n${label}${attempt > 0 ? ` - retry ${attempt}` : ""}`);

    const result = spawnSync(command, args, {
      shell: true,
      stdio: "pipe",
      encoding: "utf8",
    });

    process.stdout.write(result.stdout);
    process.stderr.write(result.stderr);

    if (result.status === 0) {
      return;
    }

    const output = `${result.stdout}\n${result.stderr}`;
    const canRetry =
      attempt < retries &&
      (output.includes("P1002") ||
        output.includes("advisory lock") ||
        output.includes("Timed out trying to acquire"));

    if (!canRetry) {
      process.exit(result.status ?? 1);
    }

    console.log("Migration lock timeout detected. Waiting before retrying...");
    await setTimeout(15_000);
  }
}

for (const command of commands) {
  await runCommand(command);
}
