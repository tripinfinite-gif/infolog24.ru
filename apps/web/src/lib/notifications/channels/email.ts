import { logger } from "@/lib/logger";

/**
 * Send an email notification via Resend.
 *
 * Currently a mock — logs the call and returns `true`.
 * Replace with real Resend integration when API key is available.
 */
export async function sendEmail(
  to: string,
  subject: string,
  body: string,
): Promise<boolean> {
  // TODO: Integrate Resend when RESEND_API_KEY is configured
  // import { Resend } from "resend";
  // const resend = new Resend(env.RESEND_API_KEY);
  // await resend.emails.send({ from: "noreply@infolog24.ru", to, subject, html: body });
  logger.info({ to, subject }, "Email notification (mock)");
  return true;
}
