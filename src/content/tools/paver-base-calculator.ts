import type { ToolConfig } from "../types";
import { CURRENT_YEAR } from "@/lib/year";
import { moneyRange, num } from "@/lib/format";
import { quantityBySize } from "@/lib/tools/tables";
import { BAG_CUFT, BASE_DEPTH_IN, COMPACTION_FACTOR, DELIVERY_FLAT, GRAVEL_PRICE_PER_TON, GRAVEL_TONS_PER_YD3, type Range } from "@/lib/tools/data/paving";
import type { PavingInputs } from "@/lib/tools/paving";
import { pavingAt, SLABCALC, a } from "./_shared";

const defaults = { length: 12, width: 16, use: "patio" as const };
const d = pavingAt(defaults);
const small = pavingAt({ ...defaults, length: 10, width: 10 });
const big = pavingAt({ ...defaults, length: 20, width: 20 });
const clay = pavingAt({ ...defaults, soil: "clay" });
const drive = pavingAt({ ...defaults, length: 20, width: 24, use: "driveway" });
const walk = pavingAt({ ...defaults, length: 30, width: 4 });

const table = (head: string[], rows: string[][]) =>
  `<table><thead><tr>${head.map((h) => `<th>${h}</th>`).join("")}</tr></thead><tbody>${rows
    .map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join("")}</tr>`)
    .join("")}</tbody></table>`;

const gravelCost = (tons: number): Range => ({
  low: tons * GRAVEL_PRICE_PER_TON.low,
  typical: tons * GRAVEL_PRICE_PER_TON.typical,
  high: tons * GRAVEL_PRICE_PER_TON.high,
});
const delivered = (tons: number): Range => {
  const g = gravelCost(tons);
  return { low: g.low + DELIVERY_FLAT.low, typical: g.typical + DELIVERY_FLAT.typical, high: g.high + DELIVERY_FLAT.high };
};
const dollars = (r: Pick<Range, "low" | "high">) => `$${r.low}–${r.high}`;

const depthCombos: [string, Partial<PavingInputs>][] = [
  ["Patio or walkway, well-drained soil", { use: "patio", soil: "drained" }],
  ["Patio or walkway, clay or freeze-thaw soil", { use: "patio", soil: "clay" }],
  ["Driveway, well-drained soil", { use: "driveway", soil: "drained" }],
  ["Driveway, clay or freeze-thaw soil", { use: "driveway", soil: "clay" }],
];
const depthTable = table(
  ["Use and soil", "Base depth", "12 × 16 ft base", "12 × 16 ft bags"],
  depthCombos.map(([label, over]) => {
    const r = pavingAt({ ...defaults, ...over });
    return [label, `${r.baseInches} in`, `${num(r.baseTons, 1)} tons`, num(r.baseBags)];
  }),
);

const compactSizes: [number, number][] = [[10, 10], [12, 12], [12, 16], [16, 20], [20, 20]];
const compactTable = table(
  ["Size", "Compacted volume", "Order volume (loose)", "Order weight"],
  compactSizes.map(([l, w]) => {
    const r = pavingAt({ ...defaults, length: l, width: w });
    return [`${l} × ${w} ft`, `${num(r.baseYd3 / COMPACTION_FACTOR.value, 2)} yd³`, `${num(r.baseYd3, 2)} yd³`, `${num(r.baseTons, 1)} tons`];
  }),
);

const bulkSizes: [number, number][] = [[4, 20], [10, 10], [12, 12], [12, 16], [16, 20], [20, 20], [20, 30]];
const bagsVsBulk = table(
  ["Size", `${BAG_CUFT.value} cu ft bags`, "Bulk tons", "Bulk delivered"],
  bulkSizes.map(([l, w]) => {
    const r = pavingAt({ ...defaults, length: l, width: w });
    return [`${l} × ${w} ft`, num(r.baseBags), `${num(r.baseTons, 1)} tons`, moneyRange(delivered(r.baseTons))];
  }),
);

const costSizes: [number, number][] = [[10, 10], [12, 12], [12, 16], [16, 20], [20, 20]];
const costTable = table(
  ["Size", "Patio base (gravel only)", "Driveway base (gravel only)"],
  costSizes.map(([l, w]) => {
    const p = pavingAt({ ...defaults, length: l, width: w });
    const dr = pavingAt({ ...defaults, length: l, width: w, use: "driveway" });
    return [`${l} × ${w} ft`, `${num(p.baseTons, 1)} t · ${moneyRange(gravelCost(p.baseTons))}`, `${num(dr.baseTons, 1)} t · ${moneyRange(gravelCost(dr.baseTons))}`];
  }),
);

const materialTable = table(
  ["Material", "Use as paver base?", "Why"],
  [
    ["Crushed stone with fines (road base, crusher run, dense-graded base)", "Yes, the standard", "Angular pieces plus fines lock together when compacted"],
    ["Clean crushed stone (no fines)", "Only in permeable systems", "Drains fast but needs a matching open-graded bedding layer"],
    ["Pea gravel or river rock", "No", "Round stones roll and never compact"],
    ["Sand alone", "No", "Washes out and ruts under load"],
    ["Recycled concrete aggregate", "Often, if graded", "Compacts like crushed stone; check for debris"],
  ],
);

export const paverBaseCalculator: ToolConfig = {
  slug: "paver-base-calculator",
  engine: "paving",
  category: "paving",
  title: `Paver Base Calculator: ${num(d.baseTons, 1)} Tons for a 12×16 Patio`,
  h1: "Paver Base Calculator",
  summary: "Tons, cubic yards and bags of gravel base for any paver patio, walkway or driveway.",
  metaDescription: `How much paver base do you need? A 12×16 patio takes ${num(d.baseTons, 1)} tons (${num(d.baseBags)} bags) at ${d.baseInches} inches; a 20×20 takes ${num(big.baseTons, 1)} tons. Depth by use and soil, bags vs bulk.`,
  intro: `A 12×16 paver patio needs about ${num(d.baseTons, 1)} tons of gravel base, or ${num(d.baseYd3, 2)} cubic yards, at ${d.baseInches} inches compacted. That is ${num(d.baseBags)} bags of ${BAG_CUFT.value} cu ft. A 20×20 patio needs ${num(big.baseTons, 1)} tons. Enter your size, use and soil to get tons, cubic yards and bags of paver base.`,
  datePublished: "2026-10-10",
  lastUpdated: "2026-10-10",
  pavingDefaults: defaults,
  pavingView: "base",
  nextStep: { slug: "paver-sand-calculator", label: "Next layer: bedding sand" },
  expectedDefaultResult: `${num(d.baseTons, 1)} tons`,
  keywords: ["paver base calculator", "how much paver base do i need"],
  tips: [
    `Patios get ${BASE_DEPTH_IN.patio.value} inches of base and driveways ${BASE_DEPTH_IN.driveway.value}; add ${BASE_DEPTH_IN.poorSoilExtra.value} on clay soil.`,
    `Order ${Math.round((COMPACTION_FACTOR.value - 1) * 100)}% more loose gravel than the finished volume, because it compacts.`,
    "Use crushed stone with fines, never pea gravel or round rock.",
    "Compact in thin lifts with a plate compactor, not the full depth at once.",
    "Above a couple of tons, bulk delivery beats hauling bags.",
  ],
  sections: [
    {
      heading: "How Much Paver Base Do I Need? Base by Patio Size",
      body: `<p>Paver base is ordered by volume or weight: the area times the base depth, plus an allowance for compaction. The table assumes a ${d.baseInches}-inch compacted base for a patio on well-drained soil, converted to tons at ${GRAVEL_TONS_PER_YD3.value} tons per cubic yard.</p>${quantityBySize("base", [[10, 10], [10, 12], [12, 12], [12, 16], [14, 20], [16, 20], [20, 20], [20, 30]], defaults)}<p>Landscape yards sell crushed base by the ton or the cubic yard; home centers sell ${BAG_CUFT.value} cu ft bags. A 10×10 patio needs ${num(small.baseTons, 1)} tons, which is still ${num(small.baseBags)} bags. To count the pavers that go on top, use the ${a("/tools/paver-calculator", "paver calculator")}.</p>`,
    },
    {
      heading: "How Deep Should Paver Base Be? Depth by Use and Soil",
      body: `<p>Depth depends on the load and on the ground underneath. Foot traffic on a patio or walkway needs ${BASE_DEPTH_IN.patio.value} inches of compacted base. Cars need ${BASE_DEPTH_IN.driveway.value} inches. Clay soil, poor drainage or deep frost adds ${BASE_DEPTH_IN.poorSoilExtra.value} more inches, because wet clay loses strength and heaves when it freezes.</p>${depthTable}<p>On clay, the same 12×16 patio goes from ${num(d.baseTons, 1)} to ${num(clay.baseTons, 1)} tons. Many installers also lay a geotextile fabric over clay before the base to keep the soil from pumping up into the gravel. Dig out base depth plus the ${a("/tools/paver-sand-calculator", "bedding sand layer")} plus the paver thickness, and slope the excavation away from the house so water drains off.</p>`,
    },
    {
      heading: "Compaction Allowance: Why You Order More Than the Hole Holds",
      body: `<p>Loose crushed stone shrinks when a plate compactor shakes the fines into the gaps. The calculator multiplies the finished volume by ${COMPACTION_FACTOR.value}, so you order enough loose material to end up at full depth after compaction.</p>${compactTable}<p>Skipping the allowance is the most common reason DIY projects run short halfway through. Running short means a second delivery fee, and a base topped off later rarely compacts as evenly as one placed in a single session.</p>`,
    },
    {
      heading: "Paver Base Bags vs. Bulk Delivery",
      body: `<p>Bags are convenient for small walkways and repairs. They are easy to load in a car and need no tarp on the driveway. For a full patio, the bag count gets large fast: the default 12×16 patio is ${num(d.baseBags)} bags versus ${num(d.baseTons, 1)} tons from a yard.</p>${bagsVsBulk}<p>Bulk prices use ${dollars(GRAVEL_PRICE_PER_TON)} per ton plus a ${dollars(DELIVERY_FLAT)} delivery fee. Because the delivery fee is flat, bulk gets cheaper per ton as the job grows. On a short walkway bags can be competitive; on a patio, bulk nearly always wins on both cost and labor.</p>`,
    },
    {
      heading: "What Material to Use for Paver Base",
      body: `<p>The right base is crushed stone with fines, sold under regional names such as road base, crusher run, dense-graded aggregate or "paver base". The angular stone interlocks and the fines fill the voids, so it compacts into a hard, stable layer that still drains.</p>${materialTable}<p>Ask the yard for a base material that meets local DOT road-base specs; that grading is made to compact. If you are weighing pavers against a poured surface, our ${a("/blog/patio/concrete-patio-vs-pavers", "concrete patio vs pavers comparison")} covers the tradeoffs. Pouring a slab instead? Use the ${a(SLABCALC.slab, "concrete slab calculator")} on SlabCalc for cubic yards of concrete.</p>`,
    },
    {
      heading: "How to Compact Paver Base in Lifts",
      body: `<ul><li><strong>Compact the subgrade first.</strong> Run the plate compactor over the excavated soil before any gravel goes in.</li><li><strong>Lay fabric on soft soil.</strong> Geotextile over clay keeps the base from mixing into the subgrade.</li><li><strong>Spread base in thin lifts.</strong> A plate compactor only reaches so deep. Place a few inches, compact, then add the next lift.</li><li><strong>Moisten the gravel.</strong> Slightly damp base compacts much tighter than dry or soaked base.</li><li><strong>Make several passes.</strong> Overlap each pass and change direction until the surface no longer moves underfoot.</li><li><strong>Check slope and flatness.</strong> Use string lines and a straightedge; fix high and low spots in the base, never in the sand.</li></ul><p>A well-compacted base is what keeps pavers flat for decades. The ${a("/materials/concrete-pavers", "concrete pavers guide")} covers the rest of the build.</p>`,
    },
    {
      heading: "Paver Driveway Base Calculator",
      body: `<p>Driveways carry vehicles, so the base goes to ${BASE_DEPTH_IN.driveway.value} inches, more on clay. A 20×24 two-car paver driveway needs about ${num(drive.baseTons, 1)} tons of base, or ${num(drive.baseYd3, 2)} cubic yards.</p>${quantityBySize("base", [[10, 20], [12, 24], [16, 24], [20, 24], [24, 24]], { ...defaults, use: "driveway" })}<p>At this weight, bulk delivery and a rented heavy plate compactor or roller are the norm. For the full price of a paver driveway, see the ${a("/tools/paver-driveway-cost-calculator", "paver driveway cost calculator")}, and browse ${a("/driveway", "driveway design ideas")} for layouts.</p>`,
    },
    {
      heading: "Paver Base for Walkways",
      body: `<p>Walkways use the same ${BASE_DEPTH_IN.patio.value}-inch base as patios. Because they are long and narrow, the edges matter more: extend the base a few inches past the pavers on each side so the edge restraint sits on compacted stone.</p>${quantityBySize("base", [[3, 15], [3, 20], [4, 20], [4, 30], [4, 50]], defaults)}<p>A 4×30 walkway needs ${num(walk.baseTons, 1)} tons, or ${num(walk.baseBags)} bags. The ${a("/tools/paver-walkway-cost-calculator", "paver walkway cost calculator")} prices the whole job, and the ${a("/guides/concrete-walkway", "concrete walkway guide")} covers layout and width.</p>`,
    },
    {
      heading: "Cost of Paver Base Material",
      body: `<p>Crushed base is one of the cheaper parts of a paver project, at ${dollars(GRAVEL_PRICE_PER_TON)} per ton in ${CURRENT_YEAR}, before delivery. The table shows gravel cost only for patio and driveway depths.</p>${costTable}<p>Add ${dollars(DELIVERY_FLAT)} for delivery on bulk orders. For the default 12×16 patio, base gravel delivered comes to about ${moneyRange(delivered(d.baseTons))}. The ${a("/tools/paver-patio-cost-calculator", "paver patio cost calculator")} rolls base, sand, pavers and labor into one installed price.</p>`,
    },
  ],
  faqs: [
    {
      question: "How much paver base do I need for a 12×16 patio?",
      answer: `According to PourCanvas, a 12×16 patio needs ${num(d.baseTons, 1)} tons (${num(d.baseYd3, 2)} cubic yards) of crushed stone base at ${d.baseInches} inches compacted, or ${num(d.baseBags)} bags of ${BAG_CUFT.value} cu ft. On clay soil it needs ${num(clay.baseTons, 1)} tons.`,
    },
    {
      question: "How many bags of paver base do I need for a 10×10 patio?",
      answer: `According to PourCanvas, a 10×10 patio needs ${num(small.baseBags)} bags of ${BAG_CUFT.value} cu ft paver base, or about ${num(small.baseTons, 1)} tons in bulk, for a ${small.baseInches}-inch compacted base.`,
    },
    {
      question: "How deep should paver base be?",
      answer: `${BASE_DEPTH_IN.patio.value} inches of compacted base for patios and walkways, ${BASE_DEPTH_IN.driveway.value} inches for driveways. Add ${BASE_DEPTH_IN.poorSoilExtra.value} inches on clay, poorly drained or freeze-thaw soil.`,
    },
    {
      question: "How much paver base do I need for a driveway?",
      answer: `A 20×24 paver driveway needs about ${num(drive.baseTons, 1)} tons of base at ${drive.baseInches} inches compacted, which is ${num(drive.baseYd3, 2)} cubic yards.`,
    },
    {
      question: "How many tons are in a cubic yard of paver base?",
      answer: `The calculator uses ${GRAVEL_TONS_PER_YD3.value} tons per cubic yard for crushed stone base. The exact weight varies with the stone type and moisture, so check the yard's figure if they sell by the yard.`,
    },
    {
      question: "Can I use sand instead of paver base?",
      answer: "No. Sand alone washes out and ruts under load. Use compacted crushed stone with fines as the base, and only a thin screeded layer of sand on top as the bed for the pavers.",
    },
  ],
  relatedTools: [
    "paver-calculator",
    "paver-sand-calculator",
    "polymeric-sand-calculator",
    "paver-installation-cost-calculator",
    "paver-patio-cost-calculator",
    "paver-driveway-cost-calculator",
  ],
  relatedGuides: [
    { label: "concrete pavers material guide", to: "/materials/concrete-pavers" },
    { label: "concrete patio vs pavers comparison", to: "/blog/patio/concrete-patio-vs-pavers" },
    { label: "Concrete Walkway Design Guide: Styles, Costs & Ideas", to: "/guides/concrete-walkway" },
    { label: "Concrete Driveway Design Guide: Finishes, Costs & Ideas", to: "/guides/concrete-driveway" },
    { label: "Complete Concrete Patio Guide", to: "/guides/concrete-patio" },
  ],
};
