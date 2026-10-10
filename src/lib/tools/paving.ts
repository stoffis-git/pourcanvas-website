import {
  BAG_CUFT,
  COMPACTOR_RENTAL_PER_DAY,
  BASE_DEPTH_IN,
  BEDDING_SAND_IN,
  COMPACTION_FACTOR,
  CURVED_EXTRA_WASTE,
  DELIVERY_FLAT,
  DRIVEWAY_MULTIPLIER,
  EDGING_PRICE_PER_LF,
  FLAGSTONE_SQFT_PER_TON,
  FLAGSTONE_WASTE,
  GRAVEL_PRICE_PER_TON,
  GRAVEL_TONS_PER_YD3,
  INSTALLED,
  MATERIAL_LABELS,
  MATERIAL_ONLY,
  PATTERN_WASTE,
  PAVER_SIZES,
  POLY_BAG_PRICE,
  POLY_COVERAGE,
  REGION_MULTIPLIER,
  REMOVAL_PER_SQFT,
  SAND_PRICE_PER_TON,
  SAND_TONS_PER_YD3,
  type AnyMaterial,
  type CompareMaterial,
  type Pattern,
  type PavingMaterial,
  type Range,
  type Region,
} from "./data/paving";

export type Use = "patio" | "driveway";
export type Soil = "drained" | "clay";
export type Joint = "narrow" | "wide";
export type Edging = "full" | "three-sides" | "none";
export type Removal = "none" | "sod" | "concrete";
export type FlagThickness = "1" | "1.5" | "2";

export interface PavingInputs {
  length: number; // ft
  width: number; // ft
  material: PavingMaterial;
  paverSize: string; // id from PAVER_SIZES
  pattern: Pattern;
  curved: boolean;
  use: Use;
  soil: Soil;
  joint: Joint;
  edging: Edging;
  removal: Removal;
  region: Region;
  thickness: FlagThickness;
}

export const DEFAULT_INPUTS: PavingInputs = {
  length: 12,
  width: 16,
  material: "concrete-paver",
  paverSize: "6x9",
  pattern: "running-bond",
  curved: false,
  use: "patio",
  soil: "drained",
  joint: "narrow",
  edging: "full",
  removal: "none",
  region: "national",
  thickness: "1.5",
};

export interface CompareRow {
  material: AnyMaterial;
  label: string;
  total: Range;
  perSqft: Range;
}

export interface PavingResult {
  area: number;
  wastePct: number;
  isFlagstone: boolean;
  onSlab: boolean;
  paverCount: number;
  flagstoneTons: number;
  baseInches: number;
  baseYd3: number;
  baseTons: number;
  baseBags: number;
  sandYd3: number;
  sandTons: number;
  sandBags: number;
  polyBags: number;
  edgeLF: number;
  pro: Range;
  proPerSqft: Range;
  materials: Range;
  labor: Range;
  diy: Range;
  removal: Range;
  compare: CompareRow[];
}

const round = (n: number, d = 0) => Math.round(n * 10 ** d) / 10 ** d;
const mapRange = (r: Range, f: (n: number) => number): Range => ({ low: f(r.low), typical: f(r.typical), high: f(r.high) });
const addRange = (a: Range, b: Range): Range => ({ low: a.low + b.low, typical: a.typical + b.typical, high: a.high + b.high });
const ZERO: Range = { low: 0, typical: 0, high: 0 };

export const isFlagstone = (m: AnyMaterial) => m === "flagstone-dry" || m === "flagstone-mortared";

export function paverSqft(sizeId: string): number {
  const s = PAVER_SIZES.find((p) => p.id === sizeId) ?? PAVER_SIZES[2];
  return (s.w * s.l) / 144;
}

function installedPerSqft(material: AnyMaterial, use: Use, region: Region): Range {
  const concrete = material === "plain-concrete" || material === "stamped-concrete" || material === "exposed-aggregate";
  const factor = (use === "driveway" ? DRIVEWAY_MULTIPLIER[concrete ? "concrete" : "pavers"].value : 1) * REGION_MULTIPLIER[region].value;
  return mapRange(INSTALLED[material], (n) => n * factor);
}

export function calculatePaving(input: PavingInputs): PavingResult {
  const length = Math.max(0, input.length);
  const width = Math.max(0, input.width);
  const area = length * width;
  const flag = isFlagstone(input.material);
  // Mortared flagstone is set on a concrete slab (sized on SlabCalc), so no gravel base, bedding sand or joint sand.
  const onSlab = input.material === "flagstone-mortared";

  const wastePct = (flag ? FLAGSTONE_WASTE.value : PATTERN_WASTE[input.pattern]) + (input.curved ? CURVED_EXTRA_WASTE : 0);
  const paverCount = flag || area === 0 ? 0 : Math.ceil((area * (1 + wastePct)) / paverSqft(input.paverSize));
  const flagstoneTons = flag ? round((area * (1 + wastePct)) / FLAGSTONE_SQFT_PER_TON[input.thickness].value, 1) : 0;

  const baseInches = onSlab
    ? 0
    : BASE_DEPTH_IN[input.use].value + (input.soil === "clay" ? BASE_DEPTH_IN.poorSoilExtra.value : 0);
  const baseYd3Raw = onSlab ? 0 : ((area * baseInches) / 12 / 27) * COMPACTION_FACTOR.value;
  const sandYd3Raw = onSlab ? 0 : (area * BEDDING_SAND_IN.value) / 12 / 27;
  const baseTons = round(baseYd3Raw * GRAVEL_TONS_PER_YD3.value, 1);
  const sandTons = round(sandYd3Raw * SAND_TONS_PER_YD3.value, 1);
  const baseBags = Math.ceil((baseYd3Raw * 27) / BAG_CUFT.value);
  const sandBags = Math.ceil((sandYd3Raw * 27) / BAG_CUFT.value);
  const polyBags = area === 0 || onSlab ? 0 : Math.ceil(area / POLY_COVERAGE[flag ? "wide" : input.joint].value);

  const edgeLF =
    input.edging === "none" || area === 0 || onSlab ? 0 : input.edging === "full" ? 2 * (length + width) : 2 * (length + width) - Math.max(length, width);

  const removal = input.removal === "none" ? ZERO : mapRange(REMOVAL_PER_SQFT[input.removal], (n) => round(n * area));
  const proPerSqft = mapRange(installedPerSqft(input.material, input.use, input.region), (n) => round(n, 2));
  const pro = addRange(mapRange(proPerSqft, (n) => round(n * area)), removal);

  const region = REGION_MULTIPLIER[input.region].value;
  const surface = mapRange(MATERIAL_ONLY[input.material], (n) => n * area * (1 + wastePct) * region);
  const aggregates = addRange(
    addRange(mapRange(GRAVEL_PRICE_PER_TON, (n) => n * baseTons), mapRange(SAND_PRICE_PER_TON, (n) => n * sandTons)),
    area > 0 && !onSlab ? DELIVERY_FLAT : ZERO,
  );
  const joints = mapRange(POLY_BAG_PRICE, (n) => n * polyBags);
  const edge = mapRange(EDGING_PRICE_PER_LF, (n) => n * edgeLF);
  const rental = area > 0 && !onSlab ? COMPACTOR_RENTAL_PER_DAY : ZERO;
  const diy = mapRange(addRange(addRange(surface, aggregates), addRange(addRange(joints, edge), rental)), (n) => round(n));
  const materials = mapRange(diy, (n) => n);
  // Labor = installed price minus materials, as a share taken at the typical point so the range scales with the installed range.
  const installedOnly = mapRange(pro, (n) => n);
  installedOnly.low -= removal.low;
  installedOnly.typical -= removal.typical;
  installedOnly.high -= removal.high;
  const laborShare =
    installedOnly.typical > 0 ? Math.min(0.8, Math.max(0.3, (installedOnly.typical - materials.typical) / installedOnly.typical)) : 0;
  const labor = mapRange(installedOnly, (n) => round(n * laborShare));

  const compareMaterials: AnyMaterial[] = [
    "plain-concrete",
    "exposed-aggregate",
    "concrete-paver",
    "stamped-concrete",
    "clay-brick",
    "travertine",
    "flagstone-dry",
    "porcelain",
    "flagstone-mortared",
  ];
  const compare = compareMaterials
    .map((m) => {
      const perSqft = mapRange(installedPerSqft(m, input.use, input.region), (n) => round(n, 2));
      return { material: m, label: MATERIAL_LABELS[m], perSqft, total: mapRange(perSqft, (n) => round(n * area)) };
    })
    .sort((a, b) => a.total.typical - b.total.typical);

  return {
    area: round(area, 1),
    wastePct,
    isFlagstone: flag,
    onSlab,
    paverCount,
    flagstoneTons,
    baseInches,
    baseYd3: round(baseYd3Raw, 2),
    baseTons,
    baseBags,
    sandYd3: round(sandYd3Raw, 2),
    sandTons,
    sandBags,
    polyBags,
    edgeLF: round(edgeLF, 1),
    pro,
    proPerSqft,
    materials,
    labor,
    diy,
    removal,
    compare,
  };
}

/* ---------- URL params ---------- */

const PARAM_KEYS: Record<keyof PavingInputs, string> = {
  length: "l",
  width: "w",
  material: "m",
  paverSize: "ps",
  pattern: "pt",
  curved: "c",
  use: "u",
  soil: "s",
  joint: "j",
  edging: "e",
  removal: "r",
  region: "rg",
  thickness: "t",
};

const ALLOWED: Partial<Record<keyof PavingInputs, readonly string[]>> = {
  material: Object.keys(MATERIAL_ONLY),
  paverSize: PAVER_SIZES.map((p) => p.id),
  pattern: Object.keys(PATTERN_WASTE),
  use: ["patio", "driveway"],
  soil: ["drained", "clay"],
  joint: ["narrow", "wide"],
  edging: ["full", "three-sides", "none"],
  removal: ["none", "sod", "concrete"],
  region: Object.keys(REGION_MULTIPLIER),
  thickness: Object.keys(FLAGSTONE_SQFT_PER_TON),
};

export function inputsFromParams(params: URLSearchParams, defaults: PavingInputs): PavingInputs {
  const out: PavingInputs = { ...defaults };
  for (const [key, short] of Object.entries(PARAM_KEYS) as [keyof PavingInputs, string][]) {
    const raw = params.get(short);
    if (raw === null) continue;
    if (key === "length" || key === "width") {
      const n = Number(raw);
      if (Number.isFinite(n) && n > 0 && n <= 1000) out[key] = n;
    } else if (key === "curved") {
      out.curved = raw === "1";
    } else if (ALLOWED[key]?.includes(raw)) {
      (out as unknown as Record<string, string>)[key] = raw;
    }
  }
  return out;
}

export function paramsFromInputs(input: Partial<PavingInputs>, defaults?: PavingInputs): URLSearchParams {
  const p = new URLSearchParams();
  for (const [key, short] of Object.entries(PARAM_KEYS) as [keyof PavingInputs, string][]) {
    const v = input[key];
    if (v === undefined) continue;
    if (defaults && defaults[key] === v) continue;
    p.set(short, key === "curved" ? (v ? "1" : "0") : String(v));
  }
  return p;
}

export type { AnyMaterial, CompareMaterial, PavingMaterial, Range };
