import { logger } from "@/lib/logger";
import { createNotification } from "@/lib/dal/notifications";
import { sendToChannel, type NotificationChannel } from "./channels";
import { getTemplateByEvent } from "./templates";

export interface NotificationPayload {
  userId: string;
  event: string;
  data: Record<string, string>;
}

export class NotificationService {
  /**
   * Send a notification to a user based on an event template.
   *
   * 1. Look up the template by event name
   * 2. Render title and body with variable substitution
   * 3. Persist to DB for each channel
   * 4. Dispatch to each channel sender (mock for now)
   * 5. Log the result
   */
  async send(payload: NotificationPayload): Promise<void> {
    const { userId, event, data } = payload;

    const template = getTemplateByEvent(event);
    if (!template) {
      logger.warn({ event }, "No notification template found for event");
      return;
    }

    const title = this.renderTemplate(template.title, data);
    const body = this.renderTemplate(template.body, data);

    for (const channel of template.channels) {
      try {
        // Persist to database
        await createNotification({
          userId,
          type: event,
          channel,
          title,
          body,
          status: "pending",
          metadata: data,
        });

        // Dispatch (mock senders for now — they just log)
        const success = await sendToChannel(
          channel,
          userId, // In production: resolve to email / phone / chatId
          title,
          body,
        );

        if (success) {
          logger.info(
            { userId, event, channel },
            "Notification sent successfully",
          );
        } else {
          logger.error(
            { userId, event, channel },
            "Notification send failed",
          );
        }
      } catch (error) {
        logger.error(
          { userId, event, channel, error },
          "Error sending notification",
        );
      }
    }
  }

  /**
   * Simple `{{variable}}` template renderer.
   */
  private renderTemplate(
    template: string,
    data: Record<string, string>,
  ): string {
    return template.replace(
      /\{\{(\w+)\}\}/g,
      (_, key: string) => data[key] ?? "",
    );
  }
}

export const notificationService = new NotificationService();
