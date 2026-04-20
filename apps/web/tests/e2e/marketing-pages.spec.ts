import { expect, test } from "@playwright/test";

/**
 * Юр-проверки ключевых маркетинговых страниц.
 *
 * После встречи руководителей 20.04.2026 позиционирование изменилось:
 * «сопровождаем и консультируем» вместо «делаем за клиента / под ключ».
 *
 * Запрещённые формулировки (юр-риск):
 * - «оформляем пропуск», «оформим пропуск», «получим пропуск»
 * - «выпускаем ЭЦП», «выпустим УКЭП», «выпуск УКЭП под ключ»
 * - «гарантия включения» (было в /goslog v2, заменено в v3)
 * - «под ключ» в контексте услуг, которые требуют лицензии УЦ
 *
 * Разрешённые формулировки:
 * - «помогаем с получением», «сопровождаем переход»
 * - «через партнёра (Контур/СБИС/Такском)»
 *
 * Эти тесты — защита от регрессий в будущих копирайтах.
 */

const FORBIDDEN_SITE_WIDE = [
  /оформляем пропуска/i,
  /получим пропуск/i,
  /выдадим пропуск/i,
];

const FORBIDDEN_IN_KEP = [
  /выпускаем ЭЦП/i,
  /выпустим УКЭП/i,
  /выпуск УКЭП под ключ/i,
  /мы делаем всё под ключ/i,
];

const FORBIDDEN_IN_GOSLOG = [
  /гарантия включения/i,
  /включим в реестр или вернём деньги/i,
  // v3 таргетит перевозчиков — не экспедиторов.
  // Фраза «до 30 апреля 2026» в Hero — это v2 позиционирование.
  /30 апреля 2026.*дедлайн.*для вас/i,
];

test.describe("Marketing pages — юр-чистота", () => {
  test("/ главная не содержит запрещённых формулировок", async ({ page }) => {
    await page.goto("/");
    const bodyText = await page.locator("body").innerText();

    for (const pattern of FORBIDDEN_SITE_WIDE) {
      expect(bodyText, `Паттерн ${pattern} найден на главной`).not.toMatch(pattern);
    }
  });

  test("/kep — нет «под ключ» и «выпускаем ЭЦП»", async ({ page }) => {
    const response = await page.goto("/kep");
    expect(response?.status()).toBeLessThan(400);

    const bodyText = await page.locator("body").innerText();

    for (const pattern of FORBIDDEN_IN_KEP) {
      expect(bodyText, `Паттерн ${pattern} найден на /kep`).not.toMatch(pattern);
    }

    // Должно присутствовать партнёрское позиционирование
    expect(bodyText).toMatch(/Контур|СБИС|Такском|ФНС/i);
    expect(bodyText).toMatch(/сопровожд|помога|помощь/i);
  });

  test("/goslog v3 — позиционирование «сопровождаем» для перевозчиков", async ({
    page,
  }) => {
    const response = await page.goto("/goslog");
    expect(response?.status()).toBeLessThan(400);

    const bodyText = await page.locator("body").innerText();

    for (const pattern of FORBIDDEN_IN_GOSLOG) {
      expect(bodyText, `Паттерн ${pattern} найден на /goslog`).not.toMatch(pattern);
    }

    // v3 должна упоминать перевозчиков и 1 марта 2027
    expect(bodyText).toMatch(/перевозчик/i);
    expect(bodyText).toMatch(/1 марта 2027|01\.03\.2027/i);
    // Не должно быть «под ключ» и «выпустим УКЭП»
    expect(bodyText).not.toMatch(/выпустим УКЭП|выпуск УКЭП под ключ/i);
  });

  test("/etrn — «сопровождаем переход», не «делаем»", async ({ page }) => {
    const response = await page.goto("/etrn");
    expect(response?.status()).toBeLessThan(400);

    const bodyText = await page.locator("body").innerText();

    // Не должно быть «делаем ЭТрН за вас» и подобного
    expect(bodyText).not.toMatch(/делаем ЭТрН/i);
    expect(bodyText).not.toMatch(/оформляем ЭТрН под ключ/i);

    // Должно упоминаться сопровождение или переход
    expect(bodyText).toMatch(/сопровожд|переход|помога|помощь/i);
  });

  test("Нет страницы /kep-mchd (удалена)", async ({ page, request }) => {
    const response = await request.get("/kep-mchd");
    // Либо 404, либо 301/302 редирект — главное что не 200
    expect([301, 302, 308, 404]).toContain(response.status());
  });
});
