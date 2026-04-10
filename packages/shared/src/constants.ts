// Канонические значения enum-ов проекта.
// Используются в Drizzle pgEnum, Zod-схемах и UI.
// Единый источник правды — изменения здесь автоматически распространяются на все слои.

// ── Роли ────────────────────────────────────────────────────────────────────

export const USER_ROLES = ["client", "manager", "admin", "partner"] as const;
export type UserRole = (typeof USER_ROLES)[number];

// ── Заявки ──────────────────────────────────────────────────────────────────

export const ORDER_TYPES = [
  "mkad_day",
  "mkad_night",
  "ttk",
  "sk",
  "temp",
] as const;
export type OrderType = (typeof ORDER_TYPES)[number];

export const ORDER_ZONES = ["mkad", "ttk", "sk"] as const;
export type OrderZone = (typeof ORDER_ZONES)[number];

export const ORDER_STATUSES = [
  "draft",
  "documents_pending",
  "documents_review",
  "payment_pending",
  "in_progress",
  "approved",
  "rejected",
  "cancelled",
] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

// ── Пропуска ────────────────────────────────────────────────────────────────

export const PERMIT_STATUSES = [
  "active",
  "expired",
  "revoked",
  "pending_renewal",
] as const;
export type PermitStatus = (typeof PERMIT_STATUSES)[number];

// ── Документы ───────────────────────────────────────────────────────────────

export const DOCUMENT_TYPES = [
  "pts",
  "sts",
  "driver_license",
  "power_of_attorney",
  "application",
  "contract",
  "other",
] as const;
export type DocumentType = (typeof DOCUMENT_TYPES)[number];

export const DOCUMENT_STATUSES = ["pending", "approved", "rejected"] as const;
export type DocumentStatus = (typeof DOCUMENT_STATUSES)[number];

// ── Платежи ─────────────────────────────────────────────────────────────────

export const PAYMENT_STATUSES = [
  "pending",
  "succeeded",
  "cancelled",
  "refunded",
] as const;
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

// ── Уведомления ─────────────────────────────────────────────────────────────

export const NOTIFICATION_CHANNELS = [
  "email",
  "sms",
  "telegram",
  "push",
] as const;
export type NotificationChannel = (typeof NOTIFICATION_CHANNELS)[number];

export const NOTIFICATION_STATUSES = [
  "pending",
  "sent",
  "failed",
  "read",
] as const;
export type NotificationStatus = (typeof NOTIFICATION_STATUSES)[number];

// ── Чат ─────────────────────────────────────────────────────────────────────

export const CHAT_SOURCES = ["web", "telegram"] as const;
export type ChatSource = (typeof CHAT_SOURCES)[number];

export const CHAT_STATUSES = ["active", "closed"] as const;
export type ChatStatus = (typeof CHAT_STATUSES)[number];

export const CHAT_ROLES = ["user", "assistant", "system"] as const;
export type ChatRole = (typeof CHAT_ROLES)[number];

// ── Промокоды ───────────────────────────────────────────────────────────────

export const DISCOUNT_TYPES = ["percent", "fixed"] as const;
export type DiscountType = (typeof DISCOUNT_TYPES)[number];

// ── Рефералы ────────────────────────────────────────────────────────────────

export const REFERRAL_STATUSES = ["pending", "confirmed", "paid"] as const;
export type ReferralStatus = (typeof REFERRAL_STATUSES)[number];

// ── Эко-классы ──────────────────────────────────────────────────────────────

export const ECO_CLASSES = [
  "euro0",
  "euro1",
  "euro2",
  "euro3",
  "euro4",
  "euro5",
  "euro6",
] as const;
export type EcoClass = (typeof ECO_CLASSES)[number];

// ── Зоны: человекочитаемые названия ─────────────────────────────────────────

export const ZONE_LABELS: Record<OrderZone, string> = {
  mkad: "МКАД",
  ttk: "ТТК",
  sk: "Садовое кольцо",
};

export const ORDER_TYPE_LABELS: Record<OrderType, string> = {
  mkad_day: "МКАД (дневной)",
  mkad_night: "МКАД (ночной)",
  ttk: "ТТК",
  sk: "Садовое кольцо",
  temp: "Временный",
};

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  draft: "Черновик",
  documents_pending: "Ожидание документов",
  documents_review: "Проверка документов",
  payment_pending: "Ожидание оплаты",
  in_progress: "В работе",
  approved: "Одобрено",
  rejected: "Отказано",
  cancelled: "Отменено",
};

// ── Цены (базовые, руб.) ───────────────────────────────────────────────────

export const BASE_PRICES: Record<string, number> = {
  mkad_day: 12000,
  mkad_night: 12000,
  ttk: 18000,
  sk: 30000,
  temp: 3500,
};

// ── Скидки за объём ─────────────────────────────────────────────────────────

export const VOLUME_DISCOUNTS = [
  { minVehicles: 2, maxVehicles: 5, discountPercent: 5 },
  { minVehicles: 6, maxVehicles: 10, discountPercent: 10 },
  { minVehicles: 11, maxVehicles: undefined, discountPercent: 15 },
] as const;

// ── Штрафы ──────────────────────────────────────────────────────────────────

export const FINE_FIRST_VIOLATION = 7500;
export const FINE_REPEAT_VIOLATION = 10000;
