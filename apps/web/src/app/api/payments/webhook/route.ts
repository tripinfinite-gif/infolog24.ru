import { NextResponse } from "next/server";
import { z } from "zod";
import { getPaymentService } from "@/lib/payments/service";
import { getYooKassaClient } from "@/lib/payments/yookassa";
import { logger } from "@/lib/logger";

export const runtime = "nodejs";

// Разрешённые IP-диапазоны YooKassa для вебхуков
const YOOKASSA_IP_RANGES = [
  { base: "185.71.76.0", prefix: 27 },
  { base: "185.71.77.0", prefix: 27 },
  { base: "77.75.153.0", prefix: 25 },
  { base: "77.75.154.128", prefix: 25 },
];

const YOOKASSA_SINGLE_IPS = ["77.75.156.11", "77.75.156.35"];

/** Преобразует IPv4 строку в 32-битное число */
function ipToNumber(ip: string): number {
  const parts = ip.split(".").map(Number);
  return ((parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3]) >>> 0;
}

/** Проверяет, входит ли IP в список разрешённых адресов YooKassa */
function isYooKassaIp(ip: string): boolean {
  // Убираем IPv6-маппинг (::ffff:)
  const cleanIp = ip.replace(/^::ffff:/, "");
  const ipNum = ipToNumber(cleanIp);

  // Проверяем одиночные IP
  if (YOOKASSA_SINGLE_IPS.includes(cleanIp)) {
    return true;
  }

  // Проверяем CIDR-диапазоны
  for (const range of YOOKASSA_IP_RANGES) {
    const baseNum = ipToNumber(range.base);
    const mask = (~0 << (32 - range.prefix)) >>> 0;
    if ((ipNum & mask) === (baseNum & mask)) {
      return true;
    }
  }

  return false;
}

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
    const forwardedFor = request.headers.get("x-forwarded-for");
    const realIp = request.headers.get("x-real-ip");
    const clientIp = forwardedFor?.split(",")[0]?.trim() ?? realIp ?? "";

    if (!clientIp || !isYooKassaIp(clientIp)) {
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
