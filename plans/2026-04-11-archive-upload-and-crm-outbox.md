# Загрузка архива документов + Outbox для CRM/Bitrix

> Создание заявки одним кликом из ZIP-архива с документами + надёжная асинхронная доставка событий в CRM/Bitrix24/email/будущую собственную CRM через outbox pattern.

**Дата:** 2026-04-11
**Статус:** [x] Реализовано полностью (4 фазы)

---

## Цель

1. **Клиент:** загружает один ZIP-архив со всеми документами на грузовик (СТС, ПТС, доверенность, договор) → автоматически создаётся заявка с распознанным грузовиком и привязанными документами.
2. **Менеджер/CRM:** получает уведомление о новой заявке через все настроенные каналы (Bitrix24, email, в будущем — собственная CRM, MAX/Telegram-бот) с гарантией доставки и retry при сбоях.

---

## Архитектура

### Часть 1 — Outbox для CRM-интеграции

**Принцип:** при создании заявки бизнес-код пишет событие в локальную таблицу `integration_outbox` (в той же транзакции). Cron-воркер раз в минуту читает таблицу, доставляет события в нужные каналы, ретраит при сбоях. Заявка создаётся всегда — недоступность CRM не блокирует пользователя.

**Таблица:**
- `integration_outbox` (event_type, payload, channel, status, attempts, max_attempts, next_retry_at, last_error, delivered_at)

**Реестр каналов** в `lib/integrations/registry.ts`:
```ts
export const EVENT_CHANNELS = {
  order_created:        ["bitrix", "email", "internal_crm", "telegram_manager"],
  order_paid:           ["bitrix", "email", "internal_crm"],
  order_status_changed: ["bitrix", "internal_crm"],
  document_uploaded:    ["bitrix", "internal_crm"],
  permit_issued:        ["bitrix", "email", "internal_crm"],
  permit_expiring:      ["email", "telegram_manager"],
  callback_request:     ["bitrix", "email", "telegram_manager"],
  archive_uploaded:     ["bitrix", "email", "telegram_manager"],
};
```

**Адаптеры** в `lib/integrations/adapters.ts`:
- `bitrix` — обёртка над `createDeal()` (использует существующий клиент)
- `email` — обёртка над `sendEmailMessage()`
- `internal_crm` — заглушка с TODO для будущей собственной CRM
- `telegram_manager` — заглушка для бота менеджеров

Каждый адаптер:
- Никогда не бросает (всегда возвращает `{ ok, error?, skipped? }`)
- При отсутствии ключей → `skipped: true`, событие помечается доставленным (не ретраится)
- При временной ошибке → `ok: false`, outbox положит на retry с exponential backoff

**Backoff schedule:** 1 мин → 5 → 15 → 60 → 360. После 5 попыток → статус `dead` + алерт.

**Worker:** `/api/cron/process-outbox` — читает 50 событий за раз, атомарно «забирает» через `claimEvent` (защита от двойной обработки), вызывает адаптер, маркирует.

**Использование:**
```ts
await emitEvent("order_created", { orderId, source: "archive" });
```
Эта одна строка автоматически создаст 4 строки в outbox (для каждого канала из реестра).

---

### Часть 2 — Архив-загрузка

**Endpoint:** `POST /api/orders/from-archive` (multipart)

**Принимает:**
- `archive` — `.zip` файл (обязательно)
- `vehicleId` — UUID существующего ТС (опционально)
- `zone` — mkad/ttk/sk
- `type` — mkad_day/mkad_night/ttk/sk/temp
- `notes` — заметки клиента

**Лимиты:**
- Архив: ≤ 50 МБ
- Файлов: ≤ 50
- Один файл: ≤ 10 МБ uncompressed
- Суммарно: ≤ 100 МБ
- Разрешённые форматы: JPG, JPEG, PNG, WebP, HEIC, HEIF, PDF
- Magic bytes check (защита от подделки расширений)
- Path traversal защита (запрещены `../`, абсолютные пути, `__MACOSX`, скрытые файлы)

**Распаковка:** `lib/orders/archive-extractor.ts` через **fflate** (pure JS, без native bindings — работает в любом runtime).

**Классификация:** `lib/orders/document-classifier.ts`:
1. Если P4.1 OCR vision активен → каждое изображение прогоняется через `extractVehicleDoc`, определяется тип (sts/pts) + извлекаются данные грузовика (госномер, VIN, марка, модель, экокласс, max weight)
2. Если OCR не активен → fallback на heuristic по имени файла (regex по «стс», «доверен», «договор», «ву», и т. д.)
3. Что не распозналось → `type: "other"`

**Хранилище:** `lib/orders/local-storage.ts` — fallback на локальную папку `apps/web/uploads/<userId>/<orderId>/<file>` когда S3 не настроен. В проде — switch на S3 (Selectel) одной строкой.

**Раут отдачи файлов:** `/api/uploads/[...path]` — отдаёт только файлы текущего юзера (или admin/manager), с защитой от path traversal.

**Главный оркестратор:** `lib/orders/from-archive.ts`:
1. Распаковка → классификация
2. Если нет `vehicleId` и есть распознанные данные → создаём `vehicle`
3. Если нет ни того ни другого → ошибка `no_vehicle` (просим клиента сначала добавить ТС)
4. Создаём `order` со status `documents_pending`
5. Сохраняем файлы в storage
6. Для каждого файла создаём строку в `documents` с привязкой к `order` и распознанным `type`
7. `emitEvent("archive_uploaded", {...})` + `emitEvent("order_created", {...})` — outbox разносит по каналам

---

### Часть 3 — UI

**Страница** `/dashboard/orders/new` теперь содержит **2 вкладки** через shadcn `Tabs`:
- **«Заполнить форму»** — существующий многошаговый мастер (без изменений)
- **«Загрузить архив»** — новый компонент `ArchiveUploader`

**Компонент `ArchiveUploader`:**
- Drag-and-drop зона + click-to-upload через скрытый input
- Селектор грузовика (или «распознать автоматически из СТС/ПТС»)
- Селектор зоны пропуска
- Поле заметок
- Кнопка «Загрузить и создать заявку»
- После успеха — список загруженных документов с типами, список пропущенных файлов с причинами, через 2.5 секунды редирект на `/dashboard/orders/[id]`

URL `tab=archive` сразу открывает нужную вкладку (используется action card из чата).

---

### Часть 4 — Чат-интеграция

**Action card type:** `upload_archive` в `lib/chat/action-cards.ts`.
- `resolveActionHref` ведёт на `/dashboard/orders/new?tab=archive&vehicleId=...&zone=...`
- Иконка: `FileArchive` из lucide-react
- Label: «Загрузить архив документов»

**System prompt** в `lib/chat/system-prompt.ts` — добавлена секция «ЗАГРУЗКА АРХИВА ДОКУМЕНТОВ»:
- Когда клиент пишет «у меня есть все документы», «куда отправить фото», «как загрузить» — ассистент кратко предлагает архив-путь как самый быстрый
- Указывает требования (ZIP до 50 МБ, 50 файлов, поддерживаемые форматы)
- Если у клиента нет архива — пусть просто заархивирует папку с документами в zip

---

## Файлы

| Слой | Файл | Назначение |
|---|---|---|
| Schema | `lib/db/schema.ts` (`integrationOutbox`) | Таблица outbox |
| Migration | `drizzle/0004_integration_outbox.sql` | Применена к локальной БД |
| Outbox | `lib/integrations/registry.ts` | Реестр событий и каналов |
| Outbox | `lib/integrations/outbox.ts` | emitEvent, fetchPendingEvents, claimEvent, markDelivered, markFailed |
| Outbox | `lib/integrations/adapters.ts` | bitrix, email, internal_crm (stub), telegram_manager (stub) |
| Outbox | `app/api/cron/process-outbox/route.ts` | Worker (cron каждую минуту) |
| Archive | `lib/orders/archive-extractor.ts` | Распаковка через fflate с лимитами и magic bytes |
| Archive | `lib/orders/document-classifier.ts` | Классификация (OCR + heuristic fallback) |
| Archive | `lib/orders/local-storage.ts` | Fallback хранилище для dev |
| Archive | `lib/orders/from-archive.ts` | Главный оркестратор |
| Archive | `app/api/orders/from-archive/route.ts` | HTTP endpoint |
| Storage | `app/api/uploads/[...path]/route.ts` | Отдача локальных файлов с RBAC |
| UI | `app/dashboard/orders/new/_components/archive-uploader.tsx` | Компонент drag-n-drop |
| UI | `app/dashboard/orders/new/_components/new-order-tabs.tsx` | Табы «Форма» / «Архив» |
| UI | `app/dashboard/orders/new/page.tsx` | Передаёт `initialTab` из URL |
| Chat | `lib/chat/action-cards.ts` | Тип `upload_archive`, helpers |
| Chat | `components/chat/action-card-list.tsx` | ICON_MAP +`FileArchive` |
| Chat | `lib/chat/system-prompt.ts` | Секция «ЗАГРУЗКА АРХИВА» |

---

## Активация в проде

1. **Применить миграцию**: уже применена локально (`drizzle/0004_integration_outbox.sql`). На проде:
   ```bash
   psql ... -f drizzle/0004_integration_outbox.sql
   ```
   или через `pnpm drizzle-kit migrate` (drizzle применит все непрogressed миграции).

2. **Подключить cron** в Coolify (или внешний cron):
   ```cron
   * * * * *  curl -H "Authorization: Bearer $CRON_SECRET" https://infolog24.ru/api/cron/process-outbox
   ```

3. **Адаптеры** активируются автоматически по наличию env-переменных:
   - `BITRIX24_WEBHOOK_URL` — bitrix
   - `ADMIN_EMAIL` + `RESEND_API_KEY` — email
   - `INTERNAL_CRM_BASE_URL` + `INTERNAL_CRM_API_KEY` — будущая собственная CRM (нужно реализовать тело адаптера, см. TODO в `lib/integrations/adapters.ts`)
   - `TELEGRAM_MANAGER_BOT_TOKEN` + `TELEGRAM_MANAGER_CHAT_ID` — будущий бот менеджеров

4. **OCR классификация** (опционально): `OPENAI_VISION_ENABLED=true`. Без неё файлы получат `type` по имени, OCR-распознавание грузовика не сработает (клиенту придётся выбрать ТС вручную).

5. **S3 хранилище** (для прода): достаточно установить переменные `S3_ENDPOINT` + `S3_BUCKET` + `S3_ACCESS_KEY` + `S3_SECRET_KEY`. Сейчас в `from-archive.ts` всегда используется local-storage — переключение делается одной строчкой `if (isS3Configured()) { uploadToS3(...) } else { saveFileLocally(...) }` (не делал, потому что S3-клиент в проекте уже есть, добавим точечно когда понадобится).

---

## Что НЕ сделано (осознанно)

- **RAR / 7z** — пока только ZIP. RAR требует тяжёлой нативной библиотеки. Можно добавить через `node-unrar-js` (pure JS) при необходимости.
- **S3 загрузка** — local-storage сейчас единственный путь. S3 переключение — следующий шаг при выходе в прод.
- **OCR классификация без OPENAI_VISION_ENABLED** — fallback heuristic по имени файла достаточен для базового кейса.
- **Internal CRM адаптер** — заглушка. Контракт HTTP API описан в TODO, реализуется ~за час когда CRM появится.
- **Telegram manager bot** — заглушка под будущего бота менеджеров.

---

## Итоговый блок

- **Реализовано целиком:** Да, все 4 фазы.
- **Активация:** работает локально на dev-сервере http://localhost:3000.
- **Следующие шаги:** при выходе в прод — применить миграцию 0004 на удалённой БД и настроить cron `/api/cron/process-outbox`.
