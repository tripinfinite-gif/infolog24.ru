export interface InfopilotScenario {
  id:
    | "evakuaciya"
    | "diagnostika"
    | "remont"
    | "mojki"
    | "strahovanie"
    | "obzhalovanie";
  slug: string;
  title: string;
  description: string;
  iconName: string;
  monetizationHint: string;
}

export const infopilotScenarios: InfopilotScenario[] = [
  {
    id: "evakuaciya",
    slug: "evakuaciya",
    title: "Эвакуация 24/7",
    description:
      "Найдём ближайший проверенный эвакуатор в любой точке РФ, сами договоримся о цене и времени.",
    iconName: "Truck",
    monetizationHint: "Цена партнёра — без наценки",
  },
  {
    id: "diagnostika",
    slug: "diagnostika",
    title: "Диагностическая карта / ТО",
    description:
      "Ближайший лицензированный оператор, мгновенное бронирование слота, документы — автоматически.",
    iconName: "ClipboardCheck",
    monetizationHint: "Фиксированная цена оператора",
  },
  {
    id: "remont",
    slug: "remont",
    title: "Ремонт грузовиков",
    description:
      "Подберём СТО под марку и поломку, только мастерские с высоким рейтингом и прозрачным прайсом.",
    iconName: "Wrench",
    monetizationHint: "Прайс мастерской — как для своих",
  },
  {
    id: "mojki",
    slug: "mojki",
    title: "Мойки грузовых",
    description:
      "Только актуальные точки на маршруте, цены зафиксированы договором — без «развода на трассе».",
    iconName: "Droplets",
    monetizationHint: "Цена моек — договорная, без сюрпризов",
  },
  {
    id: "strahovanie",
    slug: "strahovanie",
    title: "Страхование",
    description:
      "ОСАГО, КАСКО, ОСГОП и ответственность экспедитора от партнёров — оформление онлайн за несколько минут.",
    iconName: "Shield",
    monetizationHint: "Тарифы страховщиков — напрямую",
  },
  {
    id: "obzhalovanie",
    slug: "obzhalovanie",
    title: "Обжалование штрафов",
    description:
      "Фото постановления — ИИ распознаёт состав, юрист в штате готовит жалобу и ведёт её до результата.",
    iconName: "Scale",
    monetizationHint: "Платим только при экономии — фикс или процент",
  },
];

export interface InfopilotTechFeature {
  iconName: string;
  title: string;
  description: string;
}

export const infopilotTechFeatures: InfopilotTechFeature[] = [
  {
    iconName: "Mic",
    title: "Голосовой ввод",
    description:
      "Водитель говорит в Telegram — SpeechKit расшифровывает, руки остаются на руле.",
  },
  {
    iconName: "PhoneCall",
    title: "Автозвонок партнёру",
    description:
      "ИИ-агент сам звонит подрядчику через VoIP, согласует цену и время до подтверждения клиенту.",
  },
  {
    iconName: "MapPin",
    title: "Геобаза партнёров",
    description:
      "Проверенные эвакуаторы, СТО, мойки и страховщики по всей РФ — с рейтингом и фиксированными прайсами.",
  },
  {
    iconName: "History",
    title: "История инцидентов в ЛК",
    description:
      "Каждый вызов — карточка с ценой, временем и отзывом. Для отчётности, компенсаций и аналитики.",
  },
];
