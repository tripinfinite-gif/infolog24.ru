import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { notifications } from "@/lib/db/schema";
import type { NewNotification, Notification } from "@/lib/types";
import { logger } from "@/lib/logger";

export async function createNotification(
  data: Omit<NewNotification, "id" | "createdAt">,
): Promise<Notification> {
  const [notification] = await db
    .insert(notifications)
    .values(data)
    .returning();

  if (!notification) throw new Error("Failed to create notification");

  logger.info(
    { notificationId: notification.id, userId: data.userId, type: data.type },
    "Notification created",
  );
  return notification;
}

export async function getNotificationsByUser(
  userId: string,
  limit = 50,
): Promise<Notification[]> {
  return db.query.notifications.findMany({
    where: eq(notifications.userId, userId),
    orderBy: [desc(notifications.createdAt)],
    limit,
  });
}

export async function markAsRead(id: string): Promise<Notification> {
  const [updated] = await db
    .update(notifications)
    .set({ status: "read", readAt: new Date() })
    .where(eq(notifications.id, id))
    .returning();

  if (!updated) throw new Error("Notification not found");
  return updated;
}

export async function getPendingNotifications(
  limit = 50,
): Promise<Notification[]> {
  return db.query.notifications.findMany({
    where: eq(notifications.status, "pending"),
    orderBy: [notifications.createdAt],
    limit,
  });
}
