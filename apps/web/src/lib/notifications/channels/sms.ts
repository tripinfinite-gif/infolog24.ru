import { env } from "@/env";
import { logger } from "@/lib/logger";

/**
 * SMS channel via SMS.ru.
 *
 * API docs: https://sms.ru/api/send
 * Endpoint: https://sms.ru/sms/send
 *
 * Gracefully degrades when SMS_RU_API_KEY is missing: logs a warning,
 * returns a failure result, and never throws.
 */

const SMS_RU_ENDPOINT = "https://sms.ru/sms/send";
const SMS_RU_TIMEOUT_MS = 10_000;

export interface SendSmsParams {
  to: string;
  message: string;
}

export interface SendSmsResult {
  success: boolean;
  id?: string;
  error?: string;
}

/**
 * Normalises a phone number to SMS.ru format: 7XXXXXXXXXX (no plus, no spaces).
 * Accepts input like "+7 (999) 123-45-67" or "8 999 123 45 67".
 */
export function normalizePhoneForSmsRu(phone: string): string | null {
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 11 && (digits.startsWith("7") || digits.startsWith("8"))) {
    return "7" + digits.slice(1);
  }
  if (digits.length === 10) {
    return "7" + digits;
  }
  return null;
}

/**
 * Sends an SMS via SMS.ru. Never throws.
 */
export async function sendSmsMessage(
  params: SendSmsParams,
): Promise<SendSmsResult> {
  const apiKey = env.SMS_RU_API_KEY;
  if (!apiKey) {
    logger.warn("SMS_RU_API_KEY not configured — SMS sending disabled");
    return { success: false, error: "SMS-сервис не настроен" };
  }

  const normalized = normalizePhoneForSmsRu(params.to);
  if (!normalized) {
    return {
      success: false,
      error: "Некорректный номер телефона",
    };
  }

  const body = new URLSearchParams({
    api_id: apiKey,
    to: normalized,
    msg: params.message,
    json: "1",
  });

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), SMS_RU_TIMEOUT_MS);

  try {
    const response = await fetch(SMS_RU_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      },
      body,
      signal: controller.signal,
    });

    if (!response.ok) {
      const text = await response.text();
      logger.error(
        { status: response.status, text, to: normalized },
        "SMS.ru HTTP error",
      );
      return {
        success: false,
        error: `SMS.ru HTTP ${response.status}`,
      };
    }

    const data = (await response.json()) as {
      status: string;
      status_code: number;
      status_text?: string;
      sms?: Record<string, { status: string; sms_id?: string; status_text?: string }>;
    };

    if (data.status !== "OK") {
      logger.error(
        { status: data.status, statusText: data.status_text, to: normalized },
        "SMS.ru send failed",
      );
      return {
        success: false,
        error: data.status_text ?? "SMS не отправлено",
      };
    }

    const smsEntry = data.sms?.[normalized];
    const smsId = smsEntry?.sms_id;

    logger.info(
      { to: normalized, smsId, messageLength: params.message.length },
      "SMS sent via SMS.ru",
    );

    return { success: true, id: smsId };
  } catch (error) {
    logger.error({ err: error, to: normalized }, "Failed to send SMS");
    return {
      success: false,
      error: error instanceof Error ? error.message : "Неизвестная ошибка",
    };
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Legacy wrapper to keep compatibility with the notifications router,
 * which passes (phone, message).
 */
export async function sendSMS(
  phone: string,
  message: string,
): Promise<boolean> {
  const result = await sendSmsMessage({ to: phone, message });
  return result.success;
}
