import { describe, it, expect } from "vitest";
import { POST } from "@/app/api/contacts/route";

function makeRequest(body: unknown): Request {
  return new Request("https://infolog24.ru/api/contacts", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/contacts", () => {
  it("returns 200 for valid contact form", async () => {
    const response = await POST(
      makeRequest({
        name: "Иван Петров",
        phone: "+74951234567",
        email: "ivan@example.com",
        message: "Нужен пропуск",
      }),
    );
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.success).toBe(true);
  });

  it("accepts minimal valid payload", async () => {
    const response = await POST(
      makeRequest({ name: "Иван", phone: "+74951234567" }),
    );
    expect(response.status).toBe(200);
  });

  it("returns 400 for missing name", async () => {
    const response = await POST(
      makeRequest({ name: "", phone: "+74951234567" }),
    );
    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.success).toBe(false);
    expect(body.error).toBeDefined();
  });

  it("returns 400 for invalid phone", async () => {
    const response = await POST(
      makeRequest({ name: "Иван", phone: "abc" }),
    );
    expect(response.status).toBe(400);
  });

  it("returns 400 for invalid email", async () => {
    const response = await POST(
      makeRequest({
        name: "Иван",
        phone: "+74951234567",
        email: "not-email",
      }),
    );
    expect(response.status).toBe(400);
  });

  it("returns 500 for malformed JSON", async () => {
    const badRequest = new Request("https://infolog24.ru/api/contacts", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: "{not json",
    });
    const response = await POST(badRequest);
    expect(response.status).toBe(500);
  });
});
