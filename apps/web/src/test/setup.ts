/**
 * Global setup for Vitest tests.
 *
 * - Mocks environment variables so modules that use `env` don't blow up at import.
 * - Mocks external integrations (Resend, SMS.ru, S3, Bitrix24, YooKassa, OpenAI, Redis, Telegram).
 *
 * Tests should never make real network or database calls; DAL tests mock the
 * `@/lib/db` module directly.
 */
import { vi, beforeEach } from "vitest";

// ── Environment variables ──────────────────────────────────────────────────
process.env.SKIP_ENV_VALIDATION = "true";
// NODE_ENV is readonly in Node's typings; assign via bracket access.
(process.env as Record<string, string | undefined>).NODE_ENV =
  process.env.NODE_ENV ?? "test";
process.env.DATABASE_URL =
  process.env.DATABASE_URL ?? "postgres://test:test@localhost:5432/test";
process.env.BETTER_AUTH_SECRET =
  process.env.BETTER_AUTH_SECRET ?? "test-secret-at-least-32-characters-long";
process.env.NEXT_PUBLIC_APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? "https://infolog24.ru";
process.env.S3_ENDPOINT = process.env.S3_ENDPOINT ?? "https://s3.example.com";
process.env.S3_ACCESS_KEY = process.env.S3_ACCESS_KEY ?? "test-access-key";
process.env.S3_SECRET_KEY = process.env.S3_SECRET_KEY ?? "test-secret-key";
process.env.S3_BUCKET = process.env.S3_BUCKET ?? "test-bucket";
process.env.YOOKASSA_SHOP_ID = process.env.YOOKASSA_SHOP_ID ?? "123456";
process.env.YOOKASSA_SECRET_KEY =
  process.env.YOOKASSA_SECRET_KEY ?? "test_yookassa_secret";
process.env.TELEGRAM_BOT_TOKEN =
  process.env.TELEGRAM_BOT_TOKEN ?? "test:telegram-token";
process.env.OPENAI_API_KEY = process.env.OPENAI_API_KEY ?? "sk-test";
process.env.RESEND_API_KEY = process.env.RESEND_API_KEY ?? "re_test";
process.env.SMS_RU_API_KEY = process.env.SMS_RU_API_KEY ?? "test-sms-ru-key";
process.env.REDIS_URL = process.env.REDIS_URL ?? "redis://localhost:6379";
process.env.CRON_SECRET = process.env.CRON_SECRET ?? "test-cron-secret";
process.env.TURNSTILE_SECRET_KEY =
  process.env.TURNSTILE_SECRET_KEY ?? "test-turnstile-secret";

// ── Reset mocks between tests ──────────────────────────────────────────────
beforeEach(() => {
  vi.clearAllMocks();
});

// ── Logger: silence during tests ───────────────────────────────────────────
vi.mock("@/lib/logger", () => {
  const logger = {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
    fatal: vi.fn(),
    trace: vi.fn(),
    child: () => logger,
  };
  return { logger, default: logger };
});

// ── Rate limiter: always allow in tests ───────────────────────────────────
vi.mock("@/lib/security/rate-limit", async () => {
  const actual = await vi.importActual<
    typeof import("@/lib/security/rate-limit")
  >("@/lib/security/rate-limit");
  return {
    ...actual,
    rateLimit: vi.fn(async () => ({
      success: true,
      current: 1,
      limit: 100,
      retryAfterSec: 0,
      resetAt: Date.now() + 60_000,
    })),
  };
});

// ── Redis / BullMQ: no real connections ────────────────────────────────────
vi.mock("ioredis", () => {
  const Redis = vi.fn().mockImplementation(() => ({
    get: vi.fn().mockResolvedValue(null),
    set: vi.fn().mockResolvedValue("OK"),
    del: vi.fn().mockResolvedValue(1),
    incr: vi.fn().mockResolvedValue(1),
    expire: vi.fn().mockResolvedValue(1),
    quit: vi.fn().mockResolvedValue("OK"),
    on: vi.fn(),
  }));
  return { default: Redis, Redis };
});
