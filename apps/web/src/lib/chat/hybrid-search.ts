import { sql } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  knowledgeBase,
  type KnowledgeItem,
} from "@/content/knowledge-base";
import { logger } from "@/lib/logger";

/**
 * P5 — Гибридный поиск по базе знаний.
 *
 * Стратегия:
 *   1. Если RAG_VECTOR_ENABLED=true и таблица knowledge_chunks доступна —
 *      делаем cosine search через pgvector + keyword scoring параллельно,
 *      объединяем через RRF (Reciprocal Rank Fusion).
 *   2. При любой ошибке БД / отсутствии таблицы / отсутствии ключа —
 *      fallback на чистый keyword scoring (как было до P5).
 *
 * Кэш: статус вектора (доступна ли таблица) проверяется лениво один раз
 * за процесс, чтобы не дёргать БД на каждом запросе.
 */

// ── Keyword scoring (та же логика, что в tools.ts) ───────────────────────

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

function scoreKeyword(item: KnowledgeItem, tokens: string[]): number {
  if (tokens.length === 0) return 0;
  const aliasesText = item.aliases.join(" ").toLowerCase();
  const tagsText = item.tags.join(" ").toLowerCase();
  const questionLower = item.question.toLowerCase();
  const shortLower = item.short.toLowerCase();
  const detailLower = item.detail.toLowerCase();
  let s = 0;
  for (const token of tokens) {
    if (aliasesText.includes(token)) s += 6;
    if (tagsText.includes(token)) s += 4;
    if (questionLower.includes(token)) s += 3;
    if (shortLower.includes(token)) s += 2;
    if (detailLower.includes(token)) s += 1;
  }
  return s;
}

function searchKeyword(
  query: string,
  limit = 10,
): Array<{ item: KnowledgeItem; score: number }> {
  const tokens = tokenize(query);
  if (tokens.length === 0) return [];
  return knowledgeBase
    .map((item) => ({ item, score: scoreKeyword(item, tokens) }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

// ── Vector search через pgvector ─────────────────────────────────────────

interface VectorHit {
  sourceId: string;
  distance: number; // 0 (perfect) → 2 (opposite)
}

let vectorAvailable: boolean | null = null;
let vectorAvailableCheckedAt = 0;
const VECTOR_CHECK_TTL_MS = 5 * 60 * 1000; // 5 минут

async function isVectorAvailable(): Promise<boolean> {
  // Если RAG_VECTOR_ENABLED не "true" — никогда не пытаемся
  if (process.env.RAG_VECTOR_ENABLED !== "true") return false;
  if (!process.env.OPENAI_API_KEY) return false;

  const now = Date.now();
  if (
    vectorAvailable !== null &&
    now - vectorAvailableCheckedAt < VECTOR_CHECK_TTL_MS
  ) {
    return vectorAvailable;
  }

  try {
    const result = await db.execute(
      sql`SELECT count(*)::int as cnt FROM knowledge_chunks LIMIT 1`,
    );
    const row = (result as unknown as Array<{ cnt: number }>)[0];
    vectorAvailable = (row?.cnt ?? 0) > 0;
  } catch (error) {
    logger.warn(
      { error },
      "Vector search недоступен (нет таблицы или расширения) — fallback на keyword",
    );
    vectorAvailable = false;
  }
  vectorAvailableCheckedAt = now;
  return vectorAvailable;
}

async function getQueryEmbedding(query: string): Promise<number[] | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;
  try {
    const res = await fetch("https://api.openai.com/v1/embeddings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "text-embedding-3-small",
        input: query,
        encoding_format: "float",
      }),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      data?: Array<{ embedding?: number[] }>;
    };
    return data.data?.[0]?.embedding ?? null;
  } catch (error) {
    logger.warn({ error }, "Embedding generation failed");
    return null;
  }
}

async function searchVector(query: string, limit = 10): Promise<VectorHit[]> {
  const embedding = await getQueryEmbedding(query);
  if (!embedding) return [];
  const literal = `[${embedding.join(",")}]`;

  try {
    // Используем cosine distance оператор <=>
    // Группируем по source_id, берём минимальную дистанцию по чанкам
    const result = await db.execute(sql`
      SELECT
        source_id,
        MIN(embedding <=> ${literal}::vector) AS distance
      FROM knowledge_chunks
      GROUP BY source_id
      ORDER BY distance ASC
      LIMIT ${limit}
    `);
    const rows = result as unknown as Array<{
      source_id: string;
      distance: number;
    }>;
    return rows.map((r) => ({
      sourceId: r.source_id,
      distance: Number(r.distance),
    }));
  } catch (error) {
    logger.warn({ error }, "Vector search query failed — falling back");
    vectorAvailable = false; // переключаемся в fallback
    return [];
  }
}

// ── Reciprocal Rank Fusion ───────────────────────────────────────────────

const RRF_K = 60; // стандартное значение из литературы

interface FusedResult {
  item: KnowledgeItem;
  score: number;
  source: "hybrid" | "keyword" | "vector";
}

function fuseRRF(
  keywordResults: Array<{ item: KnowledgeItem; score: number }>,
  vectorResults: VectorHit[],
): FusedResult[] {
  const itemById = new Map<string, KnowledgeItem>();
  for (const item of knowledgeBase) itemById.set(item.id, item);

  const fused = new Map<
    string,
    { item: KnowledgeItem; score: number; sources: Set<string> }
  >();

  keywordResults.forEach((r, i) => {
    const rank = i + 1;
    const item = r.item;
    const existing = fused.get(item.id);
    const contribution = 1 / (RRF_K + rank);
    if (existing) {
      existing.score += contribution;
      existing.sources.add("keyword");
    } else {
      fused.set(item.id, {
        item,
        score: contribution,
        sources: new Set(["keyword"]),
      });
    }
  });

  vectorResults.forEach((v, i) => {
    const item = itemById.get(v.sourceId);
    if (!item) return;
    const rank = i + 1;
    const contribution = 1 / (RRF_K + rank);
    const existing = fused.get(item.id);
    if (existing) {
      existing.score += contribution;
      existing.sources.add("vector");
    } else {
      fused.set(item.id, {
        item,
        score: contribution,
        sources: new Set(["vector"]),
      });
    }
  });

  return [...fused.values()]
    .sort((a, b) => b.score - a.score)
    .map((x) => ({
      item: x.item,
      score: x.score,
      source:
        x.sources.size === 2
          ? "hybrid"
          : x.sources.has("vector")
            ? "vector"
            : "keyword",
    }));
}

// ── Public API ────────────────────────────────────────────────────────────

export interface HybridSearchOptions {
  limit?: number;
  category?: string;
}

export interface HybridSearchResult {
  item: KnowledgeItem;
  score: number;
  source: "hybrid" | "keyword" | "vector";
}

/**
 * Главная функция поиска. Сама решает, использовать ли вектор,
 * и при ошибках graceful fallback на keyword.
 */
export async function hybridSearchKnowledge(
  query: string,
  options: HybridSearchOptions = {},
): Promise<HybridSearchResult[]> {
  const limit = options.limit ?? 5;

  const tokens = tokenize(query);
  if (tokens.length === 0) return [];

  const useVector = await isVectorAvailable();

  if (!useVector) {
    // Pure keyword
    const kw = searchKeyword(query, limit * 2);
    let results = kw.map<HybridSearchResult>(({ item, score }) => ({
      item,
      score,
      source: "keyword",
    }));
    if (options.category) {
      results = results.filter((r) => r.item.category === options.category);
    }
    return results.slice(0, limit);
  }

  // Параллельный hybrid
  const [keywordResults, vectorResults] = await Promise.all([
    Promise.resolve(searchKeyword(query, limit * 2)),
    searchVector(query, limit * 2),
  ]);

  if (vectorResults.length === 0) {
    // Vector упал в этом запросе — graceful fallback
    let results = keywordResults.map<HybridSearchResult>(({ item, score }) => ({
      item,
      score,
      source: "keyword",
    }));
    if (options.category) {
      results = results.filter((r) => r.item.category === options.category);
    }
    return results.slice(0, limit);
  }

  let fused = fuseRRF(keywordResults, vectorResults);
  if (options.category) {
    fused = fused.filter((r) => r.item.category === options.category);
  }
  return fused.slice(0, limit);
}
