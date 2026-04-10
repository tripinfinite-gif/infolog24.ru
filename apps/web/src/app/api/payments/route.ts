import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth/session";
import * as paymentsDAL from "@/lib/dal/payments";
import { logger } from "@/lib/logger";

export const runtime = "nodejs";

const createPaymentSchema = z.object({
  orderId: z.string().uuid(),
  amount: z.number().int().positive(),
});

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payments = await paymentsDAL.getPaymentsByUser(session.user.id);
    return NextResponse.json(payments);
  } catch (error) {
    logger.error(error, "Failed to list payments");
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

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

    const payment = await paymentsDAL.createPayment(
      parsed.data.orderId,
      session.user.id,
      parsed.data.amount,
    );

    // TODO: Create YooKassa payment and return confirmation URL
    return NextResponse.json(payment, { status: 201 });
  } catch (error) {
    logger.error(error, "Failed to create payment");
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
