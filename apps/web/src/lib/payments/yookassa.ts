import { logger } from "@/lib/logger";

interface CreatePaymentParams {
  amount: number; // in rubles (not kopecks)
  currency?: string;
  orderId: string;
  description: string;
  returnUrl: string;
  customerEmail?: string;
  customerPhone?: string;
}

export interface YooKassaPayment {
  id: string;
  status: "pending" | "waiting_for_capture" | "succeeded" | "canceled";
  amount: { value: string; currency: string };
  confirmation?: { type: string; confirmation_url: string };
  metadata?: Record<string, string>;
}

interface CreateRefundParams {
  paymentId: string;
  amount?: number; // partial refund amount in rubles; omit for full refund
  description?: string;
}

export interface YooKassaRefund {
  id: string;
  status: "succeeded" | "canceled";
  amount: { value: string; currency: string };
  payment_id: string;
}

export class YooKassaClient {
  private shopId: string;
  private secretKey: string;
  private baseUrl = "https://api.yookassa.ru/v3";

  constructor(shopId: string, secretKey: string) {
    this.shopId = shopId;
    this.secretKey = secretKey;
  }

  private get authHeader(): string {
    return `Basic ${Buffer.from(`${this.shopId}:${this.secretKey}`).toString("base64")}`;
  }

  async createPayment(params: CreatePaymentParams): Promise<YooKassaPayment> {
    const idempotencyKey = crypto.randomUUID();

    const body: Record<string, unknown> = {
      amount: {
        value: params.amount.toFixed(2),
        currency: params.currency || "RUB",
      },
      confirmation: {
        type: "redirect",
        return_url: params.returnUrl,
      },
      capture: true,
      description: params.description,
      metadata: { order_id: params.orderId },
    };

    if (params.customerEmail) {
      body.receipt = {
        customer: {
          email: params.customerEmail,
          ...(params.customerPhone ? { phone: params.customerPhone } : {}),
        },
        items: [
          {
            description: params.description.slice(0, 128),
            quantity: "1",
            amount: {
              value: params.amount.toFixed(2),
              currency: "RUB",
            },
            vat_code: 1,
          },
        ],
      };
    }

    const response = await fetch(`${this.baseUrl}/payments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Idempotence-Key": idempotencyKey,
        Authorization: this.authHeader,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.text();
      logger.error(
        { status: response.status, error },
        "YooKassa createPayment failed",
      );
      throw new Error(`YooKassa error: ${response.status}`);
    }

    const payment = (await response.json()) as YooKassaPayment;
    logger.info(
      { paymentId: payment.id, orderId: params.orderId, status: payment.status },
      "YooKassa payment created",
    );
    return payment;
  }

  async getPayment(paymentId: string): Promise<YooKassaPayment> {
    const response = await fetch(`${this.baseUrl}/payments/${paymentId}`, {
      headers: {
        Authorization: this.authHeader,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      logger.error(
        { status: response.status, error, paymentId },
        "YooKassa getPayment failed",
      );
      throw new Error(`YooKassa error: ${response.status}`);
    }

    return (await response.json()) as YooKassaPayment;
  }

  async createRefund(params: CreateRefundParams): Promise<YooKassaRefund> {
    const idempotencyKey = crypto.randomUUID();

    // If amount is not specified, we need to get the original payment amount
    let refundAmount: { value: string; currency: string };
    if (params.amount !== undefined) {
      refundAmount = { value: params.amount.toFixed(2), currency: "RUB" };
    } else {
      const payment = await this.getPayment(params.paymentId);
      refundAmount = payment.amount;
    }

    const response = await fetch(`${this.baseUrl}/refunds`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Idempotence-Key": idempotencyKey,
        Authorization: this.authHeader,
      },
      body: JSON.stringify({
        payment_id: params.paymentId,
        amount: refundAmount,
        ...(params.description ? { description: params.description } : {}),
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      logger.error(
        { status: response.status, error, paymentId: params.paymentId },
        "YooKassa createRefund failed",
      );
      throw new Error(`YooKassa refund error: ${response.status}`);
    }

    const refund = (await response.json()) as YooKassaRefund;
    logger.info(
      { refundId: refund.id, paymentId: params.paymentId, status: refund.status },
      "YooKassa refund created",
    );
    return refund;
  }

  verifyWebhookSignature(_body: string, _signature: string): boolean {
    // YooKassa webhook verification relies on IP whitelisting,
    // not HMAC signatures. In production, restrict webhook endpoint
    // to YooKassa IP ranges: 185.71.76.0/27, 185.71.77.0/27, 77.75.153.0/25
    logger.warn("YooKassa webhook signature verification not implemented — use IP whitelisting");
    return true;
  }
}

// Singleton
let client: YooKassaClient | null = null;

export function getYooKassaClient(): YooKassaClient {
  if (!client) {
    const shopId = process.env.YOOKASSA_SHOP_ID;
    const secretKey = process.env.YOOKASSA_SECRET_KEY;
    if (!shopId || !secretKey) {
      throw new Error("YooKassa credentials not configured");
    }
    client = new YooKassaClient(shopId, secretKey);
  }
  return client;
}
