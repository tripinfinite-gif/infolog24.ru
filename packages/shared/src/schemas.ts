import { z } from "zod";
import {
  ORDER_TYPES,
  ORDER_ZONES,
  ORDER_STATUSES,
  DOCUMENT_TYPES,
} from "./constants";

// ── Заявка ──────────────────────────────────────────────────────────────────

export const createOrderSchema = z.object({
  vehicleId: z.string().uuid(),
  type: z.enum(ORDER_TYPES),
  zone: z.enum(ORDER_ZONES),
  promoCode: z.string().max(50).optional(),
  notes: z.string().max(2000).optional(),
});
export type CreateOrderInput = z.infer<typeof createOrderSchema>;

export const updateOrderStatusSchema = z.object({
  status: z.enum(ORDER_STATUSES),
  reason: z.string().max(1000).optional(),
});
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;

// ── ТС ──────────────────────────────────────────────────────────────────────

export const createVehicleSchema = z.object({
  registrationNumber: z
    .string()
    .min(6, "Минимум 6 символов")
    .max(20, "Максимум 20 символов"),
  brand: z.string().min(1, "Укажите марку").max(100),
  model: z.string().min(1, "Укажите модель").max(100),
  year: z
    .number()
    .int()
    .min(1970, "Год от 1970")
    .max(new Date().getFullYear() + 1),
  maxWeight: z.number().positive("Масса должна быть положительной"),
  ecoClass: z.string().optional(),
  stsNumber: z.string().max(50).optional(),
  ptsNumber: z.string().max(50).optional(),
});
export type CreateVehicleInput = z.infer<typeof createVehicleSchema>;

// ── Документы ───────────────────────────────────────────────────────────────

export const uploadDocumentSchema = z.object({
  orderId: z.string().uuid().optional(),
  vehicleId: z.string().uuid().optional(),
  type: z.enum(DOCUMENT_TYPES),
  fileName: z.string().min(1).max(255),
  mimeType: z.string().regex(/^(image\/(jpeg|png|webp)|application\/pdf)$/),
  fileSize: z.number().int().positive().max(10 * 1024 * 1024), // 10 MB max
});
export type UploadDocumentInput = z.infer<typeof uploadDocumentSchema>;

// ── Платежи ─────────────────────────────────────────────────────────────────

export const createPaymentSchema = z.object({
  orderId: z.string().uuid(),
});
export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;

// ── Промокод ────────────────────────────────────────────────────────────────

export const validatePromoSchema = z.object({
  code: z
    .string()
    .min(3, "Минимум 3 символа")
    .max(50, "Максимум 50 символов")
    .toUpperCase(),
});
export type ValidatePromoInput = z.infer<typeof validatePromoSchema>;

// ── Обратная связь ──────────────────────────────────────────────────────────

export const contactFormSchema = z.object({
  name: z.string().min(2, "Укажите имя").max(100),
  phone: z
    .string()
    .regex(/^\+?[0-9\s\-()]{10,18}$/, "Некорректный номер телефона"),
  email: z.string().email("Некорректный email").optional().or(z.literal("")),
  message: z.string().max(2000).optional(),
});
export type ContactFormInput = z.infer<typeof contactFormSchema>;

// ── Callback-запрос (из чатбота) ────────────────────────────────────────────

export const callbackRequestSchema = z.object({
  name: z.string().min(2).max(100),
  phone: z.string().regex(/^\+?[0-9\s\-()]{10,18}$/),
});
export type CallbackRequestInput = z.infer<typeof callbackRequestSchema>;
