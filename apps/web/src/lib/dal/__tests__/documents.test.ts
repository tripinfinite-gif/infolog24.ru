import { describe, it, expect, vi, beforeEach } from "vitest";

const { mockFindFirst, mockFindMany, mockReturning } = vi.hoisted(() => ({
  mockFindFirst: vi.fn(),
  mockFindMany: vi.fn(),
  mockReturning: vi.fn(),
}));

vi.mock("@/lib/db", () => ({
  db: {
    query: {
      documents: {
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
  },
}));

vi.mock("@/lib/db/schema", () => ({
  documents: { id: "id", userId: "userId", orderId: "orderId" },
}));

import {
  uploadDocument,
  getDocumentsByOrder,
  getDocumentsByUser,
  getDocumentById,
  updateDocumentStatus,
} from "@/lib/dal/documents";

describe("documents DAL", () => {
  beforeEach(() => {
    mockFindFirst.mockReset();
    mockFindMany.mockReset();
    mockReturning.mockReset();
  });

  describe("uploadDocument()", () => {
    it("creates a document", async () => {
      const doc = { id: "d-1", orderId: "o-1", type: "pts" };
      mockReturning.mockResolvedValueOnce([doc]);
      const result = await uploadDocument({
        orderId: "o-1",
        type: "pts",
        fileName: "pts.pdf",
        mimeType: "application/pdf",
        fileSize: 1000,
        url: "https://example.com/pts.pdf",
        userId: "u-1",
      } as never);
      expect(result).toEqual(doc);
    });

    it("throws when insert returns nothing", async () => {
      mockReturning.mockResolvedValueOnce([]);
      await expect(
        uploadDocument({ orderId: "o-1" } as never),
      ).rejects.toThrow("Failed to create document");
    });
  });

  describe("getDocumentsByOrder()", () => {
    it("returns documents for an order", async () => {
      mockFindMany.mockResolvedValueOnce([{ id: "1" }]);
      const result = await getDocumentsByOrder("o-1");
      expect(result).toEqual([{ id: "1" }]);
    });

    it("returns empty array for order without documents", async () => {
      mockFindMany.mockResolvedValueOnce([]);
      const result = await getDocumentsByOrder("o-1");
      expect(result).toEqual([]);
    });
  });

  describe("getDocumentsByUser()", () => {
    it("returns documents scoped to userId", async () => {
      mockFindMany.mockResolvedValueOnce([{ id: "d-1", userId: "u-1" }]);
      const result = await getDocumentsByUser("u-1");
      expect(result).toHaveLength(1);
    });
  });

  describe("getDocumentById()", () => {
    it("returns doc when found", async () => {
      mockFindFirst.mockResolvedValueOnce({ id: "d-1" });
      expect(await getDocumentById("d-1")).toEqual({ id: "d-1" });
    });

    it("returns null when not found", async () => {
      mockFindFirst.mockResolvedValueOnce(undefined);
      expect(await getDocumentById("missing")).toBeNull();
    });
  });

  describe("updateDocumentStatus()", () => {
    it("updates status to approved", async () => {
      const doc = { id: "d-1", status: "approved" };
      mockReturning.mockResolvedValueOnce([doc]);
      const result = await updateDocumentStatus("d-1", "approved");
      expect(result).toEqual(doc);
    });

    it("updates status with rejection reason", async () => {
      const doc = { id: "d-1", status: "rejected", rejectionReason: "blurry" };
      mockReturning.mockResolvedValueOnce([doc]);
      const result = await updateDocumentStatus("d-1", "rejected", "blurry");
      expect(result).toEqual(doc);
    });

    it("throws when document missing", async () => {
      mockReturning.mockResolvedValueOnce([]);
      await expect(
        updateDocumentStatus("missing", "approved"),
      ).rejects.toThrow("Document not found");
    });
  });
});
