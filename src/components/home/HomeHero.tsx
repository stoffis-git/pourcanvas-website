import { Link } from "react-router-dom";
import { LeanWidget } from "@/components/tools/LeanWidget";
import { toolPages } from "@/content/tools";

const POINTS = ["Material list and installed cost in one result", "Dated, sourced U.S. pricing", "No signup, works on your phone"];

const HomeHero = () => (
  <section className="pt-28 md:pt-36 pb-12 md:pb-20 px-5">
    <div className="max-w-6xl mx-auto grid gap-10 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] items-center">
      <div>
        <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-4">
          {toolPages.length} free calculators
        </p>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground leading-tight mb-5">
          Plan your patio, driveway or walkway with real numbers
        </h1>
        <p className="text-lg md:text-xl font-body text-muted-foreground mb-7 max-w-xl">
          Free calculators for pavers, flagstone and concrete finishes. Get what to order, what it should cost, and which finish fits your climate.
        </p>
        <div className="flex flex-wrap gap-3 mb-7">
          <Link
            to="/tools"
            className="inline-block font-body font-semibold px-7 py-3.5 rounded-full hover:opacity-90 transition-opacity"
            style={{ background: "linear-gradient(135deg, #90d1bf, #9dde90)", color: "#2d2a26" }}
          >
            Browse all tools →
          </Link>
          <Link
            to="/tools/paver-patio-cost-calculator"
            className="inline-block font-body font-semibold px-7 py-3.5 rounded-full border border-border text-foreground hover:bg-muted/50 transition-colors"
          >
            Paver patio cost
          </Link>
        </div>
        <ul className="space-y-2 text-sm font-body text-foreground/80">
          {POINTS.map((p) => (
            <li key={p} className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden />
              {p}
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-3xl border border-border bg-background overflow-hidden shadow-sm">
        <img
          src="/studio/inspiration-ashlar-slate-patio-charcoal.jpg"
          alt="Charcoal ashlar slate stamped concrete patio"
          width={1200}
          height={675}
          className="aspect-[16/8] w-full object-cover"
        />
        <div className="px-5 md:px-6 -mt-4">
          <LeanWidget
            source="home-hero"
            widget={{
              tool: "patio-cost-calculator",
              variant: "compare",
              heading: "What would your patio cost?",
              compareMaterials: ["plain-concrete", "concrete-paver", "stamped-concrete", "flagstone-dry"],
            }}
          />
        </div>
      </div>
    </div>
  </section>
);

export default HomeHero;
