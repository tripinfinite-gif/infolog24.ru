import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth/session";
import * as documentsDAL from "@/lib/dal/documents";
import { logger } from "@/lib/logger";

export const runtime = "nodejs";

const updateDocumentStatusSchema = z.object({
  status: z.enum(["pending", "approved", "rejected"]),
  rejectionReason: z.string().max(1000).optional(),
});

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const doc = await documentsDAL.getDocumentById(id);

    if (!doc) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(doc);
  } catch (error) {
    logger.error(error, "Failed to get document");
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRole = (session.user as Record<string, unknown>).role as string;
    if (!["manager", "admin"].includes(userRole)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const parsed = updateDocumentStatusSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const updated = await documentsDAL.updateDocumentStatus(
      id,
      parsed.data.status,
      parsed.data.rejectionReason,
    );

    return NextResponse.json(updated);
  } catch (error) {
    logger.error(error, "Failed to update document status");
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
