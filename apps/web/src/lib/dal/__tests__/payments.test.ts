import { describe, it, expect, vi, beforeEach } from "vitest";

const { mockFindMany, mockReturning, mockSelectQuery } = vi.hoisted(() => ({
  mockFindMany: vi.fn(),
  mockReturning: vi.fn(),
  mockSelectQuery: vi.fn(),
}));

vi.mock("@/lib/db", () => ({
  db: {
    query: {
      payments: {
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
    select: vi.fn(() => ({
      from: vi.fn(() => ({
        where: vi.fn(() => ({
          groupBy: mockSelectQuery,
        })),
      })),
    })),
  },
}));

vi.mock("@/lib/db/schema", () => ({
  payments: {
    id: "id",
    userId: "userId",
    orderId: "orderId",
    status: "status",
    amount: "amount",
  },
}));

import {
  createPayment,
  updatePaymentStatus,
  getPaymentsByUser,
  getPaymentsByOrder,
  getPaymentStats,
} from "@/lib/dal/payments";

describe("payments DAL", () => {
  beforeEach(() => {
    mockFindMany.mockReset();
    mockReturning.mockReset();
    mockSelectQuery.mockReset();
  });

  describe("createPayment()", () => {
    it("creates a payment", async () => {
      const payment = { id: "p-1", orderId: "o-1", userId: "u-1", amount: 12000 };
      mockReturning.mockResolvedValueOnce([payment]);
      const result = await createPayment("o-1", "u-1", 12000);
      expect(result).toEqual(payment);
    });

    it("throws when insert fails", async () => {
      mockReturning.mockResolvedValueOnce([]);
      await expect(createPayment("o-1", "u-1", 12000)).rejects.toThrow(
        "Failed to create payment",
      );
    });
  });

  describe("updatePaymentStatus()", () => {
    it("updates payment status", async () => {
      const payment = { id: "p-1", status: "succeeded" };
      mockReturning.mockResolvedValueOnce([payment]);
      const result = await updatePaymentStatus("p-1", "succeeded");
      expect(result).toEqual(payment);
    });

    it("updates with externalId", async () => {
      const payment = { id: "p-1", status: "pending", externalId: "ext-1" };
      mockReturning.mockResolvedValueOnce([payment]);
      const result = await updatePaymentStatus("p-1", "pending", "ext-1");
      expect(result).toEqual(payment);
    });

    it("throws when payment not found", async () => {
      mockReturning.mockResolvedValueOnce([]);
      await expect(
        updatePaymentStatus("missing", "succeeded"),
      ).rejects.toThrow("Payment not found");
    });
  });

  describe("getPaymentsByUser()", () => {
    it("returns payments for user", async () => {
      mockFindMany.mockResolvedValueOnce([{ id: "p-1" }]);
      const result = await getPaymentsByUser("u-1");
      expect(result).toHaveLength(1);
    });

    it("returns empty array", async () => {
      mockFindMany.mockResolvedValueOnce([]);
      expect(await getPaymentsByUser("u-1")).toEqual([]);
    });
  });

  describe("getPaymentsByOrder()", () => {
    it("returns payments by orderId", async () => {
      mockFindMany.mockResolvedValueOnce([{ id: "p-1", orderId: "o-1" }]);
      const result = await getPaymentsByOrder("o-1");
      expect(result).toEqual([{ id: "p-1", orderId: "o-1" }]);
    });
  });

  describe("getPaymentStats()", () => {
    it("aggregates stats correctly", async () => {
      mockSelectQuery.mockResolvedValueOnce([
        { status: "succeeded", total: 24000, count: 2 },
        { status: "pending", total: 12000, count: 1 },
      ]);
      const stats = await getPaymentStats("u-1");
      expect(stats.totalCount).toBe(3);
      expect(stats.paidAmount).toBe(24000);
      expect(stats.pendingAmount).toBe(12000);
    });

    it("returns zeroed stats when no payments", async () => {
      mockSelectQuery.mockResolvedValueOnce([]);
      const stats = await getPaymentStats("u-1");
      expect(stats).toEqual({
        totalCount: 0,
        paidAmount: 0,
        pendingAmount: 0,
      });
    });
  });
});
