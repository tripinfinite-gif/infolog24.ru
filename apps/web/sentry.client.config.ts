/**
 * Sentry client-side (browser) init.
 *
 * Загружается из `src/instrumentation-client.ts` и выполняется при первой
 * навигации пользователя. Если `NEXT_PUBLIC_SENTRY_DSN` не задан — SDK
 * просто не инициализируется (graceful skip, build не ломается).
 *
 * Шумоподавление:
 * — игнорируем события из браузерных расширений (chrome-extension://, etc.);
 * — отсекаем известный бенигный шум "ResizeObserver loop limit exceeded".
 *
 * Replays:
 * — фон (sessionSampleRate) выключены — экономим лимит и не трогаем privacy
 *   пользователей;
 * — записываем только сессии, в которых была ошибка (errorSampleRate 1.0),
 *   чтобы быстро восстанавливать контекст реального бага.
 */
import * as Sentry from "@sentry/nextjs";

const DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;

const RELEASE =
  process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA ||
  process.env.NEXT_PUBLIC_GIT_COMMIT ||
  undefined;

const IGNORED_MESSAGES = [
  "ResizeObserver loop limit exceeded",
  "ResizeObserver loop completed with undelivered notifications",
  "Non-Error promise rejection captured",
];

if (DSN) {
  Sentry.init({
    dsn: DSN,
    environment: process.env.NODE_ENV,
    release: RELEASE,

    tracesSampleRate: 0.1,

    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 1.0,

    integrations: [
      Sentry.replayIntegration({
        maskAllText: true,
        blockAllMedia: true,
      }),
    ],

    ignoreErrors: IGNORED_MESSAGES,

    beforeSend(event, hint) {
      if (!DSN) return null;

      const error = hint?.originalException;
      const message =
        (typeof error === "object" && error !== null && "message" in error
          ? String((error as { message: unknown }).message)
          : "") || event.message || "";

      if (IGNORED_MESSAGES.some((m) => message.includes(m))) {
        return null;
      }

      // Отсекаем события, летящие из браузерных расширений.
      const frames = event.exception?.values?.[0]?.stacktrace?.frames ?? [];
      const hasExtensionFrame = frames.some((frame) => {
        const file = frame.filename ?? "";
        return (
          file.startsWith("chrome-extension://") ||
          file.startsWith("moz-extension://") ||
          file.startsWith("safari-extension://") ||
          file.startsWith("safari-web-extension://")
        );
      });
      if (hasExtensionFrame) return null;

      return event;
    },
  });
}
