import type { NotificationChannel } from "./channels";

/**
 * Per-channel variant of a template.
 *
 * - `email`: html + plain-text fallback + subject
 * - `sms`: short plain-text body (≤ 160 chars recommended)
 * - `telegram`: markdown-formatted body
 * - `push`: title + short body
 */
export interface TemplateVariants {
  email?: {
    subject: string;
    html: string;
    text: string;
  };
  sms?: {
    text: string;
  };
  telegram?: {
    markdown: string;
  };
  push?: {
    title: string;
    body: string;
  };
}

export interface NotificationTemplate {
  event: string;
  /** Default title (used when a channel variant does not supply its own). */
  title: string;
  /** Default body (used when a channel variant does not supply its own). */
  body: string;
  /** Channels the template is configured for. */
  channels: NotificationChannel[];
  /** Per-channel overrides with rich formatting. */
  variants?: TemplateVariants;
}

// ── Helpers ───────────────────────────────────────────────────────────────

/**
 * Simple `{{variable}}` renderer. Missing variables render as empty string.
 */
export function renderTemplate(
  template: string,
  data: Record<string, string | number | undefined | null>,
): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_match, key: string) => {
    const value = data[key];
    return value == null ? "" : String(value);
  });
}

/**
 * Render every string field of a TemplateVariants block with the given data.
 */
export function renderVariants(
  variants: TemplateVariants,
  data: Record<string, string | number | undefined | null>,
): TemplateVariants {
  const out: TemplateVariants = {};
  if (variants.email) {
    out.email = {
      subject: renderTemplate(variants.email.subject, data),
      html: renderTemplate(variants.email.html, data),
      text: renderTemplate(variants.email.text, data),
    };
  }
  if (variants.sms) {
    out.sms = { text: renderTemplate(variants.sms.text, data) };
  }
  if (variants.telegram) {
    out.telegram = {
      markdown: renderTemplate(variants.telegram.markdown, data),
    };
  }
  if (variants.push) {
    out.push = {
      title: renderTemplate(variants.push.title, data),
      body: renderTemplate(variants.push.body, data),
    };
  }
  return out;
}

// ── Templates ─────────────────────────────────────────────────────────────

const ALL: NotificationChannel[] = ["email", "sms", "telegram", "push"];

export const notificationTemplates: NotificationTemplate[] = [
  // ── Order lifecycle ────────────────────────────────────────────────────
  {
    event: "order_created",
    title: "Заявка №{{orderNumber}} создана",
    body: "Ваша заявка на {{passType}} для зоны {{zone}} создана. Ожидайте дальнейших инструкций.",
    channels: ["email", "telegram", "push"],
    variants: {
      email: {
        subject: "Заявка №{{orderNumber}} создана",
        html: "<p>Здравствуйте!</p><p>Ваша заявка <b>№{{orderNumber}}</b> на пропуск <b>{{passType}}</b> для зоны <b>{{zone}}</b> успешно создана.</p><p>Мы уведомим вас, когда потребуется загрузить документы.</p>",
        text: "Заявка №{{orderNumber}} на пропуск {{passType}} для зоны {{zone}} создана.",
      },
      telegram: {
        markdown:
          "*Заявка №{{orderNumber}} создана*\n\nПропуск: {{passType}}\nЗона: {{zone}}",
      },
      push: {
        title: "Заявка №{{orderNumber}} создана",
        body: "Пропуск {{passType}} · {{zone}}",
      },
    },
  },
  {
    event: "order_status_changed",
    title: "Статус заявки №{{orderNumber}} изменён",
    body: "Статус заявки №{{orderNumber}} изменён: {{fromStatus}} → {{toStatus}}.",
    channels: ["email", "telegram", "push"],
  },
  {
    event: "order_documents_required",
    title: "Требуются документы по заявке №{{orderNumber}}",
    body: "Для продолжения обработки заявки №{{orderNumber}} необходимо загрузить документы: {{missingDocs}}.",
    channels: ["email", "sms", "telegram", "push"],
    variants: {
      sms: {
        text: "Инфологистик-24: по заявке №{{orderNumber}} нужны документы. Откройте личный кабинет.",
      },
    },
  },
  {
    event: "order_payment_required",
    title: "Ожидается оплата по заявке №{{orderNumber}}",
    body: "Документы проверены. Оплатите заявку №{{orderNumber}} на сумму {{amount}} ₽, чтобы мы начали оформление.",
    channels: ["email", "sms", "telegram", "push"],
    variants: {
      sms: {
        text: "Инфологистик-24: оплатите заявку №{{orderNumber}} ({{amount}} ₽) в личном кабинете.",
      },
    },
  },
  {
    event: "order_processing",
    title: "Заявка №{{orderNumber}} в обработке",
    body: "Оплата получена. Ваша заявка №{{orderNumber}} принята в работу. Срок — 3-5 рабочих дней.",
    channels: ["email", "telegram", "push"],
  },
  {
    event: "order_submitted",
    title: "Заявка №{{orderNumber}} отправлена в Дептранс",
    body: "Ваша заявка №{{orderNumber}} передана в Дептранс. Ожидайте решения.",
    channels: ["email", "telegram", "push"],
  },
  {
    event: "order_approved",
    title: "Заявка №{{orderNumber}} одобрена",
    body: "Поздравляем! Заявка №{{orderNumber}} одобрена. Пропуск на {{passType}} для зоны {{zone}} оформлен.",
    channels: ["email", "sms", "telegram", "push"],
    variants: {
      sms: {
        text: "Инфологистик-24: заявка №{{orderNumber}} одобрена! Пропуск оформлен.",
      },
    },
  },
  {
    event: "order_rejected",
    title: "Заявка №{{orderNumber}} отклонена",
    body: "К сожалению, заявка №{{orderNumber}} отклонена. Причина: {{reason}}. Свяжитесь с менеджером.",
    channels: ["email", "sms", "telegram", "push"],
  },
  {
    event: "order_cancelled",
    title: "Заявка №{{orderNumber}} отменена",
    body: "Заявка №{{orderNumber}} отменена. Если это ошибка — создайте новую или обратитесь в поддержку.",
    channels: ["email", "telegram"],
  },

  // ── Payment ─────────────────────────────────────────────────────────────
  {
    event: "payment_succeeded",
    title: "Оплата получена",
    body: "Оплата по заявке №{{orderNumber}} на сумму {{amount}} ₽ получена. Спасибо!",
    channels: ["email", "telegram", "push"],
  },
  {
    event: "payment_failed",
    title: "Платёж не прошёл",
    body: "Не удалось провести оплату по заявке №{{orderNumber}}. Попробуйте снова или выберите другой способ оплаты.",
    channels: ["email", "sms", "telegram", "push"],
  },
  {
    event: "payment_refunded",
    title: "Оплата возвращена",
    body: "Оплата по заявке №{{orderNumber}} на сумму {{amount}} ₽ возвращена на вашу карту.",
    channels: ["email", "telegram", "push"],
  },

  // ── Permits ─────────────────────────────────────────────────────────────
  {
    event: "permit_issued",
    title: "Пропуск {{permitNumber}} выдан",
    body: "Пропуск {{permitNumber}} для зоны {{zone}} успешно оформлен. Действителен до {{validUntil}}.",
    channels: ["email", "sms", "telegram", "push"],
  },
  {
    event: "permit_expiring_30days",
    title: "Пропуск {{permitNumber}} истекает через 30 дней",
    body: "Пропуск {{permitNumber}} для зоны {{zone}} истекает {{expiryDate}}. Оформите продление заранее.",
    channels: ["email", "telegram", "push"],
  },
  {
    event: "permit_expiring_7days",
    title: "Пропуск {{permitNumber}} истекает через 7 дней",
    body: "Внимание! Пропуск {{permitNumber}} истекает {{expiryDate}}. Рекомендуем оформить продление.",
    channels: ["email", "sms", "telegram", "push"],
  },
  {
    event: "permit_expiring_1day",
    title: "Пропуск {{permitNumber}} истекает завтра",
    body: "Пропуск {{permitNumber}} истекает завтра ({{expiryDate}}). Срочно оформите продление, чтобы избежать штрафов.",
    channels: ALL,
  },
  {
    event: "permit_expired",
    title: "Пропуск {{permitNumber}} истёк",
    body: "Пропуск {{permitNumber}} для зоны {{zone}} истёк. Оформите новый, чтобы продолжить поездки.",
    channels: ["email", "sms", "telegram", "push"],
  },
  {
    event: "permit_revoked",
    title: "Пропуск {{permitNumber}} аннулирован",
    body: "Пропуск {{permitNumber}} был аннулирован. Причина: {{reason}}. Свяжитесь с менеджером.",
    channels: ["email", "sms", "telegram", "push"],
  },

  // ── Documents ───────────────────────────────────────────────────────────
  {
    event: "document_approved",
    title: "Документ одобрен",
    body: "Документ «{{documentName}}» по заявке №{{orderNumber}} одобрен.",
    channels: ["email", "telegram", "push"],
  },
  {
    event: "document_rejected",
    title: "Документ отклонён",
    body: "Документ «{{documentName}}» по заявке №{{orderNumber}} отклонён. Причина: {{reason}}. Загрузите исправленную версию.",
    channels: ["email", "sms", "telegram", "push"],
  },

  // ── Vehicles ────────────────────────────────────────────────────────────
  {
    event: "vehicle_added",
    title: "ТС добавлено",
    body: "Транспортное средство {{plateNumber}} ({{brand}} {{model}}) добавлено в ваш гараж.",
    channels: ["email", "telegram"],
  },

  // ── Account ─────────────────────────────────────────────────────────────
  {
    event: "welcome",
    title: "Добро пожаловать в Инфологистик-24!",
    body: "Здравствуйте, {{userName}}! Мы поможем вам быстро оформить пропуска в Москву. Создайте первую заявку в личном кабинете.",
    channels: ["email", "telegram"],
    variants: {
      email: {
        subject: "Добро пожаловать в Инфологистик-24",
        html: "<h2>Здравствуйте, {{userName}}!</h2><p>Спасибо за регистрацию в <b>Инфологистик-24</b>. Мы поможем вам оформить пропуска МКАД, ТТК и Садового кольца быстро и без лишних забот.</p>",
        text: "Здравствуйте, {{userName}}! Спасибо за регистрацию в Инфологистик-24.",
      },
    },
  },
  {
    event: "password_reset",
    title: "Сброс пароля",
    body: "Вы запросили сброс пароля. Перейдите по ссылке для установки нового пароля: {{resetUrl}}. Ссылка действительна 1 час.",
    channels: ["email"],
  },
  {
    event: "email_verification",
    title: "Подтверждение email",
    body: "Для подтверждения email перейдите по ссылке: {{verificationUrl}}",
    channels: ["email"],
  },
  {
    event: "2fa_enabled",
    title: "Двухфакторная аутентификация включена",
    body: "Для вашей учётной записи включена двухфакторная аутентификация. Если это были не вы — немедленно свяжитесь с поддержкой.",
    channels: ["email", "telegram"],
  },
  {
    event: "password_changed",
    title: "Пароль изменён",
    body: "Пароль вашей учётной записи был изменён. Если это были не вы — немедленно свяжитесь с поддержкой.",
    channels: ["email"],
  },

  // ── Admin/Manager ───────────────────────────────────────────────────────
  {
    event: "consultation_request",
    title: "Новая заявка на консультацию",
    body: "Новая заявка на консультацию от {{userName}} ({{phone}}). Сообщение: {{message}}",
    channels: ["email", "telegram"],
  },
  {
    event: "new_lead",
    title: "Новый лид",
    body: "Новый лид: {{userName}}, {{phone}}. Источник: {{source}}.",
    channels: ["email", "telegram"],
  },
  {
    event: "urgent_attention",
    title: "Требует внимания",
    body: "Заявка №{{orderNumber}} требует срочного внимания менеджера. Причина: {{reason}}.",
    channels: ["email", "telegram", "push"],
  },

  // ── Drip campaign events ────────────────────────────────────────────────
  {
    event: "order_reminder_day1",
    title: "Не забудьте загрузить документы",
    body: "Вчера вы создали заявку №{{orderNumber}}. Загрузите документы в личном кабинете, чтобы мы продолжили оформление.",
    channels: ["email", "telegram"],
  },
  {
    event: "order_reminder_day3",
    title: "Последнее напоминание по заявке №{{orderNumber}}",
    body: "Ваша заявка №{{orderNumber}} ждёт документов уже 3 дня. Без документов мы не можем продолжить оформление.",
    channels: ["email", "sms", "telegram"],
  },
  {
    event: "payment_confirmation",
    title: "Оплата подтверждена",
    body: "Спасибо! Оплата по заявке №{{orderNumber}} подтверждена. Мы приступили к оформлению.",
    channels: ["email", "telegram", "push"],
  },
  {
    event: "next_steps",
    title: "Что дальше?",
    body: "Ваша заявка №{{orderNumber}} в работе. Мы уведомим вас о каждом этапе оформления.",
    channels: ["email", "telegram"],
  },
  {
    event: "review_request",
    title: "Оцените наш сервис",
    body: "Спасибо, что воспользовались Инфологистик-24! Поделитесь впечатлениями — это поможет нам стать лучше: {{reviewUrl}}",
    channels: ["email"],
  },
  {
    event: "permit_expiring_45days",
    title: "Пропуск {{permitNumber}} истекает через 45 дней",
    body: "Пропуск {{permitNumber}} истекает {{expiryDate}}. Самое время задуматься о продлении.",
    channels: ["email", "telegram"],
  },
  {
    event: "permit_expiring_14days",
    title: "Пропуск {{permitNumber}} истекает через 14 дней",
    body: "Пропуск {{permitNumber}} истекает {{expiryDate}}. Рекомендуем оформить продление сейчас.",
    channels: ["email", "telegram", "push"],
  },
];

/**
 * Find a template by event name.
 */
export function getTemplateByEvent(
  event: string,
): NotificationTemplate | undefined {
  return notificationTemplates.find((t) => t.event === event);
}
