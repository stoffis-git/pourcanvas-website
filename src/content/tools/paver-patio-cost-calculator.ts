import type { ToolConfig } from "../types";
import { CURRENT_YEAR } from "@/lib/year";
import { moneyRange, perSqftRange, money, num } from "@/lib/format";
import { costBySize, laborSplit, materialComparison, perSqftTable, regionTable } from "@/lib/tools/tables";
import {
  BASE_BAG_PRICE,
  BASE_DEPTH_IN,
  BEDDING_SAND_IN,
  COMPACTOR_RENTAL_PER_DAY,
  CURVED_EXTRA_WASTE,
  DELIVERY_FLAT,
  DRIVEWAY_MULTIPLIER,
  EDGING_PRICE_PER_LF,
  GRAVEL_PRICE_PER_TON,
  INSTALLED,
  MATERIAL_ONLY,
  PATTERN_LABELS,
  PATTERN_WASTE,
  POLY_BAG_PRICE,
  REMOVAL_PER_SQFT,
  SAND_BAG_PRICE,
  SAND_PRICE_PER_TON,
  type Pattern,
  type Range,
} from "@/lib/tools/data/paving";
import { pavingAt, SLABCALC, a } from "./_shared";

const defaults = { length: 12, width: 16, material: "concrete-paver" as const };
const d = pavingAt(defaults);
const big = pavingAt({ ...defaults, length: 20, width: 20 });
const brick = pavingAt({ ...defaults, material: "clay-brick" });
const sod = pavingAt({ ...defaults, removal: "sod" });
const old = pavingAt({ ...defaults, removal: "concrete" });
const drive = pavingAt({ ...defaults, length: 20, width: 24, use: "driveway" });
const cp = INSTALLED["concrete-paver"];
const laborPct = (r: typeof d) => Math.round((r.labor.typical / r.pro.typical) * 100);
const mul = (r: Range, k: number): Range => ({ low: r.low * k, typical: r.typical * k, high: r.high * k });
const plus = (a: Range, b: Range): Range => ({ low: a.low + b.low, typical: a.typical + b.typical, high: a.high + b.high });
const htmlTable = (head: string[], rows: string[][]) =>
  `<table><thead><tr>${head.map((h) => `<th>${h}</th>`).join("")}</tr></thead><tbody>${rows
    .map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join("")}</tr>`)
    .join("")}</tbody></table>`;
const patterns: Pattern[] = ["running-bond", "basketweave", "random", "herringbone"];
const byPattern = patterns.map((p) => [p, pavingAt({ ...defaults, pattern: p })] as const);
const herring = byPattern[3][1];
const perSqftSizes = [[10, 12], [12, 16], [20, 20]].map(([l, w]) => [l, w, pavingAt({ ...defaults, length: l, width: w })] as const);
const diyRows: [string, Range][] = [
  [`Concrete pavers (${num(d.area)} sq ft + ${Math.round(d.wastePct * 100)}% for cuts)`, mul(MATERIAL_ONLY["concrete-paver"], d.area * (1 + d.wastePct))],
  [`Gravel base (${d.baseTons} tons, delivered)`, plus(mul(GRAVEL_PRICE_PER_TON, d.baseTons), DELIVERY_FLAT)],
  [`Bedding sand (${d.sandTons} tons)`, mul(SAND_PRICE_PER_TON, d.sandTons)],
  [`Polymeric sand (${d.polyBags} bags)`, mul(POLY_BAG_PRICE, d.polyBags)],
  [`Edge restraint (${d.edgeLF} linear ft)`, mul(EDGING_PRICE_PER_LF, d.edgeLF)],
  ["Plate compactor rental (1 day)", COMPACTOR_RENTAL_PER_DAY],
];

export const paverPatioCostCalculator: ToolConfig = {
  slug: "paver-patio-cost-calculator",
  engine: "paving",
  category: "paving",
  title: `Paver Patio Cost Calculator (${CURRENT_YEAR}): ${perSqftRange(d.proPerSqft)} per Sq Ft`,
  h1: "Paver Patio Cost Calculator",
  summary: "Installed cost, materials vs labor and a full material list for any paver patio.",
  metaDescription: `How much does a paver patio cost? ${perSqftRange(d.proPerSqft)} per sq ft installed: about ${moneyRange(d.pro)} for a 12×16 and ${moneyRange(big.pro)} for a 20×20. Labor, materials and base included.`,
  intro: `As of ${CURRENT_YEAR}, a paver patio costs ${perSqftRange(d.proPerSqft)} per square foot installed with concrete pavers. A 12×16 patio runs ${moneyRange(d.pro)}; a 20×20 runs ${moneyRange(big.pro)}. Enter your size and material to get the installed cost, the materials-vs-labor split and the full material list.`,
  datePublished: "2026-10-10",
  lastUpdated: "2026-10-10",
  pavingDefaults: defaults,
  pavingView: "cost",
  nextStep: { slug: "paver-calculator", label: "Get the exact material list" },
  expectedDefaultResult: moneyRange(d.pro),
  keywords: ["paver patio cost calculator", "estimate paver patio cost", "cost calculator for paver patio", "patio paving cost calculator", "paver patio cost"],
  tips: [
    `On a 12×16 concrete paver patio, labor is about ${laborPct(d)}% of the typical installed price.`,
    `Herringbone adds ${Math.round(PATTERN_WASTE.herringbone * 100)}% extra pavers for cuts, curved edges another ${Math.round(CURVED_EXTRA_WASTE * 100)}%.`,
    `Removing an old concrete slab adds ${perSqftRange(REMOVAL_PER_SQFT.concrete)} per square foot.`,
    `Clay or freeze-thaw soil needs about ${BASE_DEPTH_IN.poorSoilExtra.value} extra inches of base.`,
    "Get at least three quotes and compare them on the same square footage.",
  ],
  sections: [
    {
      heading: "Paver Patio Cost by Size",
      body: `<p>Size drives the total more than anything else. These are installed prices for concrete pavers on a prepared, level site at the U.S. average rate of ${perSqftRange(d.proPerSqft)} per square foot.</p>${costBySize([[10, 10], [10, 12], [12, 12], [12, 16], [14, 20], [16, 20], [20, 20], [20, 30]], defaults)}<p>The calculator uses a flat national rate per square foot. Real quotes for very small patios often carry a minimum charge, because a crew's setup, delivery and equipment costs don't shrink with the area.</p>`,
    },
    {
      heading: "Cost by Paver Material",
      body: `<p>Concrete pavers are the budget option. Clay brick, travertine and porcelain cost more for the material itself and often take longer to cut and lay. Flagstone is priced by laying method: dry-laid on gravel and sand, or mortared onto a concrete slab.</p>${perSqftTable(["concrete-paver", "clay-brick", "travertine", "porcelain", "flagstone-dry", "flagstone-mortared"])}<p>On a 12×16 patio, switching from concrete pavers to clay brick moves the installed estimate from ${moneyRange(d.pro)} to ${moneyRange(brick.pro)}. For stone, use the ${a("/tools/flagstone-calculator", "flagstone calculator")}, which also gives you tons of stone to order.</p>`,
    },
    {
      heading: "How Much of a Paver Patio Is Labor?",
      body: `<p>A paver patio is labor-heavy: excavation, base compaction in lifts, screeding sand, laying, cutting and sweeping joint sand. At the typical estimate, labor is about ${laborPct(d)}% of a 12×16 concrete paver patio and about ${laborPct(big)}% of a 20×20. The table shows materials (what you would pay doing it yourself) and the labor estimate as separate ranges, next to the installed total.</p>${laborSplit([[10, 12], [12, 16], [20, 20]], defaults)}<p>If you plan to do it yourself, the materials column is your budget, plus a saw rental (the plate compactor rental is already included). The ${a("/tools/paver-installation-cost-calculator", "paver installation cost calculator")} breaks labor down further.</p>`,
    },
    {
      heading: "Pavers vs. Concrete vs. Flagstone: Same Patio, Different Price",
      body: `<p>For the same 12×16 patio, here is what each common surface costs installed. Poured concrete is cheaper up front; pavers cost more but can be repaired one unit at a time and don't crack as a slab.</p>${materialComparison(["plain-concrete", "exposed-aggregate", "concrete-paver", "stamped-concrete", "clay-brick", "flagstone-dry"], [12, 16])}<p>Compare every option side by side with your own size in the ${a("/tools/patio-cost-calculator", "patio cost calculator")}. For poured concrete pricing in detail, our sister site has a ${a(SLABCALC.patioCost, "concrete patio cost calculator")}. Our ${a("/blog/patio/concrete-patio-vs-pavers", "concrete patio vs pavers guide")} covers durability and upkeep.</p>`,
    },
    {
      heading: "Paver Patio Cost by Region",
      body: `<p>Labor rates move the total most from region to region. These multipliers shift the whole estimate; they are broad averages, not ZIP-level quotes.</p>${regionTable([12, 16], defaults)}`,
    },
    {
      heading: "Site Prep and Removal Costs",
      body: `<p>The base price assumes bare, roughly level ground. Two common add-ons change the total:</p><ul><li><strong>Removing lawn or sod:</strong> a 12×16 patio goes from ${moneyRange(d.pro)} to about ${moneyRange(sod.pro)}.</li><li><strong>Breaking out an old concrete slab:</strong> the same patio comes to about ${moneyRange(old.pro)}, including haul-away.</li></ul><p>Slopes that need retaining edges, poor drainage that needs a drain line, and difficult access (no way to get a skid steer in) are priced per job, so ask contractors to list them separately.</p>`,
    },
    {
      heading: "What's Included in a Paver Patio Quote",
      body: `<p>A complete quote should list each of these. If one is missing, ask, because it is either included silently or will show up later as an extra:</p><ul><li>Excavation to depth (base plus bedding sand plus paver thickness) and haul-away of soil</li><li>Geotextile fabric where soil is soft or clay</li><li>${d.baseInches} inches of compacted gravel base (about ${d.baseTons} tons for 12×16)</li><li>${BEDDING_SAND_IN.value} inch of bedding sand (about ${d.sandTons} tons)</li><li>Pavers plus ${Math.round(d.wastePct * 100)}% or more for cuts</li><li>Edge restraint (${d.edgeLF} linear feet around a 12×16)</li><li>Polymeric joint sand (${d.polyBags} bags of 50 lb)</li><li>Cleanup, and optionally sealing</li></ul>`,
    },
    {
      heading: "Paver Driveway vs. Patio Cost",
      body: `<p>Driveways need ${BASE_DEPTH_IN.driveway.value} inches of base instead of ${BASE_DEPTH_IN.patio.value} and thicker pavers, which raises the installed rate by about ${Math.round((DRIVEWAY_MULTIPLIER.pavers.value - 1) * 100)}%. A 20×24 two-car paver driveway comes to roughly ${moneyRange(drive.pro)}. Compare that with poured concrete using the ${a(SLABCALC.driveCost, "concrete driveway cost calculator")} on SlabCalc.</p>`,
    },
    {
      heading: "How to Lower the Cost",
      body: `<ul><li><strong>Pick standard concrete pavers</strong> in a running bond pattern: the least waste and the fastest to lay.</li><li><strong>Keep the shape rectangular.</strong> Curves add cutting time and ${Math.round(CURVED_EXTRA_WASTE * 100)}% more waste.</li><li><strong>Schedule off-season.</strong> Late fall and early spring quotes are often lower.</li><li><strong>Do the demolition yourself</strong> if you can rent a jackhammer and haul the debris.</li><li><strong>Skip sealing at install.</strong> New pavers can be sealed later, once efflorescence has cleared.</li></ul><p>Browse ${a("/patio", "patio designs")} for layouts that work with standard paver sizes.</p>`,
    },
    {
      heading: "Paver Patio Cost by Pattern",
      body: `<p>The laying pattern changes how many pavers you buy, because diagonal and interlocking layouts need more cuts at the edges. The installed estimate in the calculator uses one flat rate per square foot, so the table shows where the pattern shows up first: the waste allowance, the number of 6×9 pavers and the materials bill for a 12×16 patio.</p>${htmlTable(
        ["Pattern", "Extra for cuts", "Pavers to buy", "Materials (DIY, typical)"],
        byPattern.map(([p, r]) => [PATTERN_LABELS[p], `${Math.round(r.wastePct * 100)}%`, num(r.paverCount), money(r.materials.typical)]),
      )}<p>Herringbone needs ${num(herring.paverCount - d.paverCount)} more pavers than running bond on the same patio, and every edge piece is an angled cut, so contractors usually quote it higher on labor too. Running bond is the cheapest pattern to buy and to lay. Get the exact count for your size and pattern with the ${a("/tools/paver-calculator", "paver calculator")}, and see how a patterned paver patio compares with the stamped look in our ${a("/blog/patio/stamped-concrete-vs-pavers", "stamped concrete vs pavers comparison")}.</p>`,
    },
    {
      heading: "Paver Patio Cost per Square Foot Explained",
      body: `<p>The national installed range of ${perSqftRange(d.proPerSqft)} per square foot for concrete pavers covers everything a contractor supplies: excavation, base, sand, pavers, edging, joint sand and the crew. It does not include removing an old surface. The split between materials and labor shifts with size, because a crew's setup and a fixed delivery charge are spread over more square feet on a larger patio.</p>${htmlTable(
        ["Size", "Installed per sq ft", "Materials per sq ft", "Labor per sq ft"],
        perSqftSizes.map(([l, w, r]) => [`${l} × ${w} ft`, perSqftRange(r.proPerSqft), perSqftRange(mul(r.materials, 1 / r.area)), perSqftRange(mul(r.labor, 1 / r.area))]),
      )}<p>Quotes at the low end usually mean basic gray pavers, easy access and a flat, well-drained site. Quotes near the top of the range come with premium or thicker pavers, extra base for soft soil and a lot of cutting. Our ${a("/methodology", "methodology page")} lists the sources behind these rates, and the ${a("/materials/concrete-pavers", "concrete pavers guide")} compares paver styles and finishes.</p>`,
    },
    {
      heading: "DIY Paver Patio Cost",
      body: `<p>Doing it yourself removes the labor line, about ${laborPct(d)}% of the typical installed price. For a 12×16 patio with concrete pavers, the DIY estimate comes to ${moneyRange(d.diy)}, compared with ${moneyRange(d.pro)} installed. That figure includes a one-day plate compactor rental, which you need to compact the base in lifts. Here is what goes into it:</p>${htmlTable(
        ["Item", "Cost range"],
        [...diyRows.map(([label, r]) => [label, moneyRange(r)]), ["DIY total", moneyRange(d.diy)]],
      )}<p>Where a bulk delivery is impractical, bagged base and sand from a home center work too; this patio needs ${num(d.baseBags)} bags of base at ${perSqftRange(BASE_BAG_PRICE)} each and ${num(d.sandBags)} bags of sand at ${perSqftRange(SAND_BAG_PRICE)} each. Not included above: a saw for cuts, a sod cutter if you are removing lawn, and your own time. Size each layer with the ${a("/tools/paver-base-calculator", "paver base calculator")}, the ${a("/tools/paver-sand-calculator", "paver sand calculator")} and the ${a("/tools/polymeric-sand-calculator", "polymeric sand calculator")}.</p>`,
    },
  ],
  faqs: [
    {
      question: "How much does a 12×16 paver patio cost?",
      answer: `According to PourCanvas, a 12×16 (192 sq ft) concrete paver patio costs about ${moneyRange(d.pro)} installed, or ${perSqftRange(d.proPerSqft)} per square foot. The typical estimate is ${money(d.pro.typical)}. Clay brick raises it to about ${moneyRange(brick.pro)}.`,
    },
    {
      question: "How much does a 20×20 paver patio cost?",
      answer: `A 20×20 (400 sq ft) concrete paver patio costs about ${moneyRange(big.pro)} installed at ${cp.low}–${cp.high} dollars per square foot, before removal of any old surface.`,
    },
    {
      question: "Is a paver patio cheaper than concrete?",
      answer: `No. A plain poured concrete patio costs about $${INSTALLED["plain-concrete"].low}–${INSTALLED["plain-concrete"].high} per square foot installed, versus $${cp.low}–${cp.high} for concrete pavers. Pavers cost more up front but are easier to repair and don't crack as a single slab. Stamped concrete ($${INSTALLED["stamped-concrete"].low}–${INSTALLED["stamped-concrete"].high}) overlaps with paver pricing.`,
    },
    {
      question: "How much of a paver patio cost is labor?",
      answer: `According to PourCanvas, about ${laborPct(d)}% on a 12×16 concrete paver patio: at the typical estimate, labor, equipment and overhead come to ${money(d.labor.typical)} of ${money(d.pro.typical)}, and materials make up the rest. On a 20×20 the labor share is about ${laborPct(big)}%.`,
    },
    {
      question: "What is the cheapest paver for a patio?",
      answer: `Standard concrete pavers (for example 6×9 inch) laid in a running bond are the cheapest option, at about $${cp.low}–${cp.high} per square foot installed. They also waste the least material because the pattern needs few cuts.`,
    },
    {
      question: "Does a paver patio add value to a home?",
      answer: "A well-built patio adds usable outdoor space buyers notice, but it rarely returns its full cost at sale. Build it for how you'll use it, and keep the design simple and in proportion to the house.",
    },
  ],
  relatedTools: [
    "paver-calculator",
    "paver-installation-cost-calculator",
    "patio-cost-calculator",
    "paver-base-calculator",
    "polymeric-sand-calculator",
    "flagstone-calculator",
    "paver-walkway-cost-calculator",
    "paver-driveway-cost-calculator",
  ],
  relatedGuides: [
    { label: "concrete patio vs pavers guide", to: "/blog/patio/concrete-patio-vs-pavers" },
    { label: "stamped concrete vs pavers comparison", to: "/blog/patio/stamped-concrete-vs-pavers" },
    { label: "Concrete Pavers: Cost, Styles and Installation", to: "/materials/concrete-pavers" },
    { label: "Concrete Patio Ideas", to: "/blog/patio/concrete-patio-ideas" },
    { label: "Complete Concrete Patio Guide", to: "/guides/concrete-patio" },
    { label: "Patio design ideas", to: "/patio" },
  ],
};
