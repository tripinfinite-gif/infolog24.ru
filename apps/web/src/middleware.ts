import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Rate limiting using in-memory map (simple, for MVP)
const rateLimitMap = new Map<string, { count: number; timestamp: number }>();

function rateLimit(
  ip: string,
  limit: number = 60,
  windowMs: number = 60000,
): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now - entry.timestamp > windowMs) {
    rateLimitMap.set(ip, { count: 1, timestamp: now });
    return false;
  }

  entry.count++;
  return entry.count > limit;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Rate limit API routes
  if (pathname.startsWith("/api/") && !pathname.startsWith("/api/health")) {
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    if (rateLimit(ip)) {
      return NextResponse.json(
        { error: "Too many requests" },
        { status: 429 },
      );
    }
  }

  // Protect dashboard routes
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/admin")) {
    // Auth check will be done in layout/page level with Better Auth
    // Middleware just ensures the cookie exists
    const sessionCookie = request.cookies.get("better-auth.session_token");
    if (!sessionCookie) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*", "/dashboard/:path*", "/admin/:path*"],
};
