import { sendEmail } from "./email";
import { sendSMS } from "./sms";
import { sendTelegram } from "./telegram";
import { sendPush } from "./push";

export type NotificationChannel = "email" | "sms" | "telegram" | "push";

/**
 * Route a notification to the appropriate channel sender.
 *
 * Missing infrastructure (SMTP, SMS gateway, bot token) is handled
 * gracefully by the channel adapters themselves — they log a warning
 * and return `false` instead of throwing.
 */
export async function sendToChannel(
  channel: NotificationChannel,
  recipient: string,
  subject: string,
  body: string,
): Promise<boolean> {
  try {
    switch (channel) {
      case "email":
        return await sendEmail(recipient, subject, body);
      case "sms":
        return await sendSMS(recipient, body);
      case "telegram":
        return await sendTelegram(recipient, body);
      case "push":
        return await sendPush(recipient, subject, body);
    }
  } catch {
    // Channel adapters should not throw — but if they do we degrade gracefully.
    return false;
  }
}

export { sendEmail, sendSMS, sendTelegram, sendPush };
