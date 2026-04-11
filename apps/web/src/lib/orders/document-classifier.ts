import { extractVehicleDoc, isVisionEnabled } from "@/lib/chat/vision";
import { logger } from "@/lib/logger";
import type { ExtractedFile } from "./archive-extractor";

/**
 * Классификация распакованных файлов по типу документа.
 *
 * Стратегия:
 *   1. Если P4.1 OCR vision активен — для каждого изображения зовём
 *      extractVehicleDoc, по полю documentType определяем тип. Также
 *      собираем извлечённые данные грузовика (для предзаполнения
 *      vehicle при создании заявки).
 *   2. Если OCR не активен — пытаемся определить по имени файла
 *      (heuristic: «стс», «свидетельство» → sts, «доверенность» → power_of_attorney
 *      и т.д.). Что не распозналось — type = "other".
 *
 * Никогда не падает: при ошибке OCR fallback на heuristic.
 */

export type DocumentTypeCode =
  | "pts"
  | "sts"
  | "driver_license"
  | "power_of_attorney"
  | "application"
  | "contract"
  | "other";

export interface ClassifiedFile extends ExtractedFile {
  type: DocumentTypeCode;
  confidence: "high" | "medium" | "low";
  source: "ocr" | "heuristic" | "default";
}

export interface ClassificationResult {
  files: ClassifiedFile[];
  /** Извлечённые из СТС/ПТС данные грузовика для предзаполнения. */
  vehicleHint?: {
    licensePlate?: string | null;
    vin?: string | null;
    brand?: string | null;
    model?: string | null;
    year?: number | null;
    ecoClass?: string | null;
    maxWeightKg?: number | null;
  };
}

const NAME_HEURISTICS: Array<{
  pattern: RegExp;
  type: DocumentTypeCode;
  confidence: "medium" | "low";
}> = [
  { pattern: /(\bстс\b|свидетельств)/i, type: "sts", confidence: "medium" },
  { pattern: /(\bптс\b|паспорт.*тс|паспорт.*транс)/i, type: "pts", confidence: "medium" },
  { pattern: /доверен/i, type: "power_of_attorney", confidence: "medium" },
  { pattern: /(\bву\b|водит.*удостовер|права)/i, type: "driver_license", confidence: "medium" },
  { pattern: /(договор|контракт)/i, type: "contract", confidence: "medium" },
  { pattern: /(заявлен|заявк)/i, type: "application", confidence: "low" },
];

function classifyByName(name: string): {
  type: DocumentTypeCode;
  confidence: "medium" | "low";
} {
  for (const h of NAME_HEURISTICS) {
    if (h.pattern.test(name)) {
      return { type: h.type, confidence: h.confidence };
    }
  }
  return { type: "other", confidence: "low" };
}

function mapOcrTypeToCode(
  ocrType: "sts" | "pts" | "unknown" | string,
): DocumentTypeCode {
  if (ocrType === "sts") return "sts";
  if (ocrType === "pts") return "pts";
  return "other";
}

export async function classifyFiles(
  files: ExtractedFile[],
): Promise<ClassificationResult> {
  const visionOn = isVisionEnabled();
  const classified: ClassifiedFile[] = [];
  let vehicleHint: ClassificationResult["vehicleHint"];

  for (const file of files) {
    // PDF — OCR не поддерживается (vision у нас на изображениях),
    // классифицируем по имени.
    if (file.extension === "pdf") {
      const byName = classifyByName(file.name);
      classified.push({
        ...file,
        type: byName.type,
        confidence: byName.confidence,
        source: "heuristic",
      });
      continue;
    }

    if (visionOn) {
      try {
        const dataUrl = `data:${file.mime};base64,${file.buffer.toString("base64")}`;
        const result = await extractVehicleDoc(dataUrl);
        const code = mapOcrTypeToCode(result.documentType);
        if (code !== "other" && result.confidence !== "low") {
          classified.push({
            ...file,
            type: code,
            confidence: result.confidence,
            source: "ocr",
          });

          // Первый успешно распознанный СТС/ПТС → берём как vehicleHint
          if (!vehicleHint && (code === "sts" || code === "pts")) {
            vehicleHint = {
              licensePlate: result.licensePlate,
              vin: result.vin,
              brand: result.brand,
              model: result.model,
              year: result.year,
              ecoClass: result.ecoClass,
              maxWeightKg: result.maxWeightKg,
            };
          }
          continue;
        }
      } catch (error) {
        logger.warn(
          { error, file: file.name },
          "OCR classification failed — falling back to heuristic",
        );
      }
    }

    // Fallback: heuristic по имени
    const byName = classifyByName(file.name);
    classified.push({
      ...file,
      type: byName.type,
      confidence: byName.confidence,
      source: visionOn ? "default" : "heuristic",
    });
  }

  return { files: classified, vehicleHint };
}
