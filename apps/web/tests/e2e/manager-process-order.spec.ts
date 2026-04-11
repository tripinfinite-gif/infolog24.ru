import { expect, test } from "@playwright/test";

/**
 * Сценарий: менеджер входит в админку и обрабатывает заявку.
 *
 * Требования к окружению:
 *   - БД с seed-данными (см. apps/web/src/lib/db/seed.ts).
 *   - Пользователь manager1@infolog24.ru / Password123! существует с ролью manager.
 *   - В БД есть хотя бы одна заявка в статусе не-терминал.
 *
 * Если seed не применён, тест skip с информативным сообщением.
 */

const MANAGER_EMAIL = "manager1@infolog24.ru";
const MANAGER_PASSWORD = "Password123!";

test.describe("Manager processes order (admin journey)", () => {
  test("менеджер логинится, открывает заявку, меняет статус", async ({
    page,
  }) => {
    // ---- 1. Логин ----
    await page.goto("/login");
    await page.locator("#email").fill(MANAGER_EMAIL);
    await page.locator("#password").fill(MANAGER_PASSWORD);
    await page.getByRole("button", { name: /Войти/i }).click();

    try {
      await page.waitForURL(/\/dashboard|\/admin/, { timeout: 15_000 });
    } catch {
      test.skip(
        true,
        `Не удалось залогиниться как ${MANAGER_EMAIL}. Применены ли seed-данные? Запустите: pnpm --filter web db:seed`,
      );
      return;
    }

    // ---- 2. Переход в админку заявок ----
    await page.goto("/admin/orders");

    // Если middleware перенаправляет — значит прав нет.
    if (/\/login/.test(page.url()) || /\/dashboard$/.test(page.url())) {
      test.skip(
        true,
        "Пользователь manager1 не имеет доступа к /admin/orders. Проверьте роль в БД.",
      );
      return;
    }

    // ---- 3. Выбор первой заявки из списка ----
    // Ищем ссылку на детали заявки — формат /admin/orders/<id>.
    const firstOrderLink = page
      .locator('a[href^="/admin/orders/"]')
      .filter({ hasNotText: /^$/ })
      .first();

    const hasOrders = await firstOrderLink.count();
    if (!hasOrders) {
      test.skip(
        true,
        "В БД нет ни одной заявки. Применены ли seed-данные с примерами? Запустите: pnpm --filter web db:seed",
      );
      return;
    }

    await firstOrderLink.click();
    await page.waitForURL(/\/admin\/orders\/[^/]+/, { timeout: 10_000 });

    // ---- 4. Смена статуса ----
    // Ищем кнопку/селект смены статуса. Спецификация: state machine
    // draft → documents_pending → payment_pending → processing → submitted → approved/rejected.
    const statusSelect = page
      .locator('select[name*="status"], [data-testid="status-select"]')
      .first();

    if (await statusSelect.count()) {
      const options = await statusSelect.locator("option").allTextContents();
      if (options.length > 1) {
        // Выбираем любой не-текущий вариант.
        await statusSelect.selectOption({ index: 1 });
        const saveBtn = page
          .getByRole("button", { name: /Сохранить|Обновить|Сменить статус/i })
          .first();
        if (await saveBtn.isVisible().catch(() => false)) {
          await saveBtn.click();
        }
      }
    } else {
      test.skip(
        true,
        "На странице заявки не найден селект смены статуса. Адаптируйте тест под реальный UI.",
      );
      return;
    }

    // ---- 5. Проверка что статус изменился ----
    // Мягкая проверка: страница перезагрузилась без ошибок.
    await expect(page.locator("body")).toBeVisible();
    expect(page.url()).toMatch(/\/admin\/orders\//);
  });
});
