// Upkeep, lifespan, thickness and stamped-design data for lifetime cost comparisons (stamped concrete vs pavers).
// Same pattern as ./paving.ts: every number carries its sources; /methodology renders this file.
// Verified 2026-11-19 by fetching each page (HomeAdvisor/HomeGuide/Angi via a real browser session).
// Status "pending" = editorial planning allowance with no published figure.
import type { Source, SourcedRange, SourcedValue } from "./paving";

const S = {
  haStampedTiers: { label: "HomeAdvisor: stamped concrete patio cost (design tiers, thickness, lifespan)", url: "https://www.homeadvisor.com/cost/patios-and-walkways/stamped-concrete-patio-install/", date: "2026-06-19" },
  hgStamped: { label: "HomeGuide: stamped concrete patio cost (tiers, sealing, lifespan)", url: "https://homeguide.com/costs/stamped-concrete-patio-cost", date: "2025-12-23" },
  cnStampedCost: { label: "Concrete Network: stamped concrete cost", url: "https://www.concretenetwork.com/stamped-concrete/cost.html", date: "2026-01-26" },
  fixrStamped: { label: "Fixr: stamped concrete patio cost", url: "https://www.fixr.com/costs/lay-stamped-concrete-patio", date: "2025-01-31" },
  lsStamped: { label: "LawnStarter: stamped concrete price", url: "https://www.lawnstarter.com/blog/cost/stamped-concrete-price/", date: "2026-10-19" },
  cnResealing: { label: "Concrete Network: resealing concrete", url: "https://www.concretenetwork.com/concrete/maintaining/resealing.html", date: "2026" },
  cnStampedSealing: { label: "Concrete Network: sealing stamped concrete", url: "https://www.concretenetwork.com/stamped-concrete/sealing.html", date: "2026" },
  angiPatioRepair: { label: "Angi: patio repair cost (resealing, paver and stamped repair)", url: "https://www.angi.com/articles/patio-repair-cost.htm", date: "2026-09-16" },
  cnVsPavers: { label: "Concrete Network: stamped concrete vs pavers", url: "https://www.concretenetwork.com/stamped-concrete/vs-pavers.html", date: "2026" },
  hgDrivewayRepair: { label: "HomeGuide: driveway repair cost (crack filling, paver releveling)", url: "https://homeguide.com/costs/driveway-repair-cost", date: "2025-12-22" },
  thDrivewayRepair: { label: "Today's Homeowner: concrete driveway repair cost", url: "https://todayshomeowner.com/concrete/cost/concrete-driveway-repair-cost/", date: "2025-04-04" },
  fixrPatioRepair: { label: "Fixr: patio repair cost (cracks, pavers, stamped)", url: "https://www.fixr.com/costs/patio-repair", date: "2025-01-31" },
  angiSunken: { label: "Angi: how to fix sunken pavers", url: "https://www.angi.com/articles/how-to-fix-sunken-pavers.htm", date: "2026-04-05" },
  hgSealPavers: { label: "HomeGuide: cost to seal pavers", url: "https://homeguide.com/costs/cost-to-seal-pavers", date: "2024-08-16" },
  angiSealPavers: { label: "Angi: cost to clean and seal pavers", url: "https://www.angi.com/articles/how-much-pressure-wash-and-reapply-sand-paver-patio.htm", date: "2026-10-06" },
  westernInterlockSeal: { label: "Western Interlock: can I seal my pavers?", url: "https://westerninterlock.com/can-i-seal-my-pavers/", date: "2025-10" },
  unilockSeal: { label: "Unilock: 9 tips for paver sealing success", url: "https://unilock.com/maintenance/9-tips-for-paver-sealing-success/", date: "2026" },
  gatorSealer: { label: "Alliance Gator: paver and stone sealers FAQ", url: "https://alliancegator.com/faq/gator-paver-and-stone-sealers/", date: "2026" },
  unilockPoly: { label: "Unilock: polymeric sand", url: "https://unilock.com/material-choices/polymeric-sand/", date: "2026" },
  breen: { label: "Patrick Breen Masonry: stamped concrete vs pavers (joint re-sanding price)", url: "https://www.patrickbreenstampedconcrete.com/blog/stamped-concrete-vs-pavers", date: "2026-02-20" },
  beeGreen: { label: "Bee Green Outdoor Living: stamped concrete vs pavers (polymeric sand refresh)", url: "https://groundsdesign.com/stamped-concrete-vs-pavers/", date: "2026-03-17" },
  usecalcpro: { label: "UseCalcPro: stamped concrete vs pavers cost (joint sand refresh)", url: "https://usecalcpro.com/blog/stamped-concrete-vs-pavers-cost-2026", date: "2026-11-18" },
  angiVsPavers: { label: "Angi: why choose pavers over stamped concrete", url: "https://www.angi.com/articles/why-choose-pavers-over-stamped-concrete.htm", date: "2026-07-09" },
  lsPaverPatio: { label: "LawnStarter: paver patio price (lifespan)", url: "https://www.lawnstarter.com/blog/cost/paver-patio-price/", date: "2026-11-03" },
  belgardLife: { label: "Belgard Commercial: paver life span (ICPI, EPA)", url: "https://www.belgardcommercial.com/?p=3706", date: "2026" },
  cmhaThickness: { label: "CMHA Tech Note PAV-TEC-010-22: paver thickness", url: "https://rochestercp.com/resources/cmha-tech-notes/PAV-TEC-010-22.pdf", date: "2022-03" },
  belgardClassic: { label: "Belgard Classic Standard paver (60 mm residential vehicular)", url: "https://www.belgard.com/products/pavers/classic-standard/", date: "2026" },
  cnDriveway: { label: "Concrete Network: concrete driveway basics (thickness, reinforcement)", url: "https://www.concretenetwork.com/concrete/concrete_driveways/basics.html", date: "2026-03-12" },
} satisfies Record<string, Source>;

export const LIFETIME_SOURCES: Source[] = Object.values(S);

/** Longest horizon the running-total table and break-even search cover. */
export const LIFETIME_MAX_YEARS = 30;

export type Climate = "mild" | "freeze-thaw";
export type StampedDesign = "basic" | "standard" | "custom";

export const STAMPED_DESIGN_LABELS: Record<StampedDesign, string> = {
  basic: "Basic",
  standard: "Mid-range",
  custom: "Custom",
};

export const STAMPED_DESIGN_HINTS: Record<StampedDesign, string> = {
  basic: "Basic stamped: one pattern, uniform color, no border.",
  standard: "Mid-range stamped: two or more colors, a second pattern or a custom border.",
  custom: "Custom stamped: layered colors, hand-carved or hand-tooled detail, complex borders.",
};

/** Installed stamped concrete per sq ft by design complexity (patio, national). Nests inside INSTALLED["stamped-concrete"]. */
export const STAMPED_TIER: Record<StampedDesign, SourcedRange> = {
  basic: {
    low: 8, typical: 10, high: 12, status: "verified",
    sources: [S.haStampedTiers, S.hgStamped, S.fixrStamped, S.lsStamped, S.cnStampedCost],
    note: "HomeAdvisor: basic design using simple stamps $8–12; HomeGuide $8–13; Concrete Network $10–14.",
  },
  standard: {
    low: 12, typical: 15, high: 18, status: "verified",
    sources: [S.haStampedTiers, S.hgStamped, S.fixrStamped, S.lsStamped, S.cnStampedCost],
    note: "HomeAdvisor: added border with a different pattern $12–18; HomeGuide (2+ colors, custom border) $13–19.",
  },
  custom: {
    low: 18, typical: 23, high: 28, status: "verified",
    sources: [S.haStampedTiers, S.hgStamped, S.fixrStamped, S.lsStamped, S.cnStampedCost],
    note: "HomeAdvisor: complex designs with hand-tooled accents $18–28; Fixr $18–30; HomeGuide $19–26+.",
  },
};

/** Professional clean + reseal of stamped concrete, per sq ft. */
export const STAMPED_RESEAL_PER_SQFT: SourcedRange = {
  low: 1, typical: 2, high: 3.5, status: "verified",
  sources: [S.cnResealing, S.hgStamped, S.angiPatioRepair],
  note: "Concrete Network $1.50–3.50+, HomeGuide $1–3, Angi $1.35–2.50.",
};
export const STAMPED_RESEAL_YEARS: Record<Climate, SourcedValue> = {
  mild: { value: 3, sources: [S.hgStamped, S.lsStamped, S.cnStampedSealing], status: "verified", note: "Guides say every 2–3 years (HomeGuide, LawnStarter) or 2–5 years (Concrete Network)." },
  "freeze-thaw": { value: 2, sources: [S.cnResealing, S.hgStamped], status: "verified", note: "Concrete Network: every 2–3 years where freeze-thaw and deicers are harsh; we use the short end." },
};
/** One crack-repair visit on stamped concrete: seal the crack, patch and recolor the area around it. */
export const STAMPED_CRACK_REPAIR_JOB: SourcedRange = {
  low: 150, typical: 400, high: 1000, status: "verified",
  sources: [S.fixrPatioRepair, S.hgDrivewayRepair, S.thDrivewayRepair, S.angiPatioRepair],
  note: "Crack sealing $100–300 per crack (Fixr) with $100–250 minimums (HomeGuide); stamped patching $6–20 per sq ft of affected area (Angi, Fixr). Color rarely matches exactly.",
};
export const STAMPED_CRACK_REPAIR_YEARS: Record<Climate, SourcedValue> = {
  mild: { value: 15, sources: [], status: "pending", note: "Planning allowance: one repair visit every 15 years. No source publishes a crack frequency." },
  "freeze-thaw": { value: 10, sources: [], status: "pending", note: "Planning allowance: one repair visit every 10 years. No source publishes a crack frequency." },
};

/** Professional joint re-sanding with polymeric sand, per sq ft. No national cost guide prices it alone. */
export const PAVER_RESAND_PER_SQFT: SourcedRange = {
  low: 0.5, typical: 1.25, high: 2, status: "verified",
  sources: [S.breen, S.beeGreen, S.usecalcpro],
  note: "Contractor-published prices: $0.50–1 (Patrick Breen), $1–2 (Bee Green, UseCalcPro).",
};
export const PAVER_RESAND_YEARS: Record<Climate, SourcedValue> = {
  mild: { value: 5, sources: [S.unilockPoly, S.usecalcpro, S.beeGreen], status: "verified", note: "Polymeric sand lasts several years (Unilock); refresh every 3–5 (UseCalcPro) or 5–8 years (Bee Green)." },
  "freeze-thaw": { value: 3, sources: [S.cnVsPavers, S.usecalcpro], status: "verified", note: "Concrete Network: replenish joint sand every 2 or 3 years depending on weather." },
};
/** Professional clean + re-sand + seal bundle for pavers, per sq ft (optional upkeep; replaces plain re-sanding when chosen). */
export const PAVER_SEAL_PER_SQFT: SourcedRange = {
  low: 1.5, typical: 2.25, high: 3.25, status: "verified",
  sources: [S.hgSealPavers, S.angiSealPavers, S.westernInterlockSeal],
  note: "HomeGuide $1.50–3.25 including washing and refilling joints; Angi $1–3 (average $2); Western Interlock $0.75–2.50.",
};
export const PAVER_SEAL_YEARS: Record<Climate, SourcedValue> = {
  mild: { value: 4, sources: [S.unilockSeal, S.hgSealPavers, S.gatorSealer], status: "verified", note: "Reseal every 3–5 years (Unilock, HomeGuide); 2–5 years (Alliance Gator)." },
  "freeze-thaw": { value: 3, sources: [S.unilockSeal, S.gatorSealer], status: "verified", note: "Short end of the 3–5 year range; Alliance Gator recommends every 3 years." },
};
/** Professional lift-and-relevel of sunken pavers, per sq ft of affected area. */
export const PAVER_RELEVEL_PER_SQFT: SourcedRange = {
  low: 5, typical: 10, high: 20, status: "verified",
  sources: [S.angiSunken, S.hgDrivewayRepair, S.angiPatioRepair, S.fixrPatioRepair],
  note: "Angi $5–25, HomeGuide $6–12 for large areas, Fixr and Angi $7–30 for paver repair.",
};
export const PAVER_RELEVEL_YEARS: SourcedValue = { value: 10, sources: [], status: "pending", note: "Planning allowance: one releveling visit per decade." };
export const PAVER_RELEVEL_SHARE: Record<Climate, SourcedValue> = {
  mild: { value: 0.05, sources: [], status: "pending", note: "Planning allowance: 5% of the area per visit. No source publishes a settling rate." },
  "freeze-thaw": { value: 0.1, sources: [], status: "pending", note: "Planning allowance: 10% of the area per visit (frost heave). No source publishes a settling rate." },
};

export const LIFESPAN_YEARS: Record<"stamped" | "pavers", SourcedRange> = {
  stamped: { low: 25, typical: 30, high: 50, status: "verified", sources: [S.angiVsPavers, S.haStampedTiers, S.hgStamped, S.fixrStamped, S.cnVsPavers], note: "About 25 years (Angi, HomeAdvisor, Fixr); 25–50 (HomeGuide); 30+ when maintained (Concrete Network)." },
  pavers: { low: 25, typical: 40, high: 50, status: "verified", sources: [S.angiVsPavers, S.lsPaverPatio, S.belgardLife, S.cnVsPavers], note: "25–50 years (LawnStarter); 50+ (Angi); over 30 (ICPI/EPA via Belgard)." },
};

/** Typical stamped slab thickness, inches. */
export const STAMPED_SLAB_IN: Record<"patio" | "driveway", SourcedValue> = {
  patio: { value: 4, sources: [S.haStampedTiers, S.fixrStamped], status: "verified" },
  driveway: { value: 5, sources: [S.cnDriveway, S.haStampedTiers, S.fixrStamped], status: "verified", note: "4 in minimum, 5–6 in typical; wire mesh at 4–5 in, rebar at 5 in and up (Concrete Network). Going from 4 to 5 in adds about 20%." },
};

/** Paver thickness, mm. CMHA recommends 60 mm for patios and residential driveways; 80 mm for heavier vehicular traffic. */
export const PAVER_THICKNESS: Record<"patio" | "driveway" | "heavy", SourcedValue> = {
  patio: { value: 60, sources: [S.cmhaThickness, S.belgardClassic], status: "verified" },
  driveway: { value: 60, sources: [S.cmhaThickness, S.belgardClassic], status: "verified", note: "60 mm is rated for residential driveways." },
  heavy: { value: 80, sources: [S.cmhaThickness], status: "verified", note: "Pavements with heavier vehicular traffic." },
};
