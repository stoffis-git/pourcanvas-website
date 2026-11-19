import { INSTALLED, REGION_MULTIPLIER, REMOVAL_PER_SQFT, type Range, type Region } from "./data/paving";
import {
  COPING_PER_LF,
  CRACK_REPAIR,
  DECK_DIY,
  DECK_HEAT_SLIP,
  DECK_LIFESPAN,
  DECK_METHOD_LABELS,
  DECK_METHODS,
  DECK_PRO,
  type DeckCondition,
  type DeckMethod,
  type HeatSlip,
} from "./data/poolDeck";

export type DeckMode = "pool" | "area";
export type PoolShape = "rect" | "round";
export type Coping = "keep" | "replace";
export type Priority = "low" | "value" | "cool" | "premium";

export interface PoolDeckInputs {
  mode: DeckMode;
  poolLength: number; // ft
  poolWidth: number; // ft
  deckWidth: number; // ft
  shape: PoolShape;
  area: number; // sq ft, used when mode = "area"
  method: DeckMethod;
  condition: DeckCondition;
  coping: Coping;
  region: Region;
  priority: Priority;
}

export const DEFAULT_POOL_DECK_INPUTS: PoolDeckInputs = {
  mode: "pool",
  poolLength: 32,
  poolWidth: 16,
  deckWidth: 6,
  shape: "rect",
  area: 720,
  method: "spray",
  condition: "sound",
  coping: "keep",
  region: "national",
  priority: "value",
};

export type Suitability = "ok" | "caution" | "unsuitable";

export interface DeckMethodRow {
  method: DeckMethod;
  label: string;
  perSqft: Range;
  total: Range;
  lifespan: Range;
  perYear: number;
  diy: Range | null;
  heatSlip: HeatSlip;
  suitability: Suitability;
}

export interface PoolDeckResult {
  area: number;
  copingLF: number;
  surface: Range;
  repair: Range;
  copingCost: Range;
  total: Range;
  perSqft: Range;
  lifespan: Range;
  perYear: number;
  diy: Range | null;
  suitability: Suitability;
  compare: DeckMethodRow[];
  recommended: DeckMethod;
  recommendation: string;
}

const round = (n: number, d = 0) => Math.round(n * 10 ** d) / 10 ** d;
const mapRange = (r: Range, f: (n: number) => number): Range => ({ low: f(r.low), typical: f(r.typical), high: f(r.high) });
const addRange = (a: Range, b: Range): Range => ({ low: a.low + b.low, typical: a.typical + b.typical, high: a.high + b.high });
const ZERO: Range = { low: 0, typical: 0, high: 0 };

/** Tear-out + new broom-finish concrete: SlabCalc's lane, shown for comparison only. */
export const REPLACE_PER_SQFT: Range = addRange(INSTALLED["plain-concrete"], REMOVAL_PER_SQFT.concrete);

export const proPerSqft = (m: DeckMethod): Range => (m === "replace" ? REPLACE_PER_SQFT : DECK_PRO[m]);

/** Ellipse perimeter (Ramanujan II), axes = full length and width. */
export const ellipsePerimeter = (l: number, w: number) => {
  const a = l / 2;
  const b = w / 2;
  if (a + b === 0) return 0;
  const h = (a - b) ** 2 / (a + b) ** 2;
  return Math.PI * (a + b) * (1 + (3 * h) / (10 + Math.sqrt(4 - 3 * h)));
};

/** Deck area and coping length from the inputs. */
export function deckGeometry(input: PoolDeckInputs): { area: number; copingLF: number } {
  if (input.mode === "area") {
    const area = Math.max(0, input.area);
    return { area, copingLF: 4 * Math.sqrt(area) };
  }
  const L = Math.max(0, input.poolLength);
  const W = Math.max(0, input.poolWidth);
  const D = Math.max(0, input.deckWidth);
  if (input.shape === "round") {
    const P = ellipsePerimeter(L, W);
    return { area: P * D + Math.PI * D * D, copingLF: P };
  }
  return { area: (L + 2 * D) * (W + 2 * D) - L * W, copingLF: 2 * (L + W) };
}

export function suitabilityFor(method: DeckMethod, condition: DeckCondition): Suitability {
  if (method === "replace") return "ok";
  if (condition === "major") return "unsuitable";
  if (condition === "minor" && (method === "reseal" || method === "paint")) return "caution";
  return "ok";
}

/** Cost-per-year values within 5% count as a tie (the ranges behind them are far wider than that). */
export const VALUE_TIE = 0.05;

const RESURFACE: DeckMethod[] =["paint", "resurfacer", "spray", "stamped", "rubber", "pavers", "travertine"];

export function calculatePoolDeck(input: PoolDeckInputs): PoolDeckResult {
  const { area, copingLF } = deckGeometry(input);
  const region = REGION_MULTIPLIER[input.region].value;
  const copingCost = input.coping === "replace" ? mapRange(COPING_PER_LF, (n) => round(n * copingLF * region)) : ZERO;
  const repairFor = (m: DeckMethod) =>
    input.condition === "sound" || m === "replace" || area === 0 ? ZERO : mapRange(CRACK_REPAIR[input.condition], (n) => round(n * region));

  const rows: DeckMethodRow[] = DECK_METHODS.map((m) => {
    const surface = mapRange(proPerSqft(m), (n) => round(n * area * region));
    const total = addRange(addRange(surface, repairFor(m)), copingCost);
    const lifespan = DECK_LIFESPAN[m];
    const diyRate = DECK_DIY[m];
    return {
      method: m,
      label: DECK_METHOD_LABELS[m],
      perSqft: mapRange(total, (n) => (area > 0 ? round(n / area, 2) : 0)),
      total,
      lifespan: { low: lifespan.low, typical: lifespan.typical, high: lifespan.high },
      perYear: round(total.typical / lifespan.typical),
      diy: diyRate ? mapRange(diyRate, (n) => round(n * area * region)) : null,
      heatSlip: DECK_HEAT_SLIP[m],
      suitability: suitabilityFor(m, input.condition),
    };
  });

  const row = rows.find((r) => r.method === input.method)!;
  const surface = mapRange(proPerSqft(input.method), (n) => round(n * area * region));
  const { recommended, recommendation } = recommend(input, rows);

  return {
    area: round(area, 1),
    copingLF: round(copingLF, 1),
    surface,
    repair: repairFor(input.method),
    copingCost,
    total: row.total,
    perSqft: row.perSqft,
    lifespan: row.lifespan,
    perYear: row.perYear,
    diy: row.diy,
    suitability: row.suitability,
    compare: rows,
    recommended,
    recommendation,
  };
}

const fmt = (n: number) => `$${Math.round(n).toLocaleString("en-US")}`;

function recommend(input: PoolDeckInputs, rows: DeckMethodRow[]): { recommended: DeckMethod; recommendation: string } {
  const by = (m: DeckMethod) => rows.find((r) => r.method === m)!;
  if (input.condition === "major") {
    const r = by("replace");
    return {
      recommended: "replace",
      recommendation: `Wide cracks, heaving or sinking mean the slab is moving, and any coating, overlay or paver set on it will crack with it. Get the slab leveled and repaired first, or budget for tear-out and a new deck (about ${fmt(r.total.typical)} typical). Once the slab is stable, any method in the table works.`,
    };
  }
  const candidates = rows.filter((r) => RESURFACE.includes(r.method) && r.suitability === "ok");
  let pick: DeckMethodRow;
  let why: string;
  let tie = "";
  switch (input.priority) {
    case "low":
      pick = [...candidates].sort((a, b) => a.total.typical - b.total.typical)[0];
      why = `is the cheapest way to put a new surface on this deck, at about ${fmt(pick.total.typical)} typical`;
      break;
    case "cool":
      pick = by("spray");
      why = `stays the coolest and grippiest underfoot for the money, at about ${fmt(pick.total.typical)} typical and roughly ${pick.lifespan.typical} years of service`;
      break;
    case "premium":
      pick = by("travertine");
      why = `gives the premium stone look and stays cool, at about ${fmt(pick.total.typical)} typical, and lasts ${pick.lifespan.low}–${pick.lifespan.high} years`;
      break;
    default: {
      // Lowest cost per year; near-ties (within VALUE_TIE) go to the lower upfront price.
      const best = Math.min(...candidates.map((r) => r.perYear));
      const near = candidates.filter((r) => r.perYear <= best * (1 + VALUE_TIE)).sort((a, b) => a.total.typical - b.total.typical);
      pick = near[0];
      why = `gives the best value: about ${fmt(pick.perYear)} a year of service (${fmt(pick.total.typical)} over roughly ${pick.lifespan.typical} years)`;
      const alt = near.find((r) => r.method !== pick.method);
      if (alt) tie = ` ${alt.label} costs about the same per year (${fmt(alt.perYear)}) but ${fmt(alt.total.typical)} up front.`;
    }
  }
  const chosen = by(input.method);
  let text = `${pick.label} ${why}.${tie}`;
  if (input.method !== pick.method) {
    if (chosen.suitability === "caution") text += ` ${chosen.label} won't hide cracks; they show through within a season.`;
    else text += ` Your pick, ${chosen.label.toLowerCase()}, runs about ${fmt(chosen.total.typical)} and ${fmt(chosen.perYear)} a year.`;
  }
  if (input.condition === "minor") text += " Budget for crack repair first; it is included in every total.";
  return { recommended: pick.method, recommendation: text };
}

/* ---------- URL params ---------- */

const PARAM_KEYS: Record<keyof PoolDeckInputs, string> = {
  mode: "m",
  poolLength: "pl",
  poolWidth: "pw",
  deckWidth: "dw",
  shape: "sh",
  area: "a",
  method: "me",
  condition: "c",
  coping: "cp",
  region: "rg",
  priority: "p",
};

export const POOL_DECK_PARAM_KEYS = Object.values(PARAM_KEYS);

const NUMERIC_MAX: Partial<Record<keyof PoolDeckInputs, number>> = { poolLength: 200, poolWidth: 200, deckWidth: 100, area: 20000 };

const ALLOWED: Partial<Record<keyof PoolDeckInputs, readonly string[]>> = {
  mode: ["pool", "area"],
  shape: ["rect", "round"],
  method: DECK_METHODS,
  condition: ["sound", "minor", "major"],
  coping: ["keep", "replace"],
  region: Object.keys(REGION_MULTIPLIER),
  priority: ["low", "value", "cool", "premium"],
};

export function poolDeckInputsFromParams(params: URLSearchParams, defaults: PoolDeckInputs): PoolDeckInputs {
  const out: PoolDeckInputs = { ...defaults };
  for (const [key, short] of Object.entries(PARAM_KEYS) as [keyof PoolDeckInputs, string][]) {
    const raw = params.get(short);
    if (raw === null) continue;
    const max = NUMERIC_MAX[key];
    if (max !== undefined) {
      const n = Number(raw);
      if (Number.isFinite(n) && n > 0 && n <= max) (out as unknown as Record<string, number>)[key] = n;
    } else if (ALLOWED[key]?.includes(raw)) {
      (out as unknown as Record<string, string>)[key] = raw;
    }
  }
  return out;
}

export function poolDeckParams(input: PoolDeckInputs, defaults?: PoolDeckInputs): URLSearchParams {
  const p = new URLSearchParams();
  for (const [key, short] of Object.entries(PARAM_KEYS) as [keyof PoolDeckInputs, string][]) {
    const v = input[key];
    if (defaults && defaults[key] === v) continue;
    p.set(short, String(v));
  }
  return p;
}
