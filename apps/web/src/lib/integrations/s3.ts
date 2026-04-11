import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { randomUUID } from "node:crypto";
import { env } from "@/env";
import { logger } from "@/lib/logger";
import {
  MAX_FILE_SIZE,
  sanitizeFilename,
} from "@/lib/security/file-validator";

/**
 * S3 client for Selectel Object Storage (AWS S3 compatible).
 *
 * Selectel endpoint format: https://s3.ru-1.storage.selcloud.ru
 * Region: ru-1
 *
 * Functions gracefully handle missing configuration: if S3 env vars
 * are not set, they return an error result instead of throwing,
 * so routes using them stay operational.
 */

export const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
] as const;

export type AllowedMimeType = (typeof ALLOWED_MIME_TYPES)[number];

export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE;

const UPLOAD_URL_TTL_SECONDS = 15 * 60; // 15 minutes
const DOWNLOAD_URL_TTL_SECONDS = 60 * 60; // 1 hour

// ── Client singleton ───────────────────────────────────────────────────────

let client: S3Client | null = null;

function getClient(): S3Client | null {
  if (client) return client;

  const endpoint = env.S3_ENDPOINT;
  const accessKeyId = env.S3_ACCESS_KEY;
  const secretAccessKey = env.S3_SECRET_KEY;

  if (!endpoint || !accessKeyId || !secretAccessKey) {
    logger.warn("S3 credentials not configured — S3 operations disabled");
    return null;
  }

  client = new S3Client({
    endpoint,
    region: env.S3_REGION ?? "ru-1",
    credentials: { accessKeyId, secretAccessKey },
    forcePathStyle: true, // Selectel requires path-style addressing
  });

  return client;
}

function getBucket(): string | null {
  const bucket = env.S3_BUCKET;
  if (!bucket) {
    logger.warn("S3_BUCKET not configured");
    return null;
  }
  return bucket;
}

// ── S3 key generation ──────────────────────────────────────────────────────

/**
 * Generates a collision-proof S3 key in the format:
 * documents/{userId}/{uuid}-{sanitized-filename}
 */
export function buildS3Key(userId: string, fileName: string): string {
  const safe = sanitizeFilename(fileName);
  return `documents/${userId}/${randomUUID()}-${safe}`;
}

// ── Public API ─────────────────────────────────────────────────────────────

export interface PresignedUploadResult {
  uploadUrl: string;
  key: string;
  expiresIn: number;
}

export interface IntegrationError {
  error: string;
}

export type Result<T> = T | IntegrationError;

export function isError<T>(result: Result<T>): result is IntegrationError {
  return typeof result === "object" && result !== null && "error" in result;
}

/**
 * Metadata validation for presigning (magic-byte validation happens later,
 * after the client actually uploads content or via a separate endpoint).
 */
function validatePresignInput(
  fileName: string,
  mimeType: string,
  fileSize: number,
): string | null {
  if (fileSize <= 0) return "Файл пустой";
  if (fileSize > MAX_FILE_SIZE_BYTES) {
    return `Файл превышает максимальный размер ${Math.round(MAX_FILE_SIZE_BYTES / (1024 * 1024))} МБ`;
  }
  if (!ALLOWED_MIME_TYPES.includes(mimeType as AllowedMimeType)) {
    return "Недопустимый тип файла. Разрешены: PDF, JPEG, PNG";
  }
  if (!fileName.trim()) return "Имя файла не указано";
  return null;
}

/**
 * Generates a presigned URL for uploading a file via PUT.
 * Valid for 15 minutes. Validates the declared metadata first.
 */
export async function getPresignedUploadUrl(
  fileName: string,
  mimeType: string,
  userId: string,
  fileSize?: number,
): Promise<Result<PresignedUploadResult>> {
  const validationError = validatePresignInput(
    fileName,
    mimeType,
    fileSize ?? 1,
  );
  if (validationError) return { error: validationError };

  const s3 = getClient();
  const bucket = getBucket();
  if (!s3 || !bucket) {
    return { error: "Хранилище файлов не настроено" };
  }

  const key = buildS3Key(userId, fileName);

  try {
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      ContentType: mimeType,
      ...(fileSize ? { ContentLength: fileSize } : {}),
    });

    const uploadUrl = await getSignedUrl(s3, command, {
      expiresIn: UPLOAD_URL_TTL_SECONDS,
    });

    logger.info(
      { userId, key, mimeType, fileSize },
      "Presigned upload URL generated",
    );

    return { uploadUrl, key, expiresIn: UPLOAD_URL_TTL_SECONDS };
  } catch (error) {
    logger.error({ err: error, userId, key }, "Failed to presign upload URL");
    return { error: "Не удалось создать ссылку для загрузки" };
  }
}

/**
 * Generates a presigned URL for downloading (GET) a file. Valid for 1 hour.
 */
export async function getPresignedDownloadUrl(
  s3Key: string,
): Promise<Result<{ url: string; expiresIn: number }>> {
  const s3 = getClient();
  const bucket = getBucket();
  if (!s3 || !bucket) {
    return { error: "Хранилище файлов не настроено" };
  }

  try {
    const command = new GetObjectCommand({ Bucket: bucket, Key: s3Key });
    const url = await getSignedUrl(s3, command, {
      expiresIn: DOWNLOAD_URL_TTL_SECONDS,
    });

    return { url, expiresIn: DOWNLOAD_URL_TTL_SECONDS };
  } catch (error) {
    logger.error({ err: error, s3Key }, "Failed to presign download URL");
    return { error: "Не удалось создать ссылку для скачивания" };
  }
}

/**
 * Deletes an object from S3. Returns success or error result.
 */
export async function deleteObject(
  s3Key: string,
): Promise<Result<{ deleted: true }>> {
  const s3 = getClient();
  const bucket = getBucket();
  if (!s3 || !bucket) {
    return { error: "Хранилище файлов не настроено" };
  }

  try {
    await s3.send(new DeleteObjectCommand({ Bucket: bucket, Key: s3Key }));
    logger.info({ s3Key }, "S3 object deleted");
    return { deleted: true };
  } catch (error) {
    logger.error({ err: error, s3Key }, "Failed to delete S3 object");
    return { error: "Не удалось удалить файл" };
  }
}

/**
 * Uploads a buffer directly to S3 (server-side, used for archive contents).
 * Returns the resulting key and a virtual URL (s3://bucket/key) for storage in DB.
 */
export async function putObject(input: {
  userId: string;
  fileName: string;
  body: Buffer;
  contentType: string;
}): Promise<Result<{ key: string; fileUrl: string; size: number }>> {
  const s3 = getClient();
  const bucket = getBucket();
  if (!s3 || !bucket) return { error: "Хранилище файлов не настроено" };

  if (input.body.length === 0) return { error: "Файл пустой" };
  if (input.body.length > MAX_FILE_SIZE_BYTES) {
    return {
      error: `Файл превышает ${Math.round(MAX_FILE_SIZE_BYTES / (1024 * 1024))} МБ`,
    };
  }
  if (!ALLOWED_MIME_TYPES.includes(input.contentType as AllowedMimeType)) {
    return { error: "Недопустимый тип файла" };
  }

  const key = buildS3Key(input.userId, input.fileName);
  try {
    await s3.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: input.body,
        ContentType: input.contentType,
        ContentLength: input.body.length,
      }),
    );
    logger.info(
      { userId: input.userId, key, size: input.body.length },
      "Object uploaded to S3",
    );
    return { key, fileUrl: `s3://${bucket}/${key}`, size: input.body.length };
  } catch (error) {
    logger.error({ err: error, key }, "Failed to upload to S3");
    return { error: "Не удалось загрузить файл" };
  }
}
