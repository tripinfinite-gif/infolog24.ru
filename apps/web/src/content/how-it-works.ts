export interface Step {
  number: number;
  title: string;
  description: string;
  icon: string;
  duration?: string;
}

export const steps: Step[] = [
  {
    number: 1,
    title: "Заявка",
    description:
      "Оставьте заявку на сайте, позвоните или напишите в WhatsApp/Telegram. Мы перезвоним в течение 15 минут и ответим на все вопросы.",
    icon: "FileText",
    duration: "5 минут",
  },
  {
    number: 2,
    title: "Документы",
    description:
      "Отправьте нам копии документов удобным способом — по email, в мессенджере или через личный кабинет. Мы проверим комплектность и правильность заполнения.",
    icon: "FolderOpen",
    duration: "1 день",
  },
  {
    number: 3,
    title: "Оплата",
    description:
      "Оплатите услугу удобным способом: картой на сайте, безналичным переводом или наличными. Для юрлиц — счёт с актом.",
    icon: "CreditCard",
    duration: "5 минут",
  },
  {
    number: 4,
    title: "Оформление",
    description:
      "Мы подаём заявку в Департамент транспорта и сопровождаем процесс на всех этапах. На это время вы получаете бесплатный временный пропуск.",
    icon: "ClipboardCheck",
    duration: "1–7 дней",
  },
  {
    number: 5,
    title: "Получение",
    description:
      "Вы получаете готовый пропуск и уведомление. Пропуск начинает действовать сразу — можно выезжать на маршрут.",
    icon: "CheckCircle",
  },
];
