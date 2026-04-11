/**
 * P5 — Embedding pipeline для базы знаний AI-помощника.
 *
 * Запускается вручную или по cron:
 *   pnpm exec tsx scripts/build-knowledge-embeddings.ts
 *
 * Что делает:
 *   1. Читает knowledgeBase из content/knowledge-base.ts
 *   2. Для каждого пункта формирует "обогащённый" текст:
 *      [question] [aliases] [tags] \n short \n detail
 *   3. Генерирует embedding через text-embedding-3-small (1536 dim)
 *   4. Upsert в knowledge_chunks (source_id = item.id, chunk_index = 0)
 *   5. При большом detail — рубит на чанки 500-800 токенов с overlap 100
 *
 * Требования:
 *   - OPENAI_API_KEY в env
 *   - DATABASE_URL в env
 *   - Применённая миграция 0003_p5_knowledge_chunks.sql (CREATE EXTENSION
 *     vector + CREATE TABLE knowledge_chunks)
 *
 * При отсутствии любого из требований скрипт упадёт с понятной ошибкой,
 * runtime-код продолжит работать в режиме fallback (keyword scoring).
 */

import { sql } from "drizzle-orm";
import { db } from "../src/lib/db";
import { knowledgeChunks } from "../src/lib/db/schema";
import { knowledgeBase } from "../src/content/knowledge-base";

const EMBEDDING_MODEL = "text-embedding-3-small";
const EMBEDDING_DIM = 1536;
const TARGET_TOKENS_PER_CHUNK = 600;
const APPROX_CHARS_PER_TOKEN = 3.5; // грубая оценка для русского

function estimateTokens(text: string): number {
  return Math.ceil(text.length / APPROX_CHARS_PER_TOKEN);
}

/**
 * Делит длинный detail на чанки ~600 токенов по границам предложений.
 * Для коротких detail возвращает один чанк целиком.
 */
function splitIntoChunks(text: string): string[] {
  if (estimateTokens(text) <= TARGET_TOKENS_PER_CHUNK) {
    return [text];
  }
  // Делим по предложениям, потом склеиваем до целевого размера
  const sentences = text.split(/(?<=[.!?])\s+/);
  const chunks: string[] = [];
  let current = "";
  for (const s of sentences) {
    if (estimateTokens(current + " " + s) > TARGET_TOKENS_PER_CHUNK && current) {
      chunks.push(current.trim());
      current = s;
    } else {
      current = current ? `${current} ${s}` : s;
    }
  }
  if (current) chunks.push(current.trim());
  return chunks;
}

async function getEmbedding(text: string): Promise<number[]> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY не установлен");
  }
  const res = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: EMBEDDING_MODEL,
      input: text,
      encoding_format: "float",
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`OpenAI embeddings failed: ${res.status} ${body}`);
  }
  const data = (await res.json()) as {
    data: Array<{ embedding: number[] }>;
  };
  const vec = data.data?.[0]?.embedding;
  if (!Array.isArray(vec) || vec.length !== EMBEDDING_DIM) {
    throw new Error(`Bad embedding shape: ${vec?.length}`);
  }
  return vec;
}

async function main() {
  console.log(`P5 — building embeddings для ${knowledgeBase.length} пунктов`);

  // Sanity check: таблица существует?
  try {
    await db.execute(sql`SELECT 1 FROM knowledge_chunks LIMIT 1`);
  } catch (error) {
    console.error(
      "❌ Таблица knowledge_chunks недоступна. Применить миграцию 0003_p5_knowledge_chunks.sql.\n" +
        "Команда: pnpm exec drizzle-kit migrate (или вручную psql -f drizzle/0003_p5_knowledge_chunks.sql).\n",
    );
    console.error(error);
    process.exit(1);
  }

  let processed = 0;
  let chunksTotal = 0;
  let errors = 0;

  for (const item of knowledgeBase) {
    try {
      // Обогащённый «head» — основной чанк (chunk_index=0).
      const head = [
        item.question,
        item.aliases.join("; "),
        item.tags.join(" "),
        item.short,
      ].join("\n");

      const detailChunks = splitIntoChunks(item.detail);

      // chunk_index = 0 — head + первый чанк detail
      const allChunks = [
        head + "\n\n" + (detailChunks[0] ?? ""),
        ...detailChunks.slice(1),
      ];

      for (let i = 0; i < allChunks.length; i++) {
        const chunkText = allChunks[i] ?? "";
        if (!chunkText.trim()) continue;

        const embedding = await getEmbedding(chunkText);
        await db
          .insert(knowledgeChunks)
          .values({
            sourceId: item.id,
            chunkIndex: i,
            content: chunkText,
            embedding,
            metadata: {
              category: item.category,
              question: item.question,
              tags: item.tags,
            },
          })
          .onConflictDoUpdate({
            target: [knowledgeChunks.sourceId, knowledgeChunks.chunkIndex],
            set: {
              content: chunkText,
              embedding,
              metadata: {
                category: item.category,
                question: item.question,
                tags: item.tags,
              },
              updatedAt: new Date(),
            },
          });
        chunksTotal++;
      }

      processed++;
      if (processed % 10 === 0) {
        console.log(`  ${processed}/${knowledgeBase.length} (${chunksTotal} chunks)`);
      }
    } catch (error) {
      errors++;
      console.error(`  ❌ ${item.id}:`, (error as Error).message);
    }
  }

  console.log(
    `\n✅ Готово. Обработано ${processed}/${knowledgeBase.length} пунктов, ` +
      `${chunksTotal} чанков, ошибок: ${errors}`,
  );
  process.exit(0);
}

void main().catch((error) => {
  console.error("Фатальная ошибка:", error);
  process.exit(1);
});
