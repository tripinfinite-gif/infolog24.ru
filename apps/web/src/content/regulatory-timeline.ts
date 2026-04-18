export interface RegulatoryMilestone {
  id: string;
  date: string;
  displayDate: string;
  name: string;
  who: string;
  penalty: string;
  ctaLabel: string;
  /**
   * Тип CTA:
   * - "link" — обычный переход по ctaHref (страница с информацией + формой)
   * - "modal" — открывает QuickLeadModal с modalSource/modalContext
   *   (используется для горящих дедлайнов — форма конвертит быстрее чем страница)
   */
  ctaType: "link" | "modal";
  ctaHref?: string;          // для ctaType="link"
  modalSource?: string;      // для ctaType="modal" — source в /api/contacts
  modalContext?: Record<string, string>;  // для ctaType="modal" — контекст для CRM/email
  modalTitle?: string;       // заголовок модалки
  modalDescription?: string; // подзаголовок модалки
  status: "upcoming" | "urgent" | "active";
}

export const regulatoryTimeline: RegulatoryMilestone[] = [
  {
    id: "goslog-expeditors",
    date: "2026-04-30",
    displayDate: "30 апреля 2026",
    name: "ГосЛог: дедлайн для экспедиторов",
    who: "Экспедиторские компании — все, кто оформляет перевозки от имени грузоотправителя",
    penalty: "Штраф до 1 000 000 ₽ для юрлиц за работу без регистрации",
    // Горящий дедлайн — открываем форму сразу, не ведём на промежуточную страницу
    ctaLabel: "Помочь с регистрацией",
    ctaType: "modal",
    modalSource: "reg_goslog_expeditors",
    modalContext: {
      service: "ГосЛог — регистрация экспедитора",
      deadline: "30 апреля 2026",
      urgency: "горит",
    },
    modalTitle: "Регистрация в ГосЛог для экспедитора",
    modalDescription:
      "Успеем к 30 апреля. Оставьте телефон — перезвоним за 5 минут, расскажем что нужно и сделаем под ключ.",
    status: "urgent",
  },
  {
    id: "etrn-obligatory",
    date: "2026-09-01",
    displayDate: "1 сентября 2026",
    name: "ЭТрН: обязательный переход",
    who: "Все перевозчики и грузоотправители — без ЭДО возить нельзя",
    penalty: "Блокировка перевозки, штрафы за отсутствие электронной ТрН",
    ctaLabel: "Подготовиться к ЭТрН",
    ctaType: "link",
    ctaHref: "/etrn",
    status: "upcoming",
  },
  {
    id: "goslog-carriers",
    date: "2027-03-01",
    displayDate: "1 марта 2027",
    name: "ГосЛог: дедлайн для перевозчиков",
    who: "Все автомобильные перевозчики грузов по РФ",
    penalty: "Штраф до 1 000 000 ₽ + запрет на выполнение перевозок",
    ctaLabel: "Подготовиться к ГосЛог",
    ctaType: "link",
    ctaHref: "/goslog",
    status: "upcoming",
  },
  {
    id: "framework-expansion-2028",
    date: "2028-01-01",
    displayDate: "2028 год",
    name: "Расширение регуляторного каркаса",
    who: "Все грузоперевозчики — ужесточение требований к экоклассу Евро-3/4",
    penalty: "Отказ в выдаче пропусков для несоответствующих ТС",
    ctaLabel: "Получить напоминание",
    ctaType: "link",
    ctaHref: "/regulatorika/kalendar",
    status: "upcoming",
  },
];

/**
 * Возвращает количество дней от сегодняшнего дня до указанной даты (ISO).
 * Используется в UI для счётчика «осталось N дней до дедлайна».
 * Отрицательное значение означает, что дата в прошлом.
 */
export function getDaysUntil(dateIso: string): number {
  const target = new Date(dateIso);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.floor((target.getTime() - today.getTime()) / msPerDay);
}
