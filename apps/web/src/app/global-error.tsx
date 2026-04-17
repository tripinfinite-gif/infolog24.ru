"use client";

/**
 * Глобальный error boundary корня приложения.
 *
 * Next.js рендерит этот компонент, когда падает root layout или
 * что-то выше обычного error.tsx. Он ОБЯЗАН включать свои <html> и <body>,
 * потому что заменяет весь root layout.
 *
 * Здесь же мы отправляем ошибку в Sentry (если SDK инициализирован) и
 * показываем дружелюбную страницу вместо белого экрана Next.js.
 */
import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="ru">
      <body
        style={{
          fontFamily:
            "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, #faf7ff 0%, #f1ecff 50%, #e9e1ff 100%)",
          color: "#1f1b2e",
        }}
      >
        <main
          style={{
            maxWidth: 560,
            width: "100%",
            padding: "40px 32px",
            margin: "24px",
            background: "#ffffff",
            borderRadius: 20,
            boxShadow:
              "0 24px 60px -20px rgba(76, 33, 168, 0.25), 0 8px 24px -12px rgba(15, 23, 42, 0.08)",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: 52,
              lineHeight: 1,
              marginBottom: 16,
            }}
            aria-hidden="true"
          >
            ⚠️
          </div>
          <h1
            style={{
              fontSize: 28,
              lineHeight: 1.2,
              margin: "0 0 12px",
              fontWeight: 700,
            }}
          >
            Что-то пошло не так
          </h1>
          <p
            style={{
              fontSize: 16,
              lineHeight: 1.5,
              color: "#4a4658",
              margin: "0 0 24px",
            }}
          >
            Мы уже получили уведомление и скоро починим. Попробуйте обновить
            страницу или свяжитесь с нами — поможем оформить пропуск вручную.
          </p>

          {error?.digest ? (
            <p
              style={{
                fontSize: 12,
                fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                color: "#6c6880",
                margin: "0 0 24px",
              }}
            >
              Код ошибки: {error.digest}
            </p>
          ) : null}

          <div
            style={{
              display: "flex",
              gap: 12,
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <button
              onClick={() => reset()}
              style={{
                appearance: "none",
                border: "none",
                cursor: "pointer",
                padding: "12px 20px",
                background:
                  "linear-gradient(135deg, #6d28d9 0%, #8b5cf6 100%)",
                color: "#fff",
                borderRadius: 12,
                fontSize: 15,
                fontWeight: 600,
                boxShadow: "0 10px 20px -10px rgba(109, 40, 217, 0.55)",
              }}
            >
              Попробовать снова
            </button>
            {/*
              Здесь используется нативный <a>, потому что global-error заменяет
              весь root layout, и next/link может быть недоступен в момент
              рендера критической ошибки. Полная перезагрузка по / — надёжнее.
            */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a
              href="/"
              style={{
                padding: "12px 20px",
                background: "#f4eeff",
                color: "#4c21a8",
                borderRadius: 12,
                fontSize: 15,
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              На главную
            </a>
            <a
              href="tel:+74991105549"
              style={{
                padding: "12px 20px",
                background: "#ffffff",
                color: "#1f1b2e",
                border: "1px solid #e5dcff",
                borderRadius: 12,
                fontSize: 15,
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              +7 (499) 110-55-49
            </a>
          </div>
        </main>
      </body>
    </html>
  );
}
