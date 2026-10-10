import type { ToolConfig } from "../types";
import { CURRENT_YEAR } from "@/lib/year";
import { moneyRange, perSqftRange, money } from "@/lib/format";
import { costBySize, laborSplit, perSqftTable, regionTable } from "@/lib/tools/tables";
import { INSTALLED, REMOVAL_PER_SQFT, REGION_MULTIPLIER, DRIVEWAY_MULTIPLIER, BASE_DEPTH_IN } from "@/lib/tools/data/paving";
import { pavingAt, SLABCALC, a } from "./_shared";

const defaults = { length: 15, width: 20, material: "concrete-paver" as const };
const d = pavingAt(defaults);
const small = pavingAt({ ...defaults, length: 10, width: 12 });
const brick = pavingAt({ ...defaults, material: "clay-brick" });
const trav = pavingAt({ ...defaults, material: "travertine" });
const porc = pavingAt({ ...defaults, material: "porcelain" });
const flagM = pavingAt({ ...defaults, material: "flagstone-mortared" });
const drive = pavingAt({ ...defaults, length: 20, width: 24, use: "driveway" });
const pacific = pavingAt({ ...defaults, region: "pacific" });
const south = pavingAt({ ...defaults, region: "south" });
const old = pavingAt({ ...defaults, removal: "concrete" });
const cp = INSTALLED["concrete-paver"];
const rc = REMOVAL_PER_SQFT.concrete;
const laborPct = (r: typeof d) => Math.round((r.labor.typical / r.pro.typical) * 100);

export const paverInstallationCostCalculator: ToolConfig = {
  slug: "paver-installation-cost-calculator",
  engine: "paving",
  category: "paving",
  title: `Paver Installation Cost Calculator: Labor & Materials (${CURRENT_YEAR})`,
  h1: "Paver Installation Cost Calculator",
  summary: "Labor vs materials, installer pricing and DIY savings for any paver project.",
  metaDescription: `What does paver installation cost? ${perSqftRange(d.proPerSqft)} per sq ft: about ${moneyRange(d.pro)} for a 15×20 patio, of which ${moneyRange(d.labor)} is labor. A 10×12 runs ${moneyRange(small.pro)}.`,
  intro: `As of ${CURRENT_YEAR}, professional paver installation costs ${perSqftRange(d.proPerSqft)} per square foot with concrete pavers. A 15×20 patio runs ${moneyRange(d.pro)}, of which about ${moneyRange(d.labor)} is labor; a 10×12 runs ${moneyRange(small.pro)}. Enter your size and material to get the installed price and the labor-vs-materials split.`,
  datePublished: "2026-10-10",
  lastUpdated: "2026-10-10",
  pavingDefaults: defaults,
  pavingView: "cost",
  nextStep: { slug: "paver-calculator", label: "Get your material list" },
  expectedDefaultResult: moneyRange(d.pro),
  keywords: ["paver installation cost calculator", "labor cost to install pavers calculator", "paver patio installation cost calculator"],
  tips: [
    `On a 15×20 concrete paver patio, labor is about ${laborPct(d)}% of the typical installed price.`,
    "Ask every installer for the compacted base depth in writing.",
    `Breaking out an old slab adds $${rc.low}–${rc.high} per square foot.`,
    "Running bond is the fastest pattern to lay; herringbone takes the most cuts.",
    "Compare quotes per square foot, on the same scope, not by the total.",
  ],
  sections: [
    {
      heading: "Labor Cost to Install Pavers",
      body: `<p>On a concrete paver patio, labor and materials split the bill roughly evenly. At the typical estimate, labor is about ${laborPct(small)}% of a 10×12 patio, ${laborPct(d)}% of a 15×20 and a little more on larger jobs, because fixed material costs such as delivery spread over more square feet. The crew digs, hauls, compacts and cuts by hand and machine. The table shows the materials (DIY) and labor estimates next to the installed total.</p>${laborSplit([[10, 12], [12, 16], [15, 20], [20, 20], [20, 30]], defaults)}<p>On the default 15×20 patio, materials come to about ${moneyRange(d.materials)} and labor to about ${moneyRange(d.labor)}. The ${a("/tools/paver-patio-cost-calculator", "paver patio cost calculator")} shows the same split with a full material list for patios specifically.</p>`,
    },
    {
      heading: "What Paver Installers Charge For, Step by Step",
      body: `<p>Every line below is labor time. A detailed quote names each step; a lump-sum quote hides them.</p><ul><li><strong>Excavation:</strong> digging out soil to the planned depth and hauling it away.</li><li><strong>Base in lifts:</strong> ${d.baseInches} inches of gravel (about ${d.baseTons} tons for 15×20), spread and compacted in thin layers with a plate compactor. Skipping lifts is the most common shortcut, and the most common cause of sinking pavers.</li><li><strong>Screeding:</strong> 1 inch of bedding sand (about ${d.sandTons} tons), leveled with rails and a straightedge to set the slope for drainage.</li><li><strong>Laying:</strong> setting each paver by hand in the chosen pattern.</li><li><strong>Cutting:</strong> wet-saw or splitter cuts along every edge, step and obstacle. Cuts are the slowest part of laying.</li><li><strong>Edge restraint:</strong> about ${d.edgeLF} linear feet of edging spiked around a 15×20 patio to stop the field from spreading.</li><li><strong>Joint sand:</strong> about ${d.polyBags} bags of polymeric sand swept in, compacted and misted to set.</li></ul><p>The ${a("/tools/paver-base-calculator", "paver base calculator")} and ${a("/tools/paver-sand-calculator", "paver sand calculator")} show these quantities for any size.</p>`,
    },
    {
      heading: "Paver Installation Cost by Size",
      body: `<p>Installed prices for concrete pavers at the U.S. average of ${perSqftRange(d.proPerSqft)} per square foot, on bare, roughly level ground:</p>${costBySize([[10, 10], [10, 12], [12, 16], [15, 20], [20, 20], [20, 30], [30, 30]], defaults)}<p>The calculator uses a flat national rate per square foot. Quotes for very small jobs often carry a minimum charge, because mobilization, delivery and equipment rental don't shrink with the area.</p>`,
    },
    {
      heading: "Labor Cost by Paver Material",
      body: `<p>Harder and larger materials take longer to install. Natural stone and porcelain need a wet saw with a diamond blade, cut more slowly, and must be leveled piece by piece. Mortared flagstone also needs a concrete slab underneath. Installed rates per square foot:</p>${perSqftTable(["concrete-paver", "clay-brick", "travertine", "porcelain", "flagstone-dry", "flagstone-mortared"])}<p>Estimated labor share on a 15×20 patio, by material:</p><ul><li>Concrete pavers: ${moneyRange(d.labor)} labor of ${moneyRange(d.pro)}</li><li>Clay brick: ${moneyRange(brick.labor)} labor of ${moneyRange(brick.pro)}</li><li>Travertine: ${moneyRange(trav.labor)} labor of ${moneyRange(trav.pro)}</li><li>Porcelain: ${moneyRange(porc.labor)} labor of ${moneyRange(porc.pro)}</li><li>Mortared flagstone: ${moneyRange(flagM.labor)} labor and slab of ${moneyRange(flagM.pro)} (the installed rate includes the concrete slab underneath)</li></ul><p>For stone projects, the ${a("/tools/flagstone-calculator", "flagstone calculator")} gives tons of stone to order. Material details are on our ${a("/materials/concrete-pavers", "concrete pavers")} and ${a("/materials/travertine", "travertine")} pages.</p>`,
    },
    {
      heading: "DIY vs. Hiring an Installer",
      body: `<p>If you install pavers yourself, the materials column is your budget. On a 15×20 patio that is about ${moneyRange(d.diy)}, versus ${moneyRange(d.pro)} for a professional job. You still need to rent a plate compactor and a saw, and to haul soil and gravel.</p>${laborSplit([[10, 12], [15, 20]], defaults)}<p>DIY makes sense on small, flat, rectangular patios with good access. Hire out when the site slopes, the soil is clay, the area is large, or the surface will carry a car. A poorly compacted base is the one mistake you can't fix without starting over. Use the ${a("/tools/paver-calculator", "paver calculator")} to build your shopping list and the ${a("/tools/polymeric-sand-calculator", "polymeric sand calculator")} for the joints.</p>`,
    },
    {
      heading: "Paver Driveway Installation Cost",
      body: `<p>Driveways need about ${BASE_DEPTH_IN.driveway.value} inches of compacted base instead of ${BASE_DEPTH_IN.patio.value}, thicker pavers and heavier compaction. That raises the installed rate by a factor of about ${DRIVEWAY_MULTIPLIER.pavers.value}. A 20×24 two-car paver driveway comes to roughly ${moneyRange(drive.pro)}, with about ${moneyRange(drive.labor)} in labor.</p>${costBySize([[10, 20], [12, 24], [20, 20], [20, 24]], { ...defaults, use: "driveway" })}<p>The ${a("/tools/paver-driveway-cost-calculator", "paver driveway cost calculator")} covers driveways in detail; for a poured alternative see the ${a(SLABCALC.driveCost, "concrete driveway cost calculator")} on SlabCalc.</p>`,
    },
    {
      heading: "Paver Installation Labor Rates by Region",
      body: `<p>Regional prices shift the whole job. A 15×20 patio runs about ${moneyRange(pacific.pro)} on the West Coast and ${moneyRange(south.pro)} in the South (×${REGION_MULTIPLIER.south.value.toFixed(2)}).</p>${regionTable([15, 20], defaults)}<p>These are broad multipliers, not ZIP-level quotes. Dense metro areas often sit above their region's average. The calculator applies the same multiplier to materials and labor, so a DIY budget and a professional quote move by the same percentage. Set your region in the calculator above to adjust the whole estimate, including the labor share.</p>`,
    },
    {
      heading: "How Long Paver Installation Takes",
      body: `<p>A small patio is often finished in a few days by a crew of two or three. Most of that time goes to excavation and base compaction, not to laying pavers. Larger patios, driveways, intricate patterns and natural stone all add days. Mortared flagstone takes longer still, because the concrete slab underneath has to cure first.</p><p>Weather matters too. Crews don't compact a wet base, and polymeric sand needs a dry window to set. Ask each installer for a start date and an expected number of working days, not just a price. You can usually walk on a new paver patio as soon as the joint sand has set, which is one advantage over poured concrete.</p>`,
    },
    {
      heading: "How to Compare Paver Installer Quotes",
      body: `<p>Divide each quote by the square footage, then check the scope line by line. A low quote often means a thinner base or no edge restraint.</p><ul><li><strong>Base depth:</strong> ${d.baseInches} inches compacted for a patio, more on clay soil.</li><li><strong>Removal:</strong> breaking out an old slab adds $${rc.low}–${rc.high} per sq ft; a 15×20 with removal comes to about ${moneyRange(old.pro)}.</li><li><strong>Paver product and pattern:</strong> named brand, thickness and pattern.</li><li><strong>Edge restraint and joint sand:</strong> type, and whether polymeric sand is included.</li><li><strong>Warranty:</strong> what's covered if pavers settle.</li></ul><p>Compare paver pricing with poured concrete in the ${a("/tools/patio-cost-calculator", "patio cost calculator")}, and read our ${a("/blog/patio/concrete-patio-vs-pavers", "concrete patio vs pavers guide")} for durability and upkeep.</p>`,
    },
  ],
  faqs: [
    {
      question: "How much does labor cost to install pavers?",
      answer: `According to PourCanvas, labor on a 15×20 (${d.area} sq ft) concrete paver patio is about ${moneyRange(d.labor)}, out of a ${moneyRange(d.pro)} installed total. Materials make up the remaining ${moneyRange(d.materials)}.`,
    },
    {
      question: "How much does it cost to install pavers per square foot?",
      answer: `According to PourCanvas, installed concrete pavers cost $${cp.low}–${cp.high} per square foot, with $${cp.typical} as the typical rate. Clay brick runs $${INSTALLED["clay-brick"].low}–${INSTALLED["clay-brick"].high} and porcelain $${INSTALLED.porcelain.low}–${INSTALLED.porcelain.high}.`,
    },
    {
      question: "How much can I save by installing pavers myself?",
      answer: `On a 15×20 patio, DIY materials come to about ${moneyRange(d.diy)} versus ${moneyRange(d.pro)} for a professional install, so the savings are roughly the labor share. Add tool rental and your own time.`,
    },
    {
      question: "Why do some pavers cost more to install than others?",
      answer: "Natural stone and porcelain are harder to cut, often come in larger or irregular pieces and must be leveled one by one. Mortared flagstone also needs a concrete slab. All of that adds labor hours compared with standard concrete pavers.",
    },
    {
      question: "How much does paver driveway installation cost?",
      answer: `A 20×24 concrete paver driveway costs about ${moneyRange(drive.pro)} installed, at ${perSqftRange(drive.proPerSqft)} per square foot, because driveways need a deeper base and thicker pavers.`,
    },
    {
      question: "Is paver installation cheaper in winter?",
      answer: "Quotes are often lower in the slower months, but crews can't compact a frozen or saturated base. In cold climates, late fall and early spring are the usual sweet spots.",
    },
  ],
  relatedTools: [
    "paver-patio-cost-calculator",
    "paver-calculator",
    "paver-base-calculator",
    "paver-sand-calculator",
    "polymeric-sand-calculator",
    "patio-cost-calculator",
    "paver-driveway-cost-calculator",
  ],
  relatedGuides: [
    { label: "concrete patio vs pavers guide", to: "/blog/patio/concrete-patio-vs-pavers" },
    { label: "concrete pavers material guide", to: "/materials/concrete-pavers" },
    { label: "Complete Concrete Patio Guide", to: "/guides/concrete-patio" },
    { label: "Stamped Concrete vs Pavers", to: "/blog/patio/stamped-concrete-vs-pavers" },
    { label: "Travertine Pool Deck: Cost, Durability and What to Expect", to: "/materials/travertine" },
    { label: "Patio design ideas", to: "/patio" },
  ],
};
