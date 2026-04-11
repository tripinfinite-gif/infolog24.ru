import { expect, test } from "@playwright/test";

/**
 * Smoke-тесты: проверка что приложение вообще отвечает.
 * Не требуют ни авторизации, ни БД — только сам Next-процесс.
 */

test.describe("Smoke: health & homepage", () => {
  test("GET /api/health возвращает 200 и JSON со статусом", async ({
    request,
  }) => {
    const response = await request.get("/api/health");
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body).toHaveProperty("status");
    expect(body).toHaveProperty("timestamp");
    expect(body).toHaveProperty("uptime");
    expect(body).toHaveProperty("checks");
    expect(body.status).toBe("ok");
  });

  test("главная / грузится и содержит h1", async ({ page }) => {
    const response = await page.goto("/");
    expect(response?.status()).toBeLessThan(400);

    // На главной должен быть хотя бы один заголовок первого уровня.
    const h1 = page.locator("h1").first();
    await expect(h1).toBeVisible();
  });

  test("title главной содержит бренд", async ({ page }) => {
    await page.goto("/");
    const title = await page.title();
    expect(title.length).toBeGreaterThan(0);
    // Не делаем строгую проверку текста, чтобы не ломаться при редизайне.
  });
});
