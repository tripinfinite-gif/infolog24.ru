import { Queue, Worker, type ConnectionOptions, type JobsOptions } from "bullmq";
import IORedis from "ioredis";
import { logger } from "@/lib/logger";

/**
 * BullMQ queue registry.
 *
 * Four queues are defined:
 *   - `notifications` — rate-limited notification dispatch
 *   - `webhooks` — retry failed outgoing webhooks (Bitrix24, YooKassa)
 *   - `file-cleanup` — orphaned S3 file cleanup
 *   - `reports` — heavy report generation
 *
 * All queues share the same Redis connection. When REDIS_URL is missing
 * or unreachable, queue operations fall back to running the job inline
 * (direct execution) so the system stays usable in local development.
 */

export type QueueName =
  | "notifications"
  | "webhooks"
  | "file-cleanup"
  | "reports";

const QUEUE_NAMES: QueueName[] = [
  "notifications",
  "webhooks",
  "file-cleanup",
  "reports",
];

// ── Connection ───────────────────────────────────────────────────────────

let connection: IORedis | null = null;
let connectionDisabled = false;

function getConnection(): ConnectionOptions | null {
  if (connectionDisabled) return null;
  if (connection) return connection;

  const url = process.env.REDIS_URL;
  if (!url) {
    logger.warn(
      "REDIS_URL not configured — BullMQ disabled, falling back to inline execution",
    );
    connectionDisabled = true;
    return null;
  }

  try {
    connection = new IORedis(url, {
      maxRetriesPerRequest: null, // required by BullMQ
      enableReadyCheck: false,
    });
    connection.on("error", (error) => {
      logger.warn(
        { error: error.message },
        "BullMQ Redis connection error",
      );
    });
    return connection;
  } catch (error) {
    logger.warn({ error }, "Failed to connect to Redis for BullMQ");
    connectionDisabled = true;
    return null;
  }
}

// ── Queues ───────────────────────────────────────────────────────────────

const queues = new Map<QueueName, Queue>();

export const DEFAULT_JOB_OPTIONS: JobsOptions = {
  attempts: 3,
  backoff: {
    type: "exponential",
    delay: 5_000,
  },
  removeOnComplete: {
    age: 24 * 3600,
    count: 1_000,
  },
  removeOnFail: {
    age: 7 * 24 * 3600,
  },
};

function createQueue(name: QueueName): Queue | null {
  const conn = getConnection();
  if (!conn) return null;

  const queue = new Queue(name, {
    connection: conn,
    defaultJobOptions: DEFAULT_JOB_OPTIONS,
  });
  queue.on("error", (error) => {
    logger.warn({ error: error.message, queue: name }, "Queue error");
  });
  return queue;
}

export function getQueue(name: QueueName): Queue | null {
  if (queues.has(name)) return queues.get(name)!;
  const queue = createQueue(name);
  if (queue) queues.set(name, queue);
  return queue;
}

// ── Enqueue helpers ──────────────────────────────────────────────────────

/**
 * Enqueue a job on the given queue. If BullMQ is unavailable, the job is
 * executed inline using the provided fallback function so the feature
 * still works (without retries) in environments without Redis.
 */
export async function enqueue<TData>(
  name: QueueName,
  jobName: string,
  data: TData,
  options: JobsOptions = {},
  fallback?: (data: TData) => Promise<void>,
): Promise<{ enqueued: boolean; jobId?: string }> {
  const queue = getQueue(name);
  if (!queue) {
    if (fallback) {
      logger.info({ queue: name, jobName }, "Inline fallback execution");
      try {
        await fallback(data);
      } catch (error) {
        logger.error(
          { error, queue: name, jobName },
          "Inline fallback execution failed",
        );
      }
    }
    return { enqueued: false };
  }

  try {
    const job = await queue.add(jobName, data, {
      ...DEFAULT_JOB_OPTIONS,
      ...options,
    });
    return { enqueued: true, jobId: job.id };
  } catch (error) {
    logger.error({ error, queue: name, jobName }, "Failed to enqueue job");
    if (fallback) {
      try {
        await fallback(data);
      } catch (fallbackError) {
        logger.error(
          { error: fallbackError, queue: name, jobName },
          "Inline fallback execution failed",
        );
      }
    }
    return { enqueued: false };
  }
}

// ── Workers ──────────────────────────────────────────────────────────────

const workers = new Map<QueueName, Worker>();

export interface WorkerHandler<TData = unknown, TResult = unknown> {
  (data: TData): Promise<TResult>;
}

/**
 * Register a worker for the given queue. When Redis is unavailable this is
 * a no-op — callers should use `enqueue(..., fallback)` so work still runs.
 */
export function registerWorker<TData, TResult>(
  name: QueueName,
  handler: WorkerHandler<TData, TResult>,
  concurrency = 5,
): Worker | null {
  if (workers.has(name)) return workers.get(name)!;
  const conn = getConnection();
  if (!conn) return null;

  const worker = new Worker<TData, TResult>(
    name,
    async (job) => handler(job.data),
    {
      connection: conn,
      concurrency,
    },
  );
  worker.on("failed", (job, error) => {
    logger.warn(
      {
        queue: name,
        jobId: job?.id,
        attempts: job?.attemptsMade,
        error: error.message,
      },
      "Job failed",
    );
  });
  worker.on("completed", (job) => {
    logger.info(
      { queue: name, jobId: job.id, jobName: job.name },
      "Job completed",
    );
  });
  workers.set(name, worker);
  return worker;
}

// ── Lifecycle ────────────────────────────────────────────────────────────

/**
 * Gracefully shut down queues and workers. Called from process signals.
 */
export async function shutdownQueues(): Promise<void> {
  for (const worker of workers.values()) {
    try {
      await worker.close();
    } catch (error) {
      logger.warn({ error }, "Error closing worker");
    }
  }
  for (const queue of queues.values()) {
    try {
      await queue.close();
    } catch (error) {
      logger.warn({ error }, "Error closing queue");
    }
  }
  if (connection) {
    try {
      await connection.quit();
    } catch {
      // ignore
    }
    connection = null;
  }
}

/**
 * Whether BullMQ is actually available (Redis reachable and configured).
 */
export function queuesAvailable(): boolean {
  return getConnection() !== null;
}

export { QUEUE_NAMES };
