import { randomInt } from "node:crypto";
import { kvDel, kvGet, kvSet } from "@/lib/kv";
import { logger } from "@/lib/logger";

/**
 * Telegram account linking.
 *
 * Flow:
 *   1. Authenticated user opens /settings and requests a linking code.
 *      `generateLinkingCode(userId)` creates a 6-digit code, stores it in
 *      the KV store with a 10-minute TTL, and returns it to the UI.
 *   2. User types `/link 123456` in the Telegram bot.
 *   3. Bot POSTs the code to `/api/telegram/link` with the current
 *      telegram user ID. The API resolves the code via `consumeLinkingCode`
 *      and persists the mapping via `linkTelegramAccount`.
 *
 * Because the users table does not have a telegram_id column and the
 * task asks us to avoid schema changes, we persist the telegram ↔ user
 * mapping in the KV store (long-lived, no TTL). This is durable enough
 * for the current stage and is trivially migratable to a dedicated
 * `user_telegram_links` table later.
 */

const CODE_TTL_SECONDS = 10 * 60;

function codeKey(code: string): string {
  return `tg:link:code:${code}`;
}

function userKey(telegramUserId: number | string): string {
  return `tg:link:tg:${telegramUserId}`;
}

function reverseKey(userId: string): string {
  return `tg:link:user:${userId}`;
}

export interface LinkingCode {
  code: string;
  expiresAt: number;
}

export async function generateLinkingCode(
  userId: string,
): Promise<LinkingCode> {
  const code = String(randomInt(100_000, 1_000_000));
  await kvSet(codeKey(code), userId, CODE_TTL_SECONDS);
  logger.info({ userId }, "Telegram linking code generated");
  return {
    code,
    expiresAt: Date.now() + CODE_TTL_SECONDS * 1000,
  };
}

export async function consumeLinkingCode(
  code: string,
): Promise<string | null> {
  const userId = await kvGet(codeKey(code));
  if (!userId) return null;
  await kvDel(codeKey(code));
  return userId;
}

export async function linkTelegramAccount(
  telegramUserId: number | string,
  userId: string,
): Promise<void> {
  await Promise.all([
    kvSet(userKey(telegramUserId), userId),
    kvSet(reverseKey(userId), String(telegramUserId)),
  ]);
  logger.info({ userId, telegramUserId }, "Telegram account linked");
}

export async function getLinkedUserId(
  telegramUserId: number | string,
): Promise<string | null> {
  return kvGet(userKey(telegramUserId));
}

export async function getLinkedTelegramId(
  userId: string,
): Promise<string | null> {
  return kvGet(reverseKey(userId));
}

export async function unlinkTelegramAccount(
  telegramUserId: number | string,
): Promise<void> {
  const userId = await getLinkedUserId(telegramUserId);
  await kvDel(userKey(telegramUserId));
  if (userId) await kvDel(reverseKey(userId));
  logger.info({ telegramUserId }, "Telegram account unlinked");
}
