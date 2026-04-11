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
    if (!["admin", "manager"].includes(userRole)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") ?? "1", 10);
    const pageSize = parseInt(url.searchParams.get("pageSize") ?? "20", 10);
    const search = url.searchParams.get("search") ?? undefined;

    const result = await adminDAL.getAdminClients({ page, pageSize, search });
    return NextResponse.json(result);
  } catch (error) {
    logger.error(error, "Failed to list clients");
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
