/**
 * Реестр интеграционных событий и каналов.
 *
 * Когда бизнес-код хочет уведомить внешние системы, он зовёт
 * emitEvent(eventType, payload). emitEvent смотрит сюда, понимает
 * в какие каналы доставлять событие, и пишет N строк в outbox
 * (по одной на канал). Дальше cron-воркер их разносит.
 *
 * Чтобы добавить новый канал — добавь его в IntegrationChannel,
 * напиши adapter в lib/integrations/adapters/<channel>.ts и
 * зарегистрируй в lib/integrations/process-outbox.ts.
 *
 * Чтобы добавить новое событие — добавь в IntegrationEventType
 * и в EVENT_CHANNELS список каналов для него.
 */

export type IntegrationChannel =
  | "bitrix"
  | "email"
  | "internal_crm"
  | "telegram_manager";

export type IntegrationEventType =
  | "order_created"
  | "order_paid"
  | "order_status_changed"
  | "document_uploaded"
  | "permit_issued"
  | "permit_expiring"
  | "callback_request"
  | "archive_uploaded";

/**
 * Какие каналы должны получить какое событие.
 * Изменение этого реестра — единственный способ менять маршрутизацию.
 */
export const EVENT_CHANNELS: Record<IntegrationEventType, IntegrationChannel[]> = {
  order_created: ["bitrix", "email", "internal_crm", "telegram_manager"],
  order_paid: ["bitrix", "email", "internal_crm"],
  order_status_changed: ["bitrix", "internal_crm"],
  document_uploaded: ["bitrix", "internal_crm"],
  permit_issued: ["bitrix", "email", "internal_crm"],
  permit_expiring: ["email", "telegram_manager"],
  callback_request: ["bitrix", "email", "telegram_manager"],
  archive_uploaded: ["bitrix", "email", "telegram_manager"],
};

/**
 * Backoff schedule для retry в минутах: 1 → 5 → 15 → 60 → 360.
 * После 5 попыток событие помечается 'dead'.
 */
export const RETRY_BACKOFF_MINUTES = [1, 5, 15, 60, 360];

export const DEFAULT_MAX_ATTEMPTS = 5;

export type OutboxStatus =
  | "pending"
  | "in_progress"
  | "delivered"
  | "failed"
  | "dead";
