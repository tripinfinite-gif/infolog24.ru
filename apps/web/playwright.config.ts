/**
 * Playwright configuration for E2E tests.
 *
 * Как запускать:
 *   pnpm test:e2e              # headless
 *   pnpm test:e2e:ui           # интерактивный режим
 *
 * Требования окружения:
 *   - Локально работающая БД PostgreSQL с применёнными миграциями
 *     (см. drizzle/migrations, `pnpm --filter web db:seed` для сид-данных).
 *   - Доступный Redis (если тест затрагивает очереди).
 *   - Переменные окружения из `.env.local` (DATABASE_URL, BETTER_AUTH_SECRET и т.д.).
 *
 * Переопределения:
 *   - PLAYWRIGHT_BASE_URL=https://staging.inlog24.ru pnpm test:e2e
 *     — прогон против уже запущенного сервера, без локального dev.
 *
 * Web server:
 *   - По умолчанию Playwright поднимает `pnpm dev` на порту 3000.
 *   - Если сервер уже запущен (reuseExistingServer) — использует существующий.
 *
 * В CI (CI=true): 1 retry, forbidOnly=true, workers=1 для стабильности.
 */
import { defineConfig, devices } from "@playwright/test";

const BASE_URL = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000";
const isCI = Boolean(process.env.CI);

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 1 : 0,
  workers: isCI ? 1 : undefined,
  timeout: 30_000,
  expect: {
    timeout: 10_000,
  },
  reporter: [
    ["list"],
    ["html", { outputFolder: "playwright-report", open: "never" }],
  ],
  use: {
    baseURL: BASE_URL,
    testIdAttribute: "data-testid",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    actionTimeout: 10_000,
    navigationTimeout: 20_000,
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    // Раскомментировать для запуска в других браузерах:
    // { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    // { name: "webkit", use: { ...devices["Desktop Safari"] } },
  ],
  webServer: {
    command: "pnpm dev",
    url: BASE_URL,
    reuseExistingServer: !isCI,
    timeout: 120_000,
    stdout: "pipe",
    stderr: "pipe",
  },
});
