import { relations } from "drizzle-orm";
import {
  pgTable,
  pgEnum,
  uuid,
  varchar,
  text,
  boolean,
  integer,
  timestamp,
  date,
  jsonb,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";

// ── Enums ──────────────────────────────────────────────────────────────────

export const userRoleEnum = pgEnum("user_role", [
  "client",
  "manager",
  "admin",
  "partner",
]);

export const ecoClassEnum = pgEnum("eco_class", [
  "euro0",
  "euro1",
  "euro2",
  "euro3",
  "euro4",
  "euro5",
  "euro6",
]);

export const orderTypeEnum = pgEnum("order_type", [
  "mkad_day",
  "mkad_night",
  "ttk",
  "sk",
  "temp",
]);

export const orderZoneEnum = pgEnum("order_zone", ["mkad", "ttk", "sk"]);

export const orderStatusEnum = pgEnum("order_status", [
  "draft",
  "documents_pending",
  "payment_pending",
  "processing",
  "submitted",
  "approved",
  "rejected",
  "cancelled",
]);

export const permitStatusEnum = pgEnum("permit_status", [
  "active",
  "expired",
  "revoked",
]);

export const documentTypeEnum = pgEnum("document_type", [
  "pts",
  "sts",
  "driver_license",
  "power_of_attorney",
  "application",
  "contract",
  "other",
]);

export const documentStatusEnum = pgEnum("document_status", [
  "pending",
  "approved",
  "rejected",
]);

export const paymentStatusEnum = pgEnum("payment_status", [
  "pending",
  "succeeded",
  "cancelled",
  "refunded",
]);

export const notificationChannelEnum = pgEnum("notification_channel", [
  "email",
  "sms",
  "telegram",
  "push",
]);

export const notificationStatusEnum = pgEnum("notification_status", [
  "pending",
  "sent",
  "failed",
  "read",
]);

export const chatSourceEnum = pgEnum("chat_source", ["web", "telegram"]);

export const chatStatusEnum = pgEnum("chat_status", ["active", "closed"]);

export const chatRoleEnum = pgEnum("chat_role", [
  "user",
  "assistant",
  "system",
]);

export const discountTypeEnum = pgEnum("discount_type", ["percent", "fixed"]);

export const referralStatusEnum = pgEnum("referral_status", [
  "pending",
  "confirmed",
  "paid",
]);

// ── Tables ─────────────────────────────────────────────────────────────────

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  name: varchar("name", { length: 255 }),
  phone: varchar("phone", { length: 20 }),
  company: varchar("company", { length: 255 }),
  inn: varchar("inn", { length: 12 }),
  ogrn: varchar("ogrn", { length: 15 }),
  role: userRoleEnum("role").notNull().default("client"),
  image: text("image"),
  // Персональный реферальный код клиента. Генерируется лениво —
  // при первом заходе на /dashboard/referral. UNIQUE, длина до 12 символов.
  referralCode: varchar("referral_code", { length: 12 }).unique(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
}, (table) => [
  index("idx_users_phone").on(table.phone),
  index("idx_users_referral_code").on(table.referralCode),
]);

export const sessions = pgTable("sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  token: varchar("token", { length: 255 }).notNull().unique(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  ipAddress: varchar("ip_address", { length: 45 }),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const accounts = pgTable("accounts", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  accountId: varchar("account_id", { length: 255 }).notNull(),
  providerId: varchar("provider_id", { length: 255 }).notNull(),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at", {
    withTimezone: true,
  }),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at", {
    withTimezone: true,
  }),
  scope: text("scope"),
  idToken: text("id_token"),
  password: text("password"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const verifications = pgTable("verifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  identifier: varchar("identifier", { length: 255 }).notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const twoFactors = pgTable("two_factors", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  secret: text("secret").notNull(),
  backupCodes: text("backup_codes").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const vehicles = pgTable("vehicles", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  brand: varchar("brand", { length: 100 }).notNull(),
  model: varchar("model", { length: 100 }).notNull(),
  licensePlate: varchar("license_plate", { length: 20 }).notNull(),
  vin: varchar("vin", { length: 17 }),
  year: integer("year"),
  ecoClass: ecoClassEnum("eco_class"),
  maxWeight: integer("max_weight"),
  category: varchar("category", { length: 50 }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const orders = pgTable("orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
  managerId: uuid("manager_id").references(() => users.id),
  vehicleId: uuid("vehicle_id")
    .notNull()
    .references(() => vehicles.id),
  type: orderTypeEnum("type").notNull(),
  zone: orderZoneEnum("zone").notNull(),
  status: orderStatusEnum("status").notNull().default("draft"),
  price: integer("price").notNull(),
  promoCode: varchar("promo_code", { length: 50 }),
  discount: integer("discount").notNull().default(0),
  estimatedReadyDate: date("estimated_ready_date"),
  notes: text("notes"),
  tags: text("tags").array(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
}, (table) => [
  index("idx_orders_user_id").on(table.userId),
  index("idx_orders_status").on(table.status),
  index("idx_orders_created_at").on(table.createdAt),
  index("idx_orders_user_status").on(table.userId, table.status),
]);

export const permits = pgTable("permits", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: uuid("order_id")
    .notNull()
    .references(() => orders.id),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
  permitNumber: varchar("permit_number", { length: 100 }).notNull(),
  zone: orderZoneEnum("zone").notNull(),
  type: orderTypeEnum("type").notNull(),
  validFrom: date("valid_from").notNull(),
  validUntil: date("valid_until").notNull(),
  status: permitStatusEnum("status").notNull().default("active"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
}, (table) => [
  index("idx_permits_order_id").on(table.orderId),
  index("idx_permits_user_id").on(table.userId),
  index("idx_permits_status").on(table.status),
  index("idx_permits_valid_until").on(table.validUntil),
]);

export const documents = pgTable("documents", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: uuid("order_id").references(() => orders.id),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
  vehicleId: uuid("vehicle_id").references(() => vehicles.id),
  type: documentTypeEnum("type").notNull(),
  fileName: varchar("file_name", { length: 255 }).notNull(),
  fileUrl: text("file_url").notNull(),
  fileSize: integer("file_size").notNull(),
  mimeType: varchar("mime_type", { length: 100 }).notNull(),
  status: documentStatusEnum("status").notNull().default("pending"),
  rejectionReason: text("rejection_reason"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
}, (table) => [
  index("idx_documents_order_id").on(table.orderId),
  index("idx_documents_user_id").on(table.userId),
]);

export const payments = pgTable("payments", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: uuid("order_id")
    .notNull()
    .references(() => orders.id),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
  amount: integer("amount").notNull(),
  currency: varchar("currency", { length: 3 }).notNull().default("RUB"),
  status: paymentStatusEnum("status").notNull().default("pending"),
  provider: varchar("provider", { length: 50 }).notNull().default("yookassa"),
  externalId: varchar("external_id", { length: 255 }),
  paidAt: timestamp("paid_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
}, (table) => [
  index("idx_payments_order_id").on(table.orderId),
  index("idx_payments_user_id").on(table.userId),
  index("idx_payments_status").on(table.status),
  uniqueIndex("idx_payments_external_id").on(table.externalId),
]);

export const notifications = pgTable("notifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
  type: varchar("type", { length: 100 }).notNull(),
  channel: notificationChannelEnum("channel").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  body: text("body").notNull(),
  status: notificationStatusEnum("status").notNull().default("pending"),
  sentAt: timestamp("sent_at", { withTimezone: true }),
  readAt: timestamp("read_at", { withTimezone: true }),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
}, (table) => [
  index("idx_notifications_user_id").on(table.userId),
  index("idx_notifications_status").on(table.status),
  index("idx_notifications_user_read").on(table.userId, table.readAt),
]);

export const notificationTemplates = pgTable("notification_templates", {
  id: uuid("id").primaryKey().defaultRandom(),
  event: varchar("event", { length: 100 }).notNull().unique(),
  titleTemplate: text("title_template").notNull(),
  bodyTemplate: text("body_template").notNull(),
  channels: text("channels").array().notNull(),
  isActive: boolean("is_active").notNull().default(true),
});

export const orderStatusHistory = pgTable("order_status_history", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: uuid("order_id")
    .notNull()
    .references(() => orders.id),
  fromStatus: varchar("from_status", { length: 50 }),
  toStatus: varchar("to_status", { length: 50 }).notNull(),
  changedBy: uuid("changed_by")
    .notNull()
    .references(() => users.id),
  comment: text("comment"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const chatConversations = pgTable("chat_conversations", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id),
  source: chatSourceEnum("source").notNull(),
  telegramChatId: varchar("telegram_chat_id", { length: 100 }),
  status: chatStatusEnum("status").notNull().default("active"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
}, (table) => [
  index("idx_chat_conversations_user_id").on(table.userId),
]);

/**
 * Integration outbox — асинхронная доставка событий во внешние системы
 * (Bitrix24, email, будущая собственная CRM, MAX/Telegram-бот менеджеров).
 *
 * Принцип: при создании заявки/документа/etc. бизнес-код пишет событие
 * сюда (в той же транзакции, что и основное действие). Cron-воркер
 * читает pending события и доставляет их в нужные каналы. При сбое —
 * exponential backoff retry. После max_attempts — статус 'dead' + алерт.
 *
 * Это гарантирует:
 *   1. Создание заявки никогда не блокируется недоступностью CRM.
 *   2. События не теряются — даже если Bitrix лежит сутки, после
 *      восстановления retry доставит всё, что накопилось.
 *   3. Идемпотентность — уникальный индекс по (event_type, payload->orderId, channel)
 *      не позволит создать дубль для одного и того же события.
 *
 * Подключение нового канала = новый адаптер + строка в EVENT_CHANNELS
 * registry. Бизнес-код менять не надо.
 */
export const integrationOutbox = pgTable(
  "integration_outbox",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    eventType: varchar("event_type", { length: 100 }).notNull(),
    payload: jsonb("payload").notNull(),
    channel: varchar("channel", { length: 50 }).notNull(),
    status: varchar("status", { length: 20 }).notNull().default("pending"),
    attempts: integer("attempts").notNull().default(0),
    maxAttempts: integer("max_attempts").notNull().default(5),
    nextRetryAt: timestamp("next_retry_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    lastError: text("last_error"),
    deliveredAt: timestamp("delivered_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("idx_outbox_pending").on(table.status, table.nextRetryAt),
    index("idx_outbox_event_type").on(table.eventType),
  ],
);

/**
 * P5 — Vector RAG для базы знаний AI-помощника.
 *
 * Хранит embedding каждого пункта knowledge-base.ts (или его чанков).
 * Поле embedding — pgvector тип. Drizzle не имеет встроенного типа,
 * используем кастомный тип через customType — он сериализуется как
 * строка PostgreSQL вида '[0.1,0.2,...]'.
 *
 * Таблица создаётся миграцией 0003_p5_knowledge_chunks.sql, которая:
 *   1. CREATE EXTENSION IF NOT EXISTS vector
 *   2. CREATE TABLE knowledge_chunks (...)
 *   3. CREATE INDEX ON knowledge_chunks USING ivfflat (embedding vector_cosine_ops)
 *
 * Применять миграцию должен суперюзер БД (для CREATE EXTENSION).
 * Без таблицы код fallback'ит на keyword scoring без ошибок.
 */
import { customType } from "drizzle-orm/pg-core";

const vector = customType<{ data: number[]; driverData: string }>({
  dataType() {
    return "vector(1536)";
  },
  toDriver(value: number[]): string {
    return `[${value.join(",")}]`;
  },
  fromDriver(value: string): number[] {
    return value
      .replace(/^\[|\]$/g, "")
      .split(",")
      .map((s) => Number(s.trim()))
      .filter((n) => Number.isFinite(n));
  },
});

export const knowledgeChunks = pgTable(
  "knowledge_chunks",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    sourceId: varchar("source_id", { length: 64 }).notNull(),
    chunkIndex: integer("chunk_index").notNull().default(0),
    content: text("content").notNull(),
    embedding: vector("embedding").notNull(),
    metadata: jsonb("metadata"),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("idx_knowledge_chunks_source_chunk").on(
      table.sourceId,
      table.chunkIndex,
    ),
  ],
);

/**
 * P3.2 — Memory across sessions для AI-помощника.
 * Простое key-value хранилище фактов о клиенте, которые ассистент
 * запомнил в одной сессии и хочет использовать в будущих.
 *
 * Примеры фактов:
 *  - "preferred_zone" → "ttk"
 *  - "fleet_size_actual" → "27"
 *  - "lessor" → "Газпромбанк Лизинг"
 *  - "preferred_contact_time" → "после 18:00"
 *
 * Один user может иметь много фактов, но (userId, key) уникален —
 * новое значение перетирает старое.
 */
export const clientFacts = pgTable(
  "client_facts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    key: varchar("key", { length: 100 }).notNull(),
    value: text("value").notNull(),
    source: varchar("source", { length: 50 }).notNull().default("ai_chat"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    uniqueIndex("idx_client_facts_user_key").on(table.userId, table.key),
  ],
);

/**
 * P2.5 — Manual override менеджером.
 * Когда строка с ended_at IS NULL существует для conversationId, ассистент
 * не отвечает в этом разговоре — управление перехвачено живым менеджером.
 * Деактивация = установка ended_at в текущий момент.
 */
export const chatHandovers = pgTable("chat_handovers", {
  id: uuid("id").primaryKey().defaultRandom(),
  conversationId: uuid("conversation_id")
    .notNull()
    .references(() => chatConversations.id, { onDelete: "cascade" }),
  managerId: uuid("manager_id")
    .notNull()
    .references(() => users.id),
  reason: text("reason"),
  startedAt: timestamp("started_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  endedAt: timestamp("ended_at", { withTimezone: true }),
}, (table) => [
  index("idx_chat_handovers_conversation_active").on(
    table.conversationId,
    table.endedAt,
  ),
]);

export const chatMessages = pgTable("chat_messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  conversationId: uuid("conversation_id")
    .notNull()
    .references(() => chatConversations.id, { onDelete: "cascade" }),
  role: chatRoleEnum("role").notNull(),
  content: text("content").notNull(),
  toolCalls: jsonb("tool_calls"),
  tokenCount: integer("token_count"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
}, (table) => [
  index("idx_chat_messages_conversation_id").on(table.conversationId),
]);

export const chatFeedbackRatingEnum = pgEnum("chat_feedback_rating", [
  "up",
  "down",
]);

export const chatFeedback = pgTable("chat_feedback", {
  id: uuid("id").primaryKey().defaultRandom(),
  conversationId: uuid("conversation_id").references(
    () => chatConversations.id,
    { onDelete: "cascade" },
  ),
  messageId: varchar("message_id", { length: 128 }).notNull(),
  rating: chatFeedbackRatingEnum("rating").notNull(),
  userId: uuid("user_id").references(() => users.id),
  ip: varchar("ip", { length: 45 }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
}, (table) => [
  index("idx_chat_feedback_message_id").on(table.messageId),
]);

export const chatAnalytics = pgTable("chat_analytics", {
  id: uuid("id").primaryKey().defaultRandom(),
  conversationId: uuid("conversation_id").references(
    () => chatConversations.id,
    { onDelete: "cascade" },
  ),
  userId: uuid("user_id").references(() => users.id),
  /** Последний вопрос пользователя (обрезан до 500 символов) */
  userQuestion: varchar("user_question", { length: 500 }),
  /** Модель AI (claude-sonnet-4-6, gpt-4o-mini) */
  provider: varchar("provider", { length: 32 }),
  /** Вызванные tools через запятую (searchKnowledge, getPriceCalculation, ...) */
  toolsCalled: varchar("tools_called", { length: 500 }),
  /** Был ли fallback (searchKnowledge не нашёл совпадений) */
  kbFallback: boolean("kb_fallback").default(false),
  /** Конверсия: привело ли к createOrderDraft или requestCallback */
  convertedTo: varchar("converted_to", { length: 32 }),
  inputTokens: integer("input_tokens"),
  outputTokens: integer("output_tokens"),
  costUsd: varchar("cost_usd", { length: 16 }),
  ip: varchar("ip", { length: 45 }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
}, (table) => [
  index("idx_chat_analytics_created_at").on(table.createdAt),
  index("idx_chat_analytics_conversation_id").on(table.conversationId),
]);

export const promoCodes = pgTable("promo_codes", {
  id: uuid("id").primaryKey().defaultRandom(),
  code: varchar("code", { length: 50 }).notNull().unique(),
  discountType: discountTypeEnum("discount_type").notNull(),
  discountValue: integer("discount_value").notNull(),
  maxUses: integer("max_uses"),
  usedCount: integer("used_count").notNull().default(0),
  validFrom: date("valid_from").notNull(),
  validUntil: date("valid_until"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const partnerReferrals = pgTable("partner_referrals", {
  id: uuid("id").primaryKey().defaultRandom(),
  partnerId: uuid("partner_id")
    .notNull()
    .references(() => users.id),
  referredUserId: uuid("referred_user_id").references(() => users.id),
  referralCode: varchar("referral_code", { length: 50 }).notNull(),
  orderId: uuid("order_id").references(() => orders.id),
  commission: integer("commission"),
  status: referralStatusEnum("status").notNull().default("pending"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const auditLog = pgTable("audit_log", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
  action: varchar("action", { length: 100 }).notNull(),
  entityType: varchar("entity_type", { length: 100 }).notNull(),
  entityId: varchar("entity_id", { length: 100 }).notNull(),
  details: jsonb("details"),
  ipAddress: varchar("ip_address", { length: 45 }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
}, (table) => [
  index("idx_audit_entity").on(table.entityType, table.entityId),
  index("idx_audit_user").on(table.userId),
  index("idx_audit_created").on(table.createdAt),
]);

// ── Relations ──────────────────────────────────────────────────────────────

export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
  accounts: many(accounts),
  vehicles: many(vehicles),
  orders: many(orders, { relationName: "userOrders" }),
  managedOrders: many(orders, { relationName: "managerOrders" }),
  documents: many(documents),
  payments: many(payments),
  notifications: many(notifications),
  permits: many(permits),
  chatConversations: many(chatConversations),
  auditLogs: many(auditLog),
  partnerReferrals: many(partnerReferrals, { relationName: "partnerReferrals" }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const vehiclesRelations = relations(vehicles, ({ one, many }) => ({
  user: one(users, { fields: [vehicles.userId], references: [users.id] }),
  orders: many(orders),
  documents: many(documents),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
    relationName: "userOrders",
  }),
  manager: one(users, {
    fields: [orders.managerId],
    references: [users.id],
    relationName: "managerOrders",
  }),
  vehicle: one(vehicles, {
    fields: [orders.vehicleId],
    references: [vehicles.id],
  }),
  permits: many(permits),
  documents: many(documents),
  payments: many(payments),
  statusHistory: many(orderStatusHistory),
}));

export const permitsRelations = relations(permits, ({ one }) => ({
  order: one(orders, { fields: [permits.orderId], references: [orders.id] }),
  user: one(users, { fields: [permits.userId], references: [users.id] }),
}));

export const documentsRelations = relations(documents, ({ one }) => ({
  order: one(orders, { fields: [documents.orderId], references: [orders.id] }),
  user: one(users, { fields: [documents.userId], references: [users.id] }),
  vehicle: one(vehicles, {
    fields: [documents.vehicleId],
    references: [vehicles.id],
  }),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  order: one(orders, { fields: [payments.orderId], references: [orders.id] }),
  user: one(users, { fields: [payments.userId], references: [users.id] }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
}));

export const orderStatusHistoryRelations = relations(
  orderStatusHistory,
  ({ one }) => ({
    order: one(orders, {
      fields: [orderStatusHistory.orderId],
      references: [orders.id],
    }),
    changedByUser: one(users, {
      fields: [orderStatusHistory.changedBy],
      references: [users.id],
    }),
  }),
);

export const chatConversationsRelations = relations(
  chatConversations,
  ({ one, many }) => ({
    user: one(users, {
      fields: [chatConversations.userId],
      references: [users.id],
    }),
    messages: many(chatMessages),
  }),
);

export const chatMessagesRelations = relations(chatMessages, ({ one }) => ({
  conversation: one(chatConversations, {
    fields: [chatMessages.conversationId],
    references: [chatConversations.id],
  }),
}));

export const promoCodesRelations = relations(promoCodes, () => ({}));

export const partnerReferralsRelations = relations(
  partnerReferrals,
  ({ one }) => ({
    partner: one(users, {
      fields: [partnerReferrals.partnerId],
      references: [users.id],
      relationName: "partnerReferrals",
    }),
    referredUser: one(users, {
      fields: [partnerReferrals.referredUserId],
      references: [users.id],
    }),
    order: one(orders, {
      fields: [partnerReferrals.orderId],
      references: [orders.id],
    }),
  }),
);

export const auditLogRelations = relations(auditLog, ({ one }) => ({
  user: one(users, { fields: [auditLog.userId], references: [users.id] }),
}));
