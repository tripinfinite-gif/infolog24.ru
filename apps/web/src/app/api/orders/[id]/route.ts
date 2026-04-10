import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth/session";
import * as ordersDAL from "@/lib/dal/orders";
import { logger } from "@/lib/logger";

export const runtime = "nodejs";

const updateOrderSchema = z.object({
  notes: z.string().max(2000).optional(),
  promoCode: z.string().max(50).optional(),
  estimatedReadyDate: z.string().date().optional(),
  managerId: z.string().uuid().optional(),
});

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const order = await ordersDAL.getOrderById(id);

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Clients can only see their own orders
    const userRole = (session.user as Record<string, unknown>).role as string;
    if (
      userRole === "client" &&
      order.userId !== session.user.id
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(order);
  } catch (error) {
    logger.error(error, "Failed to get order");
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const parsed = updateOrderSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const order = await ordersDAL.getOrderById(id);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const userRole = (session.user as Record<string, unknown>).role as string;
    if (
      userRole === "client" &&
      order.userId !== session.user.id
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (parsed.data.managerId) {
      if (!["manager", "admin"].includes(userRole)) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
      await ordersDAL.assignManager(id, parsed.data.managerId);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error(error, "Failed to update order");
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
