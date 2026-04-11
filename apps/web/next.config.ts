import type { NextConfig } from "next";

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
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
