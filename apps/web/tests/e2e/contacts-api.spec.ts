import { expect, test } from "@playwright/test";

/**
 * Контрактные тесты для POST /api/contacts.
 *
 * Тестируем API напрямую (без UI), чтобы поймать регрессии в:
 * - Zod-валидации (обязательные поля)
 * - Honeypot-логике (silent success для ботов)
 * - CSRF-проверке (dev-whitelist для localhost)
 * - Rate limiting: contact-form = 5 запросов / 60с с одного IP
 *
 * Rate-limiter использует `x-forwarded-for`, поэтому каждый тест посылает
 * уникальный IP-заголовок — чтобы не попадать под лимит друг друга.
 */

const BASE_URL = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000";

// Генератор уникальных IP для тестов — чтобы каждый имел свой rate-limit bucket.
let ipCounter = 0;
function uniqueIp(): string {
  ipCounter += 1;
  return `10.99.${Math.floor(ipCounter / 256)}.${ipCounter % 256}`;
}

test.describe("POST /api/contacts — контракт", () => {
  test("валидный payload → 200 OK", async ({ request }) => {
    const response = await request.post("/api/contacts", {
      data: {
        name: "Контрактный Тест",
        phone: "+7 (999) 111-22-33",
        source: "e2e_test",
      },
      headers: {
        origin: BASE_URL,
        "x-forwarded-for": uniqueIp(),
      },
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty("success", true);
  });

  test("без name → 400 validation error", async ({ request }) => {
    const response = await request.post("/api/contacts", {
      data: {
        phone: "+7 (999) 111-22-33",
      },
      headers: {
        origin: BASE_URL,
        "x-forwarded-for": uniqueIp(),
      },
    });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body).toHaveProperty("error");
  });

  test("без phone → 400 validation error", async ({ request }) => {
    const response = await request.post("/api/contacts", {
      data: {
        name: "Без Телефона",
      },
      headers: {
        origin: BASE_URL,
        "x-forwarded-for": uniqueIp(),
      },
    });

    expect(response.status()).toBe(400);
  });

  test("некорректный телефон → 400", async ({ request }) => {
    const response = await request.post("/api/contacts", {
      data: {
        name: "Кривой Телефон",
        phone: "abc",
      },
      headers: {
        origin: BASE_URL,
        "x-forwarded-for": uniqueIp(),
      },
    });

    expect(response.status()).toBe(400);
  });

  test("honeypot website заполнен → silent success (200 без лида)", async ({
    request,
  }) => {
    const response = await request.post("/api/contacts", {
      data: {
        name: "Бот",
        phone: "+7 (999) 000-00-00",
        website: "http://spam.example.com", // honeypot
      },
      headers: {
        origin: BASE_URL,
        "x-forwarded-for": uniqueIp(),
      },
    });

    // API возвращает 200, но внутри помечает как honeypot и не создаёт лид
    expect(response.status()).toBe(200);
  });

  test("недопустимый Origin → 403 CSRF", async ({ request }) => {
    const response = await request.post("/api/contacts", {
      data: {
        name: "CSRF Тест",
        phone: "+7 (999) 000-00-00",
      },
      headers: {
        origin: "https://evil.example.com",
        "x-forwarded-for": uniqueIp(),
      },
    });

    expect(response.status()).toBe(403);
    const body = await response.json();
    expect(body.error).toMatch(/CSRF/i);
  });

  test("source=scroll_popup принимается", async ({ request }) => {
    const response = await request.post("/api/contacts", {
      data: {
        name: "Клиент (калькулятор)",
        phone: "+7 (999) 222-33-44",
        source: "scroll_popup",
        zone: "mkad",
        message: "Зона: МКАД | Машин: 6-10",
      },
      headers: {
        origin: BASE_URL,
        "x-forwarded-for": uniqueIp(),
      },
    });

    expect(response.status()).toBe(200);
  });

  test("серия запросов с одного IP → срабатывает rate-limit (429)", async ({
    request,
  }) => {
    const ip = uniqueIp();
    const statuses: number[] = [];

    // Посылаем 10 запросов — лимит contact-form = 5/мин, ожидаем что
    // хотя бы один из последних вернёт 429.
    for (let i = 0; i < 10; i++) {
      const response = await request.post("/api/contacts", {
        data: {
          name: `Rate Test ${i}`,
          phone: "+7 (999) 000-00-00",
        },
        headers: { origin: BASE_URL, "x-forwarded-for": ip },
      });
      statuses.push(response.status());
    }

    expect(statuses).toContain(429);
  });
});
