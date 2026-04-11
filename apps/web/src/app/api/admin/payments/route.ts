import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import * as adminDAL from "@/lib/dal/admin";
import * as paymentsDAL from "@/lib/dal/payments";
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
    const status = url.searchParams.get("status") ?? undefined;

    const result = await adminDAL.getAdminPayments({ page, pageSize, status });
    return NextResponse.json(result);
  } catch (error) {
    logger.error(error, "Failed to list payments");
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRole = (session.user as Record<string, unknown>).role as string;
    if (userRole !== "admin") {
      return NextResponse.json({ error: "Forbidden — only admin can refund" }, { status: 403 });
    }

    const body = await request.json();
    const { paymentId } = body;

    if (!paymentId) {
      return NextResponse.json({ error: "paymentId required" }, { status: 400 });
    }

    const updated = await paymentsDAL.updatePaymentStatus(paymentId, "refunded");
    return NextResponse.json(updated);
  } catch (error) {
    logger.error(error, "Failed to refund payment");
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
