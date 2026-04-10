/**
 * Document Completeness Checker
 *
 * Determines which documents are required for a given pass type / zone
 * and checks whether the uploaded set is complete.
 */

export interface DocumentRequirement {
  type: string;
  label: string;
  required: boolean;
  description: string;
}

/** Base documents required for every application. */
const BASE_REQUIREMENTS: DocumentRequirement[] = [
  {
    type: "pts",
    label: "ПТС",
    required: true,
    description: "Паспорт транспортного средства",
  },
  {
    type: "sts",
    label: "СТС",
    required: true,
    description: "Свидетельство о регистрации ТС",
  },
  {
    type: "driver_license",
    label: "Водительское удостоверение",
    required: true,
    description: "Действующее водительское удостоверение соответствующей категории",
  },
];

/** Extra requirements keyed by pass type or zone. */
const CONDITIONAL_REQUIREMENTS: {
  condition: (passType: string, zone: string) => boolean;
  requirement: DocumentRequirement;
}[] = [
  {
    condition: () => true, // always shown, but optional unless not owner
    requirement: {
      type: "power_of_attorney",
      label: "Доверенность",
      required: false,
      description:
        "Доверенность на право управления ТС (обязательна, если водитель не является собственником)",
    },
  },
  {
    condition: () => true, // always shown for legal entities, optional otherwise
    requirement: {
      type: "company_registration",
      label: "Свидетельство о регистрации юрлица",
      required: false,
      description:
        "ОГРН / ОГРНИП — требуется для юридических лиц и ИП",
    },
  },
  {
    // ГЛОНАСС / РНИС — только для годового МКАД
    condition: (passType: string, zone: string) =>
      zone === "mkad" && (passType === "mkad_day" || passType === "mkad_night"),
    requirement: {
      type: "glonass_certificate",
      label: "Свидетельство ГЛОНАСС / РНИС",
      required: true,
      description:
        "Свидетельство об оснащении ТС аппаратурой ГЛОНАСС / РНИС (для годового пропуска на МКАД)",
    },
  },
  {
    // Экологический класс — для ТТК и СК
    condition: (_passType: string, zone: string) =>
      zone === "ttk" || zone === "sk",
    requirement: {
      type: "eco_certificate",
      label: "Сертификат экологического класса",
      required: true,
      description:
        "Документ, подтверждающий экологический класс ТС (требуется для пропуска в зону ТТК / СК)",
    },
  },
];

/**
 * Return the full list of required documents for the given pass type and zone.
 */
export function getRequiredDocuments(
  passType: string,
  zone: string,
): DocumentRequirement[] {
  const requirements = [...BASE_REQUIREMENTS];

  for (const { condition, requirement } of CONDITIONAL_REQUIREMENTS) {
    if (condition(passType, zone)) {
      requirements.push(requirement);
    }
  }

  return requirements;
}

/**
 * Check whether the set of uploaded documents satisfies the requirements
 * for the given pass type and zone.
 */
export function checkDocumentCompleteness(
  passType: string,
  zone: string,
  uploadedDocuments: { type: string; status: string }[],
): {
  isComplete: boolean;
  missing: DocumentRequirement[];
  rejected: string[];
  progress: number;
} {
  const requirements = getRequiredDocuments(passType, zone);
  const requiredDocs = requirements.filter((r) => r.required);

  const uploadedByType = new Map(
    uploadedDocuments.map((d) => [d.type, d.status]),
  );

  const missing: DocumentRequirement[] = [];
  const rejected: string[] = [];
  let approvedCount = 0;

  for (const req of requiredDocs) {
    const status = uploadedByType.get(req.type);

    if (!status) {
      missing.push(req);
    } else if (status === "rejected") {
      rejected.push(req.type);
      missing.push(req); // rejected docs still count as missing
    } else if (status === "approved") {
      approvedCount++;
    }
    // "pending" — uploaded but not yet reviewed: not missing, not approved
  }

  const total = requiredDocs.length;
  const progress = total === 0 ? 100 : Math.round((approvedCount / total) * 100);

  return {
    isComplete: missing.length === 0 && rejected.length === 0,
    missing,
    rejected,
    progress,
  };
}
