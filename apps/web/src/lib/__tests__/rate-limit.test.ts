import { describe, it, expect, vi } from "vitest";

// Override the global setup mock to test the real implementation.
vi.unmock("@/lib/security/rate-limit");

const { rateLimit, getClientIp, rateLimitResponse } = await vi.importActual<
  typeof import("@/lib/security/rate-limit")
>("@/lib/security/rate-limit");

describe("getClientIp()", () => {
  it("returns first IP from x-forwarded-for", () => {
    const request = new Request("https://example.com/", {
      headers: { "x-forwarded-for": "1.2.3.4, 5.6.7.8" },
    });
    expect(getClientIp(request)).toBe("1.2.3.4");
  });

  it("falls back to x-real-ip", () => {
    const request = new Request("https://example.com/", {
      headers: { "x-real-ip": "9.9.9.9" },
    });
    expect(getClientIp(request)).toBe("9.9.9.9");
  });

  it("returns 'unknown' when no IP headers", () => {
    const request = new Request("https://example.com/");
    expect(getClientIp(request)).toBe("unknown");
  });
});

describe("rateLimit() — in-memory fallback", () => {
  it("allows first request under limit", async () => {
    // Use a unique identifier to avoid collision with other tests
    const id = `test-${Math.random()}`;
    const result = await rateLimit("contact-form", id);
    expect(result.success).toBe(true);
    expect(result.current).toBe(1);
  });

  it("blocks after limit is exceeded", async () => {
    const id = `test-block-${Math.random()}`;
    // contact-form limit = 5
    for (let i = 0; i < 5; i++) {
      const r = await rateLimit("contact-form", id);
      expect(r.success).toBe(true);
    }
    const blocked = await rateLimit("contact-form", id);
    expect(blocked.success).toBe(false);
    expect(blocked.retryAfterSec).toBeGreaterThan(0);
  });

  it("uses separate counters for different identifiers", async () => {
    const id1 = `test-a-${Math.random()}`;
    const id2 = `test-b-${Math.random()}`;
    for (let i = 0; i < 5; i++) {
      await rateLimit("contact-form", id1);
    }
    const result = await rateLimit("contact-form", id2);
    expect(result.success).toBe(true);
  });
});

describe("rateLimitResponse()", () => {
  it("returns 429 with correct headers", () => {
    const response = rateLimitResponse({
      success: false,
      current: 10,
      limit: 5,
      retryAfterSec: 60,
      resetAt: Date.now() + 60000,
    });
    expect(response.status).toBe(429);
    expect(response.headers.get("Retry-After")).toBe("60");
    expect(response.headers.get("X-RateLimit-Limit")).toBe("5");
  });
});
