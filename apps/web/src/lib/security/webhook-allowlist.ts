/**
 * Allowlist IP-адресов для входящих вебхуков.
 *
 * Поддерживаются:
 * - YooKassa: фиксированный список (https://yookassa.ru/developers/using-api/webhooks#ip)
 * - Bitrix24: настраивается через env BITRIX24_ALLOWED_IPS (через запятую)
 *
 * Функция isWebhookIpAllowed(ip, source) возвращает true, если IP разрешён
 * для указанного источника. Поддерживает IPv4, IPv4-в-IPv6 (::ffff:),
 * одиночные IP и CIDR (только IPv4 CIDR; IPv6-префиксы проверяются как
 * простое startsWith по префиксу адреса).
 */

export type WebhookSource = "yookassa" | "bitrix24";

// ── YooKassa allowlist ───────────────────────────────────────────────────
// Официальный список: https://yookassa.ru/developers/using-api/webhooks#ip

const YOOKASSA_CIDR_V4: Array<{ base: string; prefix: number }> = [
  { base: "185.71.76.0", prefix: 27 },
  { base: "185.71.77.0", prefix: 27 },
  { base: "77.75.153.0", prefix: 25 },
  { base: "77.75.154.128", prefix: 25 },
];

const YOOKASSA_SINGLE_V4: string[] = ["77.75.156.11", "77.75.156.35"];

/** YooKassa IPv6 префикс (2a02:5180::/32). Проверяем по началу адреса. */
const YOOKASSA_V6_PREFIX = "2a02:5180:";

// ── Утилиты ──────────────────────────────────────────────────────────────

/** Убирает префикс IPv4-mapped IPv6 (::ffff:) */
function normalizeIp(ip: string): string {
  return ip.replace(/^::ffff:/i, "").trim();
}

function isIpv4(ip: string): boolean {
  return /^\d{1,3}(\.\d{1,3}){3}$/.test(ip);
}

function ipv4ToNumber(ip: string): number {
  const parts = ip.split(".").map(Number);
  return (
    ((parts[0]! << 24) |
      (parts[1]! << 16) |
      (parts[2]! << 8) |
      parts[3]!) >>>
    0
  );
}

/** Проверяет, входит ли IPv4 в CIDR */
function ipv4InCidr(ip: string, base: string, prefix: number): boolean {
  if (!isIpv4(ip) || !isIpv4(base)) return false;
  const ipNum = ipv4ToNumber(ip);
  const baseNum = ipv4ToNumber(base);
  if (prefix === 0) return true;
  const mask = (~0 << (32 - prefix)) >>> 0;
  return (ipNum & mask) === (baseNum & mask);
}

/** Парсит строку вида "1.2.3.4", "1.2.3.0/24" или IPv6 */
function checkAgainst(
  ip: string,
  entry: string,
): boolean {
  if (entry.includes("/")) {
    const [base, prefixStr] = entry.split("/");
    const prefix = Number(prefixStr);
    if (!base || Number.isNaN(prefix)) return false;
    if (isIpv4(base)) return ipv4InCidr(ip, base, prefix);
    // Для IPv6 CIDR делаем упрощённую проверку по префиксу
    const baseNormalized = base.toLowerCase().replace(/::$/, ":");
    return ip.toLowerCase().startsWith(baseNormalized);
  }
  return ip === entry;
}

// ── Проверка для YooKassa ────────────────────────────────────────────────

function isYooKassaIp(ip: string): boolean {
  const clean = normalizeIp(ip);

  if (isIpv4(clean)) {
    if (YOOKASSA_SINGLE_V4.includes(clean)) return true;
    for (const cidr of YOOKASSA_CIDR_V4) {
      if (ipv4InCidr(clean, cidr.base, cidr.prefix)) return true;
    }
    return false;
  }

  // IPv6: проверка по префиксу 2a02:5180::/32
  return clean.toLowerCase().startsWith(YOOKASSA_V6_PREFIX);
}

// ── Проверка для Bitrix24 ────────────────────────────────────────────────

function getBitrix24Allowlist(): string[] {
  const raw = process.env.BITRIX24_ALLOWED_IPS;
  if (!raw) return [];
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

function isBitrix24Ip(ip: string): boolean {
  const clean = normalizeIp(ip);
  const entries = getBitrix24Allowlist();
  if (entries.length === 0) {
    // Если env не задан, в проде блокируем, в dev разрешаем
    return process.env.NODE_ENV !== "production";
  }
  return entries.some((entry) => checkAgainst(clean, entry));
}

// ── Публичное API ────────────────────────────────────────────────────────

/**
 * Проверяет, разрешён ли IP для входящего вебхука.
 * @param ip IP-адрес клиента (из x-forwarded-for / x-real-ip)
 * @param source источник вебхука
 */
export function isWebhookIpAllowed(
  ip: string,
  source: WebhookSource,
): boolean {
  if (!ip) return false;
  switch (source) {
    case "yookassa":
      return isYooKassaIp(ip);
    case "bitrix24":
      return isBitrix24Ip(ip);
  }
}

/** Извлекает IP клиента из заголовков запроса. */
export function getWebhookClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const first = forwardedFor.split(",")[0]?.trim();
    if (first) return normalizeIp(first);
  }
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return normalizeIp(realIp);
  return "";
}
