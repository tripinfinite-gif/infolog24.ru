/**
 * Next.js 15 instrumentation hook.
 *
 * Вызывается фреймворком один раз на старте каждого runtime (node/edge),
 * ДО обработки запросов. Здесь мы лениво подгружаем соответствующий
 * Sentry-конфиг. Если `NEXT_PUBLIC_SENTRY_DSN` не задан, внутри конфига
 * `Sentry.init` не вызывается — graceful skip, ничего не ломаем.
 *
 * Клиентский init живёт в `src/instrumentation-client.ts` и вызывается
 * Next.js автоматически при загрузке страницы в браузере.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("../sentry.server.config");
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    await import("../sentry.edge.config");
  }
}

/**
 * onRequestError — автоматический захват необработанных ошибок в
 * Server Components, Route Handlers, Server Actions и middleware.
 * Подключается только если Sentry вообще сконфигурирован.
 */
export async function onRequestError(
  ...args: Parameters<
    typeof import("@sentry/nextjs").captureRequestError
  >
) {
  if (!process.env.NEXT_PUBLIC_SENTRY_DSN) return;
  const { captureRequestError } = await import("@sentry/nextjs");
  return captureRequestError(...args);
}
