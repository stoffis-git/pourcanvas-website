import type { ToolConfig } from "../types";
import { CURRENT_YEAR } from "@/lib/year";
import { moneyRange, perSqftRange, num } from "@/lib/format";
import { costBySize, laborSplit, materialComparison, quantityBySize, regionTable } from "@/lib/tools/tables";
import { CURVED_EXTRA_WASTE, INSTALLED, PATTERN_WASTE, REMOVAL_PER_SQFT, REGION_MULTIPLIER } from "@/lib/tools/data/paving";
import { pavingAt, a } from "./_shared";

const defaults = { length: 30, width: 4, material: "concrete-paver" as const };
const d = pavingAt(defaults);
const short = pavingAt({ ...defaults, length: 20, width: 3 });
const long = pavingAt({ ...defaults, length: 50, width: 5 });
const patio = pavingAt({ ...defaults, length: 12, width: 16 });
const curved = pavingAt({ ...defaults, curved: true });
const old = pavingAt({ ...defaults, removal: "concrete" });
const herring = pavingAt({ ...defaults, pattern: "herringbone" });
const brick = d.compare.find((c) => c.material === "clay-brick")!;
const plain = d.compare.find((c) => c.material === "plain-concrete")!;
const flag = d.compare.find((c) => c.material === "flagstone-dry")!;
const rc = REMOVAL_PER_SQFT.concrete;
const edgePer100 = (r: typeof d) => num((r.edgeLF / r.area) * 100);

export const paverWalkwayCostCalculator: ToolConfig = {
  slug: "paver-walkway-cost-calculator",
  engine: "paving",
  category: "paving",
  title: `Paver Walkway Cost Calculator (${CURRENT_YEAR}): ${perSqftRange(d.proPerSqft)} per Sq Ft`,
  h1: "Paver Walkway Cost Calculator",
  summary: "Installed cost, materials and edging for any paver walkway or garden path.",
  metaDescription: `How much does a paver walkway cost? ${perSqftRange(d.proPerSqft)} per sq ft installed: about ${moneyRange(d.pro)} for a 4×30 ft path and ${moneyRange(short.pro)} for a 3×20. Labor and base included.`,
  intro: `As of ${CURRENT_YEAR}, a paver walkway costs ${perSqftRange(d.proPerSqft)} per square foot installed with concrete pavers. A 4×30 ft front walk runs ${moneyRange(d.pro)}; a 3×20 garden path runs ${moneyRange(short.pro)}. Enter your walkway length, width and material to get the installed cost and full material list.`,
  datePublished: "2026-10-10",
  lastUpdated: "2026-10-10",
  pavingDefaults: defaults,
  pavingView: "cost",
  nextStep: { slug: "paver-calculator", label: "Get your material list" },
  expectedDefaultResult: moneyRange(d.pro),
  keywords: ["paver walkway cost calculator"],
  tips: [
    "A narrow path needs far more edge restraint per square foot than a patio.",
    `Curves add about ${Math.round(CURVED_EXTRA_WASTE * 100)}% more pavers for cuts.`,
    "Make a front walk at least 4 ft wide so two people can walk side by side.",
    `Breaking out an old concrete walk adds $${rc.low}–${rc.high} per square foot.`,
    "Slope the path slightly to one side so water runs off.",
  ],
  sections: [
    {
      heading: "Paver Walkway Cost by Size",
      body: `<p>Walkways are priced by area, so length times width drives the total. These are installed prices for concrete pavers at the U.S. average of ${perSqftRange(d.proPerSqft)} per square foot, on bare ground.</p>${costBySize([[20, 3], [20, 4], [30, 4], [40, 4], [50, 5]], defaults)}<p>A long 5×50 ft walk comes to about ${moneyRange(long.pro)}. The calculator uses a flat national rate per square foot; quotes for very short paths often carry a minimum charge, because a crew's setup and delivery don't shrink with the area.</p>`,
    },
    {
      heading: "Standard Walkway Widths and What They Cost",
      body: `<p>A garden or side path is typically 3 ft wide. A front walk is usually 4 ft, wide enough for two people side by side, and a grand entry walk can be 5 ft or more. Each extra foot of width adds area along the whole length:</p>${costBySize([[30, 3], [30, 4], [30, 5], [30, 6]], defaults)}<p>Match the walk to the door and the scale of the house rather than going as narrow as possible. Our ${a("/guides/concrete-walkway", "complete walkway guide")} covers layout and proportions.</p>`,
    },
    {
      heading: "Walkway Materials Compared",
      body: `<p>For the same 4×30 ft path (${d.area} sq ft), installed prices by material, cheapest first:</p>${materialComparison(["plain-concrete", "exposed-aggregate", "concrete-paver", "stamped-concrete", "clay-brick", "travertine", "flagstone-dry", "porcelain"], [30, 4])}<p>Plain concrete is cheapest at about ${moneyRange(plain.total)}. Clay brick (${moneyRange(brick.total)}) is the classic front-walk look, and dry-laid flagstone (${moneyRange(flag.total)}) suits informal garden paths. For poured walks, see our ${a("/blog/walkway/concrete-walkway-cost", "concrete walkway cost guide")} and ${a("/blog/walkway/flagstone-vs-concrete-walkway", "flagstone vs concrete walkway")} comparison. Compare patio-sized areas with the ${a("/tools/patio-cost-calculator", "patio cost calculator")}.</p>`,
    },
    {
      heading: "Why Edge Restraint Matters More on a Walkway",
      body: `<p>A walkway is all edge. A 4×30 ft path needs about ${num(d.edgeLF)} linear feet of edge restraint for ${num(d.area)} sq ft, roughly ${edgePer100(d)} ft per 100 sq ft. A 12×16 patio needs ${num(patio.edgeLF)} ft for ${num(patio.area)} sq ft, or ${edgePer100(patio)} ft per 100 sq ft.</p>${quantityBySize("takeoff", [[20, 3], [30, 4], [50, 5]], defaults)}<p>Without a solid edge, the outer rows of a narrow path drift sideways and the joints open up. Ask installers to spike edging along both sides, not just to rely on soil. The table also shows pavers, base, sand and polymeric sand for each size. Get exact numbers from the ${a("/tools/paver-base-calculator", "paver base calculator")} and ${a("/tools/polymeric-sand-calculator", "polymeric sand calculator")}.</p>`,
    },
    {
      heading: "Curved Paver Walkway Cost",
      body: `<p>Curves look better on a winding garden path but need more cuts along both edges. The calculator adds ${Math.round(CURVED_EXTRA_WASTE * 100)}% extra waste for a curved layout, so a 4×30 ft walk goes from ${num(d.paverCount)} to ${num(curved.paverCount)} pavers, and the material cost rises from ${moneyRange(d.materials)} to ${moneyRange(curved.materials)}.</p>${quantityBySize("pavers", [[20, 4], [30, 4], [40, 4]], { ...defaults, curved: true })}<p>Expect installers to quote extra cutting time for tight curves on top of the installed rate. Browse ${a("/blog/walkway/curved-walkway-ideas", "curved walkway ideas")} for shapes that keep cuts manageable.</p>`,
    },
    {
      heading: "Paver Walkway Patterns and Waste",
      body: `<p>The laying pattern changes how many pavers you buy. Running bond, the simplest pattern, needs about ${Math.round(PATTERN_WASTE["running-bond"] * 100)}% extra for cuts. Basketweave needs about ${Math.round(PATTERN_WASTE.basketweave * 100)}% and 45° herringbone about ${Math.round(PATTERN_WASTE.herringbone * 100)}%, because every edge piece is cut at an angle. On a narrow walk, edges make up a large share of the pavers, so pattern choice matters more than on a patio.</p>${quantityBySize("pavers", [[20, 4], [30, 4], [40, 4]], { ...defaults, pattern: "herringbone" })}<p>That table shows herringbone counts. A 4×30 ft walk in herringbone needs ${num(herring.paverCount)} pavers against ${num(d.paverCount)} in running bond. Herringbone also locks together best under foot traffic, which is why it's common on busy front walks. See ${a("/blog/walkway/concrete-walkway-patterns", "walkway patterns")} for layout ideas.</p>`,
    },
    {
      heading: "Front Walk vs. Garden Path",
      body: `<p>A front walk carries daily foot traffic, deliveries and guests, so it is usually wider, set on a full compacted base and laid in a formal pattern. A backyard or garden path can be narrower and more relaxed, often dry-laid flagstone or stepping stones. A 3×20 ft garden path compares like this:</p>${materialComparison(["concrete-paver", "clay-brick", "flagstone-dry"], [20, 3])}<p>See ${a("/blog/walkway/front-walkway-ideas", "front walkway ideas")}, ${a("/blog/walkway/backyard-walkway-ideas", "backyard walkway ideas")} and ${a("/blog/walkway/stepping-stone-walkway-ideas", "stepping stone walkway ideas")} for designs.</p>`,
    },
    {
      heading: "Paver Walkway Cost by Region",
      body: `<p>Labor rates move walkway prices the most from region to region. A 4×30 ft paver walk by region:</p>${regionTable([30, 4], defaults)}<p>The West Coast runs about ×${REGION_MULTIPLIER.pacific.value.toFixed(2)} the national average and the South about ×${REGION_MULTIPLIER.south.value.toFixed(2)}. These are broad averages, not ZIP-level quotes. Because walkways are small jobs, a crew's minimum charge and travel time weigh more heavily than on a patio, so quotes in expensive metro areas can land above the table. Set your region in the calculator above to adjust the estimate.</p>`,
    },
    {
      heading: "Replacing an Old Concrete Walkway with Pavers",
      body: `<p>Breaking out and hauling away an old concrete walk adds $${rc.low}–${rc.high} per square foot. A 4×30 ft replacement comes to about ${moneyRange(old.pro)}, against ${moneyRange(d.pro)} on bare ground.</p>${costBySize([[20, 3], [30, 4], [40, 4], [50, 5]], { ...defaults, removal: "concrete" })}<p>Ask whether the quote includes cutting the old walk back cleanly where it meets steps, a driveway or a porch slab, and whether any existing base can be reused after inspection. If the old walk is sound and only looks tired, resurfacing or staining may cost less. See ${a("/blog/walkway/stained-concrete-walkway-ideas", "stained concrete walkway ideas")}.</p>`,
    },
    {
      heading: "DIY Paver Walkway: Materials vs. Labor",
      body: `<p>A straight walkway on flat ground is one of the most DIY-friendly paving jobs. If you do it yourself, the materials column is your budget:</p>${laborSplit([[20, 3], [30, 4], [50, 5]], defaults)}<p>Add a plate compactor and saw rental. The hard parts are the same as on a patio: digging to an even depth, compacting the base in thin lifts and keeping a slight cross slope so water sheds. A walk that meets steps or a driveway needs careful height matching, which is a good reason to hire out the tricky ends even if you lay the run yourself. Build your shopping list with the ${a("/tools/paver-calculator", "paver calculator")}, and see the ${a("/tools/paver-installation-cost-calculator", "paver installation cost calculator")} for what installers charge for each step. More walkway designs are on our ${a("/walkway", "walkway ideas")} page.</p>`,
    },
  ],
  faqs: [
    {
      question: "How much does a 4×30 paver walkway cost?",
      answer: `According to PourCanvas, a 4×30 ft (${num(d.area)} sq ft) concrete paver walkway costs about ${moneyRange(d.pro)} installed, at ${perSqftRange(d.proPerSqft)} per square foot. Clay brick raises it to about ${moneyRange(brick.total)}.`,
    },
    {
      question: "How much does a paver walkway cost per square foot?",
      answer: `According to PourCanvas, concrete paver walkways cost $${INSTALLED["concrete-paver"].low}–${INSTALLED["concrete-paver"].high} per square foot installed, with $${INSTALLED["concrete-paver"].typical} as the typical rate. Clay brick runs $${INSTALLED["clay-brick"].low}–${INSTALLED["clay-brick"].high}.`,
    },
    {
      question: "Is a paver walkway cheaper than concrete?",
      answer: `No. A plain concrete walk of 4×30 ft costs about ${moneyRange(plain.total)} versus ${moneyRange(d.pro)} for concrete pavers. Pavers cost more but can be lifted and relaid if a section settles.`,
    },
    {
      question: "How wide should a paver walkway be?",
      answer: "Garden paths are commonly 3 ft wide and front walks 4 ft, which lets two people walk side by side. Wider entry walks of 5 ft or more suit larger homes.",
    },
    {
      question: "How much does it cost to replace a concrete walkway with pavers?",
      answer: `Removal adds $${rc.low}–${rc.high} per square foot. A 4×30 ft walk replaced with concrete pavers comes to about ${moneyRange(old.pro)} including demolition and haul-away.`,
    },
    {
      question: "Do curved walkways cost more?",
      answer: `Yes. Curves need about ${Math.round(CURVED_EXTRA_WASTE * 100)}% more pavers for edge cuts, and installers often add cutting time on tight curves.`,
    },
  ],
  relatedTools: [
    "paver-calculator",
    "paver-patio-cost-calculator",
    "paver-installation-cost-calculator",
    "patio-cost-calculator",
    "paver-base-calculator",
    "polymeric-sand-calculator",
    "flagstone-calculator",
  ],
  relatedGuides: [
    { label: "complete walkway guide", to: "/guides/concrete-walkway" },
    { label: "flagstone vs concrete walkway comparison", to: "/blog/walkway/flagstone-vs-concrete-walkway" },
    { label: "Concrete Walkway Cost: What Homeowners Pay", to: "/blog/walkway/concrete-walkway-cost" },
    { label: "Concrete Front Walkway Ideas", to: "/blog/walkway/front-walkway-ideas" },
    { label: "Curved Walkway Ideas: When a Curve Beats a Straight Path", to: "/blog/walkway/curved-walkway-ideas" },
    { label: "Concrete Pavers vs Poured Concrete: Cost and Styles", to: "/materials/concrete-pavers" },
    { label: "Walkway design ideas", to: "/walkway" },
  ],
};
