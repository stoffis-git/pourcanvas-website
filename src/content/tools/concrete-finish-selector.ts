import type { ToolConfig } from "../types";
import { perSqftRange } from "@/lib/format";
import { AVOID_PENALTY, DEFAULT_FINISH_INPUTS, PRIORITY_MULTIPLIER, rankFinishes, type FinishInputs } from "@/lib/tools/finish";
import { FINISHES, FINISH_SOURCES, GENERAL_WARNINGS, type FinishId } from "@/lib/tools/data/finish";
import { criterionTable, rankingTable, scoreMatrix } from "@/lib/tools/finishTables";
import { INSTALLED } from "@/lib/tools/data/paving";
import { a } from "./_shared";

const finishDefaults: FinishInputs = { surface: "patio", climate: "mild", priority: "upkeep", style: "modern" };
const rank = (over: Partial<FinishInputs> = {}) => rankFinishes({ ...DEFAULT_FINISH_INPUTS, ...finishDefaults, ...over });
const r = rank();
const [top, second] = r;
const walk = rank({ surface: "walkway", priority: "slip" })[0];
const drive = rank({ surface: "driveway", priority: "upkeep" })[0];
const pool = rank({ surface: "pool-deck", priority: "slip" })[0];
const cold = rank({ climate: "freeze-thaw" });
const scoreOf = (list: typeof r, id: FinishId) => list.find((f) => f.id === id)!.score;
const F = (id: FinishId) => FINISHES.find((f) => f.id === id)!;
const src = (prefix: string) => FINISH_SOURCES.find((s) => s.label.startsWith(prefix))!.url;
const ext = (url: string, text: string) => `<a href="${url}" rel="nofollow noopener">${text}</a>`;
const FINISH_COST = "https://www.slabcalc.co/calculators/finish-type-cost-estimator";
const plain = INSTALLED["plain-concrete"];
const agg = INSTALLED["exposed-aggregate"];
const stamp = INSTALLED["stamped-concrete"];

export const concreteFinishSelector: ToolConfig = {
  slug: "concrete-finish-selector",
  engine: "finish",
  category: "finish",
  title: "Types of Concrete Finishes: Best Finish Selector Tool",
  h1: "Concrete Finish Selector",
  summary: `Rank ${FINISHES.length} outdoor concrete finishes for your surface, climate, priority and style.`,
  metaDescription: `What is the best concrete finish? For a low-upkeep patio: ${top.name.toLowerCase()}, ${top.score}/100. For a slip-safe walkway: ${walk.name.toLowerCase()}, ${walk.score}/100. Rank all ${FINISHES.length}.`,
  intro: `The best concrete finish depends on where it goes. For a low-upkeep modern patio in a mild climate, ${top.name} scores highest at ${top.score}/100: ${top.reasons[0].toLowerCase()}. ${second.name} follows at ${second.score}. Smooth steel-trowel is ruled out outdoors. Pick your surface, climate, priority and style to rank all ${FINISHES.length} finishes.`,
  datePublished: "2026-10-10",
  lastUpdated: "2026-10-10",
  finishDefaults,
  expectedDefaultResult: top.name,
  keywords: ["types of concrete finishes", "concrete finishes", "best concrete finish", "outdoor concrete finishes", "concrete finish selector"],
  tips: [
    "Broom across the walking direction: the grooves grip best that way.",
    "Choose a penetrating sealer over a glossy film sealer on any walking surface.",
    "Ask for air-entrained concrete wherever winters freeze.",
    "Use integral color or stain outdoors, never dye.",
    "Light colors stay cooler underfoot than dark ones in full sun.",
  ],
  sections: [
    {
      heading: "Types of Concrete Finishes for Outdoor Surfaces",
      body: `<p>The selector compares the ${FINISHES.length} finishes homeowners are usually offered for patios, driveways, walkways and pool decks. Each is scored from 1 to 5 on five sourced criteria (higher is better for you). Style fit is scored separately because it depends on the look you want.</p>${scoreMatrix()}<p>Broom and exposed aggregate score well across the board. Stamped concrete trades upkeep and cost for looks, and a salt finish is strong everywhere except in freezing weather. See ${a("/materials/broom-finish", "broom finish concrete")} and ${a("/materials/exposed-aggregate", "exposed aggregate concrete")} for photos and details.</p>`,
    },
    {
      heading: "Most Slip-Resistant Concrete Finish",
      body: `<p>Wet grip comes from the surface texture, not the color. Research by ${ext(src("CCAA"), "Cement Concrete & Aggregates Australia")} found that broom and stamped finishes grip about the same, that broom grips best across the grain, and that penetrating sealers keep far more grip than film-forming ones. Steel-troweled concrete under a coating tested as unsatisfactory.</p>${criterionTable("slip")}<p>Medium broom and exposed aggregate score ${F("broom").scores.slip}/5. For a side-by-side look at those two, read ${a("/blog/patio/exposed-aggregate-vs-broom-finish", "exposed aggregate vs broom finish")}.</p>`,
    },
    {
      heading: "Best Concrete Finish for Freeze-Thaw Climates",
      body: `<p>In snow country the mix matters as much as the finish. ${ext(src("NRMCA"), "NRMCA")} calls for air-entrained concrete (about 6% air for 3/4 to 1 inch aggregate) on slabs exposed to freezing and deicers, says a broom finish is adequate for most exterior surfaces, and advises against steel troweling.</p>${criterionTable("freezeThaw")}<p>With a freeze-thaw climate set, a patio's salt finish drops to ${scoreOf(cold, "salt")}/100 and carries a sealer warning. ${GENERAL_WARNINGS[0]}</p>`,
    },
    {
      heading: "Concrete Finish Heat and Color",
      body: `<p>Surface heat follows color far more than texture. ${ext(src("LBNL Heat Island"), "Lawrence Berkeley National Laboratory")} reports that new gray concrete reflects 30–50% of sunlight, and that a light pavement measured about 30 °F cooler than a dark one beside it. Solomon Colors' tests show dark integral colors reflect roughly half as much sunlight as light tones.</p>${criterionTable("heat")}<p>On exposed aggregate the heat follows the stone, so a pale stone stays cooler. For tint choices, see ${a("/materials/colored-concrete", "colored concrete")}.</p>`,
    },
    {
      heading: "Concrete Finish Maintenance and Sealing",
      body: `<p>Upkeep scores reward finishes that need little sealing and clean easily. Stamped concrete is the most work because its color and pattern rely on a sealer that needs renewing; broom only needs an optional penetrating sealer.</p>${criterionTable("upkeep")}<p>Our ${a("/blog/patio/concrete-patio-sealing", "guide to sealing a concrete patio")} covers sealer types, timing and cost.</p>`,
    },
    {
      heading: "Concrete Finishes to Avoid Outdoors",
      body: `<ul><li><strong>Smooth steel trowel:</strong> ${F("smooth").avoid[0].reason.toLowerCase()}. The selector ranks it last with a ${Math.round(AVOID_PENALTY * 100)}% score penalty on every surface.</li><li><strong>Salt finish in freeze-thaw climates:</strong> ${F("salt").avoid[0].reason.split(": ").slice(1).join(": ")}. It is avoided on driveways, walkways and pool decks there, and allowed on a patio only with a waterproofing sealer.</li><li><strong>Dye for outdoor color:</strong> ${GENERAL_WARNINGS[2].toLowerCase()}</li><li><strong>Glossy film sealers on walking surfaces:</strong> they make even textured finishes slick when wet.</li></ul><p>Salt finish photos: ${a("/inspiration/salt-finish-concrete-patio", "salt finish concrete patio")}.</p>`,
    },
    {
      heading: "Best Concrete Finish by Surface",
      body: `<p>Each surface weights the criteria differently: pool decks put slip and barefoot heat first, driveways weight durability and upkeep. Here is how the finishes rank with each surface's usual priority in a mild climate.</p><p><strong>Patio (low upkeep, modern style):</strong></p>${rankingTable({ ...finishDefaults })}<p><strong>Driveway (low upkeep):</strong> ${drive.name} leads at ${drive.score}/100.</p>${rankingTable({ ...finishDefaults, surface: "driveway", priority: "upkeep" })}<p><strong>Walkway (slip resistance):</strong> ${walk.name} at ${walk.score}/100. <strong>Pool deck (slip resistance):</strong> ${pool.name} at ${pool.score}/100, ideally lightly broomed for bare feet.</p>${rankingTable({ ...finishDefaults, surface: "pool-deck", priority: "slip" })}<p>Go deeper with the ${a("/tools/pool-deck-finish-selector", "pool deck finish selector")} and the ${a("/tools/driveway-finish-selector", "driveway finish selector")}.</p>`,
    },
    {
      heading: "Concrete Finish Cost Compared",
      body: `<p>Broom is the baseline price for poured concrete; every other finish adds a step. Plain concrete runs about ${perSqftRange(plain)} per square foot installed, exposed aggregate ${perSqftRange(agg)} and stamped ${perSqftRange(stamp)}.</p>${criterionTable("cost")}<p>For a priced estimate by finish and size, use SlabCalc's ${a(FINISH_COST, "concrete finish cost estimator")}. To compare concrete with pavers or flagstone, try the ${a("/tools/patio-cost-calculator", "patio cost calculator")}.</p>`,
    },
    {
      heading: "How the Finish Selector Scores",
      body: `<p>Each finish has five sourced scores plus an editorial style score. Your surface sets the base weight of each criterion, your climate raises or lowers freeze-thaw, heat and slip, and your priority counts ${PRIORITY_MULTIPLIER} times as much. The weighted total becomes a score out of 100. Hard rules (for example smooth trowel outdoors) rank a finish last with a ${Math.round(AVOID_PENALTY * 100)}% penalty; soft rules show a warning. Sources are listed on our ${a("/methodology", "methodology page")}.</p>`,
    },
  ],
  faqs: [
    {
      question: "What are the different types of concrete finishes?",
      answer: `The common outdoor finishes are broom (light or medium), exposed aggregate, salt, stamped, sandblasted and smooth steel-troweled. Broom is the standard; exposed aggregate and stamped are decorative; smooth trowel is meant for indoor or covered slabs.`,
    },
    {
      question: "What is the best concrete finish for a patio?",
      answer: `According to PourCanvas, ${top.name} scores ${top.score}/100 for a low-upkeep modern patio in a mild climate, ahead of ${second.name} at ${second.score}. In a freeze-thaw climate, broom and exposed aggregate hold up best.`,
    },
    {
      question: "What concrete finish is least slippery when wet?",
      answer: `According to PourCanvas, medium broom and exposed aggregate both score ${F("broom").scores.slip}/5 for wet slip resistance. Broom across the walking direction and use a penetrating sealer to keep that grip.`,
    },
    {
      question: "Does salt finish concrete hold up in cold climates?",
      answer: `Not well. Water collects in the pits, freezes and can spall the surface, so the selector avoids it on driveways, walkways and pool decks in freeze-thaw areas. On a patio it needs a waterproofing sealer and no deicers.`,
    },
    {
      question: "How often should exposed aggregate or stamped concrete be sealed?",
      answer: `Exposed aggregate with a penetrating sealer can last up to about 7–10 years; with an acrylic sealer, about every 12–36 months. Stamped concrete is usually cleaned and resealed every 2–3 years.`,
    },
    {
      question: "Which concrete finish costs the least?",
      answer: `Broom and smooth finishes cost the least because they are the baseline for poured concrete. A salt finish adds about $1 per square foot; exposed aggregate and stamped add more.`,
    },
  ],
  relatedTools: [
    "pool-deck-finish-selector",
    "driveway-finish-selector",
    "patio-cost-calculator",
    "paver-patio-cost-calculator",
    "paver-walkway-cost-calculator",
    "paver-driveway-cost-calculator",
    "flagstone-calculator",
  ],
  relatedGuides: [
    { label: "exposed aggregate vs broom finish comparison", to: "/blog/patio/exposed-aggregate-vs-broom-finish" },
    { label: "guide to the best concrete finish for pool decks", to: "/blog/patio/best-concrete-finish-pool-deck" },
    { label: "Broom Finish Concrete: Cost, Texture and Best Uses", to: "/materials/broom-finish" },
    { label: "Exposed Aggregate Concrete: Cost, Looks and Finish Guide", to: "/materials/exposed-aggregate" },
    { label: "Stamped Concrete: Cost, Patterns and When to Use It", to: "/materials/stamped-concrete" },
    { label: "How to Seal a Concrete Patio: Cost, Types & Timeline", to: "/blog/patio/concrete-patio-sealing" },
  ],
};
