import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { orders, users } from "@/lib/db/schema";
import { env } from "@/env";
import { createDeal } from "@/lib/integrations/bitrix24";
import { sendEmailMessage } from "@/lib/notifications/channels/email";
import { logger } from "@/lib/logger";
import type {
  IntegrationChannel,
  IntegrationEventType,
} from "./registry";

/**
 * Адаптеры для outbox.
 *
 * Каждый адаптер — функция, которая принимает (eventType, payload) и
 * пытается доставить событие в свой канал. Возвращает { ok, error? }.
 *
 * Контракт:
 *  - Никогда не бросает исключение (всегда возвращает result).
 *  - Если канал не настроен (нет ключей в env) — возвращает ok: true
 *    и помечает payload как доставленное (мы не хотим бесконечно ретраить
 *    события, для которых физически нет канала). В логах — info.
 *  - При временной ошибке (сеть, 5xx) — возвращает ok: false, и outbox
 *    положит событие на retry.
 */

export interface AdapterResult {
  ok: boolean;
  error?: string;
  /** true → канал не настроен в env, не ретраим */
  skipped?: boolean;
}

type AdapterFn = (
  eventType: IntegrationEventType,
  payload: Record<string, unknown>,
) => Promise<AdapterResult>;

// ──────────────────────────────────────────────────────────────────────
// Bitrix24 adapter
// ──────────────────────────────────────────────────────────────────────

const bitrixAdapter: AdapterFn = async (eventType, payload) => {
  if (!env.BITRIX24_WEBHOOK_URL) {
    return { ok: true, skipped: true };
  }

  // Минимальная информация о клиенте — нужна для создания сделки
  const orderId = typeof payload.orderId === "string" ? payload.orderId : null;
  if (!orderId) {
    // Для событий без orderId (например permit_expiring) можем пока пропустить
    return { ok: true, skipped: true };
  }

  try {
    const order = await db.query.orders.findFirst({
      where: eq(orders.id, orderId),
      with: { user: true, vehicle: true },
    });
    if (!order) {
      return { ok: true, skipped: true };
    }

    const title = (() => {
      switch (eventType) {
        case "order_created":
          return `Новая заявка #${order.id.slice(0, 8)}: ${order.zone.toUpperCase()}`;
        case "order_paid":
          return `Оплачена заявка #${order.id.slice(0, 8)}`;
        case "archive_uploaded":
          return `Архив документов: заявка #${order.id.slice(0, 8)}`;
        default:
          return `Событие ${eventType}: заявка #${order.id.slice(0, 8)}`;
      }
    })();

    const contactName =
      order.user?.name ?? order.user?.company ?? order.user?.email ?? "Клиент";

    const result = await createDeal({
      title,
      contact: contactName,
      phone: order.user?.phone ?? undefined,
      email: order.user?.email ?? undefined,
      comments: [
        `Зона: ${order.zone}`,
        `Тип: ${order.type}`,
        order.vehicle ? `ТС: ${order.vehicle.licensePlate}` : null,
        order.notes ? `Заметки: ${order.notes}` : null,
        `Источник события: ${eventType}`,
      ]
        .filter(Boolean)
        .join("\n"),
      source: typeof payload.source === "string" ? payload.source : "infolog24_app",
      amount: order.price,
    });

    return result.ok
      ? { ok: true }
      : { ok: false, error: result.error ?? "Unknown Bitrix error" };
  } catch (error) {
    return { ok: false, error: (error as Error).message };
  }
};

// ──────────────────────────────────────────────────────────────────────
// Email adapter
// ──────────────────────────────────────────────────────────────────────

const emailAdapter: AdapterFn = async (eventType, payload) => {
  const adminEmail = env.ADMIN_EMAIL;
  if (!adminEmail) {
    return { ok: true, skipped: true };
  }

  const orderId = typeof payload.orderId === "string" ? payload.orderId : null;
  let body = `Событие: ${eventType}\n`;

  if (orderId) {
    try {
      const order = await db.query.orders.findFirst({
        where: eq(orders.id, orderId),
        with: { user: true, vehicle: true },
      });
      if (order) {
        body += `\nЗаявка: ${order.id}\n`;
        body += `Зона: ${order.zone}\nТип: ${order.type}\nСтатус: ${order.status}\nЦена: ${order.price} ₽\n`;
        if (order.user) {
          body += `\nКлиент: ${order.user.name ?? "—"} (${order.user.email ?? "—"})\n`;
          if (order.user.phone) body += `Телефон: ${order.user.phone}\n`;
        }
        if (order.vehicle) {
          body += `\nГрузовик: ${order.vehicle.brand} ${order.vehicle.model}, ${order.vehicle.licensePlate}\n`;
        }
      }
    } catch {
      // продолжим с минимальным body
    }
  }

  body += `\n---\nPayload: ${JSON.stringify(payload, null, 2)}`;

  try {
    const ok = await sendEmailMessage({
      to: adminEmail,
      subject: `[Инфолог24] ${eventType}`,
      html: `<pre style="font-family:monospace;white-space:pre-wrap;">${escapeHtml(body)}</pre>`,
    });
    return ok ? { ok: true } : { ok: false, error: "Email send returned false" };
  } catch (error) {
    return { ok: false, error: (error as Error).message };
  }
};

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// ──────────────────────────────────────────────────────────────────────
// Internal CRM adapter (заглушка для будущей собственной CRM)
// ──────────────────────────────────────────────────────────────────────
//
// Когда у нас появится собственная CRM, нужно будет:
// 1. Установить переменные env: INTERNAL_CRM_BASE_URL + INTERNAL_CRM_API_KEY
// 2. Раскомментировать тело adapter ниже и реализовать HTTP-вызовы по
//    контракту нашей CRM.
// 3. Никаких изменений в other коде не нужно — outbox продолжит работать
//    как раньше.
//
// До этого момента adapter возвращает { ok: true, skipped: true } —
// событие сразу помечается доставленным и не накапливается в очереди.

const internalCrmAdapter: AdapterFn = async (_eventType, _payload) => {
  const baseUrl = process.env.INTERNAL_CRM_BASE_URL;
  const apiKey = process.env.INTERNAL_CRM_API_KEY;

  if (!baseUrl || !apiKey) {
    return { ok: true, skipped: true };
  }

  // TODO: при появлении собственной CRM реализовать здесь:
  //
  // const res = await fetch(`${baseUrl}/api/events`, {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //     "Authorization": `Bearer ${apiKey}`,
  //   },
  //   body: JSON.stringify({ eventType: _eventType, payload: _payload }),
  // });
  //
  // if (!res.ok) {
  //   return { ok: false, error: `Internal CRM HTTP ${res.status}` };
  // }
  // return { ok: true };

  // Пока что — soft skip с логом, чтобы не накапливалось в outbox
  logger.info(
    { eventType: _eventType, hasUrl: Boolean(baseUrl), hasKey: Boolean(apiKey) },
    "internal_crm adapter: stub (TODO when CRM is built)",
  );
  return { ok: true, skipped: true };
};

// ──────────────────────────────────────────────────────────────────────
// Telegram/MAX manager adapter (заглушка)
// ──────────────────────────────────────────────────────────────────────
//
// Когда подключим бот менеджеров в MAX (или Telegram), сюда добавим
// отправку сообщения в группу/канал менеджеров с краткой выжимкой.

const telegramManagerAdapter: AdapterFn = async (_eventType, _payload) => {
  const botToken = process.env.TELEGRAM_MANAGER_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_MANAGER_CHAT_ID;

  if (!botToken || !chatId) {
    return { ok: true, skipped: true };
  }

  // TODO: при подключении бота — реализовать отправку через grammY
  // или нативный fetch в Telegram Bot API.
  return { ok: true, skipped: true };
};

// ──────────────────────────────────────────────────────────────────────
// Public registry of adapters
// ──────────────────────────────────────────────────────────────────────

export const ADAPTERS: Record<IntegrationChannel, AdapterFn> = {
  bitrix: bitrixAdapter,
  email: emailAdapter,
  internal_crm: internalCrmAdapter,
  telegram_manager: telegramManagerAdapter,
};

export async function dispatchToChannel(
  channel: IntegrationChannel,
  eventType: IntegrationEventType,
  payload: Record<string, unknown>,
): Promise<AdapterResult> {
  const adapter = ADAPTERS[channel];
  if (!adapter) {
    return { ok: false, error: `Unknown channel: ${channel}` };
  }
  try {
    return await adapter(eventType, payload);
  } catch (error) {
    return { ok: false, error: (error as Error).message };
  }
}

// suppress unused for stub adapters
void users;
