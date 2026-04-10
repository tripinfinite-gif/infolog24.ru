import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { payments } from "@/lib/db/schema";
import { getSession } from "@/lib/auth/session";
import { generateActHtml } from "@/lib/payments/act";
import { logger } from "@/lib/logger";

export const runtime = "nodejs";

const ORDER_TYPE_LABELS: Record<string, string> = {
  mkad_day: "Оформление пропуска МКАД (дневной)",
  mkad_night: "Оформление пропуска МКАД (ночной)",
  ttk: "Оформление пропуска ТТК",
  sk: "Оформление пропуска Садовое кольцо",
  temp: "Оформление временного пропуска",
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const payment = await db.query.payments.findFirst({
      where: eq(payments.id, id),
      with: {
        order: {
          with: { user: true },
        },
      },
    });

    if (!payment) {
      return NextResponse.json(
        { error: "Payment not found" },
        { status: 404 },
      );
    }

    // Only generate act for succeeded payments
    if (payment.status !== "succeeded") {
      return NextResponse.json(
        { error: "Act is only available for completed payments" },
        { status: 400 },
      );
    }

    // Verify ownership (allow admins and managers too)
    const userRole = (session.user as Record<string, unknown>).role as string;
    if (
      payment.userId !== session.user.id &&
      userRole !== "admin" &&
      userRole !== "manager"
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const order = payment.order;
    const user = order.user;
    const serviceDescription =
      ORDER_TYPE_LABELS[order.type] ?? `Оформление пропуска (${order.type})`;

    const paidDate = payment.paidAt
      ? payment.paidAt.toLocaleDateString("ru-RU")
      : payment.createdAt.toLocaleDateString("ru-RU");

    const html = generateActHtml({
      actNumber: `ACT-${payment.id.slice(0, 8).toUpperCase()}`,
      date: paidDate,
      clientName: user.name ?? user.email,
      clientCompany: user.company ?? undefined,
      services: [
        {
          description: serviceDescription,
          amount: payment.amount,
        },
      ],
      total: payment.amount,
    });

    return new NextResponse(html, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
      },
    });
  } catch (error) {
    logger.error(error, "Failed to generate act");
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
