import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import * as notificationsDAL from "@/lib/dal/notifications";
import { logger } from "@/lib/logger";

export const runtime = "nodejs";

export async function PATCH(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const notification = await notificationsDAL.markAsRead(id);

    return NextResponse.json(notification);
  } catch (error) {
    logger.error(error, "Failed to mark notification as read");
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
