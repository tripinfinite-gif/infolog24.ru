import { kvGet, kvSet, kvDel } from "@/lib/kv";

/**
 * Per-chat conversation state for the Telegram bot.
 *
 * State is serialised to the shared KV store (Redis when available,
 * in-memory fallback otherwise) with a 30-minute TTL so we don't leak
 * memory if a user abandons a dialog.
 */

export type TelegramDialogStep =
  | "idle"
  | "price_zone"
  | "price_type"
  | "price_count"
  | "status_query"
  | "order_contact_name"
  | "order_contact_phone"
  | "order_contact_comment"
  | "awaiting_link_code";

export interface TelegramSessionData {
  step: TelegramDialogStep;
  zone?: "mkad" | "ttk" | "sk";
  type?: "annual_day" | "annual_night" | "temporary";
  vehicleCount?: number;
  name?: string;
  phone?: string;
}

const TTL_SECONDS = 30 * 60;

function key(chatId: number | string): string {
  return `tg:session:${chatId}`;
}

export async function getSession(
  chatId: number | string,
): Promise<TelegramSessionData> {
  const raw = await kvGet(key(chatId));
  if (!raw) return { step: "idle" };
  try {
    return JSON.parse(raw) as TelegramSessionData;
  } catch {
    return { step: "idle" };
  }
}

export async function setSession(
  chatId: number | string,
  data: TelegramSessionData,
): Promise<void> {
  await kvSet(key(chatId), JSON.stringify(data), TTL_SECONDS);
}

export async function clearSession(chatId: number | string): Promise<void> {
  await kvDel(key(chatId));
}
