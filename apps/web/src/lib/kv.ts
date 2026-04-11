import Redis from "ioredis";
import { logger } from "@/lib/logger";

/**
 * Lightweight key-value store abstraction.
 *
 * Uses Redis when REDIS_URL is configured, otherwise falls back to an
 * in-memory Map with TTL tracking. This keeps rate limiting, linking
 * codes and similar short-lived state working during local development
 * without external dependencies.
 */

type MemoryEntry = {
  value: string;
  expiresAt: number; // unix ms; 0 means no expiry
};

const memoryStore = new Map<string, MemoryEntry>();
let redisClient: Redis | null = null;
let redisDisabled = false;

function getRedis(): Redis | null {
  if (redisDisabled) return null;
  if (redisClient) return redisClient;

  const url = process.env.REDIS_URL;
  if (!url) return null;

  try {
    redisClient = new Redis(url, {
      lazyConnect: false,
      maxRetriesPerRequest: 2,
      enableReadyCheck: true,
    });
    redisClient.on("error", (error) => {
      logger.warn({ error: error.message }, "Redis error — falling back to memory");
    });
    return redisClient;
  } catch (error) {
    logger.warn({ error }, "Failed to initialise Redis — using in-memory KV");
    redisDisabled = true;
    return null;
  }
}

function cleanupMemory(now: number): void {
  for (const [key, entry] of memoryStore) {
    if (entry.expiresAt !== 0 && now > entry.expiresAt) {
      memoryStore.delete(key);
    }
  }
}

export async function kvGet(key: string): Promise<string | null> {
  const redis = getRedis();
  if (redis) {
    try {
      return await redis.get(key);
    } catch (error) {
      logger.warn({ error, key }, "Redis GET failed");
    }
  }

  const entry = memoryStore.get(key);
  if (!entry) return null;
  if (entry.expiresAt !== 0 && Date.now() > entry.expiresAt) {
    memoryStore.delete(key);
    return null;
  }
  return entry.value;
}

export async function kvSet(
  key: string,
  value: string,
  ttlSeconds?: number,
): Promise<void> {
  const redis = getRedis();
  if (redis) {
    try {
      if (ttlSeconds && ttlSeconds > 0) {
        await redis.set(key, value, "EX", ttlSeconds);
      } else {
        await redis.set(key, value);
      }
      return;
    } catch (error) {
      logger.warn({ error, key }, "Redis SET failed");
    }
  }

  const expiresAt = ttlSeconds && ttlSeconds > 0 ? Date.now() + ttlSeconds * 1000 : 0;
  memoryStore.set(key, { value, expiresAt });
  if (memoryStore.size > 5000) cleanupMemory(Date.now());
}

export async function kvDel(key: string): Promise<void> {
  const redis = getRedis();
  if (redis) {
    try {
      await redis.del(key);
      return;
    } catch (error) {
      logger.warn({ error, key }, "Redis DEL failed");
    }
  }
  memoryStore.delete(key);
}

export async function kvIncr(
  key: string,
  ttlSeconds: number,
): Promise<number> {
  const redis = getRedis();
  if (redis) {
    try {
      const value = await redis.incr(key);
      if (value === 1) await redis.expire(key, ttlSeconds);
      return value;
    } catch (error) {
      logger.warn({ error, key }, "Redis INCR failed");
    }
  }

  const now = Date.now();
  const entry = memoryStore.get(key);
  if (!entry || (entry.expiresAt !== 0 && now > entry.expiresAt)) {
    memoryStore.set(key, {
      value: "1",
      expiresAt: now + ttlSeconds * 1000,
    });
    return 1;
  }
  const next = Number.parseInt(entry.value, 10) + 1;
  entry.value = String(next);
  memoryStore.set(key, entry);
  return next;
}
