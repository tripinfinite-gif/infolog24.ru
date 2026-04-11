import { describe, it, expect } from "vitest";
import {
  ORDER_STATES,
  canTransition,
  getNextStatuses,
  getStatusLabel,
  getStatusColor,
  type OrderStatus,
} from "@/lib/automation/order-state-machine";

describe("order state machine — ORDER_STATES", () => {
  it("defines all 8 canonical states", () => {
    const states = Object.keys(ORDER_STATES);
    expect(states).toHaveLength(8);
    expect(states).toContain("draft");
    expect(states).toContain("documents_pending");
    expect(states).toContain("payment_pending");
    expect(states).toContain("processing");
    expect(states).toContain("submitted");
    expect(states).toContain("approved");
    expect(states).toContain("rejected");
    expect(states).toContain("cancelled");
  });

  it("approved is a terminal state (no next transitions)", () => {
    expect(ORDER_STATES.approved.next).toEqual([]);
  });
});

describe("canTransition()", () => {
  it("allows draft → documents_pending", () => {
    expect(canTransition("draft", "documents_pending")).toBe(true);
  });

  it("allows draft → cancelled", () => {
    expect(canTransition("draft", "cancelled")).toBe(true);
  });

  it("allows documents_pending → payment_pending", () => {
    expect(canTransition("documents_pending", "payment_pending")).toBe(true);
  });

  it("allows payment_pending → processing", () => {
    expect(canTransition("payment_pending", "processing")).toBe(true);
  });

  it("allows processing → submitted", () => {
    expect(canTransition("processing", "submitted")).toBe(true);
  });

  it("allows submitted → approved", () => {
    expect(canTransition("submitted", "approved")).toBe(true);
  });

  it("allows submitted → rejected", () => {
    expect(canTransition("submitted", "rejected")).toBe(true);
  });

  it("allows rejected → draft (retry)", () => {
    expect(canTransition("rejected", "draft")).toBe(true);
  });

  it("disallows draft → approved (must go through full flow)", () => {
    expect(canTransition("draft", "approved")).toBe(false);
  });

  it("disallows approved → draft (terminal)", () => {
    expect(canTransition("approved", "draft")).toBe(false);
  });

  it("disallows approved → anything (terminal)", () => {
    const allStatuses: OrderStatus[] = [
      "draft",
      "documents_pending",
      "payment_pending",
      "processing",
      "submitted",
      "approved",
      "rejected",
      "cancelled",
    ];
    for (const status of allStatuses) {
      expect(canTransition("approved", status)).toBe(false);
    }
  });

  it("disallows draft → processing (skips documents & payment)", () => {
    expect(canTransition("draft", "processing")).toBe(false);
  });

  it("disallows documents_pending → approved (skips processing)", () => {
    expect(canTransition("documents_pending", "approved")).toBe(false);
  });

  it("models the full happy path", () => {
    const path: OrderStatus[] = [
      "draft",
      "documents_pending",
      "payment_pending",
      "processing",
      "submitted",
      "approved",
    ];
    for (let i = 0; i < path.length - 1; i++) {
      expect(canTransition(path[i]!, path[i + 1]!)).toBe(true);
    }
  });
});

describe("getNextStatuses()", () => {
  it("returns empty array for terminal state approved", () => {
    expect(getNextStatuses("approved")).toEqual([]);
  });

  it("returns valid next statuses for draft", () => {
    const next = getNextStatuses("draft");
    expect(next).toContain("documents_pending");
    expect(next).toContain("cancelled");
  });

  it("returns valid next statuses for submitted", () => {
    const next = getNextStatuses("submitted");
    expect(next).toContain("approved");
    expect(next).toContain("rejected");
  });

  it("returns a new array (not mutable reference)", () => {
    const next1 = getNextStatuses("draft");
    const next2 = getNextStatuses("draft");
    expect(next1).not.toBe(next2);
    expect(next1).toEqual(next2);
  });
});

describe("getStatusLabel()", () => {
  it("returns Russian labels for each status", () => {
    expect(getStatusLabel("draft")).toBe("Черновик");
    expect(getStatusLabel("approved")).toBe("Одобрена");
    expect(getStatusLabel("rejected")).toBe("Отклонена");
    expect(getStatusLabel("cancelled")).toBe("Отменена");
  });
});

describe("getStatusColor()", () => {
  it("returns Tailwind class strings for each status", () => {
    expect(getStatusColor("draft")).toMatch(/text-|bg-/);
    expect(getStatusColor("approved")).toMatch(/green/);
    expect(getStatusColor("rejected")).toMatch(/red/);
  });
});
