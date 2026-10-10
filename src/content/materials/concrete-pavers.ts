import type { MaterialPage } from "../types";
import { moneyRange, perSqftRange } from "@/lib/format";
import { INSTALLED } from "@/lib/tools/data/paving";

const pav = INSTALLED["concrete-paver"];
const PAV = perSqftRange(pav);
const PLAIN = perSqftRange(INSTALLED["plain-concrete"]);
const STAMPED = perSqftRange(INSTALLED["stamped-concrete"]);
const PAV300 = moneyRange({ low: pav.low * 300, typical: pav.typical * 300, high: pav.high * 300 });

export const concretePagersPage: MaterialPage = {
  slug: "concrete-pavers",
  toolWidget: {
    tool: "paver-calculator",
    variant: "pavers",
    heading: "How many pavers does your project need?",
  },
  relatedTools: ["paver-calculator", "paver-patio-cost-calculator", "paver-installation-cost-calculator", "paver-base-calculator", "paver-sand-calculator", "polymeric-sand-calculator"],
  title: "Concrete Pavers vs Poured Concrete: Cost and Styles",
  headline: "Concrete Pavers",
  summary:
    "Concrete pavers are individual units laid in a pattern — not poured concrete. Higher upfront cost than a poured slab, but easier to repair and available in hundreds of colors and shapes.",
  metaDescription:
    `Concrete pavers cost about ${PAV}/sq ft installed, more than a plain poured slab, but single units replace in minutes. Styles, costs and when pavers pay off.`,
  targetKeywords: ["concrete pavers", "paver patio", "concrete pavers vs poured concrete"],
  ogImage: "/og/material-concrete-pavers.jpg",
  publishedAt: "2025-06-15",
  intro:
    `Concrete pavers cost about ${PAV} per sq ft installed (typical about $${pav.typical}) — more than a plain poured slab at ${PLAIN} — but they offer one advantage no poured slab can match: a cracked or damaged unit lifts out and replaces in minutes. They're factory-made individual blocks laid over a compacted base, available in hundreds of colors, shapes, and patterns.`,
  sections: [
    {
      heading: "What Concrete Pavers Are",
      body: "Concrete pavers are factory-made units cast from a dry-mix concrete with pigment added for color. They're denser and stronger than standard poured concrete — typically 8,000+ PSI compressive strength vs. 3,000–4,000 PSI for a poured slab. They're sold by the square foot and laid over a compacted gravel base with a sand setting layer. Joints between pavers are filled with polymeric sand that hardens to resist weeds and ant intrusion.",
    },
    {
      heading: "Styles and Formats",
      body: "Pavers come in three main formats. Brick-style pavers (4\"×8\" or similar) mimic the look of clay brick in dozens of colors. Large-format pavers (12\"×12\", 16\"×16\", 24\"×24\") have a cleaner, more contemporary look. Tumbled or antiqued pavers have irregular edges and a worn surface that mimics old stone. Within each format, colors range from standard gray and buff to deep charcoal, terracotta, and multicolor blends.",
    },
    {
      heading: "Cost",
      body: `Concrete paver installation runs about ${PAV} per sq ft, compared to ${PLAIN} for plain poured concrete and ${STAMPED} for stamped. The cost breakdown: materials ($3–8/sq ft for the pavers themselves), base preparation (gravel, sand), installation labor, and edging restraints. On a 300 sq ft patio, budget about ${PAV300} installed. The higher upfront cost versus a plain slab is the primary reason most homeowners choose poured concrete — but the repair advantage can offset this over time.`,
    },
    {
      heading: "The Repair Advantage",
      body: "The single biggest argument for pavers over poured concrete: individual units can be lifted and replaced. A cracked paver is a 15-minute fix — pull the damaged unit, drop in a replacement. A cracked concrete slab requires grinding, patching, and resealing that almost always leaves a visible repair. In climates with hard freeze-thaw cycles or significant tree root activity, this repairability matters significantly over a 20-year horizon.",
    },
    {
      heading: "Maintenance",
      body: "Pavers require two maintenance tasks: joint sand replenishment and occasional re-leveling of sunken units. Polymeric joint sand typically lasts 3–5 years before it needs refreshing — some areas require it more frequently due to heavy rain or foot traffic. Individual pavers that sink (due to base compaction or tree roots) can be lifted and re-set. A penetrating paver sealer applied every 2–3 years deepens the color and reduces staining.",
    },
    {
      heading: "When Pavers Are the Right Call",
      body: "Choose pavers when: you're willing to pay the upfront premium for long-term repairability; you want a specific pattern or color combination that poured concrete can't replicate; you have tree roots or soil movement that makes a continuous slab likely to crack; or you're in a high-end project where the material authenticity of the surface matters. For most budget-conscious homeowners, plain or exposed-aggregate concrete costs less; stamped concrete gives a patterned look at a similar price.",
    },
  ],
  prosAndCons: {
    pros: [
      "Easy to repair — individual units replaced in minutes",
      "Wide range of colors, shapes, and patterns from the factory",
      "No cracking risk across the full surface — units flex with ground movement",
      "Permeable options available for stormwater management",
      "High PSI density — durable under vehicle loads",
    ],
    cons: [
      `More expensive than plain poured concrete (${PAV} vs ${PLAIN}/sq ft)`,
      "Joint sand requires periodic replenishment",
      "Individual units can sink or shift — requires periodic re-leveling",
      "Weeds can establish in joints if polymeric sand fails",
      "Color variation between original batch and replacement units is common over time",
    ],
  },
  relatedPillars: ["patio"],
  relatedArticles: [{ pillar: "patio", slug: "concrete-patio-vs-pavers" }],
  faqs: [
    {
      question: "How much do concrete pavers cost installed?",
      answer: `Concrete paver installation runs about ${PAV} per sq ft. The cost breakdown includes the pavers themselves ($3–8/sq ft), compacted gravel base, sand setting layer, labor, and edging restraints. On a 300 sq ft patio, budget about ${PAV300} installed — similar to stamped concrete and more than a plain slab.`,
    },
    {
      question: "Are concrete pavers better than stamped concrete?",
      answer: `It depends on your priorities. Concrete pavers (${PAV}/sq ft) and stamped concrete (${STAMPED}/sq ft) overlap in price, but pavers offer one major advantage: individual units can be lifted and replaced if they crack or shift — a 15-minute fix vs. grinding and patching a stamped slab. Pavers are the better long-term choice in climates with hard freeze-thaw cycles or significant tree root activity.`,
    },
    {
      question: "Do concrete pavers require a lot of maintenance?",
      answer: "Two main tasks: joint sand replenishment every 3–5 years, and re-leveling any units that sink due to base compaction or tree roots. A penetrating paver sealer applied every 2–3 years deepens the color and reduces staining. This is less maintenance than flagstone but slightly more than a sealed concrete slab.",
    },
  ],
};
