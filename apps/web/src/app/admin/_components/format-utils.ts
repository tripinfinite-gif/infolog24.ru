/**
 * Shared formatting utilities for admin pages.
 * No dependency on mock data.
 */

export function formatPrice(value: number): string {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value / 100);
}

/** Format price when the value is already in rubles (not kopecks) */
export function formatPriceRub(value: number): string {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDate(dateInput: string | Date): string {
  const d = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  return d.toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function formatDateTime(dateInput: string | Date): string {
  const d = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  return d.toLocaleString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export const ORDER_TYPE_LABELS: Record<string, string> = {
  mkad_day: "МКАД (дневной)",
  mkad_night: "МКАД (ночной)",
  ttk: "ТТК",
  sk: "Садовое кольцо",
  temp: "Временный",
};

export const ZONE_LABELS: Record<string, string> = {
  mkad: "МКАД",
  ttk: "ТТК",
  sk: "СК",
};

export const DOCUMENT_TYPE_LABELS: Record<string, string> = {
  pts: "ПТС",
  sts: "СТС",
  driver_license: "Водительское удостоверение",
  power_of_attorney: "Доверенность",
  application: "Заявление",
  contract: "Договор",
  other: "Другое",
};

export const PAYMENT_STATUS_LABELS: Record<string, string> = {
  succeeded: "Оплачено",
  pending: "Ожидание",
  cancelled: "Отменено",
  refunded: "Возврат",
};

export const PAYMENT_STATUS_COLORS: Record<string, string> = {
  succeeded: "bg-green-100 text-green-700",
  pending: "bg-amber-100 text-amber-700",
  cancelled: "bg-gray-100 text-gray-700",
  refunded: "bg-red-100 text-red-700",
};

export const PERMIT_STATUS_LABELS: Record<string, string> = {
  active: "Активен",
  expired: "Истёк",
  revoked: "Отозван",
};

export const PERMIT_STATUS_COLORS: Record<string, string> = {
  active: "bg-green-100 text-green-700",
  expired: "bg-gray-100 text-gray-700",
  revoked: "bg-red-100 text-red-700",
};

export const ACTION_LABELS: Record<string, string> = {
  login: "Вход",
  logout: "Выход",
  status_change: "Смена статуса",
  document_review: "Проверка документа",
  settings_change: "Изменение настроек",
  assign_manager: "Назначение менеджера",
  payment_confirm: "Подтверждение оплаты",
  comment_add: "Добавление комментария",
  user_create: "Создание пользователя",
  export_data: "Экспорт данных",
};

export const ACTION_COLORS: Record<string, string> = {
  login: "bg-green-100 text-green-700",
  logout: "bg-gray-100 text-gray-700",
  status_change: "bg-blue-100 text-blue-700",
  document_review: "bg-amber-100 text-amber-700",
  settings_change: "bg-purple-100 text-purple-700",
  assign_manager: "bg-indigo-100 text-indigo-700",
  payment_confirm: "bg-emerald-100 text-emerald-700",
  comment_add: "bg-sky-100 text-sky-700",
  user_create: "bg-pink-100 text-pink-700",
  export_data: "bg-orange-100 text-orange-700",
};
