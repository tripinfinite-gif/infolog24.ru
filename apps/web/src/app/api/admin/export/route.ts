import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import * as adminDAL from "@/lib/dal/admin";
import { logger } from "@/lib/logger";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userRole = (session.user as Record<string, unknown>).role as string;
    if (userRole !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const url = new URL(request.url);
    const entity = (url.searchParams.get("entity") ?? "orders") as
      | "orders"
      | "clients"
      | "payments";
    const dateFromStr = url.searchParams.get("dateFrom");
    const dateToStr = url.searchParams.get("dateTo");
    const dateFrom = dateFromStr ? new Date(dateFromStr) : undefined;
    const dateTo = dateToStr ? new Date(dateToStr) : undefined;

    const data = await adminDAL.getExportData(entity, dateFrom, dateTo);

    // BOM for Excel UTF-8 compatibility
    const BOM = "\uFEFF";
    let csv = BOM;

    if (entity === "orders") {
      csv +=
        "ID;Клиент;Email;Компания;ТС;Тип;Зона;Статус;Цена;Скидка;Менеджер;Дата создания\n";
      for (const row of data as Array<Record<string, unknown>>) {
        const user = row.user as Record<string, unknown> | null;
        const vehicle = row.vehicle as Record<string, unknown> | null;
        const manager = row.manager as Record<string, unknown> | null;
        csv += [
          row.id,
          user?.name ?? "",
          user?.email ?? "",
          user?.company ?? "",
          vehicle?.licensePlate ?? "",
          row.type,
          row.zone,
          row.status,
          row.price,
          row.discount,
          manager?.name ?? "",
          row.createdAt instanceof Date
            ? row.createdAt.toISOString()
            : row.createdAt,
        ].join(";");
        csv += "\n";
      }
    } else if (entity === "clients") {
      csv += "ID;Имя;Email;Телефон;Компания;ИНН;Дата регистрации\n";
      for (const row of data as Array<Record<string, unknown>>) {
        csv += [
          row.id,
          row.name ?? "",
          row.email,
          row.phone ?? "",
          row.company ?? "",
          row.inn ?? "",
          row.createdAt instanceof Date
            ? row.createdAt.toISOString()
            : row.createdAt,
        ].join(";");
        csv += "\n";
      }
    } else if (entity === "payments") {
      csv += "ID;Клиент;Email;Заявка;Сумма;Статус;Провайдер;Дата\n";
      for (const row of data as Array<Record<string, unknown>>) {
        const user = row.user as Record<string, unknown> | null;
        csv += [
          row.id,
          user?.name ?? "",
          user?.email ?? "",
          row.orderId,
          row.amount,
          row.status,
          row.provider,
          row.createdAt instanceof Date
            ? row.createdAt.toISOString()
            : row.createdAt,
        ].join(";");
        csv += "\n";
      }
    }

    return new Response(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${entity}-export-${new Date().toISOString().split("T")[0]}.csv"`,
      },
    });
  } catch (error) {
    logger.error(error, "Failed to export data");
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
