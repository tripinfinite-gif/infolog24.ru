import { describe, it, expect } from "vitest";
import JSZip from "jszip";
import { classifyFileName, parseArchive } from "@/lib/documents/zip-parser";

describe("classifyFileName()", () => {
  it("распознаёт pts.pdf с максимальной уверенностью", () => {
    const r = classifyFileName("pts.pdf");
    expect(r.type).toBe("pts");
    expect(r.confidence).toBe(1);
  });

  it("распознаёт ПТС в кириллице по подстроке", () => {
    const r = classifyFileName("ПТС_василий.pdf");
    expect(r.type).toBe("pts");
    expect(r.confidence).toBeGreaterThanOrEqual(0.8);
  });

  it("распознаёт sts_iv9876.jpg как СТС", () => {
    const r = classifyFileName("sts_iv9876.jpg");
    expect(r.type).toBe("sts");
  });

  it("распознаёт voditel.pdf как driver_license", () => {
    const r = classifyFileName("voditel.pdf");
    expect(r.type).toBe("driver_license");
  });

  it("распознаёт dover_2026.pdf как power_of_attorney", () => {
    const r = classifyFileName("dover_2026.pdf");
    expect(r.type).toBe("power_of_attorney");
  });

  it("неизвестное имя попадает в other", () => {
    const r = classifyFileName("random.pdf");
    expect(r.type).toBe("other");
    expect(r.confidence).toBe(0);
  });
});

describe("parseArchive()", () => {
  it("парсит настоящий ZIP с тремя документами", async () => {
    const zip = new JSZip();
    zip.file("pts.pdf", Buffer.from("%PDF-1.4 fake pts"));
    zip.file("sts.pdf", Buffer.from("%PDF-1.4 fake sts"));
    zip.file("vu.pdf", Buffer.from("%PDF-1.4 fake vu"));

    const buffer = await zip.generateAsync({ type: "nodebuffer" });
    const result = await parseArchive(buffer);

    expect(result.files).toHaveLength(3);
    expect(result.rejected).toHaveLength(0);
    expect(result.totalEntries).toBe(3);

    const byType = new Map(result.files.map((f) => [f.type, f]));
    expect(byType.get("pts")).toBeDefined();
    expect(byType.get("sts")).toBeDefined();
    expect(byType.get("driver_license")).toBeDefined();

    for (const f of result.files) {
      expect(Buffer.isBuffer(f.content)).toBe(true);
      expect(f.size).toBeGreaterThan(0);
      expect(f.mimeType).toBe("application/pdf");
    }
  });

  it("отбрасывает неподдерживаемые расширения", async () => {
    const zip = new JSZip();
    zip.file("pts.pdf", Buffer.from("%PDF fake"));
    zip.file("readme.txt", Buffer.from("hello"));

    const buffer = await zip.generateAsync({ type: "nodebuffer" });
    const result = await parseArchive(buffer);

    expect(result.files).toHaveLength(1);
    expect(result.rejected).toHaveLength(1);
    expect(result.rejected[0]?.name).toBe("readme.txt");
  });

  it("бросает Error на невалидном архиве", async () => {
    const notZip = Buffer.from("это не zip-файл вовсе");
    await expect(parseArchive(notZip)).rejects.toThrow();
  });
});
