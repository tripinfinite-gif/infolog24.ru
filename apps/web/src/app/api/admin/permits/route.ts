import { NextResponse } from "next/server";
import { z } from "zod";
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

    const result = await adminDAL.getAdminPermits();
    return NextResponse.json(result);
  } catch (error) {
    logger.error(error, "Failed to list permits");
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

const createPermitSchema = z.object({
  orderId: z.string().uuid(),
  userId: z.string().uuid(),
  permitNumber: z.string().min(1),
  zone: z.enum(["mkad", "ttk", "sk"]),
  type: z.enum(["mkad_day", "mkad_night", "ttk", "sk", "temp"]),
  validFrom: z.string(),
  validUntil: z.string(),
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
    const parsed = createPermitSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const permit = await adminDAL.createPermit(parsed.data);
    return NextResponse.json(permit, { status: 201 });
  } catch (error) {
    logger.error(error, "Failed to create permit");
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
    if (!["admin", "manager"].includes(userRole)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { permitId, action } = body;

    if (!permitId || action !== "revoke") {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const updated = await adminDAL.revokePermit(permitId);
    return NextResponse.json(updated);
  } catch (error) {
    logger.error(error, "Failed to revoke permit");
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
