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
    if (!["manager", "admin"].includes(userRole)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") ?? "1", 10);
    const pageSize = parseInt(url.searchParams.get("pageSize") ?? "20", 10);
    const status = url.searchParams.get("status") ?? undefined;
    const zone = url.searchParams.get("zone") ?? undefined;
    const search = url.searchParams.get("search") ?? undefined;
    const managerId = url.searchParams.get("managerId") ?? undefined;

    const filters: adminDAL.AdminOrderFilters = {
      page,
      pageSize,
      status,
      zone,
      search,
      managerId: userRole === "manager" ? session.user.id : managerId,
    };

    const result = await adminDAL.getAdminOrders(filters);
    return NextResponse.json(result);
  } catch (error) {
    logger.error(error, "Failed to list admin orders");
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
