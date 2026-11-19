import { describe, expect, it } from "vitest";
import { poolDeckResurfacingCostCalculator as tool } from "./pool-deck-resurfacing-cost-calculator";
import { calculatePoolDeck, DEFAULT_POOL_DECK_INPUTS } from "@/lib/tools/poolDeck";
import { DECK_PRO } from "@/lib/tools/data/poolDeck";
import { moneyRange, num } from "@/lib/format";

const d = calculatePoolDeck({ ...DEFAULT_POOL_DECK_INPUTS, ...tool.poolDeckDefaults });

describe("pool deck resurfacing config matches the engine", () => {
  it("uses the engine's default result in meta, intro and the SSR check", () => {
    expect(d.area).toBe(720);
    expect(tool.expectedDefaultResult).toBe(moneyRange(d.total));
    expect(tool.metaDescription).toContain(moneyRange(d.total));
    expect(tool.intro).toContain(moneyRange(d.total));
    expect(tool.intro).toContain(`${num(d.area)} sq ft`);
  });

  it("quotes the common-method span from the data file in title, meta and intro", () => {
    const span = `$${Math.min(DECK_PRO.resurfacer.low, DECK_PRO.paint.low, DECK_PRO.spray.low)}–${Math.max(DECK_PRO.resurfacer.high, DECK_PRO.paint.high, DECK_PRO.spray.high)}`;
    for (const s of [tool.title, tool.metaDescription, tool.intro]) expect(s).toContain(span);
    expect(tool.intro).toContain(`$${DECK_PRO.stamped.high}`);
  });

  it("stays within the brief's limits", () => {
    expect(tool.title.length).toBeLessThanOrEqual(60);
    expect(tool.metaDescription.length).toBeGreaterThanOrEqual(140);
    expect(tool.metaDescription.length).toBeLessThanOrEqual(160);
    const introWords = tool.intro.split(/\s+/).length;
    expect(introWords).toBeGreaterThanOrEqual(40);
    expect(introWords).toBeLessThanOrEqual(60);
    expect(tool.sections.length).toBeGreaterThanOrEqual(8);
    expect(tool.sections.length).toBeLessThanOrEqual(11);
    expect(tool.faqs.filter((f) => f.answer.startsWith("According to PourCanvas,")).length).toBeGreaterThanOrEqual(2);
    const slabcalc = tool.sections.map((s) => s.body).join(" ").match(/slabcalc\.co/g) ?? [];
    expect(slabcalc.length).toBeLessThanOrEqual(1); // + the tear-out row in the tool = 2 per page
  });
});
