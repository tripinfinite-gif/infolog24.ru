export interface PricingTier {
  zone: string;
  type: string;
  title: string;
  price: number;
  priceUnit: string;
  processingDays: string;
  features: string[];
  popular?: boolean;
}

export interface VolumeDiscount {
  minVehicles: number;
  discountPercent: number;
  label: string;
}

export const pricingTiers: PricingTier[] = [
  {
    zone: "mkad",
    type: "annual-day",
    title: "МКАД — годовой дневной",
    price: 10000,
    priceUnit: "руб.",
    processingDays: "3 рабочих дня",
    features: [
      "Действует 1 год",
      "Проезд с 7:00 до 23:00",
      "Для транспорта свыше 3,5 т",
      "Временный пропуск бесплатно",
      "Повторная подача при отказе — бесплатно",
    ],
    popular: true,
  },
  {
    zone: "mkad",
    type: "annual-night",
    title: "МКАД — годовой ночной",
    price: 8000,
    priceUnit: "руб.",
    processingDays: "2 рабочих дня",
    features: [
      "Действует 1 год",
      "Проезд с 23:00 до 7:00",
      "Для транспорта свыше 3,5 т",
      "Ускоренное оформление",
    ],
  },
  {
    zone: "mkad",
    type: "temp",
    title: "МКАД — временный",
    price: 3500,
    priceUnit: "руб.",
    processingDays: "1 рабочий день",
    features: [
      "Действует до 5 суток",
      "Оформление за 1 день",
      "Минимум документов",
      "Бесплатно при заказе годового",
    ],
  },
  {
    zone: "ttk",
    type: "annual",
    title: "ТТК — годовой",
    price: 15000,
    priceUnit: "руб.",
    processingDays: "5 рабочих дней",
    features: [
      "Действует 1 год",
      "Включает проезд по МКАД",
      "Для транспорта свыше 1 т",
      "Экокласс Евро-3 и выше",
      "Гарантия оформления",
    ],
    popular: true,
  },
  {
    zone: "ttk",
    type: "temp",
    title: "ТТК — временный",
    price: 5000,
    priceUnit: "руб.",
    processingDays: "1–2 рабочих дня",
    features: [
      "Действует до 5 суток",
      "Включает проезд по МКАД",
      "Оформление за 1–2 дня",
    ],
  },
  {
    zone: "sk",
    type: "annual",
    title: "Садовое кольцо — годовой",
    price: 20000,
    priceUnit: "руб.",
    processingDays: "7 рабочих дней",
    features: [
      "Действует 1 год",
      "Включает проезд по ТТК и МКАД",
      "Для транспорта свыше 1 т",
      "Экокласс Евро-4 и выше",
      "Полное сопровождение",
    ],
  },
  {
    zone: "mkad",
    type: "taxi",
    title: "Такси на МКАД",
    price: 12000,
    priceUnit: "руб.",
    processingDays: "4 рабочих дня",
    features: [
      "Действует 1 год",
      "Для коммерческого транспорта",
      "Помощь с лицензией",
    ],
  },
  {
    zone: "mkad",
    type: "construction",
    title: "Строительная техника",
    price: 18000,
    priceUnit: "руб.",
    processingDays: "7 рабочих дней",
    features: [
      "Все виды спецтехники",
      "Согласование маршрута",
      "Расчёт нагрузки на ось",
    ],
  },
];

export const volumeDiscounts: VolumeDiscount[] = [
  {
    minVehicles: 2,
    discountPercent: 5,
    label: "2–5 машин",
  },
  {
    minVehicles: 6,
    discountPercent: 10,
    label: "6–10 машин",
  },
  {
    minVehicles: 11,
    discountPercent: 15,
    label: "11+ машин",
  },
];

export function getVolumeDiscount(vehicleCount: number): number {
  if (vehicleCount >= 11) return 15;
  if (vehicleCount >= 6) return 10;
  if (vehicleCount >= 2) return 5;
  return 0;
}

export function calculatePrice(
  basePrice: number,
  vehicleCount: number,
): number {
  const discount = getVolumeDiscount(vehicleCount);
  const pricePerVehicle = basePrice * (1 - discount / 100);
  return Math.round(pricePerVehicle * vehicleCount);
}
