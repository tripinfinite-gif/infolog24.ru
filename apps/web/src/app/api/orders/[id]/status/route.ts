import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth/session";
import * as ordersDAL from "@/lib/dal/orders";
import { logger } from "@/lib/logger";

export const runtime = "nodejs";

const updateStatusSchema = z.object({
  status: z.enum([
    "draft",
    "documents_pending",
    "payment_pending",
    "processing",
    "submitted",
    "approved",
    "rejected",
    "cancelled",
  ]),
  comment: z.string().max(1000).optional(),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRole = (session.user as Record<string, unknown>).role as string;
    if (!["manager", "admin"].includes(userRole)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const parsed = updateStatusSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const order = await ordersDAL.updateOrderStatus(
      id,
      parsed.data.status,
      session.user.id,
      parsed.data.comment,
    );

    return NextResponse.json(order);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Internal server error";
    logger.error(error, "Failed to update order status");
    return NextResponse.json(
      { error: message },
      { status: message === "Order not found" ? 404 : 500 },
    );
  }
}
