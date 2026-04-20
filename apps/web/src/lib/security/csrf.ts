/**
 * Проверка CSRF через Origin/Referer заголовки.
 * Применяется ко всем мутирующим запросам (POST, PUT, PATCH, DELETE).
 */

const ALLOWED_ORIGINS = [
  process.env.NEXT_PUBLIC_APP_URL || "https://infolog24.ru",
  "https://infolog24.ru",
  "https://www.infolog24.ru",
  // В dev — разрешаем localhost с любым портом, чтобы формы можно было тестировать локально.
  ...(process.env.NODE_ENV !== "production"
    ? [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:3002",
        "http://localhost:3003",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
        "http://127.0.0.1:3002",
        "http://127.0.0.1:3003",
      ]
    : []),
];

/** Пути, исключённые из CSRF-проверки (вебхуки от внешних сервисов) */
const CSRF_EXEMPT_PATHS = [
  "/api/payments/webhook", // YooKassa webhook (проверяется по IP/подписи)
  "/api/telegram", // Telegram webhook (проверяется по secret)
  "/api/cron/", // Cron jobs (проверяются по X-Cron-Secret)
];

export function validateCsrf(request: {
  method: string;
  url: string;
  headers: { get(name: string): string | null };
}): { valid: boolean; reason?: string } {
  const method = request.method.toUpperCase();

  // GET, HEAD, OPTIONS — не мутирующие, пропускаем
  if (["GET", "HEAD", "OPTIONS"].includes(method)) {
    return { valid: true };
  }

  const url = new URL(request.url);

  // Исключения для вебхуков
  if (CSRF_EXEMPT_PATHS.some((path) => url.pathname.startsWith(path))) {
    return { valid: true };
  }

  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");

  // Проверяем Origin (предпочтительнее)
  if (origin) {
    const isAllowed = ALLOWED_ORIGINS.some((allowed) => origin === allowed);
    return isAllowed
      ? { valid: true }
      : { valid: false, reason: `Недопустимый Origin: ${origin}` };
  }

  // Фоллбэк на Referer
  if (referer) {
    try {
      const refererUrl = new URL(referer);
      const isAllowed = ALLOWED_ORIGINS.some(
        (allowed) => refererUrl.origin === allowed,
      );
      return isAllowed
        ? { valid: true }
        : { valid: false, reason: `Недопустимый Referer: ${referer}` };
    } catch {
      return { valid: false, reason: "Невалидный Referer" };
    }
  }

  // Нет ни Origin, ни Referer — блокируем
  return { valid: false, reason: "Отсутствуют Origin и Referer заголовки" };
}
