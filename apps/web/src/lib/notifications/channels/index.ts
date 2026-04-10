import { sendEmail } from "./email";
import { sendSMS } from "./sms";
import { sendTelegram } from "./telegram";

export type NotificationChannel = "email" | "sms" | "telegram";

/**
 * Route a notification to the appropriate channel sender.
 */
export async function sendToChannel(
  channel: NotificationChannel,
  recipient: string,
  subject: string,
  body: string,
): Promise<boolean> {
  switch (channel) {
    case "email":
      return sendEmail(recipient, subject, body);
    case "sms":
      return sendSMS(recipient, body);
    case "telegram":
      return sendTelegram(recipient, body);
  }
}

export { sendEmail, sendSMS, sendTelegram };
