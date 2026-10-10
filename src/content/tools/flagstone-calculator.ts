import type { ToolConfig } from "../types";
import { CURRENT_YEAR } from "@/lib/year";
import { moneyRange, perSqftRange, num } from "@/lib/format";
import { laborSplit, materialComparison, perSqftTable, quantityBySize, regionTable } from "@/lib/tools/tables";
import { FLAGSTONE_SQFT_PER_TON, INSTALLED } from "@/lib/tools/data/paving";
import { pavingAt, a } from "./_shared";

const defaults = { length: 12, width: 16, material: "flagstone-dry" as const, thickness: "1.5" as const };
const d = pavingAt(defaults);
const big = pavingAt({ ...defaults, length: 20, width: 20 });
const walk = pavingAt({ ...defaults, length: 30, width: 4 });
const mort = pavingAt({ ...defaults, material: "flagstone-mortared" });
const walkMort = pavingAt({ ...defaults, length: 30, width: 4, material: "flagstone-mortared" });
const thin = pavingAt({ ...defaults, thickness: "1" });
const thick = pavingAt({ ...defaults, thickness: "2" });
const pavers = pavingAt({ ...defaults, material: "concrete-paver" });
const cov = FLAGSTONE_SQFT_PER_TON;
const waste = Math.round(d.wastePct * 100);
const fd = INSTALLED["flagstone-dry"];
const fm = INSTALLED["flagstone-mortared"];
const laborPct = Math.round((d.labor.typical / d.pro.typical) * 100);

export const flagstoneCalculator: ToolConfig = {
  slug: "flagstone-calculator",
  engine: "paving",
  category: "paving",
  title: `Flagstone Calculator: ${num(d.flagstoneTons, 1)} Tons for a 12×16 Patio + Cost`,
  h1: "Flagstone Calculator",
  summary: "Tons of flagstone to order, installed cost and base quantities for any flagstone patio or path.",
  metaDescription: `How much flagstone do you need? About ${num(d.flagstoneTons, 1)} tons for a 12×16 patio and ${num(walk.flagstoneTons, 1)} tons for a 4×30 walkway at 1.5 in thick, plus installed cost of ${perSqftRange(d.proPerSqft)}/sq ft.`,
  intro: `As of ${CURRENT_YEAR}, a 12×16 flagstone patio needs about ${num(d.flagstoneTons, 1)} tons of 1.5 inch stone and costs ${moneyRange(d.pro)} dry-laid. A 4×30 walkway needs ${num(walk.flagstoneTons, 1)} tons and runs ${moneyRange(walk.pro)}. Enter your size, thickness and laying method to get tons to order and the installed cost.`,
  datePublished: "2026-10-10",
  lastUpdated: "2026-10-10",
  pavingDefaults: defaults,
  pavingView: "flagstone",
  nextStep: { slug: "patio-cost-calculator", label: "Compare with pavers and concrete" },
  expectedDefaultResult: `${num(d.flagstoneTons, 1)} tons`,
  keywords: ["flagstone calculator", "how much flagstone do i need", "flagstone cost calculator", "flagstone patio cost"],
  tips: [
    "Order by the ton, but confirm the yard's coverage for the exact stone you pick.",
    `Add about ${waste}% extra for cutting and fitting irregular pieces.`,
    "Thicker stone covers less area per ton but suits dry-laid patios better.",
    "Mortared flagstone needs a sound concrete slab underneath.",
    "Walk the stone yard and choose pallets yourself; color varies by batch.",
  ],
  sections: [
    {
      heading: "How Much Flagstone Do I Need?",
      body: `<p>Flagstone is sold by weight, so the calculator turns your area into tons. It adds ${waste}% for cutting and fitting, then divides by how many square feet a ton covers at your thickness. The table assumes 1.5 inch stone laid dry on gravel and sand.</p>${quantityBySize("flagstone", [[4, 20], [4, 30], [10, 10], [10, 12], [12, 16], [16, 20], [20, 20]], defaults)}<p>Flagstone is irregular, so treat the tonnage as an ordering target, not an exact count. Order the full amount at once so the whole job comes from the same quarry run.</p>`,
    },
    {
      heading: "Flagstone Coverage per Ton by Thickness",
      body: `<p>The coverage figures below are common supplier rules of thumb, not published standards. Real coverage depends on the stone type (sandstone, limestone, quartzite, slate) and how consistent the pieces are cut, so ask your yard what they see for the stone you choose.</p><ul><li><strong>About 1 inch thick:</strong> roughly ${cov["1"].value} sq ft per ton. A 12×16 patio needs about ${num(thin.flagstoneTons, 1)} tons.</li><li><strong>About 1.5 inches thick:</strong> roughly ${cov["1.5"].value} sq ft per ton. A 12×16 patio needs about ${num(d.flagstoneTons, 1)} tons.</li><li><strong>About 2 inches thick:</strong> roughly ${cov["2"].value} sq ft per ton. A 12×16 patio needs about ${num(thick.flagstoneTons, 1)} tons.</li></ul><p>Thin stone is usually mortared onto concrete. Dry-laid patios and paths need thicker pieces that won't crack under foot traffic on a flexible base. Tons and installed cost (dry-laid) for 2 inch stone:</p>${quantityBySize("flagstone", [[4, 30], [12, 16], [20, 20]], { ...defaults, thickness: "2" })}`,
    },
    {
      heading: "Flagstone Patio Cost: Dry-Laid vs. Mortared",
      body: `<p>Laying method changes the price more than the stone itself. Dry-laid flagstone sits on compacted gravel and sand with sand or polymeric joints. Mortared flagstone is set in a mortar bed on a concrete slab, which costs more but gives a rigid, flat surface.</p>${perSqftTable(["flagstone-dry", "flagstone-mortared"])}<p>For a 12×16 patio, dry-laid comes to about ${moneyRange(d.pro)} and mortared to about ${moneyRange(mort.pro)}. A 20×20 dry-laid patio runs ${moneyRange(big.pro)}. The materials alone for a 12×16 dry-laid patio come to about ${moneyRange(d.materials)} if you do the work yourself.</p>`,
    },
    {
      heading: "Flagstone vs. Pavers vs. Concrete Cost",
      body: `<p>For the same 12×16 patio, here is how flagstone compares with the common alternatives, installed:</p>${materialComparison(["plain-concrete", "exposed-aggregate", "concrete-paver", "stamped-concrete", "flagstone-dry", "flagstone-mortared"], [12, 16])}<p>Concrete pavers at ${moneyRange(pavers.pro)} are cheaper than dry-laid flagstone, and plain concrete is the cheapest of all. Flagstone wins on natural look and longevity. Our ${a("/blog/walkway/flagstone-vs-concrete-walkway", "flagstone vs concrete cost comparison")} goes deeper, and the ${a("/tools/patio-cost-calculator", "patio cost calculator")} compares every surface at your own size. If you lean toward pavers, the ${a("/tools/paver-patio-cost-calculator", "paver patio cost calculator")} prices them in detail.</p>`,
    },
    {
      heading: "Flagstone Walkway Cost and Quantities",
      body: `<p>A standard walkway is 3–4 ft wide. A 4×30 dry-laid flagstone path needs about ${num(walk.flagstoneTons, 1)} tons of stone and costs ${moneyRange(walk.pro)} installed; mortared it comes to ${moneyRange(walkMort.pro)}.</p>${quantityBySize("flagstone", [[3, 20], [3, 30], [4, 20], [4, 30], [4, 50]], defaults)}<p>For stepping-stone paths set in gravel or lawn, you need far less stone than a continuous path, so measure only the stones' footprint. See ${a("/inspiration/flagstone-walkway-natural", "a natural flagstone walkway")} and ${a("/inspiration/flagstone-walkway-silver-grey", "a silver-grey flagstone path")} for layout ideas, or price a paver path with the ${a("/tools/paver-walkway-cost-calculator", "paver walkway cost calculator")}.</p>`,
    },
    {
      heading: "Base for a Flagstone Patio",
      body: `<p>Dry-laid flagstone needs the same kind of base as pavers: ${d.baseInches} inches of compacted crushed gravel and a 1 inch sand setting bed. A 12×16 patio takes about ${num(d.baseTons, 1)} tons of gravel and ${num(d.sandTons, 1)} tons of sand. Clay or freeze-thaw soil calls for a deeper base.</p>${quantityBySize("base", [[4, 30], [12, 12], [12, 16], [20, 20]], defaults)}<p>The ${a("/tools/paver-base-calculator", "paver base calculator")} works out gravel for any size and soil. Fill the joints with sand or polymeric sand; the ${a("/tools/polymeric-sand-calculator", "polymeric sand calculator")} uses wide-joint coverage for flagstone. Mortared flagstone skips this base and goes onto a sound concrete slab.</p>`,
    },
    {
      heading: "Flagstone Patio Cost by Region",
      body: `<p>Labor rates and stone freight both vary by region. These multipliers shift the whole estimate for a 12×16 dry-laid patio; they are broad averages, not local quotes.</p>${regionTable([12, 16], defaults)}<p>Stone quarried nearby is usually cheaper than stone shipped across the country, so ask your yard which flagstone is local.</p>`,
    },
    {
      heading: "How Much Extra Flagstone to Order",
      body: `<p>The calculator adds ${waste}% to every order for cutting and fitting. Irregular stone always leaves offcuts, and some pieces break in transit or turn out too thin to use.</p><ul><li><strong>Order the full tonnage at once.</strong> Color and thickness vary between pallets and quarry runs.</li><li><strong>Add more for tight-fitting joints.</strong> A puzzle-like layout with narrow joints takes more cutting than a loose layout with wide joints.</li><li><strong>Check thickness on delivery.</strong> Very thin pieces crack on a dry-laid base.</li><li><strong>Keep a few spare stones</strong> for future repairs.</li></ul><p>For a 12×16 patio, that means ordering ${num(d.flagstoneTons, 1)} tons at 1.5 inches. For the look on a budget, compare a ${a("/inspiration/flagstone-patio-grey", "grey flagstone-look concrete patio")} and a ${a("/before-after/cracked-walkway-to-flagstone", "cracked walkway resurfaced with a flagstone look")}.</p>`,
    },
    {
      heading: "DIY Flagstone Patio Cost",
      body: `<p>Doing the work yourself removes the labor share, about ${laborPct}% of a typical 12×16 dry-laid quote. Materials are the bigger share here. The table shows two separate estimates: materials (stone with ${waste}% extra, gravel, sand, joint fill, edging and delivery, priced as DIY) and the installed total. Labor is the installed price minus typical materials, scaled across the range, so the low and high columns don't add up exactly; stone prices vary more than installed rates.</p>${laborSplit([[4, 30], [12, 16], [20, 20]], defaults)}<p>Dry-laid flagstone is a realistic DIY job if you can dig to depth, rent a plate compactor and move a few tons of stone by hand. Fitting irregular pieces is slow, so plan on more days than a paver patio of the same size. Mortared flagstone on a slab is better left to a mason. The ${a("/tools/paver-installation-cost-calculator", "paver installation cost calculator")} shows how labor scales with project size.</p>`,
    },
    {
      heading: "Is Flagstone Worth the Cost?",
      body: `<p>Flagstone costs more than pavers or plain concrete but lasts for decades, doesn't crack as a single slab, and can be lifted and relaid where roots or frost move it. Dry-laid stone also drains better than a solid slab. Our ${a("/materials/flagstone", "flagstone guide")} covers stone types and setting methods in detail.</p>${materialComparison(["concrete-paver", "flagstone-dry", "flagstone-mortared"], [20, 20])}`,
    },
  ],
  faqs: [
    {
      question: "How much flagstone do I need for a 12×16 patio?",
      answer: `According to PourCanvas, a 12×16 (192 sq ft) patio needs about ${num(d.flagstoneTons, 1)} tons of 1.5 inch flagstone, including ${waste}% for cutting and fitting. With 1 inch stone it needs about ${num(thin.flagstoneTons, 1)} tons; with 2 inch stone about ${num(thick.flagstoneTons, 1)} tons.`,
    },
    {
      question: "How much does a flagstone patio cost?",
      answer: `According to PourCanvas, dry-laid flagstone costs $${fd.low}–${fd.high} per square foot installed and mortared flagstone $${fm.low}–${fm.high}. A 12×16 patio comes to about ${moneyRange(d.pro)} dry-laid or ${moneyRange(mort.pro)} mortared.`,
    },
    {
      question: "How many square feet does a ton of flagstone cover?",
      answer: `As a supplier rule of thumb, about ${cov["1"].value} sq ft at 1 inch thick, ${cov["1.5"].value} sq ft at 1.5 inches and ${cov["2"].value} sq ft at 2 inches. Actual coverage varies with the stone type, so confirm with your stone yard.`,
    },
    {
      question: "How does flagstone cost compare with pavers and concrete?",
      answer: `Dry-laid flagstone runs $${fd.low}–${fd.high} per square foot installed, versus $${INSTALLED["concrete-paver"].low}–${INSTALLED["concrete-paver"].high} for concrete pavers and $${INSTALLED["plain-concrete"].low}–${INSTALLED["plain-concrete"].high} for plain poured concrete. Flagstone costs more up front but lasts longer and is easier to repair in sections.`,
    },
    {
      question: "How much flagstone do I need for a walkway?",
      answer: `A 4×30 walkway (120 sq ft) needs about ${num(walk.flagstoneTons, 1)} tons of 1.5 inch flagstone and costs about ${moneyRange(walk.pro)} installed dry-laid.`,
    },
    {
      question: "What goes under dry-laid flagstone?",
      answer: `Compacted crushed gravel (about ${d.baseInches} inches for a patio on well-drained soil) topped with a 1 inch sand setting bed. For a 12×16 patio that is about ${num(d.baseTons, 1)} tons of gravel and ${num(d.sandTons, 1)} tons of sand.`,
    },
  ],
  relatedTools: [
    "patio-cost-calculator",
    "paver-calculator",
    "paver-base-calculator",
    "paver-patio-cost-calculator",
    "polymeric-sand-calculator",
    "paver-walkway-cost-calculator",
    "paver-sand-calculator",
  ],
  relatedGuides: [
    { label: "flagstone guide", to: "/materials/flagstone" },
    { label: "flagstone vs concrete cost comparison", to: "/blog/walkway/flagstone-vs-concrete-walkway" },
    { label: "Concrete Patio vs Pavers", to: "/blog/patio/concrete-patio-vs-pavers" },
    { label: "Concrete Walkway Design Guide: Styles, Costs & Ideas", to: "/guides/concrete-walkway" },
    { label: "Silver Grey Flagstone Walkway Ideas", to: "/inspiration/flagstone-walkway-silver-grey" },
    { label: "Natural Flagstone Walkway Ideas", to: "/inspiration/flagstone-walkway-natural" },
  ],
};
