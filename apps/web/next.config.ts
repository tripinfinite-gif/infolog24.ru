import withBundleAnalyzer from "@next/bundle-analyzer";
import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";

const withAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

/**
 * Content-Security-Policy.
 * Собран с учётом использования Yandex Metrika, Google Analytics,
 * Google Fonts, S3 (Selectel) для изображений и iframe YooKassa.
 */
const cspDirectives: Record<string, string[]> = {
  "default-src": ["'self'"],
  "script-src": [
    "'self'",
    "'unsafe-inline'",
    "'unsafe-eval'",
    "https://mc.yandex.ru",
    "https://www.googletagmanager.com",
  ],
  "style-src": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
  "img-src": [
    "'self'",
    "data:",
    "blob:",
    "https://*.s3.amazonaws.com",
    "https://*.s3.ru-1.storage.selcloud.ru",
    "https://*.selcdn.ru",
    "https://mc.yandex.ru",
  ],
  "font-src": ["'self'", "https://fonts.gstatic.com", "data:"],
  "connect-src": [
    "'self'",
    "https://mc.yandex.ru",
    "wss://mc.yandex.ru",
    "https://www.google-analytics.com",
  ],
  "frame-src": ["'self'", "https://yookassa.ru"],
  // PWA: service worker и web-app manifest обслуживаются из того же origin.
  // blob: нужен клиентским библиотекам (Vercel AI SDK, sentry, эмбеддинги),
  // которые создают воркеры из Blob'ов для офлоада тяжёлой работы.
  "worker-src": ["'self'", "blob:"],
  "manifest-src": ["'self'"],
  "object-src": ["'none'"],
  "base-uri": ["'self'"],
  "form-action": ["'self'"],
};

const contentSecurityPolicy = Object.entries(cspDirectives)
  .map(([key, values]) => `${key} ${values.join(" ")}`)
  .join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains; preload",
  },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  { key: "X-DNS-Prefetch-Control", value: "on" },
];

const nextConfig: NextConfig = {
  output: "standalone",
  transpilePackages: ["@infolog24/shared"],
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.s3.ru-1.storage.selcloud.ru",
      },
      {
        protocol: "https",
        hostname: "*.selcdn.ru",
      },
      {
        protocol: "https",
        hostname: "infolog24-documents.s3.ru-1.storage.selcloud.ru",
      },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
  async redirects() {
    return [
      // ── Миграция со старого Joomla-сайта (www.infolog24.ru → inlog24.ru) ──

      // Каталог услуг Joomla → новый каталог
      { source: "/propusk", destination: "/services", permanent: true },
      { source: "/propusk/propusk-na-mkad-dlya-gruzovykh-mashin", destination: "/services/propusk-mkad", permanent: true },
      { source: "/propusk/propusk-ttk", destination: "/services/propusk-ttk", permanent: true },
      { source: "/propusk/propusk-sk", destination: "/services/propusk-sk", permanent: true },
      { source: "/propusk/dnevnoj-propusk-na-mkad", destination: "/services/vremennyj-propusk", permanent: true },
      { source: "/propusk/razovyj-propusk-v-moskvu", destination: "/services/vremennyj-propusk", permanent: true },
      { source: "/propusk/zakazat-propusk", destination: "/services", permanent: true },

      // Лендинги Joomla → сегментные лендинги
      { source: "/propuskm", destination: "/ip-perevozchik", permanent: true },
      { source: "/propuskk", destination: "/malye-tk", permanent: true },
      { source: "/prop-v-moskwu", destination: "/services", permanent: true },

      // Инфостраницы Joomla → аналоги на новом сайте
      { source: "/proverit-propusk", destination: "/check-status", permanent: true },
      { source: "/sotrudnichestvo", destination: "/partners", permanent: true },
      { source: "/otzivy", destination: "/reviews", permanent: true },
      // /contacts → /contacts — совпадает, редиректа не нужно
      // /faq → /faq — совпадает, редиректа не нужно

      // Укороченные дубли Joomla
      { source: "/sotrud", destination: "/partners", permanent: true },
      { source: "/cont", destination: "/contacts", permanent: true },

      // Новости Joomla → статьи блога (тематическое соответствие)
      { source: "/novosti/4-osnovnye-prichiny-annulirovaniya-propuskov-v-2020-godu", destination: "/blog/rnis-annulirovanie-propuska-za-chto", permanent: true },
      { source: "/novosti/10-kak-oformit-propusk-dlya-gruzovykh-mashin-pyat-oshibok-novichkov", destination: "/blog/kak-oformit-propusk-mkad-samostoyatelno-2026", permanent: true },
      { source: "/novosti/11-moskovskij-portal", destination: "/blog/goslog-vmesto-mos-ru-novyy-portal", permanent: true },
      { source: "/novosti/14-sboi-iz-za-dk", destination: "/blog/otkazali-v-propuske-chto-delat", permanent: true },
      { source: "/novosti/13-registratsiya-ts-v-rnis", destination: "/blog/shtrafy-rnis-chto-eto-kak-obzhalovat", permanent: true },
      { source: "/novosti/5-v-ezd-na-ttk-na-gazeli", destination: "/blog/propusk-ttk-sadovoe-otlichie-mkad", permanent: true },
      { source: "/novosti/3-be-sure-to-add-aria-expanded-to-the-control-element2", destination: "/blog", permanent: true },
      { source: "/novosti/2-be-sure-to-add-aria-expanded-to-the-control-element1", destination: "/blog", permanent: true },
      { source: "/novosti/1-be-sure-to-add-aria-expanded-to-the-control-element", destination: "/blog", permanent: true },
      { source: "/novosti/12-izmeneniya-v-protsedure-oformleniya-propuskov-dlya-proezda-v-moskvu", destination: "/blog", permanent: true },
      { source: "/novosti/6-sdelat-propusk-v-moskovskoj-oblasti", destination: "/blog", permanent: true },
      { source: "/novosti/7-pravila-polzovaniya-platnymi-parkovkami", destination: "/blog", permanent: true },
      { source: "/novosti", destination: "/blog", permanent: true },

      // Joomla-артефакты
      { source: "/index.php", destination: "/", permanent: true },

      // ── Унификация продуктовых страниц (старые /regulatorika/* → новые) ──
      { source: "/regulatorika/antishraf", destination: "/monitoring", permanent: true },
      { source: "/regulatorika/yurist", destination: "/yurist", permanent: true },

      // ── Legacy-пути (могут быть в закладках/ссылках, хотя на Joomla не существовали) ──
      { source: "/uslugi/:slug", destination: "/services/:slug", permanent: true },
      { source: "/uslugi", destination: "/services", permanent: true },
      { source: "/ceny", destination: "/services", permanent: true },
      { source: "/o-kompanii", destination: "/about", permanent: true },
      { source: "/kontakty", destination: "/contacts", permanent: true },
      { source: "/propusk-mkad", destination: "/services/propusk-mkad", permanent: true },
      { source: "/propusk-ttk", destination: "/services/propusk-ttk", permanent: true },
      { source: "/propusk-sk", destination: "/services/propusk-sk", permanent: true },
      { source: "/vremennyj-propusk", destination: "/services/vremennyj-propusk", permanent: true },
      { source: "/godovoj-propusk", destination: "/services/propusk-mkad", permanent: true },
      { source: "/otzyvy", destination: "/reviews", permanent: true },
      { source: "/blagotvoritelnost/:rest*", destination: "/about", permanent: true },
    ];
  },
};

/**
 * Sentry конфигурация билда.
 *
 * Без `NEXT_PUBLIC_SENTRY_DSN` Sentry SDK не инициализируется в рантайме
 * (см. sentry.*.config.ts), а `withSentryConfig` оставляет конфиг
 * функциональным — просто никакой ошибки не летит на сервер Sentry.
 *
 * authToken для загрузки source maps НЕ передаём — это потребует доступа
 * к Sentry-аккаунту, которого пока нет. Добавим, когда появится.
 */
const sentryBuildOptions = {
  // Тише в логах билда.
  silent: !process.env.CI,
  // Расширенное дерево вызовов в React — пока пропускаем (Next пробует сам).
  widenClientFileUpload: true,
  // Автоматически разворачивает /monitoring для туннелирования событий
  // мимо ad-blocker'ов. Включим, когда получим DSN и доверим маршрут.
  tunnelRoute: undefined as string | undefined,
  // Source maps всё равно не грузим без authToken.
  disableLogger: true,
};

export default withSentryConfig(withAnalyzer(nextConfig), sentryBuildOptions);
