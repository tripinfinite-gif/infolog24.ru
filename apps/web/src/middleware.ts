import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { validateCsrf } from "@/lib/security/csrf";
import { getClientIp, rateLimit, rateLimitResponse } from "@/lib/security/rate-limit";

// ── CORS конфигурация ────────────────────────────────────────────────────

const ALLOWED_ORIGINS = new Set([
  "https://inlog24.ru",
  "https://www.inlog24.ru",
  "https://test.inlog24.ru",
  "https://infolog24.ru",
  "https://www.infolog24.ru",
  "http://localhost:3000",
]);

const CORS_METHODS = "GET, POST, PATCH, DELETE, OPTIONS";
const CORS_HEADERS = "Content-Type, Authorization, X-CSRF-Token";
const CORS_MAX_AGE = "86400";

function buildCorsHeaders(origin: string | null): Headers {
  const headers = new Headers();
  if (origin && ALLOWED_ORIGINS.has(origin)) {
    headers.set("Access-Control-Allow-Origin", origin);
    headers.set("Vary", "Origin");
    headers.set("Access-Control-Allow-Credentials", "true");
    headers.set("Access-Control-Allow-Methods", CORS_METHODS);
    headers.set("Access-Control-Allow-Headers", CORS_HEADERS);
    headers.set("Access-Control-Max-Age", CORS_MAX_AGE);
  }
  return headers;
}

function applyCors(response: NextResponse, origin: string | null): NextResponse {
  const cors = buildCorsHeaders(origin);
  cors.forEach((value, key) => response.headers.set(key, value));
  return response;
}

// ── Пути, исключённые из rate-limit через middleware ───────────────────
// (имеют свои точечные лимиты или критичны для мониторинга)
const RATE_LIMIT_SKIP_PATHS = [
  "/api/health",
  "/api/auth/", // rate limit ставится локально
  "/api/chat", // rate limit ставится локально (anonymous vs auth)
  "/api/contacts", // rate limit ставится локально (contact-form)
  "/api/payments/webhook", // IP allowlist
  "/api/telegram", // secret header
  "/api/cron/", // CRON_SECRET
  "/api/documents/upload-url", // file-upload
  "/api/documents", // file-upload
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const origin = request.headers.get("origin");

  // ── CORS preflight ────────────────────────────────────────────────────
  if (request.method === "OPTIONS" && pathname.startsWith("/api/")) {
    const response = new NextResponse(null, { status: 204 });
    return applyCors(response, origin);
  }

  // ── CSRF для мутирующих API-запросов ──────────────────────────────────
  if (pathname.startsWith("/api/")) {
    const csrf = validateCsrf(request);
    if (!csrf.valid) {
      const response = NextResponse.json(
        { error: "CSRF validation failed", reason: csrf.reason },
        { status: 403 },
      );
      return applyCors(response, origin);
    }
  }

  // ── Общий rate-limit для API ──────────────────────────────────────────
  if (pathname.startsWith("/api/")) {
    const skip = RATE_LIMIT_SKIP_PATHS.some((p) => pathname.startsWith(p));
    if (!skip) {
      const ip = getClientIp(request);
      const result = await rateLimit("api-general", ip);
      if (!result.success) {
        return applyCors(rateLimitResponse(result), origin);
      }
    }
  }

  // ── Защита dashboard/admin ────────────────────────────────────────────
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/admin")) {
    const sessionCookie = request.cookies.get("better-auth.session_token");
    if (!sessionCookie) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  const response = NextResponse.next();
  if (pathname.startsWith("/api/")) {
    return applyCors(response, origin);
  }
  return response;
}

export const config = {
  matcher: ["/api/:path*", "/dashboard/:path*", "/admin/:path*"],
};
