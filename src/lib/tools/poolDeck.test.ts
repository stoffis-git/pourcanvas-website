import { describe, expect, it } from "vitest";
import {
  calculatePoolDeck,
  DEFAULT_POOL_DECK_INPUTS,
  deckGeometry,
  ellipsePerimeter,
  poolDeckInputsFromParams,
  poolDeckParams,
  REPLACE_PER_SQFT,
  type PoolDeckInputs,
} from "./poolDeck";

const run = (over: Partial<PoolDeckInputs> = {}) => calculatePoolDeck({ ...DEFAULT_POOL_DECK_INPUTS, ...over });
const row = (r: ReturnType<typeof run>, m: string) => r.compare.find((c) => c.method === m)!;

describe("deck geometry", () => {
  it("derives a 720 sq ft deck around a 16x32 pool with a 6 ft deck", () => {
    // (32+12)(16+12) - 32*16 = 1232 - 512
    expect(deckGeometry(DEFAULT_POOL_DECK_INPUTS)).toEqual({ area: 720, copingLF: 96 });
  });

  it("matches the annulus area for a round pool", () => {
    const g = deckGeometry({ ...DEFAULT_POOL_DECK_INPUTS, shape: "round", poolLength: 20, poolWidth: 20, deckWidth: 5 });
    expect(g.copingLF).toBeCloseTo(Math.PI * 20, 6);
    expect(g.area).toBeCloseTo(Math.PI * (15 ** 2 - 10 ** 2), 6);
  });

  it("uses an ellipse perimeter for oval / kidney pools", () => {
    expect(ellipsePerimeter(32, 16)).toBeCloseTo(77.51, 2);
    const g = deckGeometry({ ...DEFAULT_POOL_DECK_INPUTS, shape: "round" });
    expect(g.area).toBeCloseTo(77.507 * 6 + Math.PI * 36, 1);
  });

  it("takes the area directly in area mode", () => {
    const g = deckGeometry({ ...DEFAULT_POOL_DECK_INPUTS, mode: "area", area: 500 });
    expect(g.area).toBe(500);
    expect(g.copingLF).toBeCloseTo(4 * Math.sqrt(500), 6);
  });

  it("returns zeros for a zero-width deck", () => {
    const r = run({ deckWidth: 0 });
    expect(r.area).toBe(0);
    expect(r.total).toEqual({ low: 0, typical: 0, high: 0 });
    expect(r.perSqft.typical).toBe(0);
    expect(r.perYear).toBe(0);
  });

  it("handles a very large deck without overflow or NaN", () => {
    const r = run({ poolLength: 200, poolWidth: 200, deckWidth: 100 });
    expect(r.area).toBe(400 * 400 - 200 * 200);
    expect(Number.isFinite(r.total.high)).toBe(true);
  });
});

describe("costs", () => {
  it("prices the default cool deck at $4/7/12 per sq ft", () => {
    const r = run();
    expect(r.total).toEqual({ low: 2880, typical: 5040, high: 8640 });
    expect(r.perSqft).toEqual({ low: 4, typical: 7, high: 12 });
    expect(r.perYear).toBe(420);
    expect(r.diy).toEqual({ low: 900, typical: 1080, high: 1440 });
  });

  it("derives tear-out + new concrete from removal plus plain concrete", () => {
    expect(REPLACE_PER_SQFT).toEqual({ low: 8, typical: 13, high: 18 });
    expect(row(run(), "replace").total.typical).toBe(720 * 13);
  });

  it("applies the regional multiplier", () => {
    expect(run({ region: "pacific" }).total.typical).toBe(Math.round(720 * 7 * 1.18));
  });

  it("adds crack repair, but not to a tear-out", () => {
    const r = run({ condition: "minor" });
    expect(r.total.typical).toBe(5040 + 500);
    expect(r.repair).toEqual({ low: 250, typical: 500, high: 800 });
    expect(row(r, "replace").total.typical).toBe(720 * 13);
  });

  it("prices coping from the pool perimeter", () => {
    const r = run({ coping: "replace" });
    expect(r.copingCost).toEqual({ low: 96 * 40, typical: 96 * 60, high: 96 * 100 });
    expect(r.total.typical).toBe(5040 + 5760);
  });

  it("has no DIY figure for pro-only methods", () => {
    expect(run({ method: "travertine" }).diy).toBeNull();
    expect(run({ method: "replace" }).diy).toBeNull();
  });
});

describe("suitability and recommendation", () => {
  it("flags every slab-bonded method on a moving slab and recommends replacement", () => {
    const r = run({ condition: "major" });
    for (const c of r.compare) expect(c.suitability).toBe(c.method === "replace" ? "ok" : "unsuitable");
    expect(r.recommended).toBe("replace");
  });

  it("cautions paint and reseal over hairline cracks", () => {
    const r = run({ condition: "minor" });
    expect(row(r, "paint").suitability).toBe("caution");
    expect(row(r, "reseal").suitability).toBe("caution");
    expect(row(r, "spray").suitability).toBe("ok");
  });

  it("recommends the cool deck for value on the default deck (travertine ties per year but costs more)", () => {
    const r = run();
    expect(row(r, "travertine").perYear).toBeLessThan(r.perYear);
    expect(r.recommended).toBe("spray");
    expect(r.recommendation).toContain("Travertine pavers over the slab costs about the same per year");
  });

  it("recommends the resurfacer for the lowest upfront cost and travertine for a premium look", () => {
    expect(run({ priority: "low" }).recommended).toBe("resurfacer");
    expect(run({ priority: "premium" }).recommended).toBe("travertine");
    expect(run({ priority: "cool" }).recommended).toBe("spray");
  });
});

describe("URL params", () => {
  it("round-trips non-default inputs", () => {
    const input: PoolDeckInputs = { ...DEFAULT_POOL_DECK_INPUTS, poolLength: 40, deckWidth: 8, shape: "round", method: "travertine", coping: "replace", region: "south" };
    const params = poolDeckParams(input, DEFAULT_POOL_DECK_INPUTS);
    expect(params.toString()).toBe("pl=40&dw=8&sh=round&me=travertine&cp=replace&rg=south");
    expect(poolDeckInputsFromParams(params, DEFAULT_POOL_DECK_INPUTS)).toEqual(input);
  });

  it("round-trips area mode", () => {
    const input: PoolDeckInputs = { ...DEFAULT_POOL_DECK_INPUTS, mode: "area", area: 850.5 };
    expect(poolDeckInputsFromParams(poolDeckParams(input, DEFAULT_POOL_DECK_INPUTS), DEFAULT_POOL_DECK_INPUTS)).toEqual(input);
  });

  it("ignores invalid values", () => {
    const parsed = poolDeckInputsFromParams(new URLSearchParams("pl=-5&pw=abc&dw=1e9&a=0&me=gold&c=bad&rg=mars&sh=hex&p=x&m=sky"), DEFAULT_POOL_DECK_INPUTS);
    expect(parsed).toEqual(DEFAULT_POOL_DECK_INPUTS);
  });
});
