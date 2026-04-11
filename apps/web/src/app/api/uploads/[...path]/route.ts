import { NextRequest } from "next/server";
import { promises as fs } from "node:fs";
import path from "node:path";
import { getSession } from "@/lib/auth/session";

export const runtime = "nodejs";

const UPLOADS_ROOT = path.resolve(process.cwd(), "uploads");

const MIME_BY_EXT: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  heic: "image/heic",
  heif: "image/heic",
  pdf: "application/pdf",
};

/**
 * GET /api/uploads/<userId>/<orderId>/<filename>
 *
 * Отдаёт локально сохранённый файл из uploads/. Используется как
 * fallback для dev-окружения, когда S3 не настроен.
 *
 * Безопасность:
 *  - userId в пути должен совпадать с userId сессии (или сессия admin)
 *  - path traversal: жёсткая проверка через path.resolve и startsWith
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const session = await getSession();
  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { path: segments } = await params;
  if (!Array.isArray(segments) || segments.length < 3) {
    return new Response("Bad Request", { status: 400 });
  }

  const [requestedUserId, ...rest] = segments;
  const role = (session.user as { role?: string }).role;
  if (requestedUserId !== session.user.id && role !== "admin" && role !== "manager") {
    return new Response("Forbidden", { status: 403 });
  }

  // Жёсткая проверка path traversal
  const requestedPath = path.join(UPLOADS_ROOT, requestedUserId, ...rest);
  const resolvedPath = path.resolve(requestedPath);
  if (!resolvedPath.startsWith(UPLOADS_ROOT + path.sep)) {
    return new Response("Forbidden", { status: 403 });
  }

  try {
    const buffer = await fs.readFile(resolvedPath);
    const ext = (resolvedPath.split(".").pop() ?? "").toLowerCase();
    const mime = MIME_BY_EXT[ext] ?? "application/octet-stream";
    return new Response(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type": mime,
        "Cache-Control": "private, no-cache",
      },
    });
  } catch {
    return new Response("Not Found", { status: 404 });
  }
}
