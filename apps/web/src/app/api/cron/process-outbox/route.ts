import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import { dispatchToChannel } from "@/lib/integrations/adapters";
import {
  claimEvent,
  fetchPendingEvents,
  markDelivered,
  markFailed,
} from "@/lib/integrations/outbox";
import {
  RETRY_BACKOFF_MINUTES,
  type IntegrationChannel,
  type IntegrationEventType,
} from "@/lib/integrations/registry";

export const runtime = "nodejs";

/**
 * GET /api/cron/process-outbox
 *
 * Воркер outbox: читает pending события, доставляет в каналы (Bitrix24,
 * email, internal CRM stub, telegram manager stub). При сбое — retry с
 * exponential backoff. После max_attempts — статус 'dead'.
 *
 * Запускать раз в минуту через cron-сервис в Coolify (или внешний cron):
 *   * * * * * curl -H "Authorization: Bearer $CRON_SECRET" https://infolog24.ru/api/cron/process-outbox
 *
 * В dev можно дёргать вручную:
 *   curl http://localhost:3000/api/cron/process-outbox  (без auth, см. ниже)
 */

const BATCH_SIZE = 50;

export async function GET(request: NextRequest) {
  // В dev (no CRON_SECRET) разрешаем без auth для удобства тестирования
  if (process.env.CRON_SECRET) {
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const events = await fetchPendingEvents(BATCH_SIZE);
  if (events.length === 0) {
    return NextResponse.json({ processed: 0 });
  }

  let delivered = 0;
  let failed = 0;
  let skipped = 0;

  for (const event of events) {
    const claimed = await claimEvent(event.id);
    if (!claimed) continue;

    const result = await dispatchToChannel(
      event.channel as IntegrationChannel,
      event.eventType as IntegrationEventType,
      (event.payload as Record<string, unknown>) ?? {},
    );

    if (result.ok) {
      await markDelivered(event.id);
      if (result.skipped) skipped++;
      else delivered++;
    } else {
      const newAttempts = event.attempts + 1;
      await markFailed(
        event.id,
        result.error ?? "Unknown error",
        newAttempts,
        event.maxAttempts,
        RETRY_BACKOFF_MINUTES,
      );
      failed++;
    }
  }

  const summary = {
    processed: events.length,
    delivered,
    skipped,
    failed,
  };
  logger.info(summary, "Outbox batch processed");
  return NextResponse.json(summary);
}
