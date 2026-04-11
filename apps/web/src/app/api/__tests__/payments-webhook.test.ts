import { describe, it, expect, vi, beforeEach } from "vitest";

const { mockHandleWebhook, mockGetPayment } = vi.hoisted(() => ({
  mockHandleWebhook: vi.fn(),
  mockGetPayment: vi.fn(),
}));

vi.mock("@/lib/payments/service", () => ({
  getPaymentService: () => ({ handleWebhook: mockHandleWebhook }),
}));

vi.mock("@/lib/payments/yookassa", () => ({
  getYooKassaClient: () => ({ getPayment: mockGetPayment }),
}));

import { POST } from "@/app/api/payments/webhook/route";

function makeWebhookRequest(body: unknown, clientIp = "185.71.76.1"): Request {
  return new Request("https://infolog24.ru/api/payments/webhook", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-forwarded-for": clientIp,
    },
    body: JSON.stringify(body),
  });
}

describe("POST /api/payments/webhook (YooKassa)", () => {
  beforeEach(() => {
    mockHandleWebhook.mockReset();
    mockGetPayment.mockReset();
  });

  const validPayload = {
    type: "notification",
    event: "payment.succeeded",
    object: {
      id: "payment-123",
      status: "succeeded",
      amount: { value: "12000.00", currency: "RUB" },
      metadata: { orderId: "o-1" },
    },
  };

  it("returns 403 for request from non-whitelisted IP", async () => {
    const response = await POST(
      makeWebhookRequest(validPayload, "1.2.3.4"),
    );
    expect(response.status).toBe(403);
  });

  it("accepts request from YooKassa 185.71.76.x range", async () => {
    mockGetPayment.mockResolvedValueOnce({ status: "succeeded" });
    mockHandleWebhook.mockResolvedValueOnce(undefined);
    const response = await POST(
      makeWebhookRequest(validPayload, "185.71.76.10"),
    );
    expect(response.status).toBe(200);
  });

  it("accepts request from YooKassa single IP 77.75.156.11", async () => {
    mockGetPayment.mockResolvedValueOnce({ status: "succeeded" });
    mockHandleWebhook.mockResolvedValueOnce(undefined);
    const response = await POST(
      makeWebhookRequest(validPayload, "77.75.156.11"),
    );
    expect(response.status).toBe(200);
  });

  it("returns 400 for invalid JSON payload", async () => {
    const badRequest = new Request(
      "https://infolog24.ru/api/payments/webhook",
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-forwarded-for": "185.71.76.10",
        },
        body: "{not-json",
      },
    );
    const response = await POST(badRequest);
    expect(response.status).toBe(400);
  });

  it("returns 400 for schema-invalid payload", async () => {
    const response = await POST(
      makeWebhookRequest(
        { type: "notification", event: "payment.succeeded" },
        "185.71.76.10",
      ),
    );
    expect(response.status).toBe(400);
  });

  it("returns 400 when webhook status mismatches API status", async () => {
    mockGetPayment.mockResolvedValueOnce({ status: "pending" });
    const response = await POST(
      makeWebhookRequest(validPayload, "185.71.76.10"),
    );
    expect(response.status).toBe(400);
    expect(mockHandleWebhook).not.toHaveBeenCalled();
  });

  it("calls handleWebhook on successful verification", async () => {
    mockGetPayment.mockResolvedValueOnce({ status: "succeeded" });
    mockHandleWebhook.mockResolvedValueOnce(undefined);
    await POST(makeWebhookRequest(validPayload, "185.71.76.10"));
    expect(mockHandleWebhook).toHaveBeenCalledOnce();
  });
});
