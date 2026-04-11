import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";

/**
 * P4.1 — Vision OCR для AI-помощника.
 *
 * Модуль инкапсулирует работу с gpt-4o (мультимодальная модель,
 * gpt-4o-mini не умеет vision). Публикует две функции извлечения:
 *
 *  - extractVehicleDoc       — СТС / ПТС грузового ТС
 *  - extractFinePostanovlenie — постановление о штрафе (КоАП)
 *
 * Плюс isVisionEnabled() — единая точка фичефлага. Если выключено,
 * роуты возвращают 503 и UI скрывает кнопку прикрепления файла.
 */

export const VehicleDocSchema = z.object({
  documentType: z
    .enum(["sts", "pts", "unknown"])
    .describe("Тип документа: СТС, ПТС или неизвестно"),
  licensePlate: z
    .string()
    .nullable()
    .describe("Государственный регистрационный знак, например A123BC777"),
  vin: z.string().nullable().describe("VIN номер (17 символов)"),
  brand: z.string().nullable().describe("Марка, например КАМАЗ, MAN, Volvo"),
  model: z.string().nullable().describe("Модель, например 65116"),
  year: z.number().int().nullable().describe("Год выпуска"),
  ecoClass: z
    .enum([
      "euro_0",
      "euro_1",
      "euro_2",
      "euro_3",
      "euro_4",
      "euro_5",
      "euro_6",
      "unknown",
    ])
    .nullable()
    .describe("Экологический класс"),
  maxWeightKg: z
    .number()
    .int()
    .nullable()
    .describe("Разрешённая максимальная масса в килограммах"),
  category: z
    .string()
    .nullable()
    .describe("Категория ТС (например B, C, D)"),
  ownerName: z.string().nullable().describe("ФИО или наименование собственника"),
  confidence: z
    .enum(["high", "medium", "low"])
    .describe("Уверенность в распознавании"),
  notes: z
    .string()
    .nullable()
    .describe("Дополнительные замечания, если что-то непонятно"),
});
export type VehicleDoc = z.infer<typeof VehicleDocSchema>;

export const FinePostanovlenieSchema = z.object({
  documentType: z.literal("fine_postanovlenie"),
  postanovlenieNumber: z
    .string()
    .nullable()
    .describe("Номер постановления (УИН)"),
  issueDate: z
    .string()
    .nullable()
    .describe("Дата вынесения постановления в формате YYYY-MM-DD"),
  violationDate: z
    .string()
    .nullable()
    .describe("Дата нарушения в формате YYYY-MM-DD"),
  koapArticle: z
    .string()
    .nullable()
    .describe("Статья КоАП, например '12.16 ч.7'"),
  amountRub: z.number().nullable().describe("Сумма штрафа в рублях"),
  licensePlate: z
    .string()
    .nullable()
    .describe("Госномер ТС, на которое выписан штраф"),
  ownerName: z
    .string()
    .nullable()
    .describe("ФИО или наименование собственника"),
  violationLocation: z
    .string()
    .nullable()
    .describe("Место нарушения (адрес или участок дороги)"),
  description: z
    .string()
    .nullable()
    .describe("Краткое описание нарушения"),
  appealable: z
    .boolean()
    .describe("Возможно ли обжалование (в пределах 10 суток и прочие критерии)"),
  confidence: z
    .enum(["high", "medium", "low"])
    .describe("Уверенность в распознавании"),
  notes: z
    .string()
    .nullable()
    .describe("Дополнительные замечания"),
});
export type FinePostanovlenie = z.infer<typeof FinePostanovlenieSchema>;

/**
 * Фичефлаг. Оба условия должны выполняться:
 *  - OPENAI_API_KEY задан (иначе вообще никак не позвать модель)
 *  - OPENAI_VISION_ENABLED === "true" (ручной рубильник, защита от
 *    неожиданных расходов — gpt-4o в 5× дороже gpt-4o-mini).
 */
export function isVisionEnabled(): boolean {
  return (
    Boolean(process.env.OPENAI_API_KEY) &&
    process.env.OPENAI_VISION_ENABLED === "true"
  );
}

const VISION_MODEL = "gpt-4o";
const VISION_MAX_OUTPUT_TOKENS = 800;

const VEHICLE_SYSTEM_PROMPT = `Ты — OCR-ассистент для сервиса пропусков в Москву для грузового транспорта.
Тебе приходит фотография свидетельства о регистрации ТС (СТС) или паспорта
транспортного средства (ПТС). Извлеки структурированные данные строго по схеме.

Правила:
- Госномер приводи к формату без пробелов, кириллица как на документе (например "А123БВ777").
- VIN — ровно как в документе, 17 символов, латиница и цифры.
- Год выпуска — integer.
- Экокласс — один из euro_0..euro_6 или unknown, если не указан.
- maxWeightKg — разрешённая максимальная масса в килограммах (integer).
- Если документ не похож на СТС/ПТС или распознать нельзя —
  documentType: "unknown", confidence: "low" и в notes опиши, почему.
- Если поле не видно или размыто — верни null, не выдумывай.
- confidence: high если всё чётко, medium если часть полей неуверенна,
  low если плохое качество или не тот документ.`;

const FINE_SYSTEM_PROMPT = `Ты — OCR-ассистент для сервиса пропусков в Москву для грузового транспорта.
Тебе приходит фотография постановления по делу об административном
правонарушении (штраф ГИБДД / МАДИ / АМПП). Извлеки структурированные
данные строго по схеме.

Правила:
- Статья КоАП — в формате "СТАТЬЯ ч.ЧАСТЬ", например "12.16 ч.7".
- Даты — в формате YYYY-MM-DD.
- Сумма штрафа — number в рублях (без копеек, без символов валюты).
- Госномер — как на документе, без пробелов.
- appealable: true, если с момента вынесения постановления прошло не более
  10 календарных дней. Сегодня оцени по issueDate; если даты нет — true.
- Если поле не видно — null, не выдумывай.
- confidence: high если всё чётко, medium при неуверенности в части полей,
  low при плохом качестве или если это не постановление.`;

/**
 * imageBase64DataUrl — строка вида "data:image/jpeg;base64,...".
 * Vercel AI SDK 6 принимает такое значение в поле `image` напрямую.
 */
export async function extractVehicleDoc(
  imageBase64DataUrl: string,
): Promise<VehicleDoc> {
  const { object } = await generateObject({
    model: openai(VISION_MODEL),
    schema: VehicleDocSchema,
    maxOutputTokens: VISION_MAX_OUTPUT_TOKENS,
    system: VEHICLE_SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Извлеки данные грузового ТС с фотографии СТС или ПТС. Верни структурированный JSON по схеме.",
          },
          {
            type: "image",
            image: imageBase64DataUrl,
          },
        ],
      },
    ],
  });
  return object;
}

export async function extractFinePostanovlenie(
  imageBase64DataUrl: string,
): Promise<FinePostanovlenie> {
  const { object } = await generateObject({
    model: openai(VISION_MODEL),
    schema: FinePostanovlenieSchema,
    maxOutputTokens: VISION_MAX_OUTPUT_TOKENS,
    system: FINE_SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Извлеки данные постановления о штрафе по фотографии. Верни структурированный JSON по схеме.",
          },
          {
            type: "image",
            image: imageBase64DataUrl,
          },
        ],
      },
    ],
  });
  return object;
}
