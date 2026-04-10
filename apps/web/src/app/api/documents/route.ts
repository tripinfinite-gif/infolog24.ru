import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth/session";
import * as documentsDAL from "@/lib/dal/documents";
import { logger } from "@/lib/logger";

export const runtime = "nodejs";

const createDocumentSchema = z.object({
  orderId: z.string().uuid().optional(),
  vehicleId: z.string().uuid().optional(),
  type: z.enum([
    "pts",
    "sts",
    "driver_license",
    "power_of_attorney",
    "application",
    "contract",
    "other",
  ]),
  fileName: z.string().min(1).max(255),
  fileUrl: z.string().url(),
  fileSize: z.number().int().positive(),
  mimeType: z.string().min(1).max(100),
});

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(request.url);
    const orderId = url.searchParams.get("orderId");

    const docs = orderId
      ? await documentsDAL.getDocumentsByOrder(orderId)
      : await documentsDAL.getDocumentsByUser(session.user.id);

    return NextResponse.json(docs);
  } catch (error) {
    logger.error(error, "Failed to list documents");
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = createDocumentSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const doc = await documentsDAL.uploadDocument({
      ...parsed.data,
      userId: session.user.id,
    });

    return NextResponse.json(doc, { status: 201 });
  } catch (error) {
    logger.error(error, "Failed to create document");
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
