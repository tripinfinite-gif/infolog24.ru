import { describe, it, expect } from "vitest";
import {
  createOrderSchema,
  createVehicleSchema,
  uploadDocumentSchema,
  contactFormSchema,
  callbackRequestSchema,
  validatePromoSchema,
} from "../schemas";

describe("createOrderSchema", () => {
  it("принимает валидную заявку", () => {
    const result = createOrderSchema.safeParse({
      vehicleId: "550e8400-e29b-41d4-a716-446655440000",
      type: "mkad_day",
      zone: "mkad",
    });
    expect(result.success).toBe(true);
  });

  it("принимает заявку с промокодом", () => {
    const result = createOrderSchema.safeParse({
      vehicleId: "550e8400-e29b-41d4-a716-446655440000",
      type: "ttk",
      zone: "ttk",
      promoCode: "SALE10",
      notes: "Срочно нужен пропуск",
    });
    expect(result.success).toBe(true);
  });

  it("отклоняет невалидный UUID", () => {
    const result = createOrderSchema.safeParse({
      vehicleId: "not-a-uuid",
      type: "mkad_day",
      zone: "mkad",
    });
    expect(result.success).toBe(false);
  });

  it("отклоняет неизвестный тип заявки", () => {
    const result = createOrderSchema.safeParse({
      vehicleId: "550e8400-e29b-41d4-a716-446655440000",
      type: "unknown_type",
      zone: "mkad",
    });
    expect(result.success).toBe(false);
  });

  it("отклоняет неизвестную зону", () => {
    const result = createOrderSchema.safeParse({
      vehicleId: "550e8400-e29b-41d4-a716-446655440000",
      type: "mkad_day",
      zone: "invalid_zone",
    });
    expect(result.success).toBe(false);
  });
});

describe("createVehicleSchema", () => {
  it("принимает валидное ТС", () => {
    const result = createVehicleSchema.safeParse({
      registrationNumber: "А123БВ77",
      brand: "КАМАЗ",
      model: "65115",
      year: 2020,
      maxWeight: 15000,
    });
    expect(result.success).toBe(true);
  });

  it("отклоняет год раньше 1970", () => {
    const result = createVehicleSchema.safeParse({
      registrationNumber: "А123БВ77",
      brand: "КАМАЗ",
      model: "65115",
      year: 1960,
      maxWeight: 15000,
    });
    expect(result.success).toBe(false);
  });

  it("отклоняет отрицательный вес", () => {
    const result = createVehicleSchema.safeParse({
      registrationNumber: "А123БВ77",
      brand: "КАМАЗ",
      model: "65115",
      year: 2020,
      maxWeight: -1,
    });
    expect(result.success).toBe(false);
  });
});

describe("uploadDocumentSchema", () => {
  it("принимает валидный PDF", () => {
    const result = uploadDocumentSchema.safeParse({
      type: "pts",
      fileName: "pts.pdf",
      mimeType: "application/pdf",
      fileSize: 1024 * 1024,
    });
    expect(result.success).toBe(true);
  });

  it("принимает валидное изображение", () => {
    const result = uploadDocumentSchema.safeParse({
      type: "sts",
      fileName: "sts.jpg",
      mimeType: "image/jpeg",
      fileSize: 500_000,
    });
    expect(result.success).toBe(true);
  });

  it("отклоняет файл > 10 MB", () => {
    const result = uploadDocumentSchema.safeParse({
      type: "pts",
      fileName: "big.pdf",
      mimeType: "application/pdf",
      fileSize: 11 * 1024 * 1024,
    });
    expect(result.success).toBe(false);
  });

  it("отклоняет неподдерживаемый MIME-тип", () => {
    const result = uploadDocumentSchema.safeParse({
      type: "pts",
      fileName: "doc.docx",
      mimeType: "application/msword",
      fileSize: 1024,
    });
    expect(result.success).toBe(false);
  });
});

describe("contactFormSchema", () => {
  it("принимает валидную форму", () => {
    const result = contactFormSchema.safeParse({
      name: "Иван Петров",
      phone: "+7 495 123-45-67",
    });
    expect(result.success).toBe(true);
  });

  it("принимает форму с email и сообщением", () => {
    const result = contactFormSchema.safeParse({
      name: "Иван",
      phone: "+74951234567",
      email: "ivan@example.com",
      message: "Нужен пропуск на 5 машин",
    });
    expect(result.success).toBe(true);
  });

  it("отклоняет слишком короткое имя", () => {
    const result = contactFormSchema.safeParse({
      name: "И",
      phone: "+74951234567",
    });
    expect(result.success).toBe(false);
  });

  it("отклоняет невалидный телефон", () => {
    const result = contactFormSchema.safeParse({
      name: "Иван",
      phone: "abc",
    });
    expect(result.success).toBe(false);
  });
});

describe("callbackRequestSchema", () => {
  it("принимает валидный запрос", () => {
    const result = callbackRequestSchema.safeParse({
      name: "Иван",
      phone: "+74951234567",
    });
    expect(result.success).toBe(true);
  });
});

describe("validatePromoSchema", () => {
  it("приводит к верхнему регистру", () => {
    const result = validatePromoSchema.safeParse({ code: "sale10" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.code).toBe("SALE10");
    }
  });

  it("отклоняет слишком короткий код", () => {
    const result = validatePromoSchema.safeParse({ code: "AB" });
    expect(result.success).toBe(false);
  });
});
