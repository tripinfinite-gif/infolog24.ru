import { logger } from "@/lib/logger";

/**
 * Send an SMS notification via SMS.ru.
 *
 * Currently a mock — logs the call and returns `true`.
 * Replace with real SMS.ru integration when API key is available.
 */
export async function sendSMS(
  phone: string,
  message: string,
): Promise<boolean> {
  // TODO: Integrate SMS.ru when SMS_RU_API_KEY is configured
  // const url = `https://sms.ru/sms/send?api_id=${env.SMS_RU_API_KEY}&to=${phone}&msg=${encodeURIComponent(message)}&json=1`;
  // const res = await fetch(url);
  logger.info(
    { phone, messageLength: message.length },
    "SMS notification (mock)",
  );
  return true;
}
