import type { ToolConfig } from "../types";
import { CURRENT_YEAR } from "@/lib/year";
import { moneyRange, num } from "@/lib/format";
import { quantityBySize } from "@/lib/tools/tables";
import { BAG_CUFT, BASE_DEPTH_IN, BEDDING_SAND_IN, CURVED_EXTRA_WASTE, EDGING_PRICE_PER_LF, PATTERN_LABELS, PATTERN_WASTE, PAVER_SIZES, type Pattern } from "@/lib/tools/data/paving";
import { paverSqft } from "@/lib/tools/paving";
import { pavingAt, a } from "./_shared";

const defaults = { length: 12, width: 12, paverSize: "6x9", pattern: "running-bond" as const };
const d = pavingAt(defaults);
const s1216 = pavingAt({ ...defaults, length: 12, width: 16 });
const big = pavingAt({ ...defaults, length: 20, width: 20 });
const brick = pavingAt({ ...defaults, paverSize: "4x8" });
const brickHerr = pavingAt({ ...defaults, paverSize: "4x8", pattern: "herringbone" });
const herr = pavingAt({ ...defaults, pattern: "herringbone" });
const curved = pavingAt({ ...defaults, curved: true });
const threeSides = pavingAt({ ...defaults, edging: "three-sides" });
const pct = (n: number) => `${Math.round(n * 100)}%`;
const wastePct = pct(d.wastePct);

const table = (head: string[], rows: string[][]) =>
  `<table><thead><tr>${head.map((h) => `<th>${h}</th>`).join("")}</tr></thead><tbody>${rows
    .map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join("")}</tr>`)
    .join("")}</tbody></table>`;

const perSqftBySize = table(
  ["Paver size", "Pavers per sq ft", `Pavers for 100 sq ft (+${wastePct})`],
  PAVER_SIZES.map((p) => [p.label, num(1 / paverSqft(p.id), 2), num(pavingAt({ ...defaults, length: 10, width: 10, paverSize: p.id }).paverCount)]),
);

const patterns = Object.keys(PATTERN_WASTE) as Pattern[];
const wasteByPattern = table(
  ["Pattern", "Waste allowance", "6×9 pavers, 12×12 patio", "4×8 bricks, 12×12 patio"],
  patterns.map((pt) => [
    PATTERN_LABELS[pt],
    pct(PATTERN_WASTE[pt]),
    num(pavingAt({ ...defaults, pattern: pt }).paverCount),
    num(pavingAt({ ...defaults, pattern: pt, paverSize: "4x8" }).paverCount),
  ]),
);

const twelveBySize = table(
  ["Paver size", "Running bond", "Herringbone"],
  PAVER_SIZES.map((p) => [
    p.label,
    num(pavingAt({ ...defaults, paverSize: p.id }).paverCount),
    num(pavingAt({ ...defaults, paverSize: p.id, pattern: "herringbone" }).paverCount),
  ]),
);

const edgeSizes: [number, number][] = [[10, 10], [12, 12], [12, 16], [16, 20], [20, 20]];
const edgeTable = table(
  ["Size", "Edging, all sides", "Edging, three sides", "Edging material"],
  edgeSizes.map(([l, w]) => {
    const full = pavingAt({ ...defaults, length: l, width: w });
    const three = pavingAt({ ...defaults, length: l, width: w, edging: "three-sides" });
    const cost = { low: EDGING_PRICE_PER_LF.low * full.edgeLF, typical: EDGING_PRICE_PER_LF.typical * full.edgeLF, high: EDGING_PRICE_PER_LF.high * full.edgeLF };
    return [`${l} × ${w} ft`, `${num(full.edgeLF)} ft`, `${num(three.edgeLF)} ft`, moneyRange(cost)];
  }),
);

export const paverCalculator: ToolConfig = {
  slug: "paver-calculator",
  engine: "paving",
  category: "paving",
  title: `Paver Calculator: ${num(d.paverCount)} Pavers for a 12×12 Patio`,
  h1: "Paver Calculator",
  summary: "How many pavers you need, plus base gravel, bedding sand, joint sand and edging for any size.",
  metaDescription: `How many pavers do you need? A 12×12 patio takes ${num(d.paverCount)} 6×9 pavers and a 12×16 takes ${num(s1216.paverCount)}, ${wastePct} waste included. Get base, sand and edging counts too.`,
  intro: `A 12×12 patio needs ${num(d.paverCount)} standard 6×9 inch pavers laid in running bond, including ${wastePct} extra for cuts. A 12×16 patio needs ${num(s1216.paverCount)}, and the same 12×12 in 4×8 brick needs ${num(brick.paverCount)}. Enter your patio size, paver size and pattern to get the paver count, base gravel, bedding sand and edging.`,
  datePublished: "2026-10-10",
  lastUpdated: "2026-10-10",
  pavingDefaults: defaults,
  pavingView: "pavers",
  nextStep: { slug: "paver-patio-cost-calculator", label: "Price this patio" },
  expectedDefaultResult: `${num(d.paverCount)} pavers`,
  keywords: [
    "paver calculator",
    "how many pavers do i need",
    "paver patio calculator",
    "brick paver calculator",
    "paver stone calculator",
    "how many pavers do i need for a 12x12 patio",
  ],
  tips: [
    `Running bond wastes the least: ${pct(PATTERN_WASTE["running-bond"])} extra versus ${pct(PATTERN_WASTE.herringbone)} for 45° herringbone.`,
    `Curved edges add another ${pct(CURVED_EXTRA_WASTE)} on top of the pattern waste.`,
    "Order every pallet from the same production lot so the color matches.",
    "Measure the finished patio edge, not the excavation, when entering size.",
    "Keep a few spare pavers after the job for future repairs.",
  ],
  sections: [
    {
      heading: "How Many Pavers Do I Need? Pavers by Patio Size",
      body: `<p>The paver count is the patio area divided by the face area of one paver, plus a waste allowance for cuts and breakage. The table uses standard 6×9 inch concrete pavers in a running bond, the most common patio setup, with ${wastePct} added for waste.</p>${quantityBySize("pavers", [[10, 10], [10, 12], [12, 12], [12, 16], [14, 20], [16, 20], [20, 20], [20, 30]], defaults)}<p>Pavers are sold by the pallet or by the square foot of coverage rather than by the piece at most yards, so convert the count to square feet when you order. A 20×20 patio in 6×9 pavers needs ${num(big.paverCount)} pieces. For a sense of what these sizes look like built, browse ${a("/patio", "patio design ideas")}.</p>`,
    },
    {
      heading: "Pavers per Square Foot by Paver Size",
      body: `<p>Smaller pavers mean more pieces per square foot, more handling and more joints to fill. Larger slabs go down faster but are heavier, and they need a flatter base because they bridge small dips instead of settling into them.</p>${perSqftBySize}<p>The paver stone count only changes with face size. Thickness matters for strength, not for the count: thicker units are used for driveways. Most yards list a coverage figure per pallet, so divide your square footage by it and round up to whole pallets. Our ${a("/materials/concrete-pavers", "concrete pavers guide")} covers common shapes, finishes and thicknesses.</p>`,
    },
    {
      heading: "How Many Pavers Do I Need for a 12×12 Patio?",
      body: `<p>A 12×12 patio is ${num(d.area)} square feet. In 6×9 pavers with a running bond you need ${num(d.paverCount)} pavers; in 45° herringbone the extra cuts push that to ${num(herr.paverCount)}. In 4×8 brick pavers it is ${num(brick.paverCount)} in running bond and ${num(brickHerr.paverCount)} in herringbone.</p>${twelveBySize}<p>Beyond the pavers, a 12×12 patio also needs about ${num(d.baseTons, 1)} tons of base gravel at ${d.baseInches} inches, ${num(d.sandTons, 1)} tons of bedding sand, ${num(d.polyBags)} bags of polymeric sand and ${num(d.edgeLF)} feet of edge restraint. If one edge sits against the house, edging drops to ${num(threeSides.edgeLF)} feet.</p>`,
    },
    {
      heading: "Paver Waste by Laying Pattern",
      body: `<p>Every pattern needs extra pavers for the cuts at the edges. Simple patterns like running bond only need cut pieces along two sides. Herringbone laid at 45° needs a cut on nearly every edge paver, and the offcuts are often too small to reuse.</p>${wasteByPattern}<p>Curved borders add another ${pct(CURVED_EXTRA_WASTE)}: a 12×12 patio with a curved edge in running bond takes ${num(curved.paverCount)} pavers instead of ${num(d.paverCount)}. If you want a herringbone look, see this ${a("/inspiration/herringbone-brick-patio", "herringbone brick patio")} for how it reads at patio scale.</p>`,
    },
    {
      heading: "Paver Patio Calculator: Full Material List by Size",
      body: `<p>A paver patio is a layered system: compacted gravel base, a thin bed of sand, the pavers, joint sand, and an edge restraint to hold it all in place. This takeoff gives every layer for common patio sizes with 6×9 pavers on a ${d.baseInches}-inch base.</p>${quantityBySize("takeoff", [[10, 10], [12, 12], [12, 16], [16, 20], [20, 20], [20, 30]], defaults)}<p>Base and sand are in tons, the unit most landscape yards sell by. Polymeric sand is counted in 50 lb bags for narrow joints. Want to know what all of this costs installed? Run the same size through the ${a("/tools/paver-patio-cost-calculator", "paver patio cost calculator")}.</p>`,
    },
    {
      heading: "Base Gravel and Bedding Sand at a Glance",
      body: `<p>Patios need ${BASE_DEPTH_IN.patio.value} inches of compacted crushed-stone base, driveways ${BASE_DEPTH_IN.driveway.value} inches, and clay or freeze-thaw soil adds ${BASE_DEPTH_IN.poorSoilExtra.value} more. On top goes a ${BEDDING_SAND_IN.value}-inch screeded layer of bedding sand.</p>${quantityBySize("base", [[10, 10], [12, 12], [12, 16], [20, 20]], defaults)}<p>Bags in the table are ${BAG_CUFT.value} cu ft each, the common retail size; above a couple of tons, bulk delivery is usually easier. The ${a("/tools/paver-base-calculator", "paver base calculator")} handles depth by soil and use, and the ${a("/tools/paver-sand-calculator", "paver sand calculator")} gives bedding sand in tons, cubic yards and bags.</p>`,
    },
    {
      heading: "Edge Restraint for Paver Patios",
      body: `<p>Without an edge restraint, the outer pavers slowly creep outward and the joints open up. Plastic or aluminum edging spiked into the base is the usual choice; a concrete curb or a soldier course set in concrete also works. You can skip edging only where the patio butts against a foundation or a wall.</p>${edgeTable}<p>Edging is measured along the perimeter. "Three sides" assumes the longest side runs along the house. For joint sand, the ${a("/tools/polymeric-sand-calculator", "polymeric sand calculator")} gives the bag count for narrow and wide joints.</p>`,
    },
    {
      heading: "Brick Paver Calculator: 4×8 Brick Patios",
      body: `<p>Clay and concrete bricks in the 4×8 inch size cover ${num(paverSqft("4x8"), 2)} sq ft each versus ${num(paverSqft("6x9"), 3)} sq ft for a 6×9 paver, so you need noticeably more pieces. They suit traditional patterns like basketweave and herringbone, which raise the waste allowance.</p>${quantityBySize("pavers", [[10, 10], [12, 12], [12, 16], [16, 20], [20, 20]], { ...defaults, paverSize: "4x8" })}<p>Counts above are for running bond. Herringbone brick on a 12×12 patio comes to ${num(brickHerr.paverCount)} bricks. Natural stone is sold by weight rather than by piece; for it, use the ${a("/tools/flagstone-calculator", "flagstone calculator")}.</p>`,
    },
    {
      heading: "Ordering Tips: Buy Extra From the Same Lot",
      body: `<ul><li><strong>Order the full quantity at once.</strong> Concrete pavers vary slightly in color between production runs. Pavers bought later from a different lot can look patchy next to the originals.</li><li><strong>Mix from several pallets while laying.</strong> Pulling from three or four pallets at once blends any color variation across the whole patio.</li><li><strong>Keep the waste allowance.</strong> The calculator already adds ${wastePct} for a running bond. Round up to whole pallets rather than cutting the allowance.</li><li><strong>Keep spares.</strong> A few leftover pavers let you replace a stained or cracked unit years later with a matching one.</li><li><strong>Check delivery access.</strong> Pallets come by boom truck or forklift, so confirm where they can be set down.</li></ul><p>The ${a("/blog/patio/concrete-patio-vs-pavers", "concrete patio vs pavers comparison")} explains how pavers hold up against a poured slab over time.</p>`,
    },
    {
      heading: "What a Paver Patio Costs",
      body: `<p>Quantities first, then price. For the default 12×12 patio, the materials in the list above come to about ${moneyRange(d.materials)} if you do the work yourself, and roughly ${moneyRange(d.pro)} installed by a contractor in ${CURRENT_YEAR}. The ${a("/tools/paver-patio-cost-calculator", "paver patio cost calculator")} prices any size and material, and the ${a("/tools/paver-installation-cost-calculator", "paver installation cost calculator")} breaks out labor. Every number on this page is traceable on our ${a("/methodology", "methodology page")}.</p>`,
    },
  ],
  faqs: [
    {
      question: "How many pavers do I need for a 12×12 patio?",
      answer: `According to PourCanvas, a 12×12 patio (${num(d.area)} sq ft) needs ${num(d.paverCount)} standard 6×9 inch pavers in a running bond, including ${wastePct} waste. In 4×8 brick it needs ${num(brick.paverCount)}, and in 6×9 herringbone ${num(herr.paverCount)}.`,
    },
    {
      question: "How many pavers do I need for a 12×16 patio?",
      answer: `According to PourCanvas, a 12×16 patio (${num(s1216.area)} sq ft) needs ${num(s1216.paverCount)} 6×9 pavers in a running bond, plus about ${num(s1216.baseTons, 1)} tons of base gravel and ${num(s1216.sandTons, 1)} tons of bedding sand.`,
    },
    {
      question: "How many pavers are in a square foot?",
      answer: `It depends on the paver size: ${num(1 / paverSqft("6x9"), 2)} pavers per square foot for 6×9 inch pavers, ${num(1 / paverSqft("4x8"), 2)} for 4×8 bricks and ${num(1 / paverSqft("12x12"), 0)} for 12×12 slabs, before waste.`,
    },
    {
      question: "How much extra should I order for paver waste?",
      answer: `Add ${pct(PATTERN_WASTE["running-bond"])} for running or stack bond, ${pct(PATTERN_WASTE.basketweave)} for basketweave or random patterns, and ${pct(PATTERN_WASTE.herringbone)} for 45° herringbone. Curved edges add another ${pct(CURVED_EXTRA_WASTE)}.`,
    },
    {
      question: "How many pavers are in a 20×20 patio?",
      answer: `A 20×20 patio (${num(big.area)} sq ft) needs ${num(big.paverCount)} 6×9 pavers in a running bond, with ${num(big.edgeLF)} feet of edge restraint and ${num(big.polyBags)} bags of polymeric sand.`,
    },
    {
      question: "Do I need base and sand under pavers?",
      answer: `Yes. Pavers sit on ${BASE_DEPTH_IN.patio.value} inches of compacted gravel base for a patio and a ${BEDDING_SAND_IN.value}-inch bed of sand. Without the base, pavers sink and shift, especially in freeze-thaw climates.`,
    },
  ],
  relatedTools: [
    "paver-base-calculator",
    "paver-sand-calculator",
    "polymeric-sand-calculator",
    "paver-patio-cost-calculator",
    "paver-installation-cost-calculator",
    "patio-cost-calculator",
    "flagstone-calculator",
  ],
  relatedGuides: [
    { label: "concrete pavers material guide", to: "/materials/concrete-pavers" },
    { label: "concrete patio vs pavers comparison", to: "/blog/patio/concrete-patio-vs-pavers" },
    { label: "Stamped Concrete vs Pavers", to: "/blog/patio/stamped-concrete-vs-pavers" },
    { label: "Complete Concrete Patio Guide", to: "/guides/concrete-patio" },
    { label: "Herringbone Brick Pattern Patio Ideas", to: "/inspiration/herringbone-brick-patio" },
    { label: "Patio design ideas", to: "/patio" },
  ],
};
