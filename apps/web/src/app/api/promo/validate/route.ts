import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth/session";
import { validatePromoCode } from "@/lib/dal/promo-codes";
import { logger } from "@/lib/logger";

export const runtime = "nodejs";

const validatePromoSchema = z.object({
  code: z.string().min(1).max(50),
  orderTotal: z.number().positive(),
});

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = validatePromoSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { code, orderTotal } = parsed.data;
    const validation = await validatePromoCode(code);

    if (!validation.valid) {
      return NextResponse.json({
        valid: false,
        reason: validation.reason,
      });
    }

    const discount = validation.discount!;
    let discountAmount: number;

    if (discount.type === "percent") {
      discountAmount = Math.round((orderTotal * discount.value) / 100);
    } else {
      discountAmount = discount.value;
    }

    // Ensure discount doesn't exceed total
    discountAmount = Math.min(discountAmount, orderTotal - 1);

    const newTotal = orderTotal - discountAmount;

    logger.info(
      { code, orderTotal, discountAmount, newTotal, userId: session.user.id },
      "Promo code validated",
    );

    return NextResponse.json({
      valid: true,
      discount: discountAmount,
      discountType: discount.type,
      discountValue: discount.value,
      newTotal,
    });
  } catch (error) {
    logger.error(error, "Failed to validate promo code");
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
