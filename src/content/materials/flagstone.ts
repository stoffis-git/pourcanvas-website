import type { MaterialPage } from "../types";
import { perSqftRange, moneyRange } from "@/lib/format";
import { INSTALLED, MATERIAL_ONLY, type AnyMaterial } from "@/lib/tools/data/paving";

const sq = (m: AnyMaterial) => perSqftRange(INSTALLED[m]);
const for200 = (m: AnyMaterial) => moneyRange({ low: INSTALLED[m].low * 200, typical: 0, high: INSTALLED[m].high * 200 });

export const flagstonePage: MaterialPage = {
  slug: "flagstone",
  toolWidget: {
    tool: "flagstone-calculator",
    variant: "flagstone",
    heading: "How much flagstone do you need, and what will it cost?",
    defaults: { material: "flagstone-dry" },
  },
  relatedTools: ["flagstone-calculator", "patio-cost-calculator"],
  title: "What Is Flagstone? Types, Uses and Setting Methods",
  headline: "Flagstone",
  summary:
    "Natural flagstone is the premium choice for walkways and patios — authentic texture, long lifespan, but high cost and significant maintenance. Here's the honest tradeoff.",
  metaDescription:
    `Flagstone costs ${perSqftRange(INSTALLED["flagstone-dry"])}/sq ft installed dry-laid and ${perSqftRange(INSTALLED["flagstone-mortared"])} mortared, more than concrete. Types, setting methods, upkeep and when the premium is worth it.`,
  targetKeywords: ["flagstone", "what is flagstone", "flagstone types", "flagstone patio", "flagstone walkway"],
  ogImage: "https://images.pourcanvas.com/walkway-flagstone-vs-concrete.jpg",
  publishedAt: "2025-06-15",
  intro:
    `No, flagstone is not cheaper than concrete. It runs ${sq("flagstone-dry")} per sq ft installed dry-laid and ${sq("flagstone-mortared")} mortared, against ${sq("plain-concrete")} for plain concrete and ${sq("stamped-concrete")} for stamped concrete (most often $12–18). What the premium buys is something concrete can't fully replicate: genuine quarried stone with natural depth, variation, and texture. It's the premium choice for walkways, patios, and pool decks where material authenticity matters.`,
  sections: [
    {
      heading: "Types of Flagstone",
      body: "Bluestone (Pennsylvania and Midwest) is the most common — a blue-gray metamorphic rock that's dense, hard, and ages attractively. Limestone produces softer, more varied tones (buff, cream, tan) and is popular in the Southwest. Slate is a layered rock that splits easily into thin slabs; it's dark, smooth, and feels upscale but can delaminate in freeze-thaw climates. Travertine (limestone formed in hot springs) is the pool deck standard — light, porous, stays cool underfoot. Quartzite is extremely hard and produces a crystalline sparkle in the surface.",
    },
    {
      heading: "Cost",
      body: `Natural flagstone installation runs ${sq("flagstone-dry")} per sq ft dry-laid and ${sq("flagstone-mortared")} mortared, with the range driven by stone type and setting method. Bluestone at the lower end, travertine and quartzite at the higher end. The stone itself costs about ${perSqftRange(MATERIAL_ONLY["flagstone-dry"])}/sq ft; the rest is labor, plus the concrete slab under mortared stone. Compare this to plain concrete (${sq("plain-concrete")}/sq ft), stamped concrete (${sq("stamped-concrete")}/sq ft, most often $12–18) or concrete pavers (${sq("concrete-paver")}/sq ft). On a 200 sq ft front walkway, dry-laid flagstone costs ${for200("flagstone-dry")} and mortared flagstone ${for200("flagstone-mortared")} installed, vs. $2,400–3,600 for stamped concrete at $12–18 and ${for200("plain-concrete")} for plain concrete. Price your own size in the <a href="/tools/flagstone-calculator">flagstone calculator</a>.`,
    },
    {
      heading: "Setting Methods",
      body: "Dry-laid flagstone is set directly in sand or compacted gravel with no mortar — joints are filled with gravel or planted with ground cover. It's the most forgiving to install and easy to reset individual stones that shift, but joints require ongoing weed management. Mortared flagstone is set on a concrete base with mortar beneath each stone and between joints — more permanent, cleaner-looking, but cracks in the base telegraph through to the surface. Stepping-stone flagstone (individual pieces with gaps) is the lowest-cost option, works well in garden paths, and allows for planting between stones.",
    },
    {
      heading: "Maintenance",
      body: "Dry-laid flagstone requires annual joint sand or gravel refresh and periodic re-leveling of shifted stones. Mortared flagstone requires repointing joints every 5–10 years and sealing every 2–3 years. All natural stone benefits from a penetrating sealer to reduce staining from organic matter, oil, and rust. In freeze-thaw climates, avoid de-icing salt — it degrades the stone surface faster than any other factor.",
    },
    {
      heading: "Freeze-Thaw Performance",
      body: "Not all flagstone performs equally in cold climates. Bluestone and quartzite are highly freeze-thaw resistant. Limestone and travertine are more porous and can spall (surface flaking) under repeated freeze cycles if not properly sealed. Slate can delaminate along its natural grain lines in harsh winters. If you're in a climate with hard freezes, ask your stone supplier specifically about freeze-thaw performance for the stone you're considering.",
    },
    {
      heading: "Flagstone vs Stamped Concrete",
      body: "From across the yard, well-done stamped concrete flagstone pattern is nearly indistinguishable from the real thing. Up close, the difference is visible — natural stone has genuine depth, variation, and texture that stamping approximates but doesn't replicate. For most homeowners, the $10–25/sq ft premium for real flagstone isn't justified unless material authenticity matters to them or to future buyers at a price point where it's expected. For high-end properties where the detail gets noticed, natural flagstone is worth it. For the full price breakdown, see our <a href='/blog/walkway/flagstone-vs-concrete-walkway'>flagstone vs concrete cost comparison</a>.",
    },
  ],
  prosAndCons: {
    pros: [
      "Genuine natural material — authentic look and texture that stamped concrete can't fully replicate",
      "Long lifespan (50+ years) when properly installed and maintained",
      "Wide variety of stone types, colors, and textures",
      "Dry-laid installation allows individual stones to be reset easily",
      "Adds genuine premium appeal to high-end properties",
    ],
    cons: [
      "Significantly more expensive than concrete alternatives ($25–45 vs $12–18/sq ft)",
      "Higher maintenance than poured concrete or pavers",
      "Dry-laid joints require ongoing weed management",
      "Freeze-thaw performance varies by stone type",
      "Irregular shapes make installation more labor-intensive",
    ],
  },
  relatedPillars: ["walkway", "patio"],
  relatedArticles: [
    { pillar: "walkway", slug: "flagstone-vs-concrete-walkway" },
    { pillar: "patio", slug: "concrete-patio-vs-pavers" },
  ],
  faqs: [
    {
      question: "How much does flagstone cost per square foot installed?",
      answer: `Natural flagstone installation runs ${sq("flagstone-dry")} per sq ft dry-laid and ${sq("flagstone-mortared")} mortared. Bluestone is at the lower end; travertine and quartzite are at the higher end. The stone itself costs about ${perSqftRange(MATERIAL_ONLY["flagstone-dry"])}/sq ft; the rest is labor. On a 200 sq ft front walkway, expect ${for200("flagstone-dry")} dry-laid or ${for200("flagstone-mortared")} mortared, vs. $2,400–3,600 for stamped concrete.`,
    },
    {
      question: "Is flagstone cheaper than concrete?",
      answer: `No. According to PourCanvas pricing data, flagstone costs ${sq("flagstone-dry")} per sq ft installed dry-laid and ${sq("flagstone-mortared")} mortared, while plain concrete costs ${sq("plain-concrete")} and stamped concrete ${sq("stamped-concrete")} (most often $12–18). On a 200 sq ft walkway that is ${for200("flagstone-dry")} for dry-laid flagstone against ${for200("plain-concrete")} for plain concrete. Stamped concrete with a flagstone pattern is the usual way to get the look for less.`,
    },
    {
      question: "Does flagstone crack in cold climates?",
      answer: "It depends on the stone type. Bluestone and quartzite are highly freeze-thaw resistant. Limestone and travertine are more porous and can spall (surface flaking) under repeated freeze cycles if not sealed. Slate can delaminate along its natural grain lines in harsh winters. Always ask your stone supplier specifically about freeze-thaw performance for your climate.",
    },
    {
      question: "Is real flagstone worth the premium over stamped concrete?",
      answer: "From across the yard, well-done stamped concrete flagstone pattern is nearly indistinguishable from real stone. Up close, natural stone has depth and texture that stamping approximates but doesn't fully replicate. The premium over typical stamped concrete ($12–18/sq ft) is about $3–14/sq ft dry-laid and $8–27 mortared. It is justified for high-end properties where material authenticity matters or where future buyers at a higher price point will notice the difference. For most homeowners, stamped concrete is the better value.",
    },
  ],
};
