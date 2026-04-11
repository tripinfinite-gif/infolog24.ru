export interface DocumentTemplate {
  id: string;
  title: string;
  description: string;
  fileName: string;
  fileFormat: "pdf" | "docx";
  category: string;
}

export const documentTemplates: DocumentTemplate[] = [
  {
    id: "doverennost",
    title: "Доверенность на управление ТС",
    description:
      "Шаблон доверенности от собственника транспортного средства на право управления и представления интересов при оформлении пропуска.",
    fileName: "doverennost-na-upravlenie-ts",
    fileFormat: "docx",
    category: "Доверенности",
  },
  {
    id: "zayavlenie-propusk",
    title: "Заявление на получение пропуска",
    description:
      "Образец заявления на выдачу пропуска для грузового транспорта в Москву. Заполняется для каждого транспортного средства.",
    fileName: "zayavlenie-na-propusk",
    fileFormat: "docx",
    category: "Заявления",
  },
  {
    id: "checklist-mkad",
    title: "Чеклист документов для пропуска на МКАД",
    description:
      "Полный перечень документов, необходимых для оформления годового пропуска на МКАД. Используйте для самопроверки перед подачей.",
    fileName: "checklist-dokumentov-mkad",
    fileFormat: "pdf",
    category: "Чеклисты",
  },
  {
    id: "checklist-ttk-sk",
    title: "Чеклист документов для пропуска на ТТК/СК",
    description:
      "Расширенный перечень документов для оформления пропуска на ТТК и Садовое кольцо, включая требования к экоклассу и РНИС.",
    fileName: "checklist-dokumentov-ttk-sk",
    fileFormat: "pdf",
    category: "Чеклисты",
  },
  {
    id: "dogovor-obrazets",
    title: "Образец договора на оказание услуг",
    description:
      "Типовой договор на оказание услуг по оформлению пропуска для грузового транспорта. Заключается между клиентом и ООО «Инфолог24».",
    fileName: "dogovor-okazanie-uslug",
    fileFormat: "pdf",
    category: "Договоры",
  },
  {
    id: "marshrut-list",
    title: "Маршрутный лист",
    description:
      "Шаблон маршрутного листа с указанием точек загрузки и выгрузки. Необходим для оформления временного пропуска.",
    fileName: "marshrutnyj-list",
    fileFormat: "docx",
    category: "Маршруты",
  },
];
