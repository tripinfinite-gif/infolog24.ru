import {
  getClientIp,
  rateLimit,
  type RateLimitResult,
} from "@/lib/security/rate-limit";
import { kvIncr } from "@/lib/kv";
import { logger } from "@/lib/logger";

/**
 * Rate limiting for the AI chatbot.
 *
 * Two dimensions applied in sequence:
 *   1. Per-minute sliding window (via lib/security/rate-limit)
 *      - anonymous: 20/min, authenticated: 60/min
 *   2. Per-day volume limit (via Redis INCR + 24h TTL)
 *      - anonymous: 100/day, authenticated: 500/day
 *
 * The minute-window check is backed by Redis with an in-memory fallback
 * so development still works without REDIS_URL.
 */

export const DAILY_LIMIT_ANON = 100;
export const DAILY_LIMIT_USER = 500;
const DAY_WINDOW_SEC = 24 * 60 * 60;

export interface ChatRateLimitCheck {
  allowed: boolean;
  reason?: "minute" | "day";
  minute: RateLimitResult | null;
  dayCount: number;
  dayLimit: number;
}

function dayBucket(): string {
  const now = new Date();
  return `${now.getUTCFullYear()}${now.getUTCMonth()}${now.getUTCDate()}`;
}

export async function checkChatRateLimitAsync(identity: {
  userId: string | null;
  ip: string;
}): Promise<ChatRateLimitCheck> {
  const isAuth = Boolean(identity.userId);
  const subject = isAuth ? identity.userId! : identity.ip;

  const minute = await rateLimit(
    isAuth ? "chat-authenticated" : "chat-anonymous",
    subject,
  );

  if (!minute.success) {
    return {
      allowed: false,
      reason: "minute",
      minute,
      dayCount: 0,
      dayLimit: isAuth ? DAILY_LIMIT_USER : DAILY_LIMIT_ANON,
    };
  }

  const dayLimit = isAuth ? DAILY_LIMIT_USER : DAILY_LIMIT_ANON;
  let dayCount = 0;
  try {
    dayCount = await kvIncr(`chat:day:${subject}:${dayBucket()}`, DAY_WINDOW_SEC);
  } catch (error) {
    logger.warn({ error }, "Chat daily counter failed — allowing request");
    return { allowed: true, minute, dayCount: 0, dayLimit };
  }

  if (dayCount > dayLimit) {
    return { allowed: false, reason: "day", minute, dayCount, dayLimit };
  }

  return { allowed: true, minute, dayCount, dayLimit };
}

export { getClientIp };
