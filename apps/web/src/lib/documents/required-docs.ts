import type { DocumentType } from "./zip-parser";

export type OrderType = "mkad_day" | "mkad_night" | "ttk" | "sk" | "temp";
export type OrderZone = "mkad" | "ttk" | "sk";

/**
 * Базовый набор документов для всех типов пропусков.
 * pts, sts, driver_license — обязательно всегда.
 * power_of_attorney — обязательно если оформляет не собственник (по умолчанию считаем что да).
 * application — формирует наша система.
 */
const BASE_REQUIRED: DocumentType[] = [
  "pts",
  "sts",
  "driver_license",
  "power_of_attorney",
];

const REQUIRED_BY_TYPE: Record<OrderType, DocumentType[]> = {
  mkad_day: BASE_REQUIRED,
  mkad_night: BASE_REQUIRED,
  ttk: BASE_REQUIRED,
  sk: [...BASE_REQUIRED, "contract"], // СК — нужен договор
  temp: BASE_REQUIRED,
};

export interface MissingReport {
  missing: DocumentType[];
  present: DocumentType[];
  isComplete: boolean;
}

export function findMissingDocuments(
  presentTypes: DocumentType[],
  orderType: OrderType,
): MissingReport {
  const required = REQUIRED_BY_TYPE[orderType];
  const presentSet = new Set(presentTypes);
  const missing = required.filter((t) => !presentSet.has(t));
  return {
    missing,
    present: required.filter((t) => presentSet.has(t)),
    isComplete: missing.length === 0,
  };
}

export const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
  pts: "ПТС",
  sts: "СТС",
  driver_license: "Водительское удостоверение",
  power_of_attorney: "Доверенность",
  application: "Заявление",
  contract: "Договор",
  other: "Другое",
};

export const ORDER_TYPE_LABELS: Record<OrderType, string> = {
  mkad_day: "МКАД дневной",
  mkad_night: "МКАД ночной",
  ttk: "ТТК",
  sk: "Садовое кольцо",
  temp: "Временный",
};

export const ORDER_ZONE_LABELS: Record<OrderZone, string> = {
  mkad: "МКАД",
  ttk: "ТТК",
  sk: "Садовое кольцо",
};
