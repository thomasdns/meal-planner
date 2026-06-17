import { spawnSync } from "node:child_process";

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
    retries: 2,
  },
  {
    label: "Build Next.js application",
    command: "npx",
    args: ["next", "build"],
  },
];

function runCommand({ label, command, args, retries = 0 }) {
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
    spawnSync("node", ["-e", "setTimeout(() => {}, 15000)"], {
      shell: true,
      stdio: "inherit",
    });
  }
}

for (const command of commands) {
  runCommand(command);
}
