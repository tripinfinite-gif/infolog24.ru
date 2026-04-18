import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Нет подключения — Инфолог24",
  description: "Проверьте интернет-соединение и попробуйте снова.",
  robots: { index: false, follow: false },
};

/**
 * Offline fallback страница.
 * Отображается service worker'ом, когда fetch упал и нет кешированного ответа.
 * Используем inline-стили, чтобы не зависеть от загрузки CSS-бандла через сеть.
 */
export default function OfflinePage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
        background: "#ffffff",
        color: "#0f172a",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <header
        style={{
          padding: "16px 24px",
          borderBottom: "1px solid #e2e8f0",
        }}
      >
        <Link
          href="/"
          style={{
            color: "#7c3aed",
            textDecoration: "none",
            fontWeight: 600,
            fontSize: 18,
          }}
        >
          Инфолог24
        </Link>
      </header>

      <main
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
        }}
      >
        <div style={{ maxWidth: 480, textAlign: "center" }}>
          <div
            aria-hidden="true"
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              background: "#f1f5f9",
              margin: "0 auto 24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 32,
            }}
          >
            📡
          </div>

          <h1
            style={{
              fontSize: 28,
              fontWeight: 700,
              margin: "0 0 12px",
              lineHeight: 1.2,
            }}
          >
            Нет подключения
          </h1>

          <p
            style={{
              fontSize: 16,
              color: "#475569",
              margin: "0 0 32px",
              lineHeight: 1.5,
            }}
          >
            Проверьте интернет и попробуйте снова. Некоторые сохранённые
            страницы доступны без сети.
          </p>

          <div
            style={{
              display: "flex",
              gap: 12,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            {/* Перезагрузка через <a href=""> работает даже без JS */}
            <a
              href=""
              style={{
                display: "inline-block",
                padding: "12px 24px",
                background: "#7c3aed",
                color: "#ffffff",
                borderRadius: 8,
                textDecoration: "none",
                fontWeight: 600,
                fontSize: 15,
              }}
            >
              Перезагрузить
            </a>
            <Link
              href="/"
              style={{
                display: "inline-block",
                padding: "12px 24px",
                background: "#f1f5f9",
                color: "#0f172a",
                borderRadius: 8,
                textDecoration: "none",
                fontWeight: 600,
                fontSize: 15,
              }}
            >
              На главную
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
