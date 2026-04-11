import { describe, it, expect, vi, beforeEach } from "vitest";

const { mockGetSession, mockGetOrdersByUser, mockCreateOrder, mockGetOrderById } =
  vi.hoisted(() => ({
    mockGetSession: vi.fn(),
    mockGetOrdersByUser: vi.fn(),
    mockCreateOrder: vi.fn(),
    mockGetOrderById: vi.fn(),
  }));

vi.mock("@/lib/auth/session", () => ({
  getSession: mockGetSession,
  requireSession: vi.fn(),
  requireRole: vi.fn(),
}));

vi.mock("@/lib/dal/orders", () => ({
  getOrdersByUser: mockGetOrdersByUser,
  createOrder: mockCreateOrder,
  getOrderById: mockGetOrderById,
  assignManager: vi.fn(),
}));

import { GET, POST } from "@/app/api/orders/route";

function makeJsonRequest(url: string, body: unknown, method = "POST"): Request {
  return new Request(url, {
    method,
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("GET /api/orders", () => {
  beforeEach(() => {
    mockGetSession.mockReset();
    mockGetOrdersByUser.mockReset();
  });

  it("returns 401 when no session", async () => {
    mockGetSession.mockResolvedValueOnce(null);
    const response = await GET(
      new Request("https://infolog24.ru/api/orders"),
    );
    expect(response.status).toBe(401);
  });

  it("returns orders for authenticated user", async () => {
    mockGetSession.mockResolvedValueOnce({
      user: { id: "u-1", email: "test@example.com" },
    });
    mockGetOrdersByUser.mockResolvedValueOnce({
      data: [{ id: "o-1" }],
      total: 1,
      page: 1,
      pageSize: 20,
      totalPages: 1,
    });

    const response = await GET(
      new Request("https://infolog24.ru/api/orders?page=1&pageSize=20"),
    );
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.data).toHaveLength(1);
    expect(mockGetOrdersByUser).toHaveBeenCalledWith(
      "u-1",
      expect.objectContaining({ page: 1, pageSize: 20 }),
    );
  });

  it("returns 500 on DAL error", async () => {
    mockGetSession.mockResolvedValueOnce({ user: { id: "u-1" } });
    mockGetOrdersByUser.mockRejectedValueOnce(new Error("boom"));
    const response = await GET(
      new Request("https://infolog24.ru/api/orders"),
    );
    expect(response.status).toBe(500);
  });
});

describe("POST /api/orders", () => {
  beforeEach(() => {
    mockGetSession.mockReset();
    mockCreateOrder.mockReset();
  });

  it("returns 401 when not authenticated", async () => {
    mockGetSession.mockResolvedValueOnce(null);
    const response = await POST(
      makeJsonRequest("https://infolog24.ru/api/orders", {
        vehicleId: "550e8400-e29b-41d4-a716-446655440000",
        type: "mkad_day",
        zone: "mkad",
        price: 12000,
      }),
    );
    expect(response.status).toBe(401);
  });

  it("creates an order for valid payload", async () => {
    mockGetSession.mockResolvedValueOnce({ user: { id: "u-1" } });
    const created = {
      id: "o-1",
      userId: "u-1",
      vehicleId: "550e8400-e29b-41d4-a716-446655440000",
    };
    mockCreateOrder.mockResolvedValueOnce(created);

    const response = await POST(
      makeJsonRequest("https://infolog24.ru/api/orders", {
        vehicleId: "550e8400-e29b-41d4-a716-446655440000",
        type: "mkad_day",
        zone: "mkad",
        price: 12000,
      }),
    );
    expect(response.status).toBe(201);
    const body = await response.json();
    expect(body.id).toBe("o-1");
  });

  it("returns 400 for invalid payload", async () => {
    mockGetSession.mockResolvedValueOnce({ user: { id: "u-1" } });
    const response = await POST(
      makeJsonRequest("https://infolog24.ru/api/orders", {
        vehicleId: "not-a-uuid",
        type: "mkad_day",
        zone: "mkad",
        price: 12000,
      }),
    );
    expect(response.status).toBe(400);
  });

  it("returns 400 for missing required fields", async () => {
    mockGetSession.mockResolvedValueOnce({ user: { id: "u-1" } });
    const response = await POST(
      makeJsonRequest("https://infolog24.ru/api/orders", { foo: "bar" }),
    );
    expect(response.status).toBe(400);
  });

  it("returns 500 on DAL exception", async () => {
    mockGetSession.mockResolvedValueOnce({ user: { id: "u-1" } });
    mockCreateOrder.mockRejectedValueOnce(new Error("db down"));
    const response = await POST(
      makeJsonRequest("https://infolog24.ru/api/orders", {
        vehicleId: "550e8400-e29b-41d4-a716-446655440000",
        type: "mkad_day",
        zone: "mkad",
        price: 12000,
      }),
    );
    expect(response.status).toBe(500);
  });
});
