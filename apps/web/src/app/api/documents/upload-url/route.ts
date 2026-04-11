import { NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth/session";
import { logger } from "@/lib/logger";
import {
  ALLOWED_MIME_TYPES,
  MAX_FILE_SIZE_BYTES,
  getPresignedUploadUrl,
  isError,
} from "@/lib/integrations/s3";
import {
  rateLimit,
  rateLimitResponse,
} from "@/lib/security/rate-limit";
import { sanitizeFilename } from "@/lib/security/file-validator";

export const runtime = "nodejs";

const uploadUrlSchema = z.object({
  fileName: z.string().min(1).max(255),
  mimeType: z.enum(ALLOWED_MIME_TYPES),
  fileSize: z
    .number()
    .int()
    .positive()
    .max(MAX_FILE_SIZE_BYTES, "Файл превышает максимальный размер 10 МБ"),
});

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rl = await rateLimit("file-upload", session.user.id);
    if (!rl.success) return rateLimitResponse(rl);

    const body = await request.json();
    const parsed = uploadUrlSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Ошибка валидации", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const safeName = sanitizeFilename(parsed.data.fileName);
    const result = await getPresignedUploadUrl(
      safeName,
      parsed.data.mimeType,
      session.user.id,
      parsed.data.fileSize,
    );

    if (isError(result)) {
      // Configuration missing or presign error — not a crash, graceful 503
      return NextResponse.json({ error: result.error }, { status: 503 });
    }

    logger.info(
      { userId: session.user.id, key: result.key },
      "Upload URL generated",
    );

    return NextResponse.json(result);
  } catch (error) {
    logger.error(error, "Failed to generate upload URL");
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 },
    );
  }
}
