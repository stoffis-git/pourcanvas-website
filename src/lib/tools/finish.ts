import { FINISHES, type Criterion, type FinishId } from "./data/finish";

export type Surface = "driveway" | "patio" | "walkway" | "pool-deck";
export type Climate = "freeze-thaw" | "hot-sun" | "wet" | "mild";
export type Priority = "slip" | "barefoot" | "upkeep" | "look" | "budget";
export type Style = "modern" | "traditional" | "natural";

export interface FinishInputs {
  surface: Surface;
  climate: Climate;
  priority: Priority;
  style: Style;
}

export const DEFAULT_FINISH_INPUTS: FinishInputs = {
  surface: "patio",
  climate: "mild",
  priority: "look",
  style: "modern",
};

/** How much the user's top priority counts relative to the other criteria. */
export const PRIORITY_MULTIPLIER = 4;
/** Score reduction for finishes ruled out for the user's surface/climate. */
export const AVOID_PENALTY = 0.4;

export interface RankedFinish {
  id: FinishId;
  name: string;
  score: number; // 0–100
  reasons: string[];
  warnings: string[];
  avoid: boolean;
  materialHref?: string;
}

/** Base weight of each criterion per surface (how much it matters there). */
const SURFACE_WEIGHTS: Record<Surface, Record<Criterion, number>> = {
  driveway: { slip: 2, freezeThaw: 2, heat: 0.5, upkeep: 2, cost: 2, style: 1 },
  patio: { slip: 1.5, freezeThaw: 1.5, heat: 1, upkeep: 1.5, cost: 1.5, style: 1.5 },
  walkway: { slip: 2, freezeThaw: 1.5, heat: 0.5, upkeep: 1.5, cost: 1.5, style: 1.5 },
  "pool-deck": { slip: 3, freezeThaw: 1, heat: 3, upkeep: 1.5, cost: 1, style: 1 },
};

const CLIMATE_BOOST: Record<Climate, Partial<Record<Criterion, number>>> = {
  "freeze-thaw": { freezeThaw: 2.5, heat: 0.5 },
  "hot-sun": { heat: 2, freezeThaw: 0.2 },
  wet: { slip: 1.5, freezeThaw: 0.3 },
  mild: { freezeThaw: 0.2 },
};

const PRIORITY_CRITERION: Record<Priority, Criterion> = {
  slip: "slip",
  barefoot: "heat",
  upkeep: "upkeep",
  look: "style",
  budget: "cost",
};

export const CRITERION_LABELS: Record<Criterion, string> = {
  slip: "Slip resistance",
  freezeThaw: "Freeze-thaw durability",
  heat: "Barefoot comfort",
  upkeep: "Low upkeep",
  cost: "Budget",
  style: "Style fit",
};

export function rankFinishes(input: FinishInputs): RankedFinish[] {
  const weights: Record<Criterion, number> = { ...SURFACE_WEIGHTS[input.surface] };
  for (const [c, m] of Object.entries(CLIMATE_BOOST[input.climate]) as [Criterion, number][]) weights[c] *= m;
  weights[PRIORITY_CRITERION[input.priority]] *= PRIORITY_MULTIPLIER;

  const ranked = FINISHES.map((f) => {
    const scores: Record<Criterion, number> = { ...f.scores, style: f.style[input.style] };
    let total = 0;
    let max = 0;
    for (const c of Object.keys(weights) as Criterion[]) {
      total += weights[c] * scores[c];
      max += weights[c] * 5;
    }
    const applies = (r: { surfaces: Surface[]; climates?: Climate[] }) =>
      r.surfaces.includes(input.surface) && (!r.climates || r.climates.includes(input.climate));
    const avoidRules = f.avoid.filter(applies);
    const warnRules = f.warn.filter(applies);
    const avoid = avoidRules.length > 0;
    const score = Math.round((total / max) * 100 * (avoid ? 1 - AVOID_PENALTY : 1));
    const best = (Object.keys(weights) as Criterion[])
      .filter((c) => c !== "style" && scores[c] >= 4)
      .sort((a, b) => weights[b] * scores[b] - weights[a] * scores[a])
      .slice(0, 2)
      .map((c) => f.notes[c as Exclude<Criterion, "style">]);
    const weak = (Object.keys(weights) as Criterion[])
      .filter((c) => c !== "style" && scores[c] <= 2 && weights[c] >= 1.5)
      .map((c) => f.notes[c as Exclude<Criterion, "style">]);
    return {
      id: f.id,
      name: f.name,
      score,
      reasons: best,
      warnings: [...avoidRules.map((r) => r.reason), ...warnRules.map((r) => r.reason), ...weak],
      avoid,
      materialHref: f.materialHref,
    };
  });
  return ranked.sort((a, b) => Number(a.avoid) - Number(b.avoid) || b.score - a.score);
}

/* ---------- URL params ---------- */
const KEYS: Record<keyof FinishInputs, { short: string; allowed: string[] }> = {
  surface: { short: "s", allowed: ["driveway", "patio", "walkway", "pool-deck"] },
  climate: { short: "c", allowed: ["freeze-thaw", "hot-sun", "wet", "mild"] },
  priority: { short: "p", allowed: ["slip", "barefoot", "upkeep", "look", "budget"] },
  style: { short: "st", allowed: ["modern", "traditional", "natural"] },
};

export function finishInputsFromParams(params: URLSearchParams, defaults: FinishInputs): FinishInputs {
  const out = { ...defaults };
  for (const [k, { short, allowed }] of Object.entries(KEYS) as [keyof FinishInputs, { short: string; allowed: string[] }][]) {
    const v = params.get(short);
    if (v && allowed.includes(v)) (out as Record<string, string>)[k] = v;
  }
  return out;
}

export function finishParams(input: FinishInputs, defaults?: FinishInputs): URLSearchParams {
  const p = new URLSearchParams();
  for (const [k, { short }] of Object.entries(KEYS) as [keyof FinishInputs, { short: string }][]) {
    if (defaults && defaults[k] === input[k]) continue;
    p.set(short, input[k]);
  }
  return p;
}
