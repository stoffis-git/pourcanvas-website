import type { ToolConfig } from "../types";
import { perSqftRange } from "@/lib/format";
import { DEFAULT_FINISH_INPUTS, rankFinishes, type FinishInputs } from "@/lib/tools/finish";
import { FINISHES, FINISH_SOURCES, GENERAL_WARNINGS, type FinishId } from "@/lib/tools/data/finish";
import { criterionTable, rankingTable } from "@/lib/tools/finishTables";
import { INSTALLED } from "@/lib/tools/data/paving";
import { SLABCALC, a } from "./_shared";

const finishDefaults: FinishInputs = { surface: "driveway", climate: "freeze-thaw", priority: "upkeep", style: "modern" };
const rank = (over: Partial<FinishInputs> = {}) => rankFinishes({ ...DEFAULT_FINISH_INPUTS, ...finishDefaults, ...over });
const r = rank();
const [top, second] = r;
const hot = rank({ climate: "hot-sun" });
const wet = rank({ climate: "wet" });
const modern = rank({ priority: "look" });
const natural = rank({ priority: "look", style: "natural" });
const pick = (list: typeof r, id: FinishId) => list.find((f) => f.id === id)!;
const climateLeaders =
  hot[0].id === wet[0].id
    ? `${hot[0].name} leads in both hot sun (${hot[0].score}/100) and wet climates (${wet[0].score}/100).`
    : `${hot[0].name} leads in hot sun at ${hot[0].score}/100, and ${wet[0].name} leads in wet climates at ${wet[0].score}/100.`;
const F = (id: FinishId) => FINISHES.find((f) => f.id === id)!;
const src = (prefix: string) => FINISH_SOURCES.find((s) => s.label.startsWith(prefix))!.url;
const ext = (url: string, text: string) => `<a href="${url}" rel="nofollow noopener">${text}</a>`;
const broom = F("broom");
const agg = F("exposed-aggregate");
const plain = INSTALLED["plain-concrete"];
const aggCost = INSTALLED["exposed-aggregate"];
const stampCost = INSTALLED["stamped-concrete"];

export const drivewayFinishSelector: ToolConfig = {
  slug: "driveway-finish-selector",
  engine: "finish",
  category: "finish",
  title: "Best Concrete Finish for a Driveway: Free Selector Tool",
  h1: "Driveway Finish Selector",
  summary: "Rank concrete driveway finishes for your climate, upkeep, budget and style.",
  metaDescription: `What is the best concrete finish for a driveway? In freeze-thaw climates, ${top.name.toLowerCase()} scores ${top.score}/100 for low upkeep; salt and smooth are ruled out.`,
  intro: `In a freeze-thaw climate where low upkeep matters most, ${top.name} is the best concrete driveway finish at ${top.score}/100: the standard exterior finish for air-entrained concrete, with only an optional sealer. ${second.name} follows at ${second.score}; salt and smooth finishes are ruled out. Enter your climate, priority and style to rank every finish.`,
  datePublished: "2026-10-10",
  lastUpdated: "2026-10-10",
  finishDefaults,
  expectedDefaultResult: top.name,
  keywords: ["best concrete finish for driveway", "concrete driveway finishes", "modern concrete driveway finishes", "broom finish vs exposed aggregate driveway", "driveway finish selector"],
  tips: [
    "Order air-entrained concrete for any driveway that sees frost.",
    "Use sand, not deicer, during the driveway's first winter.",
    "Never use ammonium- or magnesium-based deicers on concrete.",
    "Broom across the slope so tires and shoes grip on the way up.",
    "Seal with a breathable penetrating sealer in late summer.",
  ],
  sections: [
    {
      heading: "Best Concrete Finish for a Driveway",
      body: `<p>Driveways weight slip resistance, freeze-thaw durability, upkeep and cost equally and care little about barefoot heat. In a freeze-thaw climate with low upkeep as the priority, the finishes rank like this:</p>${rankingTable(finishDefaults)}<p>${top.name} and ${second.name} are nearly tied; a medium broom grips a little better on a sloped drive. See ${a("/materials/broom-finish", "broom finish concrete")} for texture options.</p>`,
    },
    {
      heading: "Concrete Driveway Finishes by Climate",
      body: `<p>Change the climate and the gaps change. In hot sun, freeze-thaw durability counts for little and heat counts a little more:</p>${rankingTable({ ...finishDefaults, climate: "hot-sun" })}<p>In a wet, rainy climate slip resistance gains weight:</p>${rankingTable({ ...finishDefaults, climate: "wet" })}<p>${climateLeaders} A salt finish is allowed outside snow country, where it scores ${pick(hot, "salt").score}/100 in hot sun (example: ${a("/inspiration/salt-finish-driveway-tan", "tan salt finish driveway")}).</p>`,
    },
    {
      heading: "Freeze-Thaw and Deicer Rules for Driveways",
      body: `<p>In cold climates the mix and the winter care matter as much as the finish. ${ext(src("NRMCA"), "NRMCA")} recommends 4,000 psi, air-entrained concrete (about 6% air for 3/4 to 1 inch aggregate), a broom finish rather than steel troweling, no deicers in the first winter, and never ammonium sulfate, ammonium nitrate or magnesium-based salts. Hose off salt tracked onto the drive.</p>${criterionTable("freezeThaw")}<p>${GENERAL_WARNINGS[0]}</p>`,
    },
    {
      heading: "Broom Finish vs Exposed Aggregate Driveway",
      body: `<p>Both score ${broom.scores.slip}/5 for wet grip. Broom scores ${broom.scores.freezeThaw}/5 for freeze-thaw against ${agg.scores.freezeThaw}/5 for exposed aggregate, and ${broom.scores.cost}/5 against ${agg.scores.cost}/5 on cost. Exposed aggregate hides stains better and needs a sealer to help hold its stones.</p><p>In snow country, the selector warns that ${agg.warn[0].reason.toLowerCase()}. The evidence for that is weak: it comes from contractor and forum reports, not testing. With a natural style as the priority, ${natural[0].name} leads at ${natural[0].score}/100. Read more in ${a("/blog/driveway/exposed-aggregate-driveway", "exposed aggregate driveway pros and cons")} and ${a("/blog/patio/exposed-aggregate-vs-broom-finish", "exposed aggregate vs broom finish")}.</p>`,
    },
    {
      heading: "Stamped Concrete Driveways and Sealer Whitening",
      body: `<p>Stamped concrete scores ${pick(r, "stamped").score}/100 with these settings because it relies on a sealer. ${ext(src("Concrete Decor: Using Sealers"), "Concrete Decor")} explains that too much surface water breaks down film sealers and turns colored concrete white, and recommends a slope of 1/4 inch per foot so water does not puddle. ${F("stamped").notes.freezeThaw}. If you want the look, see ${a("/blog/driveway/stamped-concrete-driveway", "stamped concrete driveway ideas")}.</p>`,
    },
    {
      heading: "Salt Finish Driveways in Snow Country",
      body: `<p>A salt finish presses rock salt into fresh concrete and washes it out, leaving small pits. ${ext(src("Concrete Network: Rock Salt"), "Concrete Network")} notes that in freezing areas water collects in the pits and freezes, which can spall the surface. The selector therefore ranks it last on driveways in freeze-thaw climates.</p>`,
    },
    {
      heading: "Modern Concrete Driveway Finishes",
      body: `<p>For a clean, modern look the selector favors finer textures. With a modern style as the priority in a freeze-thaw climate:</p>${rankingTable({ ...finishDefaults, priority: "look" })}<p>${modern[0].name} leads at ${modern[0].score}/100. Darker integral color is popular on modern drives; heat counts little on a driveway, but ${GENERAL_WARNINGS[1].charAt(0).toLowerCase() + GENERAL_WARNINGS[1].slice(1)} See ${a("/blog/driveway/modern-driveway-ideas", "modern driveway ideas")} and ${a("/blog/driveway/black-concrete-driveway", "black concrete driveway ideas")}.</p>`,
    },
    {
      heading: "Driveway Finish Maintenance",
      body: `<p>Low upkeep means little sealing and easy cleaning. Broom grooves trap some dirt but need only an optional penetrating sealer; stamped is resealed every few years.</p>${criterionTable("upkeep")}`,
    },
    {
      heading: "Concrete Driveway Finish Cost",
      body: `<p>Broom is the baseline price. Plain concrete runs about ${perSqftRange(plain)} per square foot installed, exposed aggregate ${perSqftRange(aggCost)} and stamped ${perSqftRange(stampCost)}, before the extra thickness a driveway needs. For a full estimate, use SlabCalc's ${a(SLABCALC.driveCost, "concrete driveway cost calculator")}; for pavers, the ${a("/tools/paver-driveway-cost-calculator", "paver driveway cost calculator")}. Other surfaces: ${a("/tools/concrete-finish-selector", "concrete finish selector")}. Scoring sources: ${a("/methodology", "methodology")}.</p>`,
    },
  ],
  faqs: [
    {
      question: "What is the best concrete finish for a driveway?",
      answer: `According to PourCanvas, ${top.name} scores ${top.score}/100 for a low-upkeep driveway in a freeze-thaw climate, with ${second.name} at ${second.score}. In hot sun, ${hot[0].name} leads at ${hot[0].score}/100.`,
    },
    {
      question: "Is a broom finish or exposed aggregate better for a driveway?",
      answer: `According to PourCanvas, broom wins on low upkeep in a freeze-thaw climate (${pick(r, "broom").score}/100 versus ${pick(r, "exposed-aggregate").score}/100) because it costs less and holds up to freezing better. Exposed aggregate hides stains better and leads when a natural look is the priority.`,
    },
    {
      question: "Does salt finish concrete hold up on a driveway in cold climates?",
      answer: "No. Water collects in the pits, freezes and can spall the surface, so the selector rules it out for driveways in freeze-thaw climates. It works in warm, dry regions.",
    },
    {
      question: "Can you use deicer on a new concrete driveway?",
      answer: "Not in the first winter; use sand for traction. After that, sodium or calcium chloride in moderation is acceptable, but never ammonium- or magnesium-based deicers.",
    },
    {
      question: "Why does a stamped concrete driveway turn white?",
      answer: "Usually the film sealer is failing. Water trapped under or on the sealer breaks it down and it turns cloudy white. Good slope, a breathable sealer and no deicers in the first winter help prevent it.",
    },
    {
      question: "What is the best finish for a modern concrete driveway?",
      answer: `With a modern look as the priority in a freeze-thaw climate, ${modern[0].name} leads at ${modern[0].score}/100. Smooth steel-troweled concrete looks the most modern but is too slippery outdoors.`,
    },
  ],
  relatedTools: [
    "concrete-finish-selector",
    "pool-deck-finish-selector",
    "paver-driveway-cost-calculator",
    "patio-cost-calculator",
    "paver-walkway-cost-calculator",
    "paver-base-calculator",
    "paver-calculator",
  ],
  relatedGuides: [
    { label: "exposed aggregate driveway guide", to: "/blog/driveway/exposed-aggregate-driveway" },
    { label: "modern driveway ideas", to: "/blog/driveway/modern-driveway-ideas" },
    { label: "Black Concrete Driveway Ideas: Photos, Cost, Pros & Cons", to: "/blog/driveway/black-concrete-driveway" },
    { label: "Broom Finish Concrete: Cost, Texture and Best Uses", to: "/materials/broom-finish" },
    { label: "Exposed Aggregate vs Broom Finish: Cost, Look & Durability", to: "/blog/patio/exposed-aggregate-vs-broom-finish" },
    { label: "Concrete Driveway Design Guide: Finishes, Costs & Ideas", to: "/guides/concrete-driveway" },
  ],
};
