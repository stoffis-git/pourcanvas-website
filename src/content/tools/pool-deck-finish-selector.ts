import type { ToolConfig } from "../types";
import { perSqftRange } from "@/lib/format";
import { DEFAULT_FINISH_INPUTS, rankFinishes, type FinishInputs } from "@/lib/tools/finish";
import { FINISHES, FINISH_SOURCES, GENERAL_WARNINGS, type FinishId } from "@/lib/tools/data/finish";
import { criterionTable, rankingTable } from "@/lib/tools/finishTables";
import { INSTALLED } from "@/lib/tools/data/paving";
import { SLABCALC, a } from "./_shared";

const finishDefaults: FinishInputs = { surface: "pool-deck", climate: "hot-sun", priority: "slip", style: "modern" };
const rank = (over: Partial<FinishInputs> = {}) => rankFinishes({ ...DEFAULT_FINISH_INPUTS, ...finishDefaults, ...over });
const r = rank();
const [top, second] = r;
const bare = rank({ priority: "barefoot" });
const trad = rank({ priority: "look", style: "traditional" });
const cold = rank({ climate: "freeze-thaw" });
const pick = (list: typeof r, id: FinishId) => list.find((f) => f.id === id)!;
const F = (id: FinishId) => FINISHES.find((f) => f.id === id)!;
const src = (prefix: string) => FINISH_SOURCES.find((s) => s.label.startsWith(prefix))!.url;
const ext = (url: string, text: string) => `<a href="${url}" rel="nofollow noopener">${text}</a>`;
const KOOL_DECK = "https://mortex.com/pdf/KoolDeckInstructions.pdf";
const ANSI = "https://safetydirectamerica.com/2022-revised-ansi-a326-3-has-five-situation-specific-dcof-minimums-and-crucial-caveats/";
const saltWhy = F("salt").avoid[0].reason.split(": ").slice(1).join(": ");
const plain = INSTALLED["plain-concrete"];
const agg = INSTALLED["exposed-aggregate"];
const stamp = INSTALLED["stamped-concrete"];

export const poolDeckFinishSelector: ToolConfig = {
  slug: "pool-deck-finish-selector",
  engine: "finish",
  category: "finish",
  title: "Pool Deck Finish Selector: Slip, Heat & Upkeep Compared",
  h1: "Pool Deck Finish Selector",
  summary: "Rank concrete pool deck finishes for slip resistance, barefoot heat, climate and style.",
  metaDescription: `Which pool deck finishes grip and stay cool? In hot sun, ${top.name.toLowerCase()} scores ${top.score}/100 for slip safety; for bare feet, ${bare[0].name.toLowerCase()} leads at ${bare[0].score}/100.`,
  intro: `For a sunny pool deck where slip resistance comes first, ${top.name} scores ${top.score}/100: it sits in the top wet slip-resistance class and needs only an optional sealer. ${second.name} is close at ${second.score}. If bare feet matter most, ${bare[0].name} leads at ${bare[0].score}. Pick your climate, priority and style to rank every finish.`,
  datePublished: "2026-10-10",
  lastUpdated: "2026-10-10",
  finishDefaults,
  expectedDefaultResult: top.name,
  keywords: ["pool deck finishes", "pool deck finish selector", "slip resistant pool deck", "best pool deck material", "pool deck heat"],
  tips: [
    "Ask for a light broom near the water; a medium broom can feel harsh barefoot.",
    "On exposed aggregate, choose small or polished stones.",
    "Seal pool decks with a penetrating sealer, not a glossy film.",
    "Pick light colors in hot sun; dark tones run much hotter.",
    "Keep stamped patterns textured and add grit to any film sealer.",
  ],
  sections: [
    {
      heading: "Pool Deck Finishes Ranked for Slip Resistance",
      body: `<p>Pool decks weight slip resistance and barefoot heat more than any other surface. With hot sun and slip resistance as the priority, the selector ranks the finishes like this:</p>${rankingTable(finishDefaults)}<p>${top.name} and ${second.name} finish within a few points of each other. Broom is the baseline price for poured concrete, while exposed aggregate costs more but hides stains. Our ${a("/blog/patio/best-concrete-finish-pool-deck", "guide to the best concrete finish for pool decks")} walks through each option with photos.</p>`,
    },
    {
      heading: "Pool Deck Finishes Ranked for Bare Feet",
      body: `<p>Switch the priority to barefoot comfort and the order changes: the mild textures move up and the coarse ones drop.</p>${rankingTable({ ...finishDefaults, priority: "barefoot" })}<p>${bare[0].name} keeps good wet grip with a texture that is comfortable underfoot. ${pick(bare, "exposed-aggregate").name} drops to ${pick(bare, "exposed-aggregate").score}/100 here unless you choose small or polished stones. See a ${a("/inspiration/pool-deck-broom-finish", "broom finish pool deck")} for the look.</p>`,
    },
    {
      heading: "Slip-Resistant Pool Deck Requirements",
      body: `<p>The International Swimming Pool and Spa Code requires slip-resistant decks around pools but does not rate individual concrete finishes. ANSI A326.3, a test method for hard-surface flooring such as tile, recommends a minimum wet friction value (DCOF) of 0.55 for level exterior wet areas, with caveats (${ext(ANSI, "summary of the 2022 revision")}). No published table rates concrete finishes against it, so texture and sealer choice decide real-world grip.</p>${criterionTable("slip")}<p>${F("broom").name} and ${F("exposed-aggregate").name.toLowerCase()} score ${F("broom").scores.slip}/5. Smooth troweled concrete scores ${F("smooth").scores.slip}/5 and is ruled out. Details on texture levels: ${a("/materials/broom-finish", "broom finish concrete")}.</p>`,
    },
    {
      heading: "Is Stamped Concrete Slippery Around a Pool?",
      body: `<p>It can be. According to ${ext(src("Concrete Decor: Fixing Slippery"), "Concrete Decor")}, a slick stamped pool deck is usually caused by the sealer, not the stamp. Flat patterns are the worst; grit additives help but do not make the surface nonslip. Even a traditional-style pool deck ranks stamped below the textured finishes:</p>${rankingTable({ ...finishDefaults, priority: "look", style: "traditional" })}<p>With a traditional look as the priority, ${trad[0].name} leads at ${trad[0].score}/100 and stamped scores ${pick(trad, "stamped").score}. If you want stamped, ${F("stamped").warn[0].reason.toLowerCase()}. Patterns and pricing: ${a("/materials/stamped-concrete", "stamped concrete")}.</p>`,
    },
    {
      heading: "Pool Deck Heat: Color Matters More Than Texture",
      body: `<p>Texture changes how a deck feels; color decides how hot it gets. New gray concrete reflects 30–50% of sunlight. In ${ext(src("Solomon"), "Solomon Colors' integral color tests")}, white-pigmented concrete reflected 52–59% of sunlight, while dark tones like slate and bark reflected 15–22%, roughly half or less. Concrete Network reports that dark brick and tile decks get extremely hot.</p>${criterionTable("heat")}<p>${GENERAL_WARNINGS[1]} Lighter tints are covered in ${a("/materials/colored-concrete", "colored concrete")}.</p>`,
    },
    {
      heading: "Cool Deck Coatings",
      body: `<p>Cool deck toppings come in two kinds. According to the ${ext(KOOL_DECK, "Mortex contractor brochure")}, Keystone Kool Deck is a cement topping splashed onto fresh concrete on the day of the pour, so it is a new-construction choice. Generic spray-applied cool deck coatings go over new or existing slabs. Mortex says Kool Deck significantly lowers the surface temperature of concrete; that is a manufacturer claim without a published figure, and most of the cooling comes from light color. The selector does not score coatings, so treat a cool deck as an add-on to a light-colored base finish. Our ${a("/blog/patio/cool-deck-vs-kool-deck", "cool deck vs Kool Deck comparison")} covers installation, heat and grip.</p>`,
    },
    {
      heading: "Pool Deck Finishes in Freeze-Thaw Climates",
      body: `<p>Northern pool decks face winter as well as wet feet. With a freeze-thaw climate set, salt finish drops out and broom moves further ahead:</p>${rankingTable({ ...finishDefaults, climate: "freeze-thaw" })}<p>${cold[0].name} scores ${cold[0].score}/100. Salt finish is ranked last here because ${saltWhy}.</p>`,
    },
    {
      heading: "Best Pool Deck Material: Concrete, Travertine or Pavers",
      body: `<p>Poured concrete is the budget choice: about ${perSqftRange(plain)} per square foot installed for a plain finish, ${perSqftRange(agg)} for exposed aggregate and ${perSqftRange(stamp)} for stamped. Travertine pavers are the most common stone alternative; see our ${a("/materials/travertine", "travertine pool deck guide")}. Price a concrete deck with SlabCalc's ${a(SLABCALC.poolDeckCost, "concrete pool deck cost calculator")}, or compare pavers in the ${a("/tools/paver-patio-cost-calculator", "paver patio cost calculator")}. More layouts: ${a("/blog/patio/pool-deck-ideas-concrete", "concrete pool deck ideas")}.</p>`,
    },
    {
      heading: "Pool Deck Sealing and Upkeep",
      body: `<p>Pool water, sunscreen and chlorine splash all reach the deck. Penetrating sealers keep more grip than film-forming ones, and grit in a film sealer wears off and must be renewed at each reseal.</p>${criterionTable("upkeep")}<p>For finishes on other surfaces, use the ${a("/tools/concrete-finish-selector", "concrete finish selector")}. Scoring sources are on our ${a("/methodology", "methodology page")}.</p>`,
    },
  ],
  faqs: [
    {
      question: "Which pool deck finish ranks highest in hot sun?",
      answer: `According to PourCanvas, ${top.name} scores ${top.score}/100 for a sunny pool deck where slip resistance comes first, just ahead of ${second.name} at ${second.score}. Ask for a light broom near the water if bare feet matter.`,
    },
    {
      question: "Is exposed aggregate too rough for bare feet?",
      answer: `According to PourCanvas, exposed aggregate drops to ${pick(bare, "exposed-aggregate").score}/100 on a sunny pool deck when barefoot comfort is the priority, because large stones feel rough. Small or polished stones (about 1/8 inch) make it much kinder to feet.`,
    },
    {
      question: "Is stamped concrete slippery around a pool?",
      answer: "It can be, mostly because of glossy film sealers. Use an aggressive textured pattern, a penetrating or low-solids sealer and a grit additive, and renew the grit at each reseal.",
    },
    {
      question: "What color concrete stays coolest around a pool?",
      answer: "White and other light integral colors reflect the most sunlight and stay coolest. Dark tones such as charcoal or slate reflect roughly half as much and run noticeably hotter.",
    },
    {
      question: "Is a salt finish good for a pool deck?",
      answer: `In warm climates, yes: pool contractors favor its non-skid, barefoot-friendly texture, and it ranks ${pick(r, "salt").score}/100 here. In freeze-thaw areas the selector avoids it because water in the pits freezes and spalls.`,
    },
    {
      question: "Does a pool deck need to be slip resistant?",
      answer: "Yes. The International Swimming Pool and Spa Code requires slip-resistant decks. A textured broom, exposed aggregate or salt finish with a penetrating sealer meets that intent better than smooth or glossy-sealed concrete.",
    },
  ],
  relatedTools: [
    "concrete-finish-selector",
    "driveway-finish-selector",
    "paver-patio-cost-calculator",
    "patio-cost-calculator",
    "paver-calculator",
    "flagstone-calculator",
    "paver-installation-cost-calculator",
  ],
  relatedGuides: [
    { label: "guide to the best concrete finish for pool decks", to: "/blog/patio/best-concrete-finish-pool-deck" },
    { label: "concrete pool deck ideas", to: "/blog/patio/pool-deck-ideas-concrete" },
    { label: "Travertine Pool Deck: Cost, Durability and What to Expect", to: "/materials/travertine" },
    { label: "Broom Finish Concrete: Cost, Texture and Best Uses", to: "/materials/broom-finish" },
    { label: "Exposed Aggregate Concrete: Cost, Looks and Finish Guide", to: "/materials/exposed-aggregate" },
    { label: "Exposed Aggregate vs Broom Finish: Cost, Look & Durability", to: "/blog/patio/exposed-aggregate-vs-broom-finish" },
  ],
};
