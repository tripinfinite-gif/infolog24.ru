import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { validateCsrf } from "@/lib/security/csrf";

// ВАЖНО: middleware работает в Edge Runtime — нельзя импортировать ioredis,
// node:net, node:fs и т.п. Rate-limit вынесен в API routes (Node Runtime).

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

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const origin = request.headers.get("origin");

  // ── CORS preflight ────────────────────────────────────────────────────
  if (request.method === "OPTIONS" && pathname.startsWith("/api/")) {
    const response = new NextResponse(null, { status: 204 });
    return applyCors(response, origin);
  }

  // ── CSRF для мутирующих API-запросов (Edge-совместимо) ────────────────
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

  // ── Защита dashboard/admin ────────────────────────────────────────────
  // Лёгкая cookie-проверка. Полная валидация сессии — в layout.tsx.
  // Better Auth ставит cookie с префиксом '__Secure-' на HTTPS (продакшен)
  // и без префикса на HTTP (локальная разработка) — проверяем оба варианта.
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/admin")) {
    const sessionCookie =
      request.cookies.get("__Secure-better-auth.session_token") ??
      request.cookies.get("better-auth.session_token");
    if (!sessionCookie) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // ── Защита партнёрского портала ───────────────────────────────────────
  // Публичные: /partner/login, /partner/register, /partner/forgot-password.
  // Полная валидация роли — в layout.tsx (server component).
  if (
    pathname.startsWith("/partner") &&
    !pathname.startsWith("/partner/login") &&
    !pathname.startsWith("/partner/register") &&
    !pathname.startsWith("/partner/forgot-password")
  ) {
    const sessionCookie =
      request.cookies.get("__Secure-better-auth.session_token") ??
      request.cookies.get("better-auth.session_token");
    if (!sessionCookie) {
      return NextResponse.redirect(new URL("/partner/login", request.url));
    }
  }

  const response = NextResponse.next();
  if (pathname.startsWith("/api/")) {
    return applyCors(response, origin);
  }
  return response;
}

// ВАЖНО: matcher исключает /api/health (healthcheck должен работать всегда).
// Rate-limiting перенесён в каждый API route индивидуально (Node Runtime).
export const config = {
  matcher: [
    "/api/((?!health).*)",
    "/dashboard/:path*",
    "/admin/:path*",
    "/partner/:path*",
  ],
};
