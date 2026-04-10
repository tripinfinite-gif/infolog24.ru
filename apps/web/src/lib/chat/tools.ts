import { tool } from "ai";
import { z } from "zod";

import { calculateTotal, priceRules } from "@/content/calculator";
import { services } from "@/content/services";

const zoneLabels: Record<string, string> = {
  mkad: "МКАД",
  ttk: "ТТК",
  sk: "Садовое кольцо",
};

const typeLabels: Record<string, string> = {
  "annual-day": "Годовой дневной",
  "annual-night": "Годовой ночной",
  temp: "Временный (до 5 суток)",
};

export const chatTools = {
  getPrice: tool({
    description:
      "Рассчитать стоимость пропуска для грузового транспорта в Москву",
    inputSchema: z.object({
      zone: z
        .enum(["mkad", "ttk", "sk"])
        .describe("Зона: mkad, ttk или sk (Садовое кольцо)"),
      type: z
        .enum(["annual-day", "annual-night", "temp"])
        .describe(
          "Тип пропуска: annual-day (годовой дневной), annual-night (годовой ночной), temp (временный)",
        ),
      vehicleCount: z
        .number()
        .min(1)
        .default(1)
        .describe("Количество транспортных средств"),
    }),
    execute: async ({ zone, type, vehicleCount }) => {
      const result = calculateTotal(zone, type, vehicleCount);
      if (!result) {
        return {
          error: true as const,
          message:
            "Не удалось рассчитать стоимость для указанных параметров. Пожалуйста, уточните зону и тип пропуска.",
        };
      }

      const rule = priceRules.find(
        (r) => r.zone === zone && r.type === type,
      );

      return {
        error: false as const,
        zone: zoneLabels[zone] ?? zone,
        type: typeLabels[type] ?? type,
        vehicleCount,
        basePrice: rule?.basePrice ?? 0,
        pricePerVehicle: result.pricePerVehicle,
        total: result.total,
        discount: result.discount,
        discountText:
          result.discount > 0
            ? `Скидка ${result.discount}% за ${vehicleCount} машин`
            : null,
        note:
          type === "temp" && zone === "mkad"
            ? "Бесплатно при заказе годового пропуска"
            : null,
      };
    },
  }),

  checkPermitStatus: tool({
    description: "Проверить статус заявки по номеру",
    inputSchema: z.object({
      orderNumber: z
        .string()
        .describe("Номер заявки, например ORD-001"),
    }),
    execute: async ({ orderNumber }) => {
      // TODO: Connect to real DB when ready
      const statuses = [
        {
          status: "processing",
          label: "В обработке",
          description: "Документы проверены, заявка подана в Дептранс",
        },
        {
          status: "submitted",
          label: "Подана",
          description: "Заявка подана в Дептранс, ожидаем рассмотрения",
        },
        {
          status: "documents_pending",
          label: "Ожидает документы",
          description:
            "Необходимо дослать недостающие документы",
        },
      ];

      const randomStatus =
        statuses[Math.floor(Math.random() * statuses.length)]!;

      return {
        orderNumber,
        ...randomStatus,
        note: "Для точной информации свяжитесь с менеджером: +7 (495) XXX-XX-XX",
      };
    },
  }),

  requestCallback: tool({
    description: "Оставить заявку на обратный звонок от менеджера",
    inputSchema: z.object({
      name: z.string().describe("Имя клиента"),
      phone: z.string().describe("Номер телефона клиента"),
      preferredTime: z
        .string()
        .optional()
        .describe(
          "Предпочтительное время звонка, например: утро, день, вечер",
        ),
    }),
    execute: async ({ name, phone, preferredTime }) => {
      // TODO: Create notification for manager, save to DB
      return {
        success: true,
        message: `Спасибо, ${name}! Менеджер перезвонит вам${preferredTime ? ` ${preferredTime}` : " в ближайшее время"} по номеру ${phone}.`,
      };
    },
  }),

  getRequiredDocuments: tool({
    description:
      "Получить список необходимых документов для оформления пропуска",
    inputSchema: z.object({
      zone: z
        .enum(["mkad", "ttk", "sk"])
        .describe("Зона: mkad, ttk или sk"),
      type: z
        .enum(["annual", "temp"])
        .describe("Тип: annual (годовой) или temp (временный)"),
    }),
    execute: async ({ zone, type }) => {
      // Find matching service
      const matchingService = services.find((s) => {
        if (s.zone !== zone) return false;
        if (type === "annual") return s.type !== "temp";
        return s.type === "temp";
      });

      if (!matchingService) {
        return {
          zone: zoneLabels[zone] ?? zone,
          type: type === "annual" ? "Годовой" : "Временный",
          documents: [
            "СТС (свидетельство о регистрации ТС) -- копия",
            "ПТС (паспорт транспортного средства) -- копия",
            "Доверенность на управление ТС",
            "Договор на перевозку или маршрутный лист",
            "Выписка ЕГРЮЛ/ЕГРИП",
          ],
          requirements: [] as string[],
        };
      }

      return {
        zone: zoneLabels[zone] ?? zone,
        type: type === "annual" ? "Годовой" : "Временный",
        serviceName: matchingService.title,
        documents: matchingService.documents,
        requirements: matchingService.requirements,
        processingDays: matchingService.processingDays,
      };
    },
  }),
};
