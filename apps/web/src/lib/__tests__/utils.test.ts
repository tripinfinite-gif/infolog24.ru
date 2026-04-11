import { describe, it, expect } from "vitest";
import { cn } from "@/lib/utils";

describe("cn() — class name merger", () => {
  it("merges simple class names", () => {
    expect(cn("a", "b", "c")).toBe("a b c");
  });

  it("handles falsy values", () => {
    expect(cn("a", false, null, undefined, "b")).toBe("a b");
  });

  it("handles conditional classes via object", () => {
    expect(cn("a", { b: true, c: false })).toBe("a b");
  });

  it("handles arrays", () => {
    expect(cn(["a", "b"], "c")).toBe("a b c");
  });

  it("deduplicates conflicting Tailwind classes — last wins", () => {
    // twMerge should resolve conflicts by keeping the last one
    expect(cn("p-4", "p-2")).toBe("p-2");
    expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500");
  });

  it("returns empty string for no arguments", () => {
    expect(cn()).toBe("");
  });
});
