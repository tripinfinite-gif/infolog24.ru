# AI-консультант: база знаний из транскриптов звонков

**Дата:** 2026-04-15
**Статус:** активный
**Размер:** L (архитектура + исследование + генерация + интеграция)

## Цель

Превратить 227 МБ транскрибированных звонков менеджеров (26 957 диалогов / 53 035 Q&A-пар) в структурированную базу знаний для AI-консультанта, который:
- работает на сайте и в мобильном приложении,
- при авторизованном клиенте владеет контекстом (ФИО, заявки, история),
- отвечает по существу, вежливо, клиентоориентированно и продающе.

## Входные данные

- `dialogs_by_roles.jsonl` — 147 МБ, 26 957 записей (диалоги с ролями и таймингом)
- `qa_database.jsonl` — 80 МБ, 53 035 Q&A-пар с метаданными (`quality_score`, `client_sentiment`, `topic_tags`, `department`, `manager`)

## Пайплайн

### Фаза 0 — Препроцессинг (скрипты, без LLM)

- [ ] Дедупликация Q&A-пар, фильтр `quality_score ≥ 60`
- [ ] Чистка транскрипционного шума (регексы: артефакты ASR, служебные слова)
- [ ] Multilingual embeddings (paraphrase-multilingual-MiniLM-L12-v2, 384 dim)
- [ ] BERTopic + HDBSCAN → кластеризация вопросов (целевое 40–80 кластеров)
- [ ] Агрегированная статистика: частотность тегов, распределение по менеджерам, sentiment-heatmap
- [ ] Выгрузка: `phase0/clusters.parquet`, `phase0/stats.json`, `phase0/cluster-samples.jsonl` (по 20 репрезентативных Q&A на кластер)

### Фаза 1 — Банк вопросов (параллельные LLM-агенты)

Для каждого кластера отдельный агент делает:
- канонический вопрос + alt-формулировки (5–15 вариантов),
- топ-5 ответов менеджеров (по `quality_score`),
- стадию воронки (awareness/consideration/decision/retention/support),
- теги (цена, срок, документы, УКЭП, геозона, возражение),
- черновой «идеальный» ответ.

Выход: `analysis/ai-consultant-kb/questions/NNN-*.md` (один файл = один канонический вопрос).

### Фаза 2 — Продающий playbook (агенты-аналитики)

Топ-диалоги (quality_score ≥ 80, positive sentiment) → извлечение:
- open/close паттерны,
- работа с возражениями (15–25 паттернов с цитатами),
- upsell / cross-sell,
- эмпатия, доверие, социальное доказательство,
- отличия топ-менеджеров от слабых.

Выход: `analysis/ai-consultant-kb/playbook/{opening,objections,upsell,closing,empathy}.md`.

### Фаза 3 — Синтез KB для AI-консультанта

- Переписать ответы в финальный формат: короткие, вежливые, с CTA
- Разделить на 2 режима: anonymous / authorized (с плейсхолдерами клиентского контекста)
- Few-shot примеры по сценариям (3 на сценарий)
- System-prompts для Vercel AI SDK
- Tool-schemas под future function calling (статус заявки, прайс, расчёт)

Выход:
```
analysis/ai-consultant-kb/
├── questions/*.md
├── playbook/*.md
├── prompts/
│   ├── system-anonymous.md
│   ├── system-authorized.md
│   └── tool-schemas.json
├── index/
│   ├── questions.jsonl      # для pgvector
│   └── embeddings.parquet
└── external-insights.md
```

### Фаза P (параллельно) — Внешние источники

Агент анализирует форумы/отзывы/сайты про пропуска в Москву:
- АТИ.су, TruckDriver, Drive2, VK-группы перевозчиков
- Отзывы: Яндекс, 2ГИС, Отзовик, IRecommend
- mos.ru, mosgortrans, ЦОДД — офиц. информация

Выход: `analysis/ai-consultant-kb/external-insights.md` — вопросы/возражения, которых нет в звонках.

## Интеграция

KB используется как RAG-слой:
- `questions.jsonl` → загрузка в pgvector (у нас уже PostgreSQL + Drizzle)
- System-prompts → `apps/.../ai/prompts/`
- Vercel AI SDK `streamText` с `tools` (см. `tool-schemas.json`)
- При авторизованном клиенте prompt-builder подставляет контекст из БД

## Статус фаз

- [x] Фаза 0 — препроцессинг (70 кластеров, `phase0/clusters.parquet`, embeddings.npy)
- [x] Фаза 1 — банк вопросов (см. `ai-consultant-kb/questions/*.md`, 47 файлов)
- [x] Фаза 2 — playbook (7 файлов: opening/discovery/objections/trust/empathy/upsell/closing; 24 паттерна возражений; формула ВЭРВО; 5 механик топ-менеджеров)
- [x] Фаза P — внешние источники (68 инсайтов, 30 URL, 8 разделов; `external-insights.md`, 277 строк)
- [x] Фаза 3 — синтез KB (system-anonymous + system-authorized + tool-schemas.json + few-shot + index/questions.jsonl + README)
- [ ] Интеграция в приложение (отдельный план)

## Итог

Пайплайн закрыт от сырых транскриптов до готовой к загрузке в pgvector базы.

**Что получилось (`analysis/ai-consultant-kb/`):**
- **46 канонических вопросов** (`questions/*.md`) покрывают 17 830 диалогов (66% корпуса).
- **7 playbook-файлов** с 24 паттернами возражений, формулой ВЭРВО и 5 механиками топ-менеджеров.
- **68 внешних инсайтов** из 30 URL (ATI.SU, mos.ru, отзывы, Drive2) — вопросы/страхи/мифы, которых нет в звонках.
- **2 system-промпта** (anonymous + authorized) + **7 function-calling tools** (`tool-schemas.json`) + **21 few-shot пример** по 7 сценариям.
- **Индекс для pgvector** (`index/questions.jsonl` 280 KB, `answers.jsonl` 90 KB, `stats.json`) с метадатой: stage, tags, top_managers, sentiment.
- **README.md** с рецептами миграции в Drizzle, HNSW-индекса, интеграции Vercel AI SDK.

**Осталось (новый план):**
- Миграция в pgvector (taблицы + эмбеддинги через `phase3_embed.py`).
- UI чата в apps/web и мобильном приложении.
- Интеграция tools с таблицами заявок.
- Канал эскалации (WhatsApp/Telegram-бот для `escalateToHuman`).
- Feedback-loop: логирование (query, retrieved_ids, scores, csat).
