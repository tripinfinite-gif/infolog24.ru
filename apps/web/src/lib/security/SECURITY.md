# Security posture (МФ-4A)

Последний аудит: 2026-04-11
Ответственный модуль: `apps/web/src/lib/security/*`

## Обзор

Этот документ фиксирует текущее состояние безопасности приложения в разрезе
OWASP Top-10 2021 и описывает применённые меры защиты, а также оставшиеся
пробелы. Все пункты, отмеченные [TODO], должны быть закрыты до релиза в прод.

## Карта модулей безопасности

| Файл | Назначение |
|------|-----------|
| `rate-limit.ts` | Sliding-window rate limiter поверх Redis с in-memory fallback |
| `csrf.ts` | Валидация Origin/Referer для мутирующих API |
| `file-validator.ts` | Проверка magic bytes, MIME, размера, санитизация имени |
| `webhook-allowlist.ts` | IP-allowlist для YooKassa и Bitrix24 вебхуков |
| `audit.ts` | Запись событий в `audit_log` + structured logs |
| `../turnstile.ts` | Проверка капчи Cloudflare Turnstile для публичных форм |

## OWASP Top-10 2021 — статус

### A01: Broken Access Control

**Статус:** ✅ под контролем.

- Все API-роуты используют `getSession()` (Better Auth) + явную проверку роли
  для админских и менеджерских действий (`apps/web/src/app/api/admin/**`).
- Middleware (`src/middleware.ts`) проверяет наличие cookie сессии для
  `/dashboard/*` и `/admin/*` (редирект на `/login` если нет).
- Серверные компоненты используют `getSession()` в layout'ах для повторной
  проверки ролей (в middleware проверяется только факт наличия cookie).
- DAL-методы принимают `userId` и всегда фильтруют данные по владельцу.

**TODO:**
- [ ] Ввести RBAC-хелпер `requireRole("admin"|"manager")` и использовать
      вместо inline `if (!["admin"].includes(role))`.
- [ ] Добавить тесты IDOR для `/api/orders/[id]`, `/api/documents/[id]`.

### A02: Cryptographic Failures

**Статус:** ✅ под контролем.

- Пароли хэшируются Better Auth (scrypt).
- Секреты берутся из env (`@t3-oss/env-nextjs` + Zod-валидация),
  никогда не коммитятся. См. `src/env.ts`.
- HSTS включён (`Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`).
- HTTPS принудительно через Coolify/reverse proxy (в dev разрешён HTTP localhost).

**TODO:**
- [ ] Проверить, что TURNSTILE_SECRET_KEY, YOOKASSA_SECRET_KEY, OPENAI_API_KEY
      действительно доступны только на сервере (не утекают в client bundle).

### A03: Injection

**Статус:** ✅ под контролем.

- Все запросы к БД идут через Drizzle ORM. `sql\`...\`` используется только
  для агрегаций (`to_char`, `count`, `sum`) и ссылок на колонки — без
  интерполяции пользовательского ввода.
- Проверены все файлы `apps/web/src/lib/dal/*.ts`: raw-SQL-паттернов,
  использующих конкатенацию строк с пользовательскими данными, не найдено.
  Подробности в комментарии к `audit.ts`.
- Весь вход валидируется через Zod-схемы до попадания в DAL.
- XSS: React экранирует вывод, `dangerouslySetInnerHTML` не используется
  для пользовательского контента. Chat санитизирует HTML в user messages
  (`src/app/api/chat/route.ts`).

**TODO:**
- [ ] Включить `eslint-plugin-security` на уровне tooling.

### A04: Insecure Design

**Статус:** ✅ под контролем.

- State machine для заказов (`src/lib/automation/order-state-machine.ts`)
  запрещает невалидные переходы статусов.
- YooKassa webhook проверяет статус платежа через `getPayment()` API,
  даже если в теле webhook другой статус (защита от подмены тела).
- CSRF через Origin/Referer-валидацию + исключения для вебхуков.

### A05: Security Misconfiguration

**Статус:** ✅ под контролем.

- CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy,
  Permissions-Policy настроены в `next.config.ts` через `headers()`.
- CORS allowlist на уровне middleware (inlog24.ru, infolog24.ru,
  test.inlog24.ru, localhost:3000).
- Env-переменные валидируются при старте через `@t3-oss/env-nextjs`.
- В dev-режиме используется in-memory fallback для rate-limit, в проде —
  Redis (обязателен для масштабирования).

**TODO:**
- [ ] Убрать `'unsafe-inline'` и `'unsafe-eval'` из CSP (требует миграции
      Next.js на nonce-based CSP).

### A06: Vulnerable and Outdated Components

**Статус:** ⚠️ требует регулярного контроля.

- `pnpm-lock.yaml` фиксирует версии.
- Next.js 15, React 19, Drizzle 0.41, Better Auth 1 — актуальные.

**TODO:**
- [ ] Регулярно запускать `pnpm audit` (CI-шаг) и `pnpm outdated`.
- [ ] Добавить Dependabot или Renovate в репозиторий.

### A07: Identification and Authentication Failures

**Статус:** ✅ под контролем.

- Better Auth управляет сессиями с 7-дневным TTL и обновлением каждые 24ч.
- 2FA-плагин подключён (TOTP).
- Rate-limit на login (10 req/min/IP) и на password reset (3 req/hour/IP)
  — через `rateLimit("auth-login")` в `/api/auth/[...all]/route.ts`.
- Brute-force попытки логгируются через rate-limit warnings.
- Session cookies httpOnly + secure (дефолт Better Auth).

**TODO:**
- [ ] Добавить lockout аккаунта после N неудачных попыток.
- [ ] Аудит-логи событий `auth.login_success` / `auth.login_failure` —
      сейчас пишутся через rate-limit warnings, но не через `logAudit`.
      Интегрировать в Better Auth hooks.

### A08: Software and Data Integrity Failures

**Статус:** ✅ под контролем.

- `pnpm-lock.yaml` в репозитории.
- Docker-образ воспроизводим (`Dockerfile` + `docker-compose.yml`).
- Coolify деплой на фиксированный коммит.

**TODO:**
- [ ] Включить `pnpm install --frozen-lockfile` в CI.
- [ ] Verify Subresource Integrity для внешних скриптов (Metrika, GA),
      если они подключаются через `<script src>` напрямую.

### A09: Security Logging and Monitoring Failures

**Статус:** ⚠️ частично.

- Structured logs через Pino.
- Audit log: `src/lib/security/audit.ts` — пишет в `audit_log` + pino.
- Применён к: admin status change, admin bulk assign, document upload.
- Webhook события логируются с клиентским IP.

**TODO:**
- [ ] Интегрировать Sentry или аналог для error tracking.
- [ ] Применить `logAudit` ко всем оставшимся admin mutations:
      refund, permit revoke, user role change, payment approval.
- [ ] Применить `logAudit` к auth событиям через Better Auth hooks.
- [ ] Настроить alerting по rate-limit warnings и 5xx.

### A10: Server-Side Request Forgery (SSRF)

**Статус:** ✅ под контролем.

- Внешние fetch-запросы делаются только к фиксированным доменам
  (yookassa.ru, api.telegram.org, openai.com, s3 Selectel, mc.yandex.ru).
- Пользовательские URL не передаются в `fetch()`.
- Upload-URL для S3 генерируется на сервере (presigned), клиент не
  управляет bucket/endpoint.

**TODO:**
- [ ] Добавить централизованный `safeFetch(url)` с проверкой хоста
      по allowlist, если появятся сценарии с user-supplied URLs.

## Применённые контрмеры по типам атак

| Атака | Защита |
|------|--------|
| Brute force (логин) | rate-limit 10/min + 2FA |
| Password spray | rate-limit на password reset 3/hour |
| CSRF | Origin/Referer check + SameSite cookies |
| XSS | React escape + CSP + user input sanitization |
| SQL injection | Drizzle ORM + Zod валидация |
| Clickjacking | X-Frame-Options: SAMEORIGIN |
| MIME sniffing | X-Content-Type-Options: nosniff |
| Mixed content | HSTS preload |
| File upload abuse | magic bytes + size + filename sanitization + rate-limit |
| Webhook spoofing | IP allowlist + повторная проверка через API |
| Data exfiltration через CSP | CSP connect-src allowlist |
| Rate abuse | Redis sliding window с fallback |

## Проверка SQL-инъекций в DAL

Проведён грепинг `sql\`` по всем файлам `apps/web/src/lib/dal/*.ts`:

- `promo-codes.ts:64` — `sql\`${promoCodes.usedCount} + 1\`` — safe
  (только column reference)
- `notifications.ts:53,66` — `sql\`${notifications.readAt} IS NULL\`` — safe
- `admin.ts:632,633,643,644,695,708` — `sql\`to_char(${orders.createdAt}, 'YYYY-MM')\`` —
  safe (статическая строка формата + column ref)
- `orders.ts:166,197,198` — аналогично, только column refs и статические строки.

Пользовательский ввод никогда не интерполируется в `sql\`...\``. Все
значения проходят через параметризацию Drizzle (`.values()`, `.where(eq())`).

## Rate-limit конфигурация

Определена в `rate-limit.ts`:

| Категория | Лимит | Окно | Применение |
|-----------|-------|------|-----------|
| `api-general` | 100 | 1 мин / IP | middleware для `/api/*` |
| `auth-login` | 10 | 1 мин / IP | `/api/auth/[...all]` |
| `auth-password-reset` | 3 | 1 час / IP | `/api/auth/[...all]` (reset-*) |
| `chat-anonymous` | 20 | 1 мин / IP | `/api/chat` (без сессии) |
| `chat-authenticated` | 60 | 1 мин / userId | `/api/chat` (с сессией) |
| `file-upload` | 10 | 1 мин / userId | `/api/documents/*` |
| `contact-form` | 5 | 1 мин / IP | `/api/contacts` |

## Контрольный чек-лист перед релизом

- [x] CSP + security headers в next.config.ts
- [x] CORS allowlist в middleware
- [x] Rate-limit на sensitive routes
- [x] File upload validation (magic bytes + size + filename)
- [x] Webhook IP allowlist (YooKassa, Bitrix24)
- [x] Audit log helper + применён к admin mutations
- [x] CSRF через Origin/Referer
- [x] SQL injection audit DAL
- [ ] Sentry / error tracking
- [ ] `pnpm audit` = 0 high/critical
- [ ] Penetration test (внешний)
