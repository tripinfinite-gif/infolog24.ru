/**
 * Валидация загружаемых файлов.
 *
 * Что проверяем:
 * - Расширение/MIME совпадает с фактическим содержимым (magic bytes)
 * - Размер не превышает лимит (10 МБ)
 * - Имя файла безопасно (без спецсимволов, ограниченная длина)
 *
 * Разрешённые типы: PDF, JPEG, PNG.
 */
import { randomUUID } from "node:crypto";

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
export const MAX_FILENAME_LENGTH = 200;

export type AllowedFileType = "pdf" | "jpeg" | "png";

export interface FileValidationSuccess {
  valid: true;
  type: AllowedFileType;
  mimeType: string;
  sanitizedFilename: string;
  storageFilename: string;
  extension: string;
  size: number;
}

export interface FileValidationFailure {
  valid: false;
  error: string;
}

export type FileValidationResult =
  | FileValidationSuccess
  | FileValidationFailure;

// ── Magic bytes ──────────────────────────────────────────────────────────

interface FileTypeSignature {
  type: AllowedFileType;
  mimeType: string;
  extension: string;
  /** Байты в начале файла (offset 0), которые должны совпадать */
  signatures: number[][];
}

const FILE_SIGNATURES: FileTypeSignature[] = [
  {
    type: "pdf",
    mimeType: "application/pdf",
    extension: "pdf",
    signatures: [[0x25, 0x50, 0x44, 0x46]], // %PDF
  },
  {
    type: "jpeg",
    mimeType: "image/jpeg",
    extension: "jpg",
    signatures: [
      [0xff, 0xd8, 0xff, 0xe0],
      [0xff, 0xd8, 0xff, 0xe1],
      [0xff, 0xd8, 0xff, 0xe8],
      [0xff, 0xd8, 0xff, 0xdb],
      [0xff, 0xd8, 0xff, 0xee],
    ],
  },
  {
    type: "png",
    mimeType: "image/png",
    extension: "png",
    signatures: [[0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]],
  },
];

function matchesSignature(
  bytes: Uint8Array,
  signature: number[],
): boolean {
  if (bytes.length < signature.length) return false;
  for (let i = 0; i < signature.length; i++) {
    if (bytes[i] !== signature[i]) return false;
  }
  return true;
}

/**
 * Определяет тип файла по magic bytes.
 * Возвращает null, если тип не распознан.
 */
export function detectFileType(
  bytes: Uint8Array,
): FileTypeSignature | null {
  for (const sig of FILE_SIGNATURES) {
    for (const signature of sig.signatures) {
      if (matchesSignature(bytes, signature)) return sig;
    }
  }
  return null;
}

// ── Санитизация имени файла ──────────────────────────────────────────────

/**
 * Очищает имя файла от опасных символов.
 * - Убирает пути (../, /, \)
 * - Убирает управляющие символы
 * - Разрешены буквы (в т.ч. кириллица), цифры, пробел, точка, тире, подчёркивание
 * - Ограничивает длину
 */
export function sanitizeFilename(
  filename: string,
  maxLength: number = MAX_FILENAME_LENGTH,
): string {
  // Берём только basename (без путей)
  const basename = filename.replace(/^.*[\\/]/, "");
  // Удаляем управляющие символы
  const noControl = basename.replace(/[\x00-\x1f\x7f]/g, "");
  // Разрешаем буквы (Unicode), цифры, пробел, точку, тире, подчёркивание
  const cleaned = noControl.replace(/[^\p{L}\p{N}\s._-]/gu, "_");
  // Схлопываем повторяющиеся подчёркивания/пробелы
  const collapsed = cleaned.replace(/[_\s]+/g, "_").trim();
  // Убираем ведущие точки (скрытые файлы)
  const noLeadingDot = collapsed.replace(/^\.+/, "");

  if (noLeadingDot.length <= maxLength) return noLeadingDot;

  // Обрезаем, сохраняя расширение
  const dotIdx = noLeadingDot.lastIndexOf(".");
  if (dotIdx > 0 && noLeadingDot.length - dotIdx <= 10) {
    const ext = noLeadingDot.slice(dotIdx);
    const base = noLeadingDot.slice(0, maxLength - ext.length);
    return base + ext;
  }
  return noLeadingDot.slice(0, maxLength);
}

// ── Основная валидация ──────────────────────────────────────────────────

export interface ValidateFileInput {
  /** Оригинальное имя файла */
  filename: string;
  /** Размер файла в байтах */
  size: number;
  /** Заявленный MIME-тип (из заголовка) */
  mimeType: string;
  /** Содержимое файла для проверки magic bytes */
  content: Uint8Array | Buffer;
}

/**
 * Полная валидация файла: размер, имя, magic bytes, совпадение MIME.
 */
export function validateFile(input: ValidateFileInput): FileValidationResult {
  // 1. Размер
  if (input.size <= 0) {
    return { valid: false, error: "Файл пустой" };
  }
  if (input.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `Файл превышает максимальный размер ${MAX_FILE_SIZE / 1024 / 1024} МБ`,
    };
  }

  // 2. Имя
  if (!input.filename || input.filename.trim().length === 0) {
    return { valid: false, error: "Имя файла пустое" };
  }
  const sanitized = sanitizeFilename(input.filename);
  if (sanitized.length === 0) {
    return { valid: false, error: "Имя файла содержит только недопустимые символы" };
  }

  // 3. Magic bytes
  const head = input.content.subarray(0, 16);
  const detected = detectFileType(
    head instanceof Uint8Array ? head : new Uint8Array(head),
  );
  if (!detected) {
    return {
      valid: false,
      error: "Недопустимый тип файла. Разрешены только PDF, JPEG, PNG",
    };
  }

  // 4. Соответствие заявленного MIME-типа фактическому
  const declaredMime = input.mimeType.toLowerCase();
  const actualMime = detected.mimeType.toLowerCase();
  // jpeg разрешаем в обоих вариантах (image/jpeg и image/jpg)
  const mimeMatches =
    declaredMime === actualMime ||
    (detected.type === "jpeg" && declaredMime === "image/jpg");
  if (!mimeMatches) {
    return {
      valid: false,
      error: `MIME-тип не совпадает с содержимым файла. Заявлен: ${input.mimeType}, фактический: ${actualMime}`,
    };
  }

  // 5. Генерируем UUID для хранения
  const storageFilename = `${randomUUID()}.${detected.extension}`;

  return {
    valid: true,
    type: detected.type,
    mimeType: detected.mimeType,
    sanitizedFilename: sanitized,
    storageFilename,
    extension: detected.extension,
    size: input.size,
  };
}
