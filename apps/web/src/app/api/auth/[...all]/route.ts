import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";
import {
  getClientIp,
  rateLimit,
  rateLimitResponse,
  type RateLimitKey,
} from "@/lib/security/rate-limit";

const handlers = toNextJsHandler(auth);

/**
 * Определяет категорию rate-limit для auth-endpoint'а по pathname.
 * - `/reset-password`, `/forget-password` → auth-password-reset
 * - все остальные (login, register, 2fa…) → auth-login
 */
function getAuthRateLimitKey(pathname: string): RateLimitKey {
  if (
    pathname.includes("reset-password") ||
    pathname.includes("forget-password") ||
    pathname.includes("request-password")
  ) {
    return "auth-password-reset";
  }
  return "auth-login";
}

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const pathname = new URL(request.url).pathname;
  const key = getAuthRateLimitKey(pathname);
  const rl = await rateLimit(key, ip);
  if (!rl.success) return rateLimitResponse(rl);
  return handlers.POST(request);
}

export const GET = handlers.GET;
