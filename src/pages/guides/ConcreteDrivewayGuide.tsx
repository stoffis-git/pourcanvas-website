import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SeoHead } from "@/components/SeoHead";
import { InspirationEmailCapture } from "@/components/inspiration/InspirationEmailCapture";
import { cn } from "@/lib/utils";

const costRows = [
  { finish: "Broom finish (plain)",    cost: "$4–8/sq ft",       lifespan: "25–30 years" },
  { finish: "Colored concrete",        cost: "$5–9/sq ft",       lifespan: "25–30 years" },
  { finish: "Exposed aggregate",       cost: "$8–14/sq ft",      lifespan: "30+ years"   },
  { finish: "Stamped concrete",        cost: "$12–20/sq ft",     lifespan: "25–30 years" },
  { finish: "Circular driveway",       cost: "$15,000–40,000",   lifespan: "25–30 years" },
  { finish: "Resurfacing (overlay)",   cost: "$2–5/sq ft",       lifespan: "10–15 years" },
];

const faqs = [
  {
    q: "What's the cheapest type of concrete driveway?",
    a: "A plain broom-finish concrete driveway is the least expensive option at $4–8/sq ft installed. For a standard two-car driveway (400–500 sq ft), that's $1,600–4,000. If budget is the primary constraint, broom finish with a simple saw-cut score line border costs almost nothing extra and adds visible design intent.",
  },
  {
    q: "How long does a concrete driveway last?",
    a: "A properly installed concrete driveway lasts 25–40 years with basic maintenance. The main factor is sealing: resealing every 2–3 years prevents surface staining, UV fade, and water infiltration that causes cracking. Concrete in freeze-thaw climates needs a sealer rated for those conditions — not all sealers are.",
  },
  {
    q: "Can I stain or color an existing concrete driveway?",
    a: "Yes. Acid stain and water-based concrete stain can be applied to an existing slab. Acid stain produces a mottled, organic look that varies with the concrete's composition — predictable in tone, not pattern. Water-based stain gives more consistent color. Neither option matches the result of integral pigment poured in from the start, but both add character to a plain grey slab at $2–5/sq ft applied.",
  },
  {
    q: "Is stamped concrete slippery when wet?",
    a: "It can be, depending on the sealer. A glossy wet-look sealer on smooth-stamped patterns is genuinely slippery when wet. Specify an anti-slip additive mixed into the final sealer coat — it adds a fine grit without changing the appearance. Exposed aggregate and broom-finish driveways have inherent texture and are not a slip concern.",
  },
  {
    q: "How often does a concrete driveway need to be sealed?",
    a: "Every 2–3 years for most climates. In high-UV regions (Southwest) or severe freeze-thaw climates (Midwest, Northeast), resealing every 2 years is worth it. A penetrating silane-siloxane sealer is the best everyday choice for driveways — it doesn't change the appearance and lasts longer than film-forming glossy sealers.",
  },
  {
    q: "Concrete vs. asphalt — which is better for cold climates?",
    a: "Both work in cold climates with proper installation. Concrete requires control joints and proper base preparation to manage freeze-thaw movement. Asphalt is more flexible and self-sealing in minor cracks, but softens in hot summers and needs resurfacing every 15–20 years. In climates with harsh winters and hot summers, concrete's durability edge is significant over a 30-year ownership horizon.",
  },
  {
    q: "Does a new concrete driveway add home value?",
    a: "Yes — curb appeal improvements are among the highest-ROI exterior projects. A decorative concrete driveway (stamped, exposed aggregate, or colored) recovers 50–75% of its cost in resale value in most markets. Plain concrete replacement still adds value by removing a deteriorated surface. The ROI improves significantly in neighborhoods where most homes have decorative driveways.",
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

const ConcreteDrivewayGuide = () => (
  <>
    <SeoHead
      title="Concrete Driveway Design Guide: Finishes, Costs & Ideas | PourCanvas"
      description="Everything you need to plan a concrete driveway — stamped, exposed aggregate, colored, or plain. Real cost data, finish comparisons, and design ideas."
      canonical="/guides/concrete-driveway"
    />
    <Header />
    <main className="max-w-4xl mx-auto px-5 py-28 md:py-36">

      {/* Header */}
      <div className="mb-12">
        <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-3">
          Complete Guide
        </p>
        <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight mb-5">
          The Complete Guide to<br className="hidden md:block" /> Concrete Driveway Design
        </h1>
        <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl">
          A concrete driveway is the largest paved surface most homeowners ever install. Plain broom finish starts at $4/sq ft; a stamped cobblestone two-car driveway can run $10,000+. The finish you choose affects curb appeal, maintenance, slip resistance, and resale value — and the decision is hard to reverse. This guide covers every major concrete driveway option with real installed costs, honest tradeoffs, and links to the full deep-dives.
        </p>
      </div>

      {/* Section 1: Costs */}
      <section className="mb-16">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
          How Much Does a Concrete Driveway Cost?
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-5">
          The biggest variable in driveway cost is the finish you choose. A standard two-car driveway runs 400–500 sq ft. Multiply the per-sq-ft ranges below by your area, then add 10–15% for demo and site prep if you're replacing an existing driveway.
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

        <p className="text-muted-foreground leading-relaxed mb-4">
          Demo and removal of an existing asphalt driveway adds $1–3/sq ft. Regional labor differences can swing quotes by 20–30% — the Northeast and West Coast run at the top of these ranges; the South and Midwest tend toward the bottom. Request at least three quotes; stamped concrete pricing varies more between contractors than any other finish.
        </p>
        <p className="text-sm text-muted-foreground">
          <Link to="/blog/driveway/concrete-driveway-cost" className="text-primary hover:underline">
            Full cost breakdown: What You'll Pay for a Concrete Driveway in 2026 →
          </Link>
        </p>
      </section>

      {/* CTA */}
      <div className="rounded-2xl p-7 mb-16 text-center" style={{ background: "linear-gradient(135deg, #90d1bf22, #9dde9022)" }}>
        <p className="font-semibold text-foreground mb-2">Not sure which finish fits your home?</p>
        <p className="text-sm text-muted-foreground mb-5">Upload a photo of your driveway and preview stamped concrete, exposed aggregate, or colored finishes on your actual surface.</p>
        <a
          href="/#try-it"
          className="inline-block rounded-full px-7 py-3 font-semibold text-sm hover:opacity-90 transition-opacity"
          style={{ background: "linear-gradient(135deg, #90d1bf, #9dde90)", color: "#2d2a26" }}
        >
          Try PourCanvas Free →
        </a>
      </div>

      {/* Section 2: Stamped Concrete */}
      <section className="mb-16">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
          Stamped Concrete Driveways
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Stamped concrete is the most popular decorative driveway finish — it delivers the visual impact of cobblestone, brick, or slate at roughly half the cost of natural materials. The concrete is poured normally, then pressed with textured stamps while still workable. Color is added via integral pigment (mixed into the pour), dry-shake hardener (broadcast on the surface), or a color wash applied after stamping.
        </p>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Cobblestone is the top-selling pattern for driveways — it reads as upscale from the street, complements traditional and craftsman homes, and the sealed surface handles oil stains and freeze-thaw cycles better than real cobblestone. Ashlar slate works better on contemporary homes. Brick running bond is the most approachable, compatible with nearly every house style, and sits at the lower end of the stamped cost range.
        </p>
        <p className="text-muted-foreground leading-relaxed mb-4">
          The most important selection factor: stamped concrete requires an experienced crew. The stamps must be pressed in a narrow workability window during the pour. Ask to see the contractor's completed driveway photos specifically — patio stamping skill doesn't always transfer to the heavier-loaded driveway surface.
        </p>
        <p className="text-sm text-muted-foreground">
          <Link to="/blog/driveway/stamped-concrete-driveway" className="text-primary hover:underline">
            Full guide: Stamped Concrete Driveways — 12 Styles and What They Cost →
          </Link>
        </p>
      </section>

      {/* Section 3: Texture & Finish Options */}
      <section className="mb-16">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
          Texture & Finish Options: Exposed Aggregate, Dark Concrete & Borders
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          If you want a durable, low-maintenance surface without committing to a stamped pattern, exposed aggregate is the right choice. The surface paste is washed away before curing to reveal decorative stone underneath — pea gravel gives a fine uniform texture, river stone adds color variation. At $8–14/sq ft it sits between plain and stamped, and it genuinely ages better than both.
        </p>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Dark integral-color driveways (charcoal, black, deep brown) are the fastest-growing design category. A black integrally colored concrete driveway costs $6–12/sq ft and makes a strong architectural statement — but heat absorption is a real consideration in hot climates. Charcoal is often the better practical choice: similar visual impact, cooler surface temperature, and less fading over time. Black concrete vs. charcoal is a more important decision than most contractors discuss upfront.
        </p>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Driveway borders add curb appeal without the full cost of a decorative finish. A cobblestone stamp border with a plain broom-finish field runs $8–14/sq ft versus $12–20 for a fully stamped surface. A simple saw-cut score line border costs almost nothing extra. Brick inlay borders ($15–25/sq ft) add the most visual distinction but require the most maintenance.
        </p>
        <div className="flex flex-col gap-2 text-sm text-muted-foreground">
          <Link to="/blog/driveway/exposed-aggregate-driveway" className="text-primary hover:underline">
            Full guide: Exposed Aggregate Driveway — Pros, Cons & Cost →
          </Link>
          <Link to="/blog/driveway/black-concrete-driveway" className="text-primary hover:underline">
            Full guide: Black Concrete Driveway — What to Expect Before You Commit →
          </Link>
          <Link to="/blog/driveway/driveway-border-ideas" className="text-primary hover:underline">
            Full guide: Driveway Border Ideas — 5 Styles and What They Cost →
          </Link>
        </div>
      </section>

      {/* Section 4: Concrete vs Asphalt */}
      <section className="mb-16">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
          Concrete vs. Asphalt: The Honest Comparison
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Asphalt costs $3–6/sq ft installed — less than concrete upfront. But asphalt requires resurfacing every 15–20 years ($2–4/sq ft), annual crack sealing, and resealing every 3–5 years. Concrete at $4–8/sq ft installed lasts 25–40 years with only periodic resealing. Over a 30-year ownership horizon, concrete is typically cheaper per year of service life.
        </p>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Climate matters more than most guides admit. In severe freeze-thaw climates, both materials require proper sub-base preparation and joint design. Asphalt is more flexible and self-seals minor cracks; concrete with inadequate control joints can develop significant cracking in northern climates. In hot climates, asphalt softens — concrete holds up better but gets hotter underfoot.
        </p>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Concrete's clear advantages: design flexibility (stamped, colored, aggregate textures), lower lifetime cost, higher resale value, and no need for resurfacing within a typical homeowner's tenure. Asphalt's advantages: lower upfront cost, easier DIY crack repair, and faster installation.
        </p>
        <p className="text-sm text-muted-foreground">
          <Link to="/blog/driveway/concrete-driveway-vs-asphalt" className="text-primary hover:underline">
            Full comparison: Concrete vs. Asphalt Driveway — Which Is Right for You? →
          </Link>
        </p>
      </section>

      {/* Section 5: Design Ideas */}
      <section className="mb-16">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
          Modern Driveway Designs & Circular Driveways
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Modern concrete driveways in 2026 rely on three elements: clean geometry, intentional color, and edge definition. The most requested look: a charcoal broom-finish field with saw-cut score lines and a contrasting exposed-aggregate or stamped border. What's dated: overly ornate cobblestone on contemporary homes, and buff/tan colors that blend into the surrounding concrete.
        </p>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Dark integral color has become the defining trend — charcoal and near-black driveways photograph well, look intentional from the street, and pair cleanly with modern and transitional architecture. Combined with simple geometric scoring, the result costs $7–12/sq ft and reads as premium design without pattern complexity.
        </p>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Circular driveways are a different category: the concrete cost is comparable ($12–18/sq ft for stamped), but a full circular installation runs $15,000–40,000 because of the total surface area and grading requirements. The single non-negotiable sizing rule: the interior radius must be at least 18 feet for comfortable vehicle turning, 20+ feet for SUVs and trucks. A circular driveway that's too tight is worse than no circular driveway.
        </p>
        <div className="flex flex-col gap-2 text-sm text-muted-foreground">
          <Link to="/blog/driveway/modern-driveway-ideas" className="text-primary hover:underline">
            Full guide: Modern Driveway Ideas — What's Working in 2026 →
          </Link>
          <Link to="/blog/driveway/circular-driveway-ideas" className="text-primary hover:underline">
            Full guide: Circular Driveway Ideas — Concrete Designs That Work →
          </Link>
        </div>
      </section>

      {/* Section 6: Resurfacing */}
      <section className="mb-16">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
          Resurfacing vs. Full Replacement
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          If your driveway has surface spalling, minor cracking, or cosmetic deterioration but the slab is structurally sound, resurfacing is worth serious consideration. A concrete overlay (microtop or skim coat) runs $2–5/sq ft and adds 10–15 years to the surface life. Some overlays can be stamped or colored, giving you a decorative finish on top of an existing plain slab.
        </p>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Full replacement is the right call if: cracks are wider than ¼ inch or show vertical displacement, the slab is heaving from tree roots or frost, or more than 30% of the surface has spalled. Patching a slab that's structurally compromised before overlaying it wastes both materials — the patch won't bond properly to a damaged base.
        </p>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Asphalt resurfacing costs $2–4/sq ft and is the most common driveway maintenance decision for asphalt homeowners. If you're resurfacing asphalt and considering switching to concrete, that's the right time to make the change — demo cost is already in the budget.
        </p>
        <p className="text-sm text-muted-foreground">
          <Link to="/blog/driveway/driveway-resurfacing" className="text-primary hover:underline">
            Full guide: Driveway Resurfacing — Concrete vs. Asphalt vs. Overlay →
          </Link>
        </p>
      </section>

      {/* FAQ */}
      <section className="mb-16">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">
          Frequently Asked Questions
        </h2>
        <FAQAccordion />
      </section>

      <div className="mb-16">
        <InspirationEmailCapture slug="concrete-driveway-guide" pillar="driveway" />
      </div>

      {/* Final CTA */}
      <div className="rounded-2xl p-8 text-center border border-border">
        <h2 className="text-2xl font-bold text-foreground mb-3">See It Before You Pour It</h2>
        <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
          Upload a photo of your driveway and preview stamped concrete, exposed aggregate, colored finishes, and border ideas — free, no sign-up required.
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

export default ConcreteDrivewayGuide;
