import withBundleAnalyzer from "@next/bundle-analyzer";
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
    "https://www.google-analytics.com",
  ],
  "frame-src": ["'self'", "https://yookassa.ru"],
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
      // Старые русские пути → новые английские
      { source: "/uslugi/:slug", destination: "/services/:slug", permanent: true },
      { source: "/uslugi", destination: "/services", permanent: true },
      { source: "/ceny", destination: "/pricing", permanent: true },
      { source: "/o-kompanii", destination: "/about", permanent: true },
      { source: "/otzyvy", destination: "/reviews", permanent: true },
      { source: "/kontakty", destination: "/contacts", permanent: true },
      // Старые опечатки и legacy
      { source: "/propuskm", destination: "/services/propusk-mkad", permanent: true },
      { source: "/propusk-mkad", destination: "/services/propusk-mkad", permanent: true },
      { source: "/propusk-ttk", destination: "/services/propusk-ttk", permanent: true },
      { source: "/propusk-sk", destination: "/services/propusk-sk", permanent: true },
      { source: "/vremennyj-propusk", destination: "/services/vremennyj-propusk", permanent: true },
      { source: "/godovoj-propusk", destination: "/services/godovoj-propusk", permanent: true },
      // Прочее legacy
      { source: "/proverit-propusk", destination: "/check-status", permanent: true },
      { source: "/sotrudnichestvo", destination: "/partners", permanent: true },
      { source: "/blagotvoritelnost/:rest*", destination: "/about", permanent: true },
    ];
  },
};

export default withAnalyzer(nextConfig);
