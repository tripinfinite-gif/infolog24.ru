# Pre-Launch Checklist — test.inlog24.ru

> Проверено: 2026-04-16
> Цель: подтвердить готовность к переключению DNS на inlog24.ru

---

## 1. Публичные страницы

| Страница | Код | Статус |
|---|---|---|
| `/` (главная) | 200 | ✅ |
| `/about` | 200 | ✅ |
| `/services` | 200 | ✅ |
| `/faq` | 200 | ✅ |
| `/contacts` | 200 | ✅ |
| `/blog` | 200 | ✅ |
| `/reviews` | 200 | ✅ |
| `/check-status` | 200 | ✅ |
| `/resheniya` | 200 | ✅ |
| `/infopilot` | 200 | ✅ |
| `/regulatorika` | 200 | ✅ |
| `/goslog` | 200 | ✅ |
| `/etrn` | 200 | ✅ |

## 2. Auth

| Страница | Код | Статус |
|---|---|---|
| `/login` | 200 | ✅ |
| `/register` | 200 | ✅ |
| `/dashboard` | 307 (redirect to login) | ✅ |

## 3. SEO

| Элемент | Статус |
|---|---|
| `/robots.txt` | ✅ 200 |
| `/sitemap.xml` | ✅ 200 |
| 301 редиректы (6 старых URL) | ✅ 308 (permanent) |
| JSON-LD на страницах | ✅ (LocalBusiness, Service, FAQ) |
| generateMetadata | ✅ на всех страницах |
| Open Graph | ✅ |

## 4. Security

| Заголовок | Статус |
|---|---|
| `strict-transport-security` | ✅ max-age=31536000; includeSubDomains; preload |
| `x-frame-options` | ✅ SAMEORIGIN |
| `x-content-type-options` | ✅ nosniff |
| `content-security-policy` | ✅ полная CSP |
| `referrer-policy` | ✅ strict-origin-when-cross-origin |
| `permissions-policy` | ✅ camera=(), microphone=(), geolocation=() |
| CSRF protection | ✅ Origin/Referer проверка |
| Rate limiting | ✅ Redis + memory fallback |

## 5. SSL

| Параметр | Значение |
|---|---|
| Сертификат | Let's Encrypt |
| Действует до | 2026-07-09 |
| HSTS Preload | ✅ |

## 6. API

| Endpoint | Код | Статус |
|---|---|---|
| `/api/health` | 200 | ✅ |
| `/api/chat` (POST) | streaming | ✅ Claude Sonnet |
| `/api/chat/voice-status` | 200 | ✅ |
| `/api/chat/vision-status` | 200 | ✅ |
| `/api/contacts` (POST) | 200 | ✅ форма работает |
| `/api/chat/feedback` (POST) | — | ✅ endpoint создан |

## 7. Инфраструктура

| Компонент | Статус |
|---|---|
| Контейнер | ✅ healthy |
| PostgreSQL | ✅ 21 таблица |
| Redis/KeyDB | ✅ |
| Диск | ✅ 26% (107 GB свободно) |
| ANTHROPIC_API_KEY | ✅ в env |
| OPENAI_API_KEY | ✅ в env |

## 8. Не готово (блокеры запуска на inlog24.ru)

| # | Задача | Блокер |
|---|---|---|
| 1 | Яндекс.Метрика | Нужен ID счётчика |
| 2 | GA4 | Нужен Measurement ID |
| 3 | DNS inlog24.ru → VPS | Ручное переключение в reg.ru |
| 4 | YooKassa (платежи) | Нужны shopId + secretKey |
| 5 | Bitrix24 (CRM) | Нужен webhook URL |
| 6 | Cloudflare Turnstile | Нужен site key |

## 9. Рекомендации

- [ ] Добавить Sentry для error tracking
- [ ] Поднять Uptime Kuma для мониторинга
- [ ] Настроить автобэкап PostgreSQL
- [ ] Запустить pgvector RAG (RAG_VECTOR_ENABLED=true + embeddings)
- [ ] Провести 72-часовой мониторинг после переключения DNS
