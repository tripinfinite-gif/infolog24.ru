/**
 * Базовый URL сайта. Берётся из env, fallback — infolog24.ru (прод после
 * переезда с Joomla 21.04.2026). Env NEXT_PUBLIC_APP_URL задаётся в Coolify.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_APP_URL?.replace(/\/+$/, "") || "https://infolog24.ru";

export function absoluteUrl(path = ""): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${normalized}`;
}
