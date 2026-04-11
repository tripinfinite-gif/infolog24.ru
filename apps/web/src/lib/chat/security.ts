/**
 * Security helpers for the AI chatbot:
 *   - Input sanitisation (HTML stripping + length cap)
 *   - Prompt-injection pattern detection
 *   - Rough token / cost estimation
 */

export const MAX_INPUT_LENGTH = 2000;

const INJECTION_PATTERNS: RegExp[] = [
  /ignore\s+(?:all\s+)?(?:previous|above|prior)\s+(?:instructions?|prompts?)/i,
  /disregard\s+(?:all\s+)?(?:previous|above|prior)\s+(?:instructions?|prompts?)/i,
  /забудь\s+(?:все\s+)?(?:предыдущие|прошлые)\s+(?:инструкции|указания)/i,
  /игнорируй\s+(?:все\s+)?(?:предыдущие|прошлые)\s+(?:инструкции|указания)/i,
  /system\s*prompt/i,
  /системн(?:ый|ого)\s+промпт/i,
  /ты\s+(?:теперь|больше\s+не)\s+[а-яa-z]/i,
  /you\s+are\s+now\s+[a-z]/i,
  /act\s+as\s+(?:a\s+)?(?:different|new)/i,
  /<\|(?:im_start|im_end|endoftext)\|>/i,
  /\[\[system\]\]/i,
];

export interface SanitizeResult {
  sanitized: string;
  truncated: boolean;
  suspicious: boolean;
}

/**
 * Strip HTML tags, collapse whitespace and cap length.
 * Flags suspicious prompt-injection patterns for logging/blocking.
 */
export function sanitizeUserInput(input: string): SanitizeResult {
  const stripped = input.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
  const truncated = stripped.length > MAX_INPUT_LENGTH;
  const sanitized = truncated ? stripped.slice(0, MAX_INPUT_LENGTH) : stripped;
  const suspicious = INJECTION_PATTERNS.some((pattern) => pattern.test(sanitized));
  return { sanitized, truncated, suspicious };
}

/**
 * Very rough token counter — 1 token ≈ 4 characters for Latin, but Russian
 * text typically runs closer to 1 token per 2.5 chars. We use 3 as a midpoint
 * which is good enough for rate/cost accounting in application logs.
 */
export function estimateTokens(text: string): number {
  return Math.ceil(text.length / 3);
}

// gpt-4o-mini pricing as of 2024-07 (USD per 1M tokens)
const INPUT_COST_PER_1M = 0.15;
const OUTPUT_COST_PER_1M = 0.6;

export function estimateCostUsd(
  inputTokens: number,
  outputTokens: number,
): number {
  const input = (inputTokens / 1_000_000) * INPUT_COST_PER_1M;
  const output = (outputTokens / 1_000_000) * OUTPUT_COST_PER_1M;
  return Number((input + output).toFixed(6));
}
