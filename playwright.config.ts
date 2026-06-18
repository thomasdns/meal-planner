import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "npm run start -- --port 3000",
    url: "http://localhost:3000",
    env: {
      SMTP_TEST_MODE: "true",
      EMAIL_FROM: "Meal Planner Tests <tests@example.com>",
    },
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
