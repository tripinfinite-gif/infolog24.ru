import { describe, it, expect } from "vitest";
import { z } from "zod";

// Re-define the same schemas used in API routes so we test the exact
// validation shape without spinning up the full Next.js route handlers.

const contactSchema = z.object({
  name: z.string().min(1).max(100),
  phone: z
    .string()
    .min(1)
    .regex(/^[\d\s+\-()]{7,20}$/),
  email: z.string().email().optional().or(z.literal("")),
  message: z.string().max(2000).optional().or(z.literal("")),
  zone: z.string().max(50).optional().or(z.literal("")),
  source: z.string().max(100).optional().or(z.literal("")),
});

const createOrderApiSchema = z.object({
  vehicleId: z.string().uuid(),
  type: z.enum(["mkad_day", "mkad_night", "ttk", "sk", "temp"]),
  zone: z.enum(["mkad", "ttk", "sk"]),
  price: z.number().int().positive(),
  promoCode: z.string().max(50).optional(),
  notes: z.string().max(2000).optional(),
});

const createPaymentApiSchema = z.object({
  orderId: z.string().uuid(),
  promoCode: z.string().max(50).optional(),
  returnUrl: z.string().url().optional(),
});

const yookassaWebhookSchema = z.object({
  type: z.string(),
  event: z.string(),
  object: z.object({
    id: z.string(),
    status: z.string(),
    amount: z
      .object({ value: z.string(), currency: z.string() })
      .optional(),
    metadata: z.record(z.string()).optional(),
    payment_id: z.string().optional(),
  }),
});

describe("contactSchema", () => {
  it("accepts valid contact form", () => {
    const result = contactSchema.safeParse({
      name: "Иван",
      phone: "+74951234567",
    });
    expect(result.success).toBe(true);
  });

  it("accepts full contact form with optional fields", () => {
    const result = contactSchema.safeParse({
      name: "Иван Петров",
      phone: "+7 (495) 123-45-67",
      email: "ivan@example.com",
      message: "Здравствуйте, нужен пропуск",
      zone: "mkad",
      source: "landing",
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty name", () => {
    expect(
      contactSchema.safeParse({ name: "", phone: "+74951234567" }).success,
    ).toBe(false);
  });

  it("rejects name over 100 chars", () => {
    expect(
      contactSchema.safeParse({ name: "x".repeat(101), phone: "+74951234567" })
        .success,
    ).toBe(false);
  });

  it("rejects malformed phone", () => {
    expect(
      contactSchema.safeParse({ name: "Иван", phone: "abc" }).success,
    ).toBe(false);
  });

  it("accepts empty email string", () => {
    const result = contactSchema.safeParse({
      name: "Иван",
      phone: "+74951234567",
      email: "",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid email", () => {
    expect(
      contactSchema.safeParse({
        name: "Иван",
        phone: "+74951234567",
        email: "not-email",
      }).success,
    ).toBe(false);
  });
});

describe("createOrderApiSchema", () => {
  const validBase = {
    vehicleId: "550e8400-e29b-41d4-a716-446655440000",
    type: "mkad_day" as const,
    zone: "mkad" as const,
    price: 12000,
  };

  it("accepts valid payload", () => {
    expect(createOrderApiSchema.safeParse(validBase).success).toBe(true);
  });

  it("accepts all zone values", () => {
    for (const zone of ["mkad", "ttk", "sk"] as const) {
      expect(
        createOrderApiSchema.safeParse({ ...validBase, zone }).success,
      ).toBe(true);
    }
  });

  it("rejects negative price", () => {
    expect(
      createOrderApiSchema.safeParse({ ...validBase, price: -1 }).success,
    ).toBe(false);
  });

  it("rejects zero price", () => {
    expect(
      createOrderApiSchema.safeParse({ ...validBase, price: 0 }).success,
    ).toBe(false);
  });

  it("rejects non-integer price", () => {
    expect(
      createOrderApiSchema.safeParse({ ...validBase, price: 12.5 }).success,
    ).toBe(false);
  });

  it("rejects invalid vehicleId uuid", () => {
    expect(
      createOrderApiSchema.safeParse({ ...validBase, vehicleId: "nope" })
        .success,
    ).toBe(false);
  });

  it("rejects unknown order type", () => {
    expect(
      createOrderApiSchema.safeParse({ ...validBase, type: "mega_pass" })
        .success,
    ).toBe(false);
  });

  it("rejects notes > 2000 chars", () => {
    expect(
      createOrderApiSchema.safeParse({
        ...validBase,
        notes: "x".repeat(2001),
      }).success,
    ).toBe(false);
  });
});

describe("createPaymentApiSchema", () => {
  it("accepts minimal payload", () => {
    expect(
      createPaymentApiSchema.safeParse({
        orderId: "550e8400-e29b-41d4-a716-446655440000",
      }).success,
    ).toBe(true);
  });

  it("accepts with promoCode and returnUrl", () => {
    expect(
      createPaymentApiSchema.safeParse({
        orderId: "550e8400-e29b-41d4-a716-446655440000",
        promoCode: "SALE10",
        returnUrl: "https://infolog24.ru/success",
      }).success,
    ).toBe(true);
  });

  it("rejects invalid returnUrl", () => {
    expect(
      createPaymentApiSchema.safeParse({
        orderId: "550e8400-e29b-41d4-a716-446655440000",
        returnUrl: "not-a-url",
      }).success,
    ).toBe(false);
  });
});

describe("yookassaWebhookSchema", () => {
  it("accepts valid webhook payload", () => {
    const result = yookassaWebhookSchema.safeParse({
      type: "notification",
      event: "payment.succeeded",
      object: {
        id: "payment-123",
        status: "succeeded",
        amount: { value: "12000.00", currency: "RUB" },
        metadata: { orderId: "o-1" },
      },
    });
    expect(result.success).toBe(true);
  });

  it("accepts minimal payload without optional fields", () => {
    const result = yookassaWebhookSchema.safeParse({
      type: "notification",
      event: "payment.waiting_for_capture",
      object: { id: "p-1", status: "pending" },
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing object.id", () => {
    expect(
      yookassaWebhookSchema.safeParse({
        type: "notification",
        event: "payment.succeeded",
        object: { status: "succeeded" },
      }).success,
    ).toBe(false);
  });

  it("rejects missing event field", () => {
    expect(
      yookassaWebhookSchema.safeParse({
        type: "notification",
        object: { id: "p-1", status: "succeeded" },
      }).success,
    ).toBe(false);
  });
});
