import type { OrderType, OrderZone } from "@/lib/documents/required-docs";

/** Базовые цены пропусков (рубли, integer как в schema). */
export const BASE_PRICES: Record<OrderType, number> = {
  mkad_day: 8000,
  mkad_night: 6000,
  ttk: 12000,
  sk: 18000,
  temp: 4000,
};

/** Базовая ставка комиссии партнёра — 10%. */
export const DEFAULT_PARTNER_COMMISSION_RATE = 0.1;

export interface CommissionInput {
  orderType: OrderType;
  zone: OrderZone;
  price?: number; // если не передано, берём BASE_PRICES[orderType]
  rate?: number; // если не передано, DEFAULT_PARTNER_COMMISSION_RATE
}

export interface CommissionResult {
  basePrice: number;
  rate: number;
  commission: number; // целые рубли (Math.round)
}

export function calculatePartnerCommission(
  input: CommissionInput,
): CommissionResult {
  const basePrice = input.price ?? BASE_PRICES[input.orderType];
  const rate = input.rate ?? DEFAULT_PARTNER_COMMISSION_RATE;
  return {
    basePrice,
    rate,
    commission: Math.round(basePrice * rate),
  };
}

/** Форматирует сумму в рублях с пробелом-разделителем и ₽. */
export function formatRub(amount: number): string {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(amount);
}
