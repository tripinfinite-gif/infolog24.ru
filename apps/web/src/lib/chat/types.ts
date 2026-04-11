/**
 * Контекст страницы, на которой клиент общается с ассистентом.
 * Передаётся в /api/chat вместе с сообщениями, чтобы ассистент знал,
 * где сейчас клиент и какую сущность он смотрит — и мог давать
 * персонализированные ответы без переспросов.
 */
export type ClientContext = {
  /** Полный pathname страницы, например "/dashboard/orders/abc-123". */
  route: string;
  /** Человеко-читаемое название раздела (для system prompt). */
  section?: string;
  /** Опциональная сущность, которую клиент сейчас просматривает. */
  entity?: EntityRef;
};

/**
 * Ссылка на сущность, которую клиент сейчас просматривает в кабинете
 * или на сайте. Ассистент может использовать её, чтобы вызвать
 * соответствующий cabinet tool (getMyVehicles, getMyOrders и т. д.)
 * или поговорить про конкретный объект.
 */
export type EntityRef =
  | { kind: "order"; id: string }
  | { kind: "vehicle"; id: string }
  | { kind: "permit"; id: string }
  | { kind: "document"; id: string }
  | { kind: "service"; slug: string }
  | { kind: "blog"; slug: string }
  | { kind: "new_order_form" }
  | { kind: "new_vehicle_form" };
