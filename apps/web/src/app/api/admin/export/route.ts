import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import * as ordersDAL from "@/lib/dal/orders";
import { logger } from "@/lib/logger";

export const runtime = "nodejs";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRole = (session.user as Record<string, unknown>).role as string;
    if (userRole !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const result = await ordersDAL.getAllOrders({ page: 1, pageSize: 10000 });

    const csvHeader =
      "ID,User ID,Manager ID,Vehicle ID,Type,Zone,Status,Price,Promo Code,Discount,Created At\n";

    const csvRows = result.data
      .map(
        (order) =>
          `${order.id},${order.userId},${order.managerId ?? ""},${order.vehicleId},${order.type},${order.zone},${order.status},${order.price},${order.promoCode ?? ""},${order.discount},${order.createdAt.toISOString()}`,
      )
      .join("\n");

    const csv = csvHeader + csvRows;

    return new Response(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="orders-export-${new Date().toISOString().split("T")[0]}.csv"`,
      },
    });
  } catch (error) {
    logger.error(error, "Failed to export orders");
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
