import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import { db } from "@/lib/db";
import { sql } from "drizzle-orm";
import { queuesAvailable } from "@/lib/queues";

interface ServiceStatus {
  name: string;
  ok: boolean;
  latencyMs?: number;
  error?: string;
}

async function checkDatabase(): Promise<ServiceStatus> {
  const start = Date.now();
  try {
    await db.execute(sql`SELECT 1`);
    return { name: "database", ok: true, latencyMs: Date.now() - start };
  } catch (error) {
    return {
      name: "database",
      ok: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

function checkRedis(): ServiceStatus {
  return { name: "redis", ok: queuesAvailable() };
}

function checkEnv(name: string, value: string | undefined): ServiceStatus {
  return {
    name,
    ok: Boolean(value),
    error: value ? undefined : "missing",
  };
}

/**
 * GET /api/cron/health-check
 *
 * Probe external dependencies and log their status. Used by monitoring /
 * alerting. Returns a summary compatible with the shared cron format:
 * `{ processed, succeeded, failed }` plus a detailed `checks` array.
 *
 * Called every 5 minutes by an external cron service.
 */
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  logger.info("Running health-check cron...");

  const checks: ServiceStatus[] = [
    await checkDatabase(),
    checkRedis(),
    checkEnv("resend", process.env.RESEND_API_KEY),
    checkEnv("sms_ru", process.env.SMS_RU_API_KEY),
    checkEnv("telegram_bot", process.env.TELEGRAM_BOT_TOKEN),
    checkEnv("yookassa", process.env.YOOKASSA_SHOP_ID),
    checkEnv("s3", process.env.S3_ENDPOINT),
  ];

  const succeeded = checks.filter((c) => c.ok).length;
  const failed = checks.length - succeeded;

  const summary = {
    processed: checks.length,
    succeeded,
    failed,
    checks,
  };

  if (failed > 0) {
    logger.warn(summary, "Health check found failing dependencies");
  } else {
    logger.info(summary, "Health check passed");
  }

  return NextResponse.json(summary);
}
