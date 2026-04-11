import { describe, it, expect } from "vitest";
import { validateCsrf } from "@/lib/security/csrf";

function makeRequest(opts: {
  method: string;
  url: string;
  headers?: Record<string, string>;
}) {
  const headers = new Map(Object.entries(opts.headers ?? {}));
  return {
    method: opts.method,
    url: opts.url,
    headers: {
      get(name: string) {
        return headers.get(name.toLowerCase()) ?? null;
      },
    },
  };
}

describe("validateCsrf()", () => {
  const ALLOWED = "https://infolog24.ru";

  it("allows GET without Origin", () => {
    const result = validateCsrf(
      makeRequest({ method: "GET", url: `${ALLOWED}/api/foo` }),
    );
    expect(result.valid).toBe(true);
  });

  it("allows HEAD without Origin", () => {
    expect(
      validateCsrf(
        makeRequest({ method: "HEAD", url: `${ALLOWED}/api/foo` }),
      ).valid,
    ).toBe(true);
  });

  it("allows POST with matching Origin", () => {
    const result = validateCsrf(
      makeRequest({
        method: "POST",
        url: `${ALLOWED}/api/orders`,
        headers: { origin: ALLOWED },
      }),
    );
    expect(result.valid).toBe(true);
  });

  it("rejects POST with foreign Origin", () => {
    const result = validateCsrf(
      makeRequest({
        method: "POST",
        url: `${ALLOWED}/api/orders`,
        headers: { origin: "https://evil.com" },
      }),
    );
    expect(result.valid).toBe(false);
    expect(result.reason).toMatch(/Недопустимый Origin/);
  });

  it("allows POST with matching Referer when no Origin", () => {
    const result = validateCsrf(
      makeRequest({
        method: "POST",
        url: `${ALLOWED}/api/orders`,
        headers: { referer: `${ALLOWED}/checkout` },
      }),
    );
    expect(result.valid).toBe(true);
  });

  it("rejects POST with foreign Referer", () => {
    const result = validateCsrf(
      makeRequest({
        method: "POST",
        url: `${ALLOWED}/api/orders`,
        headers: { referer: "https://evil.com/page" },
      }),
    );
    expect(result.valid).toBe(false);
  });

  it("rejects POST with no Origin and no Referer", () => {
    const result = validateCsrf(
      makeRequest({ method: "POST", url: `${ALLOWED}/api/orders` }),
    );
    expect(result.valid).toBe(false);
  });

  it("rejects POST with invalid Referer URL", () => {
    const result = validateCsrf(
      makeRequest({
        method: "POST",
        url: `${ALLOWED}/api/orders`,
        headers: { referer: "not-a-url" },
      }),
    );
    expect(result.valid).toBe(false);
  });

  it("exempts YooKassa webhook path", () => {
    const result = validateCsrf(
      makeRequest({
        method: "POST",
        url: `${ALLOWED}/api/payments/webhook`,
      }),
    );
    expect(result.valid).toBe(true);
  });

  it("exempts telegram webhook path", () => {
    const result = validateCsrf(
      makeRequest({ method: "POST", url: `${ALLOWED}/api/telegram/bot` }),
    );
    expect(result.valid).toBe(true);
  });

  it("exempts cron paths", () => {
    const result = validateCsrf(
      makeRequest({ method: "POST", url: `${ALLOWED}/api/cron/daily` }),
    );
    expect(result.valid).toBe(true);
  });
});
