import { logger } from "@/lib/logger";

/**
 * Send a Web Push notification.
 *
 * Currently a mock — logs the call and returns `true`.
 * Replace with real Web Push integration (VAPID) when keys are available.
 */
export async function sendPush(
  subscription: string,
  title: string,
  _body: string,
): Promise<boolean> {
  // TODO: Integrate web-push when VAPID keys are configured
  logger.info({ subscription, title }, "Push notification (mock)");
  return true;
}
