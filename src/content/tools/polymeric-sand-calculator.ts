import type { ToolConfig } from "../types";
import { CURRENT_YEAR } from "@/lib/year";
import { moneyRange, num } from "@/lib/format";
import { quantityBySize } from "@/lib/tools/tables";
import { POLY_BAG_PRICE, POLY_COVERAGE } from "@/lib/tools/data/paving";
import type { PavingResult } from "@/lib/tools/paving";
import { pavingAt, a } from "./_shared";

const defaults = { length: 12, width: 16, joint: "narrow" as const };
const d = pavingAt(defaults);
const wide = pavingAt({ ...defaults, joint: "wide" });
const big = pavingAt({ ...defaults, length: 20, width: 20 });
const small = pavingAt({ ...defaults, length: 10, width: 10 });
const walk = pavingAt({ ...defaults, length: 30, width: 4 });
const flag = pavingAt({ ...defaults, material: "flagstone-dry" });
const narrowCov = POLY_COVERAGE.narrow.value;
const wideCov = POLY_COVERAGE.wide.value;
const [narrowJoint, narrowRange] = POLY_COVERAGE.narrow.note!.replace(/\.$/, "").split(", ");
const [wideJoint, wideRange] = POLY_COVERAGE.wide.note!.replace(/\.$/, "").split(", ");
const bagCost = (r: PavingResult) =>
  moneyRange({ low: r.polyBags * POLY_BAG_PRICE.low, typical: r.polyBags * POLY_BAG_PRICE.typical, high: r.polyBags * POLY_BAG_PRICE.high });
const sizes: [number, number][] = [[10, 10], [10, 12], [12, 12], [12, 16], [16, 20], [20, 20], [20, 30]];

export const polymericSandCalculator: ToolConfig = {
  slug: "polymeric-sand-calculator",
  engine: "paving",
  category: "paving",
  title: `Polymeric Sand Calculator: ${num(d.polyBags)} Bags for a 12×16 Patio`,
  h1: "Polymeric Sand Calculator",
  summary: "50 lb bags of polymeric sand for any paver or flagstone area, by joint width, with cost.",
  metaDescription: `How much polymeric sand do you need? About ${narrowCov} sq ft per 50 lb bag on narrow joints: ${num(d.polyBags)} bags for a 12×16 patio, ${num(big.polyBags)} for a 20×20. Wide joints need more.`,
  intro: `As of ${CURRENT_YEAR}, one 50 lb bag of polymeric sand covers about ${narrowCov} square feet of pavers with narrow joints and about ${wideCov} with wide joints. A 12×16 patio needs ${num(d.polyBags)} bags; with wide joints it needs ${num(wide.polyBags)}. Enter your patio size and joint width to get the bag count.`,
  datePublished: "2026-10-10",
  lastUpdated: "2026-10-10",
  pavingDefaults: defaults,
  pavingView: "poly",
  nextStep: { slug: "paver-calculator", label: "Plan the whole project" },
  expectedDefaultResult: `${num(d.polyBags)} bags`,
  keywords: ["polymeric sand calculator", "how much polymeric sand do i need"],
  tips: [
    "Always round up to the next whole bag; a partial bag left over is cheap insurance.",
    "Wide or irregular joints use more than twice as much sand per square foot.",
    "Install only on a completely dry surface and dry joints.",
    "Blow every grain of sand off the paver faces before misting, or it will haze.",
    "Buy all bags from the same batch so the joint color matches.",
  ],
  sections: [
    {
      heading: "How Much Polymeric Sand Do I Need?",
      body: `<p>The calculator divides your paved area by the coverage of one 50 lb bag, then rounds up to whole bags. Joint width matters most: narrow joints between tight-fitting pavers take far less sand than the wide, uneven gaps around natural stone. The table uses narrow joints (about ${narrowCov} sq ft per bag).</p>${quantityBySize("poly", sizes, { joint: "narrow" })}<p>Those counts cover the joints only. The 1 inch bedding layer under the pavers is regular washed concrete sand, not polymeric sand; work that out with the ${a("/tools/paver-sand-calculator", "paver sand calculator")}.</p>`,
    },
    {
      heading: "Polymeric Sand Coverage per Bag by Joint Width",
      body: `<p>Manufacturers publish coverage as a range because joint depth, paver thickness and how much the surface has been tamped all change how much sand settles in. PourCanvas uses one value inside each published range:</p><ul><li><strong>Narrow joints (${narrowJoint.toLowerCase()}):</strong> the calculator uses ${narrowCov} sq ft per 50 lb bag; published coverage is ${narrowRange}.</li><li><strong>Wide joints (${wideJoint.toLowerCase()}):</strong> the calculator uses ${wideCov} sq ft per 50 lb bag; published coverage is ${wideRange}.</li></ul><p>Small square pavers have more joint length per square foot than large slabs, so a patio of 4×8 inch bricks lands at the low end of the coverage range. Large porcelain or ${a("/materials/travertine", "travertine")} slabs land at the high end. Check the bag label for your brand, then adjust if needed.</p>`,
    },
    {
      heading: "Polymeric Sand for Wide Joints",
      body: `<p>Pavers with wide or open joints, such as tumbled stones, cobbles and spaced slabs, need a wide-joint polymeric sand, and a lot more of it. On the same 12×16 patio, the count goes from ${num(d.polyBags)} bags for narrow joints to ${num(wide.polyBags)} bags for wide joints.</p>${quantityBySize("poly", sizes, { joint: "wide" })}<p>Narrow-joint products are not made to bridge wide gaps and can crack or wash out. Buy the product rated for your joint width.</p>`,
    },
    {
      heading: "Polymeric Sand for Flagstone",
      body: `<p>Dry-laid flagstone has irregular joints that are often wide, so the calculator always uses wide-joint coverage when you choose flagstone. A 12×16 flagstone patio needs about ${num(flag.polyBags)} bags; a 4×30 flagstone path needs ${num(pavingAt({ length: 30, width: 4, material: "flagstone-dry" }).polyBags)}.</p>${quantityBySize("poly", [[4, 30], [10, 12], [12, 16], [16, 20], [20, 20]], { material: "flagstone-dry" })}<p>To order the stone itself, use the ${a("/tools/flagstone-calculator", "flagstone calculator")}. Our ${a("/materials/flagstone", "flagstone guide")} explains dry-laid and mortared setting methods.</p>`,
    },
    {
      heading: "Polymeric Sand Cost for a Project",
      body: `<p>Polymeric sand costs about $${POLY_BAG_PRICE.low}–${POLY_BAG_PRICE.high} per 50 lb bag, depending on brand and whether it is a standard, wide-joint or premium product. Multiply that by your bag count:</p><ul><li><strong>10×10 patio:</strong> ${num(small.polyBags)} bags, about ${bagCost(small)}</li><li><strong>4×30 walkway:</strong> ${num(walk.polyBags)} bags, about ${bagCost(walk)}</li><li><strong>12×16 patio:</strong> ${num(d.polyBags)} bags, about ${bagCost(d)}</li><li><strong>12×16 patio, wide joints:</strong> ${num(wide.polyBags)} bags, about ${bagCost(wide)}</li><li><strong>20×20 patio:</strong> ${num(big.polyBags)} bags, about ${bagCost(big)}</li></ul><p>Joint sand is a small share of a paver budget. The ${a("/tools/paver-patio-cost-calculator", "paver patio cost calculator")} shows the full installed price, and the ${a("/tools/paver-calculator", "paver calculator")} lists every material.</p>`,
    },
    {
      heading: "Polymeric Sand vs. Regular Joint Sand",
      body: `<p>Regular joint sand is plain fine sand swept into the joints. It is cheap and easy to top up, but it washes out, lets weeds root and gives ants an easy home. Polymeric sand is fine sand blended with a binder that hardens once wetted. The cured joint stays flexible enough for the pavers to move slightly, yet it resists washout, weeds and insects.</p><ul><li><strong>Choose polymeric sand</strong> for patios, walkways and driveways where you want low-maintenance joints.</li><li><strong>Choose regular sand</strong> for a quick temporary fix, or where you want joints that are easy to top up by hand.</li><li><strong>Use neither on permeable pavers:</strong> their open joints are filled with small chip stone so water can drain through.</li></ul><p>For the trade-offs of the pavers themselves, see our ${a("/blog/patio/concrete-patio-vs-pavers", "concrete patio vs pavers comparison")}.</p>`,
    },
    {
      heading: "How to Apply Polymeric Sand",
      body: `<ul><li><strong>Start dry.</strong> The pavers, the joints and the bedding sand below must be fully dry. Moisture activates the binder early and leaves a haze.</li><li><strong>Spread and sweep.</strong> Pour the sand onto the surface and sweep it diagonally across the joints until they are full.</li><li><strong>Compact.</strong> Run a plate compactor with a protective pad over the pavers to settle the sand, then sweep in more and repeat until the joints stay full to just below the paver chamfer.</li><li><strong>Clean the surface.</strong> Sweep, then use a leaf blower to clear every grain off the paver faces.</li><li><strong>Mist.</strong> Wet the joints with a gentle shower setting in small sections. Follow the bag's directions on how many passes to make; flooding the joints washes the binder out.</li></ul><p>A full install sequence, including base and bedding, is in our ${a("/guides/concrete-walkway", "concrete walkway design guide")}.</p>`,
    },
    {
      heading: "Weather Window for Polymeric Sand",
      body: `<p>Polymeric sand needs dry weather on both sides of the install. Rain before application leaves damp joints that won't fill properly; rain soon after misting can wash the binder out before it sets. Every brand states a minimum rain-free period and a temperature range on the bag, so plan the job around that, not around a general rule.</p><ul><li>Pick a day with a dry forecast and no overnight rain expected.</li><li>Avoid very hot, sunny afternoons, when the mist evaporates before it soaks in.</li><li>Avoid cold days near freezing, when the binder cures slowly or not at all.</li><li>Keep foot traffic and furniture off until the bag's cure time has passed.</li></ul>`,
    },
    {
      heading: "When to Re-Sand Pavers",
      body: `<p>Well-installed polymeric joints last for years, but they don't last forever. Plan to re-sand when you see joints sitting well below the paver edge, sand washing onto the surface after rain, weeds or ants coming through, or pavers starting to shift. Remove the old joint material to a depth of about an inch, clean the surface, let it dry and repeat the install steps above. A patio with mostly sound joints only needs the bad areas redone, so one or two bags usually covers a touch-up. For a complete rebuild or a new area, start from the ${a("/tools/paver-base-calculator", "paver base calculator")} and work up layer by layer.</p>${quantityBySize("poly", [[4, 30], [12, 16], [20, 20]], { joint: "narrow" })}`,
    },
  ],
  faqs: [
    {
      question: "How many bags of polymeric sand do I need for a 12×16 patio?",
      answer: `According to PourCanvas, a 12×16 (192 sq ft) paver patio with narrow joints needs ${num(d.polyBags)} bags of 50 lb polymeric sand at about ${narrowCov} sq ft per bag. With wide joints it needs ${num(wide.polyBags)} bags.`,
    },
    {
      question: "How much area does a 50 lb bag of polymeric sand cover?",
      answer: `About ${narrowCov} square feet with narrow joints (${narrowJoint.toLowerCase()}, ${narrowRange}) and about ${wideCov} square feet with wide joints (${wideJoint.toLowerCase()}, ${wideRange}). Check the coverage chart on your brand's bag.`,
    },
    {
      question: "How much does polymeric sand cost for a patio?",
      answer: `According to PourCanvas, polymeric sand runs $${POLY_BAG_PRICE.low}–${POLY_BAG_PRICE.high} per 50 lb bag, so a 12×16 patio (${num(d.polyBags)} bags) costs about ${bagCost(d)} in joint sand and a 20×20 patio (${num(big.polyBags)} bags) about ${bagCost(big)}.`,
    },
    {
      question: "Can I use polymeric sand for the bedding layer?",
      answer: "No. Polymeric sand goes only in the joints between pavers. The 1 inch bedding layer underneath is coarse washed concrete sand, which stays loose so the pavers can be leveled.",
    },
    {
      question: "Can you put polymeric sand over old sand?",
      answer: "Not directly. Remove the old joint sand to about an inch deep first; a thin layer of polymeric sand over loose sand cracks and breaks out. The joints must also be dry before you sweep the new sand in.",
    },
    {
      question: "Does polymeric sand stop weeds?",
      answer: "It greatly reduces them because the hardened joint is difficult for seeds to root in and for ants to dig through. Weeds can still grow where joints crack, wash out or were not filled fully, so re-sand those spots when you see them.",
    },
  ],
  relatedTools: [
    "paver-sand-calculator",
    "paver-base-calculator",
    "paver-calculator",
    "paver-patio-cost-calculator",
    "flagstone-calculator",
    "paver-walkway-cost-calculator",
    "paver-installation-cost-calculator",
  ],
  relatedGuides: [
    { label: "concrete pavers guide", to: "/materials/concrete-pavers" },
    { label: "concrete patio vs pavers comparison", to: "/blog/patio/concrete-patio-vs-pavers" },
    { label: "Concrete Walkway Design Guide: Styles, Costs & Ideas", to: "/guides/concrete-walkway" },
    { label: "What Is Flagstone? Types, Uses and Setting Methods", to: "/materials/flagstone" },
    { label: "Stamped Concrete vs Pavers: Cost, Durability and Looks", to: "/blog/patio/stamped-concrete-vs-pavers" },
    { label: "Patio design ideas", to: "/patio" },
  ],
};
