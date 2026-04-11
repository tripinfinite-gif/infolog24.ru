import { tool } from "ai";
import { and, asc, desc, eq, gte, lte, or } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/lib/db";
import {
  documents,
  orders,
  permits,
  users,
  vehicles,
} from "@/lib/db/schema";
import { calculatePrice, pricingTiers } from "@/content/pricing";
import { serviceZones } from "@/content/services";
import {
  knowledgeBase,
  knowledgeCategories,
  type KnowledgeItem,
} from "@/content/knowledge-base";
import { loadCabinetSummary } from "./cabinet-summary";
import { logger } from "@/lib/logger";

export type ChatUserContext = {
  userId: string | null;
};

const zoneLabels: Record<string, string> = {
  mkad: "МКАД",
  ttk: "ТТК",
  sk: "Садовое кольцо",
};

const typeLabels: Record<string, string> = {
  annual_day: "Годовой (дневной)",
  annual_night: "Годовой (ночной)",
  temporary: "Временный (до 5 суток)",
};

const typeToOrderType: Record<
  "annual_day" | "annual_night" | "temporary",
  "mkad_day" | "mkad_night" | "ttk" | "sk" | "temp"
> = {
  annual_day: "mkad_day",
  annual_night: "mkad_night",
  temporary: "temp",
};

function resolveBasePrice(
  zone: "mkad" | "ttk" | "sk",
  type: "annual_day" | "annual_night" | "temporary",
): number {
  if (type === "temporary") {
    return pricingTiers.find((t) => t.type === "temp")?.price ?? 3500;
  }
  return (
    pricingTiers.find((t) => t.zone === zone && t.type === "annual")?.price ??
    12000
  );
}

// =====================================================================
// KNOWLEDGE-BASE SEARCH (weighted keyword scoring)
// =====================================================================
//
// Базовый поиск без эмбеддингов: токенизируем запрос, считаем взвешенный
// скор по полям question / aliases / tags / short / detail. Этого достаточно,
// чтобы покрыть 90% типовых вопросов до перехода на pgvector RAG (см. план
// 2026-04-11-личный-кабинет-v2-реестры-и-ai-агент.md § 5.7).

const STOP_WORDS = new Set([
  "что", "как", "где", "когда", "кто", "почему", "зачем",
  "это", "тот", "так", "там", "вот",
  "для", "при", "над", "под", "без", "про", "или", "и",
  "не", "ни", "же", "ли", "бы", "уж",
  "мой", "моя", "моё", "мои",
  "ваш", "ваша", "ваше", "ваши",
  "я", "ты", "он", "она", "мы", "вы", "они",
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[^\p{L}\p{N}]+/u)
    .filter((t) => t.length >= 3 && !STOP_WORDS.has(t));
}

function scoreKnowledgeItem(
  item: KnowledgeItem,
  queryTokens: string[],
): number {
  if (queryTokens.length === 0) return 0;

  const questionLower = item.question.toLowerCase();
  const aliasesText = item.aliases.join(" ").toLowerCase();
  const tagsText = item.tags.join(" ").toLowerCase();
  const shortLower = item.short.toLowerCase();
  const detailLower = item.detail.toLowerCase();

  let score = 0;
  for (const token of queryTokens) {
    // Exact alias hit — самый сильный сигнал, так и было задумано
    if (aliasesText.includes(token)) score += 6;
    // Совпадение по тегу — высокий сигнал
    if (tagsText.includes(token)) score += 4;
    // Совпадение в основной формулировке вопроса
    if (questionLower.includes(token)) score += 3;
    // Совпадение в коротком ответе
    if (shortLower.includes(token)) score += 2;
    // Совпадение в развёрнутом ответе — слабый сигнал
    if (detailLower.includes(token)) score += 1;
  }
  return score;
}

function searchKnowledge(
  query: string,
  limit = 3,
): Array<{ item: KnowledgeItem; score: number }> {
  const tokens = tokenize(query);
  if (tokens.length === 0) return [];

  return knowledgeBase
    .map((item) => ({ item, score: scoreKnowledgeItem(item, tokens) }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

// =====================================================================
// CABINET TOOLS — все запросы строго scoped по userId из сессии
// =====================================================================

function formatDateOrNull(d: Date | string | null | undefined): string | null {
  if (!d) return null;
  const date = typeof d === "string" ? new Date(d) : d;
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString().slice(0, 10);
}

function daysUntil(target: Date | string): number {
  const t = typeof target === "string" ? new Date(target) : target;
  return Math.ceil((t.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
}

/**
 * Chat tools factory. Returns a fresh bag of tools bound to the current
 * user context (authenticated userId when available).
 */
export function createChatTools({ userId }: ChatUserContext) {
  return {
    // ================================================================
    // PUBLIC TOOLS — доступны и анонимам, и авторизованным
    // ================================================================

    getPriceCalculation: tool({
      description:
        "Рассчитать точную стоимость оформления пропуска по зоне, типу и количеству транспортных средств. Возвращает итоговую цену с учётом скидок за объём.",
      inputSchema: z.object({
        zone: z
          .enum(["mkad", "ttk", "sk"])
          .describe("Зона: mkad, ttk или sk (Садовое кольцо)"),
        type: z
          .enum(["annual_day", "annual_night", "temporary"])
          .describe(
            "Тип пропуска: annual_day (годовой дневной), annual_night (годовой ночной), temporary (временный до 5 суток)",
          ),
        vehicleCount: z
          .number()
          .int()
          .min(1)
          .max(500)
          .describe("Количество транспортных средств"),
      }),
      execute: async ({ zone, type, vehicleCount }) => {
        const basePrice = resolveBasePrice(zone, type);
        const total = calculatePrice(basePrice, vehicleCount);
        const discountPercent =
          vehicleCount >= 11
            ? 15
            : vehicleCount >= 6
              ? 10
              : vehicleCount >= 2
                ? 5
                : 0;

        return {
          zone: zoneLabels[zone],
          type: typeLabels[type],
          vehicleCount,
          basePrice,
          pricePerVehicle: Math.round(total / vehicleCount),
          total,
          discountPercent,
          note:
            type === "temporary"
              ? "Временный пропуск бесплатно при заказе годового."
              : "В цену включён бесплатный временный пропуск на время оформления.",
        };
      },
    }),

    checkPermitStatus: tool({
      description:
        "Проверить статус заявки пользователя по её номеру или по номеру телефона, указанному при регистрации.",
      inputSchema: z
        .object({
          orderNumber: z
            .string()
            .optional()
            .describe("UUID или короткий идентификатор заявки"),
          phone: z
            .string()
            .optional()
            .describe("Номер телефона, указанный клиентом"),
        })
        .refine(
          (data) => Boolean(data.orderNumber ?? data.phone),
          "Укажите номер заявки или телефон",
        ),
      execute: async ({ orderNumber, phone }) => {
        try {
          const conditions = [];
          if (orderNumber) {
            const isUuid = /^[0-9a-f-]{36}$/i.test(orderNumber);
            if (isUuid) conditions.push(eq(orders.id, orderNumber));
          }
          if (phone) {
            const matchingUser = await db.query.users.findFirst({
              where: eq(users.phone, phone),
            });
            if (matchingUser) conditions.push(eq(orders.userId, matchingUser.id));
          }

          if (conditions.length === 0) {
            return {
              found: false as const,
              message:
                "Не удалось найти заявку по указанным данным. Проверьте номер или свяжитесь с менеджером.",
            };
          }

          const found = await db.query.orders.findFirst({
            where: conditions.length === 1 ? conditions[0] : or(...conditions),
          });

          if (!found) {
            return {
              found: false as const,
              message:
                "Заявка не найдена. Возможно, номер введён с ошибкой. Свяжитесь с менеджером: +7 (499) 110-55-49.",
            };
          }

          return {
            found: true as const,
            orderId: found.id,
            status: found.status,
            zone: zoneLabels[found.zone] ?? found.zone,
            createdAt: found.createdAt.toISOString(),
            estimatedReadyDate: found.estimatedReadyDate ?? null,
          };
        } catch (error) {
          logger.warn({ error }, "checkPermitStatus failed");
          return {
            found: false as const,
            message:
              "Сейчас не удаётся получить статус заявки. Попробуйте ещё раз или свяжитесь с менеджером.",
          };
        }
      },
    }),

    createOrderDraft: tool({
      description:
        "Создать черновик заявки на оформление пропуска. Доступно только авторизованным пользователям.",
      inputSchema: z.object({
        zone: z.enum(["mkad", "ttk", "sk"]),
        type: z.enum(["annual_day", "annual_night", "temporary"]),
        vehicleId: z
          .string()
          .uuid()
          .describe("UUID транспортного средства из личного кабинета"),
        vehicleCount: z.number().int().min(1).default(1),
        notes: z.string().max(1000).optional(),
      }),
      execute: async ({ zone, type, vehicleId, vehicleCount, notes }) => {
        if (!userId) {
          return {
            success: false as const,
            error:
              "Чтобы создать заявку, нужно авторизоваться в личном кабинете: infolog24.ru/login",
          };
        }

        try {
          const basePrice = resolveBasePrice(zone, type);
          const price = calculatePrice(basePrice, vehicleCount);
          const discountPercent =
            vehicleCount >= 11 ? 15 : vehicleCount >= 6 ? 10 : vehicleCount >= 2 ? 5 : 0;

          const [order] = await db
            .insert(orders)
            .values({
              userId,
              vehicleId,
              zone,
              type: typeToOrderType[type],
              price,
              discount: discountPercent,
              status: "draft",
              notes: notes ?? null,
            })
            .returning();

          if (!order) throw new Error("Failed to insert order");

          logger.info(
            { orderId: order.id, userId, source: "chat_tool" },
            "Order draft created from chat",
          );

          return {
            success: true as const,
            orderId: order.id,
            price,
            nextSteps: [
              "Загрузите документы в личном кабинете",
              "Оплатите заявку через СБП или карту",
              "Мы подадим заявку в Дептранс в течение рабочего дня",
            ],
          };
        } catch (error) {
          logger.error({ error, userId }, "createOrderDraft failed");
          return {
            success: false as const,
            error:
              "Не удалось создать заявку. Проверьте, что указан корректный ID транспортного средства, или свяжитесь с менеджером.",
          };
        }
      },
    }),

    requestCallback: tool({
      description:
        "Оставить заявку на обратный звонок менеджера. Создаёт лид в системе.",
      inputSchema: z.object({
        name: z.string().min(1).max(100).describe("Имя клиента"),
        phone: z
          .string()
          .min(6)
          .max(20)
          .describe("Номер телефона, по которому можно перезвонить"),
        comment: z
          .string()
          .max(500)
          .optional()
          .describe("Пояснения клиента: что нужно, удобное время и т.д."),
      }),
      execute: async ({ name, phone, comment }) => {
        try {
          const baseUrl =
            process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
          const response = await fetch(`${baseUrl}/api/contacts`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name,
              phone,
              message: comment,
              source: "ai_chat",
            }),
          });
          const data = (await response.json().catch(() => null)) as
            | { success?: boolean; message?: string }
            | null;

          if (!response.ok || !data?.success) {
            logger.warn({ status: response.status }, "requestCallback HTTP error");
            return {
              success: false as const,
              message:
                "Не удалось оставить заявку автоматически. Пожалуйста, позвоните нам: +7 (499) 110-55-49.",
            };
          }

          return {
            success: true as const,
            message: `Спасибо, ${name}! Менеджер перезвонит в ближайшее время по номеру ${phone}.`,
          };
        } catch (error) {
          logger.error({ error }, "requestCallback tool failed");
          return {
            success: false as const,
            message:
              "Не удалось оставить заявку. Пожалуйста, свяжитесь с нами напрямую: +7 (499) 110-55-49.",
          };
        }
      },
    }),

    getServiceInfo: tool({
      description:
        "Получить полное описание услуги (пропуска) по slug: propusk-mkad, propusk-ttk, propusk-sk, vremennyj-propusk.",
      inputSchema: z.object({
        serviceSlug: z
          .string()
          .describe("Slug услуги, например propusk-mkad или vremennyj-propusk"),
      }),
      execute: async ({ serviceSlug }) => {
        const zone = serviceZones.find(
          (z) => z.slug === serviceSlug || z.id === serviceSlug,
        );
        if (!zone) {
          return {
            found: false as const,
            availableSlugs: serviceZones.map((z) => z.slug),
          };
        }
        return {
          found: true as const,
          name: zone.fullName,
          price: zone.priceLabel,
          processingDays: zone.processingDays,
          description: zone.zoneDescription,
          features: zone.features,
          documents: zone.documents,
          requirements: zone.requirements,
        };
      },
    }),

    // ================================================================
    // KNOWLEDGE BASE — short answer + on-demand detail
    // ================================================================

    searchKnowledge: tool({
      description:
        "Главный инструмент: ищет ответ во внутренней базе знаний (130+ статей по пропускам, грузовому каркасу, штрафам, ГосЛогу, ЭТрН, УКЭП, РНИС, экоклассу, отказам и др.). " +
        "По умолчанию возвращает КОРОТКИЕ ответы (1-3 предложения). " +
        "Если пользователь просит подробнее («расскажи детали», «а почему», «что именно делать») — вызови отдельно getKnowledgeDetail с id найденного пункта. " +
        "Используй ВСЕГДА, когда вопрос относится к нашей тематике, ДО того как сочинять ответ из общих знаний.",
      inputSchema: z.object({
        query: z
          .string()
          .min(3)
          .describe("Вопрос пользователя или ключевые слова"),
        category: z
          .string()
          .optional()
          .describe(
            "Опциональный фильтр по категории (pass-basics, cargo-framework, zones, documents, process, pricing, fines, goslog, etrn, ukep, rnis, eco, rejection, lifecycle, edge-cases, trust, support, cabinet)",
          ),
      }),
      execute: async ({ query, category }) => {
        let results = searchKnowledge(query, 3);

        if (category) {
          results = results.filter((r) => r.item.category === category);
        }

        if (results.length === 0) {
          return {
            matches: [] as Array<{
              id: string;
              category: string;
              question: string;
              short: string;
              hasDetail: boolean;
            }>,
            message:
              "По вашему вопросу ничего не найдено в базе знаний. Попробуйте переформулировать или свяжитесь с менеджером.",
            availableCategories: knowledgeCategories.map((c) => ({
              id: c.id,
              label: c.label,
            })),
          };
        }

        return {
          matches: results.map(({ item, score }) => ({
            id: item.id,
            category: item.category,
            question: item.question,
            short: item.short,
            hasDetail: item.detail.length > item.short.length,
            score,
          })),
          hint:
            "Если пользователь захочет подробнее — вызови getKnowledgeDetail с id одного из этих пунктов.",
        };
      },
    }),

    getKnowledgeDetail: tool({
      description:
        "Получить расширенный (подробный) ответ для одного пункта базы знаний по его id. Используй, когда пользователь явно просит детали, объяснение «почему», конкретные шаги, или когда тема сложная (правовая, многошаговая).",
      inputSchema: z.object({
        id: z.string().describe("id пункта из searchKnowledge, например kb-095"),
      }),
      execute: async ({ id }) => {
        const item = knowledgeBase.find((i) => i.id === id);
        if (!item) {
          return {
            found: false as const,
            message: `Пункт ${id} не найден в базе знаний.`,
          };
        }
        return {
          found: true as const,
          id: item.id,
          category: item.category,
          question: item.question,
          short: item.short,
          detail: item.detail,
          related: item.related ?? [],
          tags: item.tags,
          updated: item.updated,
        };
      },
    }),

    /** Backwards-compatible alias of searchKnowledge for legacy callers. */
    getFaqAnswer: tool({
      description:
        "[LEGACY] Алиас для searchKnowledge. Используй searchKnowledge напрямую.",
      inputSchema: z.object({
        question: z.string().min(3).describe("Вопрос пользователя"),
      }),
      execute: async ({ question }) => {
        const results = searchKnowledge(question, 3);
        if (results.length === 0) {
          return {
            matches: [] as const,
            message:
              "По вашему вопросу ничего не найдено в базе знаний. Попробуйте переформулировать или свяжитесь с менеджером.",
          };
        }
        return {
          matches: results.map(({ item }) => ({
            id: item.id,
            category: item.category,
            question: item.question,
            answer: item.short,
          })),
        };
      },
    }),

    // ================================================================
    // CABINET TOOLS — только для авторизованных, scoped to userId
    // ================================================================
    //
    // Правило безопасности: каждый запрос ОБЯЗАТЕЛЬНО содержит
    // условие eq(table.userId, userId). Если userId === null —
    // возвращаем заглушку «нужна авторизация». Никогда не возвращаем
    // данные других клиентов, даже если модель попытается передать
    // чужой userId — параметра userId в инструментах нет вовсе.

    getMyContext: tool({
      description:
        "Получить краткую сводку по личному кабинету авторизованного клиента: имя, компания, количество ТС, активные заявки, ближайшие сроки окончания пропусков. ВСЕГДА вызывай этот инструмент в начале диалога с авторизованным пользователем — он даёт контекст для персонализированных ответов.",
      inputSchema: z.object({}),
      execute: async () => loadCabinetSummary(userId),
    }),

    getMyVehicles: tool({
      description:
        "Получить список грузовиков авторизованного клиента из личного кабинета. Для авторизованных пользователей.",
      inputSchema: z.object({
        plate: z
          .string()
          .optional()
          .describe(
            "Опционально: фильтр по госномеру (точное или частичное совпадение)",
          ),
      }),
      execute: async ({ plate }) => {
        if (!userId) {
          return {
            authenticated: false as const,
            message: "Нужна авторизация в личном кабинете.",
          };
        }

        try {
          const list = await db.query.vehicles.findMany({
            where: eq(vehicles.userId, userId),
            limit: 100,
          });

          const filtered = plate
            ? list.filter((v) =>
                v.licensePlate.toLowerCase().includes(plate.toLowerCase()),
              )
            : list;

          return {
            authenticated: true as const,
            count: filtered.length,
            vehicles: filtered.map((v) => ({
              id: v.id,
              plate: v.licensePlate,
              brand: v.brand,
              model: v.model,
              year: v.year,
              ecoClass: v.ecoClass,
              maxWeight: v.maxWeight,
              vin: v.vin,
            })),
          };
        } catch (error) {
          logger.warn({ error, userId }, "getMyVehicles failed");
          return {
            authenticated: true as const,
            error: "Не удалось получить список ТС.",
          };
        }
      },
    }),

    getMyOrders: tool({
      description:
        "Получить список заявок авторизованного клиента. Можно фильтровать по статусу и периоду. Для авторизованных пользователей.",
      inputSchema: z.object({
        status: z
          .enum([
            "draft",
            "documents_pending",
            "payment_pending",
            "processing",
            "submitted",
            "approved",
            "rejected",
            "cancelled",
          ])
          .optional()
          .describe("Опционально: фильтр по статусу заявки"),
        limit: z.number().int().min(1).max(50).default(10),
      }),
      execute: async ({ status, limit }) => {
        if (!userId) {
          return {
            authenticated: false as const,
            message: "Нужна авторизация в личном кабинете.",
          };
        }

        try {
          const where = status
            ? and(eq(orders.userId, userId), eq(orders.status, status))
            : eq(orders.userId, userId);

          const list = await db
            .select({
              id: orders.id,
              vehicleId: orders.vehicleId,
              zone: orders.zone,
              type: orders.type,
              status: orders.status,
              price: orders.price,
              estimatedReadyDate: orders.estimatedReadyDate,
              createdAt: orders.createdAt,
            })
            .from(orders)
            .where(where)
            .orderBy(desc(orders.createdAt))
            .limit(limit);

          return {
            authenticated: true as const,
            count: list.length,
            orders: list.map((o) => ({
              id: o.id,
              zone: zoneLabels[o.zone] ?? o.zone,
              status: o.status,
              type: o.type,
              price: o.price,
              estimatedReadyDate: formatDateOrNull(o.estimatedReadyDate),
              createdAt: o.createdAt.toISOString().slice(0, 10),
            })),
          };
        } catch (error) {
          logger.warn({ error, userId }, "getMyOrders failed");
          return {
            authenticated: true as const,
            error: "Не удалось получить список заявок.",
          };
        }
      },
    }),

    getMyPermits: tool({
      description:
        "Получить активные пропуска авторизованного клиента. Можно фильтровать по сроку окончания (например, истекающие в ближайшие 30 дней). Для авторизованных пользователей.",
      inputSchema: z.object({
        expiringInDays: z
          .number()
          .int()
          .min(0)
          .max(365)
          .optional()
          .describe(
            "Опционально: показать только пропуска, истекающие в ближайшие N дней",
          ),
      }),
      execute: async ({ expiringInDays }) => {
        if (!userId) {
          return {
            authenticated: false as const,
            message: "Нужна авторизация в личном кабинете.",
          };
        }

        try {
          const conditions = [
            eq(permits.userId, userId),
            eq(permits.status, "active"),
          ];

          if (typeof expiringInDays === "number") {
            const upper = new Date();
            upper.setDate(upper.getDate() + expiringInDays);
            conditions.push(lte(permits.validUntil, upper.toISOString().slice(0, 10)));
            conditions.push(gte(permits.validUntil, new Date().toISOString().slice(0, 10)));
          }

          const list = await db
            .select({
              id: permits.id,
              orderId: permits.orderId,
              permitNumber: permits.permitNumber,
              zone: permits.zone,
              type: permits.type,
              validFrom: permits.validFrom,
              validUntil: permits.validUntil,
              status: permits.status,
            })
            .from(permits)
            .where(and(...conditions))
            .orderBy(asc(permits.validUntil))
            .limit(50);

          return {
            authenticated: true as const,
            count: list.length,
            permits: list.map((p) => ({
              id: p.id,
              permitNumber: p.permitNumber,
              zone: zoneLabels[p.zone] ?? p.zone,
              type: p.type,
              validFrom: formatDateOrNull(p.validFrom),
              validUntil: formatDateOrNull(p.validUntil),
              daysLeft: daysUntil(p.validUntil),
            })),
          };
        } catch (error) {
          logger.warn({ error, userId }, "getMyPermits failed");
          return {
            authenticated: true as const,
            error: "Не удалось получить список пропусков.",
          };
        }
      },
    }),

    getMyDocuments: tool({
      description:
        "Получить список документов авторизованного клиента. Можно фильтровать по статусу (например, отклонённые — нужно переснять). Для авторизованных пользователей.",
      inputSchema: z.object({
        status: z
          .enum(["pending", "approved", "rejected"])
          .optional()
          .describe("Опционально: фильтр по статусу документа"),
      }),
      execute: async ({ status }) => {
        if (!userId) {
          return {
            authenticated: false as const,
            message: "Нужна авторизация в личном кабинете.",
          };
        }

        try {
          const where = status
            ? and(eq(documents.userId, userId), eq(documents.status, status))
            : eq(documents.userId, userId);

          const list = await db
            .select({
              id: documents.id,
              type: documents.type,
              fileName: documents.fileName,
              status: documents.status,
              rejectionReason: documents.rejectionReason,
              orderId: documents.orderId,
              createdAt: documents.createdAt,
            })
            .from(documents)
            .where(where)
            .orderBy(desc(documents.createdAt))
            .limit(50);

          return {
            authenticated: true as const,
            count: list.length,
            documents: list.map((d) => ({
              id: d.id,
              type: d.type,
              fileName: d.fileName,
              status: d.status,
              rejectionReason: d.rejectionReason,
              orderId: d.orderId,
              uploadedAt: d.createdAt.toISOString().slice(0, 10),
            })),
          };
        } catch (error) {
          logger.warn({ error, userId }, "getMyDocuments failed");
          return {
            authenticated: true as const,
            error: "Не удалось получить список документов.",
          };
        }
      },
    }),
  };
}

/** Backwards-compatible default export for anonymous calls. */
export const chatTools = createChatTools({ userId: null });
