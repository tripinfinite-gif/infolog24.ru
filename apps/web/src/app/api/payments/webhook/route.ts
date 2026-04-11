import { NextResponse } from "next/server";
import { z } from "zod";
import { getPaymentService } from "@/lib/payments/service";
import { getYooKassaClient } from "@/lib/payments/yookassa";
import { logger } from "@/lib/logger";
import {
  getWebhookClientIp,
  isWebhookIpAllowed,
} from "@/lib/security/webhook-allowlist";

export const runtime = "nodejs";

const yookassaWebhookSchema = z.object({
  type: z.string(),
  event: z.string(),
  object: z.object({
    id: z.string(),
    status: z.string(),
    amount: z
      .object({
        value: z.string(),
        currency: z.string(),
      })
      .optional(),
    metadata: z.record(z.string()).optional(),
    payment_id: z.string().optional(),
  }),
});

export async function POST(request: Request) {
  try {
    // Безопасность: проверяем IP-адрес отправителя вебхука
    const clientIp = getWebhookClientIp(request);

    if (!clientIp || !isWebhookIpAllowed(clientIp, "yookassa")) {
      logger.warn(
        { clientIp },
        "Webhook rejected: IP not in YooKassa whitelist",
      );
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const rawBody = await request.text();

    let body: unknown;
    try {
      body = JSON.parse(rawBody);
    } catch {
      logger.warn("Invalid JSON in webhook body");
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const parsed = yookassaWebhookSchema.safeParse(body);

    if (!parsed.success) {
      logger.warn(
        { errors: parsed.error.flatten() },
        "Invalid YooKassa webhook payload",
      );
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    logger.info(
      {
        event: parsed.data.event,
        objectId: parsed.data.object.id,
        status: parsed.data.object.status,
      },
      "YooKassa webhook received",
    );

    // Безопасность: повторная проверка статуса платежа через API YooKassa,
    // чтобы исключить подмену данных в теле вебхука
    const webhookStatus = parsed.data.object.status;
    const paymentId = parsed.data.object.id;
    const yookassa = getYooKassaClient();
    const verifiedPayment = await yookassa.getPayment(paymentId);

    if (verifiedPayment.status !== webhookStatus) {
      logger.warn(
        {
          paymentId,
          webhookStatus,
          actualStatus: verifiedPayment.status,
        },
        "Webhook status mismatch: статус в вебхуке не совпадает с API YooKassa",
      );
      return NextResponse.json(
        { error: "Status mismatch" },
        { status: 400 },
      );
    }

    const paymentService = getPaymentService();
    await paymentService.handleWebhook(parsed.data);

    // Return 200 quickly as YooKassa expects a fast response
    return NextResponse.json({ ok: true });
  } catch (error) {
    logger.error(error, "Failed to process YooKassa webhook");
    // Still return 200 to prevent YooKassa from retrying indefinitely
    // Errors are logged and can be investigated
    return NextResponse.json({ ok: true });
  }
}
