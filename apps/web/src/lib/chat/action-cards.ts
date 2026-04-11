/**
 * Action Cards — кликабельные кнопки под ответами AI-ассистента.
 *
 * Идея: некоторые tools (getMyContext, getMyPermits, getPriceCalculation и т. д.)
 * возвращают в результате массив `actions: ActionCard[]`. Чат-виджет рендерит
 * эти действия как кнопки под результатом tool, и клик ведёт пользователя
 * либо на нужную страницу с предзаполнением (через href), либо вызывает
 * соответствующий API напрямую (через kind handler).
 *
 * Используется тремя слоями:
 * 1. tools.ts — формирует и возвращает actions из execute()
 * 2. system-prompt.ts — инструктирует LLM не повторять словами действия,
 *    которые уже отрендерены кнопками
 * 3. chat-messages.tsx — рендерит ActionCardList под каждым tool result
 */

/**
 * Один из конкретных типов действий, которое может предложить ассистент.
 * Дискриминированный union по полю `kind` — TypeScript автоматически сужает
 * payload для каждого варианта.
 */
export type ActionCard =
  /** Продлить пропуск — открывает форму новой заявки с предзаполнением. */
  | { kind: "extend_permit"; permitId: string; vehicleId?: string; zone?: PermitZone; label?: string }
  /** Создать новую заявку — открывает мастер с предзаполнением (если переданы поля). */
  | { kind: "create_order"; vehicleId?: string; zone?: PermitZone; permitType?: PermitType; label?: string }
  /** Загрузить документ к существующей заявке. */
  | { kind: "upload_document"; orderId: string; documentType?: string; label?: string }
  /** Открыть страницу заявки. */
  | { kind: "view_order"; orderId: string; label?: string }
  /** Открыть страницу пропуска (или его заявки). */
  | { kind: "view_permit"; permitId: string; label?: string }
  /** Открыть страницу грузовика (если будет страница). */
  | { kind: "view_vehicle"; vehicleId: string; label?: string }
  /** Связаться с менеджером (callback), опциональный приоритет. */
  | { kind: "contact_manager"; reason?: string; priority?: "normal" | "high"; label?: string }
  /** Открыть форму загрузки архива документов (P-archive). */
  | { kind: "upload_archive"; vehicleId?: string; zone?: PermitZone; label?: string }
  /** Произвольная навигация. Используется редко, для нестандартных случаев. */
  | { kind: "open_link"; href: string; label: string };

export type PermitZone = "mkad" | "ttk" | "sk";
export type PermitType = "annual_day" | "annual_night" | "temporary";

/**
 * Расширение результата tool-а полем actions.
 * Используется в типах возврата tool execute(), чтобы IDE знала о поле.
 */
export type WithActions<T> = T & { actions?: ActionCard[] };

/**
 * Возвращает href для action card, если действие можно выразить навигацией.
 * Возвращает null для действий, которые требуют inline-вызова (например,
 * contact_manager — нужен модал/API call, не страница).
 *
 * URL-схема (синхронизирована с существующими страницами кабинета):
 *  /dashboard/orders/new?vehicleId=...&zone=...&type=...
 *  /dashboard/orders/{id}
 *  /dashboard/orders/{id}?upload={documentType}
 *  /dashboard/permits  (нет страниц по id у permit'ов на 2026-04, ведём в список)
 *  /dashboard/vehicles (то же)
 */
export function resolveActionHref(action: ActionCard): string | null {
  switch (action.kind) {
    case "create_order":
    case "extend_permit": {
      const params = new URLSearchParams();
      if ("vehicleId" in action && action.vehicleId) params.set("vehicleId", action.vehicleId);
      if ("zone" in action && action.zone) params.set("zone", action.zone);
      if (action.kind === "create_order" && action.permitType) {
        params.set("type", action.permitType);
      }
      if (action.kind === "extend_permit") {
        params.set("source", "extend");
        if (action.permitId) params.set("permitId", action.permitId);
      }
      const qs = params.toString();
      return `/dashboard/orders/new${qs ? `?${qs}` : ""}`;
    }
    case "upload_document": {
      const params = new URLSearchParams({ upload: action.documentType ?? "any" });
      return `/dashboard/orders/${action.orderId}?${params.toString()}`;
    }
    case "upload_archive": {
      const params = new URLSearchParams({ tab: "archive" });
      if (action.vehicleId) params.set("vehicleId", action.vehicleId);
      if (action.zone) params.set("zone", action.zone);
      return `/dashboard/orders/new?${params.toString()}`;
    }
    case "view_order":
      return `/dashboard/orders/${action.orderId}`;
    case "view_permit":
      // Пока нет страницы по id для пропусков — ведём в общий список.
      // Когда появится /dashboard/permits/[id] — обновить.
      return `/dashboard/permits`;
    case "view_vehicle":
      return `/dashboard/vehicles`;
    case "open_link":
      return action.href;
    case "contact_manager":
      // Не страница: триггер inline-handler в виджете (модалка callback).
      return null;
  }
}

/**
 * Возвращает человеко-читаемый текст кнопки.
 * Если автор action указал свой `label` — берём его, иначе fallback по kind.
 */
export function getActionLabel(action: ActionCard): string {
  if ("label" in action && action.label) return action.label;
  switch (action.kind) {
    case "extend_permit":
      return "Продлить пропуск";
    case "create_order":
      return "Оформить заявку";
    case "upload_archive":
      return "Загрузить архив документов";
    case "upload_document":
      return "Загрузить документ";
    case "view_order":
      return "Открыть заявку";
    case "view_permit":
      return "Открыть пропуск";
    case "view_vehicle":
      return "Открыть грузовик";
    case "contact_manager":
      return action.priority === "high"
        ? "Срочно связаться с менеджером"
        : "Связаться с менеджером";
    case "open_link":
      return action.label;
  }
}

/**
 * Имя иконки lucide-react для action card.
 * UI-агент использует это, чтобы единообразно отрендерить иконки.
 * Возвращает строку — имя иконки в lucide-react (RefreshCw, Plus, и т. д.).
 * Импорт самих компонентов происходит на стороне UI.
 */
export function getActionIconName(action: ActionCard): string {
  switch (action.kind) {
    case "extend_permit":
      return "RefreshCw";
    case "create_order":
      return "Plus";
    case "upload_archive":
      return "FileArchive";
    case "upload_document":
      return "Upload";
    case "view_order":
      return "FileText";
    case "view_permit":
      return "ScrollText";
    case "view_vehicle":
      return "Truck";
    case "contact_manager":
      return action.priority === "high" ? "PhoneCall" : "Phone";
    case "open_link":
      return "ExternalLink";
  }
}

/**
 * Безопасная проверка: находится ли в произвольном объекте поле actions
 * с массивом ActionCard. Используется UI-кодом, чтобы не падать на старых
 * tool-результатах, у которых поля нет.
 */
export function extractActionsFromResult(result: unknown): ActionCard[] {
  if (!result || typeof result !== "object") return [];
  const maybe = (result as { actions?: unknown }).actions;
  if (!Array.isArray(maybe)) return [];
  return maybe.filter(isValidActionCard);
}

function isValidActionCard(value: unknown): value is ActionCard {
  if (!value || typeof value !== "object") return false;
  const v = value as { kind?: unknown };
  if (typeof v.kind !== "string") return false;
  return [
    "extend_permit",
    "create_order",
    "upload_archive",
    "upload_document",
    "view_order",
    "view_permit",
    "view_vehicle",
    "contact_manager",
    "open_link",
  ].includes(v.kind);
}
