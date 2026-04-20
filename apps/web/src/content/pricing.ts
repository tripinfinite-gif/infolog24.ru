export interface PricingTier {
  zone: string;
  type: string;
  title: string;
  subtitle: string;
  price: number;
  priceUnit: string;
  processingDays: string;
  features: string[];
  popular?: boolean;
}

export interface VolumeDiscount {
  minVehicles: number;
  maxVehicles?: number;
  discountPercent: number;
  label: string;
}

export interface FineData {
  finePerCamera: number;
  camerasOnMkad: number;
  fineRepeat: number;
  totalPerTrip: number;
  totalPerMonth: number;
  earlyPaymentDiscount: number;
}

export const fineData: FineData = {
  finePerCamera: 7500,
  camerasOnMkad: 43,
  fineRepeat: 10000,
  // 43 камеры × 7 500 ₽ = 322 500 ₽ (ст. 12.16 ч. 7 КоАП РФ, ред. ФЗ-490 от 26.12.2024).
  totalPerTrip: 322500,
  totalPerMonth: 500000,
  earlyPaymentDiscount: 25,
};

export const pricingTiers: PricingTier[] = [
  {
    zone: "mkad",
    type: "annual",
    title: "МКАД",
    subtitle: "Годовой пропуск",
    price: 12000,
    priceUnit: "₽",
    processingDays: "10 рабочих дней",
    features: [
      "Действует 1 год",
      "Для транспорта свыше 3,5 т",
      "Временный пропуск бесплатно",
      "Повторная подача при отказе — бесплатно",
      "Персональный менеджер",
    ],
    popular: true,
  },
  {
    zone: "ttk",
    type: "annual",
    title: "ТТК",
    subtitle: "Годовой пропуск",
    price: 12000,
    priceUnit: "₽",
    processingDays: "10 рабочих дней",
    features: [
      "Действует 1 год",
      "Включает проезд по МКАД",
      "Для транспорта свыше 1 т",
      "Экокласс Евро-3 и выше",
      "Временный пропуск бесплатно",
      "Повторная подача при отказе — бесплатно",
    ],
  },
  {
    zone: "sk",
    type: "annual",
    title: "Садовое кольцо",
    subtitle: "Годовой пропуск",
    price: 12000,
    priceUnit: "₽",
    processingDays: "10 рабочих дней",
    features: [
      "Действует 1 год",
      "Включает проезд по ТТК и МКАД",
      "Для транспорта свыше 1 т",
      "Экокласс Евро-3 и выше",
      "Временный пропуск бесплатно",
      "Полное сопровождение",
    ],
  },
  {
    zone: "any",
    type: "temp",
    title: "Временный",
    subtitle: "Любая зона",
    price: 4500,
    priceUnit: "₽",
    processingDays: "1 рабочий день",
    features: [
      "Действует до 10 суток",
      "Любая зона: МКАД, ТТК, СК",
      "Оформление за 1 день",
      "Минимум документов",
      "Бесплатно при заказе годового",
    ],
  },
];

export const volumeDiscounts: VolumeDiscount[] = [
  {
    minVehicles: 2,
    maxVehicles: 5,
    discountPercent: 5,
    label: "2–5 машин",
  },
  {
    minVehicles: 6,
    maxVehicles: 10,
    discountPercent: 10,
    label: "6–10 машин",
  },
  {
    minVehicles: 11,
    discountPercent: 15,
    label: "11+ машин",
  },
];

export const includedInPrice = [
  "Проверка и подготовка документов",
  "Подача заявки в Дептранс",
  "Временный пропуск на время оформления",
  "Повторная подача при отказе — бесплатно",
  "Персональный менеджер",
  "Консультации 24/7 по телефону и в мессенджерах",
  "Напоминание о продлении за 30 дней",
  "Сопровождение на всех этапах",
];

export const pricingFaqItems = [
  {
    question: "Почему цена «от 12 000 ₽»? Какая точная стоимость?",
    answer:
      "Базовая стоимость оформления годового пропуска — 12 000 ₽ для любой зоны. Точная цена зависит от типа транспорта, количества машин (скидки за объём) и сложности случая. Оставьте заявку — мы рассчитаем точную стоимость за 5 минут.",
  },
  {
    question: "Что входит в стоимость оформления?",
    answer:
      "В стоимость входит полный цикл: проверка документов, подача заявки, временный пропуск на время оформления, повторная подача при отказе, персональный менеджер и консультации. Никаких скрытых доплат.",
  },
  {
    question: "Какие способы оплаты вы принимаете?",
    answer:
      "Безналичный перевод (для юрлиц и ИП с актом выполненных работ), банковские карты, СБП (Система быстрых платежей), наличные в офисе.",
  },
  {
    question: "Возвращаете ли вы деньги при отказе?",
    answer:
      "При отказе мы подаём документы повторно бесплатно. Если после всех попыток пропуск получить не удалось (менее 2% случаев), возвращаем оплату в полном объёме.",
  },
  {
    question: "Временный пропуск действительно бесплатный при заказе годового?",
    answer:
      "Да. При заказе годового пропуска мы бесплатно оформляем временный, чтобы вы могли работать без перерыва, пока готовится годовой. Это стандартное условие для всех клиентов.",
  },
  {
    question: "Как работают скидки за объём?",
    answer:
      "Скидка применяется к каждой машине в заказе: 2–5 машин — 5%, 6–10 машин — 10%, от 11 машин — 15%. Для автопарков свыше 20 машин — индивидуальные условия.",
  },
  {
    question: "Можно ли оплатить после получения пропуска?",
    answer:
      "Мы работаем по предоплате, так как начинаем работу сразу после получения документов. Для постоянных клиентов возможна постоплата по договорённости.",
  },
  {
    question: "Есть ли скидка на повторное оформление / продление?",
    answer:
      "Да, для постоянных клиентов мы предлагаем специальные условия на продление пропусков. 70% наших клиентов продлевают ежегодно — мы ценим лояльность.",
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
