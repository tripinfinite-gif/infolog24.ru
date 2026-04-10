import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import * as notificationsDAL from "@/lib/dal/notifications";
import { logger } from "@/lib/logger";

export const runtime = "nodejs";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const notifications = await notificationsDAL.getNotificationsByUser(
      session.user.id,
    );
    return NextResponse.json(notifications);
  } catch (error) {
    logger.error(error, "Failed to list notifications");
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
