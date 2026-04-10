import { describe, it, expect } from "vitest";
import {
  ORDER_STATUSES,
  ORDER_TYPES,
  ORDER_ZONES,
  USER_ROLES,
  PAYMENT_STATUSES,
  BASE_PRICES,
  ZONE_LABELS,
  ORDER_STATUS_LABELS,
  ORDER_TYPE_LABELS,
  VOLUME_DISCOUNTS,
} from "../constants";

describe("constants", () => {
  it("ORDER_STATUSES содержит канонические 8 статусов", () => {
    expect(ORDER_STATUSES).toHaveLength(8);
    expect(ORDER_STATUSES).toContain("draft");
    expect(ORDER_STATUSES).toContain("documents_pending");
    expect(ORDER_STATUSES).toContain("documents_review");
    expect(ORDER_STATUSES).toContain("payment_pending");
    expect(ORDER_STATUSES).toContain("in_progress");
    expect(ORDER_STATUSES).toContain("approved");
    expect(ORDER_STATUSES).toContain("rejected");
    expect(ORDER_STATUSES).toContain("cancelled");
  });

  it("ORDER_TYPES содержит 5 типов заявок", () => {
    expect(ORDER_TYPES).toHaveLength(5);
    expect(ORDER_TYPES).toContain("mkad_day");
    expect(ORDER_TYPES).toContain("temp");
  });

  it("ORDER_ZONES содержит 3 зоны", () => {
    expect(ORDER_ZONES).toEqual(["mkad", "ttk", "sk"]);
  });

  it("USER_ROLES содержит 4 роли", () => {
    expect(USER_ROLES).toEqual(["client", "manager", "admin", "partner"]);
  });

  it("PAYMENT_STATUSES содержит 4 статуса", () => {
    expect(PAYMENT_STATUSES).toEqual([
      "pending",
      "succeeded",
      "cancelled",
      "refunded",
    ]);
  });

  it("BASE_PRICES содержит цены для всех типов заявок", () => {
    for (const type of ORDER_TYPES) {
      expect(BASE_PRICES[type]).toBeGreaterThan(0);
    }
  });

  it("ZONE_LABELS содержит русские названия для всех зон", () => {
    for (const zone of ORDER_ZONES) {
      expect(ZONE_LABELS[zone]).toBeDefined();
      expect(typeof ZONE_LABELS[zone]).toBe("string");
    }
  });

  it("ORDER_STATUS_LABELS содержит метки для всех статусов", () => {
    for (const status of ORDER_STATUSES) {
      expect(ORDER_STATUS_LABELS[status]).toBeDefined();
    }
  });

  it("ORDER_TYPE_LABELS содержит метки для всех типов", () => {
    for (const type of ORDER_TYPES) {
      expect(ORDER_TYPE_LABELS[type]).toBeDefined();
    }
  });

  it("VOLUME_DISCOUNTS отсортированы по возрастанию minVehicles", () => {
    for (let i = 1; i < VOLUME_DISCOUNTS.length; i++) {
      expect(VOLUME_DISCOUNTS[i].minVehicles).toBeGreaterThan(
        VOLUME_DISCOUNTS[i - 1].minVehicles,
      );
    }
  });

  it("VOLUME_DISCOUNTS — скидки возрастают", () => {
    for (let i = 1; i < VOLUME_DISCOUNTS.length; i++) {
      expect(VOLUME_DISCOUNTS[i].discountPercent).toBeGreaterThan(
        VOLUME_DISCOUNTS[i - 1].discountPercent,
      );
    }
  });
});
