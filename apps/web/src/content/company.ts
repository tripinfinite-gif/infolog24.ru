/**
 * Single source of truth по компании.
 *
 * Бренд `name` («Инфолог24») — коммерческое название на сайте.
 * Юридические поля (`legalName`, `inn`, `ogrn`, `legalAddress`...) берутся
 * из ЕГРЮЛ и НЕ должны меняться без обновления выписки.
 */

export interface CompanyContacts {
  phone: string;
  phoneFormatted: string;
  phoneTel: string;
  email: string;
  legalAddress: string;
  physicalAddress: string;
  workingHours: string;
  coordinates: { lat: number; lng: number };
}

export interface CompanyLegal {
  legalName: string;
  legalNameShort: string;
  inn: string;
  kpp: string;
  ogrn: string;
  director: string;
  registrationDate: string;
  okved: string;
  okvedDescription: string;
}

export interface CompanySocial {
  name: string;
  url: string;
  username?: string;
}

export interface CompanyInfo {
  name: string;
  fullName: string;
  foundedYear: number;
  description: string;
  mission: string;
  values: { title: string; description: string; icon: string }[];
  advantages: { title: string; description: string; icon: string }[];
  team: { count: string; description: string };
  contacts: CompanyContacts;
  legal: CompanyLegal;
  social: CompanySocial[];
}

export const companyInfo: CompanyInfo = {
  // Бренд (то, что показываем посетителю)
  name: "Инфолог24",
  fullName: "ООО «Инфологистик 24»",
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
    phone: "+7 (499) 110-55-49",
    phoneFormatted: "+7 (499) 110-55-49",
    phoneTel: "+74991105549",
    email: "info@infolog24.ru",
    // Юридический адрес из ЕГРЮЛ
    legalAddress:
      "109044, г. Москва, муниципальный округ Южнопортовый, 2-й Крутицкий пер., д. 18, стр. 1, помещ. 2/1",
    // Фактический адрес офиса (из infolog24.ru/kontakty)
    physicalAddress: "115093, г. Москва, Подольское шоссе, д. 8",
    workingHours: "Пн–Пт: 9:00–20:00",
    // Координаты Подольского шоссе, 8 (фактический офис)
    coordinates: {
      lat: 55.7126,
      lng: 37.6519,
    },
  },
  legal: {
    legalName:
      "ОБЩЕСТВО С ОГРАНИЧЕННОЙ ОТВЕТСТВЕННОСТЬЮ «ИНФОЛОГИСТИК 24»",
    legalNameShort: "ООО «Инфологистик 24»",
    inn: "9701049890",
    kpp: "772301001",
    ogrn: "1167746879486",
    director: "Васильев Андрей Владимирович",
    registrationDate: "20.09.2016",
    okved: "52.29",
    okvedDescription:
      "Деятельность вспомогательная прочая, связанная с перевозками",
  },
  social: [
    // По требованию: WhatsApp и Telegram удалены. На их место — MAX и VK.
    { name: "MAX", url: "https://max.ru/infolog24", username: "infolog24" },
    { name: "VK", url: "https://vk.com/infolog24", username: "infolog24" },
  ],
};
