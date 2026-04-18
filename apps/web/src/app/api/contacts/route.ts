import { NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";
import { z } from "zod";
import { env } from "@/env";
import { logger } from "@/lib/logger";
import { sendEmailMessage } from "@/lib/notifications/channels/email";
import { createDeal } from "@/lib/integrations/bitrix24";
import {
  getClientIp,
  rateLimit,
  rateLimitResponse,
} from "@/lib/security/rate-limit";

export const runtime = "nodejs";

const contactSchema = z.object({
  name: z.string().min(1, "Имя обязательно").max(100),
  phone: z
    .string()
    .min(1, "Телефон обязателен")
    .regex(/^[\d\s+\-()]{7,20}$/, "Некорректный формат телефона"),
  email: z.string().email("Некорректный email").optional().or(z.literal("")),
  message: z.string().max(2000).optional().or(z.literal("")),
  zone: z.string().max(50).optional().or(z.literal("")),
  source: z.string().max(100).optional().or(z.literal("")),
  /**
   * Приоритет лида. "high" — клиент в стрессе, негатив, угроза уйти,
   * требует срочной реакции менеджера. Маркируется в теме email,
   * заголовке Bitrix-сделки и в логах для быстрой фильтрации.
   * Используется AI-ассистентом при sentiment-эскалации.
   */
  priority: z.enum(["normal", "high"]).default("normal").optional(),
  /**
   * Произвольный контекст заявки: с какой страницы / калькулятора / статьи
   * пришёл лид, UTM-метки, параметры расчёта (zone, passType, price и т.п.).
   * Значения ограничены 300 символами на ключ, чтобы защититься от спама.
   */
  context: z.record(z.string(), z.string().max(300)).optional(),
  /**
   * Honeypot: скрытое поле, которое не видит пользователь, но видят боты.
   * Если заполнено — значит это бот, возвращаем silent success.
   */
  website: z.string().optional(),
});

type ContactInput = z.infer<typeof contactSchema>;

const CONTEXT_LABELS: Record<string, string> = {
  zone: "Зона",
  passType: "Срок пропуска",
  fleet: "Парк",
  fleetSize: "Размер парка",
  price: "Рассчитанная цена",
  priceFrom: "Цена от",
  package: "Пакет",
  vehicle: "ТС",
  weightKg: "Вес",
  segment: "Сегмент",
  source_article: "Статья",
  utm_source: "UTM source",
  utm_medium: "UTM medium",
  utm_campaign: "UTM campaign",
  utm_content: "UTM content",
  utm_term: "UTM term",
};

const BUSINESS_CONTEXT_FIELDS = [
  "zone",
  "passType",
  "fleet",
  "fleetSize",
  "price",
  "priceFrom",
  "package",
  "vehicle",
  "weightKg",
  "segment",
  "source_article",
];

const UTM_CONTEXT_FIELDS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
];

/**
 * Форматирует произвольный контекст заявки (бизнес-поля, UTM, прочее)
 * в человекочитаемый plain-text для email и Bitrix-комментариев.
 * Группирует поля по секциям: "Контекст заявки", "Атрибуция", "Прочее".
 */
function formatContextForHuman(
  context: Record<string, string> | undefined,
): string {
  if (!context || Object.keys(context).length === 0) return "";

  const business: string[] = [];
  const utm: string[] = [];
  const other: string[] = [];

  for (const [key, value] of Object.entries(context)) {
    const line = `${CONTEXT_LABELS[key] ?? key}: ${value}`;
    if (BUSINESS_CONTEXT_FIELDS.includes(key)) business.push(line);
    else if (UTM_CONTEXT_FIELDS.includes(key)) utm.push(line);
    else other.push(line);
  }

  const sections: string[] = [];
  if (business.length > 0)
    sections.push("=== Контекст заявки ===\n" + business.join("\n"));
  if (utm.length > 0) sections.push("=== Атрибуция ===\n" + utm.join("\n"));
  if (other.length > 0) sections.push("=== Прочее ===\n" + other.join("\n"));

  return sections.join("\n\n");
}

/**
 * Возвращает тот же контекст в виде HTML-блока (escaped) для email.
 */
function formatContextForHtml(
  context: Record<string, string> | undefined,
): string {
  const text = formatContextForHuman(context);
  if (!text) return "";
  return `
    <h3 style="color:#1e293b;font-size:14px;margin-top:24px;">Дополнительный контекст</h3>
    <pre style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:6px;padding:12px;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:12px;color:#334155;white-space:pre-wrap;word-break:break-word;">${escapeHtml(
      text,
    )}</pre>
  `;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildAdminEmailHtml(data: ContactInput): string {
  const isHighPriority = data.priority === "high";
  const rows: Array<[string, string]> = [
    ["Приоритет", isHighPriority ? "🚨 СРОЧНО" : "Обычный"],
    ["Имя", data.name],
    ["Телефон", data.phone],
    ["Email", data.email || "—"],
    ["Зона", data.zone || "—"],
    ["Источник", data.source || "website"],
    ["Сообщение", data.message || "—"],
  ];
  const trs = rows
    .map(
      ([label, value]) =>
        `<tr><td style="padding:4px 12px;border:1px solid #ddd;"><strong>${escapeHtml(
          label,
        )}</strong></td><td style="padding:4px 12px;border:1px solid #ddd;">${escapeHtml(value)}</td></tr>`,
    )
    .join("");
  const heading = isHighPriority
    ? "🚨 СРОЧНАЯ ЗАЯВКА — клиент в стрессе"
    : "Новая заявка с сайта";
  const headingColor = isHighPriority ? "#dc2626" : "#1e293b";
  return `
    <div style="font-family:system-ui,-apple-system,sans-serif;max-width:600px;">
      <h2 style="color:${headingColor};">${heading}</h2>
      ${
        isHighPriority
          ? '<p style="color:#dc2626;font-weight:600;">AI-ассистент определил негативный sentiment. Перезвоните в течение 15 минут.</p>'
          : ""
      }
      <table style="border-collapse:collapse;border:1px solid #ddd;">${trs}</table>
      ${formatContextForHtml(data.context)}
      <p style="color:#666;font-size:12px;margin-top:16px;">
        Сформировано автоматически сервисом Инфолог24.
      </p>
    </div>
  `;
}

export async function POST(request: Request) {
  try {
    // Rate limit anonymous contact form by IP
    const ip = getClientIp(request);
    const rate = await rateLimit("contact-form", ip);
    if (!rate.success) {
      return rateLimitResponse(rate);
    }

    const body = await request.json();
    const result = contactSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Ошибка валидации",
          details: result.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const data = result.data;

    // Honeypot: скрытое поле, которое видит только бот. Если заполнено —
    // молча возвращаем success, не создаём лид и не дёргаем интеграции.
    if (data.website && data.website.trim().length > 0) {
      logger.info({ ip }, "Honeypot triggered — bot filtered");
      return NextResponse.json({
        success: true,
        message: "Заявка принята. Мы свяжемся с вами в ближайшее время.",
      });
    }

    const createdAt = new Date().toISOString();
    const isHighPriority = data.priority === "high";
    const priorityPrefix = isHighPriority ? "🚨 СРОЧНО — " : "";
    const contextText = formatContextForHuman(data.context);

    // 1. Persistent log of the lead (audit trail via pino)
    logger.info(
      {
        lead: {
          name: data.name,
          phone: data.phone,
          email: data.email || null,
          message: data.message || null,
          zone: data.zone || null,
          source: data.source || "website",
          priority: data.priority ?? "normal",
          context: data.context ?? null,
          createdAt,
          ip,
        },
      },
      isHighPriority
        ? "New HIGH PRIORITY contact form lead (AI sentiment escalation)"
        : "New contact form lead",
    );

    // 2. Outbound notifications — never block UX on failures
    const adminEmail = env.ADMIN_EMAIL;
    const emailPromise: Promise<unknown> = adminEmail
      ? sendEmailMessage({
          to: adminEmail,
          subject: `${priorityPrefix}Новая заявка: ${data.name} (${data.phone})`,
          html: buildAdminEmailHtml(data),
        }).catch((err) => {
          logger.error({ err }, "Lead email dispatch failed");
        })
      : Promise.resolve();

    const bitrixPromise = createDeal({
      title: `${priorityPrefix}Заявка с сайта: ${data.name}`,
      contact: data.name,
      phone: data.phone,
      email: data.email || undefined,
      comments: [
        isHighPriority
          ? "🚨 ВЫСОКИЙ ПРИОРИТЕТ — AI определил негативный sentiment, перезвонить в 15 мин"
          : null,
        data.zone ? `Зона: ${data.zone}` : null,
        data.source ? `Источник: ${data.source}` : null,
        data.message ? `Сообщение: ${data.message}` : null,
        contextText || null,
      ]
        .filter(Boolean)
        .join("\n\n"),
      source: data.source || "WEB",
    })
      .then((res) => {
        if (!res.ok) {
          logger.warn(
            { error: res.error, lead: data.name },
            "Bitrix24 lead dispatch failed",
          );
        } else {
          logger.info(
            { dealId: res.data, lead: data.name },
            "Bitrix24 deal created for lead",
          );
        }
        return res;
      })
      .catch((err) => {
        logger.error({ err }, "Bitrix24 lead dispatch threw");
        return null;
      });

    // Wait with a short timeout so UX stays fast even if integrations are slow.
    await Promise.race([
      Promise.allSettled([emailPromise, bitrixPromise]),
      new Promise((resolve) => setTimeout(resolve, 3000)),
    ]);

    return NextResponse.json({
      success: true,
      message: "Заявка принята. Мы свяжемся с вами в ближайшее время.",
    });
  } catch (error) {
    Sentry.captureException(error, {
      tags: { route: "api/contacts", method: "POST" },
    });
    logger.error({ err: error }, "Failed to process contact form submission");
    return NextResponse.json(
      {
        success: false,
        error: "Произошла ошибка. Попробуйте позже или позвоните нам.",
      },
      { status: 500 },
    );
  }
}
