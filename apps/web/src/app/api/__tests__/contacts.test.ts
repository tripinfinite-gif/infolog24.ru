import { describe, it, expect, vi, beforeEach } from "vitest";

const { mockSendEmail, mockCreateDeal } = vi.hoisted(() => ({
  mockSendEmail: vi.fn(),
  mockCreateDeal: vi.fn(),
}));

vi.mock("@/lib/notifications/channels/email", () => ({
  sendEmailMessage: mockSendEmail,
}));

vi.mock("@/lib/integrations/bitrix24", () => ({
  createDeal: mockCreateDeal,
}));

import { POST } from "@/app/api/contacts/route";

function makeRequest(body: unknown): Request {
  return new Request("https://infolog24.ru/api/contacts", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/contacts", () => {
  beforeEach(() => {
    mockSendEmail.mockReset();
    mockCreateDeal.mockReset();
    mockSendEmail.mockResolvedValue({ success: true, id: "email-1" });
    mockCreateDeal.mockResolvedValue({ ok: true, data: 123 });
  });

  it("returns 200 for valid contact form", async () => {
    const response = await POST(
      makeRequest({
        name: "Иван Петров",
        phone: "+74951234567",
        email: "ivan@example.com",
        message: "Нужен пропуск",
      }),
    );
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.success).toBe(true);
  });

  it("accepts minimal valid payload", async () => {
    const response = await POST(
      makeRequest({ name: "Иван", phone: "+74951234567" }),
    );
    expect(response.status).toBe(200);
  });

  it("returns 400 for missing name", async () => {
    const response = await POST(
      makeRequest({ name: "", phone: "+74951234567" }),
    );
    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.success).toBe(false);
    expect(body.error).toBeDefined();
  });

  it("returns 400 for invalid phone", async () => {
    const response = await POST(
      makeRequest({ name: "Иван", phone: "abc" }),
    );
    expect(response.status).toBe(400);
  });

  it("returns 400 for invalid email", async () => {
    const response = await POST(
      makeRequest({
        name: "Иван",
        phone: "+74951234567",
        email: "not-email",
      }),
    );
    expect(response.status).toBe(400);
  });

  it("returns 500 for malformed JSON", async () => {
    const badRequest = new Request("https://infolog24.ru/api/contacts", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: "{not json",
    });
    const response = await POST(badRequest);
    expect(response.status).toBe(500);
  });

  it("accepts and formats context for email/bitrix", async () => {
    const response = await POST(
      makeRequest({
        name: "Иван",
        phone: "+74951234567",
        context: {
          zone: "МКАД",
          price: "12 000 ₽",
          utm_source: "yandex",
        },
      }),
    );
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.success).toBe(true);

    // Bitrix deal вызывается и в комментариях есть отформатированный контекст.
    expect(mockCreateDeal).toHaveBeenCalledTimes(1);
    const dealArg = mockCreateDeal.mock.calls[0][0];
    expect(dealArg.comments).toContain("Зона: МКАД");
    expect(dealArg.comments).toContain("Рассчитанная цена: 12 000 ₽");
    expect(dealArg.comments).toContain("UTM source: yandex");
    expect(dealArg.comments).toContain("=== Контекст заявки ===");
    expect(dealArg.comments).toContain("=== Атрибуция ===");

    // Email (если настроен ADMIN_EMAIL) получает те же данные в HTML.
    if (mockSendEmail.mock.calls.length > 0) {
      const emailArg = mockSendEmail.mock.calls[0][0];
      expect(emailArg.html).toContain("Зона: МКАД");
    }
  });

  it("silently succeeds on honeypot (website field) without creating deal", async () => {
    const response = await POST(
      makeRequest({
        name: "Bot",
        phone: "+74951234567",
        website: "spam-link.example",
      }),
    );
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.success).toBe(true);

    // Honeypot → не должны ни слать email, ни создавать deal.
    expect(mockSendEmail).not.toHaveBeenCalled();
    expect(mockCreateDeal).not.toHaveBeenCalled();
  });
});
