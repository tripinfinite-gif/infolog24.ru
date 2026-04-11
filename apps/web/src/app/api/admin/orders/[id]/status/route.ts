import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth/session";
import * as ordersDAL from "@/lib/dal/orders";
import { canTransition, type OrderStatus } from "@/lib/automation/order-state-machine";
import { logger } from "@/lib/logger";
import { logAudit, AuditActions } from "@/lib/security/audit";
import { getClientIp } from "@/lib/security/rate-limit";

export const runtime = "nodejs";

const statusChangeSchema = z.object({
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
  comment: z.string().min(1, "Комментарий обязателен"),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRole = (session.user as Record<string, unknown>).role as string;
    if (!["admin", "manager"].includes(userRole)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const parsed = statusChangeSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    // Get current order to validate transition
    const order = await ordersDAL.getOrderById(id);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (!canTransition(order.status as OrderStatus, parsed.data.status as OrderStatus)) {
      return NextResponse.json(
        { error: `Невозможно перевести заявку из "${order.status}" в "${parsed.data.status}"` },
        { status: 400 },
      );
    }

    const updated = await ordersDAL.updateOrderStatus(
      id,
      parsed.data.status,
      session.user.id,
      parsed.data.comment,
    );

    void logAudit({
      userId: session.user.id,
      action: AuditActions.ORDER_STATUS_CHANGE,
      entityType: "order",
      entityId: id,
      details: {
        from: order.status,
        to: parsed.data.status,
        comment: parsed.data.comment,
      },
      ipAddress: getClientIp(request),
    });

    return NextResponse.json(updated);
  } catch (error) {
    logger.error(error, "Failed to change order status");
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
