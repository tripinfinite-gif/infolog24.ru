import { describe, it, expect } from "vitest";
import { GET } from "@/app/api/health/route";

describe("GET /api/health", () => {
  it("returns 200 with status ok", async () => {
    const response = await GET();
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.status).toBe("ok");
    expect(body.timestamp).toBeDefined();
    expect(typeof body.uptime).toBe("number");
    expect(body.checks).toBeDefined();
  });

  it("returns an ISO timestamp", async () => {
    const response = await GET();
    const body = await response.json();
    expect(new Date(body.timestamp).toString()).not.toBe("Invalid Date");
  });
});
