import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SeoHead } from "@/components/SeoHead";
import { InspirationEmailCapture } from "@/components/inspiration/InspirationEmailCapture";
import { cn } from "@/lib/utils";

const costRows = [
  { finish: "Broom finish (plain)",       cost: "$6–10/sq ft",                lifespan: "25–30 years" },
  { finish: "Stained concrete",           cost: "$3–7/sq ft (existing slab)", lifespan: "5–10 years between applications" },
  { finish: "Colored concrete (integral)", cost: "$8–14/sq ft",               lifespan: "25–30 years" },
  { finish: "Exposed aggregate",          cost: "$8–14/sq ft",                lifespan: "30+ years"   },
  { finish: "Stamped concrete",           cost: "$12–18/sq ft",               lifespan: "25–30 years" },
  { finish: "Resurfacing (overlay)",      cost: "$4–8/sq ft",                 lifespan: "10–15 years" },
];

const faqs = [
  {
    q: "What's the cheapest concrete patio option?",
    a: "Broom finish at $6–10/sq ft. A 200 sq ft patio runs $1,200–2,000. Staining an existing sound slab is even cheaper at $3–7/sq ft ($600–1,400 on 200 sq ft).",
  },
  {
    q: "How long does a concrete patio last?",
    a: "25–40 years with proper installation and sealing every 2–3 years. Stamped and broom finish last equally long; the finish is cosmetic, not structural. Cracks are usually caused by inadequate sub-base or missing control joints, not the finish choice.",
  },
  {
    q: "Is stamped concrete worth it for a patio?",
    a: "At $12–18/sq ft it delivers the look of natural stone or brick at roughly 50% of the cost. Worth it if curb appeal and visual impact matter; not worth it if the patio is rarely visible from the street or if budget is tight. Plain broom finish with integral color ($8–12/sq ft) is the best middle ground.",
  },
  {
    q: "Can I stain my existing concrete patio?",
    a: "Yes, if the slab is structurally sound, not heavily cracked, and free of old sealers or paint. Acid stain at $3–7/sq ft transforms the look for less than any other option. Test a hidden corner first — patched areas stain differently.",
  },
  {
    q: "How thick should a concrete patio be?",
    a: "4 inches is standard for residential patios on 4 inches of compacted gravel sub-base. Pour 6 inches at edges and any points that might support heavy loads (hot tub, fire pit base). Fiber mesh or wire mesh reinforcement is recommended for slabs over 200 sq ft.",
  },
  {
    q: "Stamped concrete vs pavers for a patio?",
    a: "Stamped: $12–18/sq ft, seamless look, resealing every 2–3 years, hard to repair individual cracks. Pavers: $20–40/sq ft, individual repairability, flexible joints handle freeze-thaw, genuine material depth. Budget favors stamped; repairability favors pavers.",
  },
  {
    q: "What concrete patio finish hides dirt best?",
    a: "Exposed aggregate hides dirt, leaf stains, and wear better than any smooth finish because the textured surface masks discoloration. Charcoal or dark integral color is second-best — shows less contrast against organic stains. Plain light grey broom finish shows everything.",
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

const ConcretePatioGuide = () => (
  <>
    <SeoHead
      title="Concrete Patio Design Guide: Finishes, Costs & Ideas | PourCanvas"
      description="Concrete patio costs $6–20/sq ft installed depending on finish. Compare stamped, exposed aggregate, stained, broom-finish, and decorative options with real cost data."
      canonical="/guides/concrete-patio"
    />
    <Header />
    <main className="max-w-4xl mx-auto px-5 py-28 md:py-36">

      {/* Header */}
      <div className="mb-12">
        <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-3">
          Complete Guide
        </p>
        <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight mb-5">
          The Complete Guide to<br className="hidden md:block" /> Concrete Patio Design
        </h1>
        <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl">
          A concrete patio is one of the highest-value outdoor improvements you can make. Broom finish starts at $6/sq ft; a stamped flagstone patio with integral color can run $4,000+ on a standard 300 sq ft backyard slab. The finish you choose affects how the space looks, how it holds up to weather and furniture, and how much maintenance you'll do over the next 25 years. This guide covers every major concrete patio option with real installed costs, honest tradeoffs, and links to the full deep-dives.
        </p>
      </div>

      {/* Section 1: Costs */}
      <section className="mb-16">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
          How Much Does a Concrete Patio Cost?
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-5">
          Size is the biggest variable. A typical backyard patio runs 200–400 sq ft. Multiply the per-sq-ft ranges below by your area, then add 10–15% for site prep. If you're replacing an existing patio or removing old pavers, demo adds $1–3/sq ft to the total.
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
          Regional labor differences swing quotes by 20–30% — the Northeast and West Coast run at the top of these ranges; the South and Midwest tend toward the bottom. Request at least three quotes. Stamped concrete pricing varies more between contractors than any other finish because the work is timing-sensitive and skill-dependent.
        </p>
        <p className="text-sm text-muted-foreground">
          <Link to="/blog/patio/concrete-patio-cost" className="text-primary hover:underline">
            Full cost breakdown: What You'll Pay for a Concrete Patio in 2026 →
          </Link>
        </p>
      </section>

      {/* CTA */}
      <div className="rounded-2xl p-7 mb-16 text-center" style={{ background: "linear-gradient(135deg, #90d1bf22, #9dde9022)" }}>
        <p className="font-semibold text-foreground mb-2">Not sure which finish fits your backyard?</p>
        <p className="text-sm text-muted-foreground mb-5">Upload a photo of your patio and preview stamped, stained, or aggregate finishes on your actual surface.</p>
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
          Stamped Concrete Patios
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Stamped concrete is the most popular decorative patio finish. At $12–18/sq ft it delivers the look of natural stone, brick, or wood planks at roughly half the cost of the real materials. The concrete is poured normally, then pressed with textured stamps while still workable. Color is added via integral pigment mixed into the pour or a color wash applied after stamping.
        </p>
        <p className="text-muted-foreground leading-relaxed mb-4">
          The most requested patio patterns: ashlar slate (the modern default — clean lines, neutral tones), herringbone brick (classic, pairs with traditional and colonial homes), random flagstone (organic look, works with landscaped yards), wood plank (warm texture without the rot), and cobblestone (old-world feel, best as an accent or border). Most contractors carry 10–20 stamp sets, but the five above account for the majority of residential patio work.
        </p>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Stamped concrete requires an experienced crew — the stamps must be pressed in a narrow workability window during the pour. A rushed or mistimed application shows in the final surface. Ask to see the contractor's completed patio photos specifically, and check that the joints between stamp impressions are consistent across the slab.
        </p>
        <div className="flex flex-col gap-2 text-sm text-muted-foreground">
          <Link to="/blog/patio/stamped-concrete-ideas" className="text-primary hover:underline">
            Full guide: Stamped Concrete Patio Ideas — Patterns, Colors & Cost →
          </Link>
          <Link to="/blog/patio/stamped-concrete-patterns" className="text-primary hover:underline">
            Full guide: Stamped Concrete Patterns — Which One Fits Your Home? →
          </Link>
        </div>
      </section>

      {/* Section 3: Stained & Colored Concrete */}
      <section className="mb-16">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
          Stained & Colored Concrete
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          There are two approaches to adding color to a concrete patio. Staining transforms an existing slab: acid stain ($3–7/sq ft) reacts chemically with the concrete to produce organic, mottled earth tones — predictable in color family, not in exact pattern. Water-based stain ($2–5/sq ft) offers more consistent, controlled color and a wider palette. Neither requires a new pour if the existing slab is structurally sound.
        </p>
        <p className="text-muted-foreground leading-relaxed mb-4">
          The second approach is integral color on a new pour ($2–4/sq ft added to the base cost). Pigment is mixed directly into the concrete, so the color runs through the entire slab — chips and surface wear don't expose a different color underneath. Integral color is permanent; stain needs reapplication every 5–10 years depending on traffic and UV exposure.
        </p>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Dollar for dollar, staining an existing patio is the best refresh option available. A $600–1,400 acid stain application on a 200 sq ft slab changes the entire feel of a backyard without demolition, new concrete, or a multi-day pour schedule.
        </p>
        <div className="flex flex-col gap-2 text-sm text-muted-foreground">
          <Link to="/blog/patio/stained-concrete-patio-ideas" className="text-primary hover:underline">
            Full guide: Stained Concrete Patio Ideas — Colors, Cost & Process →
          </Link>
          <Link to="/blog/patio/patio-color-ideas" className="text-primary hover:underline">
            Full guide: Concrete Patio Color Ideas — What Works in 2026 →
          </Link>
        </div>
      </section>

      {/* Section 4: Pool Deck, Resurfacing & Maintenance */}
      <section className="mb-16">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
          Pool Deck, Resurfacing & Maintenance
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Pool decks have specific requirements that general patios don't. Slip resistance is non-negotiable — broom finish is the practical pool deck default because it provides reliable traction when wet without added cost. For a premium look, travertine-pattern stamped concrete with an anti-slip sealer additive is the most popular upgrade. Heat matters too: light colors and exposed aggregate stay cooler underfoot than dark stamped surfaces in direct sun. Drainage should slope away from the pool at a minimum 1% grade.
        </p>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Resurfacing extends the life of a structurally sound patio slab without full demolition. A concrete overlay runs $4–8/sq ft and adds 10–15 years. Some overlays can be stamped or stained, giving you a decorative finish on top of an existing plain slab. Resurfacing is not the right call if cracks are wider than a quarter inch, the slab is heaving, or more than 30% of the surface has spalled — at that point, full replacement is cheaper long-term.
        </p>
        <p className="text-muted-foreground leading-relaxed mb-4">
          For all finishes, sealing every 2–3 years is the single most important maintenance task. A penetrating silane-siloxane sealer protects against water infiltration, UV fade, and staining without changing the surface appearance. Stamped and colored patios benefit from a film-forming sealer that enhances color — but film-forming sealers need reapplication more frequently than penetrating types.
        </p>
        <div className="flex flex-col gap-2 text-sm text-muted-foreground">
          <Link to="/blog/patio/pool-deck-ideas-concrete" className="text-primary hover:underline">
            Full guide: Concrete Pool Deck Ideas — Finishes That Work Around Water →
          </Link>
          <Link to="/blog/patio/best-concrete-finish-pool-deck" className="text-primary hover:underline">
            Full guide: Best Concrete Finish for a Pool Deck →
          </Link>
          <Link to="/blog/patio/concrete-patio-resurfacing" className="text-primary hover:underline">
            Full guide: Concrete Patio Resurfacing — When It Makes Sense →
          </Link>
        </div>
      </section>

      {/* Section 5: Concrete Patio vs Pavers */}
      <section className="mb-16">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
          Concrete Patio vs Pavers
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          This is the most common decision homeowners face when planning a patio. Stamped concrete runs $12–18/sq ft installed; pavers run $20–40/sq ft depending on material and pattern complexity. On a 300 sq ft patio, that's a $2,400–6,600 difference in favor of concrete. Stamped concrete delivers a seamless surface with no joints to shift or settle, but individual crack repair is difficult — if one section cracks, the patch is visible.
        </p>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Pavers win on repairability: a single shifted or cracked paver can be lifted and replaced in minutes with no visible evidence. Paver joints are flexible, which means better performance in freeze-thaw climates where rigid concrete slabs can crack. Pavers also offer genuine material depth — real stone, brick, or porcelain has a tactile quality that stamped concrete mimics visually but can't replicate physically.
        </p>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Climate should drive the decision more than aesthetics. In freeze-thaw regions (Midwest, Northeast), pavers' flexible joints handle ground movement better. In hot, dry climates (Southwest, Southeast), concrete's rigid slab is an advantage — no joint sand to wash out, no weed growth between pavers. If budget is the deciding factor, concrete wins clearly; if long-term repairability matters most, pavers are worth the premium.
        </p>
        <div className="flex flex-col gap-2 text-sm text-muted-foreground">
          <Link to="/blog/patio/stamped-concrete-vs-pavers" className="text-primary hover:underline">
            Full comparison: Stamped Concrete vs Pavers — Cost, Durability & Maintenance →
          </Link>
          <Link to="/blog/patio/concrete-patio-vs-pavers" className="text-primary hover:underline">
            Full comparison: Concrete Patio vs Pavers — Which Is Right for You? →
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
        <InspirationEmailCapture slug="concrete-patio-guide" pillar="patio" />
      </div>

      {/* Final CTA */}
      <div className="rounded-2xl p-8 text-center border border-border">
        <h2 className="text-2xl font-bold text-foreground mb-3">See It Before You Pour It</h2>
        <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
          Upload a photo of your patio and preview stamped concrete, exposed aggregate, stained finishes, and color options — free, no sign-up required.
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

export default ConcretePatioGuide;
