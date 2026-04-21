export interface ServicePackage {
  id: "propusk-plus" | "tranzit-moskva" | "flot-pro";
  slug: string;
  name: string;
  tagline: string;
  targetAudience: string;
  features: string[];
  priceFrom: string;
  savingsLabel: string | null;
  ctaLabel: string;
  ctaHref: string;
  highlighted: boolean;
  iconName: string;
}

export const packages: ServicePackage[] = [
  {
    id: "propusk-plus",
    slug: "propusk-plus",
    name: "Пропуск+",
    tagline: "Всё, что нужно, чтобы ездить в Москву легально",
    targetAudience: "Для 1–4 машин. Частник или микро-ТК",
    features: [
      "Пропуск в выбранную зону (МКАД / ТТК / СК)",
      "Подключение РНИС через партнёра (трекер по себестоимости)",
      "Перевод на ЭТрН — УКЭП + ЭДО + обучение",
      "Мониторинг штрафов в Telegram",
      "Доступ к ИнфоПилоту (pay-as-you-go)",
    ],
    priceFrom: "от 12 500 ₽ разово + 800 ₽/мес за ТС",
    savingsLabel: "Экономия vs отдельно: ~15%",
    ctaLabel: "Оформить Пропуск+",
    ctaHref: "/resheniya/propusk-plus",
    highlighted: false,
    iconName: "Sparkles",
  },
  {
    id: "tranzit-moskva",
    slug: "tranzit-moskva",
    name: "Транзит Москва",
    tagline: "Полная регуляторная защита + мониторинг",
    targetAudience: "Для 5–20 машин. Малая и средняя ТК",
    features: [
      "Всё из пакета «Пропуск+»",
      "Регистрация в ГосЛог (экспедитор или перевозчик)",
      "Антиштраф — мониторинг всех пропусков парка с алертами до аннуляции",
      "Консультации юриста (2 в месяц)",
      "ИнфоПилот — безлимитный SOS-доступ за ТС",
      "Выделенный менеджер в рабочие часы",
    ],
    priceFrom: "12 000 ₽/ТС до 4 машин → 10 200 ₽/ТС от 5 машин + 1 500 ₽/мес за ТС",
    savingsLabel: "Экономия vs отдельно: ~22%",
    ctaLabel: "Оформить Транзит Москва",
    ctaHref: "/resheniya/tranzit-moskva",
    highlighted: true,
    iconName: "Crown",
  },
  {
    id: "flot-pro",
    slug: "flot-pro",
    name: "Флот Про",
    tagline: "API, SLA, выделенный менеджер",
    targetAudience: "Для парков от 10 машин. Корпоративный продукт",
    features: [
      "Всё из пакета «Транзит Москва»",
      "Корпоративный ЛК с дашбордом парка",
      "Пакетная подача заявок (10 пропусков за 1 раз)",
      "API-интеграция с вашей TMS/ERP",
      "Выделенный аккаунт-менеджер 24/7",
      "SLA на обработку заявки 4 часа",
      "Юрист-перевозчик на полном тарифе",
    ],
    priceFrom: "индивидуально, от 900 ₽/мес за ТС",
    savingsLabel: null,
    ctaLabel: "Оставить заявку на Флот Про",
    ctaHref: "/resheniya/flot-pro",
    highlighted: false,
    iconName: "Building2",
  },
];
