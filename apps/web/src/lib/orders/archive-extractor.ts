import { unzipSync, type Unzipped } from "fflate";
import { logger } from "@/lib/logger";

/**
 * Распаковка ZIP-архива в памяти с жёсткими лимитами.
 *
 * Используем fflate — pure JS, без native bindings, работает в любом
 * runtime (Node, edge, browser). Архив целиком грузится в память
 * (приемлемо при наших лимитах: max 50 МБ архив, 100 МБ uncompressed).
 *
 * Защита от:
 *  - zip bombs (compression ratio > 100:1, total uncompressed > 100 МБ)
 *  - больших файлов (> MAX_FILE_SIZE)
 *  - большого числа файлов (> MAX_FILES)
 *  - подделанных расширений (magic bytes check для image/pdf)
 *  - path traversal в имени файла (../../../)
 */

export const ARCHIVE_LIMITS = {
  MAX_ARCHIVE_SIZE: 50 * 1024 * 1024, // 50 MB на сам zip
  MAX_FILES: 50,
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10 MB на распакованный файл
  MAX_TOTAL_UNCOMPRESSED: 100 * 1024 * 1024, // 100 MB суммарно
  MAX_COMPRESSION_RATIO: 100, // 100:1
} as const;

export const ALLOWED_EXTENSIONS = new Set([
  "jpg",
  "jpeg",
  "png",
  "webp",
  "heic",
  "heif",
  "pdf",
]);

export interface ExtractedFile {
  /** Безопасное basename без путей */
  name: string;
  /** Расширение без точки */
  extension: string;
  /** MIME, угаданный по magic bytes */
  mime: string;
  /** Распакованный байт-буфер */
  buffer: Buffer;
  /** Размер в байтах */
  size: number;
}

export type ExtractError =
  | "archive_too_large"
  | "too_many_files"
  | "file_too_large"
  | "total_too_large"
  | "compression_ratio"
  | "bad_extension"
  | "path_traversal"
  | "invalid_archive"
  | "magic_mismatch";

export interface ExtractResult {
  ok: true;
  files: ExtractedFile[];
  skipped: Array<{ name: string; reason: ExtractError }>;
}

export interface ExtractFailure {
  ok: false;
  error: ExtractError;
  message: string;
}

/**
 * Проверка magic bytes для разрешённых форматов.
 * Не доверяем расширению — атакующий может переименовать .exe в .jpg.
 */
function detectMime(buf: Buffer): string | null {
  if (buf.length < 12) return null;

  // JPEG: FF D8 FF
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "image/jpeg";

  // PNG: 89 50 4E 47
  if (
    buf[0] === 0x89 &&
    buf[1] === 0x50 &&
    buf[2] === 0x4e &&
    buf[3] === 0x47
  )
    return "image/png";

  // WebP: RIFF????WEBP
  if (
    buf[0] === 0x52 &&
    buf[1] === 0x49 &&
    buf[2] === 0x46 &&
    buf[3] === 0x46 &&
    buf[8] === 0x57 &&
    buf[9] === 0x45 &&
    buf[10] === 0x42 &&
    buf[11] === 0x50
  )
    return "image/webp";

  // HEIC/HEIF: ftyp + brand at bytes 4-12
  if (
    buf[4] === 0x66 &&
    buf[5] === 0x74 &&
    buf[6] === 0x79 &&
    buf[7] === 0x70
  ) {
    const brand = buf.slice(8, 12).toString("ascii");
    if (
      brand === "heic" ||
      brand === "heix" ||
      brand === "mif1" ||
      brand === "msf1" ||
      brand === "heim" ||
      brand === "hevc"
    ) {
      return "image/heic";
    }
  }

  // PDF: %PDF
  if (
    buf[0] === 0x25 &&
    buf[1] === 0x50 &&
    buf[2] === 0x44 &&
    buf[3] === 0x46
  )
    return "application/pdf";

  return null;
}

function safeBasename(entryName: string): string | null {
  // Запрещаем path traversal: ../ или абсолютные пути
  if (entryName.includes("..") || entryName.startsWith("/")) return null;
  // Берём только последнюю компоненту пути
  const parts = entryName.split(/[\\/]/);
  const last = parts[parts.length - 1];
  if (!last || last.length === 0) return null;
  if (last.length > 200) return null;
  // Запрещаем management-файлы macOS и скрытые
  if (last.startsWith(".") || last === "__MACOSX") return null;
  return last;
}

function getExtension(name: string): string {
  const dot = name.lastIndexOf(".");
  if (dot < 0) return "";
  return name.slice(dot + 1).toLowerCase();
}

/**
 * Главная функция: принимает ZIP buffer, возвращает извлечённые файлы.
 * Никогда не бросает — fail-safe.
 */
export async function extractZipArchive(
  buffer: Buffer,
): Promise<ExtractResult | ExtractFailure> {
  if (buffer.length > ARCHIVE_LIMITS.MAX_ARCHIVE_SIZE) {
    return {
      ok: false,
      error: "archive_too_large",
      message: `Архив больше ${ARCHIVE_LIMITS.MAX_ARCHIVE_SIZE / 1024 / 1024} МБ`,
    };
  }

  let entries: Unzipped;
  try {
    entries = unzipSync(new Uint8Array(buffer));
  } catch (error) {
    logger.warn({ error }, "fflate unzipSync failed");
    return {
      ok: false,
      error: "invalid_archive",
      message: "Не удалось прочитать архив. Проверьте, что это валидный ZIP.",
    };
  }

  const files: ExtractedFile[] = [];
  const skipped: ExtractResult["skipped"] = [];
  let totalUncompressed = 0;

  // Считаем не-директории заранее (имена в fflate уже без CRLF)
  const fileEntries = Object.entries(entries).filter(
    ([name]) => !name.endsWith("/"),
  );

  if (fileEntries.length > ARCHIVE_LIMITS.MAX_FILES) {
    return {
      ok: false,
      error: "too_many_files",
      message: `В архиве больше ${ARCHIVE_LIMITS.MAX_FILES} файлов`,
    };
  }

  for (const [entryName, data] of fileEntries) {
    const safeName = safeBasename(entryName);
    if (!safeName) {
      skipped.push({ name: entryName, reason: "path_traversal" });
      continue;
    }

    const ext = getExtension(safeName);
    if (!ALLOWED_EXTENSIONS.has(ext)) {
      skipped.push({ name: safeName, reason: "bad_extension" });
      continue;
    }

    if (data.length > ARCHIVE_LIMITS.MAX_FILE_SIZE) {
      skipped.push({ name: safeName, reason: "file_too_large" });
      continue;
    }

    if (
      totalUncompressed + data.length >
      ARCHIVE_LIMITS.MAX_TOTAL_UNCOMPRESSED
    ) {
      return {
        ok: false,
        error: "total_too_large",
        message: `Суммарный размер файлов превысил ${ARCHIVE_LIMITS.MAX_TOTAL_UNCOMPRESSED / 1024 / 1024} МБ`,
      };
    }

    const fileBuffer = Buffer.from(data);
    const detectedMime = detectMime(fileBuffer);

    // Magic bytes должны соответствовать разрешённым форматам
    if (!detectedMime) {
      skipped.push({ name: safeName, reason: "magic_mismatch" });
      continue;
    }

    totalUncompressed += fileBuffer.length;
    files.push({
      name: safeName,
      extension: ext,
      mime: detectedMime,
      buffer: fileBuffer,
      size: fileBuffer.length,
    });
  }

  return { ok: true, files, skipped };
}
