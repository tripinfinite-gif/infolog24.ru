import type { NotificationChannel } from "./channels";

export interface NotificationTemplate {
  event: string;
  title: string;
  body: string;
  channels: NotificationChannel[];
}

/**
 * Seed data for notification templates.
 *
 * Templates use `{{variable}}` placeholders that are substituted at send time.
 */
export const notificationTemplates: NotificationTemplate[] = [
  // ── Order lifecycle ────────────────────────────────────────────────────
  {
    event: "order_created",
    title: "Заявка №{{orderNumber}} создана",
    body: "Ваша заявка на {{passType}} для зоны {{zone}} создана. Загрузите необходимые документы для продолжения.",
    channels: ["email", "telegram"],
  },
  {
    event: "order_documents_needed",
    title: "Требуются документы по заявке №{{orderNumber}}",
    body: "Для продолжения обработки заявки №{{orderNumber}} необходимо загрузить недостающие документы. Перейдите в личный кабинет.",
    channels: ["email", "sms", "telegram"],
  },
  {
    event: "order_payment_needed",
    title: "Ожидается оплата по заявке №{{orderNumber}}",
    body: "Документы по заявке №{{orderNumber}} проверены. Оплатите заявку, чтобы мы начали оформление пропуска.",
    channels: ["email", "sms", "telegram"],
  },
  {
    event: "order_processing",
    title: "Заявка №{{orderNumber}} в обработке",
    body: "Оплата получена. Ваша заявка №{{orderNumber}} принята в работу. Ориентировочный срок — 3-5 рабочих дней.",
    channels: ["email", "telegram"],
  },
  {
    event: "order_submitted",
    title: "Заявка №{{orderNumber}} подана",
    body: "Ваша заявка №{{orderNumber}} подана в ЦОДД. Ожидайте решения.",
    channels: ["email", "telegram"],
  },
  {
    event: "order_approved",
    title: "Пропуск по заявке №{{orderNumber}} одобрен!",
    body: "Поздравляем! Ваша заявка №{{orderNumber}} одобрена. Пропуск на {{passType}} для зоны {{zone}} оформлен.",
    channels: ["email", "sms", "telegram"],
  },
  {
    event: "order_rejected",
    title: "Заявка №{{orderNumber}} отклонена",
    body: "К сожалению, заявка №{{orderNumber}} отклонена. Свяжитесь с менеджером для уточнения деталей и повторной подачи.",
    channels: ["email", "sms", "telegram"],
  },
  {
    event: "order_cancelled",
    title: "Заявка №{{orderNumber}} отменена",
    body: "Заявка №{{orderNumber}} отменена. Если это ошибка — создайте новую заявку или обратитесь в поддержку.",
    channels: ["email", "telegram"],
  },

  // ── Documents ──────────────────────────────────────────────────────────
  {
    event: "documents_approved",
    title: "Документы одобрены",
    body: "Документы по заявке №{{orderNumber}} проверены и одобрены. Переходите к оплате.",
    channels: ["email", "sms", "telegram"],
  },
  {
    event: "document_rejected",
    title: "Документ отклонён",
    body: "Документ «{{documentName}}» по заявке №{{orderNumber}} отклонён. Причина: {{reason}}. Загрузите исправленную версию.",
    channels: ["email", "sms", "telegram"],
  },

  // ── Payment ────────────────────────────────────────────────────────────
  {
    event: "payment_received",
    title: "Оплата получена",
    body: "Оплата по заявке №{{orderNumber}} на сумму {{amount}} ₽ получена. Спасибо!",
    channels: ["email", "telegram"],
  },

  // ── Permit expiration ──────────────────────────────────────────────────
  {
    event: "permit_expiring_30d",
    title: "Пропуск истекает через 30 дней",
    body: "Ваш пропуск {{permitNumber}} для зоны {{zone}} истекает {{expiryDate}}. Оформите продление заранее.",
    channels: ["email", "telegram"],
  },
  {
    event: "permit_expiring_14d",
    title: "Пропуск истекает через 2 недели",
    body: "Ваш пропуск {{permitNumber}} для зоны {{zone}} истекает {{expiryDate}}. Рекомендуем оформить продление сейчас.",
    channels: ["email", "sms", "telegram"],
  },
  {
    event: "permit_expiring_7d",
    title: "Пропуск истекает через 7 дней!",
    body: "Внимание! Ваш пропуск {{permitNumber}} истекает {{expiryDate}}. Оформите продление, чтобы избежать штрафов.",
    channels: ["email", "sms", "telegram"],
  },
  {
    event: "permit_expired",
    title: "Пропуск истёк",
    body: "Ваш пропуск {{permitNumber}} для зоны {{zone}} истёк. Оформите новый пропуск, чтобы продолжить поездки.",
    channels: ["email", "sms", "telegram"],
  },

  // ── Account ────────────────────────────────────────────────────────────
  {
    event: "new_message",
    title: "Новое сообщение",
    body: "Вы получили новое сообщение по заявке №{{orderNumber}}. Откройте личный кабинет для просмотра.",
    channels: ["email", "telegram"],
  },
  {
    event: "password_changed",
    title: "Пароль изменён",
    body: "Пароль вашей учётной записи был изменён. Если это были не вы — немедленно свяжитесь с поддержкой.",
    channels: ["email"],
  },
  {
    event: "welcome",
    title: "Добро пожаловать в Инфологистик-24!",
    body: "Здравствуйте, {{userName}}! Добро пожаловать в Инфологистик-24. Создайте первую заявку на оформление пропуска.",
    channels: ["email", "telegram"],
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
