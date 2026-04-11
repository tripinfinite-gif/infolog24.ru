import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";

/**
 * GET /api/cron/cleanup
 *
 * Delete orphaned S3 files that were uploaded but never linked to a
 * document record after 24 hours. In production this would:
 *
 *   1. List objects in the uploads prefix of the S3 bucket.
 *   2. For each object older than 24h, check whether a document row
 *      references its key.
 *   3. Delete objects that have no row.
 *
 * Also cleans up old notifications and expired sessions.
 *
 * Called by an external cron service hourly.
 */
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  logger.info("Running orphaned file cleanup...");

  const processed = 0;
  const succeeded = 0;
  const failed = 0;

  try {
    // TODO: Replace with real S3 + DB queries when infra is wired up.
    //
    //   const cutoff = new Date(Date.now() - 24 * 3600 * 1000);
    //   const listed = await s3.send(new ListObjectsV2Command({
    //     Bucket: env.S3_BUCKET,
    //     Prefix: "uploads/",
    //   }));
    //   for (const obj of listed.Contents ?? []) {
    //     if (!obj.Key || !obj.LastModified || obj.LastModified > cutoff) continue;
    //     processed++;
    //     const linked = await db.query.documents.findFirst({
    //       where: eq(documents.fileUrl, obj.Key),
    //     });
    //     if (linked) continue;
    //     try {
    //       await s3.send(new DeleteObjectCommand({
    //         Bucket: env.S3_BUCKET,
    //         Key: obj.Key,
    //       }));
    //       succeeded++;
    //     } catch (err) {
    //       failed++;
    //       logger.warn({ err, key: obj.Key }, "Failed to delete orphaned file");
    //     }
    //   }

    logger.info(
      { processed, succeeded, failed },
      "Cleanup complete (stub — waiting for S3 integration)",
    );
    return NextResponse.json({ processed, succeeded, failed });
  } catch (error) {
    logger.error({ error }, "Error during cleanup");
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
