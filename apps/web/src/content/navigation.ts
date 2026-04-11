export interface NavItem {
  title: string;
  href: string;
  children?: NavItem[];
}

export const mainNav: NavItem[] = [
  {
    title: "Услуги",
    href: "/services",
    children: [
      { title: "Пропуск на МКАД", href: "/services/propusk-mkad" },
      { title: "Пропуск на ТТК", href: "/services/propusk-ttk" },
      {
        title: "Пропуск на Садовое кольцо",
        href: "/services/propusk-sk",
      },
      { title: "Временный пропуск", href: "/services/vremennyj-propusk" },
      { title: "Регистрация в ГосЛог", href: "/goslog" },
      { title: "Переход на ЭТрН", href: "/etrn" },
    ],
  },
  { title: "Тарифы", href: "/pricing" },
  { title: "О компании", href: "/about" },
  { title: "Отзывы", href: "/reviews" },
  { title: "FAQ", href: "/faq" },
  { title: "Контакты", href: "/contacts" },
  { title: "Блог", href: "/blog" },
];

export const dashboardNav: NavItem[] = [
  { title: "Дашборд", href: "/dashboard" },
  { title: "Заявки", href: "/dashboard/orders" },
  { title: "Пропуска", href: "/dashboard/permits" },
  { title: "Транспорт", href: "/dashboard/vehicles" },
  { title: "Документы", href: "/dashboard/documents" },
  { title: "Оплата", href: "/dashboard/payments" },
  { title: "Уведомления", href: "/dashboard/notifications" },
  { title: "Настройки", href: "/dashboard/settings" },
];

export const footerNav: NavItem[] = [
  {
    title: "Услуги",
    href: "/services",
    children: [
      { title: "Пропуск на МКАД", href: "/services/propusk-mkad" },
      { title: "Пропуск на ТТК", href: "/services/propusk-ttk" },
      {
        title: "Пропуск на Садовое кольцо",
        href: "/services/propusk-sk",
      },
      { title: "Временный пропуск", href: "/services/vremennyj-propusk" },
      { title: "Регистрация в ГосЛог", href: "/goslog" },
      { title: "Переход на ЭТрН", href: "/etrn" },
    ],
  },
  {
    title: "Компания",
    href: "/about",
    children: [
      { title: "О компании", href: "/about" },
      { title: "Отзывы", href: "/reviews" },
      { title: "Блог", href: "/blog" },
      { title: "Контакты", href: "/contacts" },
    ],
  },
  {
    title: "Клиентам",
    href: "/faq",
    children: [
      { title: "FAQ", href: "/faq" },
      { title: "Тарифы", href: "/pricing" },
      { title: "Проверить статус", href: "/check-status" },
      {
        title: "Политика конфиденциальности",
        href: "/privacy",
      },
    ],
  },
];
