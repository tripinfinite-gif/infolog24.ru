export interface PainSystem {
  id: string;
  name: string;
  pain: string;
  iconName: string;
}

export const painSystems: PainSystem[] = [
  {
    id: "propusk",
    name: "Пропуск",
    pain: "7 500 ₽ штрафа за каждую камеру. 43 камеры × 5 000 = 215 000 за один рейс",
    iconName: "FileCheck",
  },
  {
    id: "rnis",
    name: "РНИС",
    pain: "Одна минута без передачи данных → автоматическая аннуляция",
    iconName: "Satellite",
  },
  {
    id: "etrn",
    name: "ЭТрН",
    pain: "С 01.09.2026 обязательна. Нет ЭДО — нельзя возить",
    iconName: "FileText",
  },
  {
    id: "goslog",
    name: "ГосЛог",
    pain: "Экспедиторы — дедлайн 30.04.2026. Штраф до 1 млн ₽",
    iconName: "Building",
  },
  {
    id: "tahograf",
    name: "Тахограф",
    pain: "Неправильные перерывы → блокировка водителя",
    iconName: "Clock",
  },
  {
    id: "diagnosticheskaya-karta",
    name: "Диагностическая карта",
    pain: "Просрочил на день → пропуск аннулируют",
    iconName: "Stethoscope",
  },
];
