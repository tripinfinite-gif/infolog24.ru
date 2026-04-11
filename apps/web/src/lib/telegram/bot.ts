import { Bot, type Context } from "grammy";

import { calculatePrice, pricingTiers } from "@/content/pricing";
import { logger } from "@/lib/logger";
import {
  CB,
  backKeyboard,
  mainMenuKeyboard,
  permitTypesKeyboard,
  vehicleCountKeyboard,
  zonesKeyboard,
} from "@/lib/telegram/keyboards";
import {
  clearSession,
  getSession,
  setSession,
  type TelegramSessionData,
} from "@/lib/telegram/sessions";
import { getLinkedUserId } from "@/lib/telegram/account-linking";

const zoneLabels: Record<"mkad" | "ttk" | "sk", string> = {
  mkad: "МКАД",
  ttk: "ТТК",
  sk: "Садовое кольцо",
};

const typeLabels: Record<"annual_day" | "annual_night" | "temporary", string> = {
  annual_day: "Годовой (дневной)",
  annual_night: "Годовой (ночной)",
  temporary: "Разовый (до 5 суток)",
};

const WELCOME_TEXT =
  "Здравствуйте! Я бот «Инфолог24».\n\n" +
  "Помогу оформить пропуск в Москву для грузового транспорта: МКАД, ТТК, Садовое кольцо.\n\n" +
  "Выберите действие в меню или используйте команды:\n" +
  "/price — рассчитать стоимость\n" +
  "/status — проверить статус заявки\n" +
  "/order — оформить пропуск\n" +
  "/contact — связаться с менеджером\n" +
  "/help — помощь";

function resolveBasePrice(
  zone: "mkad" | "ttk" | "sk",
  type: "annual_day" | "annual_night" | "temporary",
): number {
  if (type === "temporary") {
    return pricingTiers.find((t) => t.type === "temp")?.price ?? 3500;
  }
  return (
    pricingTiers.find((t) => t.zone === zone && t.type === "annual")?.price ??
    12000
  );
}

async function showMainMenu(ctx: Context, text = WELCOME_TEXT): Promise<void> {
  await ctx.reply(text, { reply_markup: mainMenuKeyboard() });
}

async function startPriceFlow(ctx: Context, chatId: number): Promise<void> {
  await setSession(chatId, { step: "price_zone" });
  await ctx.reply("В какую зону нужен пропуск?", {
    reply_markup: zonesKeyboard(),
  });
}

async function startStatusFlow(ctx: Context, chatId: number): Promise<void> {
  await setSession(chatId, { step: "status_query" });
  await ctx.reply(
    "Введите номер заявки (UUID) или телефон, указанный при оформлении.",
    { reply_markup: backKeyboard() },
  );
}

async function startOrderFlow(ctx: Context, chatId: number): Promise<void> {
  await setSession(chatId, { step: "order_contact_name" });
  await ctx.reply(
    "Давайте оформим заявку. Как к вам обращаться?",
    { reply_markup: backKeyboard() },
  );
}

async function showContacts(ctx: Context): Promise<void> {
  await ctx.reply(
    "Связаться с менеджером:\n\n" +
      "Телефон: +7 (499) 110-55-49\n" +
      "Email: info@infolog24.ru\n" +
      "Сайт: infolog24.ru\n\n" +
      "Режим работы: Пн-Пт 9:00-20:00, Сб 10:00-17:00",
    { reply_markup: backKeyboard() },
  );
}

async function showHelp(ctx: Context): Promise<void> {
  await ctx.reply(
    "Я помогу с оформлением пропусков в Москву для грузового транспорта.\n\n" +
      "Команды:\n" +
      "/menu — главное меню\n" +
      "/price — узнать цену\n" +
      "/status — проверить статус заявки\n" +
      "/order — оформить пропуск\n" +
      "/contact — связаться с менеджером\n" +
      "/link КОД — привязать аккаунт к личному кабинету\n" +
      "/cancel — отменить текущее действие\n\n" +
      "Можно прислать фото или PDF документа — я сохраню его в вашей заявке.",
    { reply_markup: backKeyboard() },
  );
}

async function postLeadToApi(payload: {
  name: string;
  phone: string;
  message?: string;
}): Promise<boolean> {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/contacts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, source: "telegram_bot" }),
    });
    return response.ok;
  } catch (error) {
    logger.warn({ error }, "Failed to forward Telegram lead to /api/contacts");
    return false;
  }
}

async function postLinkToApi(
  code: string,
  telegramUserId: number,
): Promise<{ success: boolean; error?: string }> {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/telegram/link`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-telegram-bot-secret": process.env.TELEGRAM_BOT_TOKEN ?? "",
      },
      body: JSON.stringify({ code, telegramUserId }),
    });
    if (response.ok) return { success: true };
    const data = (await response.json().catch(() => null)) as
      | { error?: string }
      | null;
    return { success: false, error: data?.error };
  } catch (error) {
    logger.warn({ error }, "Failed to call /api/telegram/link from bot");
    return { success: false, error: "network_error" };
  }
}

export function createBot(token: string): Bot {
  const bot = new Bot(token);

  // ── Commands ───────────────────────────────────────────────────────────

  bot.command("start", async (ctx) => {
    if (ctx.chat) await clearSession(ctx.chat.id);
    await showMainMenu(ctx);
  });

  bot.command("menu", async (ctx) => {
    if (ctx.chat) await clearSession(ctx.chat.id);
    await showMainMenu(ctx, "Главное меню:");
  });

  bot.command("help", async (ctx) => {
    await showHelp(ctx);
  });

  bot.command("price", async (ctx) => {
    if (ctx.chat) await startPriceFlow(ctx, ctx.chat.id);
  });

  bot.command("status", async (ctx) => {
    if (ctx.chat) await startStatusFlow(ctx, ctx.chat.id);
  });

  bot.command("order", async (ctx) => {
    if (ctx.chat) await startOrderFlow(ctx, ctx.chat.id);
  });

  bot.command("contact", async (ctx) => {
    await showContacts(ctx);
  });

  bot.command("cancel", async (ctx) => {
    if (ctx.chat) await clearSession(ctx.chat.id);
    await showMainMenu(ctx, "Действие отменено. Выберите новое в меню:");
  });

  bot.command("link", async (ctx) => {
    const chatId = ctx.chat?.id;
    const userId = ctx.from?.id;
    if (!chatId || !userId) return;

    const parts = (ctx.message?.text ?? "").trim().split(/\s+/);
    const code = parts[1];
    if (!code || !/^\d{6}$/.test(code)) {
      await setSession(chatId, { step: "awaiting_link_code" });
      await ctx.reply(
        "Отправьте 6-значный код из личного кабинета. Например: /link 123456",
      );
      return;
    }

    const result = await postLinkToApi(code, userId);
    if (result.success) {
      await clearSession(chatId);
      await ctx.reply(
        "Аккаунт привязан! Теперь я смогу показывать ваши заявки и уведомления.",
        { reply_markup: mainMenuKeyboard() },
      );
    } else {
      await ctx.reply(
        result.error ?? "Не удалось привязать аккаунт. Запросите новый код в личном кабинете.",
      );
    }
  });

  // ── Callback queries (inline keyboards) ────────────────────────────────

  bot.callbackQuery(CB.menu, async (ctx) => {
    await ctx.answerCallbackQuery();
    if (ctx.chat) await clearSession(ctx.chat.id);
    await showMainMenu(ctx, "Главное меню:");
  });

  bot.callbackQuery(CB.back, async (ctx) => {
    await ctx.answerCallbackQuery();
    if (ctx.chat) await clearSession(ctx.chat.id);
    await showMainMenu(ctx, "Главное меню:");
  });

  bot.callbackQuery(CB.price, async (ctx) => {
    await ctx.answerCallbackQuery();
    if (ctx.chat) await startPriceFlow(ctx, ctx.chat.id);
  });

  bot.callbackQuery(CB.status, async (ctx) => {
    await ctx.answerCallbackQuery();
    if (ctx.chat) await startStatusFlow(ctx, ctx.chat.id);
  });

  bot.callbackQuery(CB.order, async (ctx) => {
    await ctx.answerCallbackQuery();
    if (ctx.chat) await startOrderFlow(ctx, ctx.chat.id);
  });

  bot.callbackQuery(CB.contact, async (ctx) => {
    await ctx.answerCallbackQuery();
    await showContacts(ctx);
  });

  bot.callbackQuery(CB.help, async (ctx) => {
    await ctx.answerCallbackQuery();
    await showHelp(ctx);
  });

  bot.callbackQuery(CB.myPermits, async (ctx) => {
    await ctx.answerCallbackQuery();
    const telegramUserId = ctx.from?.id;
    if (!telegramUserId) return;
    const linkedUser = await getLinkedUserId(telegramUserId);
    if (!linkedUser) {
      await ctx.reply(
        "Чтобы посмотреть ваши пропуска, нужно привязать аккаунт.\n" +
          "Перейдите в личный кабинет (infolog24.ru/dashboard), получите 6-значный код и отправьте его сюда командой /link 123456.",
      );
      return;
    }
    await ctx.reply(
      "Ваш аккаунт привязан. Полный список пропусков доступен в личном кабинете: infolog24.ru/dashboard/permits",
      { reply_markup: backKeyboard() },
    );
  });

  // Price flow: zone → type → count
  bot.callbackQuery(/^zone:(mkad|ttk|sk)$/, async (ctx) => {
    await ctx.answerCallbackQuery();
    const chatId = ctx.chat?.id;
    if (!chatId) return;
    const zone = ctx.match?.[1] as "mkad" | "ttk" | "sk" | undefined;
    if (!zone) return;
    const current = await getSession(chatId);
    const next: TelegramSessionData = { ...current, zone, step: "price_type" };
    await setSession(chatId, next);
    await ctx.reply(
      `Зона: ${zoneLabels[zone]}. Какой тип пропуска?`,
      { reply_markup: permitTypesKeyboard() },
    );
  });

  bot.callbackQuery(
    /^type:(annual_day|annual_night|temporary)$/,
    async (ctx) => {
      await ctx.answerCallbackQuery();
      const chatId = ctx.chat?.id;
      if (!chatId) return;
      const type = ctx.match?.[1] as
        | "annual_day"
        | "annual_night"
        | "temporary"
        | undefined;
      if (!type) return;
      const current = await getSession(chatId);
      if (!current.zone) {
        await startPriceFlow(ctx, chatId);
        return;
      }
      const next: TelegramSessionData = { ...current, type, step: "price_count" };
      await setSession(chatId, next);
      await ctx.reply("Сколько машин?", { reply_markup: vehicleCountKeyboard() });
    },
  );

  bot.callbackQuery(/^count:(\d+)$/, async (ctx) => {
    await ctx.answerCallbackQuery();
    const chatId = ctx.chat?.id;
    if (!chatId) return;
    const count = Number(ctx.match?.[1] ?? 1);
    const current = await getSession(chatId);
    if (!current.zone || !current.type) {
      await startPriceFlow(ctx, chatId);
      return;
    }

    const basePrice = resolveBasePrice(current.zone, current.type);
    const total = calculatePrice(basePrice, count);
    const perVehicle = Math.round(total / count);
    const discount =
      count >= 11 ? 15 : count >= 6 ? 10 : count >= 2 ? 5 : 0;

    await clearSession(chatId);

    const discountText = discount > 0 ? ` (скидка ${discount}%)` : "";
    await ctx.reply(
      `Расчёт стоимости:\n\n` +
        `Зона: ${zoneLabels[current.zone]}\n` +
        `Тип: ${typeLabels[current.type]}\n` +
        `Машин: ${count}\n` +
        `Цена за машину: ${perVehicle.toLocaleString("ru-RU")} ₽${discountText}\n` +
        `Итого: ${total.toLocaleString("ru-RU")} ₽\n\n` +
        `В цену включён бесплатный временный пропуск на время оформления.\n` +
        `Чтобы оформить заявку — нажмите «Оформить».`,
      { reply_markup: mainMenuKeyboard() },
    );
  });

  // ── Free text ──────────────────────────────────────────────────────────

  bot.on("message:text", async (ctx) => {
    const chatId = ctx.chat?.id;
    if (!chatId) return;
    const text = ctx.message.text.trim();
    if (text.startsWith("/")) return; // commands are handled above

    const state = await getSession(chatId);

    switch (state.step) {
      case "awaiting_link_code": {
        if (!/^\d{6}$/.test(text)) {
          await ctx.reply("Код должен состоять из 6 цифр. Попробуйте ещё раз.");
          return;
        }
        const result = await postLinkToApi(text, ctx.from?.id ?? 0);
        if (result.success) {
          await clearSession(chatId);
          await ctx.reply(
            "Аккаунт привязан! Теперь я могу показывать ваши заявки.",
            { reply_markup: mainMenuKeyboard() },
          );
        } else {
          await ctx.reply(
            result.error ?? "Код недействителен. Запросите новый в личном кабинете.",
          );
        }
        return;
      }

      case "status_query": {
        await clearSession(chatId);
        await ctx.reply(
          `Ищу заявку по запросу: ${text}.\n\n` +
            "Онлайн-проверка статусов находится в разработке. Пока вы можете отслеживать статус в личном кабинете: infolog24.ru/dashboard\n" +
            "Или позвоните нам: +7 (499) 110-55-49.",
          { reply_markup: mainMenuKeyboard() },
        );
        return;
      }

      case "order_contact_name": {
        if (text.length < 2 || text.length > 100) {
          await ctx.reply("Введите имя (2–100 символов).");
          return;
        }
        await setSession(chatId, {
          ...state,
          step: "order_contact_phone",
          name: text,
        });
        await ctx.reply(
          `Спасибо, ${text}. Теперь укажите телефон для связи.`,
          { reply_markup: backKeyboard() },
        );
        return;
      }

      case "order_contact_phone": {
        if (!/^[\d\s+\-()]{7,20}$/.test(text)) {
          await ctx.reply("Некорректный формат телефона. Попробуйте ещё раз.");
          return;
        }
        await setSession(chatId, {
          ...state,
          step: "order_contact_comment",
          phone: text,
        });
        await ctx.reply(
          "Добавьте комментарий (что именно нужно, зона, количество машин). Или отправьте «-», если комментария нет.",
          { reply_markup: backKeyboard() },
        );
        return;
      }

      case "order_contact_comment": {
        const comment = text === "-" ? "" : text;
        const name = state.name ?? "Клиент";
        const phone = state.phone ?? "";
        if (!phone) {
          await clearSession(chatId);
          await ctx.reply("Что-то пошло не так. Начните заново: /order");
          return;
        }
        const ok = await postLeadToApi({ name, phone, message: comment });
        await clearSession(chatId);
        if (ok) {
          await ctx.reply(
            `Спасибо, ${name}! Заявка принята. Менеджер свяжется с вами в ближайшее время по номеру ${phone}.`,
            { reply_markup: mainMenuKeyboard() },
          );
        } else {
          await ctx.reply(
            "Не удалось автоматически создать заявку. Пожалуйста, позвоните нам: +7 (499) 110-55-49.",
            { reply_markup: mainMenuKeyboard() },
          );
        }
        return;
      }

      default:
        await ctx.reply(
          "Не совсем понял. Откройте меню для выбора действия.",
          { reply_markup: mainMenuKeyboard() },
        );
    }
  });

  // ── Document / photo upload ────────────────────────────────────────────

  async function handleUpload(
    ctx: Context,
    fileId: string,
    fileName: string,
    mimeType: string | undefined,
  ): Promise<void> {
    const telegramUserId = ctx.from?.id;
    if (!telegramUserId) return;

    const linkedUser = telegramUserId
      ? await getLinkedUserId(telegramUserId)
      : null;

    try {
      const file = await ctx.api.getFile(fileId);
      const downloadUrl = `https://api.telegram.org/file/bot${token}/${file.file_path ?? ""}`;
      // Placeholder: when S3 helper from MF-1D is ready, replace with upload.
      // For now, just log the metadata — the webhook route doesn't stream the
      // file itself, so we capture everything we need to fetch it later.
      logger.info(
        {
          telegramUserId,
          userId: linkedUser,
          fileId,
          fileName,
          mimeType,
          downloadUrl,
          size: file.file_size,
        },
        "Telegram file received",
      );
    } catch (error) {
      logger.warn({ error, fileId }, "Failed to resolve Telegram file");
    }

    if (linkedUser) {
      await ctx.reply(
        `Файл «${fileName}» получен и передан менеджеру. Он появится в вашем личном кабинете после проверки.`,
      );
    } else {
      await ctx.reply(
        `Файл «${fileName}» получен. Чтобы файл автоматически попал в ваш личный кабинет, привяжите аккаунт командой /link КОД.`,
      );
    }
  }

  bot.on("message:document", async (ctx) => {
    const doc = ctx.message.document;
    await handleUpload(
      ctx,
      doc.file_id,
      doc.file_name ?? `document-${doc.file_id}`,
      doc.mime_type,
    );
  });

  bot.on("message:photo", async (ctx) => {
    const photos = ctx.message.photo;
    const best = photos[photos.length - 1];
    if (!best) return;
    await handleUpload(ctx, best.file_id, `photo-${best.file_unique_id}.jpg`, "image/jpeg");
  });

  // ── Error handler ──────────────────────────────────────────────────────

  bot.catch((err) => {
    logger.error(
      { error: err.error instanceof Error ? err.error.message : err.error },
      "Telegram bot error",
    );
  });

  return bot;
}
