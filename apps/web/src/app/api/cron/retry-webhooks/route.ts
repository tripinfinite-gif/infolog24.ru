import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import { queuesAvailable } from "@/lib/queues";

/**
 * GET /api/cron/retry-webhooks
 *
 * Retry failed outgoing webhooks (Bitrix24 CRM sync, YooKassa notifications,
 * etc). In a full implementation this would pull failed jobs from a
 * `webhook_log` table where `status = 'failed'` and `attempts < max`, then
 * re-enqueue them on the `webhooks` BullMQ queue.
 *
 * For now the endpoint is a scaffold — it verifies auth, reports BullMQ
 * availability, and returns zero counts until persistence is added.
 *
 * Called every 10 minutes by an external cron service.
 */
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  logger.info("Running webhook retry pass...");

  const processed = 0;
  const succeeded = 0;
  const failed = 0;

  try {
    // TODO: Replace with real implementation once webhook_log table exists.
    //
    //   const failedWebhooks = await db.query.webhookLog.findMany({
    //     where: and(
    //       eq(webhookLog.status, "failed"),
    //       lt(webhookLog.attempts, 5),
    //     ),
    //     limit: 100,
    //   });
    //   for (const wh of failedWebhooks) {
    //     processed++;
    //     await enqueueWebhook({
    //       provider: wh.provider,
    //       url: wh.url,
    //       method: wh.method,
    //       body: wh.body,
    //     });
    //     succeeded++;
    //   }

    const summary = {
      processed,
      succeeded,
      failed,
      queuesAvailable: queuesAvailable(),
    };
    logger.info(summary, "Webhook retry pass complete");
    return NextResponse.json(summary);
  } catch (error) {
    logger.error({ error }, "Error during webhook retry");
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
