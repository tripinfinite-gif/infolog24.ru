import JSZip from "jszip";
import { logger } from "@/lib/logger";

// Допустимые типы из schema (document_type_enum)
export type DocumentType =
  | "pts"
  | "sts"
  | "driver_license"
  | "power_of_attorney"
  | "application"
  | "contract"
  | "other";

export interface ParsedFile {
  /** Имя файла внутри архива (без пути) */
  name: string;
  /** Полный путь внутри архива */
  path: string;
  /** Распознанный тип документа */
  type: DocumentType;
  /** Уверенность классификации (0..1). 1.0 — точное совпадение, ниже — эвристика. */
  confidence: number;
  /** Размер файла */
  size: number;
  /** Содержимое */
  content: Buffer;
  /** MIME-тип, определённый по расширению */
  mimeType: string;
}

export interface ArchiveParseResult {
  files: ParsedFile[];
  /** Файлы, которые не прошли валидацию (слишком большие, странный тип) */
  rejected: { name: string; reason: string }[];
  /** Общее количество файлов в архиве */
  totalEntries: number;
}

const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10 MB на каждый файл
const MAX_TOTAL_BYTES = 50 * 1024 * 1024; // 50 MB суммарно
const MAX_FILES = 30;

const SUPPORTED_EXTENSIONS: Record<string, string> = {
  ".pdf": "application/pdf",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
};

/**
 * Классификатор по нормализованному имени файла.
 * Порядок проверки важен — более специфичные паттерны идут первыми.
 * Возвращает { type, confidence } где confidence:
 *  - 1.0 если совпадает точное ключевое слово (e.g. "pts.pdf")
 *  - 0.8 если содержит ключевое слово
 *  - 0.0 если ничего не подошло (-> type="other")
 */
const PATTERNS: { type: DocumentType; keywords: string[] }[] = [
  // ПТС — паспорт транспортного средства
  { type: "pts", keywords: ["pts", "птс", "passporttc", "passport_ts", "passport-ts"] },
  // СТС — свидетельство о регистрации
  { type: "sts", keywords: ["sts", "стс", "svidetelstvo", "registration"] },
  // Водительское удостоверение
  {
    type: "driver_license",
    keywords: ["vu", "voditel", "driver", "license", "права", "driving"],
  },
  // Доверенность
  {
    type: "power_of_attorney",
    keywords: ["dover", "доверен", "poa", "power_of_attorney", "powerofattorney"],
  },
  // Заявление
  {
    type: "application",
    keywords: ["zayavlenie", "заявлен", "application", "zayavka", "request"],
  },
  // Договор
  { type: "contract", keywords: ["dogovor", "договор", "contract", "agreement"] },
];

export function classifyFileName(fileName: string): {
  type: DocumentType;
  confidence: number;
} {
  const lower = fileName.toLowerCase().replace(/[\s_\-.]+/g, "");
  for (const p of PATTERNS) {
    for (const kw of p.keywords) {
      const norm = kw.toLowerCase().replace(/[\s_\-.]+/g, "");
      if (lower === norm || lower.startsWith(norm) || lower.endsWith(norm)) {
        return { type: p.type, confidence: 1.0 };
      }
      if (lower.includes(norm)) {
        return { type: p.type, confidence: 0.8 };
      }
    }
  }
  return { type: "other", confidence: 0 };
}

function getMimeFromExtension(name: string): string | null {
  const lower = name.toLowerCase();
  for (const ext of Object.keys(SUPPORTED_EXTENSIONS)) {
    if (lower.endsWith(ext)) return SUPPORTED_EXTENSIONS[ext]!;
  }
  return null;
}

/**
 * Распаковывает ZIP-архив в память, классифицирует содержимое.
 * Бросает Error при невалидном архиве.
 */
export async function parseArchive(buffer: Buffer): Promise<ArchiveParseResult> {
  let zip: JSZip;
  try {
    zip = await JSZip.loadAsync(buffer);
  } catch (err) {
    logger.warn({ err }, "Invalid zip archive");
    throw new Error("Архив повреждён или не является ZIP-файлом");
  }

  const files: ParsedFile[] = [];
  const rejected: { name: string; reason: string }[] = [];
  let totalBytes = 0;
  let totalEntries = 0;

  const entries = Object.values(zip.files);
  for (const entry of entries) {
    if (entry.dir) continue;
    totalEntries++;

    if (totalEntries > MAX_FILES) {
      rejected.push({
        name: entry.name,
        reason: "Слишком много файлов в архиве (макс 30)",
      });
      continue;
    }

    const baseName = entry.name.split("/").pop() ?? entry.name;
    if (baseName.startsWith(".") || baseName.startsWith("__MACOSX")) continue;

    const mime = getMimeFromExtension(baseName);
    if (!mime) {
      rejected.push({
        name: baseName,
        reason: "Неподдерживаемый тип файла (нужен PDF/JPG/PNG)",
      });
      continue;
    }

    const content = await entry.async("nodebuffer");
    if (content.length === 0) {
      rejected.push({ name: baseName, reason: "Файл пустой" });
      continue;
    }
    if (content.length > MAX_FILE_BYTES) {
      rejected.push({ name: baseName, reason: "Файл больше 10 МБ" });
      continue;
    }
    totalBytes += content.length;
    if (totalBytes > MAX_TOTAL_BYTES) {
      rejected.push({
        name: baseName,
        reason: "Суммарный размер архива больше 50 МБ",
      });
      break;
    }

    const { type, confidence } = classifyFileName(baseName);
    files.push({
      name: baseName,
      path: entry.name,
      type,
      confidence,
      size: content.length,
      content,
      mimeType: mime,
    });
  }

  logger.info(
    { totalEntries, accepted: files.length, rejected: rejected.length },
    "Archive parsed",
  );

  return { files, rejected, totalEntries };
}
