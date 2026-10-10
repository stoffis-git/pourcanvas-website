import { describe, expect, it } from "vitest";
import { calculatePaving, DEFAULT_INPUTS, inputsFromParams, paramsFromInputs, type PavingInputs } from "./paving";

const run = (over: Partial<PavingInputs> = {}) => calculatePaving({ ...DEFAULT_INPUTS, ...over });

describe("calculatePaving quantities", () => {
  it("counts 6x9 pavers for a 12x12 patio at 5% waste", () => {
    // 144 sq ft * 1.05 / 0.375 = 403.2 -> 404
    expect(run({ length: 12, width: 12 }).paverCount).toBe(404);
  });

  it("adds pattern and curve waste", () => {
    const r = run({ length: 10, width: 10, pattern: "herringbone", curved: true });
    expect(r.wastePct).toBeCloseTo(0.2);
    expect(r.paverCount).toBe(Math.ceil((100 * 1.2) / 0.375));
  });

  it("computes base: 4 in patio, +20% compaction, 1.5 t/yd3 loose (≈1.8 compacted)", () => {
    const r = run({ length: 12, width: 16 });
    // 192 * 4/12 / 27 * 1.2 = 2.844 yd3 -> 4.27 t
    expect(r.baseInches).toBe(4);
    expect(r.baseYd3).toBeCloseTo(2.84, 2);
    expect(r.baseTons).toBeCloseTo(4.3, 1);
  });

  it("uses 8 in base for driveways and +2 in on clay", () => {
    expect(run({ use: "driveway" }).baseInches).toBe(8);
    expect(run({ use: "driveway", soil: "clay" }).baseInches).toBe(10);
  });

  it("computes 1 in bedding sand", () => {
    const r = run({ length: 12, width: 16 });
    expect(r.sandYd3).toBeCloseTo(0.59, 2);
    expect(r.sandTons).toBeCloseTo(0.8, 1);
  });

  it("computes polymeric sand bags by joint width", () => {
    expect(run({ length: 10, width: 14, joint: "narrow" }).polyBags).toBe(2); // 140/70
    expect(run({ length: 10, width: 14, joint: "wide" }).polyBags).toBe(5); // 140/33 = 4.2
  });

  it("computes edge restraint for full and three sides", () => {
    expect(run({ length: 12, width: 16, edging: "full" }).edgeLF).toBe(56);
    expect(run({ length: 12, width: 16, edging: "three-sides" }).edgeLF).toBe(40);
    expect(run({ edging: "none" }).edgeLF).toBe(0);
  });

  it("switches to tons for flagstone", () => {
    const r = run({ material: "flagstone-dry", length: 10, width: 10, thickness: "1.5" });
    expect(r.paverCount).toBe(0);
    expect(r.flagstoneTons).toBeCloseTo(1.3, 1); // 100 sq ft * 1.15 waste / 90 sq ft per ton
  });

  it("puts mortared flagstone on a slab: no base, sand, joint sand or edging", () => {
    const r = run({ material: "flagstone-mortared" });
    expect([r.baseInches, r.baseTons, r.sandTons, r.polyBags, r.edgeLF]).toEqual([0, 0, 0, 0, 0]);
    expect(r.onSlab).toBe(true);
  });

  it("returns zeros for a zero area", () => {
    const r = run({ length: 0 });
    expect(r.area).toBe(0);
    expect(r.paverCount).toBe(0);
    expect(r.pro.typical).toBe(0);
    expect(r.diy.typical).toBe(0);
  });
});

describe("calculatePaving costs", () => {
  it("prices a 12x16 concrete paver patio at $8/14/22 per sq ft", () => {
    const r = run();
    expect(r.pro).toEqual({ low: 1536, typical: 2688, high: 4224 });
  });

  it("uses a lower driveway multiplier for poured concrete than for pavers", () => {
    const r = run({ use: "driveway" });
    const plain = r.compare.find((c) => c.material === "plain-concrete")!;
    expect(plain.perSqft.typical).toBeCloseTo(9 * 1.15, 2);
  });

  it("applies driveway and region multipliers", () => {
    const r = run({ use: "driveway", region: "pacific" });
    expect(r.proPerSqft.typical).toBeCloseTo(14 * 1.25 * 1.18, 2);
  });

  it("adds removal to the installed total", () => {
    const r = run({ removal: "concrete" });
    expect(r.pro.typical).toBe(2688 + 4 * 192);
  });

  it("scales labor with the installed range", () => {
    const r = run({ material: "travertine", length: 15, width: 20 });
    expect(r.labor.low).toBeLessThan(r.labor.typical);
    expect(r.labor.typical).toBeLessThan(r.labor.high);
    expect(r.labor.high / r.labor.low).toBeCloseTo(r.pro.high / r.pro.low, 2);
  });

  it("keeps labor non-negative and materials below pro cost", () => {
    for (const material of ["concrete-paver", "clay-brick", "flagstone-dry", "travertine", "porcelain"] as const) {
      const r = run({ material });
      expect(r.labor.typical).toBeGreaterThanOrEqual(0);
      expect(r.materials.typical).toBeLessThan(r.pro.typical);
    }
  });

  it("sorts the comparison cheapest first", () => {
    const r = run();
    const totals = r.compare.map((c) => c.total.typical);
    expect([...totals].sort((a, b) => a - b)).toEqual(totals);
    expect(r.compare[0].material).toBe("plain-concrete");
  });
});

describe("URL params", () => {
  it("round-trips non-default inputs", () => {
    const input: PavingInputs = { ...DEFAULT_INPUTS, length: 20, width: 24, material: "travertine", use: "driveway", curved: true };
    const params = paramsFromInputs(input, DEFAULT_INPUTS);
    expect(params.toString()).toBe("l=20&w=24&m=travertine&c=1&u=driveway");
    expect(inputsFromParams(params, DEFAULT_INPUTS)).toEqual(input);
  });

  it("ignores invalid values", () => {
    const parsed = inputsFromParams(new URLSearchParams("l=-5&w=abc&m=gold&rg=mars"), DEFAULT_INPUTS);
    expect(parsed).toEqual(DEFAULT_INPUTS);
  });
});
