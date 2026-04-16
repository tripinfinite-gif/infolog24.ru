/**
 * Smoke-тесты playbook-модуля. Проверяют, что блоки не пустые,
 * встраиваются в system prompt и содержат ключевые маркеры.
 */
import { describe, expect, it } from "vitest";

import { buildSystemPrompt } from "./system-prompt";
import {
  ANTI_PATTERNS,
  CUSTOMER_JARGON,
  EMPATHY_FIRST,
  HOT_TOPICS_2026,
  MANAGER_MECHANICS,
  OPENING_PATTERNS,
  TOP_OBJECTIONS,
  TRUST_MARKERS,
  VERVO_FORMULA,
  buildPlaybookBlock,
} from "./playbook";

describe("playbook constants", () => {
  it("каждая константа непустая и содержит смысловой текст", () => {
    const all = [
      HOT_TOPICS_2026,
      CUSTOMER_JARGON,
      VERVO_FORMULA,
      TOP_OBJECTIONS,
      MANAGER_MECHANICS,
      OPENING_PATTERNS,
      EMPATHY_FIRST,
      TRUST_MARKERS,
      ANTI_PATTERNS,
    ];
    for (const block of all) {
      expect(block.length).toBeGreaterThan(100);
    }
  });

  it("HOT_TOPICS_2026 содержит ключевые темы РНИС-аннуляций", () => {
    expect(HOT_TOPICS_2026).toContain("РНИС");
    expect(HOT_TOPICS_2026).toContain("7 500");
    expect(HOT_TOPICS_2026).toContain("30-дневный карантин");
    expect(HOT_TOPICS_2026).toContain("Грузовой каркас");
  });

  it("VERVO_FORMULA содержит все пять шагов", () => {
    expect(VERVO_FORMULA).toContain("В — Внешняя причина");
    expect(VERVO_FORMULA).toContain("Э — Эмпатия");
    expect(VERVO_FORMULA).toContain("Р — Решение");
    expect(VERVO_FORMULA).toContain("В — Вектор");
    expect(VERVO_FORMULA).toContain("О — Обучение");
  });

  it("CUSTOMER_JARGON содержит ключевой жаргон перевозчиков", () => {
    expect(CUSTOMER_JARGON).toContain("разовка");
    expect(CUSTOMER_JARGON).toContain("годовик");
    expect(CUSTOMER_JARGON).toContain("грузкаркас");
    expect(CUSTOMER_JARGON).toContain("две зелёные галочки");
  });
});

describe("buildPlaybookBlock", () => {
  it("возвращает объединённый блок со всеми секциями", () => {
    const block = buildPlaybookBlock();
    expect(block).toContain("ПРОДАЮЩИЕ ТЕХНИКИ");
    expect(block).toContain("ГОРЯЩИЕ ТЕМЫ");
    expect(block).toContain("ВЭРВО");
    expect(block.length).toBeGreaterThan(3000);
  });
});

describe("buildSystemPrompt integration", () => {
  it("включает playbook-блок в итоговый промпт", () => {
    const prompt = buildSystemPrompt();
    expect(prompt).toContain("ПРОДАЮЩИЕ ТЕХНИКИ");
    expect(prompt).toContain("ГОРЯЩИЕ ТЕМЫ");
    expect(prompt).toContain("две зелёные галочки");
  });

  it("сохраняет базовые правила и при подключённом playbook", () => {
    const prompt = buildSystemPrompt();
    expect(prompt).toContain("«ИнфоПилот»");
    expect(prompt).toContain("<security>");
  });
});
