// Finish selector scoring. Every score traces to _planning/refactor-2026-10/tool-specs/finish-research.md.
// Style scores are editorial (design judgement), not sourced; all other criteria are.
import type { Source } from "./paving";
import type { Climate, Surface } from "../finish";

export type FinishId = "light-broom" | "broom" | "exposed-aggregate" | "salt" | "stamped" | "sandblasted" | "smooth";
export type Criterion = "slip" | "freezeThaw" | "heat" | "upkeep" | "cost" | "style";

interface Rule {
  surfaces: Surface[];
  climates?: Climate[];
  reason: string;
}

export interface FinishData {
  id: FinishId;
  name: string;
  /** 1–5, higher is better for the homeowner. */
  scores: Record<Exclude<Criterion, "style">, number>;
  style: Record<"modern" | "traditional" | "natural", number>;
  notes: Record<Exclude<Criterion, "style">, string>;
  /** Hard rules: ranked last with a 40% score penalty. */
  avoid: Rule[];
  /** Soft rules: shown as warnings, no penalty. */
  warn: Rule[];
  materialHref?: string;
  sources: Source[];
}

const S = {
  nrmca: { label: "NRMCA CIP 2: Scaling Concrete Surfaces", url: "https://www.nrmca.org/wp-content/uploads/2021/01/02pr.pdf", date: "2014" },
  ccaa: { label: "CCAA: Slip Resistance of Polished Concrete Surfaces", url: "https://cdn2.hubspot.net/hub/94143/file-17569159-pdf/docs/slipresistanceofpolishedconcretesurfaces.pdf", date: "2006-11" },
  unsw: { label: "UNSW Home Modification Clearinghouse: Slip Resistance of Ramps (CCAA research)", url: "https://www.homemods.info/", date: "2016-07" },
  cdSlip: { label: "Concrete Decor: Slip Resistance Guide for Concrete Surfaces", url: "https://www.concretedecor.net/departments/safety/get-a-grip-on-concrete-slip-resistance/", date: "2006-01" },
  cdPool: { label: "Concrete Decor: Fixing Slippery Stamped Concrete Near Pools", url: "https://www.concretedecor.net/departments/stamping-texturing-concrete/a-slippery-problem-stamped-concrete-near-pools/", date: "2013-08" },
  cdFreeze: { label: "Concrete Decor: Using Sealers to Fight Freeze-Thaw", url: "https://www.concretedecor.net/departments/concrete-sealers/carltons-corner-using-sealers-to-fight-freeze-thaw/", date: "2013-02" },
  cdAgg: { label: "Concrete Decor: Sealing Exposed Aggregate Concrete", url: "https://www.concretedecor.net/departments/concrete-sealers/seal-exposed-aggregate-concrete-for-best-results/", date: "2019-05" },
  lbnl: { label: "LBNL Heat Island Group: Cool Pavements", url: "https://heatisland.lbl.gov/coolscience/cool-pavements", date: "2026" },
  lbnl01: { label: "Levinson & Akbari (LBNL): Solar Reflectance of Portland Cement Concrete", url: "https://www.osti.gov/servlets/purl/820773", date: "2001-12" },
  solomon: { label: "Solomon Colors: Integral Color SR and SRI Values", url: "https://www.solomoncolors.com/tech-docs/pdf/solomon/Integral-Color-SRI-Values.pdf", date: "2012" },
  cnBroom: { label: "Concrete Network: Broom Finish", url: "https://www.concretenetwork.com/slip-resistant-coatings/broom-finish.html", date: "2020-05-14" },
  cnSalt: { label: "Concrete Network: Rock Salt Concrete Finish", url: "https://www.concretenetwork.com/rock-salt-finish/", date: "undated" },
  cnStamped: { label: "Concrete Network: What Is Stamped Concrete?", url: "https://www.concretenetwork.com/stamped-concrete/", date: "2026-07-14" },
  cnAggPool: { label: "Concrete Network: Exposed Aggregate Pool Decks", url: "https://www.concretenetwork.com/concrete/pool_decks/exposed_aggregate.htm", date: "2021-02-19" },
  cnPool: { label: "Concrete Network: Pool Decking Options", url: "https://www.concretenetwork.com/concrete/pool_decks/options.html", date: "2021-06-02" },
  apa: { label: "Architectural Precast Association: Color and Finish Guide", url: "https://www.archprecast.org/assets/GuidesSpecs/Color%20and%20Finish%20Guide.pdf", date: "2017-08" },
  slabcalc: { label: "SlabCalc: Finish Type Cost Estimator", url: "https://www.slabcalc.co/calculators/finish-type-cost-estimator", date: "2026-09-28" },
  lawnloveConcrete: { label: "Lawn Love: concrete patio cost", url: "https://lawnlove.com/blog/concrete-patio-cost/", date: "2026-10-05" },
  metalAmericaAgg: { label: "Metal America: exposed aggregate concrete guide", url: "https://metalamericaconcrete.com/blog/exposed-aggregate-concrete-and-complete-guide/", date: "2026-03-10" },
} satisfies Record<string, Source>;

export const FINISH_SOURCES: Source[] = Object.values(S);

export const FINISHES: FinishData[] = [
  {
    id: "broom",
    name: "Broom finish (medium)",
    scores: { slip: 5, freezeThaw: 4, heat: 3, upkeep: 4, cost: 5 },
    style: { modern: 2, traditional: 2, natural: 2 },
    notes: {
      slip: "Top wet slip-resistance class in industry testing; broom across the walking direction",
      freezeThaw: "The standard exterior finish for air-entrained concrete in freeze-thaw areas",
      heat: "Gray concrete stays moderate in sun, but the texture can feel harsh barefoot",
      upkeep: "Optional penetrating sealer; the grooves trap some dirt",
      cost: "The baseline price for poured concrete",
    },
    avoid: [],
    warn: [{ surfaces: ["pool-deck"], reason: "A medium broom texture can be harsh on bare feet; ask for a light broom near the water" }],
    materialHref: "/materials/broom-finish",
    sources: [S.unsw, S.nrmca, S.cnBroom, S.slabcalc],
  },
  {
    id: "light-broom",
    name: "Light broom finish",
    scores: { slip: 4, freezeThaw: 4, heat: 4, upkeep: 4, cost: 5 },
    style: { modern: 3, traditional: 2, natural: 2 },
    notes: {
      slip: "Good wet grip, slightly less than a medium broom",
      freezeThaw: "Same freeze-thaw durability as any broom finish on air-entrained concrete",
      heat: "Mild texture that is comfortable underfoot; gray concrete reflects 30–50% of sunlight when new",
      upkeep: "Easy to sweep and hose off",
      cost: "Baseline poured-concrete price",
    },
    avoid: [],
    warn: [],
    materialHref: "/materials/broom-finish",
    sources: [S.unsw, S.cdSlip, S.nrmca, S.lbnl, S.slabcalc],
  },
  {
    id: "exposed-aggregate",
    name: "Exposed aggregate",
    scores: { slip: 5, freezeThaw: 3, heat: 3, upkeep: 4, cost: 3 },
    style: { modern: 3, traditional: 3, natural: 5 },
    notes: {
      slip: "Among the most slip-resistant concrete finishes when wet",
      freezeThaw: "Durable when sealed; loose stones and surface scaling are the weak points",
      heat: "Heat follows the stone color; small or polished stones are kinder to bare feet",
      upkeep: "Hides stains well; a penetrating sealer can last up to about 7–10 years",
      cost: "About $2–4 per sq ft more than broom",
    },
    avoid: [],
    warn: [
      { surfaces: ["driveway"], climates: ["freeze-thaw"], reason: "Plow and snowblower edges can catch on the exposed stones" },
      { surfaces: ["pool-deck"], reason: "Ask for small or polished stones; large exposed stones feel rough barefoot" },
    ],
    materialHref: "/materials/exposed-aggregate",
    sources: [S.unsw, S.cnPool, S.cdAgg, S.lbnl01, S.cnAggPool, S.lawnloveConcrete, S.metalAmericaAgg],
  },
  {
    id: "salt",
    name: "Salt finish",
    scores: { slip: 4, freezeThaw: 1, heat: 4, upkeep: 3, cost: 4 },
    style: { modern: 3, traditional: 3, natural: 4 },
    notes: {
      slip: "Pitted texture gives non-skid grip, a pool-contractor favorite",
      freezeThaw: "The pits hold water that freezes and can spall the surface",
      heat: "Subtle texture that is comfortable barefoot, usually in light colors",
      upkeep: "Must be sealed; the pits collect dirt",
      cost: "From about $1 per sq ft more than broom",
    },
    avoid: [{ surfaces: ["driveway", "walkway", "pool-deck"], climates: ["freeze-thaw"], reason: "Not recommended in freeze-thaw climates: water in the pits freezes and spalls" }],
    warn: [{ surfaces: ["patio"], climates: ["freeze-thaw"], reason: "Only with a waterproofing sealer in freeze-thaw areas, and no deicers" }],
    materialHref: "/materials/salt-finish",
    sources: [S.cnSalt, S.slabcalc],
  },
  {
    id: "stamped",
    name: "Stamped concrete (textured)",
    scores: { slip: 3, freezeThaw: 2, heat: 2, upkeep: 2, cost: 2 },
    style: { modern: 2, traditional: 5, natural: 5 },
    notes: {
      slip: "Grips like broom unsealed; glossy film sealers make it slick unless grit is added",
      freezeThaw: "Deicers and trapped water can whiten the sealer; no deicers the first winter",
      heat: "Usually colored, often darker, which absorbs more sun",
      upkeep: "Clean and reseal every 2–3 years",
      cost: "Several dollars per sq ft more than broom",
    },
    avoid: [],
    warn: [{ surfaces: ["pool-deck"], reason: "Use an aggressive texture, a penetrating or low-solids sealer and a grit additive near water" }],
    materialHref: "/materials/stamped-concrete",
    sources: [S.ccaa, S.cdPool, S.cnStamped, S.cdFreeze, S.solomon, S.slabcalc],
  },
  {
    id: "sandblasted",
    name: "Sandblasted (light)",
    scores: { slip: 3, freezeThaw: 3, heat: 4, upkeep: 4, cost: 3 },
    style: { modern: 4, traditional: 2, natural: 3 },
    notes: {
      slip: "Better grip than troweled concrete, but results vary",
      freezeThaw: "Removes only the surface skin; durability follows the base concrete",
      heat: "Fine texture; color shifts toward the sand and aggregate",
      upkeep: "Easy to keep clean at light depth",
      cost: "Priced as an added step, roughly $2.50–5 per sq ft",
    },
    avoid: [],
    warn: [],
    sources: [S.cdSlip, S.ccaa, S.apa],
  },
  {
    id: "smooth",
    name: "Smooth steel-troweled",
    scores: { slip: 1, freezeThaw: 2, heat: 3, upkeep: 4, cost: 5 },
    style: { modern: 5, traditional: 2, natural: 1 },
    notes: {
      slip: "Can be very slippery when wet, especially once sealed",
      freezeThaw: "The concrete industry advises against steel-troweling exterior slabs",
      heat: "Smooth underfoot; heat depends on color",
      upkeep: "The easiest surface to clean",
      cost: "About the same as broom",
    },
    avoid: [{ surfaces: ["driveway", "walkway", "patio", "pool-deck"], reason: "Too slippery when wet for outdoor surfaces" }],
    warn: [],
    sources: [S.cdSlip, S.ccaa, S.nrmca],
  },
];

/** Always-on advice shown under the ranking. */
export const GENERAL_WARNINGS = [
  "No deicers in the first winter, and never ammonium- or magnesium-based deicers on any concrete.",
  "Dark integral colors reflect about half as much sunlight as light ones, so they run noticeably hotter.",
  "Dyes are not recommended outdoors; use integral color or stain for exterior color.",
];
