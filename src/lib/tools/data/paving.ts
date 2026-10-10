// Single source of truth for every paving number on the site.
// Each constant carries its sources; /methodology renders this file.
// Status "pending" = taken from a search snippet or derived, must be verified (see _planning/refactor-2026-10/tool-specs/paving.md).

export interface Source {
  label: string;
  url: string;
  date: string;
}

export interface Range {
  low: number;
  typical: number;
  high: number;
}

export interface SourcedRange extends Range {
  sources: Source[];
  status: "verified" | "pending";
  note?: string;
}

export interface SourcedValue {
  value: number;
  sources: Source[];
  status: "verified" | "pending";
  note?: string;
}

const S = {
  costmyyard: { label: "CostMyYard paver patio cost calculator", url: "https://costmyyard.com/calculators/paver-patio-cost/", date: "2026-09" },
  homeadvisor: { label: "HomeAdvisor: brick paver patio cost", url: "https://www.homeadvisor.com/cost/outdoor-living/install-a-brick-paver-patio", date: "2026-06-17" },
  lawnlovePavers: { label: "Lawn Love: paver patio cost", url: "https://lawnlove.com/blog/paver-patio-cost/", date: "2025-12-27" },
  lawnloveConcrete: { label: "Lawn Love: concrete patio cost", url: "https://lawnlove.com/blog/concrete-patio-cost/", date: "2026-10-05" },
  homewyse: { label: "Homewyse: brick paver patio cost", url: "https://www.homewyse.com/services/cost_to_install_brick_paver_patio.html", date: "2026-05" },
  brickyard: { label: "The Brickyard: flagstone patio cost", url: "https://www.thebrickyardwi.com/feeds/blog/flagstone-patio-cost", date: "2026-03-25" },
  stonorama: { label: "Stonorama: travertine pavers cost guide", url: "https://www.stonorama.com/blogs/news/travertine-pavers-cost-guide", date: "2026-06-28" },
  todayshomeowner: { label: "Today's Homeowner: cost to pour a concrete patio", url: "https://todayshomeowner.com/concrete/cost/cost-to-pour-a-concrete-patio/", date: "2025-03-18" },
  haWalkway: { label: "HomeAdvisor: patio and walkway costs", url: "https://www.homeadvisor.com/cost/patios-and-walkways/", date: "2026-06-17" },
  haConcretePatio: { label: "HomeAdvisor: concrete patio cost", url: "https://www.homeadvisor.com/cost/patios-and-walkways/install-concrete-patio/", date: "2026-06-17" },
  haConcreteDriveway: { label: "HomeAdvisor: concrete driveway cost", url: "https://www.homeadvisor.com/cost/garages/install-a-concrete-driveway/", date: "2026-06-20" },
  haStamped: { label: "HomeAdvisor: stamped concrete patio cost", url: "https://www.homeadvisor.com/cost/patios-and-walkways/stamped-concrete-patio-install/", date: "2026-06-19" },
  haFlagstone: { label: "HomeAdvisor: flagstone patio cost", url: "https://www.homeadvisor.com/cost/outdoor-living/install-flagstone-patio/", date: "2026-06-20" },
  haFlagstonePrices: { label: "HomeAdvisor: flagstone prices", url: "https://www.homeadvisor.com/cost/outdoor-living/flagstone-prices-install-costs", date: "2026-06-20" },
  haPaverDriveway: { label: "HomeAdvisor: paver driveway cost", url: "https://www.homeadvisor.com/cost/garages/install-driveway-pavers/", date: "2026-06" },
  lawnstarterPatio: { label: "LawnStarter: paver patio price", url: "https://www.lawnstarter.com/blog/cost/paver-patio-price/", date: "2024-12-02" },
  lawnstarterDriveway: { label: "LawnStarter: paver driveway price", url: "https://www.lawnstarter.com/blog/cost/paver-driveway-price/", date: "2025-12-27" },
  costToRenovate: { label: "Cost to Renovate: patio installation", url: "https://www.costtorenovate.com/projects/exterior/patio-installation/", date: "2026-03" },
  cnStampedCost: { label: "Concrete Network: stamped concrete cost", url: "https://www.concretenetwork.com/stamped-concrete/cost.html", date: "2026-01-26" },
  cnPrices: { label: "Concrete Network: concrete prices", url: "https://www.concretenetwork.com/concrete-prices.html", date: "2026-07-14" },
  minimalModern: { label: "Minimal and Modern: paver installation cost", url: "https://www.minimalandmodern.com/paver-installation-cost-per-square-foot-a-complete-guide/", date: "2026-05-05" },
  lawnMasters: { label: "Lawn Masters: flagstone prices", url: "https://lawnmasters.com/costs/flagstone-prices", date: "2026-07-08" },
  homewyseTravertine: { label: "Homewyse: travertine pavers cost", url: "https://www.homewyse.com/services/cost_to_install_travertine_pavers.html", date: "2026-05" },
  homewyseFlagstone: { label: "Homewyse: flagstone patio cost", url: "https://www.homewyse.com/services/cost_to_install_flagstone_patio.html", date: "2026-05" },
  homewyseAggregate: { label: "Homewyse: exposed aggregate patio cost", url: "https://www.homewyse.com/services/cost_to_install_exposed_aggregate_patio.html", date: "2026-05" },
  ntPavers: { label: "NT Pavers: porcelain pavers cost", url: "https://ntpavers.com/how-much-do-porcelain-pavers-cost/", date: "2026-09-08" },
  pavingstoneSupply: { label: "Pavingstone Supply: concrete paver price list", url: "https://pavingstonesupply.com/concretepricing/", date: "2026-08-10" },
  sslandscape: { label: "South Shore Landscape Supply: Pine Hall clay paver", url: "https://sslandscapesupply.com/product/brick-pine-hall-paver/", date: "2026-10" },
  travertineMart: { label: "Travertine Mart: travertine pavers", url: "https://travertinemart.com/products-page/travertine-pavers", date: "2026-10" },
  floorlife: { label: "Floorlife: MSI Arterra porcelain pavers", url: "https://floorlife.com/collections/msi-arterra-porcelain-pavers-coping", date: "2026-10" },
  slabcalcPatio: { label: "SlabCalc concrete patio cost calculator", url: "https://www.slabcalc.co/calculators/concrete-patio-cost-calculator", date: "2026-09-25" },
  slabcalcStamped: { label: "SlabCalc stamped concrete cost calculator", url: "https://www.slabcalc.co/calculators/stamped-concrete-cost-calculator", date: "2026-09-28" },
  slabcalcFinish: { label: "SlabCalc finish type cost estimator", url: "https://www.slabcalc.co/calculators/finish-type-cost-estimator", date: "2026-09-28" },
  dodAcf: { label: "DoD Area Cost Factors (USACE PAX 3.2.1)", url: "https://usace.contentdm.oclc.org/digital/api/collection/p16021coll8/id/4495/download", date: "2024-03-29" },
  blsOews: { label: "BLS OEWS May 2025: construction laborers, cement masons, landscaping workers (by state)", url: "https://www.bls.gov/oes/", date: "2025-05" },
  icpi: { label: "ICPI Tech Spec 2: Construction of Interlocking Concrete Pavements", url: "https://www.orco.com/wp-content/uploads/2022/08/ICPI-TechSpec2-ORCO.pdf", date: "2020-02" },
  icpi10: { label: "ICPI Tech Spec 10: Application Guide (CMHA)", url: "https://www.cmha.org/wp-content/uploads/2023/12/TechSpec10-ApplicationGuide2022.pdf", date: "2022-03" },
  belgard: { label: "Belgard Technical Resource Guide", url: "https://www.belgard.com/wp-content/uploads/sites/2/Technical-Resource-Guide_WEB_BEL25-D-516650.pdf", date: "2025-12" },
  unilock: { label: "Unilock: base preparation do's and don'ts", url: "https://unilock.com/diy/dos-and-donts-of-paver-installation-base-preparation-23/", date: "2026" },
  toolgritCompaction: { label: "Toolgrit: aggregate compaction and ordering", url: "https://www.toolgrit.com/guides/aggregate-compaction-ordering", date: "2026-03-03" },
  smoky: { label: "Smoky Mountain Stone & Gravel: tons vs cubic yards", url: "https://smokymountainsg.com/blog/33-aggregate-tons-vs-cubic-yards", date: "2026-08-04" },
  idot: { label: "Illinois DOT: material conversion factors (aggregate base 1.80 t/yd³)", url: "https://idot.illinois.gov/content/dam/soi/en/web/idot/documents/doing-business/reports/highways/materials/mistic-pay-item-material.pdf", date: "2020-06-10" },
  homeguideSand: { label: "HomeGuide: sand delivery cost", url: "https://homeguide.com/costs/sand-delivery-cost", date: "2026-06-03" },
  gravelgenie: { label: "GravelGenie: gravel cost per ton", url: "https://gravelgenie.com/guides/gravel-cost-per-ton", date: "2026-09-25" },
  crushedStone: { label: "CrushedStoneCalculator: crushed stone cost per ton", url: "https://crushedstonecalculator.com/crushed-stone-cost-per-ton-2026/", date: "2026-05-07" },
  bulkSand: { label: "One and Done Prep: cost of bulk sand", url: "https://oneanddoneprep.com/cost-of-bulk-sand/", date: "2026-07-24" },
  polystore: { label: "PolymericSandStore price list", url: "https://polymericsandstore.com/collections/polymeric-sands", date: "2026-10" },
  liveoak: { label: "Live Oak Supply: SEK PolySweep 50 lb", url: "https://liveoaksupply.com/1175-56/", date: "2026-10" },
  gator: { label: "Alliance Gator Maxx G2 (coverage per 50 lb bag)", url: "https://alliancegator.com/gator-jointing-material/gator-maxx-g2/", date: "2025-06-02" },
  techniseal: { label: "Techniseal HP NextGel coverage (Green Builders Supply)", url: "https://www.greenbuilderssupply.com/store/p861/Techniseal_ProSeries_HP_NextGel_Polymeric_Sand.html", date: "2026-10" },
  hammondBase: { label: "Hammond Hardware: Quikrete HardScapes paver base 0.5 cu ft", url: "https://www.hammondhardware.com/p/quikrete-hardscapes-paver-base-039645117590", date: "2026-10" },
  maxSand: { label: "Max Warehouse: Quikrete paver sand 0.5 cu ft", url: "https://www.maxwarehouse.com/products/quikrete-paver-sand-50-lb", date: "2026-10" },
  mutualEdge: { label: "Mutual Materials: Snap Edge restraint", url: "https://www.mutualmaterials.com/product/edging-snap-edge-8-edge-restraint/", date: "2026-10" },
  sureloc: { label: "Sureloc Edging: landscape vs paver edging", url: "https://surelocedging.com/feeds/blog/landscape-edging-paver-edging", date: "2026-02-23" },
  edging: { label: "United Turf: paver edging cost", url: "https://www.unitedturf.co/resources/paver-edging-san-diego-why-it-matters-what-it-costs", date: "2026-07-26" },
  greenpal: { label: "GreenPal: grass removal cost", url: "https://www.yourgreenpal.com/blog/grass-removal-cost", date: "2026-02-27" },
  lawnloveGrass: { label: "Lawn Love: grass removal cost", url: "https://lawnlove.com/blog/grass-removal-cost/", date: "2025-12-27" },
  homeguideSod: { label: "HomeGuide: sod and grass removal cost", url: "https://homeguide.com/costs/sod-and-grass-removal-cost", date: "2025-10-31" },
  fixrRemoval: { label: "Fixr: concrete removal cost", url: "https://www.fixr.com/costs/concrete-removal", date: "2025-01-31" },
  lawnloveRemoval: { label: "Lawn Love: concrete removal cost", url: "https://lawnlove.com/blog/concrete-removal-cost/", date: "2025-12-27" },
  valleyCity: { label: "Valley City Supply: calculating natural landscape stone", url: "https://www.valleycitysupply.com/calculating-natural-landscape-stone", date: "2026" },
  wicki: { label: "Wicki Stone: stone weights and coverages", url: "https://wickistone.com/wp-content/uploads/2025/05/Stone-Weights-And-Coverages-By-Wicki-Stone.pdf", date: "2025-05" },
  acme: { label: "Acme Sand & Gravel: flagstone thickness and coverage", url: "https://www.acmesand.com/wp-content/uploads/2015/08/Flagstone-Thickness-Coverage-Delivery08-15.pdf", date: "2015-08" },
  calcmaterials: { label: "CalcMaterials: flagstone calculator", url: "https://calcmaterials.com/flagstone-calculator/", date: "2026" },
  earthstone: { label: "Earthstone Resources: material coverage", url: "https://earthstone.us/home-2/", date: "2026" },
  toolgritPavers: { label: "Toolgrit: brick and paver estimating guide", url: "https://www.toolgrit.com/guides/brick-paver-estimating-guide", date: "2026-03-09" },
  calcsummit: { label: "CalcSummit paver calculator (waste by pattern)", url: "https://calcsummit.com/calculators/construction/paver/", date: "2026-05" },
  wcpavers: { label: "WC Pavers: brick paver quantities", url: "https://wcpavers.com/brick-paver-quantities/", date: "2026-09-16" },
  rentd: { label: "rentd: plate compactor rental cost", url: "https://www.rentd.com/plate-compactor-rental/", date: "2026-07" },
  countbricks: { label: "CountBricks: plate compactor rental rates (Sunbelt, United Rentals, Home Depot)", url: "https://www.countbricks.com/post/plate-compactor-rental-washington-retaining-wall-construction", date: "2026-03-11" },
} satisfies Record<string, Source>;

export const SOURCES = S;

export type PavingMaterial =
  | "concrete-paver"
  | "clay-brick"
  | "flagstone-dry"
  | "flagstone-mortared"
  | "travertine"
  | "porcelain";

export type CompareMaterial = "plain-concrete" | "stamped-concrete" | "exposed-aggregate";

export type AnyMaterial = PavingMaterial | CompareMaterial;

export const MATERIAL_LABELS: Record<AnyMaterial, string> = {
  "concrete-paver": "Concrete pavers",
  "clay-brick": "Clay brick pavers",
  "flagstone-dry": "Flagstone (dry-laid)",
  "flagstone-mortared": "Flagstone (mortared)",
  travertine: "Travertine pavers",
  porcelain: "Porcelain pavers",
  "plain-concrete": "Plain concrete",
  "stamped-concrete": "Stamped concrete",
  "exposed-aggregate": "Exposed aggregate concrete",
};

/** Installed (pro) cost per sq ft, patio/walkway use, national average. */
export const INSTALLED: Record<AnyMaterial, SourcedRange> = {
  "concrete-paver": { low: 8, typical: 14, high: 22, sources: [S.haWalkway, S.homeadvisor, S.lawnstarterPatio, S.costToRenovate, S.cnStampedCost, S.minimalModern, S.lawnlovePavers], status: "verified" },
  "clay-brick": { low: 12, typical: 18, high: 26, sources: [S.homewyse, S.lawnstarterPatio, S.costmyyard], status: "verified" },
  "flagstone-dry": { low: 15, typical: 22, high: 32, sources: [S.brickyard, S.haFlagstone, S.lawnMasters, S.lawnlovePavers, S.homewyseFlagstone], status: "verified" },
  "flagstone-mortared": { low: 20, typical: 30, high: 45, sources: [S.brickyard, S.haFlagstone], status: "verified", note: "Only one source splits mortared per sq ft; HomeAdvisor's project totals put wet-laid at about 1.4–1.6× dry-laid." },
  travertine: { low: 15, typical: 20, high: 27, sources: [S.stonorama, S.homewyseTravertine, S.costToRenovate], status: "verified" },
  porcelain: { low: 16, typical: 24, high: 35, sources: [S.costToRenovate, S.ntPavers, S.costmyyard], status: "verified" },
  "plain-concrete": { low: 6, typical: 9, high: 12, sources: [S.lawnloveConcrete, S.haConcretePatio, S.haWalkway, S.cnPrices, S.slabcalcPatio], status: "verified" },
  "stamped-concrete": { low: 8, typical: 15, high: 28, sources: [S.haStamped, S.cnStampedCost, S.cnPrices, S.slabcalcStamped], status: "verified" },
  "exposed-aggregate": { low: 8, typical: 12, high: 16, sources: [S.haConcreteDriveway, S.haConcretePatio, S.slabcalcFinish, S.homewyseAggregate], status: "verified" },
};

/** Material-only cost per sq ft of surface (DIY), before waste. */
export const MATERIAL_ONLY: Record<PavingMaterial, SourcedRange> = {
  "concrete-paver": { low: 3, typical: 5, high: 8, sources: [S.pavingstoneSupply, S.homeadvisor, S.lawnlovePavers, S.minimalModern], status: "verified" },
  "clay-brick": { low: 4, typical: 7, high: 10, sources: [S.lawnlovePavers, S.pavingstoneSupply, S.sslandscape, S.minimalModern], status: "verified" },
  "flagstone-dry": { low: 2, typical: 5, high: 15, sources: [S.haFlagstonePrices, S.lawnMasters, S.brickyard], status: "verified" },
  "flagstone-mortared": { low: 2, typical: 5, high: 15, sources: [S.haFlagstonePrices, S.lawnMasters, S.brickyard], status: "verified", note: "Stone only; the slab and mortar bed are extra." },
  travertine: { low: 4, typical: 6, high: 12, sources: [S.stonorama, S.travertineMart], status: "verified" },
  porcelain: { low: 6, typical: 9, high: 15, sources: [S.ntPavers, S.floorlife], status: "verified" },
};

/** Driveway installs cost more per sq ft than patios (thicker base, heavier pavers / thicker slab). */
export const DRIVEWAY_MULTIPLIER: Record<"pavers" | "concrete", SourcedValue> = {
  pavers: { value: 1.25, sources: [S.lawnstarterPatio, S.lawnstarterDriveway, S.haWalkway, S.haPaverDriveway], status: "verified", note: "Same-publisher patio vs driveway comparisons: 1.25–1.5." },
  concrete: { value: 1.15, sources: [S.haConcretePatio, S.haConcreteDriveway, S.cnPrices, S.slabcalcStamped], status: "verified", note: "Same-publisher patio vs driveway comparisons: 1.1–1.27." },
};

export type Region = "national" | "northeast" | "pacific" | "midwest" | "south" | "mountain";

export const REGION_LABELS: Record<Region, string> = {
  national: "U.S. average",
  northeast: "Northeast",
  pacific: "Pacific / West Coast",
  midwest: "Midwest",
  south: "South",
  mountain: "Mountain / Southwest",
};

export const REGION_MULTIPLIER: Record<Region, SourcedValue> = {
  national: { value: 1, sources: [], status: "verified" },
  northeast: { value: 1.1, sources: [S.dodAcf, S.blsOews, S.costmyyard], status: "verified", note: "Big metros (NYC, Boston) run higher." },
  pacific: { value: 1.18, sources: [S.dodAcf, S.blsOews, S.costmyyard], status: "verified", note: "Contiguous CA, OR, WA; SF Bay and Seattle run higher." },
  midwest: { value: 1, sources: [S.dodAcf, S.blsOews, S.costmyyard], status: "verified" },
  south: { value: 0.9, sources: [S.dodAcf, S.blsOews, S.costmyyard], status: "verified" },
  mountain: { value: 1, sources: [S.dodAcf, S.blsOews, S.costmyyard], status: "verified" },
};

export const BASE_DEPTH_IN = {
  patio: { value: 4, sources: [S.icpi, S.icpi10, S.belgard], status: "verified", note: "ICPI minimum for patios and walks on well-drained soil." } as SourcedValue,
  driveway: { value: 8, sources: [S.icpi10, S.unilock, S.belgard], status: "verified", note: "Typical recommendation; the ICPI minimum is 6 in, Unilock recommends 8–12 in." } as SourcedValue,
  poorSoilExtra: { value: 2, sources: [S.icpi], status: "verified", note: "ICPI: 2–4 in thicker in cold climates or on wet, weak soils." } as SourcedValue,
};

export const BEDDING_SAND_IN: SourcedValue = { value: 1, sources: [S.icpi, S.belgard], status: "verified" };
export const COMPACTION_FACTOR: SourcedValue = { value: 1.2, sources: [S.toolgritCompaction, S.smoky], status: "verified", note: "Compacted volume is about 80–85% of loose." };
export const GRAVEL_TONS_PER_YD3: SourcedValue = { value: 1.5, sources: [S.idot, S.homeguideSand], status: "verified", note: "Loose crushed base; with compaction this gives about 1.8 t per compacted yd³ (Illinois DOT)." };
export const SAND_TONS_PER_YD3: SourcedValue = { value: 1.35, sources: [S.homeguideSand], status: "verified" };
export const BAG_CUFT: SourcedValue = { value: 0.5, sources: [S.hammondBase, S.maxSand], status: "verified" };

export const GRAVEL_PRICE_PER_TON: SourcedRange = { low: 20, typical: 30, high: 45, sources: [S.gravelgenie, S.crushedStone], status: "verified" };
export const SAND_PRICE_PER_TON: SourcedRange = { low: 25, typical: 35, high: 50, sources: [S.bulkSand, S.homeguideSand], status: "verified" };
export const DELIVERY_FLAT: SourcedRange = { low: 50, typical: 100, high: 150, sources: [S.homeguideSand, S.gravelgenie], status: "verified" };
export const POLY_BAG_PRICE: SourcedRange = { low: 30, typical: 50, high: 80, sources: [S.polystore, S.liveoak, S.lawnlovePavers], status: "verified" };

/** Retail 0.5 cu ft bags (pending a big-box price check: Home Depot/Lowe's block automated fetches). */
export const BASE_BAG_PRICE: SourcedRange = { low: 5, typical: 7.5, high: 10, sources: [S.hammondBase], status: "pending" };
export const SAND_BAG_PRICE: SourcedRange = { low: 4, typical: 6, high: 8, sources: [S.maxSand], status: "pending" };
/** Plate compactor rental per day (reversible plates for driveways run $130–160). */
export const COMPACTOR_RENTAL_PER_DAY: SourcedRange = { low: 60, typical: 95, high: 130, sources: [S.rentd, S.countbricks], status: "pending" };

/** Sq ft covered per 50 lb bag of polymeric sand. */
export const POLY_COVERAGE: Record<"narrow" | "wide", SourcedValue> = {
  narrow: { value: 70, sources: [S.gator, S.techniseal], status: "verified", note: "Joints 1/8–3/8 in: 65–85 sq ft per bag (Gator)." },
  wide: { value: 33, sources: [S.gator, S.techniseal], status: "verified", note: "Joints 3/4–1 1/4 in: 22–42 sq ft per bag (Gator)." },
};

export const EDGING_PRICE_PER_LF: SourcedRange = { low: 1.5, typical: 2.5, high: 4, sources: [S.mutualEdge, S.sureloc, S.edging], status: "verified" };

export const REMOVAL_PER_SQFT: Record<"sod" | "concrete", SourcedRange> = {
  sod: { low: 0.5, typical: 1, high: 2, sources: [S.greenpal, S.lawnloveGrass, S.homeguideSod], status: "verified" },
  concrete: { low: 2, typical: 4, high: 6, sources: [S.fixrRemoval, S.lawnloveRemoval, S.lawnloveConcrete], status: "verified" },
};

/** Flagstone: sq ft covered per ton, by nominal thickness (conservative so users don't under-order). */
export const FLAGSTONE_SQFT_PER_TON: Record<"1" | "1.5" | "2", SourcedValue> = {
  "1": { value: 130, sources: [S.valleyCity, S.wicki, S.acme, S.calcmaterials, S.earthstone], status: "verified", note: "Suppliers quote 115–160 sq ft per ton." },
  "1.5": { value: 90, sources: [S.valleyCity, S.wicki, S.acme, S.calcmaterials, S.earthstone], status: "verified", note: "Suppliers quote 75–125 sq ft per ton." },
  "2": { value: 80, sources: [S.valleyCity, S.wicki, S.acme, S.calcmaterials], status: "verified", note: "Suppliers quote 60–90 sq ft per ton." },
};

/** Irregular flagstone needs more allowance for fitting and cutting. */
export const FLAGSTONE_WASTE: SourcedValue = { value: 0.15, sources: [S.calcmaterials], status: "verified", note: "CalcMaterials recommends 10–20%, 15% for irregular random stone." };

export type Pattern = "running-bond" | "basketweave" | "random" | "herringbone";

export const PATTERN_LABELS: Record<Pattern, string> = {
  "running-bond": "Running / stack bond",
  basketweave: "Basketweave",
  random: "Random / ashlar",
  herringbone: "Herringbone (45°)",
};

/** Sources: Toolgrit, CalcSummit, WC Pavers, PaverCalculator.net (random/ashlar: no published figure; editorial estimate between basketweave and herringbone). */
export const PATTERN_WASTE: Record<Pattern, number> = {
  "running-bond": 0.05,
  basketweave: 0.07,
  random: 0.1,
  herringbone: 0.15,
};

export const PATTERN_WASTE_SOURCES: Source[] = [S.toolgritPavers, S.calcsummit, S.wcpavers];

export const CURVED_EXTRA_WASTE = 0.05;

export const PAVER_SIZES: { id: string; label: string; w: number; l: number }[] = [
  { id: "4x8", label: "4 × 8 in (brick)", w: 4, l: 8 },
  { id: "6x6", label: "6 × 6 in", w: 6, l: 6 },
  { id: "6x9", label: "6 × 9 in", w: 6, l: 9 },
  { id: "12x12", label: "12 × 12 in", w: 12, l: 12 },
  { id: "16x16", label: "16 × 16 in", w: 16, l: 16 },
  { id: "24x24", label: "24 × 24 in", w: 24, l: 24 },
];
