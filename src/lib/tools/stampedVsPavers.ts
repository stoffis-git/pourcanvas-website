import { calculatePaving, DEFAULT_INPUTS as PAVING_DEFAULTS, type Use } from "./paving";
import {
  DRIVEWAY_MULTIPLIER,
  MATERIAL_LABELS,
  REGION_MULTIPLIER,
  type PavingMaterial,
  type Range,
  type Region,
} from "./data/paving";
import {
  LIFETIME_MAX_YEARS,
  PAVER_RELEVEL_PER_SQFT,
  PAVER_RELEVEL_SHARE,
  PAVER_RELEVEL_YEARS,
  PAVER_RESAND_PER_SQFT,
  PAVER_RESAND_YEARS,
  PAVER_SEAL_PER_SQFT,
  PAVER_SEAL_YEARS,
  STAMPED_CRACK_REPAIR_JOB,
  STAMPED_CRACK_REPAIR_YEARS,
  STAMPED_DESIGN_LABELS,
  STAMPED_RESEAL_PER_SQFT,
  STAMPED_RESEAL_YEARS,
  STAMPED_TIER,
  type Climate,
  type StampedDesign,
} from "./data/lifetime";

export type SvpPaver = Extract<PavingMaterial, "concrete-paver" | "clay-brick" | "travertine" | "porcelain">;
export const SVP_PAVERS: SvpPaver[] = ["concrete-paver", "clay-brick", "travertine", "porcelain"];
export const SVP_HORIZONS = [10, 20, 30] as const;
export type Horizon = (typeof SVP_HORIZONS)[number];

export interface SvpInputs {
  length: number; // ft
  width: number; // ft
  use: Use;
  paver: SvpPaver;
  design: StampedDesign;
  climate: Climate;
  region: Region;
  years: Horizon;
  sealPavers: boolean;
}

export const SVP_DEFAULT_INPUTS: SvpInputs = {
  length: 15,
  width: 20,
  use: "patio",
  paver: "concrete-paver",
  design: "standard",
  climate: "freeze-thaw",
  region: "national",
  years: 20,
  sealPavers: false,
};

export type Side = "stamped" | "pavers";

export interface UpkeepEvent {
  side: Side;
  label: string;
  everyYears: number;
  perEvent: Range;
  count: number;
  total: Range;
}

export interface SideResult {
  label: string;
  perSqft: Range;
  upfront: Range;
  upkeep: Range;
  lifetime: Range;
  events: UpkeepEvent[];
  /** Typical cumulative cost (upfront + upkeep) at the end of each year 0..LIFETIME_MAX_YEARS. */
  cumulative: number[];
}

export interface OptionRow {
  id: string;
  label: string;
  perSqft: Range;
  total: Range;
  side: Side | "plain";
}

export interface SvpResult {
  area: number;
  years: number;
  stamped: SideResult;
  pavers: SideResult;
  cheaperUpfront: Side | "tie";
  /** Absolute typical upfront difference and its share of the cheaper option. */
  upfrontDiff: number;
  upfrontPct: number;
  cheaperOverYears: Side | "tie";
  lifetimeDiff: number;
  lifetimePct: number;
  /** First year in which the option that is cheaper up front stops being cheaper (typical), or null. */
  breakEvenYear: number | null;
  options: OptionRow[];
  verdict: string;
}

const round = (n: number, d = 0) => Math.round(n * 10 ** d) / 10 ** d;
const mapRange = (r: Range, f: (n: number) => number): Range => ({ low: f(r.low), typical: f(r.typical), high: f(r.high) });
const addRange = (a: Range, b: Range): Range => ({ low: a.low + b.low, typical: a.typical + b.typical, high: a.high + b.high });
const ZERO: Range = { low: 0, typical: 0, high: 0 };
const sum = (rs: Range[]) => rs.reduce(addRange, ZERO);

/** A tie is any upfront or lifetime gap under this share of the cheaper option. */
export const TIE_PCT = 5;

export function stampedPerSqft(design: StampedDesign, use: Use, region: Region): Range {
  const factor = (use === "driveway" ? DRIVEWAY_MULTIPLIER.concrete.value : 1) * REGION_MULTIPLIER[region].value;
  return mapRange(STAMPED_TIER[design], (n) => round(n * factor, 2));
}

function events(input: SvpInputs, area: number): UpkeepEvent[] {
  const region = REGION_MULTIPLIER[input.region].value;
  const perArea = (r: Range, share = 1) => mapRange(r, (n) => round(n * area * share * region));
  const make = (side: Side, label: string, everyYears: number, perEvent: Range): UpkeepEvent => {
    const count = area > 0 ? Math.floor(input.years / everyYears) : 0;
    return { side, label, everyYears, perEvent, count, total: mapRange(perEvent, (n) => n * count) };
  };
  const c = input.climate;
  const list: UpkeepEvent[] = [
    make("stamped", "Clean and reseal", STAMPED_RESEAL_YEARS[c].value, perArea(STAMPED_RESEAL_PER_SQFT)),
    make("stamped", "Crack repair (allowance)", STAMPED_CRACK_REPAIR_YEARS[c].value, area > 0 ? mapRange(STAMPED_CRACK_REPAIR_JOB, (n) => round(n * region)) : ZERO),
    input.sealPavers
      ? make("pavers", "Clean, re-sand and seal", PAVER_SEAL_YEARS[c].value, perArea(PAVER_SEAL_PER_SQFT))
      : make("pavers", "Refresh polymeric joint sand", PAVER_RESAND_YEARS[c].value, perArea(PAVER_RESAND_PER_SQFT)),
    make("pavers", `Lift and relevel ${Math.round(PAVER_RELEVEL_SHARE[c].value * 100)}% of the area (allowance)`, PAVER_RELEVEL_YEARS.value, perArea(PAVER_RELEVEL_PER_SQFT, PAVER_RELEVEL_SHARE[c].value)),
  ];
  return list;
}

function cumulative(upfront: number, evs: UpkeepEvent[]): number[] {
  const out: number[] = [];
  for (let y = 0; y <= LIFETIME_MAX_YEARS; y++) {
    let total = upfront;
    for (const e of evs) total += e.perEvent.typical * Math.floor(y / e.everyYears);
    out.push(total);
  }
  return out;
}

function side(label: string, perSqft: Range, area: number, evs: UpkeepEvent[]): SideResult {
  const upfront = mapRange(perSqft, (n) => round(n * area));
  const upkeep = sum(evs.map((e) => e.total));
  return { label, perSqft, upfront, upkeep, lifetime: addRange(upfront, upkeep), events: evs, cumulative: cumulative(upfront.typical, evs) };
}

const compare = (stamped: number, pavers: number): { cheaper: Side | "tie"; diff: number; pct: number } => {
  const diff = Math.abs(pavers - stamped);
  const base = Math.min(stamped, pavers);
  const pct = base > 0 ? Math.round((diff / base) * 100) : 0;
  return { cheaper: pct < TIE_PCT ? "tie" : stamped < pavers ? "stamped" : "pavers", diff, pct };
};

export function calculateSvp(raw: SvpInputs): SvpResult {
  const input = { ...raw, length: Math.max(0, raw.length), width: Math.max(0, raw.width) };
  const area = input.length * input.width;

  const paving = calculatePaving({
    ...PAVING_DEFAULTS,
    length: input.length,
    width: input.width,
    material: input.paver,
    use: input.use,
    region: input.region,
  });

  const evs = events(input, area);
  const stamped = side(`Stamped concrete (${STAMPED_DESIGN_LABELS[input.design].toLowerCase()})`, stampedPerSqft(input.design, input.use, input.region), area, evs.filter((e) => e.side === "stamped"));
  const pavers = side(MATERIAL_LABELS[input.paver], paving.proPerSqft, area, evs.filter((e) => e.side === "pavers"));

  const up = compare(stamped.upfront.typical, pavers.upfront.typical);
  const life = compare(stamped.lifetime.typical, pavers.lifetime.typical);

  // Break-even: first year the cheaper-up-front option's typical running total is no longer lower.
  let breakEvenYear: number | null = null;
  if (area > 0 && stamped.upfront.typical !== pavers.upfront.typical) {
    const lead: Side = stamped.upfront.typical < pavers.upfront.typical ? "stamped" : "pavers";
    for (let y = 1; y <= LIFETIME_MAX_YEARS; y++) {
      const s = stamped.cumulative[y];
      const p = pavers.cumulative[y];
      if (lead === "stamped" ? s >= p : p >= s) {
        breakEvenYear = y;
        break;
      }
    }
  }

  const options: OptionRow[] = [
    ...(Object.keys(STAMPED_TIER) as StampedDesign[]).map((d) => {
      const perSqft = stampedPerSqft(d, input.use, input.region);
      return { id: `stamped-${d}`, label: `Stamped concrete, ${STAMPED_DESIGN_LABELS[d].toLowerCase()}`, perSqft, total: mapRange(perSqft, (n) => round(n * area)), side: "stamped" as const };
    }),
    ...SVP_PAVERS.map((m) => {
      const row = paving.compare.find((c) => c.material === m)!;
      return { id: m, label: row.label, perSqft: row.perSqft, total: row.total, side: "pavers" as const };
    }),
    ...paving.compare
      .filter((c) => c.material === "plain-concrete")
      .map((c) => ({ id: c.material, label: `${c.label} (no pattern)`, perSqft: c.perSqft, total: c.total, side: "plain" as const })),
  ].sort((a, b) => a.total.typical - b.total.typical);

  const result: Omit<SvpResult, "verdict"> = {
    area: round(area, 1),
    years: input.years,
    stamped,
    pavers,
    cheaperUpfront: up.cheaper,
    upfrontDiff: up.diff,
    upfrontPct: up.pct,
    cheaperOverYears: life.cheaper,
    lifetimeDiff: life.diff,
    lifetimePct: life.pct,
    breakEvenYear,
    options,
  };
  return { ...result, verdict: verdictText(result, input) };
}

const usd = (n: number) => `$${Math.round(n).toLocaleString("en-US")}`;
/** Quote-like rounding for prose: nearest 10 under $1k, 50 under $10k, else 100. */
const approx = (n: number) => usd(n < 1000 ? Math.round(n / 10) * 10 : n < 10000 ? Math.round(n / 50) * 50 : Math.round(n / 100) * 100);
const IS: Record<Side, string> = { stamped: "Stamped concrete is", pavers: "Pavers are" };
const COMES: Record<Side, string> = { stamped: "stamped concrete comes", pavers: "pavers come" };

const UPKEEP: Record<Side, string> = { stamped: "resealing and crack repair", pavers: "joint sand and releveling" };

export function verdictText(r: Omit<SvpResult, "verdict">, input: SvpInputs): string {
  if (r.area <= 0) return "Enter a length and width to compare the two.";
  const parts: string[] = [];
  const n = r.years;
  if (r.cheaperUpfront === "tie") {
    parts.push(`Up front it is close to a tie: the typical prices differ by only ${r.upfrontPct}%.`);
    parts.push(
      r.cheaperOverYears === "tie"
        ? `Over ${n} years they stay within ${r.lifetimePct}% of each other, so choose on looks and repairability.`
        : `Over ${n} years, ${COMES[r.cheaperOverYears]} out about ${approx(r.lifetimeDiff)} cheaper once upkeep is counted.`,
    );
  } else {
    const u = r.cheaperUpfront;
    parts.push(`${IS[u]} cheaper up front by about ${approx(r.upfrontDiff)} (${r.upfrontPct}%).`);
    if (r.cheaperOverYears === "tie") {
      parts.push(`Over ${n} years, ${UPKEEP[u]} narrow the gap to ${r.lifetimePct}%, so looks and repairability can decide it.`);
    } else if (r.cheaperOverYears === u) {
      const later = r.breakEvenYear && r.breakEvenYear > n ? ` At these rates the running totals would cross in year ${r.breakEvenYear}.` : "";
      parts.push(`${u === "stamped" ? "It stays" : "They stay"} about ${approx(r.lifetimeDiff)} cheaper over ${n} years, even after ${UPKEEP[u]}.${later}`);
    } else {
      parts.push(`Upkeep flips it: ${COMES[r.cheaperOverYears]} out about ${approx(r.lifetimeDiff)} cheaper over ${n} years${r.breakEvenYear ? `, with the running totals crossing in year ${r.breakEvenYear}` : ""}.`);
    }
  }
  if (input.climate === "freeze-thaw") parts.push("With freeze-thaw winters, plan on the stamped slab cracking at some point; pavers shift instead and can be relaid.");
  if (input.use === "driveway") parts.push("For a driveway, insist on a thicker base under pavers and a thicker, reinforced slab for stamped concrete.");
  return parts.join(" ");
}


/* ---------- URL params ---------- */

const PARAM_KEYS: Record<keyof SvpInputs, string> = {
  length: "l",
  width: "w",
  use: "u",
  paver: "m",
  design: "sd",
  climate: "cl",
  region: "rg",
  years: "y",
  sealPavers: "sp",
};

export const SVP_PARAM_KEYS = Object.values(PARAM_KEYS);

const ALLOWED: Partial<Record<keyof SvpInputs, readonly string[]>> = {
  use: ["patio", "driveway"],
  paver: SVP_PAVERS,
  design: Object.keys(STAMPED_TIER),
  climate: ["mild", "freeze-thaw"],
  region: Object.keys(REGION_MULTIPLIER),
  years: SVP_HORIZONS.map(String),
};

export function svpInputsFromParams(params: URLSearchParams, defaults: SvpInputs = SVP_DEFAULT_INPUTS): SvpInputs {
  const out: SvpInputs = { ...defaults };
  for (const [key, short] of Object.entries(PARAM_KEYS) as [keyof SvpInputs, string][]) {
    const raw = params.get(short);
    if (raw === null) continue;
    if (key === "length" || key === "width") {
      const n = Number(raw);
      if (Number.isFinite(n) && n > 0 && n <= 1000) out[key] = n;
    } else if (key === "sealPavers") {
      if (raw === "1" || raw === "0") out.sealPavers = raw === "1";
    } else if (key === "years") {
      if (ALLOWED.years!.includes(raw)) out.years = Number(raw) as Horizon;
    } else if (ALLOWED[key]?.includes(raw)) {
      (out as unknown as Record<string, string>)[key] = raw;
    }
  }
  return out;
}

export function svpParamsFromInputs(input: SvpInputs, defaults?: SvpInputs): URLSearchParams {
  const p = new URLSearchParams();
  for (const [key, short] of Object.entries(PARAM_KEYS) as [keyof SvpInputs, string][]) {
    const v = input[key];
    if (defaults && defaults[key] === v) continue;
    p.set(short, key === "sealPavers" ? (v ? "1" : "0") : String(v));
  }
  return p;
}

