import { describe, it, expect, vi, beforeEach } from "vitest";

const { mockFindFirst, mockFindMany, mockReturning } = vi.hoisted(() => ({
  mockFindFirst: vi.fn(),
  mockFindMany: vi.fn(),
  mockReturning: vi.fn(),
}));

vi.mock("@/lib/db", () => ({
  db: {
    query: {
      vehicles: {
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
  },
}));

vi.mock("@/lib/db/schema", () => ({
  vehicles: { id: "id", userId: "userId" },
}));

import {
  createVehicle,
  getVehiclesByUser,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
} from "@/lib/dal/vehicles";

describe("vehicles DAL", () => {
  beforeEach(() => {
    mockFindFirst.mockReset();
    mockFindMany.mockReset();
    mockReturning.mockReset();
  });

  describe("createVehicle()", () => {
    it("creates vehicle scoped to userId", async () => {
      const vehicle = {
        id: "v-1",
        userId: "u-1",
        registrationNumber: "А123БВ77",
        brand: "КАМАЗ",
        model: "65115",
        year: 2020,
        maxWeight: 15000,
      };
      mockReturning.mockResolvedValueOnce([vehicle]);

      const result = await createVehicle("u-1", {
        registrationNumber: "А123БВ77",
        brand: "КАМАЗ",
        model: "65115",
        year: 2020,
        maxWeight: 15000,
      } as never);

      expect(result).toEqual(vehicle);
    });

    it("throws when insert fails", async () => {
      mockReturning.mockResolvedValueOnce([]);
      await expect(
        createVehicle("u-1", {
          registrationNumber: "А123БВ77",
        } as never),
      ).rejects.toThrow("Failed to create vehicle");
    });
  });

  describe("getVehiclesByUser()", () => {
    it("returns vehicles for the user", async () => {
      const vehicles = [{ id: "1" }, { id: "2" }];
      mockFindMany.mockResolvedValueOnce(vehicles);
      const result = await getVehiclesByUser("u-1");
      expect(result).toEqual(vehicles);
    });

    it("returns empty array when user has no vehicles", async () => {
      mockFindMany.mockResolvedValueOnce([]);
      const result = await getVehiclesByUser("u-1");
      expect(result).toEqual([]);
    });
  });

  describe("getVehicleById()", () => {
    it("returns vehicle when found", async () => {
      mockFindFirst.mockResolvedValueOnce({ id: "v-1" });
      const result = await getVehicleById("v-1");
      expect(result).toEqual({ id: "v-1" });
    });

    it("returns null when not found", async () => {
      mockFindFirst.mockResolvedValueOnce(undefined);
      const result = await getVehicleById("missing");
      expect(result).toBeNull();
    });
  });

  describe("updateVehicle()", () => {
    it("updates vehicle", async () => {
      const updated = { id: "v-1", brand: "MAN" };
      mockReturning.mockResolvedValueOnce([updated]);
      const result = await updateVehicle("v-1", { brand: "MAN" });
      expect(result).toEqual(updated);
    });

    it("throws when vehicle not found", async () => {
      mockReturning.mockResolvedValueOnce([]);
      await expect(updateVehicle("missing", {})).rejects.toThrow(
        "Vehicle not found",
      );
    });
  });

  describe("deleteVehicle()", () => {
    it("deletes vehicle successfully", async () => {
      mockReturning.mockResolvedValueOnce([{ id: "v-1" }]);
      await expect(deleteVehicle("v-1")).resolves.toBeUndefined();
    });

    it("throws when vehicle not found", async () => {
      mockReturning.mockResolvedValueOnce([]);
      await expect(deleteVehicle("missing")).rejects.toThrow(
        "Vehicle not found",
      );
    });
  });
});
