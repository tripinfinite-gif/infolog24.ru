import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { getNotificationsByUser } from "@/lib/dal/notifications";
import { NotificationsList } from "./_components/notifications-list";

export const metadata: Metadata = {
  title: "Уведомления",
};

export default async function NotificationsPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const notifications = await getNotificationsByUser(session.user.id);

  return <NotificationsList notifications={notifications} />;
}
