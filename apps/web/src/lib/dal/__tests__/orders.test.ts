import { describe, it, expect, vi, beforeEach } from "vitest";

// Use vi.hoisted so these refs are created before vi.mock factory runs.
const { mockFindFirst, mockFindMany, mockReturning, mockSelectCount, mockTransaction } = vi.hoisted(() => ({
  mockFindFirst: vi.fn(),
  mockFindMany: vi.fn(),
  mockReturning: vi.fn(),
  mockSelectCount: vi.fn(),
  mockTransaction: vi.fn(),
}));

vi.mock("@/lib/db", () => ({
  db: {
    query: {
      orders: {
        findFirst: mockFindFirst,
        findMany: mockFindMany,
      },
    },
    insert: vi.fn(() => ({
      values: vi.fn(() => ({ returning: mockReturning })),
    })),
    update: vi.fn(() => ({
      set: vi.fn(() => ({
        where: vi.fn(() => ({ returning: mockReturning })),
      })),
    })),
    delete: vi.fn(() => ({
      where: vi.fn(() => ({ returning: mockReturning })),
    })),
    select: vi.fn(() => ({
      from: vi.fn(() => ({
        where: mockSelectCount,
      })),
    })),
    transaction: mockTransaction,
  },
}));

vi.mock("@/lib/db/schema", () => ({
  orders: { id: "id", userId: "userId", managerId: "managerId", status: "status", zone: "zone", type: "type", createdAt: "createdAt" },
  orderStatusHistory: { createdAt: "createdAt", orderId: "orderId", fromStatus: "fromStatus", toStatus: "toStatus", changedBy: "changedBy" },
}));

import {
  createOrder,
  getOrderById,
  getOrdersByUser,
  getActiveOrdersCount,
  getRecentOrders,
} from "@/lib/dal/orders";

describe("orders DAL", () => {
  beforeEach(() => {
    mockFindFirst.mockReset();
    mockFindMany.mockReset();
    mockReturning.mockReset();
    mockSelectCount.mockReset();
    mockTransaction.mockReset();
  });

  describe("createOrder()", () => {
    it("creates an order and returns it", async () => {
      const fakeOrder = {
        id: "order-1",
        userId: "user-1",
        vehicleId: "v-1",
        type: "mkad_day",
        zone: "mkad",
        price: 12000,
        status: "draft",
      };
      mockReturning.mockResolvedValueOnce([fakeOrder]);

      const result = await createOrder("user-1", {
        vehicleId: "v-1",
        type: "mkad_day",
        zone: "mkad",
        price: 12000,
      } as never);

      expect(result).toEqual(fakeOrder);
    });

    it("throws when insert returns no rows", async () => {
      mockReturning.mockResolvedValueOnce([]);
      await expect(
        createOrder("user-1", {
          vehicleId: "v-1",
          type: "mkad_day",
          zone: "mkad",
          price: 12000,
        } as never),
      ).rejects.toThrow("Failed to create order");
    });
  });

  describe("getOrderById()", () => {
    it("returns the found order", async () => {
      const fakeOrder = { id: "order-1", userId: "user-1" };
      mockFindFirst.mockResolvedValueOnce(fakeOrder);

      const result = await getOrderById("order-1");
      expect(result).toEqual(fakeOrder);
      expect(mockFindFirst).toHaveBeenCalledOnce();
    });

    it("returns null when not found", async () => {
      mockFindFirst.mockResolvedValueOnce(undefined);
      const result = await getOrderById("missing");
      expect(result).toBeNull();
    });
  });

  describe("getOrdersByUser()", () => {
    it("returns paginated data scoped to userId", async () => {
      const fakeOrders = [
        { id: "1", userId: "user-1" },
        { id: "2", userId: "user-1" },
      ];
      mockFindMany.mockResolvedValueOnce(fakeOrders);
      mockSelectCount.mockResolvedValueOnce([{ count: 2 }]);

      const result = await getOrdersByUser("user-1");

      expect(result.data).toEqual(fakeOrders);
      expect(result.total).toBe(2);
      expect(result.page).toBe(1);
      expect(result.pageSize).toBe(20);
      expect(result.totalPages).toBe(1);
    });

    it("computes totalPages correctly for multi-page result", async () => {
      mockFindMany.mockResolvedValueOnce([]);
      mockSelectCount.mockResolvedValueOnce([{ count: 47 }]);

      const result = await getOrdersByUser("user-1", { page: 1, pageSize: 10 });
      expect(result.totalPages).toBe(5);
    });

    it("returns empty result when no orders", async () => {
      mockFindMany.mockResolvedValueOnce([]);
      mockSelectCount.mockResolvedValueOnce([{ count: 0 }]);

      const result = await getOrdersByUser("user-1");
      expect(result.data).toEqual([]);
      expect(result.total).toBe(0);
      expect(result.totalPages).toBe(0);
    });

    it("handles missing count row gracefully", async () => {
      mockFindMany.mockResolvedValueOnce([]);
      mockSelectCount.mockResolvedValueOnce([]);

      const result = await getOrdersByUser("user-1");
      expect(result.total).toBe(0);
    });
  });

  describe("getActiveOrdersCount()", () => {
    it("returns count of active orders", async () => {
      mockSelectCount.mockResolvedValueOnce([{ count: 3 }]);
      const result = await getActiveOrdersCount("user-1");
      expect(result).toBe(3);
    });

    it("returns 0 when no rows", async () => {
      mockSelectCount.mockResolvedValueOnce([]);
      const result = await getActiveOrdersCount("user-1");
      expect(result).toBe(0);
    });
  });

  describe("getRecentOrders()", () => {
    it("returns recent orders for the user", async () => {
      const fakeOrders = [{ id: "1" }, { id: "2" }];
      mockFindMany.mockResolvedValueOnce(fakeOrders);
      const result = await getRecentOrders("user-1", 5);
      expect(result).toEqual(fakeOrders);
      expect(mockFindMany).toHaveBeenCalledOnce();
    });

    it("uses default limit of 5", async () => {
      mockFindMany.mockResolvedValueOnce([]);
      await getRecentOrders("user-1");
      expect(mockFindMany).toHaveBeenCalledWith(
        expect.objectContaining({ limit: 5 }),
      );
    });
  });
});
