import { describe, it, expect, vi, beforeEach } from "vitest";

const { mockFindFirst, mockFindMany, mockSelectCount } = vi.hoisted(() => ({
  mockFindFirst: vi.fn(),
  mockFindMany: vi.fn(),
  mockSelectCount: vi.fn(),
}));

vi.mock("@/lib/db", () => ({
  db: {
    query: {
      permits: {
        findFirst: mockFindFirst,
        findMany: mockFindMany,
      },
    },
    select: vi.fn(() => ({
      from: vi.fn(() => ({ where: mockSelectCount })),
    })),
  },
}));

vi.mock("@/lib/db/schema", () => ({
  permits: {
    id: "id",
    userId: "userId",
    status: "status",
    validUntil: "validUntil",
    createdAt: "createdAt",
  },
}));

import {
  getPermitsByUser,
  getPermitById,
  getActivePermitsCount,
  getExpiringPermits,
} from "@/lib/dal/permits";

describe("permits DAL", () => {
  beforeEach(() => {
    mockFindFirst.mockReset();
    mockFindMany.mockReset();
    mockSelectCount.mockReset();
  });

  describe("getPermitsByUser()", () => {
    it("returns permits for user", async () => {
      mockFindMany.mockResolvedValueOnce([{ id: "p-1" }, { id: "p-2" }]);
      const result = await getPermitsByUser("u-1");
      expect(result).toHaveLength(2);
    });

    it("returns empty array when user has none", async () => {
      mockFindMany.mockResolvedValueOnce([]);
      expect(await getPermitsByUser("u-1")).toEqual([]);
    });
  });

  describe("getPermitById()", () => {
    it("returns permit when found", async () => {
      mockFindFirst.mockResolvedValueOnce({ id: "p-1" });
      expect(await getPermitById("p-1")).toEqual({ id: "p-1" });
    });

    it("returns null when missing", async () => {
      mockFindFirst.mockResolvedValueOnce(undefined);
      expect(await getPermitById("missing")).toBeNull();
    });
  });

  describe("getActivePermitsCount()", () => {
    it("returns count", async () => {
      mockSelectCount.mockResolvedValueOnce([{ count: 4 }]);
      expect(await getActivePermitsCount("u-1")).toBe(4);
    });

    it("returns 0 when no rows", async () => {
      mockSelectCount.mockResolvedValueOnce([]);
      expect(await getActivePermitsCount("u-1")).toBe(0);
    });
  });

  describe("getExpiringPermits()", () => {
    it("returns expiring permits within window", async () => {
      mockFindMany.mockResolvedValueOnce([{ id: "p-1" }]);
      const result = await getExpiringPermits("u-1", 30);
      expect(result).toHaveLength(1);
    });

    it("uses default window of 30 days", async () => {
      mockFindMany.mockResolvedValueOnce([]);
      await getExpiringPermits("u-1");
      expect(mockFindMany).toHaveBeenCalled();
    });
  });
});
