// Pool deck resurfacing numbers. Same SourcedRange pattern as data/paving.ts; /methodology renders this file.
// Tear-out + new concrete reuses INSTALLED["plain-concrete"] and REMOVAL_PER_SQFT.concrete from data/paving.ts.
import type { Source, SourcedRange, SourcedValue } from "./paving";
import { FINISH_SOURCES } from "./finish";

/** Reuse the finish selector's reflectance sources (LBNL, Solomon Colors) instead of duplicating them. */
const finishSource = (url: string): Source => FINISH_SOURCES.find((s) => s.url === url)!;
const LBNL = finishSource("https://heatisland.lbl.gov/coolscience/cool-pavements");
const SOLOMON = finishSource("https://www.solomoncolors.com/tech-docs/pdf/solomon/Integral-Color-SRI-Values.pdf");

const S = {
  homeguideDeck: { label: "HomeGuide: pool deck resurfacing cost", url: "https://homeguide.com/costs/pool-deck-resurfacing-cost", date: "2026-11" },
  homeguideCoping: { label: "HomeGuide: pool coping cost", url: "https://homeguide.com/costs/pool-coping-cost", date: "2026-11" },
  homeguideTravertine: { label: "HomeGuide: travertine pavers cost (pool deck row, thin overlay pavers)", url: "https://homeguide.com/costs/travertine-pavers-cost", date: "2026-11" },
  homeguidePavers: { label: "HomeGuide: pavers cost per square foot (around pool)", url: "https://homeguide.com/costs/pavers-cost-per-square-foot", date: "2026-11" },
  angiResurfacing: { label: "Angi: concrete resurfacing cost (pool deck rows)", url: "https://www.angi.com/articles/concrete-resurfacing-cost.htm", date: "2026-10-08" },
  angiPaint: { label: "Angi: cost to paint a pool deck", url: "https://www.angi.com/articles/cost-to-paint-pool-deck.htm", date: "2026-10-30" },
  angiSealing: { label: "Angi: concrete sealing cost", url: "https://www.angi.com/articles/how-much-does-concrete-sealing-cost.htm", date: "2026-10-20" },
  cnResurfacing: { label: "Concrete Network: pool deck resurfacing guide (coating comparison table)", url: "https://www.concretenetwork.com/concrete/pool_decks/resurfacing.html", date: "2026-09-25" },
  cnPoolDeckCost: { label: "Concrete Network: concrete pool deck cost", url: "https://www.concretenetwork.com/concrete/pool_decks/cost.html", date: "2026-02-13" },
  skin: { label: "SKIN Microplaster: pool deck resurfacing cost by material", url: "https://www.skinmicroplaster.com/blog/pool-deck-resurfacing-cost/", date: "2026-05-27" },
  beltway: { label: "Beltway Pools: pool deck resurfacing cost (DC metro)", url: "https://www.beltwaypools.com/articles/pool-deck-resurfacing-cost-options/", date: "2026-11-02" },
  fixrDeck: { label: "Fixr: pool deck cost (rubber, coping)", url: "https://www.fixr.com/costs/pool-deck", date: "2026-11" },
  fixrPatioRepair: { label: "Fixr: patio repair cost (cracks, leveling)", url: "https://www.fixr.com/costs/patio-repair", date: "2025-01-31" },
  ctvegas: { label: "Concrete Texturing (Las Vegas): pool deck resurfacing cost guide", url: "https://ctvegas.com/pool-deck-resurfacing-cost-guide-what-to-expect-in-2025/", date: "2024-12-06" },
  encore: { label: "Encore Coatings: Cool Pool deck coating kit", url: "https://encorecoatings.com/product/new-cool-pool-deck-coating/", date: "2026-11" },
  calpool: { label: "Cal Pool: concrete pool decks", url: "https://www.calpool.com/pool-decking/concrete-decks/", date: "2026-11" },
  recapHbs: { label: "HBS Dealer: Quikrete Re-Cap launch (coverage, walk-on time)", url: "https://www.hbsdealer.com/products/quikrete-launches-re-cap-concrete-resurfacer/", date: "2026-11" },
  zionTimeline: { label: "Zion Outdoors: pool deck resurfacing cost (timeline)", url: "https://zionoutdoors.com/pool-deck-resurfacing-cost-2025/", date: "2025-08-28" },
  homeguideSeason: { label: "HomeGuide: pool deck resurfacing cost (saving tips)", url: "https://homeguide.com/costs/pool-deck-resurfacing-cost", date: "2026-11" },
  angiSeason: { label: "Angi: concrete resurfacing cost (off-season, sealing after about a month)", url: "https://www.angi.com/articles/concrete-resurfacing-cost.htm", date: "2026-10-08" },
  recapAce: { label: "Ace Hardware: Quikrete Re-Cap 40 lb", url: "https://www.acehardware.com/p/1004330", date: "2026-11" },
} satisfies Record<string, Source>;

export const POOL_DECK_SOURCES = S;

export type DeckMethod = "reseal" | "paint" | "resurfacer" | "spray" | "stamped" | "rubber" | "pavers" | "travertine" | "replace";

export const DECK_METHODS: DeckMethod[] = ["reseal", "paint", "resurfacer", "spray", "stamped", "rubber", "pavers", "travertine", "replace"];

export const DECK_METHOD_LABELS: Record<DeckMethod, string> = {
  reseal: "Clean and reseal",
  paint: "Pool deck paint / epoxy coating",
  resurfacer: "Concrete resurfacer (microtopping)",
  spray: "Cool deck / spray-knockdown texture",
  stamped: "Stamped concrete overlay",
  rubber: "Rubberized coating",
  pavers: "Concrete pavers over the slab",
  travertine: "Travertine pavers over the slab",
  replace: "Tear out + new concrete",
};

/** Installed (pro) cost per sq ft over an existing concrete deck, national average. `replace` is derived in the engine. */
export const DECK_PRO: Record<Exclude<DeckMethod, "replace">, SourcedRange> = {
  reseal: { low: 1, typical: 1.75, high: 3, sources: [S.homeguideDeck, S.angiSealing], status: "verified", note: "Pressure wash plus one sealer coat. Stripping an old sealer adds $1–3 per sq ft (Angi)." },
  paint: { low: 4, typical: 6, high: 8.5, sources: [S.angiPaint, S.homeguideDeck], status: "verified", note: "Angi: $4–8.50 to paint a concrete pool deck with epoxy paint; HomeGuide: epoxy $4–10." },
  resurfacer: { low: 3, typical: 5, high: 7, sources: [S.angiResurfacing, S.homeguideDeck, S.skin, S.cnResurfacing], status: "verified", note: "Angi: basic pool deck $2,250–3,750 for 750 sq ft, microtopping $3–7; HomeGuide basic $3–6; SKIN overlay $3–6." },
  spray: { low: 4, typical: 7, high: 12, sources: [S.homeguideDeck, S.skin, S.cnPoolDeckCost, S.beltway], status: "verified", note: "HomeGuide: Kool Deck coat $4–6; SKIN cool deck $6–12; Concrete Network decorative overlays $6–12+; Beltway overlay incl. cool-deck coatings $6–14 (DC metro)." },
  stamped: { low: 8, typical: 13, high: 20, sources: [S.angiResurfacing, S.homeguideDeck, S.skin], status: "verified", note: "Angi: stamped pool deck overlay $6,000–15,000 for 750 sq ft; HomeGuide $7–20; SKIN $8–15." },
  rubber: { low: 8, typical: 11, high: 14, sources: [S.skin, S.fixrDeck, S.ctvegas], status: "verified" },
  pavers: { low: 12, typical: 18, high: 25, sources: [S.homeguidePavers, S.cnPoolDeckCost], status: "verified", note: "HomeGuide: pavers around a pool $12–25 installed; Concrete Network: $12–45 as a pool deck. No source prices overlays separately; the slab saves excavation and base but thin pavers need a bonded bed, so we do not discount." },
  travertine: { low: 13, typical: 20, high: 30, sources: [S.homeguideTravertine, S.beltway], status: "verified", note: "HomeGuide: travertine pool deck $5,200–30,000 for 400–1,000 sq ft; 1/2 in overlay pavers $5–10 plus $8–15 labor. Beltway's $35–55 (DC metro) includes a new base." },
};

/** Expected service life in years before the next resurfacing (with normal resealing). */
export const DECK_LIFESPAN: Record<DeckMethod, SourcedRange> = {
  reseal: { low: 2, typical: 2.5, high: 3, sources: [S.cnResurfacing, S.homeguideTravertine], status: "verified", note: "Reseal every 2–3 years." },
  paint: { low: 1, typical: 3, high: 5, sources: [S.cnResurfacing, S.angiPaint], status: "verified", note: "Concrete Network: paint 1–5 years; Angi: acrylic needs recoating every couple of years." },
  resurfacer: { low: 5, typical: 8, high: 12, sources: [S.cnResurfacing, S.beltway], status: "verified", note: "Concrete Network: microtopping 5–10 years; Beltway: overlay 8–12 years." },
  spray: { low: 10, typical: 12, high: 15, sources: [S.cnResurfacing, S.skin], status: "verified" },
  stamped: { low: 10, typical: 15, high: 25, sources: [S.cnResurfacing, S.skin], status: "verified", note: "Concrete Network 10–15; SKIN 15–25." },
  rubber: { low: 10, typical: 13, high: 20, sources: [S.cnResurfacing, S.skin, S.ctvegas], status: "verified" },
  pavers: { low: 20, typical: 30, high: 40, sources: [S.beltway, S.skin, S.homeguidePavers], status: "verified", note: "Beltway 25–40; SKIN 20+; HomeGuide interlocking pavers up to 30." },
  travertine: { low: 20, typical: 35, high: 50, sources: [S.beltway, S.skin], status: "verified", note: "Beltway 30–50+; SKIN 20+." },
  replace: { low: 20, typical: 30, high: 40, sources: [S.calpool, S.cnPoolDeckCost], status: "verified", note: "Cal Pool: 20+ years maintained, 30+ claimed; Concrete Network: can last a lifetime when sealed and maintained." },
};

/** DIY material cost per sq ft (methods a homeowner can realistically apply). */
export const DECK_DIY: Partial<Record<DeckMethod, SourcedRange>> = {
  reseal: { low: 0.1, typical: 0.4, high: 0.75, sources: [S.angiSealing], status: "verified", note: "Sealer only; add a pressure-washer rental." },
  paint: { low: 0.3, typical: 1, high: 2, sources: [S.angiPaint], status: "verified", note: "Derived: acrylic $30–100 and epoxy $100–200 per gallon, about 100 sq ft per gallon in two coats." },
  spray: { low: 1.25, typical: 1.5, high: 2, sources: [S.encore], status: "verified", note: "Encore kit $259 finishes up to 200 sq ft in two coats, plus a gallon of tint paint, cleaner and sealer." },
  resurfacer: { low: 0.5, typical: 0.9, high: 1.2, sources: [S.recapHbs, S.recapAce], status: "pending", note: "Estimate. Coverage verified (HBS Dealer: 40 sq ft per 40 lb bag at 1/8 in, 80 sq ft as a skim coat); the $36–46 bag price is from retailer search snippets because retail pages block automated fetches." },
};

/** Short labels for selects (full labels don't fit the two-column form). */
export const DECK_METHOD_SHORT: Record<DeckMethod, string> = {
  reseal: "Clean + reseal",
  paint: "Paint / epoxy",
  resurfacer: "Resurfacer",
  spray: "Cool deck texture",
  stamped: "Stamped overlay",
  rubber: "Rubberized coating",
  pavers: "Pavers over slab",
  travertine: "Travertine over slab",
  replace: "Tear out + new",
};

/** Solar reflectance (share of sunlight reflected), concrete surfaces with integral color; gray = new gray-cement concrete. */
export type DeckColor = "white" | "buff" | "gray" | "dark";

export const SOLAR_REFLECTANCE: Record<DeckColor, SourcedRange & { label: string }> = {
  white: { label: "White or pale tint", low: 0.52, typical: 0.55, high: 0.59, sources: [SOLOMON], status: "verified" },
  buff: { label: "Sand or buff", low: 0.37, typical: 0.4, high: 0.42, sources: [SOLOMON], status: "verified" },
  gray: { label: "New gray concrete", low: 0.3, typical: 0.4, high: 0.5, sources: [LBNL], status: "verified", note: "Falls to 0.20–0.35 as it ages and gets dirty." },
  dark: { label: "Charcoal or slate", low: 0.15, typical: 0.18, high: 0.22, sources: [SOLOMON], status: "verified" },
};

/** Days on site for a typical resurfacing job (coatings and overlays). */
export const DECK_JOB_DAYS: SourcedRange = { low: 2, typical: 3, high: 4, sources: [S.zionTimeline, S.skin], status: "verified", note: "Zion Outdoors: 2–3 days for a straightforward job, up to about two weeks for large custom work; SKIN: 2–4 days." };

/** Walk-on time for a cement resurfacer (Quikrete Re-Cap); drive-on 24 h. */
export const RESURFACER_WALK_ON_HOURS: SourcedValue = { value: 8, sources: [S.recapHbs], status: "verified" };

/** Seasonal and scope savings (qualitative): book off-season, keep patterns simple, resurface only what needs it. */
export const SAVING_SOURCES: Source[] = [S.homeguideSeason, S.angiSeason];

export type DeckCondition = "sound" | "minor" | "major";

export const DECK_CONDITION_LABELS: Record<DeckCondition, string> = {
  sound: "Sound (faded, stained, worn)",
  minor: "Hairline cracks or small chips",
  major: "Wide cracks, heaving or sinking",
};

/** Lump-sum repair before resurfacing, per deck. */
export const CRACK_REPAIR: Record<Exclude<DeckCondition, "sound">, SourcedRange> = {
  minor: { low: 250, typical: 500, high: 800, sources: [S.angiResurfacing, S.fixrPatioRepair], status: "verified", note: "Angi: minor surface cracks $250–800; Fixr: $100–300 per patio crack." },
  major: { low: 500, typical: 2000, high: 4500, sources: [S.angiResurfacing, S.fixrPatioRepair], status: "verified", note: "Angi: larger cracks $200–1,000 plus spalling $300–3,500. Leveling a settled slab is extra: $3–6 per sq ft (Fixr, HomeGuide)." },
};

/** Remove and replace pool coping, per linear foot installed. */
export const COPING_PER_LF: SourcedRange = {
  low: 40,
  typical: 60,
  high: 100,
  sources: [S.homeguideCoping, S.fixrDeck, S.beltway],
  status: "verified",
  note: "HomeGuide $40–80 (concrete low, stone high); Fixr $40–50; Beltway $50–160 in the DC metro.",
};

export type HeatSlip = { heat: string; slip: string };

/** Qualitative heat and wet-grip notes (Concrete Network coating table, HomeGuide coping/travertine notes). */
export const DECK_HEAT_SLIP: Record<DeckMethod, HeatSlip> = {
  reseal: { heat: "Unchanged", slip: "Film sealers cut grip; add grit" },
  paint: { heat: "Follows the color", slip: "Low to moderate; needs grit" },
  resurfacer: { heat: "Follows the color", slip: "Moderate; broom or texture it" },
  spray: { heat: "Coolest (light, textured)", slip: "High" },
  stamped: { heat: "Follows the color", slip: "Moderate; grit in the sealer" },
  rubber: { heat: "Moderate", slip: "High; soft underfoot" },
  pavers: { heat: "Follows the color", slip: "Good with textured pavers" },
  travertine: { heat: "Stays cool (light stone)", slip: "Good if tumbled, not polished" },
  replace: { heat: "Follows the finish", slip: "High with a broom finish" },
};

export const HEAT_SLIP_SOURCES: Source[] = [S.cnResurfacing, S.homeguideTravertine, S.homeguideCoping];
