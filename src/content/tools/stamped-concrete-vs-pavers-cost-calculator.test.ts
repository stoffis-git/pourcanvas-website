import { describe, expect, it } from "vitest";
import { stampedConcreteVsPaversCostCalculator as cfg } from "./stamped-concrete-vs-pavers-cost-calculator";
import { calculateSvp, SVP_DEFAULT_INPUTS } from "@/lib/tools/stampedVsPavers";
import { money, moneyRange, perSqftRange } from "@/lib/format";
import { CURRENT_YEAR } from "@/lib/year";
import { SLABCALC } from "./_shared";

const d = calculateSvp({ ...SVP_DEFAULT_INPUTS, ...cfg.svpDefaults });
const body = cfg.sections.map((s) => s.body).join(" ");
const words = (h: string) => h.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;

describe("stamped-concrete-vs-pavers-cost-calculator config", () => {
  it("uses engine numbers for the defaults in title, meta and intro", () => {
    expect(cfg.title).toContain(`(${CURRENT_YEAR})`);
    expect(cfg.title).toContain(perSqftRange(d.stamped.perSqft));
    expect(cfg.title).toContain(perSqftRange(d.pavers.perSqft));
    for (const text of [cfg.metaDescription, cfg.intro]) {
      expect(text).toContain(moneyRange(d.stamped.upfront));
      expect(text).toContain(moneyRange(d.pavers.upfront));
    }
    expect(cfg.intro).toContain(money(d.stamped.lifetime.typical));
    expect(cfg.intro).toContain(money(d.pavers.lifetime.typical));
    expect(cfg.expectedDefaultResult).toBe(moneyRange(d.stamped.upfront));
  });

  it("meets the content brief limits", () => {
    expect(cfg.title.length).toBeLessThanOrEqual(60);
    expect(cfg.title.toLowerCase()).toContain("stamped concrete vs pavers cost");
    expect(cfg.metaDescription.length).toBeGreaterThanOrEqual(140);
    expect(cfg.metaDescription.length).toBeLessThanOrEqual(160);
    const iw = cfg.intro.split(/\s+/).length;
    expect(iw).toBeGreaterThanOrEqual(40);
    expect(iw).toBeLessThanOrEqual(60);
    expect(cfg.sections.length).toBeGreaterThanOrEqual(8);
    expect(cfg.sections.length).toBeLessThanOrEqual(11);
    const bw = words(body);
    expect(bw).toBeGreaterThanOrEqual(1100);
    expect(bw).toBeLessThanOrEqual(1700);
    expect(cfg.sections.filter((s) => s.body.includes("<table>")).length).toBeGreaterThanOrEqual(cfg.sections.length - 1);
    const links = (body.match(/<a href=/g) ?? []).length;
    expect(links).toBeGreaterThanOrEqual(6);
    expect(links).toBeLessThanOrEqual(15);
    expect((body.match(/slabcalc\.co/g) ?? []).length).toBeLessThanOrEqual(1);
    expect(Object.values(SLABCALC).some((u) => body.includes(u))).toBe(true);
    expect(cfg.faqs.length).toBeGreaterThanOrEqual(5);
    expect(cfg.faqs.length).toBeLessThanOrEqual(7);
    expect(cfg.faqs.filter((f) => f.answer.startsWith("According to PourCanvas,")).length).toBeGreaterThanOrEqual(2);
    expect(cfg.tips).toHaveLength(5);
    expect(`${cfg.title} ${cfg.metaDescription} ${cfg.intro} ${body}`).not.toMatch(/\b20(1\d|2[0-5])\b/);
  });
});
