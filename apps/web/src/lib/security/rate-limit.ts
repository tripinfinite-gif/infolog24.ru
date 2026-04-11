/**
 * Rate limiter с Redis backend и in-memory fallback.
 *
 * Алгоритм: sliding window через sorted set в Redis (ZADD/ZREMRANGEBYSCORE)
 * либо скользящее окно через Map в памяти, если Redis недоступен.
 *
 * Использование:
 * ```ts
 * const result = await rateLimit("api-general", ip);
 * if (!result.success) return rateLimitResponse(result);
 * ```
 */
import Redis from "ioredis";
import { NextResponse } from "next/server";
import { logger } from "@/lib/logger";

export type RateLimitKey =
  | "api-general"
  | "auth-login"
  | "auth-password-reset"
  | "chat-anonymous"
  | "chat-authenticated"
  | "file-upload"
  | "contact-form";

export interface RateLimitConfig {
  /** Максимум запросов за окно */
  limit: number;
  /** Длина окна в миллисекундах */
  windowMs: number;
  /** Человекочитаемое имя для логов */
  name: string;
}

export interface RateLimitResult {
  /** true, если запрос прошёл */
  success: boolean;
  /** Текущее количество запросов в окне */
  current: number;
  /** Лимит для окна */
  limit: number;
  /** Через сколько секунд можно повторить (если заблокирован) */
  retryAfterSec: number;
  /** Unix-таймштамп сброса окна (мс) */
  resetAt: number;
}

/** Конфигурации лимитов по категориям */
export const RATE_LIMITS: Record<RateLimitKey, RateLimitConfig> = {
  "api-general": { limit: 100, windowMs: 60_000, name: "API general" },
  "auth-login": { limit: 10, windowMs: 60_000, name: "Auth login/register" },
  "auth-password-reset": {
    limit: 3,
    windowMs: 60 * 60_000,
    name: "Auth password reset",
  },
  "chat-anonymous": { limit: 20, windowMs: 60_000, name: "Chat anonymous" },
  "chat-authenticated": {
    limit: 60,
    windowMs: 60_000,
    name: "Chat authenticated",
  },
  "file-upload": { limit: 10, windowMs: 60_000, name: "File upload" },
  "contact-form": { limit: 5, windowMs: 60_000, name: "Contact form" },
};

// ── Redis подключение (ленивое, singleton) ────────────────────────────────

let redisClient: Redis | null = null;
let redisDisabled = false;

function getRedis(): Redis | null {
  if (redisDisabled) return null;
  if (redisClient) return redisClient;

  const url = process.env.REDIS_URL;
  if (!url) {
    redisDisabled = true;
    return null;
  }

  try {
    redisClient = new Redis(url, {
      maxRetriesPerRequest: 1,
      enableOfflineQueue: false,
      lazyConnect: false,
      connectTimeout: 2000,
    });
    redisClient.on("error", (err) => {
      logger.warn({ err: err.message }, "Redis rate limiter error");
    });
    return redisClient;
  } catch (err) {
    logger.warn({ err }, "Failed to init Redis for rate limiter — fallback to in-memory");
    redisDisabled = true;
    return null;
  }
}

// ── In-memory fallback (sliding window через массив таймштампов) ─────────

interface MemoryEntry {
  timestamps: number[];
}

const memoryStore = new Map<string, MemoryEntry>();
const MEMORY_MAX_KEYS = 10_000;
let memoryCleanupCounter = 0;

function memoryCleanup(now: number): void {
  // Удаляем записи, где все таймштампы старше 1 часа
  for (const [key, entry] of memoryStore) {
    const threshold = now - 60 * 60_000;
    entry.timestamps = entry.timestamps.filter((t) => t > threshold);
    if (entry.timestamps.length === 0) {
      memoryStore.delete(key);
    }
  }
  // LRU-подобная защита: если слишком много ключей, удаляем случайную четверть
  if (memoryStore.size > MEMORY_MAX_KEYS) {
    const keys = Array.from(memoryStore.keys());
    for (let i = 0; i < keys.length / 4; i++) {
      memoryStore.delete(keys[i]!);
    }
  }
}

function memoryRateLimit(
  storeKey: string,
  config: RateLimitConfig,
): RateLimitResult {
  const now = Date.now();
  memoryCleanupCounter++;
  if (memoryCleanupCounter >= 500) {
    memoryCleanupCounter = 0;
    memoryCleanup(now);
  }

  const entry = memoryStore.get(storeKey) ?? { timestamps: [] };
  const windowStart = now - config.windowMs;
  entry.timestamps = entry.timestamps.filter((t) => t > windowStart);

  const current = entry.timestamps.length;
  const limit = config.limit;

  if (current >= limit) {
    const oldest = entry.timestamps[0] ?? now;
    const resetAt = oldest + config.windowMs;
    memoryStore.set(storeKey, entry);
    return {
      success: false,
      current,
      limit,
      retryAfterSec: Math.max(1, Math.ceil((resetAt - now) / 1000)),
      resetAt,
    };
  }

  entry.timestamps.push(now);
  memoryStore.set(storeKey, entry);
  return {
    success: true,
    current: current + 1,
    limit,
    retryAfterSec: 0,
    resetAt: now + config.windowMs,
  };
}

// ── Redis-based sliding window ───────────────────────────────────────────

async function redisRateLimit(
  redis: Redis,
  storeKey: string,
  config: RateLimitConfig,
): Promise<RateLimitResult> {
  const now = Date.now();
  const windowStart = now - config.windowMs;
  const member = `${now}-${Math.random().toString(36).slice(2, 8)}`;

  try {
    const pipeline = redis.multi();
    pipeline.zremrangebyscore(storeKey, 0, windowStart);
    pipeline.zadd(storeKey, now, member);
    pipeline.zcard(storeKey);
    pipeline.pexpire(storeKey, config.windowMs + 1000);
    const res = await pipeline.exec();

    if (!res) throw new Error("Redis pipeline returned null");
    const countResult = res[2];
    if (!countResult || countResult[0]) {
      throw countResult?.[0] ?? new Error("Redis zcard failed");
    }
    const current = Number(countResult[1]);

    if (current > config.limit) {
      // Удаляем только что добавленный member, чтобы не засчитывать заблокированный запрос
      await redis.zrem(storeKey, member);
      return {
        success: false,
        current: config.limit,
        limit: config.limit,
        retryAfterSec: Math.max(1, Math.ceil(config.windowMs / 1000)),
        resetAt: now + config.windowMs,
      };
    }

    return {
      success: true,
      current,
      limit: config.limit,
      retryAfterSec: 0,
      resetAt: now + config.windowMs,
    };
  } catch (err) {
    logger.warn({ err }, "Redis rate limiter failed — fallback to in-memory");
    return memoryRateLimit(storeKey, config);
  }
}

// ── Публичное API ────────────────────────────────────────────────────────

/**
 * Проверяет лимит запросов.
 *
 * @param key категория лимита (из RATE_LIMITS)
 * @param identifier идентификатор клиента (IP, userId)
 */
export async function rateLimit(
  key: RateLimitKey,
  identifier: string,
): Promise<RateLimitResult> {
  const config = RATE_LIMITS[key];
  const storeKey = `rl:${key}:${identifier}`;

  const redis = getRedis();
  const result = redis
    ? await redisRateLimit(redis, storeKey, config)
    : memoryRateLimit(storeKey, config);

  if (!result.success) {
    logger.warn(
      {
        key,
        identifier,
        current: result.current,
        limit: result.limit,
      },
      `Rate limit exceeded: ${config.name}`,
    );
  }

  return result;
}

/**
 * Формирует 429-ответ из результата rateLimit с заголовками
 * Retry-After и X-RateLimit-*.
 */
export function rateLimitResponse(
  result: RateLimitResult,
  message = "Слишком много запросов. Попробуйте позже.",
): NextResponse {
  const headers = new Headers({
    "Retry-After": String(result.retryAfterSec),
    "X-RateLimit-Limit": String(result.limit),
    "X-RateLimit-Remaining": "0",
    "X-RateLimit-Reset": String(Math.floor(result.resetAt / 1000)),
  });
  return NextResponse.json(
    { error: message, retryAfter: result.retryAfterSec },
    { status: 429, headers },
  );
}

/**
 * Извлекает IP-адрес клиента из Request-заголовков.
 * Учитывает x-forwarded-for, x-real-ip.
 */
export function getClientIp(request: Request | { headers: Headers }): string {
  const headers =
    request instanceof Request ? request.headers : request.headers;
  const forwardedFor = headers.get("x-forwarded-for");
  if (forwardedFor) {
    const first = forwardedFor.split(",")[0]?.trim();
    if (first) return first;
  }
  const realIp = headers.get("x-real-ip");
  if (realIp) return realIp;
  return "unknown";
}
