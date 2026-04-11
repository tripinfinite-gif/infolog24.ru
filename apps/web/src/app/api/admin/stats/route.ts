import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import * as adminDAL from "@/lib/dal/admin";
import { logger } from "@/lib/logger";

export const runtime = "nodejs";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRole = (session.user as Record<string, unknown>).role as string;
    if (!["admin", "manager"].includes(userRole)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const [stats, recentOrders, managerWorkload, staleOrders] =
      await Promise.all([
        adminDAL.getDashboardStats(),
        adminDAL.getRecentOrders(10),
        adminDAL.getManagerWorkload(),
        adminDAL.getStaleOrders(24),
      ]);

    return NextResponse.json({
      stats,
      recentOrders,
      managerWorkload,
      staleOrders,
    });
  } catch (error) {
    logger.error(error, "Failed to get admin stats");
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
