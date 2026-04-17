/**
 * Next.js 15 client-side instrumentation hook.
 *
 * Next.js автоматически грузит этот файл в браузере перед первой навигацией.
 * Вся логика инициализации лежит в `sentry.client.config.ts` в корне
 * apps/web — так файл удобнее копировать/обновлять рядом с серверным
 * и edge-конфигами.
 */
import "../sentry.client.config";

// Требуется для навигации App Router, чтобы Sentry корректно трассировал переходы.
export { captureRouterTransitionStart as onRouterTransitionStart } from "@sentry/nextjs";
