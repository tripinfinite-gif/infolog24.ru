import { logger } from "@/lib/logger";
import { notificationService } from "@/lib/notifications/service";

export interface DripStep {
  /** Days relative to the anchor date (negative = before). */
  delayDays: number;
  /** Notification event to fire. */
  event: string;
  /** Optional guard — step is skipped if this returns `false`. */
  condition?: (order: { status: string }) => boolean;
}

// ── Campaigns ────────────────────────────────────────────────────────────────

/**
 * New-order drip campaign.
 * Anchor = order creation date.
 */
export const orderDripCampaign: DripStep[] = [
  { delayDays: 0, event: "welcome" },
  { delayDays: 1, event: "order_tips" },
  {
    delayDays: 3,
    event: "order_reminder",
    condition: (order) => order.status === "draft",
  },
  {
    delayDays: 7,
    event: "order_followup",
    condition: (order) => order.status === "documents_pending",
  },
  { delayDays: 30, event: "satisfaction_survey" },
];

/**
 * Permit renewal drip campaign.
 * Anchor = permit expiry date (negative = before expiry).
 */
export const renewalDripCampaign: DripStep[] = [
  { delayDays: -30, event: "permit_expiring_30d" },
  { delayDays: -14, event: "permit_expiring_14d" },
  { delayDays: -7, event: "permit_expiring_7d" },
  { delayDays: 0, event: "permit_expired" },
  { delayDays: 3, event: "permit_renewal_offer" },
];

// ── Processor ────────────────────────────────────────────────────────────────

/**
 * Evaluate and fire a drip campaign for a given context.
 *
 * @param campaign - Array of drip steps to evaluate
 * @param context  - Must include userId, event data, and current order state
 * @param anchorDate - The date used to calculate delays
 */
export async function processDripCampaign(
  campaign: DripStep[],
  context: {
    userId: string;
    data: Record<string, string>;
    order: { status: string };
  },
  anchorDate: Date,
): Promise<{ fired: string[]; skipped: string[] }> {
  const now = new Date();
  const fired: string[] = [];
  const skipped: string[] = [];

  for (const step of campaign) {
    const targetDate = new Date(anchorDate);
    targetDate.setDate(targetDate.getDate() + step.delayDays);

    // Only fire if the target date has passed (within the current day)
    if (now < targetDate) {
      skipped.push(step.event);
      continue;
    }

    // Check optional guard condition
    if (step.condition && !step.condition(context.order)) {
      skipped.push(step.event);
      continue;
    }

    await notificationService.send({
      userId: context.userId,
      event: step.event,
      data: context.data,
    });

    fired.push(step.event);
  }

  logger.info(
    { fired, skipped, campaign: campaign.length },
    "Drip campaign processed",
  );

  return { fired, skipped };
}
