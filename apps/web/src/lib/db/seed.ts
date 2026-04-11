import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString =
  process.env.DATABASE_URL ??
  "postgresql://infolog24:dev_password_secure@localhost:5432/infolog24";

const client = postgres(connectionString, { max: 1 });
const db = drizzle(client, { schema });

// Simple hash to simulate Better Auth's password storage
// Better Auth uses bcrypt internally via accounts table
async function hashPassword(password: string): Promise<string> {
  const { createHash } = await import("crypto");
  // Better Auth stores passwords as bcrypt hashes in the accounts.password field
  // For seeding, we use a simple hash — real auth flow will re-hash on first login
  return createHash("sha256").update(password).digest("hex");
}

async function seed() {
  console.log("Seeding database...");

  // ── Users ──────────────────────────────────────────────────────────────
  const passwordHash = await hashPassword("Password123!");

  const [admin, manager1, manager2, client1, client2] = await db
    .insert(schema.users)
    .values([
      {
        email: "admin@infolog24.ru",
        emailVerified: true,
        name: "Иванов Алексей Петрович",
        phone: "+79161234567",
        role: "admin",
      },
      {
        email: "manager1@infolog24.ru",
        emailVerified: true,
        name: "Смирнова Елена Владимировна",
        phone: "+79162345678",
        role: "manager",
      },
      {
        email: "manager2@infolog24.ru",
        emailVerified: true,
        name: "Козлов Дмитрий Сергеевич",
        phone: "+79163456789",
        role: "manager",
      },
      {
        email: "client1@example.com",
        emailVerified: true,
        name: "Петров Сергей Николаевич",
        phone: "+79164567890",
        company: 'ООО "ТрансЛогистик"',
        inn: "7707123456",
        ogrn: "1177746123456",
        role: "client",
      },
      {
        email: "client2@example.com",
        emailVerified: true,
        name: "Кузнецов Андрей Викторович",
        phone: "+79165678901",
        company: 'ИП Кузнецов А.В.',
        inn: "771234567890",
        role: "client",
      },
    ])
    .returning();

  console.log(`  Created ${5} users`);

  // ── Accounts (password credentials) ────────────────────────────────────
  const allUsers = [admin, manager1, manager2, client1, client2];
  await db.insert(schema.accounts).values(
    allUsers.map((u) => ({
      userId: u.id,
      accountId: u.id,
      providerId: "credential",
      password: passwordHash,
    })),
  );
  console.log(`  Created ${allUsers.length} accounts`);

  // ── Vehicles ───────────────────────────────────────────────────────────
  const vehiclesData = await db
    .insert(schema.vehicles)
    .values([
      {
        userId: client1.id,
        brand: "КАМАЗ",
        model: "65115",
        licensePlate: "А123БВ777",
        vin: "XTC65115091234567",
        year: 2020,
        ecoClass: "euro4" as const,
        maxWeight: 15000,
        category: "N3",
      },
      {
        userId: client1.id,
        brand: "КАМАЗ",
        model: "5490",
        licensePlate: "В456ГД750",
        vin: "XTC54900R1234568",
        year: 2022,
        ecoClass: "euro5" as const,
        maxWeight: 18000,
        category: "N3",
      },
      {
        userId: client1.id,
        brand: "MAN",
        model: "TGX 18.500",
        licensePlate: "Е789ЖЗ197",
        vin: "WMAN08ZZ0CY123456",
        year: 2021,
        ecoClass: "euro6" as const,
        maxWeight: 18000,
        category: "N3",
      },
      {
        userId: client2.id,
        brand: "Volvo",
        model: "FH 460",
        licensePlate: "К012ЛМ799",
        vin: "YV2RT40A5CB123456",
        year: 2019,
        ecoClass: "euro5" as const,
        maxWeight: 18000,
        category: "N3",
      },
      {
        userId: client2.id,
        brand: "МАЗ",
        model: "6430С9",
        licensePlate: "Н345ОП77",
        vin: "Y3M6430C9D0012345",
        year: 2018,
        ecoClass: "euro4" as const,
        maxWeight: 25900,
        category: "N3",
      },
      {
        userId: client1.id,
        brand: "Scania",
        model: "R450",
        licensePlate: "Р678СТ750",
        vin: "YS2R4X20005123456",
        year: 2023,
        ecoClass: "euro6" as const,
        maxWeight: 18000,
        category: "N3",
      },
      {
        userId: client2.id,
        brand: "DAF",
        model: "XF 480",
        licensePlate: "У901ФХ197",
        vin: "XLRTE47MS0E123456",
        year: 2020,
        ecoClass: "euro5" as const,
        maxWeight: 18000,
        category: "N3",
      },
      {
        userId: client1.id,
        brand: "Mercedes-Benz",
        model: "Actros 1845",
        licensePlate: "Ц234ЧШ77",
        vin: "WDB96340310123456",
        year: 2021,
        ecoClass: "euro6" as const,
        maxWeight: 18000,
        category: "N3",
      },
      {
        userId: client2.id,
        brand: "КАМАЗ",
        model: "54901",
        licensePlate: "Щ567ЭЮ799",
        vin: "XTC54901031234569",
        year: 2023,
        ecoClass: "euro5" as const,
        maxWeight: 18000,
        category: "N3",
      },
      {
        userId: client1.id,
        brand: "Volvo",
        model: "FH 500",
        licensePlate: "Я890АБ750",
        vin: "YV2RT50A7DB654321",
        year: 2022,
        ecoClass: "euro6" as const,
        maxWeight: 18000,
        category: "N3",
      },
    ])
    .returning();

  console.log(`  Created ${vehiclesData.length} vehicles`);

  // ── Orders ─────────────────────────────────────────────────────────────
  const now = new Date();
  const daysAgo = (d: number) => {
    const date = new Date(now);
    date.setDate(date.getDate() - d);
    return date;
  };
  const futureDate = (d: number) => {
    const date = new Date(now);
    date.setDate(date.getDate() + d);
    return date.toISOString().split("T")[0];
  };

  const ordersData = await db
    .insert(schema.orders)
    .values([
      {
        userId: client1.id,
        managerId: manager1.id,
        vehicleId: vehiclesData[0].id,
        type: "mkad_day" as const,
        zone: "mkad" as const,
        status: "approved" as const,
        price: 45000,
        discount: 0,
        estimatedReadyDate: futureDate(-5),
        notes: "Срочный заказ, клиент постоянный",
        createdAt: daysAgo(30),
      },
      {
        userId: client1.id,
        managerId: manager1.id,
        vehicleId: vehiclesData[1].id,
        type: "mkad_night" as const,
        zone: "mkad" as const,
        status: "approved" as const,
        price: 35000,
        discount: 5000,
        promoCode: "FIRST10",
        estimatedReadyDate: futureDate(-3),
        createdAt: daysAgo(25),
      },
      {
        userId: client1.id,
        managerId: manager2.id,
        vehicleId: vehiclesData[2].id,
        type: "ttk" as const,
        zone: "ttk" as const,
        status: "processing" as const,
        price: 65000,
        discount: 0,
        estimatedReadyDate: futureDate(5),
        createdAt: daysAgo(10),
      },
      {
        userId: client2.id,
        managerId: manager1.id,
        vehicleId: vehiclesData[3].id,
        type: "mkad_day" as const,
        zone: "mkad" as const,
        status: "approved" as const,
        price: 45000,
        discount: 0,
        estimatedReadyDate: futureDate(-10),
        createdAt: daysAgo(45),
      },
      {
        userId: client2.id,
        managerId: manager2.id,
        vehicleId: vehiclesData[4].id,
        type: "sk" as const,
        zone: "sk" as const,
        status: "submitted" as const,
        price: 90000,
        discount: 0,
        estimatedReadyDate: futureDate(10),
        createdAt: daysAgo(7),
      },
      {
        userId: client1.id,
        vehicleId: vehiclesData[5].id,
        type: "mkad_day" as const,
        zone: "mkad" as const,
        status: "draft" as const,
        price: 45000,
        discount: 0,
        createdAt: daysAgo(1),
      },
      {
        userId: client2.id,
        vehicleId: vehiclesData[6].id,
        type: "ttk" as const,
        zone: "ttk" as const,
        status: "documents_pending" as const,
        price: 65000,
        discount: 0,
        createdAt: daysAgo(3),
      },
      {
        userId: client1.id,
        managerId: manager1.id,
        vehicleId: vehiclesData[7].id,
        type: "mkad_night" as const,
        zone: "mkad" as const,
        status: "payment_pending" as const,
        price: 35000,
        discount: 0,
        createdAt: daysAgo(5),
      },
      {
        userId: client2.id,
        managerId: manager1.id,
        vehicleId: vehiclesData[8].id,
        type: "mkad_day" as const,
        zone: "mkad" as const,
        status: "rejected" as const,
        price: 45000,
        discount: 0,
        notes: "Документы не прошли проверку — несоответствие данных ПТС",
        createdAt: daysAgo(20),
      },
      {
        userId: client1.id,
        managerId: manager2.id,
        vehicleId: vehiclesData[0].id,
        type: "ttk" as const,
        zone: "ttk" as const,
        status: "cancelled" as const,
        price: 65000,
        discount: 0,
        notes: "Клиент отменил — сменился маршрут",
        createdAt: daysAgo(15),
      },
      {
        userId: client2.id,
        managerId: manager2.id,
        vehicleId: vehiclesData[3].id,
        type: "sk" as const,
        zone: "sk" as const,
        status: "approved" as const,
        price: 90000,
        discount: 10000,
        promoCode: "PARTNER20",
        estimatedReadyDate: futureDate(-2),
        createdAt: daysAgo(35),
      },
      {
        userId: client1.id,
        managerId: manager1.id,
        vehicleId: vehiclesData[9].id,
        type: "mkad_day" as const,
        zone: "mkad" as const,
        status: "processing" as const,
        price: 45000,
        discount: 0,
        estimatedReadyDate: futureDate(7),
        createdAt: daysAgo(4),
      },
      {
        userId: client2.id,
        vehicleId: vehiclesData[4].id,
        type: "mkad_night" as const,
        zone: "mkad" as const,
        status: "draft" as const,
        price: 35000,
        discount: 0,
        createdAt: daysAgo(0),
      },
      {
        userId: client1.id,
        managerId: manager1.id,
        vehicleId: vehiclesData[2].id,
        type: "temp" as const,
        zone: "mkad" as const,
        status: "approved" as const,
        price: 25000,
        discount: 0,
        estimatedReadyDate: futureDate(-1),
        createdAt: daysAgo(12),
      },
      {
        userId: client2.id,
        managerId: manager2.id,
        vehicleId: vehiclesData[6].id,
        type: "mkad_day" as const,
        zone: "mkad" as const,
        status: "submitted" as const,
        price: 45000,
        discount: 5000,
        promoCode: "FIRST10",
        estimatedReadyDate: futureDate(3),
        createdAt: daysAgo(6),
      },
    ])
    .returning();

  console.log(`  Created ${ordersData.length} orders`);

  // ── Permits ────────────────────────────────────────────────────────────
  // Approved orders: indices 0, 1, 3, 10, 13
  const permitsData = await db
    .insert(schema.permits)
    .values([
      {
        orderId: ordersData[0].id,
        userId: client1.id,
        permitNumber: "МКАД-2026-001234",
        zone: "mkad" as const,
        type: "mkad_day" as const,
        validFrom: "2026-03-15",
        validUntil: "2027-03-14",
        status: "active" as const,
      },
      {
        orderId: ordersData[1].id,
        userId: client1.id,
        permitNumber: "МКАД-2026-001567",
        zone: "mkad" as const,
        type: "mkad_night" as const,
        validFrom: "2026-03-20",
        validUntil: "2027-03-19",
        status: "active" as const,
      },
      {
        orderId: ordersData[3].id,
        userId: client2.id,
        permitNumber: "МКАД-2025-009876",
        zone: "mkad" as const,
        type: "mkad_day" as const,
        validFrom: "2025-03-01",
        validUntil: "2026-02-28",
        status: "expired" as const,
      },
      {
        orderId: ordersData[10].id,
        userId: client2.id,
        permitNumber: "СК-2026-000345",
        zone: "sk" as const,
        type: "sk" as const,
        validFrom: "2026-03-10",
        validUntil: "2027-03-09",
        status: "active" as const,
      },
      {
        orderId: ordersData[13].id,
        userId: client1.id,
        permitNumber: "МКАД-2026-002100",
        zone: "mkad" as const,
        type: "temp" as const,
        validFrom: "2026-04-01",
        validUntil: "2026-04-10",
        status: "revoked" as const,
      },
    ])
    .returning();

  console.log(`  Created ${permitsData.length} permits`);

  // ── Documents ──────────────────────────────────────────────────────────
  const documentsData = await db
    .insert(schema.documents)
    .values([
      {
        userId: client1.id,
        vehicleId: vehiclesData[0].id,
        orderId: ordersData[0].id,
        type: "pts" as const,
        fileName: "pts_kamaz_65115.pdf",
        fileUrl: "https://s3.storage.selcloud.ru/infolog24-docs/pts_kamaz_65115.pdf",
        fileSize: 524288,
        mimeType: "application/pdf",
        status: "approved" as const,
      },
      {
        userId: client1.id,
        vehicleId: vehiclesData[0].id,
        orderId: ordersData[0].id,
        type: "sts" as const,
        fileName: "sts_kamaz_65115.pdf",
        fileUrl: "https://s3.storage.selcloud.ru/infolog24-docs/sts_kamaz_65115.pdf",
        fileSize: 412672,
        mimeType: "application/pdf",
        status: "approved" as const,
      },
      {
        userId: client1.id,
        orderId: ordersData[0].id,
        type: "driver_license" as const,
        fileName: "driver_license_petrov.jpg",
        fileUrl: "https://s3.storage.selcloud.ru/infolog24-docs/dl_petrov.jpg",
        fileSize: 1048576,
        mimeType: "image/jpeg",
        status: "approved" as const,
      },
      {
        userId: client1.id,
        vehicleId: vehiclesData[1].id,
        orderId: ordersData[1].id,
        type: "pts" as const,
        fileName: "pts_kamaz_5490.pdf",
        fileUrl: "https://s3.storage.selcloud.ru/infolog24-docs/pts_kamaz_5490.pdf",
        fileSize: 498000,
        mimeType: "application/pdf",
        status: "approved" as const,
      },
      {
        userId: client2.id,
        vehicleId: vehiclesData[3].id,
        orderId: ordersData[3].id,
        type: "pts" as const,
        fileName: "pts_volvo_fh460.pdf",
        fileUrl: "https://s3.storage.selcloud.ru/infolog24-docs/pts_volvo_fh460.pdf",
        fileSize: 536000,
        mimeType: "application/pdf",
        status: "approved" as const,
      },
      {
        userId: client2.id,
        vehicleId: vehiclesData[3].id,
        orderId: ordersData[3].id,
        type: "sts" as const,
        fileName: "sts_volvo_fh460.pdf",
        fileUrl: "https://s3.storage.selcloud.ru/infolog24-docs/sts_volvo_fh460.pdf",
        fileSize: 420000,
        mimeType: "application/pdf",
        status: "approved" as const,
      },
      {
        userId: client2.id,
        orderId: ordersData[6].id,
        type: "power_of_attorney" as const,
        fileName: "doverennost_kuznetsov.pdf",
        fileUrl: "https://s3.storage.selcloud.ru/infolog24-docs/doverennost_kuznetsov.pdf",
        fileSize: 312000,
        mimeType: "application/pdf",
        status: "pending" as const,
      },
      {
        userId: client1.id,
        vehicleId: vehiclesData[2].id,
        orderId: ordersData[2].id,
        type: "pts" as const,
        fileName: "pts_man_tgx.pdf",
        fileUrl: "https://s3.storage.selcloud.ru/infolog24-docs/pts_man_tgx.pdf",
        fileSize: 510000,
        mimeType: "application/pdf",
        status: "approved" as const,
      },
      {
        userId: client1.id,
        orderId: ordersData[2].id,
        type: "application" as const,
        fileName: "zayavlenie_ttk_man.pdf",
        fileUrl: "https://s3.storage.selcloud.ru/infolog24-docs/zayavlenie_ttk_man.pdf",
        fileSize: 256000,
        mimeType: "application/pdf",
        status: "pending" as const,
      },
      {
        userId: client2.id,
        vehicleId: vehiclesData[8].id,
        orderId: ordersData[8].id,
        type: "pts" as const,
        fileName: "pts_kamaz_54901.pdf",
        fileUrl: "https://s3.storage.selcloud.ru/infolog24-docs/pts_kamaz_54901.pdf",
        fileSize: 488000,
        mimeType: "application/pdf",
        status: "rejected" as const,
        rejectionReason: "Нечитаемый скан документа, загрузите повторно",
      },
    ])
    .returning();

  console.log(`  Created ${documentsData.length} documents`);

  // ── Notifications ──────────────────────────────────────────────────────
  const notificationsData = await db
    .insert(schema.notifications)
    .values([
      {
        userId: client1.id,
        type: "order_approved",
        channel: "email" as const,
        title: "Пропуск одобрен",
        body: "Ваш пропуск МКАД-2026-001234 для КАМАЗ 65115 (А123БВ777) одобрен и действителен с 15.03.2026.",
        status: "read" as const,
        sentAt: daysAgo(25),
        readAt: daysAgo(24),
      },
      {
        userId: client1.id,
        type: "documents_required",
        channel: "telegram" as const,
        title: "Требуются документы",
        body: "Для заказа ТТК на MAN TGX 18.500 необходимо загрузить заявление. Загрузите документ в личном кабинете.",
        status: "sent" as const,
        sentAt: daysAgo(9),
      },
      {
        userId: client2.id,
        type: "order_rejected",
        channel: "email" as const,
        title: "Заказ отклонён",
        body: "Заказ на пропуск МКАД для КАМАЗ 54901 отклонён. Причина: несоответствие данных ПТС. Свяжитесь с менеджером для уточнения.",
        status: "sent" as const,
        sentAt: daysAgo(18),
      },
      {
        userId: client2.id,
        type: "payment_reminder",
        channel: "sms" as const,
        title: "Напоминание об оплате",
        body: "Ожидается оплата по заказу СК для МАЗ 6430С9. Сумма: 90 000 руб.",
        status: "sent" as const,
        sentAt: daysAgo(6),
      },
      {
        userId: client1.id,
        type: "permit_expiring",
        channel: "email" as const,
        title: "Пропуск скоро истекает",
        body: "Временный пропуск МКАД-2026-002100 истекает 10.04.2026. Оформите продление заранее.",
        status: "pending" as const,
      },
    ])
    .returning();

  console.log(`  Created ${notificationsData.length} notifications`);

  // ── Promo Codes ────────────────────────────────────────────────────────
  const promoCodesData = await db
    .insert(schema.promoCodes)
    .values([
      {
        code: "FIRST10",
        discountType: "percent" as const,
        discountValue: 10,
        maxUses: 100,
        usedCount: 23,
        validFrom: "2026-01-01",
        validUntil: "2026-12-31",
        isActive: true,
      },
      {
        code: "PARTNER20",
        discountType: "fixed" as const,
        discountValue: 10000,
        maxUses: 50,
        usedCount: 7,
        validFrom: "2026-01-01",
        validUntil: "2026-06-30",
        isActive: true,
      },
      {
        code: "SUMMER2026",
        discountType: "percent" as const,
        discountValue: 15,
        maxUses: 200,
        usedCount: 0,
        validFrom: "2026-06-01",
        validUntil: "2026-08-31",
        isActive: false,
      },
    ])
    .returning();

  console.log(`  Created ${promoCodesData.length} promo codes`);

  // ── Audit Log ──────────────────────────────────────────────────────────
  const auditEntries = await db
    .insert(schema.auditLog)
    .values([
      {
        userId: admin.id,
        action: "user.create",
        entityType: "user",
        entityId: manager1.id,
        details: { role: "manager", email: "manager1@infolog24.ru" },
        ipAddress: "192.168.1.10",
        createdAt: daysAgo(60),
      },
      {
        userId: manager1.id,
        action: "order.status_change",
        entityType: "order",
        entityId: ordersData[0].id,
        details: { from: "processing", to: "approved" },
        ipAddress: "192.168.1.20",
        createdAt: daysAgo(28),
      },
      {
        userId: client1.id,
        action: "order.create",
        entityType: "order",
        entityId: ordersData[5].id,
        details: { type: "mkad_day", vehicle: "А123БВ777" },
        ipAddress: "85.140.23.45",
        createdAt: daysAgo(1),
      },
      {
        userId: manager2.id,
        action: "document.reject",
        entityType: "document",
        entityId: documentsData[9].id,
        details: { reason: "Нечитаемый скан документа" },
        ipAddress: "192.168.1.21",
        createdAt: daysAgo(19),
      },
      {
        userId: admin.id,
        action: "promo.create",
        entityType: "promo_code",
        entityId: promoCodesData[0].id,
        details: { code: "FIRST10", discountType: "percent", discountValue: 10 },
        ipAddress: "192.168.1.10",
        createdAt: daysAgo(90),
      },
      {
        userId: manager1.id,
        action: "order.assign",
        entityType: "order",
        entityId: ordersData[7].id,
        details: { managerId: manager1.id },
        ipAddress: "192.168.1.20",
        createdAt: daysAgo(5),
      },
      {
        userId: client2.id,
        action: "vehicle.create",
        entityType: "vehicle",
        entityId: vehiclesData[3].id,
        details: { brand: "Volvo", model: "FH 460", plate: "К012ЛМ799" },
        ipAddress: "176.59.100.12",
        createdAt: daysAgo(50),
      },
    ])
    .returning();

  console.log(`  Created ${auditEntries.length} audit log entries`);

  // ── Order Status History ───────────────────────────────────────────────
  await db.insert(schema.orderStatusHistory).values([
    {
      orderId: ordersData[0].id,
      fromStatus: null,
      toStatus: "draft",
      changedBy: client1.id,
      createdAt: daysAgo(30),
    },
    {
      orderId: ordersData[0].id,
      fromStatus: "draft",
      toStatus: "processing",
      changedBy: manager1.id,
      comment: "Документы приняты, начинаем оформление",
      createdAt: daysAgo(29),
    },
    {
      orderId: ordersData[0].id,
      fromStatus: "processing",
      toStatus: "submitted",
      changedBy: manager1.id,
      comment: "Заявка подана в ЦОДД",
      createdAt: daysAgo(27),
    },
    {
      orderId: ordersData[0].id,
      fromStatus: "submitted",
      toStatus: "approved",
      changedBy: manager1.id,
      comment: "Пропуск одобрен",
      createdAt: daysAgo(25),
    },
    {
      orderId: ordersData[8].id,
      fromStatus: null,
      toStatus: "draft",
      changedBy: client2.id,
      createdAt: daysAgo(20),
    },
    {
      orderId: ordersData[8].id,
      fromStatus: "draft",
      toStatus: "processing",
      changedBy: manager1.id,
      createdAt: daysAgo(19),
    },
    {
      orderId: ordersData[8].id,
      fromStatus: "processing",
      toStatus: "rejected",
      changedBy: manager1.id,
      comment: "Документы не прошли проверку — несоответствие данных ПТС",
      createdAt: daysAgo(18),
    },
  ]);

  console.log("  Created order status history entries");

  console.log("\nSeeding complete!");
  console.log("\nTest credentials:");
  console.log("  Admin:    admin@infolog24.ru / Password123!");
  console.log("  Manager:  manager1@infolog24.ru / Password123!");
  console.log("  Client:   client1@example.com / Password123!");

  await client.end();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
