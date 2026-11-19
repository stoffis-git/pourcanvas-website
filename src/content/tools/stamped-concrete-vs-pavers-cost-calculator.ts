import type { ToolConfig } from "../types";
import { CURRENT_YEAR } from "@/lib/year";
import { money, moneyRange, num, perSqftRange } from "@/lib/format";
import { calculateSvp, SVP_DEFAULT_INPUTS, type SvpInputs, type SvpResult } from "@/lib/tools/stampedVsPavers";
import { BASE_DEPTH_IN, DRIVEWAY_MULTIPLIER, INSTALLED, REGION_LABELS, REGION_MULTIPLIER, type Range, type Region } from "@/lib/tools/data/paving";
import {
  LIFESPAN_YEARS,
  PAVER_RELEVEL_PER_SQFT,
  PAVER_RELEVEL_SHARE,
  PAVER_RELEVEL_YEARS,
  PAVER_RESAND_PER_SQFT,
  PAVER_RESAND_YEARS,
  PAVER_SEAL_PER_SQFT,
  PAVER_SEAL_YEARS,
  STAMPED_CRACK_REPAIR_JOB,
  STAMPED_CRACK_REPAIR_YEARS,
  STAMPED_RESEAL_PER_SQFT,
  STAMPED_RESEAL_YEARS,
  STAMPED_SLAB_IN,
  PAVER_THICKNESS,
  STAMPED_TIER,
} from "@/lib/tools/data/lifetime";
import { pavingAt, SLABCALC, a } from "./_shared";

const svpAt = (over: Partial<SvpInputs> = {}) => calculateSvp({ ...SVP_DEFAULT_INPUTS, ...over });
const d = svpAt();
const mild = svpAt({ climate: "mild" });
const basic = svpAt({ design: "basic" });
const custom = svpAt({ design: "custom" });
const small = svpAt({ length: 12, width: 12 });
const drive = svpAt({ use: "driveway", length: 20, width: 24 });
const drive10 = svpAt({ use: "driveway", length: 20, width: 24, years: 10 });
const diy = pavingAt({ length: 15, width: 20 });

const table = (head: string[], rows: string[][]) =>
  `<table><thead><tr>${head.map((h) => `<th>${h}</th>`).join("")}</tr></thead><tbody>${rows
    .map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join("")}</tr>`)
    .join("")}</tbody></table>`;
const sqft = (r: Range) => `${perSqftRange(r)}`;
const gap = (r: SvpResult) =>
  r.cheaperUpfront === "tie" ? "about even" : `${r.cheaperUpfront === "stamped" ? "stamped" : "pavers"} ${money(r.upfrontDiff)} less`;
const pct = (n: number) => `${Math.round(n * 100)}%`;
const yrs = (r: Range) => `${r.low}–${r.high} years`;
const cheaperName = (s: SvpResult["cheaperOverYears"]) => (s === "stamped" ? "stamped concrete" : s === "pavers" ? "pavers" : "neither");

const sizes: [number, number][] = [[10, 10], [12, 12], [12, 16], [15, 20], [16, 20], [20, 20], [20, 30]];
const driveSizes: [number, number][] = [[10, 20], [20, 20], [20, 24], [24, 24]];
const horizons = [10, 20, 30] as const;
const regions = Object.keys(REGION_LABELS) as Region[];
const stampedStd = d.stamped.perSqft;
const paverStd = d.pavers.perSqft;

export const stampedConcreteVsPaversCostCalculator: ToolConfig = {
  slug: "stamped-concrete-vs-pavers-cost-calculator",
  engine: "stamped-vs-pavers",
  category: "paving",
  title: `Stamped Concrete vs Pavers Cost (${CURRENT_YEAR}): ${sqft(stampedStd)} vs ${sqft(paverStd)}/ft²`,
  h1: "Stamped Concrete vs Pavers Cost Calculator",
  summary: "Upfront and lifetime cost of stamped concrete vs pavers for your size, climate and design, with break-even year.",
  metaDescription: `Is stamped concrete cheaper than pavers? A 15×20 patio runs ${moneyRange(d.stamped.upfront)} stamped vs ${moneyRange(d.pavers.upfront)} in pavers. See upkeep, 20-year cost and break-even.`,
  intro: `As of ${CURRENT_YEAR}, stamped concrete costs ${sqft(stampedStd)} per square foot installed and concrete pavers ${sqft(paverStd)}. A 15×20 patio runs ${moneyRange(d.stamped.upfront)} stamped vs ${moneyRange(d.pavers.upfront)} in pavers; with 20 years of freeze-thaw upkeep, about ${money(d.stamped.lifetime.typical)} vs ${money(d.pavers.lifetime.typical)}. Enter your size, climate and design to compare both.`,
  datePublished: "2026-11-19",
  lastUpdated: "2026-11-19",
  svpDefaults: {},
  expectedDefaultResult: moneyRange(d.stamped.upfront),
  keywords: [
    "stamped concrete vs pavers cost",
    "stamped concrete vs pavers",
    "pavers vs concrete cost",
    "pavers vs stamped concrete price",
    "pavers vs concrete driveway",
    "cost of pavers vs stamped concrete",
  ],
  tips: [
    `Compare quotes per square foot: standard stamped runs ${sqft(STAMPED_TIER.standard)}, concrete pavers ${sqft(INSTALLED["concrete-paver"])}.`,
    `Budget a clean-and-reseal for stamped concrete every ${STAMPED_RESEAL_YEARS["freeze-thaw"].value}–${STAMPED_RESEAL_YEARS.mild.value} years at ${sqft(STAMPED_RESEAL_PER_SQFT)} per sq ft.`,
    "Ask for air-entrained concrete and control joints in the stamped quote.",
    `Pavers need a ${BASE_DEPTH_IN.patio.value} inch compacted base for patios and ${BASE_DEPTH_IN.driveway.value} inches for driveways.`,
    "Buy 5% extra pavers from the same run so repairs match.",
  ],
  sections: [
    {
      heading: "Stamped Concrete vs Pavers Cost per Square Foot",
      body: `<p>Which is cheaper depends on the stamped design and the paver you compare it with. Basic stamped concrete is the cheapest patterned surface, mid-range stamped and concrete pavers land close together, and custom stamped work costs more than concrete pavers.</p>${table(
        ["Surface (installed, patio)", "Per sq ft", "15 × 20 ft typical"],
        d.options.map((o) => [o.label, sqft(o.perSqft), money(o.total.typical)]),
      )}<p>Stamped tiers follow the cost guides' own definitions: basic is one pattern and one color with no border; mid-range adds a second color, a second pattern or a custom border; custom means layered colors and hand-tooled detail. Pick the tier that matches your quote, and look through real ${a("/blog/patio/stamped-concrete-patterns", "stamped concrete patterns")} to judge which tier a look needs.</p>`,
    },
    {
      heading: "Stamped Concrete vs Pavers Cost by Size",
      body: `<p>Installed totals for mid-range stamped concrete and concrete pavers at U.S. average rates. The last column compares the typical prices.</p>${table(
        ["Patio size", "Stamped (mid-range)", "Concrete pavers", "Typical gap"],
        sizes.map(([l, w]) => {
          const r = svpAt({ length: l, width: w });
          return [`${l} × ${w} ft (${num(r.area)} sq ft)`, moneyRange(r.stamped.upfront), moneyRange(r.pavers.upfront), gap(r)];
        }),
      )}<p>Real quotes for small patios often carry a minimum charge, because a concrete crew, pump and stamp set cost the same whether the slab is 100 or 300 square feet. Price the paver side with its full material list in the ${a("/tools/paver-patio-cost-calculator", "paver patio cost calculator")}.</p>`,
    },
    {
      heading: "Lifetime Cost: Resealing vs Joint Sand",
      body: `<p>Upkeep is where the two split. Stamped concrete needs a professional clean and reseal every ${STAMPED_RESEAL_YEARS["freeze-thaw"].value}–${STAMPED_RESEAL_YEARS.mild.value} years at ${sqft(STAMPED_RESEAL_PER_SQFT)} per sq ft to keep its color, plus an occasional crack repair. Pavers need fresh polymeric joint sand every ${PAVER_RESAND_YEARS["freeze-thaw"].value}–${PAVER_RESAND_YEARS.mild.value} years at ${sqft(PAVER_RESAND_PER_SQFT)} per sq ft and some releveling. Running totals for a 15×20 patio (mid-range stamped vs concrete pavers, typical prices):</p>${table(
        ["Years owned, climate", "Stamped", "Pavers"],
        horizons.flatMap((y) =>
          (["freeze-thaw", "mild"] as const).map((cl) => {
            const r = svpAt({ years: y, climate: cl });
            return [`${y} years, ${cl === "mild" ? "mild winters" : "freeze-thaw"}`, money(r.stamped.lifetime.typical), money(r.pavers.lifetime.typical)];
          }),
        ),
      )}<p>With basic stamped concrete the order flips over time: it starts ${money(basic.upfrontDiff)} cheaper, and the running totals cross in year ${basic.breakEvenYear ?? "—"} in a freeze-thaw climate. Sealing pavers as well (${sqft(PAVER_SEAL_PER_SQFT)} per sq ft every ${PAVER_SEAL_YEARS["freeze-thaw"].value}–${PAVER_SEAL_YEARS.mild.value} years, joint sand included) narrows the gap. Our ${a("/blog/patio/concrete-patio-sealing", "concrete patio sealing guide")} covers resealing, and the ${a("/tools/polymeric-sand-calculator", "polymeric sand calculator")} sizes a joint refill.</p>`,
    },
    {
      heading: "Pavers vs Concrete Driveway Cost",
      body: `<p>Driveways cost more per square foot for both. Stamped concrete goes from ${STAMPED_SLAB_IN.patio.value} to about ${STAMPED_SLAB_IN.driveway.value} inches thick with steel reinforcement (about ${Math.round((DRIVEWAY_MULTIPLIER.concrete.value - 1) * 100)}% more), and pavers need a ${BASE_DEPTH_IN.driveway.value} inch base instead of ${BASE_DEPTH_IN.patio.value} (about ${Math.round((DRIVEWAY_MULTIPLIER.pavers.value - 1) * 100)}% more). The pavers themselves can stay ${PAVER_THICKNESS.driveway.value} mm thick on a residential driveway; ${PAVER_THICKNESS.heavy.value} mm is for heavier traffic.</p>${table(
        ["Driveway", "Plain concrete", "Stamped (mid-range)", "Concrete pavers"],
        driveSizes.map(([l, w]) => {
          const r = svpAt({ use: "driveway", length: l, width: w });
          return [`${l} × ${w} ft`, moneyRange(r.options.find((o) => o.side === "plain")!.total), moneyRange(r.stamped.upfront), moneyRange(r.pavers.upfront)];
        }),
      )}<p>On a 20×24 two-car driveway, mid-range stamped and pavers start within ${drive.upfrontPct}% of each other; after 10 freeze-thaw winters the totals are about ${money(drive10.stamped.lifetime.typical)} vs ${money(drive10.pavers.lifetime.typical)}. Plain concrete is the budget option: price it with the ${a(SLABCALC.driveCost, "concrete driveway cost calculator")} on SlabCalc, or price pavers in detail with the ${a("/tools/paver-driveway-cost-calculator", "paver driveway cost calculator")}.</p>`,
    },
    {
      heading: "Stamped Concrete vs Pavers Cost by Region",
      body: `<p>Both are labor-heavy, so regional wage levels move both prices by the same factor, and the dollar gap grows in expensive regions.</p>${table(
        ["Region", "Factor", "Stamped (15 × 20)", "Pavers (15 × 20)"],
        regions.map((rg) => {
          const r = svpAt({ region: rg });
          return [REGION_LABELS[rg], `×${REGION_MULTIPLIER[rg].value.toFixed(2)}`, moneyRange(r.stamped.upfront), moneyRange(r.pavers.upfront)];
        }),
      )}<p>The factors are broad averages built from federal construction cost and wage data, not ZIP-level quotes; the ${a("/methodology", "methodology page")} lists every source.</p>`,
    },
    {
      heading: "Freeze-Thaw, Clay Soil and Cracking",
      body: `<p>Climate changes the upkeep more than the install price. A stamped slab is rigid: control joints decide where it cracks, but in freeze-thaw country it will crack somewhere, and deicers wear the sealer faster. Pavers flex with the ground, so frost heave shows up as uneven spots that can be lifted and relaid. Clay soil adds ${BASE_DEPTH_IN.poorSoilExtra.value} inches of base under pavers and calls for a well-compacted sub-base under a slab.</p>${table(
        ["Upkeep item", "Mild winters", "Freeze-thaw winters"],
        [
          ["Stamped: clean and reseal", `every ${STAMPED_RESEAL_YEARS.mild.value} years`, `every ${STAMPED_RESEAL_YEARS["freeze-thaw"].value} years`],
          ["Stamped: crack repair visit (allowance)", `every ${STAMPED_CRACK_REPAIR_YEARS.mild.value} years`, `every ${STAMPED_CRACK_REPAIR_YEARS["freeze-thaw"].value} years`],
          ["Pavers: polymeric joint sand", `every ${PAVER_RESAND_YEARS.mild.value} years`, `every ${PAVER_RESAND_YEARS["freeze-thaw"].value} years`],
          ["Pavers: relevel settled areas (allowance)", `${pct(PAVER_RELEVEL_SHARE.mild.value)} of the area every ${PAVER_RELEVEL_YEARS.value} years`, `${pct(PAVER_RELEVEL_SHARE["freeze-thaw"].value)} every ${PAVER_RELEVEL_YEARS.value} years`],
        ],
      )}<p>For a 15×20 patio over 20 years, freeze-thaw adds about ${money(d.stamped.upkeep.typical - mild.stamped.upkeep.typical)} to the stamped side and ${money(d.pavers.upkeep.typical - mild.pavers.upkeep.typical)} to the paver side. Weighing poured finishes for a cold climate instead? Try the ${a("/tools/driveway-finish-selector", "driveway finish selector")}.</p>`,
    },
    {
      heading: "Repair Costs: Patching a Slab vs Relaying Pavers",
      body: `<p>Repairs are the biggest practical difference. A cracked stamped slab can be sealed and patched, but the color and texture rarely match. A sunken or broken paver is lifted and reset, and spares from the same production run make the fix invisible.</p>${table(
        ["Repair", "Stamped concrete", "Pavers"],
        [
          ["Typical fix", `Crack repair and recolor, ${moneyRange(STAMPED_CRACK_REPAIR_JOB)} per visit`, `Lift and relevel, ${sqft(PAVER_RELEVEL_PER_SQFT)} per sq ft affected`],
          ["Does it show?", "Usually; the patch reads newer", "No, if spare pavers match"],
          ["Utility trench", "Saw-cut and re-pour a strip", "Lift, dig, relay the same pavers"],
          ["Weeds and ants", "None, no joints", "Possible in joints, less with polymeric sand"],
        ],
      )}<p>Expected lifespans overlap: about ${yrs(LIFESPAN_YEARS.stamped)} for stamped concrete and ${yrs(LIFESPAN_YEARS.pavers)} for pavers when maintained. Our ${a("/blog/patio/concrete-patio-crack-repair", "concrete patio crack repair guide")} explains which cracks are cosmetic.</p>`,
    },
    {
      heading: "Looks, Resale and Combining Both",
      body: `<p>Stamped concrete gives a seamless surface and can mimic slate, cobblestone or wood plank. Pavers are real units with real joints, depth and color variation, which reads as higher-end up close. No cost guide publishes a reliable resale premium for either, so choose on how you will use the space.</p>${table(
        ["If you want", "Better pick", "Why"],
        [
          ["The lowest price for a pattern", "Basic stamped", `${sqft(STAMPED_TIER.basic)} per sq ft`],
          ["Invisible repairs", "Pavers", "Units lift out and go back"],
          ["No joints to weed", "Stamped", "One continuous slab"],
          ["Brick or natural-stone character", "Clay brick or travertine pavers", `${sqft(INSTALLED["clay-brick"])} and ${sqft(INSTALLED.travertine)} per sq ft`],
          ["A paver look on a budget", "Stamped field + paver border", "Pavers only where they show most"],
        ],
      )}<p>Browse the ${a("/materials/stamped-concrete", "stamped concrete guide")} and the ${a("/materials/concrete-pavers", "concrete pavers guide")} for finishes, or let the ${a("/tools/concrete-finish-selector", "concrete finish selector")} rank poured finishes for your patio.</p>`,
    },
    {
      heading: "DIY Pavers vs Hiring Out Stamped Concrete",
      body: `<p>Stamped concrete is not a realistic DIY job: the slab has to be poured, colored, stamped and released within a short working window by a practiced crew. Pavers can be laid by a patient homeowner with a rented plate compactor, which removes the labor share of the price.</p>${table(
        ["15 × 20 ft patio", "Cost range"],
        [
          ["Stamped concrete, mid-range (contractor only)", moneyRange(d.stamped.upfront)],
          ["Concrete pavers, installed", moneyRange(diy.pro)],
          ["Concrete pavers, DIY materials + compactor rental", moneyRange(diy.diy)],
        ],
      )}<p>Get the exact paver, base and sand quantities from the ${a("/tools/paver-calculator", "paver calculator")}.</p>`,
    },
    {
      heading: "What a Stamped or Paver Quote Should Include",
      body: `<p>Two quotes are only comparable when they cover the same work. Check each line:</p>${table(
        ["Line item", "Stamped concrete", "Pavers"],
        [
          ["Base", "Compacted gravel sub-base", `${BASE_DEPTH_IN.patio.value} in compacted gravel (${BASE_DEPTH_IN.driveway.value} in for driveways) + 1 in sand`],
          ["Thickness", `${STAMPED_SLAB_IN.patio.value} in patio, ${STAMPED_SLAB_IN.driveway.value} in+ driveway with rebar`, `${PAVER_THICKNESS.patio.value} mm; ${PAVER_THICKNESS.heavy.value} mm for heavy traffic`],
          ["Color and pattern", "Integral or broadcast color, release agent, number of patterns", "Paver line, color, laying pattern, borders"],
          ["Joints and edges", "Control joints, air-entrained mix", "Edge restraint, polymeric sand"],
          ["Finish", "Sealer at install", "Sealing optional"],
          ["Removal", "Old surface and haul-away", "Old surface and haul-away"],
        ],
      )}<p>The ${a("/tools/paver-installation-cost-calculator", "paver installation cost calculator")} splits a paver quote into materials and labor, and the ${a("/tools/patio-cost-calculator", "patio cost calculator")} prices every other surface for the same size.</p>`,
    },
  ],
  faqs: [
    {
      question: "Is stamped concrete cheaper than pavers?",
      answer: `According to PourCanvas, it depends on the design. Basic stamped concrete (${sqft(STAMPED_TIER.basic)} per sq ft) is cheaper than concrete pavers (${sqft(INSTALLED["concrete-paver"])}), mid-range stamped (${sqft(STAMPED_TIER.standard)}) costs about the same, and custom stamped (${sqft(STAMPED_TIER.custom)}) costs more. On a 15×20 patio that is ${moneyRange(basic.stamped.upfront)}, ${moneyRange(d.stamped.upfront)} and ${moneyRange(custom.stamped.upfront)} vs ${moneyRange(d.pavers.upfront)} for concrete pavers.`,
    },
    {
      question: "How much would a 12×12 stamped concrete patio cost compared with pavers?",
      answer: `A 12×12 (144 sq ft) mid-range stamped concrete patio costs about ${moneyRange(small.stamped.upfront)} installed, versus ${moneyRange(small.pavers.upfront)} for concrete pavers. Small slabs often carry a contractor minimum, so expect stamped quotes near the top of that range.`,
    },
    {
      question: "How much does concrete cost vs pavers?",
      answer: `Plain poured concrete is the cheapest at ${sqft(INSTALLED["plain-concrete"])} per sq ft installed. Concrete pavers run ${sqft(INSTALLED["concrete-paver"])}, clay brick ${sqft(INSTALLED["clay-brick"])}, and stamped concrete ${sqft(INSTALLED["stamped-concrete"])} depending on the design.`,
    },
    {
      question: "What are the disadvantages of stamped concrete?",
      answer: `It cracks eventually, repairs rarely match the color, it needs resealing every ${STAMPED_RESEAL_YEARS["freeze-thaw"].value}–${STAMPED_RESEAL_YEARS.mild.value} years, it can be slippery when sealed and wet unless grit is added, and it is not a DIY job. Over 20 freeze-thaw years, upkeep on a 15×20 patio adds about ${money(d.stamped.upkeep.typical)}.`,
    },
    {
      question: "Which lasts longer, stamped concrete or pavers?",
      answer: `Pavers usually last longer: cost guides put them at ${yrs(LIFESPAN_YEARS.pavers)} versus ${yrs(LIFESPAN_YEARS.stamped)} for stamped concrete, and a paver surface can be relaid rather than replaced. Both fail early on a poorly built base.`,
    },
    {
      question: "Are pavers or stamped concrete better for a driveway?",
      answer: `According to PourCanvas, a 20×24 driveway costs ${moneyRange(drive.stamped.upfront)} in mid-range stamped concrete and ${moneyRange(drive.pavers.upfront)} in concrete pavers. Over 20 freeze-thaw winters the typical totals are ${money(drive.stamped.lifetime.typical)} vs ${money(drive.pavers.lifetime.typical)}, so ${cheaperName(drive.cheaperOverYears)} ${drive.cheaperOverYears === "pavers" ? "come" : "comes"} out ahead once upkeep is counted.`,
    },
    {
      question: "Do pavers add more value to a home than stamped concrete?",
      answer: "No cost guide publishes a reliable resale premium for either. Pavers read as higher-end up close and repair invisibly, which helps a well-kept patio show well, while a cracked or faded stamped slab hurts. Build for how you will use the space.",
    },
  ],
  relatedTools: [
    "paver-patio-cost-calculator",
    "patio-cost-calculator",
    "paver-driveway-cost-calculator",
    "paver-installation-cost-calculator",
    "polymeric-sand-calculator",
    "driveway-finish-selector",
    "concrete-finish-selector",
    "paver-calculator",
  ],
  relatedGuides: [
    { label: "stamped concrete vs pavers comparison", to: "/blog/patio/stamped-concrete-vs-pavers" },
    { label: "concrete patio vs pavers guide", to: "/blog/patio/concrete-patio-vs-pavers" },
    { label: "Stamped Concrete: Patterns, Cost and Care", to: "/materials/stamped-concrete" },
    { label: "Concrete Pavers: Cost, Styles and Installation", to: "/materials/concrete-pavers" },
    { label: "Stamped Concrete Patterns", to: "/blog/patio/stamped-concrete-patterns" },
    { label: "Stamped Concrete Driveway Cost", to: "/blog/driveway/stamped-concrete-driveway-cost" },
  ],
};
