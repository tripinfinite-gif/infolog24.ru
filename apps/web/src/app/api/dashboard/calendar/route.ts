import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { permits } from "@/lib/db/schema";
import { getSession } from "@/lib/auth/session";
import { logger } from "@/lib/logger";

export const runtime = "nodejs";

/**
 * P2.3 — Calendar export для дедлайнов клиента.
 *
 * GET /api/dashboard/calendar  → text/calendar (.ics)
 *
 * Возвращает iCalendar-файл со всеми active пропусками клиента +
 * VALARM напоминаниями за 30/14/7/3/1 день. Один клик — и клиент
 * импортирует в Google / Apple Calendar.
 *
 * Безопасность: scoped по userId из сессии. Никаких параметров
 * от клиента — не может запросить чужой календарь.
 */

const PRODID = "-//Инфолог24//Дедлайны пропусков//RU";
const ZONE_LABELS: Record<string, string> = {
  mkad: "МКАД",
  ttk: "ТТК",
  sk: "Садовое кольцо",
};

function escapeIcs(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

function fmtDateOnly(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const yyyy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(d.getUTCDate()).padStart(2, "0");
  return `${yyyy}${mm}${dd}`;
}

function fmtTimestamp(date: Date): string {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

function buildCalendar(
  events: Array<{
    uid: string;
    summary: string;
    description: string;
    validUntil: string;
  }>,
): string {
  const now = fmtTimestamp(new Date());
  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    `PRODID:${PRODID}`,
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-CALNAME:Дедлайны Инфолог24",
    "X-WR-CALDESC:Сроки окончания пропусков из вашего личного кабинета",
    "X-WR-TIMEZONE:Europe/Moscow",
  ];

  for (const e of events) {
    const dateStart = fmtDateOnly(e.validUntil);
    const endDate = new Date(e.validUntil);
    endDate.setUTCDate(endDate.getUTCDate() + 1);
    const dateEnd = fmtDateOnly(endDate);

    lines.push(
      "BEGIN:VEVENT",
      `UID:${e.uid}@infolog24.ru`,
      `DTSTAMP:${now}`,
      `DTSTART;VALUE=DATE:${dateStart}`,
      `DTEND;VALUE=DATE:${dateEnd}`,
      `SUMMARY:${escapeIcs(e.summary)}`,
      `DESCRIPTION:${escapeIcs(e.description)}`,
      "STATUS:CONFIRMED",
      "TRANSP:TRANSPARENT",
    );

    for (const days of [30, 14, 7, 3, 1]) {
      lines.push(
        "BEGIN:VALARM",
        "ACTION:DISPLAY",
        `DESCRIPTION:${escapeIcs(`Напоминание: ${e.summary} — осталось ${days} дн.`)}`,
        `TRIGGER:-P${days}D`,
        "END:VALARM",
      );
    }

    lines.push("END:VEVENT");
  }

  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
}

export async function GET() {
  try {
    const session = await getSession();
    const userId = session?.user?.id;

    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const list = await db
      .select({
        permitId: permits.id,
        permitNumber: permits.permitNumber,
        zone: permits.zone,
        validUntil: permits.validUntil,
      })
      .from(permits)
      .where(and(eq(permits.userId, userId), eq(permits.status, "active")))
      .limit(200);

    const events = list.map((p) => ({
      uid: p.permitId,
      summary: `Истекает пропуск ${p.permitNumber} (${ZONE_LABELS[p.zone] ?? p.zone})`,
      description: `Пропуск №${p.permitNumber} зоны ${ZONE_LABELS[p.zone] ?? p.zone} истекает. Оформите продление через личный кабинет: https://infolog24.ru/dashboard/permits`,
      validUntil:
        typeof p.validUntil === "string"
          ? p.validUntil
          : new Date(p.validUntil).toISOString(),
    }));

    const ics = buildCalendar(events);

    return new Response(ics, {
      status: 200,
      headers: {
        "Content-Type": "text/calendar; charset=utf-8",
        "Content-Disposition": 'attachment; filename="infolog24-deadlines.ics"',
        "Cache-Control": "private, no-cache",
      },
    });
  } catch (error) {
    logger.error({ error }, "calendar export failed");
    return new Response("Server error", { status: 500 });
  }
}
