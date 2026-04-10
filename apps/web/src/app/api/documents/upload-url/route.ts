import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth/session";
import { logger } from "@/lib/logger";

export const runtime = "nodejs";

const uploadUrlSchema = z.object({
  fileName: z.string().min(1).max(255),
  mimeType: z.string().min(1).max(100),
  fileSize: z.number().int().positive().max(50 * 1024 * 1024), // 50MB max
});

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = uploadUrlSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    // TODO: Generate presigned S3 URL when S3 is configured
    // For now, return a placeholder response
    const key = `documents/${session.user.id}/${Date.now()}-${parsed.data.fileName}`;

    logger.info(
      { userId: session.user.id, fileName: parsed.data.fileName },
      "Upload URL requested",
    );

    return NextResponse.json({
      uploadUrl: `https://s3.placeholder.example.com/${key}`,
      key,
      expiresIn: 3600,
    });
  } catch (error) {
    logger.error(error, "Failed to generate upload URL");
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
