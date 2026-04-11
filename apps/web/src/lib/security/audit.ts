/**
 * Аудит-лог.
 *
 * Writes audit entries to the `audit_log` table (Drizzle schema) and
 * duplicates them into the structured logger for observability.
 *
 * Использование:
 * ```ts
 * await logAudit({
 *   userId: session.user.id,
 *   action: "order.status_change",
 *   entityType: "order",
 *   entityId: order.id,
 *   details: { from: "draft", to: "processing" },
 *   ipAddress: getClientIp(request),
 * });
 * ```
 *
 * SQL injection audit
 * ───────────────────
 * Проверены все DAL-файлы (`apps/web/src/lib/dal/*.ts`) на использование
 * raw SQL. Найденные sql`…` всегда используют ссылки на колонки Drizzle
 * (`${orders.status}`, `${payments.paidAt}` и т.п.), а не интерполяцию
 * пользовательского ввода. Drizzle параметризует значения через драйвер
 * `postgres`, поэтому SQL-инъекции исключены. Все пользовательские данные
 * проходят через Zod-схемы и передаются в Drizzle-методы (`.where(eq(...))`,
 * `.values({...})`), которые безопасны по умолчанию.
 */
import { auditLog as auditLogTable } from "@/lib/db/schema";
import { db } from "@/lib/db";
import { logger } from "@/lib/logger";

export interface AuditLogInput {
  /** ID пользователя, совершившего действие. null для анонимных событий */
  userId: string | null;
  /** Название действия, например "order.status_change", "auth.login_success" */
  action: string;
  /** Тип сущности: "order", "user", "payment", "permit", ... */
  entityType: string;
  /** ID сущности (UUID или произвольная строка) */
  entityId: string;
  /** Произвольные детали события (JSON-сериализуемые) */
  details?: Record<string, unknown>;
  /** IP-адрес клиента */
  ipAddress?: string | null;
}

/**
 * Записывает аудит-событие в БД и в структурированный лог.
 *
 * Не бросает исключений — любые ошибки БД логируются и проглатываются,
 * чтобы не ломать основной запрос. Вызывать можно через `await` или
 * через `void logAudit(...)` (fire-and-forget).
 */
export async function logAudit(input: AuditLogInput): Promise<void> {
  const payload = {
    userId: input.userId,
    action: input.action,
    entityType: input.entityType,
    entityId: input.entityId,
    details: input.details ?? null,
    ipAddress: input.ipAddress ?? null,
  };

  // Всегда логируем через pino
  logger.info(payload, `[AUDIT] ${input.action}`);

  // В БД пишем только события с userId (ограничение схемы: user_id NOT NULL)
  if (!input.userId) return;

  try {
    await db.insert(auditLogTable).values({
      userId: input.userId,
      action: input.action,
      entityType: input.entityType,
      entityId: input.entityId,
      details: input.details ?? null,
      ipAddress: input.ipAddress ?? null,
    });
  } catch (err) {
    // Audit log не должен ронять основной запрос
    logger.error(
      { err, audit: payload },
      "Failed to persist audit log entry",
    );
  }
}

/** Fire-and-forget-обёртка: вызывает logAudit без await. */
export function logAuditAsync(input: AuditLogInput): void {
  void logAudit(input);
}

/**
 * Готовые константы-экшены, чтобы избежать опечаток.
 */
export const AuditActions = {
  // Auth
  AUTH_LOGIN_SUCCESS: "auth.login_success",
  AUTH_LOGIN_FAILURE: "auth.login_failure",
  AUTH_LOGOUT: "auth.logout",
  AUTH_PASSWORD_CHANGE: "auth.password_change",
  AUTH_2FA_ENABLE: "auth.2fa_enable",
  AUTH_2FA_DISABLE: "auth.2fa_disable",
  // User
  USER_PROFILE_UPDATE: "user.profile_update",
  USER_ROLE_CHANGE: "user.role_change",
  // Order
  ORDER_CREATE: "order.create",
  ORDER_STATUS_CHANGE: "order.status_change",
  ORDER_BULK_ASSIGN: "order.bulk_assign",
  // Payment
  PAYMENT_CREATE: "payment.create",
  PAYMENT_REFUND: "payment.refund",
  PAYMENT_WEBHOOK: "payment.webhook",
  // Permit
  PERMIT_CREATE: "permit.create",
  PERMIT_REVOKE: "permit.revoke",
  // Document
  DOCUMENT_UPLOAD: "document.upload",
  DOCUMENT_DELETE: "document.delete",
} as const;
