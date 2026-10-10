import { describe, expect, it } from "vitest";
import { DEFAULT_FINISH_INPUTS, finishInputsFromParams, finishParams, rankFinishes, type FinishInputs } from "./finish";

const rank = (over: Partial<FinishInputs>) => rankFinishes({ ...DEFAULT_FINISH_INPUTS, ...over });

describe("rankFinishes", () => {
  it("always puts smooth troweled concrete last-tier outdoors", () => {
    for (const surface of ["driveway", "patio", "walkway", "pool-deck"] as const) {
      const r = rank({ surface });
      const smooth = r.find((f) => f.id === "smooth")!;
      expect(smooth.avoid).toBe(true);
      expect(r.indexOf(smooth)).toBeGreaterThanOrEqual(r.filter((f) => !f.avoid).length);
    }
  });

  it("avoids salt finish on a freeze-thaw driveway but only warns on a patio", () => {
    expect(rank({ surface: "driveway", climate: "freeze-thaw" }).find((f) => f.id === "salt")!.avoid).toBe(true);
    const patio = rank({ surface: "patio", climate: "freeze-thaw" }).find((f) => f.id === "salt")!;
    expect(patio.avoid).toBe(false);
    expect(patio.warnings.join(" ")).toMatch(/sealer/);
  });

  it("recommends a broom or aggregate finish for a freeze-thaw driveway", () => {
    expect(["broom", "light-broom", "exposed-aggregate"]).toContain(rank({ surface: "driveway", climate: "freeze-thaw", priority: "upkeep" })[0].id);
  });

  it("recommends a slip-resistant, cool finish for a hot pool deck", () => {
    const top = rank({ surface: "pool-deck", climate: "hot-sun", priority: "barefoot" })[0];
    expect(["light-broom", "salt", "sandblasted", "exposed-aggregate"]).toContain(top.id);
    expect(top.avoid).toBe(false);
  });

  it("favors stamped for a traditional patio focused on looks", () => {
    const r = rank({ surface: "patio", climate: "mild", priority: "look", style: "traditional" });
    expect(r.slice(0, 2).map((f) => f.id)).toContain("stamped");
  });

  it("scores between 0 and 100 with reasons", () => {
    for (const f of rank({})) {
      expect(f.score).toBeGreaterThan(0);
      expect(f.score).toBeLessThanOrEqual(100);
    }
  });

  it("round-trips URL params", () => {
    const i: FinishInputs = { surface: "pool-deck", climate: "hot-sun", priority: "barefoot", style: "natural" };
    expect(finishInputsFromParams(finishParams(i), DEFAULT_FINISH_INPUTS)).toEqual(i);
  });
});
