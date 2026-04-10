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

    const stats = await ordersDAL.getOrderStats();
    return NextResponse.json(stats);
  } catch (error) {
    logger.error(error, "Failed to get admin stats");
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
