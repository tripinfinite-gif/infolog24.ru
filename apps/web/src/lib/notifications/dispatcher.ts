import { logger } from "@/lib/logger";
import { createNotification } from "@/lib/dal/notifications";
import { sendToChannel, type NotificationChannel } from "./channels";
import {
  getTemplateByEvent,
  renderTemplate,
  renderVariants,
  type NotificationTemplate,
} from "./templates";

export type NotificationData = Record<
  string,
  string | number | undefined | null
>;

export interface DispatchOptions {
  userId: string;
  /** Template event name (e.g. `order_created`). */
  type: string;
  /**
   * Force a specific channel. If omitted, every channel listed in the
   * template (filtered by user preferences) receives the notification.
   */
  channel?: NotificationChannel;
  /** Variables for `{{variable}}` substitution. */
  data?: NotificationData;
  /**
   * Optional pre-resolved recipients per channel (email address, phone,
   * chat id, push subscription). If not provided, the user id is used as
   * a placeholder until recipient resolution is implemented.
   */
  recipients?: Partial<Record<NotificationChannel, string>>;
}

export interface DispatchResult {
  /** Number of channels we attempted to send on. */
  attempted: number;
  /** Channels that succeeded. */
  succeeded: NotificationChannel[];
  /** Channels that failed. */
  failed: NotificationChannel[];
  /** Channels skipped because of user preferences. */
  skipped: NotificationChannel[];
}

// ── User preferences stub ────────────────────────────────────────────────

/**
 * Preferences stub.
 *
 * In a full implementation this would read from a `user_preferences` table.
 * For now every channel is enabled by default so notifications always reach
 * the user. The API shape is stable so swapping the stub out is painless.
 */
async function getUserChannelPreferences(
  _userId: string,
): Promise<Record<NotificationChannel, boolean>> {
  return {
    email: true,
    sms: true,
    telegram: true,
    push: true,
  };
}

// ── Channel selection ────────────────────────────────────────────────────

function pickChannels(
  template: NotificationTemplate,
  prefs: Record<NotificationChannel, boolean>,
  forced?: NotificationChannel,
): { selected: NotificationChannel[]; skipped: NotificationChannel[] } {
  if (forced) {
    const allowed = prefs[forced];
    return {
      selected: allowed ? [forced] : [],
      skipped: allowed ? [] : [forced],
    };
  }

  const selected: NotificationChannel[] = [];
  const skipped: NotificationChannel[] = [];
  for (const channel of template.channels) {
    if (prefs[channel]) {
      selected.push(channel);
    } else {
      skipped.push(channel);
    }
  }
  return { selected, skipped };
}

// ── Render helpers ───────────────────────────────────────────────────────

interface RenderedMessage {
  title: string;
  body: string;
}

function renderForChannel(
  template: NotificationTemplate,
  channel: NotificationChannel,
  data: NotificationData,
): RenderedMessage {
  const defaultTitle = renderTemplate(template.title, data);
  const defaultBody = renderTemplate(template.body, data);

  if (!template.variants) {
    return { title: defaultTitle, body: defaultBody };
  }

  const variants = renderVariants(template.variants, data);
  switch (channel) {
    case "email":
      return {
        title: variants.email?.subject ?? defaultTitle,
        body: variants.email?.html ?? variants.email?.text ?? defaultBody,
      };
    case "sms":
      return {
        title: defaultTitle,
        body: variants.sms?.text ?? defaultBody,
      };
    case "telegram":
      return {
        title: defaultTitle,
        body: variants.telegram?.markdown ?? defaultBody,
      };
    case "push":
      return {
        title: variants.push?.title ?? defaultTitle,
        body: variants.push?.body ?? defaultBody,
      };
  }
}

// ── Dispatcher ───────────────────────────────────────────────────────────

/**
 * Dispatch a notification.
 *
 * Workflow:
 *   1. Look up the template by event type.
 *   2. Render title + body with variable substitution.
 *   3. Load user preferences (which channels are enabled).
 *   4. Pick channels (forced channel wins; otherwise template intersect prefs).
 *   5. For each channel: persist to DB, then send via the adapter.
 *
 * The function never throws — all failures are logged and returned as part
 * of the result so callers (state machine hooks, cron jobs, queue workers)
 * can react without wrapping every call in a try/catch.
 */
export async function dispatchNotification(
  options: DispatchOptions,
): Promise<DispatchResult> {
  const { userId, type, channel: forcedChannel, data = {}, recipients } =
    options;

  const result: DispatchResult = {
    attempted: 0,
    succeeded: [],
    failed: [],
    skipped: [],
  };

  const template = getTemplateByEvent(type);
  if (!template) {
    logger.warn({ event: type }, "No notification template for event");
    return result;
  }

  let prefs: Record<NotificationChannel, boolean>;
  try {
    prefs = await getUserChannelPreferences(userId);
  } catch (error) {
    logger.error(
      { error, userId },
      "Failed to load user preferences — defaulting to enabled",
    );
    prefs = { email: true, sms: true, telegram: true, push: true };
  }

  const { selected, skipped } = pickChannels(template, prefs, forcedChannel);
  result.skipped = skipped;

  // Convert data map to string-only map for DB storage.
  const metadata: Record<string, string> = {};
  for (const [key, value] of Object.entries(data)) {
    if (value != null) metadata[key] = String(value);
  }

  for (const ch of selected) {
    result.attempted++;
    const rendered = renderForChannel(template, ch, data);
    const recipient = recipients?.[ch] ?? userId;

    let dbId: string | undefined;
    try {
      const record = await createNotification({
        userId,
        type,
        channel: ch,
        title: rendered.title.slice(0, 255),
        body: rendered.body,
        status: "pending",
        metadata,
      });
      dbId = record.id;
    } catch (error) {
      // DB unreachable — still try to send, but log the persistence failure.
      logger.error(
        { error, userId, type, channel: ch },
        "Failed to persist notification — will still attempt to send",
      );
    }

    let success = false;
    try {
      success = await sendToChannel(
        ch,
        recipient,
        rendered.title,
        rendered.body,
      );
    } catch (error) {
      logger.error(
        { error, userId, type, channel: ch },
        "Channel adapter threw — marking as failed",
      );
      success = false;
    }

    if (success) {
      result.succeeded.push(ch);
      logger.info(
        { userId, type, channel: ch, dbId },
        "Notification dispatched",
      );
    } else {
      result.failed.push(ch);
      logger.warn(
        { userId, type, channel: ch, dbId },
        "Notification dispatch failed",
      );
    }
  }

  return result;
}
