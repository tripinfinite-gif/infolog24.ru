import { dispatchNotification, type NotificationData } from "./dispatcher";

export interface NotificationPayload {
  userId: string;
  event: string;
  data?: NotificationData;
}

/**
 * NotificationService — thin compatibility wrapper around `dispatchNotification`.
 *
 * New code should call `dispatchNotification` directly. This class exists
 * so older call sites (`notificationService.send({...})`) keep working.
 */
export class NotificationService {
  async send(payload: NotificationPayload): Promise<void> {
    await dispatchNotification({
      userId: payload.userId,
      type: payload.event,
      data: payload.data,
    });
  }
}

export const notificationService = new NotificationService();
