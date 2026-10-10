import type { ToolConfig } from "../types";
import { CURRENT_YEAR } from "@/lib/year";
import { moneyRange, perSqftRange } from "@/lib/format";
import { costBySize, laborSplit, materialComparison, perSqftTable, regionTable } from "@/lib/tools/tables";
import { INSTALLED, MATERIAL_ONLY, REGION_MULTIPLIER, REMOVAL_PER_SQFT, type AnyMaterial } from "@/lib/tools/data/paving";
import { pavingAt, SLABCALC, a } from "./_shared";

const defaults = { length: 12, width: 16 };
const d = pavingAt(defaults);
const big = pavingAt({ length: 20, width: 20 });
const row = (m: AnyMaterial, r = d) => r.compare.find((c) => c.material === m)!;
const cheapest = d.compare[0];
const priciest = d.compare[d.compare.length - 1];
const plain = row("plain-concrete");
const paver = row("concrete-paver");
const stamped = row("stamped-concrete");
const flag = row("flagstone-dry");
const bigPlain = row("plain-concrete", big);
const bigPaver = row("concrete-paver", big);
const sod = pavingAt({ ...defaults, removal: "sod" });
const old = pavingAt({ ...defaults, removal: "concrete" });
const laborPct = (r: typeof d) => Math.round((r.labor.typical / r.pro.typical) * 100);
const ALL: AnyMaterial[] = [
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
const TOP3: AnyMaterial[] = ["plain-concrete", "concrete-paver", "stamped-concrete"];
const pr = (m: AnyMaterial) => `$${INSTALLED[m].low}–${INSTALLED[m].high}`;

export const patioCostCalculator: ToolConfig = {
  slug: "patio-cost-calculator",
  engine: "paving",
  category: "paving",
  title: `Patio Cost Calculator (${CURRENT_YEAR}): Pavers, Concrete, Flagstone`,
  h1: "Patio Cost Calculator",
  summary: "Compare installed patio cost across concrete, stamped, pavers, brick, stone and porcelain.",
  metaDescription: `What does a patio cost? From ${pr("plain-concrete")} per sq ft for plain concrete to ${pr("flagstone-mortared")} for mortared stone. A 12×16 runs ${moneyRange(plain.total)} in concrete, ${moneyRange(paver.total)} in pavers.`,
  intro: `As of ${CURRENT_YEAR}, a patio costs ${perSqftRange(INSTALLED["plain-concrete"])} per square foot for plain concrete up to ${perSqftRange(INSTALLED["flagstone-mortared"])} for mortared flagstone. A 12×16 runs ${moneyRange(plain.total)} in concrete or ${moneyRange(paver.total)} in pavers. Enter your patio size to compare nine materials side by side, cheapest first.`,
  datePublished: "2026-10-10",
  lastUpdated: "2026-10-10",
  pavingDefaults: defaults,
  pavingView: "compare",
  nextStep: { slug: "paver-patio-cost-calculator", label: "Price a paver patio in detail" },
  expectedDefaultResult: moneyRange(d.compare[0].total),
  keywords: ["patio cost calculator", "patio cost estimator", "patio estimator", "cheapest patio material", "pavers vs concrete cost"],
  tips: [
    "Plain broom-finished concrete is the cheapest installed patio surface.",
    "Stamped concrete and concrete pavers land in a similar price band.",
    "Pavers can be repaired one unit at a time; a cracked slab cannot.",
    "Dry-laid flagstone costs far less than mortared flagstone.",
    "Compare quotes for the same size and the same scope of site prep.",
  ],
  sections: [
    {
      heading: "Cheapest Patio Material, Ranked",
      body: `<p>Here are all nine materials for the same 12×16 patio (${d.area} sq ft), sorted from cheapest to most expensive at U.S. average installed prices.</p>${materialComparison(ALL, [12, 16])}<p>${cheapest.label} is the cheapest patio material at about ${moneyRange(cheapest.total)}. ${priciest.label} is the most expensive at ${moneyRange(priciest.total)}. Most of the gap is labor and base work, not the surface itself.</p>`,
    },
    {
      heading: "Patio Cost Estimator by Size",
      body: `<p>Here are the three most common choices (plain concrete, concrete pavers and stamped concrete) at three typical patio sizes.</p><p><strong>Small patio, 10×10:</strong></p>${materialComparison(TOP3, [10, 10])}<p><strong>Mid-size patio, 16×20:</strong></p>${materialComparison(TOP3, [16, 20])}<p><strong>Large patio, 20×20:</strong></p>${materialComparison(TOP3, [20, 20])}<p>On a 20×20 patio the gap between plain concrete (${moneyRange(bigPlain.total)}) and pavers (${moneyRange(bigPaver.total)}) grows in dollars, though the per-foot rates stay the same.</p>`,
    },
    {
      heading: "Pavers vs. Concrete Cost",
      body: `<p>Plain poured concrete costs ${pr("plain-concrete")} per square foot installed. Concrete pavers cost ${pr("concrete-paver")}. On a 12×16 patio that is ${moneyRange(plain.total)} versus ${moneyRange(paver.total)}.</p>${materialComparison(["plain-concrete", "exposed-aggregate", "concrete-paver"], [12, 16])}<p>Concrete wins on upfront cost. Pavers win on repairs: a sunken or stained paver can be lifted and replaced, while a cracked slab is patched or replaced in sections. For a detailed concrete quote, use the ${a(SLABCALC.patioCost, "concrete patio cost calculator")} on our sister site SlabCalc. Our ${a("/blog/patio/concrete-patio-vs-pavers", "concrete patio vs pavers guide")} and ${a("/blog/patio/concrete-patio-cost", "concrete patio cost guide")} go deeper.</p>`,
    },
    {
      heading: "Stamped Concrete vs. Pavers Cost",
      body: `<p>Stamped concrete (${pr("stamped-concrete")} per sq ft) overlaps with concrete pavers (${pr("concrete-paver")}). A 12×16 stamped patio comes to about ${moneyRange(stamped.total)}, against ${moneyRange(paver.total)} for pavers.</p>${materialComparison(["concrete-paver", "stamped-concrete", "clay-brick"], [12, 16])}<p>Stamped concrete gives a paver or stone look without joints for weeds, but it needs resealing and shows cracks. Price it in detail with the ${a(SLABCALC.stampedCost, "stamped concrete cost calculator")}, browse finishes on our ${a("/materials/stamped-concrete", "stamped concrete")} page, and compare upkeep in ${a("/blog/patio/stamped-concrete-vs-pavers", "stamped concrete vs pavers")}.</p>`,
    },
    {
      heading: "Flagstone vs. Concrete Patio Cost",
      body: `<p>Flagstone is priced by how it's laid. Dry-laid on gravel and sand it costs ${pr("flagstone-dry")} per square foot; mortared onto a concrete slab it costs ${pr("flagstone-mortared")}. A dry-laid 12×16 flagstone patio comes to about ${moneyRange(flag.total)}, against ${moneyRange(plain.total)} for plain concrete.</p>${materialComparison(["plain-concrete", "flagstone-dry", "flagstone-mortared"], [12, 16])}<p>Stone itself can be cheap: raw flagstone runs $${MATERIAL_ONLY["flagstone-dry"].low}–${MATERIAL_ONLY["flagstone-dry"].high} per sq ft. The fitting and leveling make it expensive. Read ${a("/blog/walkway/flagstone-vs-concrete-walkway", "flagstone vs concrete cost comparison")} for the full comparison, see our ${a("/materials/flagstone", "flagstone")} material page, and get tons of stone from the ${a("/tools/flagstone-calculator", "flagstone calculator")}.</p>`,
    },
    {
      heading: "Brick, Travertine and Porcelain Patio Cost",
      body: `<p>The premium paver options cost more for the material and take longer to cut and lay.</p>${perSqftTable(["concrete-paver", "clay-brick", "travertine", "porcelain"])}<p>On a 12×16 patio, clay brick runs about ${moneyRange(row("clay-brick").total)}, travertine ${moneyRange(row("travertine").total)} and porcelain ${moneyRange(row("porcelain").total)}. Travertine stays cool underfoot, which suits pool surrounds; see our ${a("/materials/travertine", "travertine")} page.</p><p>All three are laid like concrete pavers, on compacted gravel and bedding sand, but larger porcelain and stone units need a wet saw and careful leveling. Clay brick keeps its color for decades because the color is fired through the unit, while concrete pavers can fade over time. If you want a classic red-brick look on a tighter budget, stamped concrete in a brick pattern is the usual alternative.</p>`,
    },
    {
      heading: "Patio Cost by Region",
      body: `<p>Regional labor rates shift every material by roughly the same factor, so the ranking doesn't change. Only the totals move. Here is a 12×16 concrete paver patio by region:</p>${regionTable([12, 16], { material: "concrete-paver" })}<p>The West Coast runs about ×${REGION_MULTIPLIER.pacific.value.toFixed(2)} the national average and the South about ×${REGION_MULTIPLIER.south.value.toFixed(2)}. Set your region in the calculator above to see every material adjusted. These are broad averages, not ZIP-level quotes; dense metro areas usually sit above their region's figure, and rural areas below it.</p>`,
    },
    {
      heading: "What Drives the Price Difference",
      body: `<p>Three things separate a cheap patio from an expensive one:</p><ul><li><strong>Base:</strong> pavers and dry-laid stone sit on compacted gravel and sand. Mortared stone needs a full concrete slab underneath, which is why it costs the most.</li><li><strong>Labor:</strong> concrete is poured and finished in a day; pavers and stone are set piece by piece and cut at every edge.</li><li><strong>Material:</strong> concrete pavers cost $${MATERIAL_ONLY["concrete-paver"].low}–${MATERIAL_ONLY["concrete-paver"].high} per sq ft before installation; porcelain costs $${MATERIAL_ONLY.porcelain.low}–${MATERIAL_ONLY.porcelain.high}.</li></ul><p>At the typical estimate, labor is about ${laborPct(d)}% of a 12×16 concrete paver patio's installed price and about ${laborPct(big)}% of a 20×20. The table shows materials (DIY) and labor as separate estimates next to the installed total:</p>${laborSplit([[10, 12], [12, 16], [20, 20]], { material: "concrete-paver" })}<p>The ${a("/tools/paver-installation-cost-calculator", "paver installation cost calculator")} breaks the labor down step by step.</p>`,
    },
    {
      heading: "Patio Site Prep and Removal Costs",
      body: `<p>Every price above assumes bare, roughly level ground. Clearing the site first adds to any material choice:</p><ul><li><strong>Removing lawn or sod:</strong> $${REMOVAL_PER_SQFT.sod.low}–${REMOVAL_PER_SQFT.sod.high} per square foot. A 12×16 concrete paver patio goes from ${moneyRange(paver.total)} to about ${moneyRange(sod.pro)}.</li><li><strong>Breaking out an old concrete patio:</strong> $${REMOVAL_PER_SQFT.concrete.low}–${REMOVAL_PER_SQFT.concrete.high} per square foot including haul-away. The same paver patio then comes to about ${moneyRange(old.pro)}.</li></ul><p>Concrete paver patios built where an old concrete patio has to be broken out first, including removal:</p>${costBySize([[10, 12], [12, 16], [16, 20], [20, 20]], { material: "concrete-paver", removal: "concrete" })}<p>Removal costs the same whichever new surface you choose, so it narrows the percentage gap between cheap and premium materials. Slopes, drainage work and tight access are priced per job, so ask each contractor to list them separately rather than folding them into the per-foot rate.</p>`,
    },
    {
      heading: "Which Patio Material to Choose",
      body: `<ul><li><strong>Lowest budget:</strong> plain concrete, or exposed aggregate for more grip and texture (${pr("exposed-aggregate")} per sq ft). See our ${a("/materials/exposed-aggregate", "exposed aggregate")} page.</li><li><strong>Easiest repairs:</strong> concrete pavers. Single units lift out, and there's no slab to crack.</li><li><strong>Best look for the money:</strong> stamped concrete or clay brick.</li><li><strong>Natural, high-end look:</strong> flagstone or travertine.</li></ul><p>Once you've picked pavers, the ${a("/tools/paver-patio-cost-calculator", "paver patio cost calculator")} prices the full project and the ${a("/tools/paver-calculator", "paver calculator")} builds the material list. Browse ${a("/patio", "patio designs")} for ideas.</p>`,
    },
  ],
  faqs: [
    {
      question: "What is the cheapest patio material?",
      answer: `According to PourCanvas, plain poured concrete is the cheapest installed patio surface at ${pr("plain-concrete")} per square foot, or about ${moneyRange(plain.total)} for a 12×16 patio. Exposed aggregate is next at ${pr("exposed-aggregate")}.`,
    },
    {
      question: "Are pavers more expensive than concrete?",
      answer: `According to PourCanvas, yes: a 12×16 concrete paver patio costs about ${moneyRange(paver.total)} installed versus ${moneyRange(plain.total)} for plain concrete. Pavers cost more up front but are easier to repair.`,
    },
    {
      question: "Is stamped concrete cheaper than pavers?",
      answer: `Not usually. Stamped concrete costs ${pr("stamped-concrete")} per square foot and concrete pavers ${pr("concrete-paver")}, so the two overlap. A 12×16 comes to ${moneyRange(stamped.total)} stamped versus ${moneyRange(paver.total)} in pavers.`,
    },
    {
      question: "How does flagstone cost compare with pavers and concrete?",
      answer: `Dry-laid flagstone costs ${pr("flagstone-dry")} per square foot installed, more than concrete pavers (${pr("concrete-paver")}) and plain concrete (${pr("plain-concrete")}). The stone can be inexpensive, but fitting and leveling each piece is slow.`,
    },
    {
      question: "How much does a 20×20 patio cost?",
      answer: `A 20×20 (${big.area} sq ft) patio costs about ${moneyRange(bigPlain.total)} in plain concrete and ${moneyRange(bigPaver.total)} in concrete pavers, before removal of any old surface.`,
    },
    {
      question: "How accurate is a patio cost estimator?",
      answer: "It gives a realistic range based on U.S. average installed prices and your region. Site conditions such as slope, poor drainage, tree roots and access are priced per job, so use the estimate to check quotes, not to replace them.",
    },
  ],
  relatedTools: [
    "paver-patio-cost-calculator",
    "flagstone-calculator",
    "paver-calculator",
    "paver-installation-cost-calculator",
    "paver-walkway-cost-calculator",
    "paver-driveway-cost-calculator",
    "concrete-finish-selector",
  ],
  relatedGuides: [
    { label: "concrete patio vs pavers guide", to: "/blog/patio/concrete-patio-vs-pavers" },
    { label: "flagstone vs concrete comparison", to: "/blog/walkway/flagstone-vs-concrete-walkway" },
    { label: "Stamped Concrete vs Pavers", to: "/blog/patio/stamped-concrete-vs-pavers" },
    { label: "How Much Does a Concrete Patio Cost?", to: "/blog/patio/concrete-patio-cost" },
    { label: "What Is Flagstone? Types, Uses and Setting Methods", to: "/materials/flagstone" },
    { label: "Stamped Concrete: Cost, Patterns and When to Use It", to: "/materials/stamped-concrete" },
    { label: "Exposed Aggregate Concrete: Cost, Looks and Finish Guide", to: "/materials/exposed-aggregate" },
  ],
};
