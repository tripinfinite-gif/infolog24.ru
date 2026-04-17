/**
 * Sentry edge-runtime init.
 *
 * Загружается из `src/instrumentation.ts` при `process.env.NEXT_RUNTIME === "edge"`.
 * Используется для middleware и edge-route handlers.
 */
import * as Sentry from "@sentry/nextjs";

const DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;

const RELEASE =
  process.env.VERCEL_GIT_COMMIT_SHA ||
  process.env.GIT_COMMIT ||
  process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA ||
  process.env.NEXT_PUBLIC_GIT_COMMIT ||
  undefined;

if (DSN) {
  Sentry.init({
    dsn: DSN,
    environment: process.env.NODE_ENV,
    release: RELEASE,

    tracesSampleRate: 0.1,

    beforeSend(event) {
      if (!DSN) return null;
      return event;
    },
  });
}
