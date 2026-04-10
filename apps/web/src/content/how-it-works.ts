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
      "Оставьте заявку или позвоните. Мы ответим за 5 минут и расскажем, что нужно для вашего случая.",
    icon: "FileText",
    duration: "15 минут",
  },
  {
    number: 2,
    title: "Документы",
    description:
      "Пришлите фото документов в WhatsApp или Telegram. Мы проверим комплект и подготовим заявку за вас.",
    icon: "FolderOpen",
    duration: "1 день",
  },
  {
    number: 3,
    title: "Оформление",
    description:
      "Подаём заявку в Дептранс и сопровождаем на каждом этапе. Временный пропуск — сразу, чтобы вы не простаивали.",
    icon: "ClipboardCheck",
    duration: "1–3 дня",
  },
  {
    number: 4,
    title: "Готово",
    description:
      "Получаете годовой пропуск и уведомление. Работаете спокойно — мы напомним о продлении за 30 дней.",
    icon: "CheckCircle",
  },
];
