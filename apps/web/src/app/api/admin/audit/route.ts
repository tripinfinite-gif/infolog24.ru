import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import * as adminDAL from "@/lib/dal/admin";
import { logger } from "@/lib/logger";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRole = (session.user as Record<string, unknown>).role as string;
    if (userRole !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") ?? "1", 10);
    const pageSize = parseInt(url.searchParams.get("pageSize") ?? "50", 10);
    const action = url.searchParams.get("action") ?? undefined;
    const userId = url.searchParams.get("userId") ?? undefined;

    const result = await adminDAL.getAdminAuditLog({
      page,
      pageSize,
      action,
      userId,
    });

    return NextResponse.json(result);
  } catch (error) {
    logger.error(error, "Failed to list audit log");
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
