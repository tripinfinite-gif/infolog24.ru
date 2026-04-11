# Инструкция для следующей сессии

> Этот файл — входная точка для нового чата. Прочитай его первым, затем действуй.
> Создан: 2026-04-11

---

## 1. Контекст: что за проект

**Инфологистик-24** — сервис оформления пропусков для грузового транспорта в Москву (МКАД, ТТК, Садовое кольцо). Компания работает с 2016 года, 30–50 сотрудников, ~600–800 заявок/мес, выручка ~17 млн/мес.

Мы строим **полную цифровую платформу**: маркетинговый сайт + личный кабинет клиента + админ-панель менеджеров + автоматизация + AI-чатбот.

---

## 2. Что уже сделано

### Каркас приложения (~40%)

Весь код написан за первую сессию (коммит `4ff052f`), затем отрефакторен (коммиты `b2f7ced`, `99efc60`). **Код компилируется**, `pnpm build` проходит, `.next/` актуален.

**Работает:**
- Монорепо: Turborepo + pnpm, `apps/web` + `packages/shared` + `tooling/eslint`
- UI: shadcn/ui + Tailwind v4, все базовые компоненты
- Маркетинговый сайт: 12 страниц в route group `(marketing)/`
- Auth: Better Auth (email+пароль, 2FA, роли client/manager/admin/partner)
- Схема БД: Drizzle ORM, 15+ таблиц, все enum'ы
- API routes: 20+ endpoints (orders, vehicles, documents, payments, chat, admin, cron)
- DAL: Data Access Layer для всех основных сущностей
- Контент: тексты, тарифы, FAQ, блог (446 KB контента)
- Автоматизация: state machine заказов, document checker, drip campaigns
- AI-чатбот: Vercel AI SDK + OpenAI GPT-4o-mini, rate limiting
- Telegram-бот: grammY + webhook endpoint
- ESLint flat config (v9), TypeScript strict

**НЕ работает (каркас на моках):**
- Миграции БД — `drizzle/` не существует, ни разу не запускались
- Личный кабинет — UI есть, **все данные mock** (файл `admin/_components/mock-data.ts`)
- Админ-панель — UI есть, все данные mock
- Партнёрский портал — скаффолд
- Интеграции: S3, Email (Resend), SMS (SMS.ru), Битрикс24, YooKassa — модули написаны, не подключены
- BullMQ — пакет установлен, очереди не определены
- Тесты — 0 файлов
- CI/CD — нет `.github/workflows/`
- docker-compose.yml — не существует
- VPS/деплой — не заказан

### Структура файлов

```
apps/web/src/
├── app/
│   ├── (auth)/           ← login, register, forgot-password
│   ├── (marketing)/      ← about, blog, contacts, faq, pricing, privacy, reviews, services, terms, thank-you, page (home), calculator.tsx
│   ├── admin/            ← 10 страниц (layout, orders, clients, payments, permits, audit, analytics, settings)
│   ├── dashboard/        ← 10 страниц (layout, orders, vehicles, documents, payments, permits, notifications, settings)
│   ├── partner/          ← (auth)/ + (portal)/ — 7 страниц
│   ├── partners/         ← публичная страница партнёров
│   ├── check-status/     ← проверка статуса пропуска
│   ├── status/           ← статус-страница системы
│   ├── api/              ← 20+ route handlers
│   ├── layout.tsx, error.tsx, not-found.tsx, globals.css, robots.ts, sitemap.ts
│   └── ...
├── components/           ← UI-компоненты (sections/, layout/, ui/)
├── content/              ← данные (pricing, services, faq, testimonials, blog-articles, company, legal)
├── lib/
│   ├── auth/             ← Better Auth конфиг
│   ├── db/               ← schema.ts (Drizzle), drizzle.config.ts
│   ├── dal/              ← orders, vehicles, documents, users, notifications, promo-codes
│   ├── automation/       ← order-state-machine, on-status-change, document-checker, permit-expiration, drip-campaigns
│   ├── chat/             ← rate-limit, system-prompt, tools
│   ├── integrations/     ← bitrix24, yookassa, s3, sms
│   ├── email/            ← send, templates/
│   └── ...
└── middleware.ts
```

---

## 3. Мастер-план: что делать дальше

Полный план: [`plans/2026-04-11-MASTER-PLAN-v2.md`](2026-04-11-MASTER-PLAN-v2.md)

### 6 мега-фаз, 122 задачи

| МФ | Название | Агентов | Зависит от | Задач | Статус |
|----|----------|---------|------------|-------|--------|
| 0 | Инфраструктура | 1 | — | 14 | Не начато |
| 1 | Подключение реальных данных | 4 параллельно | МФ-0 | 36 | Каркас |
| 2 | Автоматизация + боты | 2 параллельно | МФ-1 | 19 | Каркас |
| 3 | SEO + аналитика | 2 параллельно | МФ-1A | 17 | Не начато |
| 4 | Безопасность + тесты + оптимизация | 3 параллельно | МФ-1–3 | 24 | Не начато |
| 5 | Запуск + мониторинг | 2 | МФ-4 | 13 | Не начато |

### Критический путь

**Полный проект:** МФ-0 → МФ-1 → МФ-2+3 → МФ-4 → МФ-5 = **~9–10 недель**
**MVP (только маркетинг):** МФ-0 → МФ-1A+1D → МФ-5 = **~4 недели**

---

## 4. Что делать в этой сессии

### Вариант A: Начать МФ-0 (инфраструктура)

Если Docker установлен на машине:

1. Создать `docker-compose.yml` (PostgreSQL 16 + Redis 7)
2. Запустить `docker compose up -d`
3. Обновить `.env.local` с реальным `DATABASE_URL`
4. Запустить `pnpm db:generate` + `pnpm db:migrate`
5. Написать и запустить seed-скрипт
6. Проверить что `pnpm dev` работает с реальной БД

**Результат:** Разблокирует МФ-1 (подключение данных к UI).

### Вариант B: Начать МФ-1 (подключение данных)

Если БД уже доступна:

1. **Поток B (ЛК клиента):** Заменить mock-данные в `dashboard/` на реальные запросы к DAL
2. **Поток C (Админ-панель):** Заменить mock-данные в `admin/` на реальные запросы к DAL
3. **Поток A (Публичный сайт):** Подключить формы к API, проверить калькулятор
4. **Поток D (Интеграции):** Настроить S3, email, SMS

### Вариант C: MVP — только маркетинговый сайт

Минимальный путь до запуска:
1. Docker + миграции (МФ-0)
2. Формы + калькулятор на сайте (МФ-1A)
3. SEO + аналитика (МФ-3)
4. Деплой (МФ-5)

---

## 5. Ключевые файлы для начала работы

| Что | Где |
|-----|-----|
| Навигация по проекту | `CLAUDE.md` |
| Бизнес-контекст | `.business/INDEX.md` |
| Мастер-план | `plans/2026-04-11-MASTER-PLAN-v2.md` |
| Схема БД | `apps/web/src/lib/db/schema.ts` |
| API routes | `apps/web/src/app/api/` |
| DAL | `apps/web/src/lib/dal/` |
| Контент сайта | `apps/web/src/content/` |
| Auth конфиг | `apps/web/src/lib/auth/` |
| Mock-данные админки | `apps/web/src/app/admin/_components/mock-data.ts` |
| Env пример | `apps/web/.env.example` |
| Drizzle конфиг | `apps/web/drizzle.config.ts` |

---

## 6. Блокеры от заказчика

Эти данные нужно получить до начала МФ-1D и МФ-3:

| Что нужно | Зачем | Мега-фаза |
|-----------|-------|-----------|
| Оплата VPS Selectel | Серверное окружение | МФ-0 |
| Доступ к DNS infolog24.ru | Переключение домена | МФ-0, МФ-5 |
| Webhook URL Битрикс24 | CRM-интеграция | МФ-1D |
| YooKassa shopId + secretKey | Онлайн-оплата | МФ-1D |
| ID счётчика Яндекс.Метрики | Аналитика | МФ-3B |
| GA4 Measurement ID | Аналитика | МФ-3B |
| Cloudflare Turnstile site key | Защита форм | МФ-3B |
| Аккаунт Calltouch | Коллтрекинг | МФ-3B |
| Аккаунт JivoSite | Онлайн-чат | МФ-3B |

---

## 7. Технические команды

```bash
# Запуск dev-сервера
pnpm dev

# Сборка
pnpm build

# Линтинг
pnpm lint

# Type-check
pnpm type-check

# Drizzle: генерация миграций
pnpm db:generate

# Drizzle: применение миграций
pnpm db:migrate

# Drizzle: студия (GUI для БД)
pnpm db:studio
```

---

## 8. Правила работы

Из `CLAUDE.md`:
- Используй **Bulletproof** методологию для любой фичи размера M и L
- Один план = одна функция в `plans/`
- Обновляй статусы задач в `plans/2026-04-11-MASTER-PLAN-v2.md` после каждой сессии
- В конце сессии — рефлексия в `.business/история/YYYY-MM-DD-название.md`
- Всегда отвечай на русском
- После завершения задачи: `afplay /System/Library/Sounds/Glass.aiff`
- Подбирай скиллы из таблицы маршрутизации в `CLAUDE.md`

---

## 9. Git-статус

```
Ветка: main
Коммиты:
  99efc60 docs: обновить планы — ESLint, route groups, восстановление страниц
  b2f7ced fix: настройка ESLint flat config + очистка неиспользуемых импортов
  4ff052f feat: полная реализация проекта Инфологистик-24
  1df4f49 Инициализация репозитория: CLAUDE.md, .gitignore, plans/

Рабочее дерево: чистое (0 uncommitted changes)
```

---

## 10. Рекомендация

**Начни с МФ-0, задача 0.0:** создай `docker-compose.yml` и подними PostgreSQL + Redis локально. Это разблокирует всю дальнейшую работу и не требует ничего от заказчика. Затем запусти миграции и seed. После этого можно параллельно подключать ЛК и админку к реальным данным (МФ-1).
