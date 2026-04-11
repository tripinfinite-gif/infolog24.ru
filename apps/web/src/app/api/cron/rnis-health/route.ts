import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";

/**
 * GET /api/cron/rnis-health
 *
 * P1.5 анти-аннуляционные алерты — заглушка для будущей интеграции
 * с РНИС API Дептранса Москвы.
 *
 * Замысел:
 *  - Раз в N часов (например, каждые 4 часа) проверять статус передачи
 *    данных из РНИС для всех активных пропусков в системе.
 *  - Если по конкретному ТС данные не поступают N+ часов — создать
 *    notification типа "rnis_silent" с указанием грузовика и пропуска.
 *  - Клиент видит алерт в кабинете, ассистент проактивно упоминает в чате,
 *    менеджер получает email/MAX/SMS.
 *  - Цель — починить трекер ДО того, как Дептранс автоматически
 *    аннулирует пропуск (это происходит после ~24 ч молчания РНИС).
 *
 * Что нужно для активации:
 *  - Договор и API-ключ с провайдером данных РНИС (или прямой доступ
 *    к Дептранс-API, если будет публичная интеграция).
 *  - Эндпоинт провайдера, который принимает список ВИНов / госномеров
 *    и возвращает timestamp последнего пинга.
 *  - Бизнес-решение: какой порог считать "молчанием" (4 ч / 8 ч / 12 ч).
 *
 * Сейчас: заглушка возвращает 200 OK с TODO в логе.
 * Для активации — реализовать checkRnisHealth() в lib/automation/rnis-health.ts
 * и заменить вызов ниже.
 */
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  logger.info(
    "Running RNIS health check (P1.5 stub — awaiting RNIS provider API)",
  );

  // TODO(P4 или после получения доступа к РНИС API):
  // 1. Загрузить все active permits через DAL
  // 2. Сгруппировать по vehicle (госномер / VIN)
  // 3. Запросить у провайдера last_ping timestamp для каждой машины
  // 4. Для машин с last_ping старше threshold — dispatchNotification("rnis_silent", {...})
  // 5. Дедупликация по аналогии с permit-expiration.ts
  //
  // const result = await checkRnisHealth({ silentThresholdHours: 4 });

  return NextResponse.json({
    ok: true,
    status: "stub",
    note: "RNIS health check awaiting provider API. See route source for activation steps.",
  });
}
