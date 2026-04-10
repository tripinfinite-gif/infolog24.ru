export interface CalculatorOption {
  id: string;
  label: string;
  value: string;
}

export const zones: CalculatorOption[] = [
  { id: "mkad", label: "МКАД", value: "mkad" },
  { id: "ttk", label: "ТТК", value: "ttk" },
  { id: "sk", label: "Садовое кольцо", value: "sk" },
];

export const passTypes: CalculatorOption[] = [
  { id: "annual-day", label: "Годовой дневной", value: "annual-day" },
  { id: "annual-night", label: "Годовой ночной", value: "annual-night" },
  { id: "temp", label: "Временный (до 5 суток)", value: "temp" },
];

export const durations: CalculatorOption[] = [
  { id: "1year", label: "1 год", value: "1year" },
  { id: "5days", label: "До 5 суток", value: "5days" },
];

export interface PriceRule {
  zone: string;
  type: string;
  duration: string;
  basePrice: number;
}

export const priceRules: PriceRule[] = [
  // МКАД
  {
    zone: "mkad",
    type: "annual-day",
    duration: "1year",
    basePrice: 10000,
  },
  {
    zone: "mkad",
    type: "annual-night",
    duration: "1year",
    basePrice: 8000,
  },
  {
    zone: "mkad",
    type: "temp",
    duration: "5days",
    basePrice: 3500,
  },
  // ТТК
  {
    zone: "ttk",
    type: "annual-day",
    duration: "1year",
    basePrice: 15000,
  },
  {
    zone: "ttk",
    type: "annual-night",
    duration: "1year",
    basePrice: 12000,
  },
  {
    zone: "ttk",
    type: "temp",
    duration: "5days",
    basePrice: 5000,
  },
  // Садовое кольцо
  {
    zone: "sk",
    type: "annual-day",
    duration: "1year",
    basePrice: 20000,
  },
  {
    zone: "sk",
    type: "annual-night",
    duration: "1year",
    basePrice: 16000,
  },
  {
    zone: "sk",
    type: "temp",
    duration: "5days",
    basePrice: 7000,
  },
];

export function findPriceRule(
  zone: string,
  type: string,
): PriceRule | undefined {
  return priceRules.find((rule) => rule.zone === zone && rule.type === type);
}

export function calculateTotal(
  zone: string,
  type: string,
  vehicleCount: number,
): { pricePerVehicle: number; total: number; discount: number } | null {
  const rule = findPriceRule(zone, type);
  if (!rule) return null;

  let discount = 0;
  if (vehicleCount >= 11) discount = 15;
  else if (vehicleCount >= 6) discount = 10;
  else if (vehicleCount >= 2) discount = 5;

  const pricePerVehicle = Math.round(rule.basePrice * (1 - discount / 100));
  const total = pricePerVehicle * vehicleCount;

  return { pricePerVehicle, total, discount };
}
