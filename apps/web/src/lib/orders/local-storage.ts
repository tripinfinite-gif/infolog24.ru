import { promises as fs } from "node:fs";
import { randomUUID } from "node:crypto";
import path from "node:path";
import { logger } from "@/lib/logger";

/**
 * Локальное файловое хранилище для dev-окружения и graceful fallback,
 * когда S3 (Selectel) не настроен. В проде должно использоваться S3,
 * но в локалке мы пишем в apps/web/uploads/, чтобы можно было сразу
 * протестировать загрузку без облачных ключей.
 *
 * Файлы доступны по пути /uploads/<userId>/<orderId>/<safeName>
 * через статический раут (если настроен) или через /api/uploads/[...path].
 *
 * Никогда не пишет в /uploads без скоупа по userId — это защита от
 * коллизий имён между клиентами.
 */

const UPLOADS_ROOT = path.resolve(process.cwd(), "uploads");

export interface SavedFile {
  /** Относительный URL для использования в БД (documents.fileUrl) */
  fileUrl: string;
  /** Абсолютный путь на диске */
  absolutePath: string;
}

function sanitizeName(name: string): string {
  // Только безопасные символы
  return name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 200);
}

export async function saveFileLocally(opts: {
  userId: string;
  orderId: string;
  originalName: string;
  buffer: Buffer;
}): Promise<SavedFile> {
  const safeUserId = opts.userId.replace(/[^a-f0-9-]/gi, "");
  const safeOrderId = opts.orderId.replace(/[^a-f0-9-]/gi, "");

  const dir = path.join(UPLOADS_ROOT, safeUserId, safeOrderId);
  await fs.mkdir(dir, { recursive: true });

  // Префикс — короткий uuid, чтобы избежать коллизий имён
  const prefix = randomUUID().slice(0, 8);
  const fileName = `${prefix}-${sanitizeName(opts.originalName)}`;
  const absolutePath = path.join(dir, fileName);

  await fs.writeFile(absolutePath, opts.buffer);

  // URL для доступа через /api/uploads/[...path] (создаётся отдельно)
  const fileUrl = `/api/uploads/${safeUserId}/${safeOrderId}/${fileName}`;
  logger.info({ userId: opts.userId, orderId: opts.orderId, fileName, size: opts.buffer.length }, "File saved locally");
  return { fileUrl, absolutePath };
}

export function isS3Configured(): boolean {
  return Boolean(
    process.env.S3_ENDPOINT &&
      process.env.S3_BUCKET &&
      process.env.S3_ACCESS_KEY &&
      process.env.S3_SECRET_KEY,
  );
}
