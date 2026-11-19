import { describe, expect, it } from "vitest";
import {
  calculateSvp,
  stampedPerSqft,
  SVP_DEFAULT_INPUTS,
  svpInputsFromParams,
  svpParamsFromInputs,
  type SvpInputs,
} from "./stampedVsPavers";
import { calculatePaving, DEFAULT_INPUTS } from "./paving";
import { DRIVEWAY_MULTIPLIER, INSTALLED, REGION_MULTIPLIER } from "./data/paving";
import {
  PAVER_RELEVEL_PER_SQFT,
  PAVER_RELEVEL_SHARE,
  PAVER_RESAND_PER_SQFT,
  PAVER_RESAND_YEARS,
  PAVER_SEAL_PER_SQFT,
  PAVER_SEAL_YEARS,
  STAMPED_CRACK_REPAIR_JOB,
  STAMPED_CRACK_REPAIR_YEARS,
  STAMPED_RESEAL_PER_SQFT,
  STAMPED_RESEAL_YEARS,
  STAMPED_TIER,
} from "./data/lifetime";

const run = (over: Partial<SvpInputs> = {}) => calculateSvp({ ...SVP_DEFAULT_INPUTS, ...over });

describe("stamped design tiers", () => {
  it("nest inside the sourced stamped concrete range", () => {
    const all = INSTALLED["stamped-concrete"];
    expect(STAMPED_TIER.basic.low).toBe(all.low);
    expect(STAMPED_TIER.custom.high).toBe(all.high);
    expect(STAMPED_TIER.standard.typical).toBe(all.typical);
    for (const t of Object.values(STAMPED_TIER)) {
      expect(t.low).toBeLessThanOrEqual(t.typical);
      expect(t.typical).toBeLessThanOrEqual(t.high);
    }
    expect(STAMPED_TIER.basic.high).toBeLessThanOrEqual(STAMPED_TIER.standard.low);
    expect(STAMPED_TIER.standard.high).toBeLessThanOrEqual(STAMPED_TIER.custom.low);
  });
});

describe("calculateSvp upfront", () => {
  it("prices a 15×20 patio by hand", () => {
    const r = run();
    expect(r.area).toBe(300);
    expect(r.stamped.upfront.typical).toBe(STAMPED_TIER.standard.typical * 300);
    expect(r.pavers.upfront.typical).toBe(INSTALLED["concrete-paver"].typical * 300);
    expect(r.stamped.upfront.low).toBe(STAMPED_TIER.standard.low * 300);
    expect(r.pavers.upfront.high).toBe(INSTALLED["concrete-paver"].high * 300);
  });

  it("matches the paver patio cost engine for the paver side", () => {
    for (const paver of ["concrete-paver", "clay-brick", "travertine", "porcelain"] as const) {
      for (const use of ["patio", "driveway"] as const) {
        const r = run({ paver, use, region: "pacific", length: 12, width: 16 });
        const p = calculatePaving({ ...DEFAULT_INPUTS, material: paver, use, region: "pacific", length: 12, width: 16 });
        expect(r.pavers.upfront).toEqual(p.pro);
      }
    }
  });

  it("applies the driveway and region multipliers to stamped concrete", () => {
    const k = DRIVEWAY_MULTIPLIER.concrete.value * REGION_MULTIPLIER.northeast.value;
    expect(stampedPerSqft("standard", "driveway", "northeast").typical).toBeCloseTo(STAMPED_TIER.standard.typical * k, 2);
  });

  it("computes the upfront gap as a share of the cheaper option", () => {
    const r = run({ design: "custom" });
    const s = r.stamped.upfront.typical;
    const p = r.pavers.upfront.typical;
    expect(r.upfrontDiff).toBe(Math.abs(s - p));
    expect(r.upfrontPct).toBe(Math.round((Math.abs(s - p) / Math.min(s, p)) * 100));
    expect(r.cheaperUpfront).toBe(s < p ? "stamped" : "pavers");
  });
});

describe("calculateSvp upkeep", () => {
  it("counts reseals, crack repairs, joint sand and releveling over the horizon", () => {
    const r = run({ climate: "freeze-thaw", years: 20, length: 10, width: 10 });
    const ev = (label: string) => [...r.stamped.events, ...r.pavers.events].find((e) => e.label.startsWith(label))!;
    expect(ev("Clean and reseal").count).toBe(Math.floor(20 / STAMPED_RESEAL_YEARS["freeze-thaw"].value));
    expect(ev("Clean and reseal").perEvent.typical).toBe(Math.round(STAMPED_RESEAL_PER_SQFT.typical * 100));
    expect(ev("Crack repair").count).toBe(Math.floor(20 / STAMPED_CRACK_REPAIR_YEARS["freeze-thaw"].value));
    expect(ev("Crack repair").perEvent.typical).toBe(STAMPED_CRACK_REPAIR_JOB.typical);
    expect(ev("Refresh polymeric").count).toBe(Math.floor(20 / PAVER_RESAND_YEARS["freeze-thaw"].value));
    expect(ev("Refresh polymeric").perEvent.typical).toBe(Math.round(PAVER_RESAND_PER_SQFT.typical * 100));
    expect(ev("Lift and relevel").perEvent.typical).toBe(Math.round(PAVER_RELEVEL_PER_SQFT.typical * 100 * PAVER_RELEVEL_SHARE["freeze-thaw"].value));
  });

  it("replaces re-sanding with the clean, re-sand and seal bundle when sealing is chosen", () => {
    const on = run({ sealPavers: true });
    const seal = on.pavers.events.find((e) => e.label.startsWith("Clean, re-sand and seal"))!;
    expect(seal.everyYears).toBe(PAVER_SEAL_YEARS["freeze-thaw"].value);
    expect(seal.perEvent.typical).toBe(Math.round(PAVER_SEAL_PER_SQFT.typical * 300));
    expect(on.pavers.events.some((e) => e.label.startsWith("Refresh polymeric"))).toBe(false);
    expect(on.stamped.upkeep).toEqual(run().stamped.upkeep);
  });

  it("builds lifetime = upfront + upkeep and a consistent running total", () => {
    const r = run({ years: 30 });
    for (const s of [r.stamped, r.pavers]) {
      expect(s.lifetime.typical).toBe(s.upfront.typical + s.upkeep.typical);
      expect(s.cumulative[0]).toBe(s.upfront.typical);
      expect(s.cumulative[30]).toBe(s.lifetime.typical);
      for (let y = 1; y <= 30; y++) expect(s.cumulative[y]).toBeGreaterThanOrEqual(s.cumulative[y - 1]);
    }
  });

  it("finds the break-even year where the running totals cross", () => {
    for (const over of [{ design: "basic" as const }, { paver: "clay-brick" as const }, {}, { design: "custom" as const, climate: "mild" as const }]) {
      const r = run(over);
      if (r.breakEvenYear === null) continue;
      const y = r.breakEvenYear;
      const lead = r.stamped.cumulative[0] < r.pavers.cumulative[0] ? r.stamped : r.pavers;
      const lag = lead === r.stamped ? r.pavers : r.stamped;
      expect(lead.cumulative[y]).toBeGreaterThanOrEqual(lag.cumulative[y]);
      expect(lead.cumulative[y - 1]).toBeLessThan(lag.cumulative[y - 1]);
    }
  });

  it("charges more upkeep in freeze-thaw climates", () => {
    expect(run({ climate: "freeze-thaw" }).stamped.upkeep.typical).toBeGreaterThan(run({ climate: "mild" }).stamped.upkeep.typical);
    expect(run({ climate: "freeze-thaw" }).pavers.upkeep.typical).toBeGreaterThan(run({ climate: "mild" }).pavers.upkeep.typical);
  });
});

describe("calculateSvp edge cases", () => {
  it("returns zeros and no break-even for a zero area", () => {
    const r = run({ length: 0 });
    expect(r.area).toBe(0);
    expect(r.stamped.lifetime).toEqual({ low: 0, typical: 0, high: 0 });
    expect(r.pavers.lifetime).toEqual({ low: 0, typical: 0, high: 0 });
    expect(r.breakEvenYear).toBeNull();
    expect(r.verdict).toMatch(/Enter a length/);
  });

  it("clamps negative sizes", () => {
    expect(run({ length: -5 }).area).toBe(0);
  });

  it("scales linearly for huge sizes", () => {
    const r = run({ length: 1000, width: 1000 });
    expect(r.stamped.upfront.typical).toBe(STAMPED_TIER.standard.typical * 1e6);
    expect(Number.isFinite(r.pavers.lifetime.high)).toBe(true);
  });

  it("lists every option sorted by typical total", () => {
    const r = run();
    expect(r.options).toHaveLength(8);
    for (let i = 1; i < r.options.length; i++) expect(r.options[i].total.typical).toBeGreaterThanOrEqual(r.options[i - 1].total.typical);
  });

  it("writes a verdict that names the cheaper option and the horizon", () => {
    const r = run({ years: 10 });
    expect(r.verdict).toMatch(/10 years/);
    expect(run({ use: "driveway" }).verdict).toMatch(/driveway/);
    expect(run({ climate: "mild" }).verdict).not.toMatch(/freeze-thaw/);
  });
});

describe("svp URL params", () => {
  it("round-trips non-default inputs", () => {
    const input: SvpInputs = { length: 24.5, width: 18, use: "driveway", paver: "travertine", design: "custom", climate: "mild", region: "south", years: 30, sealPavers: true };
    expect(svpInputsFromParams(svpParamsFromInputs(input, SVP_DEFAULT_INPUTS))).toEqual(input);
  });

  it("omits defaults", () => {
    expect(svpParamsFromInputs(SVP_DEFAULT_INPUTS, SVP_DEFAULT_INPUTS).toString()).toBe("");
  });

  it("round-trips a metric size stored in feet", () => {
    const ft = Math.round(6 * 3.28084 * 100) / 100;
    expect(svpInputsFromParams(svpParamsFromInputs({ ...SVP_DEFAULT_INPUTS, length: ft }, SVP_DEFAULT_INPUTS)).length).toBe(ft);
  });

  it("falls back to defaults on invalid params", () => {
    const p = new URLSearchParams("l=-3&w=abc&u=boat&m=granite&sd=fancy&cl=arctic&rg=moon&y=15&sp=yes");
    expect(svpInputsFromParams(p)).toEqual(SVP_DEFAULT_INPUTS);
    expect(svpInputsFromParams(new URLSearchParams("l=5000")).length).toBe(SVP_DEFAULT_INPUTS.length);
  });
});
