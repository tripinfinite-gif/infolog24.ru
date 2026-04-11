import type { ClientContext, EntityRef } from "./types";

/**
 * Карта маршрутов кабинета и публичного сайта в человеко-читаемые названия.
 * Используется для подсветки секции в system prompt: вместо «вы на /dashboard/orders»
 * ассистент видит «Вы на странице "Мои заявки"».
 */
const SECTION_LABELS: Array<{
  match: (route: string) => boolean;
  label: string;
}> = [
  { match: (r) => r === "/dashboard", label: "Главная личного кабинета" },
  { match: (r) => r.startsWith("/dashboard/orders/new"), label: "Создание новой заявки" },
  { match: (r) => /^\/dashboard\/orders\/[^/]+$/.test(r), label: "Детали заявки" },
  { match: (r) => r === "/dashboard/orders", label: "Мои заявки" },
  { match: (r) => r === "/dashboard/vehicles" || r.startsWith("/dashboard/vehicles/"), label: "Мои грузовики" },
  { match: (r) => r === "/dashboard/permits", label: "Мои пропуска" },
  { match: (r) => r === "/dashboard/documents", label: "Мои документы" },
  { match: (r) => r === "/dashboard/payments", label: "Платежи" },
  { match: (r) => r === "/dashboard/notifications", label: "Уведомления" },
  { match: (r) => r === "/dashboard/settings", label: "Настройки" },
  { match: (r) => r === "/", label: "Главная сайта" },
  { match: (r) => /^\/services\/[^/]+$/.test(r), label: "Страница услуги" },
  { match: (r) => r === "/services", label: "Каталог услуг" },
  { match: (r) => /^\/blog\/[^/]+$/.test(r), label: "Статья блога" },
  { match: (r) => r === "/blog", label: "Блог" },
  { match: (r) => r === "/faq", label: "FAQ" },
  { match: (r) => r === "/contacts", label: "Контакты" },
  { match: (r) => r === "/login" || r === "/register", label: "Авторизация" },
];

/**
 * UUID v4 detection (для извлечения id из динамических роутов).
 * Допускаем не только v4 — DAL принимает любой валидный UUID.
 */
const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function detectEntity(route: string): EntityRef | undefined {
  // /dashboard/orders/new
  if (route === "/dashboard/orders/new") {
    return { kind: "new_order_form" };
  }

  // /dashboard/vehicles/new
  if (route === "/dashboard/vehicles/new") {
    return { kind: "new_vehicle_form" };
  }

  // /dashboard/orders/:id
  const orderMatch = route.match(/^\/dashboard\/orders\/([^/]+)$/);
  if (orderMatch?.[1] && UUID_RE.test(orderMatch[1])) {
    return { kind: "order", id: orderMatch[1] };
  }

  // /dashboard/vehicles/:id (когда добавим страницу) — не ломается, если нет
  const vehicleMatch = route.match(/^\/dashboard\/vehicles\/([^/]+)$/);
  if (vehicleMatch?.[1] && UUID_RE.test(vehicleMatch[1])) {
    return { kind: "vehicle", id: vehicleMatch[1] };
  }

  // /dashboard/permits/:id
  const permitMatch = route.match(/^\/dashboard\/permits\/([^/]+)$/);
  if (permitMatch?.[1] && UUID_RE.test(permitMatch[1])) {
    return { kind: "permit", id: permitMatch[1] };
  }

  // /services/:slug — slug, не uuid
  const serviceMatch = route.match(/^\/services\/([^/]+)$/);
  if (serviceMatch?.[1]) {
    return { kind: "service", slug: serviceMatch[1] };
  }

  // /blog/:slug
  const blogMatch = route.match(/^\/blog\/([^/]+)$/);
  if (blogMatch?.[1]) {
    return { kind: "blog", slug: blogMatch[1] };
  }

  return undefined;
}

function detectSection(route: string): string | undefined {
  for (const { match, label } of SECTION_LABELS) {
    if (match(route)) return label;
  }
  return undefined;
}

/**
 * Парсит pathname в ClientContext с авто-определением сущности и
 * человеко-читаемого названия раздела. Используется в чат-виджете
 * на каждом запросе.
 */
export function parsePathnameToContext(pathname: string): ClientContext {
  return {
    route: pathname,
    section: detectSection(pathname),
    entity: detectEntity(pathname),
  };
}

/**
 * Сериализация ClientContext в человеко-читаемый блок для system prompt.
 * Возвращает пустую строку, если контекст пустой/неинтересный.
 */
export function formatClientContextForPrompt(
  context: ClientContext | undefined,
): string {
  if (!context?.route) return "";

  const lines: string[] = [];
  lines.push(`route: ${context.route}`);
  if (context.section) lines.push(`section: ${context.section}`);

  if (context.entity) {
    switch (context.entity.kind) {
      case "order":
        lines.push(`entity: заявка ${context.entity.id} (используй getMyOrders или checkPermitStatus для деталей)`);
        break;
      case "vehicle":
        lines.push(`entity: грузовик ${context.entity.id} (используй getMyVehicles для деталей)`);
        break;
      case "permit":
        lines.push(`entity: пропуск ${context.entity.id} (используй getMyPermits для деталей)`);
        break;
      case "document":
        lines.push(`entity: документ ${context.entity.id}`);
        break;
      case "service":
        lines.push(`entity: услуга ${context.entity.slug} (используй getServiceInfo для деталей)`);
        break;
      case "blog":
        lines.push(`entity: статья блога ${context.entity.slug}`);
        break;
      case "new_order_form":
        lines.push(
          `entity: клиент сейчас заполняет форму новой заявки. Если он спрашивает «как заполнить» — помоги по конкретным полям. Если он не уверен в выборе зоны/типа — задай уточняющие вопросы и используй getPriceCalculation.`,
        );
        break;
      case "new_vehicle_form":
        lines.push(
          `entity: клиент сейчас добавляет новый грузовик. Если он не знает, что писать в полях VIN/экокласс — объясни кратко и предложи прислать фото СТС в чат.`,
        );
        break;
    }
  }

  return [
    "═══════════════════════════════════════════════════════════════",
    "КОНТЕКСТ ТЕКУЩЕЙ СТРАНИЦЫ КЛИЕНТА",
    "═══════════════════════════════════════════════════════════════",
    "Клиент пишет тебе из этой точки в нашем приложении:",
    ...lines.map((l) => `  ${l}`),
    "",
    "Используй этот контекст: ссылайся на текущий раздел / сущность напрямую,",
    "не переспрашивай очевидное. Если вопрос явно про эту сущность — сразу",
    "вызывай соответствующий cabinet tool.",
  ].join("\n");
}
