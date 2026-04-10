import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth/session";
import * as ordersDAL from "@/lib/dal/orders";
import { logger } from "@/lib/logger";

export const runtime = "nodejs";

const createOrderSchema = z.object({
  vehicleId: z.string().uuid(),
  type: z.enum(["mkad_day", "mkad_night", "ttk", "sk", "temp"]),
  zone: z.enum(["mkad", "ttk", "sk"]),
  price: z.number().int().positive(),
  promoCode: z.string().max(50).optional(),
  notes: z.string().max(2000).optional(),
});

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") ?? "1", 10);
    const pageSize = parseInt(url.searchParams.get("pageSize") ?? "20", 10);
    const status = url.searchParams.get("status") as import("@/lib/types").OrderFilters["status"];

    const result = await ordersDAL.getOrdersByUser(session.user.id, {
      page,
      pageSize,
      status: status ?? undefined,
    });

    return NextResponse.json(result);
  } catch (error) {
    logger.error(error, "Failed to list orders");
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
    const parsed = createOrderSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const order = await ordersDAL.createOrder(session.user.id, parsed.data);
    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    logger.error(error, "Failed to create order");
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
