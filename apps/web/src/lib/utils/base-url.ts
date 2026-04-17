/**
 * Базовый URL сайта. Берётся из env, fallback — inlog24.ru (текущий прод).
 * При переезде на infolog24.ru — поменять env NEXT_PUBLIC_APP_URL.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_APP_URL?.replace(/\/+$/, "") || "https://inlog24.ru";

export function absoluteUrl(path = ""): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${normalized}`;
}
