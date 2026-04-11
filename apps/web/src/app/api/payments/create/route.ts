import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth/session";
import { getPaymentService } from "@/lib/payments/service";
import { logger } from "@/lib/logger";

export const runtime = "nodejs";

const createPaymentSchema = z.object({
  orderId: z.string().uuid(),
  promoCode: z.string().max(50).optional(),
  returnUrl: z.string().url().optional(),
  paymentMethod: z.enum(["sbp", "bank_card", "yoo_money"]).optional(),
});

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = createPaymentSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const paymentService = getPaymentService();
    const result = await paymentService.initiatePayment(
      parsed.data.orderId,
      session.user.id,
      {
        promoCode: parsed.data.promoCode,
        returnUrl: parsed.data.returnUrl,
        customerEmail: session.user.email,
        paymentMethod: parsed.data.paymentMethod,
      },
    );

    logger.info(
      { orderId: parsed.data.orderId, userId: session.user.id },
      "Payment creation requested",
    );

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal server error";

    // Return user-friendly errors for known cases
    if (
      message === "Order not found" ||
      message === "Order does not belong to user"
    ) {
      return NextResponse.json({ error: message }, { status: 404 });
    }

    if (
      message.startsWith("Cannot pay for order") ||
      message.includes("promo code") ||
      message.includes("Invalid promo")
    ) {
      return NextResponse.json({ error: message }, { status: 400 });
    }

    logger.error(error, "Failed to create payment");
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
