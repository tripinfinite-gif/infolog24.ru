export interface CompanyInfo {
  name: string;
  fullName: string;
  foundedYear: number;
  description: string;
  mission: string;
  values: { title: string; description: string; icon: string }[];
  advantages: { title: string; description: string; icon: string }[];
  team: { count: string; description: string };
  contacts: {
    phone: string;
    email: string;
    address: string;
    workingHours: string;
    coordinates: { lat: number; lng: number };
  };
  social: { name: string; url: string }[];
}

export const companyInfo: CompanyInfo = {
  name: "Инфологистик-24",
  fullName: 'ООО "Инфологистик-24"',
  foundedYear: 2016,
  description:
    "Оформляем пропуска в Москву для грузового транспорта с 2016 года. 50 000+ пропусков, 98% одобрение, средний срок — 3 дня. Берём на себя все 7 этапов — от ЭЦП до РНИС. Вы передаёте документы и забываете о проблеме.",
  mission:
    "Избавить перевозчиков от бюрократии, штрафов и простоев. Пока вы зарабатываете — мы оформляем.",
  values: [
    {
      title: "Скорость",
      description:
        "Средний срок — 3 дня. Временный пропуск — за 1 день. Пока конкуренты ждут неделями, ваш груз уже в Москве.",
      icon: "Zap",
    },
    {
      title: "Надёжность",
      description:
        "98% одобрение. Повторная подача при отказе — бесплатно. Не оформим — вернём деньги. Без мелкого шрифта.",
      icon: "Shield",
    },
    {
      title: "Простота",
      description:
        "Отправьте фото документов — и забудьте. Мы сделаем всё: проверим, подадим, получим. Один звонок вместо 7 этапов.",
      icon: "Smile",
    },
  ],
  advantages: [
    {
      title: "Берём на себя все 7 этапов",
      description:
        "От ЭЦП и РНИС до подачи в Дептранс — вам не нужно разбираться в бюрократии. Просто отправьте документы.",
      icon: "ClipboardCheck",
    },
    {
      title: "50 000+ пропусков за 10 лет",
      description:
        "Знаем все нюансы, подводные камни и причины отказов. Ваша заявка будет подготовлена без ошибок с первого раза.",
      icon: "Award",
    },
    {
      title: "98% одобрение заявок",
      description:
        "Там, где 70% самостоятельных заявок получают отказ, наши клиенты получают пропуск. Даже в сложных случаях.",
      icon: "TrendingUp",
    },
    {
      title: "Временный пропуск — сразу",
      description:
        "Не теряйте деньги на простое. При заказе годового — временный бесплатно. Работаете, пока мы оформляем.",
      icon: "Gift",
    },
    {
      title: "Мониторим штрафы и РНИС",
      description:
        "Предупреждаем об аннуляции, следим за сроками, напоминаем о продлении за 30 дней. Ни одного внезапного штрафа.",
      icon: "Bell",
    },
    {
      title: "Скидки за автопарк",
      description:
        "2–5 машин — скидка 5%, 6–10 — 10%, от 11 — 15%. Чем больше парк, тем выгоднее. Для крупных клиентов — индивидуальные условия.",
      icon: "Percent",
    },
    {
      title: "Берём сложные случаи",
      description:
        "Отказали в другом месте? Проблемы с экоклассом, спецтехника, повторные подачи — решаем то, за что другие не берутся.",
      icon: "ShieldCheck",
    },
    {
      title: "Защита от мошенников",
      description:
        "Работаем по договору с гарантией. Не как «брокеры», которые отменяют пропуск через 3 дня. Проверьте нас на 2ГИС и Яндексе.",
      icon: "Lock",
    },
  ],
  team: {
    count: "30–50",
    description:
      "Специалисты по оформлению, юристы, менеджеры и IT-команда. Каждый знает процедуру изнутри — от требований Дептранса до нюансов РНИС.",
  },
  contacts: {
    phone: "+7 (495) XXX-XX-XX",
    email: "info@infolog24.ru",
    address: "г. Москва",
    workingHours: "Пн–Пт: 9:00–20:00, Сб: 10:00–17:00",
    coordinates: {
      lat: 55.7558,
      lng: 37.6173,
    },
  },
  social: [
    { name: "Telegram", url: "https://t.me/infolog24" },
    { name: "WhatsApp", url: "https://wa.me/7495XXXXXXX" },
  ],
};
