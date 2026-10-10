import type { ToolConfig } from "../types";
import { CURRENT_YEAR } from "@/lib/year";
import { moneyRange, num } from "@/lib/format";
import { quantityBySize } from "@/lib/tools/tables";
import { BAG_CUFT, BEDDING_SAND_IN, DELIVERY_FLAT, POLY_COVERAGE, SAND_PRICE_PER_TON, SAND_TONS_PER_YD3, type Range } from "@/lib/tools/data/paving";
import { pavingAt, a } from "./_shared";

const defaults = { length: 12, width: 16 };
const d = pavingAt(defaults);
const small = pavingAt({ ...defaults, length: 10, width: 10 });
const big = pavingAt({ ...defaults, length: 20, width: 20 });
const drive = pavingAt({ ...defaults, length: 20, width: 24, use: "driveway" });
const walk = pavingAt({ ...defaults, length: 30, width: 4 });
const sandIn = BEDDING_SAND_IN.value;

const table = (head: string[], rows: string[][]) =>
  `<table><thead><tr>${head.map((h) => `<th>${h}</th>`).join("")}</tr></thead><tbody>${rows
    .map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join("")}</tr>`)
    .join("")}</tbody></table>`;

const sandCost = (tons: number): Range => ({
  low: tons * SAND_PRICE_PER_TON.low,
  typical: tons * SAND_PRICE_PER_TON.typical,
  high: tons * SAND_PRICE_PER_TON.high,
});
const delivered = (tons: number): Range => {
  const s = sandCost(tons);
  return { low: s.low + DELIVERY_FLAT.low, typical: s.typical + DELIVERY_FLAT.typical, high: s.high + DELIVERY_FLAT.high };
};
const dollars = (r: Pick<Range, "low" | "high">) => `$${r.low}–${r.high}`;

const layerSizes: [number, number][] = [[10, 10], [12, 12], [12, 16], [16, 20], [20, 20]];
const layerTable = table(
  ["Size", "Base gravel", `Bedding sand (${sandIn} in)`],
  layerSizes.map(([l, w]) => {
    const r = pavingAt({ ...defaults, length: l, width: w });
    return [`${l} × ${w} ft`, `${num(r.baseTons, 1)} tons at ${r.baseInches} in`, `${num(r.sandTons, 1)} tons`];
  }),
);

const sandTypes = table(
  ["Sand", "Where it goes", `12 × 16 ft patio`],
  [
    ["Bedding sand (coarse concrete sand)", `Screeded ${sandIn} in layer under the pavers`, `${num(d.sandTons, 1)} tons or ${num(d.sandBags)} bags`],
    ["Polymeric sand", "Swept into the joints, then activated with water", `${num(d.polyBags)} bags of 50 lb`],
    ["Plain joint sand (fine)", "Swept into joints where polymeric is not used", "Small amount, swept to fill"],
  ],
);

const buyTable = table(
  ["Sand", "Use for bedding?", "Why"],
  [
    ["Concrete sand (coarse, washed)", "Yes, the standard", "Sharp, coarse grains lock together and drain"],
    ["Washed mason or manufactured sand", "Only if coarse", "Check the grading; fine sand holds water"],
    ["Play sand or fine masonry sand", "No", "Too fine and rounded; it shifts and stays wet"],
    ["Stone dust / screenings", "Not recommended", "Holds water and can wash out over time"],
    ["Polymeric sand", "No", "Joint material only; it hardens in place"],
  ],
);

const bulkSizes: [number, number][] = [[4, 20], [10, 10], [12, 12], [12, 16], [16, 20], [20, 20], [20, 30]];
const bagsVsBulk = table(
  ["Size", `${BAG_CUFT.value} cu ft bags`, "Bulk tons", "Sand only", "Bulk delivered"],
  bulkSizes.map(([l, w]) => {
    const r = pavingAt({ ...defaults, length: l, width: w });
    return [`${l} × ${w} ft`, num(r.sandBags), `${num(r.sandTons, 1)} tons`, moneyRange(sandCost(r.sandTons)), moneyRange(delivered(r.sandTons))];
  }),
);

const useSizes: [number, number][] = [[12, 16], [16, 20], [20, 24]];
const useTable = table(
  ["Size", "Patio base", "Driveway base", "Bedding sand (either)"],
  useSizes.map(([l, w]) => {
    const p = pavingAt({ ...defaults, length: l, width: w });
    const dr = pavingAt({ ...defaults, length: l, width: w, use: "driveway" });
    return [`${l} × ${w} ft`, `${num(p.baseTons, 1)} tons`, `${num(dr.baseTons, 1)} tons`, `${num(p.sandTons, 1)} tons`];
  }),
);

export const paverSandCalculator: ToolConfig = {
  slug: "paver-sand-calculator",
  engine: "paving",
  category: "paving",
  title: `Paver Sand Calculator: ${num(d.sandTons, 1)} Tons for a 12×16 Patio`,
  h1: "Paver Sand Calculator",
  summary: "Bedding sand in tons, cubic yards and bags for any paver patio, walkway or driveway.",
  metaDescription: `How much paver sand do you need? A 12×16 patio takes ${num(d.sandTons, 1)} tons (${num(d.sandBags)} bags) of bedding sand at ${sandIn} inch; a 20×20 takes ${num(big.sandTons, 1)} tons. Bags vs bulk compared.`,
  intro: `A 12×16 paver patio needs about ${num(d.sandTons, 1)} tons of bedding sand, or ${num(d.sandYd3, 2)} cubic yards, screeded ${sandIn} inch deep. That is ${num(d.sandBags)} bags of ${BAG_CUFT.value} cu ft. A 20×20 patio needs ${num(big.sandTons, 1)} tons. Enter your patio size to get bedding sand in tons, cubic yards and bags.`,
  datePublished: "2026-10-10",
  lastUpdated: "2026-10-10",
  pavingDefaults: defaults,
  pavingView: "sand",
  nextStep: { slug: "polymeric-sand-calculator", label: "Joints: polymeric sand" },
  expectedDefaultResult: `${num(d.sandTons, 1)} tons`,
  keywords: ["paver sand calculator", "bedding sand for pavers", "how much sand for pavers"],
  tips: [
    `Screed bedding sand to ${sandIn} inch; never use it to fix low spots in the base.`,
    "Buy coarse washed concrete sand, not play sand or fine masonry sand.",
    "Don't walk on screeded sand; lay pavers from the finished side.",
    "Keep sand covered before use so rain doesn't change its moisture.",
    "Bedding sand and polymeric joint sand are different products; you need both.",
  ],
  sections: [
    {
      heading: "Bedding Sand for Pavers by Patio Size",
      body: `<p>Bedding sand is a thin, even layer between the compacted base and the pavers. The amount is simply area times ${sandIn} inch, converted to tons at ${SAND_TONS_PER_YD3.value} tons per cubic yard. Unlike gravel base, bedding sand is not compacted before laying, so no extra allowance is added.</p>${quantityBySize("sand", [[10, 10], [10, 12], [12, 12], [12, 16], [14, 20], [16, 20], [20, 20], [20, 30]], defaults)}<p>Bags are ${BAG_CUFT.value} cu ft each. A 10×10 patio needs ${num(small.sandTons, 1)} tons, or ${num(small.sandBags)} bags. For the pavers themselves, use the ${a("/tools/paver-calculator", "paver calculator")}, which also lists base and edging.</p>`,
    },
    {
      heading: `The ${sandIn}-Inch Rule: How Thick Should Paver Sand Be?`,
      body: `<p>Bedding sand should be ${sandIn} inch thick, screeded flat. It is a leveling and seating layer, not a structural one. The pavers are vibrated into it so each unit beds evenly, and some sand works up into the joints from below.</p><p>Thicker is worse. A deep sand bed shifts under load, so pavers settle unevenly and ruts form, especially where people walk most or a car turns. If the base is low, fix the base with more compacted gravel. Sand is a small volume next to the base:</p>${layerTable}<p>The ${a("/tools/paver-base-calculator", "paver base calculator")} gives base tons by use and soil.</p>`,
    },
    {
      heading: "Bedding Sand vs. Joint Sand vs. Polymeric Sand",
      body: `<p>"Paver sand" can mean three different products. Bedding sand goes under the pavers. Joint sand fills the gaps between them, and polymeric joint sand contains a binder that hardens after you mist it with water, which resists weeds, ants and washout.</p>${sandTypes}<p>Polymeric sand covers about ${POLY_COVERAGE.narrow.value} sq ft per 50 lb bag on narrow joints and ${POLY_COVERAGE.wide.value} sq ft on wide ones. The ${a("/tools/polymeric-sand-calculator", "polymeric sand calculator")} gives the exact bag count for your joint width.</p>`,
    },
    {
      heading: "Which Sand to Buy for Pavers",
      body: `<p>Ask the yard for coarse washed concrete sand, sometimes sold as "paver sand" or ASTM C33 sand. Coarse, sharp grains lock together under the pavers and let water drain through. Fine, rounded sand stays wet, moves and can pump up through the joints.</p>${buyTable}<p>Pavers set on a sand bed over gravel are flexible pavement. They can lift and settle slightly without cracking, unlike a slab. Our ${a("/blog/patio/concrete-patio-vs-pavers", "concrete patio vs pavers comparison")} explains what that means long term.</p>`,
    },
    {
      heading: "Paver Sand: Bags vs. Bulk Delivery",
      body: `<p>Bedding sand is a small order, so bags make more sense here than for base. A 12×16 patio is ${num(d.sandBags)} bags, which most people can haul in a few trips. Bulk sand costs ${dollars(SAND_PRICE_PER_TON)} per ton plus a ${dollars(DELIVERY_FLAT)} delivery fee, so on small jobs the delivery fee dominates.</p>${bagsVsBulk}<p>If you are ordering base gravel in bulk anyway, add the sand to the same delivery so you only pay the fee once. Keep the pile covered with a tarp so rain doesn't soak it before screeding.</p>`,
    },
    {
      heading: "How to Screed Paver Sand",
      body: `<ul><li><strong>Start on a finished base.</strong> The compacted base should already have its final slope and be flat within a small tolerance.</li><li><strong>Set screed rails.</strong> Lay two lengths of ${sandIn}-inch outside-diameter pipe or rail on the base, parallel and a few feet apart.</li><li><strong>Fill and strike off.</strong> Spread sand between the rails and pull a straight board across them to strike the sand level.</li><li><strong>Pull the rails and fill the grooves.</strong> Lift the pipes, fill the channels with sand and trowel them smooth.</li><li><strong>Don't walk on it.</strong> Lay pavers from the already-laid side and screed only as much as you can cover the same day.</li><li><strong>Compact after laying.</strong> Run the plate compactor over the pavers to bed them, then sweep joint sand in.</li></ul><p>The ${a("/materials/concrete-pavers", "concrete pavers guide")} covers the full install sequence.</p>`,
    },
    {
      heading: "Sand for Paver Driveways vs. Patios",
      body: `<p>The bedding layer stays at ${sandIn} inch whether the pavers carry people or cars. What changes for a driveway is the base underneath, which gets much deeper, and the pavers, which are thicker. A 20×24 paver driveway needs ${num(drive.sandTons, 1)} tons of bedding sand on ${num(drive.baseTons, 1)} tons of base.</p>${useTable}<p>On a driveway, coarse concrete sand matters even more because turning tires shear a fine or overly thick bed. For full driveway pricing, use the ${a("/tools/paver-driveway-cost-calculator", "paver driveway cost calculator")}.</p>`,
    },
    {
      heading: "Paver Sand for Walkways and Small Patios",
      body: `<p>Walkways need little sand: a 4×30 walkway takes ${num(walk.sandTons, 1)} tons, or ${num(walk.sandBags)} bags. For these, bags are usually the easiest option.</p>${quantityBySize("sand", [[3, 15], [3, 20], [4, 20], [4, 30], [4, 50]], defaults)}<p>Price the whole job with the ${a("/tools/paver-walkway-cost-calculator", "paver walkway cost calculator")}, and see the ${a("/guides/concrete-walkway", "concrete walkway guide")} for layout and width.</p>`,
    },
    {
      heading: "How Much Does Paver Sand Cost?",
      body: `<p>Bedding sand is one of the cheapest parts of a paver patio. In ${CURRENT_YEAR}, coarse concrete sand runs ${dollars(SAND_PRICE_PER_TON)} per ton in bulk before delivery, so the default 12×16 patio's sand costs about ${moneyRange(sandCost(d.sandTons))}, or ${moneyRange(delivered(d.sandTons))} delivered on its own. The ${a("/tools/paver-patio-cost-calculator", "paver patio cost calculator")} rolls sand, base, pavers and labor into one installed price.</p>`,
    },
  ],
  faqs: [
    {
      question: "How much sand do I need for a 12×16 paver patio?",
      answer: `According to PourCanvas, a 12×16 patio needs ${num(d.sandTons, 1)} tons (${num(d.sandYd3, 2)} cubic yards) of bedding sand at ${sandIn} inch, or ${num(d.sandBags)} bags of ${BAG_CUFT.value} cu ft.`,
    },
    {
      question: "How many bags of paver sand do I need for a 10×10 patio?",
      answer: `According to PourCanvas, a 10×10 patio needs ${num(small.sandBags)} bags of ${BAG_CUFT.value} cu ft bedding sand, or about ${num(small.sandTons, 1)} tons in bulk, screeded ${sandIn} inch deep.`,
    },
    {
      question: "How thick should sand be under pavers?",
      answer: `${sandIn} inch, screeded flat. A thicker sand bed shifts and ruts under load. Fix low spots in the compacted gravel base, not with extra sand.`,
    },
    {
      question: "What kind of sand goes under pavers?",
      answer: "Coarse, washed concrete sand. Avoid play sand, fine masonry sand and stone dust, which hold water and shift. Polymeric sand is for the joints only.",
    },
    {
      question: "Can I use polymeric sand as bedding sand?",
      answer: "No. Polymeric sand hardens when wet and is made only for filling the joints between pavers. The bedding layer must stay loose enough for the pavers to seat into it.",
    },
    {
      question: "How much sand do I need for a 20×20 paver patio?",
      answer: `A 20×20 patio needs ${num(big.sandTons, 1)} tons of bedding sand, or ${num(big.sandBags)} bags, at ${sandIn} inch thick.`,
    },
  ],
  relatedTools: [
    "paver-base-calculator",
    "polymeric-sand-calculator",
    "paver-calculator",
    "paver-patio-cost-calculator",
    "paver-installation-cost-calculator",
    "paver-walkway-cost-calculator",
  ],
  relatedGuides: [
    { label: "concrete pavers material guide", to: "/materials/concrete-pavers" },
    { label: "concrete patio vs pavers comparison", to: "/blog/patio/concrete-patio-vs-pavers" },
    { label: "Concrete Walkway Design Guide: Styles, Costs & Ideas", to: "/guides/concrete-walkway" },
    { label: "Complete Concrete Patio Guide", to: "/guides/concrete-patio" },
    { label: "Stamped Concrete vs Pavers", to: "/blog/patio/stamped-concrete-vs-pavers" },
  ],
};
