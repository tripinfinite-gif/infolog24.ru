import { describe, it, expect } from "vitest";
import {
  calculatePartnerCommission,
  formatRub,
  BASE_PRICES,
  DEFAULT_PARTNER_COMMISSION_RATE,
} from "@/lib/partner/commission";

describe("calculatePartnerCommission()", () => {
  it("использует базовую цену и дефолтную ставку для mkad_day", () => {
    const r = calculatePartnerCommission({
      orderType: "mkad_day",
      zone: "mkad",
    });
    expect(r.basePrice).toBe(BASE_PRICES.mkad_day);
    expect(r.rate).toBe(DEFAULT_PARTNER_COMMISSION_RATE);
    expect(r.commission).toBe(800);
  });

  it("использует переданную ставку (ttk @ 15%)", () => {
    const r = calculatePartnerCommission({
      orderType: "ttk",
      zone: "ttk",
      rate: 0.15,
    });
    expect(r.commission).toBe(1800);
  });

  it("округляет через Math.round при произвольной цене", () => {
    const r = calculatePartnerCommission({
      orderType: "mkad_day",
      zone: "mkad",
      price: 12345,
    });
    // 12345 * 0.1 = 1234.5 -> Math.round(1234.5) = 1235
    expect(r.commission).toBe(1235);
  });
});

describe("formatRub()", () => {
  it("форматирует 8000 в рубли с символом ₽", () => {
    const s = formatRub(8000);
    expect(s).toContain("8");
    expect(s).toContain("000");
    expect(s).toContain("₽");
  });
});
