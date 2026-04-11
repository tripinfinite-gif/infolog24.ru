import { tool } from "ai";
import { eq, or } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/lib/db";
import { orders, users } from "@/lib/db/schema";
import { faqItems } from "@/content/faq";
import { calculatePrice, pricingTiers } from "@/content/pricing";
import { serviceZones } from "@/content/services";
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
  return pricingTiers.find((t) => t.zone === zone && t.type === "annual")?.price ?? 12000;
}

/**
 * Chat tools factory. Returns a fresh bag of tools bound to the current
 * user context (authenticated userId when available).
 */
export function createChatTools({ userId }: ChatUserContext) {
  return {
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
            // fall back to searching users by phone, then matching their orders
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

    getFaqAnswer: tool({
      description:
        "Найти ответ на типовой вопрос во встроенной базе знаний (FAQ). Работает по ключевым словам: возвращает до 3 наиболее подходящих пар вопрос-ответ.",
      inputSchema: z.object({
        question: z.string().min(3).describe("Вопрос пользователя"),
      }),
      execute: async ({ question }) => {
        const normalized = question.toLowerCase();
        const tokens = normalized
          .split(/[^\p{L}\p{N}]+/u)
          .filter((t) => t.length >= 3);

        const scored = faqItems
          .map((item) => {
            const haystack =
              `${item.question} ${item.answer}`.toLowerCase();
            const score = tokens.reduce(
              (acc, token) => (haystack.includes(token) ? acc + 1 : acc),
              0,
            );
            return { item, score };
          })
          .filter((x) => x.score > 0)
          .sort((a, b) => b.score - a.score)
          .slice(0, 3);

        if (scored.length === 0) {
          return {
            matches: [] as const,
            message:
              "По вашему вопросу ничего не найдено в базе знаний. Попробуйте переформулировать или свяжитесь с менеджером.",
          };
        }

        return {
          matches: scored.map(({ item }) => ({
            id: item.id,
            category: item.category,
            question: item.question,
            answer: item.answer,
          })),
        };
      },
    }),
  };
}

/** Backwards-compatible default export for anonymous calls. */
export const chatTools = createChatTools({ userId: null });
