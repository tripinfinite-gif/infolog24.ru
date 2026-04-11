import { NextResponse } from "next/server";
import { knowledgeBase, type KnowledgeItem } from "@/content/knowledge-base";

export const runtime = "edge";

/**
 * P2.2 — Smart suggestions / autocomplete для чат-виджета.
 *
 * Фронт вызывает этот endpoint с debounce, пока клиент печатает.
 * Возвращает 3 наиболее близких вопроса из базы знаний с готовыми
 * короткими ответами (без LLM-вызова — чисто keyword scoring).
 *
 * Цель: клиент видит похожие вопросы → клик → мгновенный ответ.
 * Это снижает время до первого ответа с 2-5 секунд (LLM streaming)
 * до ~50 мс (чисто статика) для самых частых вопросов.
 */

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

function score(item: KnowledgeItem, tokens: string[]): number {
  if (tokens.length === 0) return 0;
  const aliasesText = item.aliases.join(" ").toLowerCase();
  const tagsText = item.tags.join(" ").toLowerCase();
  const questionLower = item.question.toLowerCase();
  const shortLower = item.short.toLowerCase();
  let s = 0;
  for (const tok of tokens) {
    if (aliasesText.includes(tok)) s += 6;
    if (tagsText.includes(tok)) s += 4;
    if (questionLower.includes(tok)) s += 3;
    if (shortLower.includes(tok)) s += 2;
  }
  return s;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = (searchParams.get("q") ?? "").trim();

  if (query.length < 3) {
    return NextResponse.json({ suggestions: [] });
  }

  const tokens = tokenize(query);
  if (tokens.length === 0) {
    return NextResponse.json({ suggestions: [] });
  }

  const scored = knowledgeBase
    .map((item) => ({ item, s: score(item, tokens) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s)
    .slice(0, 5);

  return NextResponse.json({
    suggestions: scored.map(({ item }) => ({
      id: item.id,
      category: item.category,
      question: item.question,
      short: item.short,
    })),
  });
}
