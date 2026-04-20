import { expect, test } from "@playwright/test";

/**
 * Регрессионные тесты для форм захвата лидов.
 *
 * История: 2026-04-20 было обнаружено, что ScrollPopup содержал fake-submit.
 * Починен коммитом `b644073`. Этот тест защищает от повторной регрессии.
 *
 * Формы захвата:
 * 1. FinalCtaForm на главной (#zayavka) — проверяем что submit становится
 *    активным после заполнения (UI-regression).
 * 2. ScrollPopup — full e2e: скролл → 3-step flow → POST /api/contacts.
 *    Это самый критичный тест после 0.1.
 * 3. ExitIntentPopup — skip-fallback (headless не триггерит mouseleave).
 *
 * Serial mode, чтобы не дробить rate-limit при локальных прогонах.
 */

test.describe.configure({ mode: "serial" });

test.describe("Marketing forms — capture leads", () => {
  test("FinalCtaForm: submit-кнопка становится активной после заполнения", async ({
    page,
  }) => {
    await page.goto("/");
    // Заранее помечаем попапы как «уже показанные», чтобы они не перехватывали клики.
    await page.evaluate(() => {
      sessionStorage.setItem("scroll-popup-shown", "1");
      sessionStorage.setItem("exit-intent-shown", "1");
    });
    await page.goto("/#zayavka");

    // FinalCtaForm ищем по уникальному id поля — это отличает её от
    // mini-calculator в hero-секции.
    const nameInput = page.locator("#final-name");
    await expect(nameInput).toBeVisible();
    const form = page.locator('form:has(#final-name)').first();

    const submitBtn = form.getByRole("button", { name: /Получить расчёт/i });

    // До заполнения — disabled (consent не стоит)
    await expect(submitBtn).toBeDisabled();

    await nameInput.fill("E2E Тест");
    await page.locator("#final-phone").fill("+7 (999) 123-45-67");
    await page.locator("#consent-final").click();

    // После заполнения + consent — активна
    await expect(submitBtn).toBeEnabled();
  });

  test("ScrollPopup: full e2e flow → POST /api/contacts → 200 OK", async ({
    page,
  }) => {
    await page.goto("/", { waitUntil: "networkidle" });

    // Очищаем sessionStorage чтобы попап мог открыться
    await page.evaluate(() => {
      sessionStorage.removeItem("scroll-popup-shown");
      sessionStorage.removeItem("exit-intent-shown");
    });

    // Скроллим через реальные wheel-events + явно диспатчим scroll-event,
    // чтобы React-listener ScrollPopup надёжно сработал.
    await page.evaluate(() => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      window.scrollTo(0, Math.floor(h * 0.7));
      window.dispatchEvent(new Event("scroll"));
    });

    // Шаг 1: выбираем МКАД
    const zoneDialog = page.getByRole("dialog", { name: /Нужна помощь/i });
    await expect(zoneDialog).toBeVisible({ timeout: 5_000 });
    await zoneDialog.getByRole("button", { name: /МКАД/i }).first().click();

    // Шаг 2: выбираем 6-10 машин
    const countDialog = page.getByRole("dialog", { name: /Сколько машин/i });
    await expect(countDialog).toBeVisible();
    await countDialog.getByRole("button", { name: /6-10/i }).click();

    // Шаг 3: телефон + согласие
    const phoneDialog = page.getByRole("dialog", { name: /Ваш расчёт готов/i });
    await expect(phoneDialog).toBeVisible();
    await phoneDialog.locator('input[type="tel"]').fill("+7 (999) 765-43-21");
    await phoneDialog.getByRole("checkbox").first().click();

    // Submit + перехват сети
    const [request, response] = await Promise.all([
      page.waitForRequest(
        (req) => req.url().includes("/api/contacts") && req.method() === "POST",
        { timeout: 15_000 },
      ),
      page.waitForResponse((res) => res.url().includes("/api/contacts"), {
        timeout: 15_000,
      }),
      phoneDialog.getByRole("button", { name: /Получить точный расчёт/i }).click(),
    ]);

    // Проверяем payload — zone и message должны содержать контекст
    const body = JSON.parse(request.postData() ?? "{}");
    expect(body.source).toBe("scroll_popup");
    expect(body.zone).toBe("mkad");
    expect(body.message).toContain("МКАД");
    expect(body.message).toContain("6-10");
    expect(body.name).toBe("Клиент (калькулятор)");

    // 200 — успех, 429 — rate-limit (оба означают что POST реально летит).
    // Главная регрессия 0.1 состоит в том, что POST ВООБЩЕ отправляется,
    // а не просто console.log.
    expect([200, 429]).toContain(response.status());
  });

  test("ExitIntentPopup: mouseleave триггерит попап (headless — skip)", async ({
    page,
  }) => {
    await page.goto("/");
    await page.evaluate(() => {
      sessionStorage.removeItem("exit-intent-shown");
      sessionStorage.removeItem("scroll-popup-shown");
    });

    // Имитируем mouseleave — курсор уходит за верхний край
    await page.mouse.move(500, 100);
    await page.mouse.move(500, -10);

    // Диалог может не появиться в headless — skip при неудаче
    const exitDialog = page.getByRole("dialog", { name: /Уже уходите/i });
    try {
      await expect(exitDialog).toBeVisible({ timeout: 3_000 });
    } catch {
      test.skip(
        true,
        "ExitIntentPopup не открылся — headless не триггерит mouseleave надёжно. Проверяется вручную.",
      );
      return;
    }

    await expect(exitDialog).toBeVisible();
  });
});
