import { InlineKeyboard } from "grammy";

/**
 * Callback data prefixes used by the Telegram bot.
 * Keep them short — Telegram caps callback data at 64 bytes.
 */
export const CB = {
  menu: "menu",
  price: "price",
  status: "status",
  order: "order",
  contact: "contact",
  myPermits: "my_permits",
  help: "help",
  zonePrefix: "zone:",
  typePrefix: "type:",
  countPrefix: "count:",
  back: "back",
  yes: "yes",
  no: "no",
} as const;

/** Main inline menu shown on /start and /menu. */
export function mainMenuKeyboard(): InlineKeyboard {
  return new InlineKeyboard()
    .text("Узнать цену", CB.price)
    .text("Мои пропуска", CB.myPermits)
    .row()
    .text("Статус заявки", CB.status)
    .text("Оформить", CB.order)
    .row()
    .text("Контакты", CB.contact)
    .text("Помощь", CB.help);
}

export function zonesKeyboard(): InlineKeyboard {
  return new InlineKeyboard()
    .text("МКАД", `${CB.zonePrefix}mkad`)
    .text("ТТК", `${CB.zonePrefix}ttk`)
    .text("Садовое кольцо", `${CB.zonePrefix}sk`)
    .row()
    .text("← Назад", CB.back);
}

export function permitTypesKeyboard(): InlineKeyboard {
  return new InlineKeyboard()
    .text("Годовой дневной", `${CB.typePrefix}annual_day`)
    .row()
    .text("Годовой ночной", `${CB.typePrefix}annual_night`)
    .row()
    .text("Разовый (до 10 суток)", `${CB.typePrefix}temporary`)
    .row()
    .text("← Назад", CB.back);
}

export function vehicleCountKeyboard(): InlineKeyboard {
  return new InlineKeyboard()
    .text("1", `${CB.countPrefix}1`)
    .text("2", `${CB.countPrefix}2`)
    .text("5", `${CB.countPrefix}5`)
    .row()
    .text("10", `${CB.countPrefix}10`)
    .text("20", `${CB.countPrefix}20`)
    .text("50", `${CB.countPrefix}50`)
    .row()
    .text("← Назад", CB.back);
}

export function yesNoKeyboard(): InlineKeyboard {
  return new InlineKeyboard().text("Да", CB.yes).text("Нет", CB.no);
}

export function backKeyboard(): InlineKeyboard {
  return new InlineKeyboard().text("← В главное меню", CB.menu);
}
