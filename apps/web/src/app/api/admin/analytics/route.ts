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

    const data = await adminDAL.getAnalyticsData();
    return NextResponse.json(data);
  } catch (error) {
    logger.error(error, "Failed to get analytics");
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
