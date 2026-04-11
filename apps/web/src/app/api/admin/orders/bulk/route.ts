import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth/session";
import * as adminDAL from "@/lib/dal/admin";
import { logger } from "@/lib/logger";
import { logAudit, AuditActions } from "@/lib/security/audit";
import { getClientIp } from "@/lib/security/rate-limit";

export const runtime = "nodejs";

const bulkAssignSchema = z.object({
  orderIds: z.array(z.string().uuid()).min(1),
  managerId: z.string().uuid(),
});

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRole = (session.user as Record<string, unknown>).role as string;
    if (!["admin", "manager"].includes(userRole)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const parsed = bulkAssignSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const results = await adminDAL.bulkAssignManager(
      parsed.data.orderIds,
      parsed.data.managerId,
    );

    void logAudit({
      userId: session.user.id,
      action: AuditActions.ORDER_BULK_ASSIGN,
      entityType: "order",
      entityId: parsed.data.orderIds.join(","),
      details: {
        managerId: parsed.data.managerId,
        count: results.length,
      },
      ipAddress: getClientIp(request),
    });

    return NextResponse.json({ updated: results.length });
  } catch (error) {
    logger.error(error, "Failed to bulk assign manager");
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
