import { describe, it, expect, vi, beforeEach } from "vitest";

const { mockFindMany, mockReturning, mockSelectCount } = vi.hoisted(() => ({
  mockFindMany: vi.fn(),
  mockReturning: vi.fn(),
  mockSelectCount: vi.fn(),
}));

vi.mock("@/lib/db", () => ({
  db: {
    query: {
      notifications: {
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
        where: mockSelectCount,
      })),
    })),
  },
}));

vi.mock("@/lib/db/schema", () => ({
  notifications: {
    id: "id",
    userId: "userId",
    status: "status",
    readAt: "readAt",
    createdAt: "createdAt",
  },
}));

import {
  createNotification,
  getNotificationsByUser,
  markAsRead,
  getUnreadCount,
  getPendingNotifications,
} from "@/lib/dal/notifications";

describe("notifications DAL", () => {
  beforeEach(() => {
    mockFindMany.mockReset();
    mockReturning.mockReset();
    mockSelectCount.mockReset();
  });

  describe("createNotification()", () => {
    it("creates notification", async () => {
      const n = { id: "n-1", userId: "u-1", type: "email" };
      mockReturning.mockResolvedValueOnce([n]);
      const result = await createNotification({
        userId: "u-1",
        type: "email",
        channel: "email",
        title: "Test",
        body: "Test body",
      } as never);
      expect(result).toEqual(n);
    });

    it("throws when insert fails", async () => {
      mockReturning.mockResolvedValueOnce([]);
      await expect(
        createNotification({ userId: "u-1" } as never),
      ).rejects.toThrow("Failed to create notification");
    });
  });

  describe("getNotificationsByUser()", () => {
    it("returns notifications scoped to user", async () => {
      mockFindMany.mockResolvedValueOnce([{ id: "n-1" }]);
      const result = await getNotificationsByUser("u-1");
      expect(result).toHaveLength(1);
    });

    it("returns empty array", async () => {
      mockFindMany.mockResolvedValueOnce([]);
      expect(await getNotificationsByUser("u-1")).toEqual([]);
    });
  });

  describe("markAsRead()", () => {
    it("marks notification as read", async () => {
      const n = { id: "n-1", status: "read" };
      mockReturning.mockResolvedValueOnce([n]);
      const result = await markAsRead("n-1");
      expect(result).toEqual(n);
    });

    it("throws when notification not found", async () => {
      mockReturning.mockResolvedValueOnce([]);
      await expect(markAsRead("missing")).rejects.toThrow(
        "Notification not found",
      );
    });
  });

  describe("getUnreadCount()", () => {
    it("returns unread count for user", async () => {
      mockSelectCount.mockResolvedValueOnce([{ count: 5 }]);
      const result = await getUnreadCount("u-1");
      expect(result).toBe(5);
    });

    it("returns 0 when no rows", async () => {
      mockSelectCount.mockResolvedValueOnce([]);
      expect(await getUnreadCount("u-1")).toBe(0);
    });
  });

  describe("getPendingNotifications()", () => {
    it("returns pending notifications", async () => {
      mockFindMany.mockResolvedValueOnce([{ id: "n-1", status: "pending" }]);
      const result = await getPendingNotifications(10);
      expect(result).toHaveLength(1);
    });
  });
});
