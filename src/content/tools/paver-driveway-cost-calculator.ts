import type { ToolConfig } from "../types";
import { CURRENT_YEAR } from "@/lib/year";
import { moneyRange, perSqftRange, money, num } from "@/lib/format";
import { costBySize, laborSplit, materialComparison, quantityBySize, regionTable } from "@/lib/tools/tables";
import { BASE_DEPTH_IN, DRIVEWAY_MULTIPLIER, INSTALLED, REMOVAL_PER_SQFT } from "@/lib/tools/data/paving";
import { pavingAt, SLABCALC, a } from "./_shared";

const defaults = { length: 24, width: 20, use: "driveway" as const, material: "concrete-paver" as const };
const d = pavingAt(defaults);
const single = pavingAt({ ...defaults, length: 20, width: 10 });
const big = pavingAt({ ...defaults, length: 24, width: 24 });
const patioSame = pavingAt({ ...defaults, use: "patio" });
const clay = pavingAt({ ...defaults, soil: "clay" });
const old = pavingAt({ ...defaults, removal: "concrete" });
const brick = pavingAt({ ...defaults, material: "clay-brick" });
const concrete = d.compare.find((c) => c.material === "plain-concrete")!;
const upliftPct = Math.round((DRIVEWAY_MULTIPLIER.pavers.value - 1) * 100);
const drivewayBase = BASE_DEPTH_IN.driveway.value;
const patioBase = BASE_DEPTH_IN.patio.value;
const rem = REMOVAL_PER_SQFT.concrete;
const sizes: [number, number][] = [[10, 20], [12, 24], [20, 20], [20, 24], [24, 24], [12, 50]];

export const paverDrivewayCostCalculator: ToolConfig = {
  slug: "paver-driveway-cost-calculator",
  engine: "paving",
  category: "paving",
  title: `Paver Driveway Cost Calculator (${CURRENT_YEAR}): ${perSqftRange(d.proPerSqft)}/Sq Ft`,
  h1: "Paver Driveway Cost Calculator",
  summary: "Installed cost of a paver driveway by size, material and region, with base and removal.",
  metaDescription: `How much does a paver driveway cost? ${perSqftRange(d.proPerSqft)} per sq ft installed: about ${moneyRange(single.pro)} for a 10×20 single and ${moneyRange(d.pro)} for a 20×24 double.`,
  intro: `As of ${CURRENT_YEAR}, a concrete paver driveway costs ${perSqftRange(d.proPerSqft)} per square foot installed. A 10×20 single-car driveway runs ${moneyRange(single.pro)}; a 20×24 two-car driveway runs ${moneyRange(d.pro)}. Enter your driveway size, paver material and soil to get the installed cost, base quantities and removal costs.`,
  datePublished: "2026-10-10",
  lastUpdated: "2026-10-10",
  pavingDefaults: defaults,
  pavingView: "cost",
  nextStep: { slug: "paver-base-calculator", label: "Driveway base quantities" },
  expectedDefaultResult: moneyRange(d.pro),
  keywords: ["paver driveway cost calculator", "driveway paving cost calculator", "paver driveway cost"],
  tips: [
    "Use pavers rated for vehicles, usually 80 mm thick.",
    `Plan on a ${drivewayBase} inch compacted gravel base, twice a patio's.`,
    "Clay or freeze-thaw soil needs extra base and often geotextile fabric.",
    "Herringbone patterns resist shifting under turning tires best.",
    "Ask whether removal and haul-away of the old driveway are in the quote.",
  ],
  sections: [
    {
      heading: "Paver Driveway Cost by Size",
      body: `<p>These are installed prices for concrete pavers on a driveway-grade base at the U.S. average rate of ${perSqftRange(d.proPerSqft)} per square foot. Two cars need about 20 ft of width; a single car needs 10–12 ft.</p>${costBySize(sizes, { use: "driveway" })}<p>A 24×24 double driveway runs ${moneyRange(big.pro)}, and a long 12×50 single lane costs about as much as a double because the area is similar. The ${a("/driveway", "driveway design ideas")} page shows layouts at each of these sizes.</p>`,
    },
    {
      heading: "Why a Paver Driveway Costs More Than a Patio",
      body: `<p>The same pavers cost about ${upliftPct}% more per square foot on a driveway than on a patio. Cars and delivery trucks put far more load on the surface, so a driveway needs:</p><ul><li><strong>A deeper base:</strong> ${drivewayBase} inches of compacted gravel instead of ${patioBase} inches.</li><li><strong>Thicker pavers:</strong> vehicle-rated pavers are heavier and cost more.</li><li><strong>More excavation and compaction:</strong> more soil to haul and more lifts to compact.</li></ul><p>On a 20×24 area, that is the difference between ${moneyRange(patioSame.pro)} for a patio and ${moneyRange(d.pro)} for a driveway. For patio pricing, use the ${a("/tools/paver-patio-cost-calculator", "paver patio cost calculator")}.</p>${laborSplit([[10, 20], [20, 24], [24, 24]], { use: "driveway" })}`,
    },
    {
      heading: "Paver Driveway Base Requirements",
      body: `<p>The base carries the load; the pavers mostly spread it. A driveway on well-drained soil needs ${drivewayBase} inches of compacted crushed gravel plus a 1 inch sand bed. On clay or freeze-thaw soil, add ${BASE_DEPTH_IN.poorSoilExtra.value} inches. For a 20×24 driveway that means about ${num(d.baseTons, 1)} tons of gravel on drained soil, or ${num(clay.baseTons, 1)} tons on clay.</p>${quantityBySize("base", sizes, { use: "driveway" })}<p>On clay soil the totals rise again:</p>${quantityBySize("base", [[10, 20], [20, 24], [24, 24]], { use: "driveway", soil: "clay" })}<p>Get exact gravel and sand for your soil from the ${a("/tools/paver-base-calculator", "paver base calculator")} and the ${a("/tools/paver-sand-calculator", "paver sand calculator")}.</p>`,
    },
    {
      heading: "Paver Driveway vs. Concrete Driveway Cost",
      body: `<p>Poured concrete is the cheaper driveway. Pavers cost more up front but don't crack as one slab, and a stained or sunken section can be lifted and relaid. Here is a 20×24 driveway in each surface, all at driveway rates:</p>${materialComparison(["plain-concrete", "exposed-aggregate", "concrete-paver", "stamped-concrete", "clay-brick"], [20, 24], { use: "driveway" })}<p>Plain concrete comes to about ${moneyRange(concrete.total)} versus ${moneyRange(d.pro)} for concrete pavers. The concrete rows are national ballparks for comparison only; this calculator prices pavers. Concrete pricing in detail, with thickness, finish and reinforcement, lives on our sister site's ${a(SLABCALC.driveCost, "concrete driveway cost calculator")}. Also read our ${a("/blog/driveway/concrete-driveway-cost", "concrete driveway cost guide")}.</p>`,
    },
    {
      heading: "Pavers vs. Asphalt Driveway",
      body: `<p>Asphalt is usually the lowest-cost hard surface to install, but it needs resealing every few years and softens in hot weather. Pavers cost more to install and last much longer with less upkeep; individual units can be replaced instead of patching. Asphalt also offers almost no design choice, while pavers come in many colors, shapes and patterns. Our ${a("/blog/driveway/concrete-driveway-vs-asphalt", "concrete vs asphalt driveway comparison")} covers lifespan and upkeep, and the ${a("/blog/driveway/driveway-border-ideas", "driveway border ideas")} show how a paver band can dress up an existing driveway for less.</p>`,
    },
    {
      heading: "Brick and Premium Paver Driveway Cost",
      body: `<p>Clay brick pavers raise a 20×24 driveway from ${moneyRange(d.pro)} to about ${moneyRange(brick.pro)}. Natural stone and porcelain cost more again and need careful selection: only products rated for vehicle loads belong on a driveway.</p>${costBySize([[10, 20], [20, 24], [24, 24]], { use: "driveway", material: "clay-brick" })}<p>Our ${a("/materials/concrete-pavers", "concrete pavers guide")} compares styles and sizes, and the ${a("/tools/paver-calculator", "paver calculator")} gives the exact paver count for any pattern.</p>`,
    },
    {
      heading: "Paver Driveway Cost by Region",
      body: `<p>Labor is the biggest regional variable. These multipliers apply to the whole estimate for a 20×24 driveway; they are broad averages, not ZIP-level quotes.</p>${regionTable([20, 24], defaults)}`,
    },
    {
      heading: "Cost to Remove an Old Driveway",
      body: `<p>Most paver driveways replace an old one. Breaking out and hauling away a concrete or asphalt driveway adds about $${rem.low}–${rem.high} per square foot. For a 20×24 driveway, removal alone runs ${moneyRange(old.removal)}, bringing the total to about ${moneyRange(old.pro)}.</p>${costBySize(sizes, { use: "driveway", removal: "concrete" })}<p>An old asphalt or concrete surface is not a suitable base for pavers; it has to come out so the gravel base can be built to depth. If your existing slab is sound, ${a("/blog/driveway/driveway-resurfacing", "driveway resurfacing")} may be a cheaper alternative.</p>`,
    },
    {
      heading: "What a Paver Driveway Quote Should Include",
      body: `<p>Compare quotes line by line. A complete driveway quote lists each of these; if one is missing, ask, because it will either be included silently or show up later as an extra. Quantities are for a 20×24 driveway on drained soil:</p><ul><li>Excavation to depth and haul-away of soil</li><li>Geotextile fabric where the soil is soft or clay</li><li>${drivewayBase} inches of compacted gravel base (about ${num(d.baseTons, 1)} tons)</li><li>1 inch of bedding sand (about ${num(d.sandTons, 1)} tons)</li><li>About ${num(d.paverCount)} vehicle-rated pavers, including ${Math.round(d.wastePct * 100)}% for cuts</li><li>Edge restraint (${num(d.edgeLF)} linear feet around the full perimeter)</li><li>Polymeric joint sand (${num(d.polyBags)} bags of 50 lb)</li><li>Removal of the old driveway, if any, and cleanup</li></ul>${quantityBySize("takeoff", [[10, 20], [20, 24], [24, 24]], { use: "driveway" })}`,
    },
    {
      heading: "Permeable Paver Driveways",
      body: `<p>Permeable pavers have wider joints filled with small chip stone instead of sand, and sit on a deeper, open-graded stone base that stores and drains rainwater into the soil. Some towns require or reward them where runoff is restricted. They cost more than standard pavers because of the deeper base and specialized materials, and the joints need occasional vacuuming to keep draining. Ask local installers for a quote, since this calculator prices standard pavers on a dense-graded base. For finished looks, browse ${a("/blog/driveway/driveway-edging-ideas", "driveway edging ideas")} or our ${a("/guides/concrete-driveway", "concrete driveway design guide")}.</p>`,
    },
  ],
  faqs: [
    {
      question: "How much does a paver driveway cost?",
      answer: `According to PourCanvas, a concrete paver driveway costs ${perSqftRange(d.proPerSqft)} per square foot installed. A 20×24 two-car driveway comes to about ${moneyRange(d.pro)}, with a typical estimate of ${money(d.pro.typical)}.`,
    },
    {
      question: "How much does a single-car paver driveway cost?",
      answer: `According to PourCanvas, a 10×20 single-car paver driveway costs about ${moneyRange(single.pro)} installed, before removal of any old surface.`,
    },
    {
      question: "Is a paver driveway more expensive than concrete?",
      answer: `Yes. On a 20×24 driveway, plain poured concrete costs about ${moneyRange(concrete.total)} versus ${moneyRange(d.pro)} for concrete pavers. Pavers cost more up front but can be repaired one section at a time.`,
    },
    {
      question: "How deep should the base be for a paver driveway?",
      answer: `About ${drivewayBase} inches of compacted crushed gravel on well-drained soil, plus ${BASE_DEPTH_IN.poorSoilExtra.value} inches on clay or freeze-thaw soil. A 20×24 driveway takes about ${num(d.baseTons, 1)} tons of gravel, or ${num(clay.baseTons, 1)} tons on clay.`,
    },
    {
      question: "Why do paver driveways cost more than paver patios?",
      answer: `Driveways need twice the base depth (${drivewayBase} inches vs ${patioBase}), thicker vehicle-rated pavers and more excavation, which adds about ${upliftPct}% to the installed price per square foot.`,
    },
    {
      question: "How much does it cost to tear out an old driveway?",
      answer: `About $${rem.low}–${rem.high} per square foot including haul-away, or ${moneyRange(old.removal)} for a 20×24 driveway.`,
    },
    {
      question: "What is the cheapest paver for a driveway?",
      answer: `Standard vehicle-rated concrete pavers. They run $${INSTALLED["concrete-paver"].low}–${INSTALLED["concrete-paver"].high} per square foot on a patio, and about ${upliftPct}% more on a driveway because of the heavier base and thicker units.`,
    },
  ],
  relatedTools: [
    "paver-base-calculator",
    "paver-calculator",
    "paver-patio-cost-calculator",
    "paver-installation-cost-calculator",
    "paver-sand-calculator",
    "polymeric-sand-calculator",
    "patio-cost-calculator",
    "paver-walkway-cost-calculator",
  ],
  relatedGuides: [
    { label: "concrete driveway cost guide", to: "/blog/driveway/concrete-driveway-cost" },
    { label: "concrete vs asphalt driveway comparison", to: "/blog/driveway/concrete-driveway-vs-asphalt" },
    { label: "Concrete Driveway Design Guide: Finishes, Costs & Ideas", to: "/guides/concrete-driveway" },
    { label: "Concrete Pavers vs Poured Concrete: Cost and Styles", to: "/materials/concrete-pavers" },
    { label: "Driveway Resurfacing: Concrete vs Asphalt vs Overlay", to: "/blog/driveway/driveway-resurfacing" },
    { label: "Driveway design ideas", to: "/driveway" },
  ],
};
