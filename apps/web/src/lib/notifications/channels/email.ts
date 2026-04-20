import { Resend } from "resend";
import { env } from "@/env";
import { logger } from "@/lib/logger";

/**
 * Email channel via Resend.
 *
 * Gracefully degrades when RESEND_API_KEY is missing: logs a warning,
 * returns a failure result, and never throws.
 */

export interface SendEmailParams {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
  from?: string;
}

export interface SendEmailResult {
  success: boolean;
  id?: string;
  error?: string;
}

const DEFAULT_FROM = "Инфолог24 <noreply@infolog24.ru>";
const DEFAULT_REPLY_TO = "support@infolog24.ru";

let client: Resend | null = null;

function getClient(): Resend | null {
  if (client) return client;
  const apiKey = env.RESEND_API_KEY;
  if (!apiKey) {
    logger.warn("RESEND_API_KEY not configured — email sending disabled");
    return null;
  }
  client = new Resend(apiKey);
  return client;
}

/**
 * Sends an email via Resend. Never throws.
 */
export async function sendEmailMessage(
  params: SendEmailParams,
): Promise<SendEmailResult> {
  const resend = getClient();
  if (!resend) {
    return {
      success: false,
      error: "Email-сервис не настроен",
    };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: params.from ?? env.EMAIL_FROM ?? DEFAULT_FROM,
      to: params.to,
      subject: params.subject,
      html: params.html,
      text: params.text,
      replyTo: params.replyTo ?? env.EMAIL_REPLY_TO ?? DEFAULT_REPLY_TO,
    });

    if (error) {
      logger.error({ err: error, to: params.to }, "Resend send error");
      return { success: false, error: error.message };
    }

    logger.info(
      { id: data?.id, to: params.to, subject: params.subject },
      "Email sent via Resend",
    );

    return { success: true, id: data?.id };
  } catch (error) {
    logger.error({ err: error, to: params.to }, "Failed to send email");
    return {
      success: false,
      error: error instanceof Error ? error.message : "Неизвестная ошибка",
    };
  }
}

/**
 * Legacy wrapper to keep compatibility with the existing notifications router,
 * which passes (recipient, subject, body). Body is treated as HTML.
 */
export async function sendEmail(
  to: string,
  subject: string,
  body: string,
): Promise<boolean> {
  const result = await sendEmailMessage({
    to,
    subject,
    html: body,
    text: stripHtml(body),
  });
  return result.success;
}

function stripHtml(html: string): string {
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}
