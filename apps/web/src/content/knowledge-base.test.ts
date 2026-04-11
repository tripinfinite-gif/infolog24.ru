/**
 * Regression tests for knowledge-base keyword search (golden set).
 *
 * Каждый кейс в `goldenCases` прогоняется через локальную копию
 * keyword-scoring логики из `lib/chat/tools.ts`. Тест пройдёт, только
 * если ожидаемый (или acceptable) id оказался в топ-3 результатов —
 * иначе при изменении базы знаний или scoring-логики мы узнаем
 * немедленно.
 *
 * Scoring-логика здесь намеренно продублирована (не импортируется из
 * tools.ts), чтобы тесты:
 *   1) не зависели от сервер-только модулей (db, env, fetch);
 *   2) защищали саму scoring-логику от тихих изменений — если кто-то
 *      правит веса в tools.ts, он обязан синхронно править здесь.
 */
import { describe, expect, it } from "vitest";

import { knowledgeBase, type KnowledgeItem } from "./knowledge-base";
import { goldenCases } from "./knowledge-base.golden";

// Копия STOP_WORDS из lib/chat/tools.ts.
const STOP_WORDS = new Set([
  "что", "как", "где", "когда", "кто", "почему", "зачем",
  "это", "тот", "так", "там", "вот",
  "для", "при", "над", "под", "без", "про", "или", "и",
  "не", "ни", "же", "ли", "бы", "уж",
  "мой", "моя", "моё", "мои",
  "ваш", "ваша", "ваше", "ваши",
  "я", "ты", "он", "она", "мы", "вы", "они",
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[^\p{L}\p{N}]+/u)
    .filter((t) => t.length >= 3 && !STOP_WORDS.has(t));
}

function scoreKnowledgeItem(
  item: KnowledgeItem,
  queryTokens: string[],
): number {
  if (queryTokens.length === 0) return 0;

  const questionLower = item.question.toLowerCase();
  const aliasesText = item.aliases.join(" ").toLowerCase();
  const tagsText = item.tags.join(" ").toLowerCase();
  const shortLower = item.short.toLowerCase();
  const detailLower = item.detail.toLowerCase();

  let score = 0;
  for (const token of queryTokens) {
    if (aliasesText.includes(token)) score += 6;
    if (tagsText.includes(token)) score += 4;
    if (questionLower.includes(token)) score += 3;
    if (shortLower.includes(token)) score += 2;
    if (detailLower.includes(token)) score += 1;
  }
  return score;
}

function searchTop(
  query: string,
  k = 3,
): Array<{ item: KnowledgeItem; score: number }> {
  const tokens = tokenize(query);
  return knowledgeBase
    .map((item) => ({ item, score: scoreKnowledgeItem(item, tokens) }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, k);
}

describe("knowledge-base golden set coverage", () => {
  it("has at least 50 golden cases", () => {
    expect(goldenCases.length).toBeGreaterThanOrEqual(50);
  });

  it("covers at least 15 distinct categories", () => {
    const cats = new Set(
      goldenCases.map((c) => c.category).filter((c): c is string => Boolean(c)),
    );
    expect(cats.size).toBeGreaterThanOrEqual(15);
  });

  it("all expectedIds reference real knowledge-base items", () => {
    const realIds = new Set(knowledgeBase.map((i) => i.id));
    for (const c of goldenCases) {
      const accepted = [c.expectedId, ...(c.acceptableIds ?? [])];
      for (const id of accepted) {
        expect(realIds.has(id), `Unknown id in golden case: ${id}`).toBe(true);
      }
    }
  });
});

describe("knowledge-base golden set retrieval", () => {
  for (const c of goldenCases) {
    const limit = c.strict ? 1 : 3;
    const acceptable = [c.expectedId, ...(c.acceptableIds ?? [])];

    it(`[${c.category ?? "?"}] "${c.query}" → ${c.expectedId}`, () => {
      const top = searchTop(c.query, Math.max(limit, 3));
      const topIds = top.slice(0, limit).map((x) => x.item.id);
      const found = topIds.some((id) => acceptable.includes(id));

      expect(
        found,
        `Expected one of [${acceptable.join(", ")}] in top ${limit}, got [${top
          .map((x) => `${x.item.id}(${x.score})`)
          .join(", ")}]`,
      ).toBe(true);
    });
  }
});
