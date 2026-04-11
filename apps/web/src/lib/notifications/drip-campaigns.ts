import { logger } from "@/lib/logger";
import { enqueueNotification } from "@/lib/queues/workers";

/**
 * Email drip campaigns.
 *
 * A campaign is an ordered list of steps; each step fires a notification
 * event after a delay measured in days from a base date (negative delays
 * are scheduled before the base date — used for permit expiration
 * reminders).
 *
 * Scheduling uses BullMQ delayed jobs when Redis is available. In
 * environments without Redis, steps whose delay has already passed are
 * fired inline; future steps are silently skipped (there's nowhere to
 * persist them without a queue).
 */

export type CampaignType =
  | "post_order_created"
  | "post_payment_succeeded"
  | "pre_permit_expiration";

export interface DripStep {
  /** Days relative to the base date. Negative = before, 0 = same day, positive = after. */
  offsetDays: number;
  /** Notification template event to fire. */
  event: string;
}

export const DRIP_CAMPAIGNS: Record<CampaignType, DripStep[]> = {
  post_order_created: [
    { offsetDays: 0, event: "welcome" },
    { offsetDays: 1, event: "order_reminder_day1" },
    { offsetDays: 3, event: "order_reminder_day3" },
  ],
  post_payment_succeeded: [
    { offsetDays: 0, event: "payment_confirmation" },
    { offsetDays: 1, event: "next_steps" },
    { offsetDays: 7, event: "review_request" },
  ],
  pre_permit_expiration: [
    { offsetDays: -45, event: "permit_expiring_45days" },
    { offsetDays: -30, event: "permit_expiring_30days" },
    { offsetDays: -14, event: "permit_expiring_14days" },
    { offsetDays: -7, event: "permit_expiring_7days" },
    { offsetDays: -1, event: "permit_expiring_1day" },
  ],
};

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Schedule every step of a drip campaign for a user. Each step becomes a
 * delayed notification job, so the queue worker will fire them at the
 * right time without needing a separate cron pass.
 *
 * Returns the number of steps that were scheduled (including those
 * fired inline).
 */
export async function scheduleDripCampaign(
  userId: string,
  campaignType: CampaignType,
  baseDate: Date,
  data: Record<string, string | number | null | undefined> = {},
): Promise<number> {
  const campaign = DRIP_CAMPAIGNS[campaignType];
  if (!campaign) {
    logger.warn({ campaignType }, "Unknown drip campaign type");
    return 0;
  }

  const now = Date.now();
  const base = baseDate.getTime();
  let scheduled = 0;

  for (const step of campaign) {
    const target = base + step.offsetDays * DAY_MS;
    const delayMs = Math.max(0, target - now);

    try {
      await enqueueNotification(
        {
          userId,
          type: step.event,
          data: { ...data, campaign: campaignType },
        },
        delayMs,
      );
      scheduled++;
    } catch (error) {
      logger.error(
        { error, userId, campaignType, event: step.event },
        "Failed to schedule drip step",
      );
    }
  }

  logger.info(
    { userId, campaignType, scheduled, total: campaign.length },
    "Drip campaign scheduled",
  );

  return scheduled;
}

/**
 * Convenience: schedule the post-order-created campaign.
 */
export async function scheduleOrderCreatedDrip(
  userId: string,
  orderCreatedAt: Date,
  data: Record<string, string | number | null | undefined>,
): Promise<number> {
  return scheduleDripCampaign(userId, "post_order_created", orderCreatedAt, data);
}

/**
 * Convenience: schedule the post-payment campaign.
 */
export async function schedulePaymentSucceededDrip(
  userId: string,
  paidAt: Date,
  data: Record<string, string | number | null | undefined>,
): Promise<number> {
  return scheduleDripCampaign(
    userId,
    "post_payment_succeeded",
    paidAt,
    data,
  );
}

/**
 * Convenience: schedule the pre-expiration reminder chain.
 */
export async function schedulePermitExpirationDrip(
  userId: string,
  validUntil: Date,
  data: Record<string, string | number | null | undefined>,
): Promise<number> {
  return scheduleDripCampaign(
    userId,
    "pre_permit_expiration",
    validUntil,
    data,
  );
}
