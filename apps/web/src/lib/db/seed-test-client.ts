/**
 * Сидер тестового клиента для проверки личного кабинета.
 *
 * Создаёт пользователя через `auth.api.signUpEmail()` (правильный
 * scrypt-хеш Better Auth — простым SHA-256 в общем seed.ts войти нельзя)
 * и доводит его до полноценного клиента с осмысленным набором данных:
 * ТС, заявками, пропусками, документами, платежами и уведомлениями.
 *
 * Сценарии в данных подобраны так, чтобы каждый раздел кабинета
 * показывал «живое» состояние:
 *
 *   KPI-карточки на /dashboard:
 *     — Активные заявки > 0 (draft + processing + payment_pending)
 *     — Действующие пропуска > 0 (один active, один истекающий)
 *     — Ожидает оплаты > 0 (pending платёж)
 *     — Непрочитанные уведомления > 0
 *   Алерт об истекающих пропусках (до 30 дней)
 *   Список последних заявок с разными статусами
 *
 * Скрипт идемпотентен: при повторном запуске удаляет зависимые данные
 * тестового клиента (vehicles, orders, permits, documents, payments,
 * notifications, audit log) и заливает заново. Сам user/accounts
 * не удаляется — чтобы не сломать ссылки на него в audit log других
 * пользователей и не перегенерировать хеш пароля.
 *
 * Запуск:
 *   pnpm --filter @infolog24/web db:seed:client
 *
 * Credentials, которые он выпускает:
 *   email:    client@infolog24.ru
 *   password: ClientTest123!
 *   логин на /login → редирект на /dashboard
 */
import { eq, inArray } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  users,
  vehicles,
  orders,
  permits,
  documents,
  payments,
  notifications,
  orderStatusHistory,
  auditLog,
} from "@/lib/db/schema";

const TEST_CLIENT = {
  email: "client@infolog24.ru",
  password: "ClientTest123!",
  name: "Сергей Тестов",
  phone: "+79161112233",
  company: 'ООО "Тестовая транспортная"',
  inn: "7707123456",
  ogrn: "1177746123456",
};

// ── Утилиты дат ─────────────────────────────────────────────────────────────
const now = new Date();
const daysAgo = (d: number): Date => {
  const date = new Date(now);
  date.setDate(date.getDate() - d);
  return date;
};
const dateISO = (d: number): string => {
  const date = new Date(now);
  date.setDate(date.getDate() + d);
  return date.toISOString().split("T")[0]!;
};

async function seedTestClient() {
  console.log("→ Сид тестового клиента");
  console.log(`  email:    ${TEST_CLIENT.email}`);
  console.log(`  password: ${TEST_CLIENT.password}`);

  // 1. Проверяем, существует ли уже такой пользователь
  const existing = await db.query.users.findFirst({
    where: eq(users.email, TEST_CLIENT.email),
  });

  let userId: string;

  if (existing) {
    console.log("  ✓ Пользователь уже существует, чистим зависимые данные");
    userId = existing.id;

    // Удаляем в порядке FK (без cascade): сначала листья, потом корни.
    // orderStatusHistory зависит от orders (по orderId) — удаляем первым,
    // получив id заказов клиента.
    const userOrders = await db
      .select({ id: orders.id })
      .from(orders)
      .where(eq(orders.userId, userId));
    const orderIds = userOrders.map((o) => o.id);

    if (orderIds.length > 0) {
      await db
        .delete(orderStatusHistory)
        .where(inArray(orderStatusHistory.orderId, orderIds));
      await db.delete(payments).where(inArray(payments.orderId, orderIds));
      await db.delete(permits).where(inArray(permits.orderId, orderIds));
      // documents привязаны к userId (orderId nullable) — удалим ниже
    }

    await db.delete(documents).where(eq(documents.userId, userId));
    await db.delete(orders).where(eq(orders.userId, userId));
    await db.delete(vehicles).where(eq(vehicles.userId, userId));
    await db.delete(notifications).where(eq(notifications.userId, userId));
    await db.delete(auditLog).where(eq(auditLog.userId, userId));

    console.log("  ✓ Зависимые данные очищены");
  } else {
    // 2. Создаём через Better Auth — он сам захеширует пароль (scrypt)
    //    и положит запись в accounts с providerId='credential'.
    const result = await auth.api.signUpEmail({
      body: {
        email: TEST_CLIENT.email,
        password: TEST_CLIENT.password,
        name: TEST_CLIENT.name,
      },
    });

    if (!result?.user?.id) {
      throw new Error("auth.api.signUpEmail вернул пустой результат");
    }

    userId = result.user.id;
    console.log(`  ✓ Создан пользователь ${userId}`);
  }

  // 3. Заполняем профиль клиента
  await db
    .update(users)
    .set({
      role: "client",
      phone: TEST_CLIENT.phone,
      company: TEST_CLIENT.company,
      inn: TEST_CLIENT.inn,
      ogrn: TEST_CLIENT.ogrn,
      name: TEST_CLIENT.name,
      emailVerified: true,
    })
    .where(eq(users.id, userId));
  console.log("  ✓ Профиль обновлён (role=client, компания, ИНН, ОГРН)");

  // 4. Транспортные средства
  const vehiclesData = await db
    .insert(vehicles)
    .values([
      {
        userId,
        brand: "КАМАЗ",
        model: "65115",
        licensePlate: "А777ТТ777",
        vin: "XTC65115091000001",
        year: 2021,
        ecoClass: "euro5",
        maxWeight: 15000,
        category: "N3",
      },
      {
        userId,
        brand: "Volvo",
        model: "FH 460",
        licensePlate: "В888СС799",
        vin: "YV2RT40A5CB000002",
        year: 2022,
        ecoClass: "euro6",
        maxWeight: 18000,
        category: "N3",
      },
    ])
    .returning();
  console.log(`  ✓ Создано ТС: ${vehiclesData.length}`);

  // 5. Заявки — разные статусы, чтобы KPI были ненулевые
  const [orderDraft, orderProcessing, orderApproved, orderPaymentPending, orderApprovedExpiring] =
    await db
      .insert(orders)
      .values([
        // Черновик — не идёт в «активные», но попадёт в «последние заявки»
        {
          userId,
          vehicleId: vehiclesData[0]!.id,
          type: "mkad_day",
          zone: "mkad",
          status: "draft",
          price: 45000,
          discount: 0,
          createdAt: daysAgo(0),
        },
        // В работе — активная
        {
          userId,
          vehicleId: vehiclesData[1]!.id,
          type: "ttk",
          zone: "ttk",
          status: "processing",
          price: 65000,
          discount: 0,
          estimatedReadyDate: dateISO(7),
          notes: "Комплект документов принят, передан в ЦОДД",
          createdAt: daysAgo(3),
        },
        // Одобрена — под неё выпустим активный пропуск
        {
          userId,
          vehicleId: vehiclesData[0]!.id,
          type: "mkad_night",
          zone: "mkad",
          status: "approved",
          price: 35000,
          discount: 0,
          estimatedReadyDate: dateISO(-5),
          createdAt: daysAgo(20),
        },
        // Ждёт оплаты — активная + счётчик «Ожидает оплаты»
        {
          userId,
          vehicleId: vehiclesData[1]!.id,
          type: "sk",
          zone: "sk",
          status: "payment_pending",
          price: 90000,
          discount: 0,
          createdAt: daysAgo(2),
        },
        // Одобрена — под неё выпустим истекающий пропуск (для алерта)
        {
          userId,
          vehicleId: vehiclesData[0]!.id,
          type: "mkad_day",
          zone: "mkad",
          status: "approved",
          price: 45000,
          discount: 0,
          estimatedReadyDate: dateISO(-350),
          createdAt: daysAgo(355),
        },
      ])
      .returning();
  console.log(`  ✓ Создано заявок: 5 (draft, processing, approved, payment_pending, approved)`);

  // 6. Пропуска: один обычный active + один истекающий в 15 дней
  await db.insert(permits).values([
    {
      orderId: orderApproved!.id,
      userId,
      permitNumber: "МКАД-2026-100001",
      zone: "mkad",
      type: "mkad_night",
      validFrom: dateISO(-5),
      validUntil: dateISO(360),
      status: "active",
    },
    {
      orderId: orderApprovedExpiring!.id,
      userId,
      permitNumber: "МКАД-2025-100002",
      zone: "mkad",
      type: "mkad_day",
      validFrom: dateISO(-350),
      validUntil: dateISO(15), // истекает через 15 дней — попадёт в алерт
      status: "active",
    },
  ]);
  console.log("  ✓ Создано пропусков: 2 (1 обычный + 1 истекающий через 15 дней)");

  // 7. Документы: approved + pending + rejected
  await db.insert(documents).values([
    {
      userId,
      vehicleId: vehiclesData[0]!.id,
      orderId: orderApproved!.id,
      type: "pts",
      fileName: "pts_kamaz_65115.pdf",
      fileUrl: "https://s3.storage.selcloud.ru/infolog24-docs/test/pts_kamaz.pdf",
      fileSize: 524288,
      mimeType: "application/pdf",
      status: "approved",
    },
    {
      userId,
      vehicleId: vehiclesData[0]!.id,
      orderId: orderApproved!.id,
      type: "sts",
      fileName: "sts_kamaz_65115.pdf",
      fileUrl: "https://s3.storage.selcloud.ru/infolog24-docs/test/sts_kamaz.pdf",
      fileSize: 412672,
      mimeType: "application/pdf",
      status: "approved",
    },
    {
      userId,
      vehicleId: vehiclesData[1]!.id,
      orderId: orderProcessing!.id,
      type: "pts",
      fileName: "pts_volvo_fh460.pdf",
      fileUrl: "https://s3.storage.selcloud.ru/infolog24-docs/test/pts_volvo.pdf",
      fileSize: 498000,
      mimeType: "application/pdf",
      status: "pending",
    },
    {
      userId,
      orderId: orderProcessing!.id,
      type: "power_of_attorney",
      fileName: "doverennost.pdf",
      fileUrl: "https://s3.storage.selcloud.ru/infolog24-docs/test/doverennost.pdf",
      fileSize: 312000,
      mimeType: "application/pdf",
      status: "rejected",
      rejectionReason: "Скан нечитаемый, загрузите повторно в разрешении ≥ 300 dpi",
    },
  ]);
  console.log("  ✓ Создано документов: 4 (approved / pending / rejected)");

  // 8. Платежи: один успешный (под approved), один pending (под payment_pending)
  await db.insert(payments).values([
    {
      orderId: orderApproved!.id,
      userId,
      amount: 35000,
      currency: "RUB",
      status: "succeeded",
      provider: "yookassa",
      externalId: "test-payment-succeeded-001",
      paidAt: daysAgo(19),
      createdAt: daysAgo(20),
    },
    {
      orderId: orderPaymentPending!.id,
      userId,
      amount: 90000,
      currency: "RUB",
      status: "pending",
      provider: "yookassa",
      externalId: "test-payment-pending-002",
      createdAt: daysAgo(2),
    },
  ]);
  console.log("  ✓ Создано платежей: 2 (succeeded + pending)");

  // 9. Уведомления: 3 непрочитанных + 1 прочитанное
  await db.insert(notifications).values([
    {
      userId,
      type: "order_approved",
      channel: "email",
      title: "Пропуск одобрен",
      body: "Ваш пропуск МКАД-2026-100001 для КАМАЗ 65115 (А777ТТ777) одобрен.",
      status: "sent",
      sentAt: daysAgo(5),
    },
    {
      userId,
      type: "payment_reminder",
      channel: "email",
      title: "Ожидается оплата",
      body: "По заявке СК на Volvo FH 460 ожидается оплата 90 000 ₽.",
      status: "sent",
      sentAt: daysAgo(1),
    },
    {
      userId,
      type: "documents_required",
      channel: "telegram",
      title: "Требуются документы",
      body: "Для заявки ТТК на Volvo FH 460 доверенность отклонена. Загрузите новую версию.",
      status: "sent",
      sentAt: daysAgo(1),
    },
    {
      userId,
      type: "permit_expiring",
      channel: "email",
      title: "Пропуск скоро истекает",
      body: "Пропуск МКАД-2025-100002 истекает через 15 дней. Оформите продление заранее.",
      status: "read",
      sentAt: daysAgo(3),
      readAt: daysAgo(3),
    },
  ]);
  console.log("  ✓ Создано уведомлений: 4 (3 непрочитанных + 1 прочитанное)");

  // 10. История статусов — для заявки «approved», чтобы таймлайн в карточке
  //     заявки показывал осмысленный путь.
  await db.insert(orderStatusHistory).values([
    {
      orderId: orderApproved!.id,
      fromStatus: null,
      toStatus: "draft",
      changedBy: userId,
      createdAt: daysAgo(22),
    },
    {
      orderId: orderApproved!.id,
      fromStatus: "draft",
      toStatus: "processing",
      changedBy: userId,
      comment: "Документы загружены",
      createdAt: daysAgo(21),
    },
    {
      orderId: orderApproved!.id,
      fromStatus: "processing",
      toStatus: "submitted",
      changedBy: userId,
      comment: "Заявка подана в ЦОДД",
      createdAt: daysAgo(20),
    },
    {
      orderId: orderApproved!.id,
      fromStatus: "submitted",
      toStatus: "approved",
      changedBy: userId,
      comment: "Пропуск одобрен",
      createdAt: daysAgo(19),
    },
  ]);
  console.log("  ✓ Создана история статусов заявки");

  // Используем неразрушающие переменные — orderDraft нужен только для
  // чистоты деструктуризации; TypeScript может ругнуться на unused.
  void orderDraft;

  console.log("\n✓ Сид клиента завершён.");
  console.log(`  Логин:        ${TEST_CLIENT.email} / ${TEST_CLIENT.password}`);
  console.log("  URL:          /login  →  /dashboard");
  console.log("  ТС:           2  |  Заявки: 5  |  Пропуска: 2  |  Платежей: 2\n");
}

seedTestClient()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("✗ Сид упал:", err);
    process.exit(1);
  });
