import { logger } from "@/lib/logger";

/**
 * Send a Telegram notification via grammY bot.
 *
 * Currently a mock — logs the call and returns `true`.
 * Replace with real grammY integration when bot token is available.
 */
export async function sendTelegram(
  chatId: string,
  message: string,
): Promise<boolean> {
  // TODO: Integrate grammY when TELEGRAM_BOT_TOKEN is configured
  // import { Bot } from "grammy";
  // const bot = new Bot(env.TELEGRAM_BOT_TOKEN);
  // await bot.api.sendMessage(chatId, message, { parse_mode: "HTML" });
  logger.info({ chatId }, "Telegram notification (mock)");
  return true;
}
