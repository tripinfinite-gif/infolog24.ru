import { logger } from "@/lib/logger";
import {
  dispatchNotification,
  type DispatchOptions,
} from "@/lib/notifications/dispatcher";
import { registerWorker, enqueue } from "./index";

// ── Notifications queue ──────────────────────────────────────────────────

export interface NotificationJobData {
  userId: string;
  type: string;
  data?: Record<string, string | number | null | undefined>;
  channel?: DispatchOptions["channel"];
}

async function handleNotificationJob(data: NotificationJobData): Promise<void> {
  await dispatchNotification({
    userId: data.userId,
    type: data.type,
    channel: data.channel,
    data: data.data,
  });
}

/**
 * Enqueue a notification (or run inline if the queue is unavailable).
 *
 * Uses a rate-limited queue so we don't overwhelm SMS / email providers.
 */
export async function enqueueNotification(
  data: NotificationJobData,
  delayMs?: number,
): Promise<void> {
  await enqueue<NotificationJobData>(
    "notifications",
    "dispatch",
    data,
    delayMs ? { delay: delayMs } : {},
    handleNotificationJob,
  );
}

// ── Webhooks queue ───────────────────────────────────────────────────────

export interface WebhookJobData {
  provider: "bitrix24" | "yookassa" | "other";
  url: string;
  method?: "GET" | "POST" | "PUT";
  headers?: Record<string, string>;
  body?: unknown;
}

async function handleWebhookJob(data: WebhookJobData): Promise<void> {
  const method = data.method ?? "POST";
  const response = await fetch(data.url, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(data.headers ?? {}),
    },
    body: data.body != null ? JSON.stringify(data.body) : undefined,
  });
  if (!response.ok) {
    throw new Error(
      `Webhook ${data.provider} failed: ${response.status} ${response.statusText}`,
    );
  }
  logger.info(
    { provider: data.provider, status: response.status },
    "Webhook delivered",
  );
}

export async function enqueueWebhook(data: WebhookJobData): Promise<void> {
  await enqueue<WebhookJobData>(
    "webhooks",
    "deliver",
    data,
    {},
    handleWebhookJob,
  );
}

// ── File cleanup queue ───────────────────────────────────────────────────

export interface FileCleanupJobData {
  bucket: string;
  key: string;
  reason: string;
}

async function handleFileCleanupJob(
  data: FileCleanupJobData,
): Promise<void> {
  logger.info(
    { bucket: data.bucket, key: data.key, reason: data.reason },
    "File cleanup job — S3 delete (stub)",
  );
  // TODO: wire up S3 delete when the S3 client is configured.
}

export async function enqueueFileCleanup(
  data: FileCleanupJobData,
  delayMs?: number,
): Promise<void> {
  await enqueue<FileCleanupJobData>(
    "file-cleanup",
    "delete",
    data,
    delayMs ? { delay: delayMs } : {},
    handleFileCleanupJob,
  );
}

// ── Reports queue ────────────────────────────────────────────────────────

export interface ReportJobData {
  reportType: string;
  userId: string;
  params?: Record<string, unknown>;
}

async function handleReportJob(data: ReportJobData): Promise<void> {
  logger.info(
    { reportType: data.reportType, userId: data.userId },
    "Report generation job (stub)",
  );
  // TODO: implement real report generators.
}

export async function enqueueReport(data: ReportJobData): Promise<void> {
  await enqueue<ReportJobData>(
    "reports",
    "generate",
    data,
    {},
    handleReportJob,
  );
}

// ── Bootstrap ────────────────────────────────────────────────────────────

/**
 * Register all workers. Idempotent — calling twice reuses existing workers.
 *
 * Safe to call from a long-running process (e.g. a dedicated worker
 * entrypoint). In a serverless environment this is a no-op because each
 * request is ephemeral — rely on `enqueue` with inline fallback instead.
 */
export function startWorkers(): void {
  registerWorker<NotificationJobData, void>(
    "notifications",
    handleNotificationJob,
    10,
  );
  registerWorker<WebhookJobData, void>("webhooks", handleWebhookJob, 5);
  registerWorker<FileCleanupJobData, void>(
    "file-cleanup",
    handleFileCleanupJob,
    3,
  );
  registerWorker<ReportJobData, void>("reports", handleReportJob, 2);
  logger.info("BullMQ workers started");
}

export {
  handleNotificationJob,
  handleWebhookJob,
  handleFileCleanupJob,
  handleReportJob,
};
