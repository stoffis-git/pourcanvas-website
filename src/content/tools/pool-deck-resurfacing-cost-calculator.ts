import type { ToolConfig } from "../types";
import { CURRENT_YEAR } from "@/lib/year";
import { money, moneyRange, num, perSqftRange } from "@/lib/format";
import { calculatePoolDeck, DEFAULT_POOL_DECK_INPUTS, proPerSqft, type PoolDeckInputs } from "@/lib/tools/poolDeck";
import { COPING_PER_LF, CRACK_REPAIR, DECK_DIY, DECK_LIFESPAN, DECK_METHOD_LABELS, DECK_PRO, type DeckMethod } from "@/lib/tools/data/poolDeck";
import { REGION_LABELS, REGION_MULTIPLIER, REMOVAL_PER_SQFT, type Range, type Region } from "@/lib/tools/data/paving";
import { SLABCALC, a } from "./_shared";

const defaults: Partial<PoolDeckInputs> = { mode: "pool", poolLength: 32, poolWidth: 16, deckWidth: 6, method: "spray" };
const at = (over: Partial<PoolDeckInputs> = {}) => calculatePoolDeck({ ...DEFAULT_POOL_DECK_INPUTS, ...defaults, ...over });
const d = at();
const row = (m: DeckMethod, r = d) => r.compare.find((c) => c.method === m)!;
const area = (sf: number, m: DeckMethod) => at({ mode: "area", area: sf, method: m });
const minor = at({ condition: "minor" });
const coping = at({ coping: "replace" });
const big = at({ poolLength: 40, poolWidth: 20, deckWidth: 8 });

/** Span of the common resurfacing methods (resurfacer, paint, cool deck) in $/sq ft. */
const common: Range = {
  low: Math.min(DECK_PRO.resurfacer.low, DECK_PRO.paint.low, DECK_PRO.spray.low),
  typical: DECK_PRO.spray.typical,
  high: Math.max(DECK_PRO.resurfacer.high, DECK_PRO.paint.high, DECK_PRO.spray.high),
};
const yrs = (r: Range) => `${num(r.low)}–${num(r.high)} years`;
const sq = (n: number) => `${num(n)} sq ft`;
const htmlTable = (head: string[], rows: string[][]) =>
  `<table><thead><tr>${head.map((h) => `<th>${h}</th>`).join("")}</tr></thead><tbody>${rows
    .map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join("")}</tr>`)
    .join("")}</tbody></table>`;

const ALL: DeckMethod[] = ["reseal", "paint", "resurfacer", "spray", "stamped", "rubber", "pavers", "travertine", "replace"];
const pools: [number, number, number][] = [
  [12, 24, 4],
  [16, 32, 6],
  [18, 36, 6],
  [20, 40, 8],
];
const diyMethods = (Object.keys(DECK_DIY) as DeckMethod[]).sort((x, y) => DECK_PRO[x as Exclude<DeckMethod, "replace">].typical - DECK_PRO[y as Exclude<DeckMethod, "replace">].typical);
const cheapestUpfront = at({ priority: "low" });
const perYearSorted = [...d.compare].filter((c) => c.method !== "replace").sort((x, y) => x.perYear - y.perYear);

export const poolDeckResurfacingCostCalculator: ToolConfig = {
  slug: "pool-deck-resurfacing-cost-calculator",
  engine: "pool-deck",
  category: "paving",
  title: `Pool Deck Resurfacing Cost (${CURRENT_YEAR}): ${perSqftRange(common)}/Sq Ft + Calculator`,
  h1: "Pool Deck Resurfacing Cost Calculator",
  summary: "Resurfacing cost for your pool deck by method, from pool size and deck width, with lifespan and cost per year.",
  metaDescription: `How much does pool deck resurfacing cost? ${perSqftRange(common)} per sq ft for most coatings: about ${moneyRange(d.total)} for a cool deck on a 16×32 pool with a 6 ft deck.`,
  intro: `As of ${CURRENT_YEAR}, resurfacing a concrete pool deck costs ${perSqftRange(common)} per square foot for a resurfacer, paint or cool deck coating, and up to $${DECK_PRO.stamped.high} for a stamped overlay. A ${sq(d.area)} deck around a 16×32 pool runs ${moneyRange(d.total)} with a cool deck finish. Enter your pool size, deck width and method to get your cost.`,
  datePublished: "2026-11-19",
  lastUpdated: "2026-11-19",
  poolDeckDefaults: defaults,
  nextStep: { slug: "pool-deck-finish-selector", label: "Compare pool deck finishes for slip and heat" },
  expectedDefaultResult: moneyRange(d.total),
  keywords: ["pool deck resurfacing cost", "pool deck resurfacing", "cost to resurface pool deck", "cool deck resurfacing cost", "pool deck coating cost", "pool deck resurfacing cost calculator"],
  tips: [
    `Measure the deck, not the pool: a 6 ft deck around a 16×32 pool is ${sq(d.area)}.`,
    "Repair moving cracks before any coating; they show through within a season.",
    "Choose light colors around the pool; dark coatings run much hotter underfoot.",
    "Ask for grit in the sealer on any smooth, painted or stamped surface.",
    `Reseal coated decks every ${yrs(DECK_LIFESPAN.reseal)} to keep the warranty and the grip.`,
  ],
  sections: [
    {
      heading: "Pool Deck Resurfacing Cost by Method",
      body: `<p>The method sets the price more than anything else. These are installed national averages over an existing, sound concrete deck, priced for the ${sq(d.area)} deck around a 16×32 pool with a 6 ft walkway.</p>${htmlTable(
        ["Method", "Per sq ft", `${sq(d.area)} deck`, "Lasts"],
        ALL.map((m) => [DECK_METHOD_LABELS[m], perSqftRange(proPerSqft(m)), moneyRange(row(m).total), yrs(DECK_LIFESPAN[m])]),
      )}<p>Resurfacers, paint and cool deck textures are thin coatings bonded to the old slab. A ${a("/materials/stamped-concrete", "stamped")} ${a("/materials/concrete-overlay", "concrete overlay")} is thicker and can mimic stone or wood. Pavers and travertine are laid over the slab.</p>`,
    },
    {
      heading: "Pool Deck Square Footage by Pool Size",
      body: `<p>Most homeowners know their pool size, not their deck area. The calculator works it out: for a rectangular pool, the deck is the outer rectangle (pool plus the deck width on every side) minus the water. Oval, kidney and freeform pools use the pool's perimeter instead.</p>${htmlTable(
        ["Pool", "Deck width", "Deck area", "Coping", "Cool deck cost"],
        pools.map(([l, w, dw]) => {
          const r = at({ poolLength: l, poolWidth: w, deckWidth: dw });
          return [`${w} × ${l} ft`, `${dw} ft`, sq(r.area), `${num(r.copingLF)} ft`, moneyRange(r.total)];
        }),
      )}<p>Add patios, steps and paths that get the same surface to the deck area, or switch the calculator to "Enter deck area" and type the total.</p>`,
    },
    {
      heading: "Pool Deck Resurfacing Cost by Deck Size",
      body: `<p>Totals scale with area. The table compares three common resurfacing choices at typical deck sizes, at the U.S. average rate.</p>${htmlTable(
        ["Deck size", DECK_METHOD_LABELS.resurfacer, "Cool deck", "Stamped overlay"],
        [400, 600, 800, 1000, 1200].map((sf) => [sq(sf), moneyRange(area(sf, "resurfacer").total), moneyRange(area(sf, "spray").total), moneyRange(area(sf, "stamped").total)]),
      )}<p>Expect a crew minimum on very small decks.</p>`,
    },
    {
      heading: "Cost per Year: Which Pool Deck Surface Lasts Longest?",
      body: `<p>The cheapest coating is rarely the cheapest deck. Dividing the typical installed price by the typical service life shows what each year of use costs on the same ${sq(d.area)} deck:</p>${htmlTable(
        ["Method", "Typical cost", "Typical life", "Cost per year"],
        perYearSorted.map((c) => [c.label, money(c.total.typical), `${num(c.lifespan.typical, 1)} years`, money(c.perYear)]),
      )}<p>Travertine over the slab (${money(row("travertine").perYear)} a year) and a cool deck (${money(d.perYear)} a year) come out nearly even, so the cool deck wins on upfront price. Paint looks cheap but needs redoing every few years. Tearing out a sound slab is never the value play: you throw away the life left in it.</p><p>These lives assume a reseal every ${yrs(DECK_LIFESPAN.reseal)}: ${moneyRange(row("reseal").total)} per cycle on this deck from a pro, or ${moneyRange(row("reseal").diy!)} in sealer if you do it yourself. Our ${a("/blog/patio/concrete-patio-sealing", "concrete sealing guide")} covers sealer types.</p>`,
    },
    {
      heading: "Cool Deck Resurfacing Cost",
      body: `<p>Cool deck is a light, textured acrylic-cement coating sprayed or troweled onto existing concrete and knocked down into a splatter texture. Pros charge ${perSqftRange(DECK_PRO.spray)} per sq ft; a DIY kit costs about $${DECK_DIY.spray!.low}–${DECK_DIY.spray!.high} per sq ft in materials.</p>${htmlTable(
        ["Deck size", "Pro installed", "DIY materials"],
        [400, d.area, 1000].map((sf) => {
          const r = area(sf, "spray");
          return [sq(sf), moneyRange(r.total), moneyRange(r.diy!)];
        }),
      )}<p>Keystone Kool Deck itself is applied to fresh concrete; generic cool deck coatings go over old slabs. Our ${a("/blog/patio/cool-deck-vs-kool-deck", "cool deck vs Kool Deck comparison")} explains the difference.</p>`,
    },
    {
      heading: "Resurface or Replace? When an Overlay Won't Work",
      body: `<p>Every resurfacing method bonds to or rests on the old slab, so the slab has to be stable. Concrete Network lists the deal-breakers: heaving or lifting sections, settling, widespread structural cracks, a washed-out sub-base and cracks wider than about 1/4 inch.</p>${htmlTable(
        ["Deck condition", "What to do", `Added cost (${sq(d.area)})`],
        [
          ["Sound, faded or stained", "Any method", "None"],
          ["Hairline cracks, small chips", "Repair, then resurface; skip paint", moneyRange(CRACK_REPAIR.minor)],
          ["Wide cracks, heaving, sinking", "Level and repair, or replace", `${moneyRange(CRACK_REPAIR.major)}, or ${moneyRange(row("replace").total)} to replace`],
        ],
      )}<p>Tear-out runs ${perSqftRange(REMOVAL_PER_SQFT.concrete)} per sq ft before the new pour. For a full new-slab estimate, use SlabCalc's ${a(SLABCALC.poolDeckCost, "concrete pool deck cost calculator")}. Our ${a("/blog/patio/concrete-patio-resurfacing", "resurface or replace guide")} walks through the checks.</p>`,
    },
    {
      heading: "Crack Repair and Coping Replacement Costs",
      body: `<p>Two add-ons change most quotes. Crack repair is priced per job; coping is priced per linear foot of pool edge, which the calculator measures from your pool size.</p>${htmlTable(
        ["Item", "Cost", "16×32 pool example"],
        [
          ["Hairline crack and chip repair", moneyRange(CRACK_REPAIR.minor), `cool deck total ${moneyRange(minor.total)}`],
          ["Wide cracks and spalling", moneyRange(CRACK_REPAIR.major), "plus leveling if the slab settled"],
          ["Replace coping", `${perSqftRange(COPING_PER_LF)} per linear ft`, `${num(d.copingLF)} ft: ${moneyRange(coping.copingCost)}`],
        ],
      )}<p>Replace coping that is loose, cracked or sitting at the wrong height, and plan it together with pavers or travertine, which raise the deck surface. More on fixes in our ${a("/blog/patio/concrete-patio-crack-repair", "concrete crack repair guide")}.</p>`,
    },
    {
      heading: "Pool Deck Resurfacing Cost by Region",
      body: `<p>Angi puts materials at no more than 20% of a resurfacing job, so regional labor rates move the total. The multipliers below are broad averages, not ZIP-level quotes.</p>${htmlTable(
        ["Region", "Multiplier", `Cool deck, ${sq(d.area)}`],
        (Object.keys(REGION_LABELS) as Region[]).map((rg) => [REGION_LABELS[rg], `×${REGION_MULTIPLIER[rg].value.toFixed(2)}`, moneyRange(at({ region: rg }).total)]),
      )}<p>Cool deck coatings have been standard on Sun Belt pool decks for decades (Concrete Network), so experienced crews are easiest to find in the South and Southwest.</p>`,
    },
    {
      heading: "DIY vs Professional Pool Deck Resurfacing",
      body: `<p>Four methods are realistic DIY jobs. The rest need grinders, hopper guns, stamp mats or masonry skills. DIY figures are materials only; add a pressure washer and a weekend or two.</p>${htmlTable(
        ["Method", "DIY materials", "Pro installed"],
        diyMethods.map((m) => [DECK_METHOD_LABELS[m], moneyRange(row(m).diy!), moneyRange(row(m).total)]),
      )}<p>The savings are real, but prep decides whether a coating lasts: degrease, etch or grind, patch and keep the slab dry. Our ${a("/blog/patio/patio-resurfacing-cost", "patio resurfacing cost guide")} covers prep in detail.</p>`,
    },
    {
      heading: "Pool Deck Colors, Heat and Slip Resistance",
      body: `<p>Color decides how hot a resurfaced deck gets. Surface heat follows solar reflectance, the share of sunlight a surface bounces back (LBNL Heat Island Group; Solomon Colors integral color tests):</p>${htmlTable(
        ["Deck color", "Sunlight reflected", "Underfoot"],
        [
          ["White or pale tint", "52–59%", "Coolest"],
          ["Sand or buff", "37–42%", "Cool"],
          ["New gray concrete", "30–50%", "Warm"],
          ["Charcoal or slate", "15–22%", "Hottest"],
        ],
      )}<p>Texture and sealer decide wet grip: cool deck and rubberized coatings grip best, while paint, stamped overlays and glossy film sealers need grit in the topcoat (Concrete Network). The calculator's comparison table rates heat and grip for every method. See ${a("/materials/colored-concrete", "colored concrete")} for light tints, and rank finishes for your climate with the ${a("/tools/pool-deck-finish-selector", "pool deck finish selector")}.</p>`,
    },
    {
      heading: "Pavers and Travertine Over an Existing Pool Deck",
      body: `<p>A sound slab makes a good base for pavers or thin travertine, which skips excavation and gravel. Both last decades and can be repaired one unit at a time.</p>${htmlTable(
        ["Option", `${sq(d.area)} deck`, "Lasts", "Cost per year"],
        (["stamped", "pavers", "travertine"] as DeckMethod[]).map((m) => [DECK_METHOD_LABELS[m], moneyRange(row(m).total), yrs(DECK_LIFESPAN[m]), money(row(m).perYear)]),
      )}<p>On a larger 20×40 pool with an 8 ft deck (${sq(big.area)}), travertine comes to ${moneyRange(row("travertine", big).total)}. Read the ${a("/materials/travertine", "travertine pool deck guide")}, price patio pavers in the ${a("/tools/paver-patio-cost-calculator", "paver patio cost calculator")}, or browse ${a("/blog/patio/pool-deck-ideas-concrete", "concrete pool deck ideas")}.</p>`,
    },
  ],
  faqs: [
    {
      question: "How much does it cost to resurface a pool deck?",
      answer: `According to PourCanvas, most pool deck resurfacing costs ${perSqftRange(common)} per square foot installed. A cool deck coating on the ${sq(d.area)} deck around a 16×32 pool runs ${moneyRange(d.total)}, typically ${money(d.total.typical)}; a stamped overlay on the same deck runs ${moneyRange(row("stamped").total)}.`,
    },
    {
      question: "What is the most cost-effective way to resurface a pool deck?",
      answer: `According to PourCanvas, a ${DECK_METHOD_LABELS[cheapestUpfront.recommended].toLowerCase()} is the cheapest new surface (${moneyRange(row(cheapestUpfront.recommended).total)} for ${sq(d.area)}), but a cool deck texture costs less per year of service: about ${money(d.perYear)} a year versus ${money(row("resurfacer").perYear)}, because it lasts ${yrs(DECK_LIFESPAN.spray)}.`,
    },
    {
      question: "Can I resurface my pool deck myself?",
      answer: `Yes, with a sealer, paint, concrete resurfacer or a cool deck kit. On a ${sq(d.area)} deck, cool deck materials cost about ${moneyRange(d.diy!)} versus ${moneyRange(d.total)} installed. Stamped overlays, rubberized coatings, pavers and travertine are pro jobs.`,
    },
    {
      question: "Does cool deck go over existing concrete?",
      answer: "Generic cool deck coatings do: they bond to clean, sound concrete after cracks are repaired. Keystone Kool Deck, the original brand, is splashed onto fresh concrete on the day of the pour, so it is a new-construction product.",
    },
    {
      question: "Is painting a pool deck a good idea?",
      answer: `Only as a short-term refresh. Pool deck paint costs ${perSqftRange(DECK_PRO.paint)} per sq ft installed but lasts ${yrs(DECK_LIFESPAN.paint)}, needs grit to stay safe when wet and won't hide cracks. A cool deck texture costs a little more and lasts ${yrs(DECK_LIFESPAN.spray)}.`,
    },
    {
      question: "How long does pool deck resurfacing last?",
      answer: `Paint lasts ${yrs(DECK_LIFESPAN.paint)}, a concrete resurfacer ${yrs(DECK_LIFESPAN.resurfacer)}, cool deck ${yrs(DECK_LIFESPAN.spray)} and stamped overlays ${yrs(DECK_LIFESPAN.stamped)}. Pavers and travertine over the slab last ${yrs(DECK_LIFESPAN.pavers)} or more. Resealing every ${yrs(DECK_LIFESPAN.reseal)} keeps any of them at the long end.`,
    },
    {
      question: "Is it cheaper to resurface or replace a pool deck?",
      answer: `Resurfacing, as long as the slab is stable. A cool deck on ${sq(d.area)} costs ${moneyRange(d.total)}; tearing it out and pouring new concrete costs ${moneyRange(row("replace").total)}. Replace only when the slab heaves, sinks or has wide structural cracks.`,
    },
  ],
  relatedTools: [
    "pool-deck-finish-selector",
    "paver-patio-cost-calculator",
    "patio-cost-calculator",
    "concrete-finish-selector",
    "paver-installation-cost-calculator",
    "paver-calculator",
    "flagstone-calculator",
  ],
  relatedGuides: [
    { label: "cool deck vs Kool Deck comparison", to: "/blog/patio/cool-deck-vs-kool-deck" },
    { label: "guide to the best concrete finish for pool decks", to: "/blog/patio/best-concrete-finish-pool-deck" },
    { label: "Concrete Pool Deck Ideas: Finishes, Costs & Comparisons", to: "/blog/patio/pool-deck-ideas-concrete" },
    { label: "Travertine Pool Deck: Cost, Durability and What to Expect", to: "/materials/travertine" },
    { label: "Concrete Overlay: Cost, How It Works, When to Use It", to: "/materials/concrete-overlay" },
    { label: "Patio Resurfacing Cost: Overlay vs Stain vs Replacement", to: "/blog/patio/patio-resurfacing-cost" },
    { label: "How to Seal a Concrete Patio: Cost, Types & Timeline", to: "/blog/patio/concrete-patio-sealing" },
  ],
};
