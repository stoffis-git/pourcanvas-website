import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SeoHead } from "@/components/SeoHead";
import { InspirationEmailCapture } from "@/components/inspiration/InspirationEmailCapture";
import { cn } from "@/lib/utils";

const costRows = [
  { finish: "Broom finish (plain)",    cost: "$6–10/sq ft",      lifespan: "25–30 years" },
  { finish: "Stained concrete",        cost: "$3–7/sq ft (existing slab)", lifespan: "5–10 years between applications" },
  { finish: "Exposed aggregate",       cost: "$8–14/sq ft",      lifespan: "30+ years"   },
  { finish: "Stamped concrete",        cost: "$12–18/sq ft",     lifespan: "25–30 years" },
  { finish: "Stepping stone pads",     cost: "$50–150 each",     lifespan: "20–25 years" },
  { finish: "Concrete steps (per step)", cost: "$150–400",       lifespan: "30+ years"   },
];

const faqs = [
  {
    q: "How much does a concrete walkway cost?",
    a: "$6–18/sq ft depending on finish. A 160 sq ft front walkway (4'×40'): $960–2,880. Adding 3 steps: add $450–1,200. Staining an existing sound walkway: $480–1,120. Demo of old walkway: $1–3/sq ft additional.",
  },
  {
    q: "How wide should a front walkway be?",
    a: "4 feet minimum for two people side by side. 3 feet minimum for single-file (ADA requires 36\"). 5 feet feels generous and is worth the 25% cost increase on a primary front entrance. Side/backyard paths can be 3 feet.",
  },
  {
    q: "What's the best concrete finish for a walkway?",
    a: "Broom finish for value and slip resistance. Stamped for curb appeal when the walkway is highly visible from the street. Exposed aggregate for wet climates and garden paths (texture hides wear and provides grip). Staining for transforming an existing walkway at lowest cost.",
  },
  {
    q: "How thick should a concrete walkway be?",
    a: "4 inches on 4 inches of compacted gravel sub-base. Pour 5–6 inches where vehicles might cross the path and at expansion joints. Wire mesh or fiber mesh reinforcement recommended for walkways longer than 20 feet.",
  },
  {
    q: "Can I pour concrete over an existing walkway?",
    a: "Yes, if the existing slab is structurally sound, level, and not significantly cracked or heaving. A concrete overlay runs $4–8/sq ft and adds 1–2 inches. If the existing walkway is settled, heaved, or cracked through, full demo and re-pour ($7–20/sq ft including demo) is the only reliable option.",
  },
  {
    q: "Stamped concrete vs flagstone for a walkway?",
    a: "Stamped flagstone-look: $12–18/sq ft, continuous surface, no joint maintenance, handles freeze-thaw well. Real flagstone: $25–45/sq ft, genuine material depth, joints need annual sand replenishment and weed management. Stamped is 80–90% of the visual at 40–50% of the cost.",
  },
  {
    q: "Do concrete walkways need sealing?",
    a: "All concrete walkways benefit from sealing every 2–3 years, but it’s most critical for stamped (protects color and pattern depth) and stained (protects the color bond). Plain broom finish is the most forgiving without sealing — it just darkens over time. A penetrating sealer at $1–2/sq ft every 3 years is sufficient for plain or aggregate finishes.",
  },
];

const FAQAccordion = () => {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="space-y-2">
      {faqs.map((faq, i) => (
        <div key={i} className="border border-border rounded-xl overflow-hidden">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex items-center justify-between px-5 py-4 text-left font-medium text-foreground hover:bg-muted/50 transition-colors"
            aria-expanded={open === i}
          >
            <span>{faq.q}</span>
            <svg
              className={cn("w-4 h-4 shrink-0 ml-4 text-muted-foreground transition-transform", open === i && "rotate-180")}
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {open === i && (
            <div className="px-5 pb-5 text-foreground/80 leading-relaxed text-sm md:text-base">
              {faq.a}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const ConcreteWalkwayGuide = () => (
  <>
    <SeoHead
      title="Concrete Walkway Design Guide: Styles, Costs & Ideas | PourCanvas"
      description="Concrete walkway costs $6–18/sq ft depending on finish. Compare broom finish, stamped, exposed aggregate, stained, and stepping stone options with real costs."
      canonical="/guides/concrete-walkway"
    />
    <Header />
    <main className="max-w-4xl mx-auto px-5 py-28 md:py-36">

      {/* Header */}
      <div className="mb-12">
        <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-3">
          Complete Guide
        </p>
        <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight mb-5">
          The Complete Guide to<br className="hidden md:block" /> Concrete Walkway Design
        </h1>
        <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl">
          A concrete walkway is one of the most visible exterior surfaces on any home — the path from curb to front door shapes every visitor's first impression. Plain broom finish starts at $6/sq ft; stamped flagstone with color layering can run $18/sq ft. A standard 4-foot-wide, 40-foot front walkway (160 sq ft) costs $960–2,880 depending on the finish. This guide covers every major option with real installed costs and links to the full deep-dives.
        </p>
      </div>

      {/* Section 1: Costs */}
      <section className="mb-16">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
          How Much Does a Concrete Walkway Cost?
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-5">
          The biggest variable is finish type and length. A standard front walkway runs 120–200 sq ft. Multiply the per-sq-ft ranges below by your area. Regional labor differences can swing quotes by 20–30% — the Northeast and West Coast run at the top of these ranges; the South and Midwest tend toward the bottom. Steps add $150–400 each.
        </p>

        {/* Cost table */}
        <div className="overflow-x-auto rounded-2xl border border-border mb-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50 text-left">
                <th className="px-5 py-3 font-semibold text-foreground">Finish</th>
                <th className="px-5 py-3 font-semibold text-foreground">Installed Cost</th>
                <th className="px-5 py-3 font-semibold text-foreground">Expected Lifespan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {costRows.map((row) => (
                <tr key={row.finish}>
                  <td className="px-5 py-3 text-foreground">{row.finish}</td>
                  <td className="px-5 py-3 text-foreground font-medium">{row.cost}</td>
                  <td className="px-5 py-3 text-muted-foreground">{row.lifespan}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-sm text-muted-foreground">
          <Link to="/blog/walkway/concrete-walkway-cost" className="text-primary hover:underline">
            Full cost breakdown: What You'll Pay for a Concrete Walkway in 2026 →
          </Link>
        </p>
      </section>

      {/* CTA */}
      <div className="rounded-2xl p-7 mb-16 text-center" style={{ background: "linear-gradient(135deg, #90d1bf22, #9dde9022)" }}>
        <p className="font-semibold text-foreground mb-2">Not sure which walkway finish fits your home?</p>
        <p className="text-sm text-muted-foreground mb-5">Upload a photo of your front path and preview stamped, stained, or aggregate finishes on your actual walkway.</p>
        <a
          href="/#try-it"
          className="inline-block rounded-full px-7 py-3 font-semibold text-sm hover:opacity-90 transition-opacity"
          style={{ background: "linear-gradient(135deg, #90d1bf, #9dde90)", color: "#2d2a26" }}
        >
          Try PourCanvas Free →
        </a>
      </div>

      {/* Section 2: Stamped & Patterned */}
      <section className="mb-16">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
          Stamped & Patterned Walkways
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Stamped flagstone and cobblestone are the most popular walkway patterns. Avoid deep-relief stamps on walkways — they catch heels and collect debris. Medium-depth stamps with secondary color release produce the best results: realistic visual depth without the maintenance problems of aggressive texture.
        </p>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Color layering is what separates a convincing stamped walkway from an obvious one. A base integral pigment with a contrasting color release powder creates the kind of tonal variation that natural stone has inherently. Single-color stamped concrete always looks like concrete trying to be stone; two-tone stamped concrete just looks like stone.
        </p>
        <div className="flex flex-col gap-2 text-sm text-muted-foreground">
          <Link to="/blog/walkway/concrete-walkway-patterns" className="text-primary hover:underline">
            Full guide: Concrete Walkway Patterns — What Works and What Doesn't →
          </Link>
          <Link to="/blog/walkway/front-walkway-ideas" className="text-primary hover:underline">
            Full guide: Front Walkway Ideas — Curb Appeal That Lasts →
          </Link>
          <Link to="/blog/walkway/concrete-walkway-ideas" className="text-primary hover:underline">
            Full guide: Concrete Walkway Ideas — Every Style Ranked →
          </Link>
        </div>
      </section>

      {/* Section 3: Exposed Aggregate & Broom Finish */}
      <section className="mb-16">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
          Exposed Aggregate & Broom Finish
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Exposed aggregate ($8–14/sq ft) is the strongest all-around walkway choice for garden paths — it handles moisture, leaf litter, and biological staining without showing wear. The natural stone texture provides excellent grip in wet conditions and the visual complexity means it ages gracefully where a smooth surface would show every stain and crack.
        </p>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Broom finish ($6–10/sq ft) is the practical default — best slip resistance, lowest maintenance, most budget-friendly. It doesn't have to look generic: dark charcoal broom finish with scored edges reads as deliberately designed rather than builder-grade. The micro-texture of broom finish provides the best traction of any concrete surface in rain, frost, or leaf litter.
        </p>
        <p className="text-sm text-muted-foreground">
          <Link to="/blog/walkway/backyard-walkway-ideas" className="text-primary hover:underline">
            Full guide: Backyard Walkway Ideas — Paths That Work Year-Round →
          </Link>
        </p>
      </section>

      {/* Section 4: Steps, Stepping Stones & Entry Design */}
      <section className="mb-16">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
          Steps, Stepping Stones & Entry Design
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Entry steps at $150–400 per step are a significant cost adder but often non-negotiable when grade change exists. Tiered slab entries suit modern homes — two or three broad, shallow steps (12" deep minimum, 6–7" rise) create a landing effect that reads as architecture rather than utility. Match the step finish to the walkway finish for cohesion.
        </p>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Stepping stone pads at $50–150 each are the most DIY-friendly concrete walkway option. Spacing at 18–24" center-to-center matches a natural stride. Set them on 2" of compacted gravel with landscape fabric beneath to prevent settling and weed growth. Round pads (18–24" diameter) suit organic garden layouts; square pads (18×18" or 24×24") suit modern/linear landscapes.
        </p>
        <div className="flex flex-col gap-2 text-sm text-muted-foreground">
          <Link to="/blog/walkway/concrete-steps-ideas" className="text-primary hover:underline">
            Full guide: Concrete Steps Ideas — Entry Designs That Elevate →
          </Link>
          <Link to="/blog/walkway/stepping-stone-walkway-ideas" className="text-primary hover:underline">
            Full guide: Stepping Stone Walkway Ideas — Layout, Spacing & Cost →
          </Link>
        </div>
      </section>

      {/* Section 5: Concrete vs Flagstone */}
      <section className="mb-16">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
          Concrete vs Flagstone Walkways
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Stamped concrete walkways run $12–18/sq ft; real flagstone runs $25–45/sq ft. Stamped eliminates joint maintenance and handles freeze-thaw better because it's a continuous slab — no mortar joints to crack, no sand to replenish. Real flagstone has genuine material variation and depth that stamped concrete approximates but never fully matches.
        </p>
        <p className="text-muted-foreground leading-relaxed mb-4">
          The practical tradeoff: stamped concrete is 80–90% of the visual at 40–50% of the cost, with significantly less maintenance. Real flagstone is the right choice when budget isn't the constraint and the walkway is short enough (under 100 sq ft) that annual joint maintenance isn't burdensome. For long front walkways, stamped wins on maintenance math alone.
        </p>
        <div className="flex flex-col gap-2 text-sm text-muted-foreground">
          <Link to="/blog/walkway/flagstone-vs-concrete-walkway" className="text-primary hover:underline">
            Full comparison: Flagstone vs Concrete Walkway — Cost, Maintenance & Style →
          </Link>
          <Link to="/blog/walkway/curved-walkway-ideas" className="text-primary hover:underline">
            Full guide: Curved Walkway Ideas — Layouts That Flow →
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="mb-16">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">
          Frequently Asked Questions
        </h2>
        <FAQAccordion />
      </section>

      <div className="mb-16">
        <InspirationEmailCapture slug="concrete-walkway-guide" pillar="walkway" />
      </div>

      {/* Final CTA */}
      <div className="rounded-2xl p-8 text-center border border-border">
        <h2 className="text-2xl font-bold text-foreground mb-3">See It Before You Pour It</h2>
        <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
          Upload a photo of your walkway and preview stamped concrete, exposed aggregate, stained finishes, and stepping stone layouts — free, no sign-up required.
        </p>
        <a
          href="/#try-it"
          className="inline-block rounded-full px-8 py-3 font-semibold text-sm hover:opacity-90 transition-opacity"
          style={{ background: "linear-gradient(135deg, #90d1bf, #9dde90)", color: "#2d2a26" }}
        >
          Try PourCanvas Free →
        </a>
      </div>

    </main>
    <Footer />
  </>
);

export default ConcreteWalkwayGuide;
