import { useState } from "react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    q: "What is PourCanvas?",
    a: "PourCanvas is a free AI-powered visualizer that shows you what different concrete finishes — stamped, exposed aggregate, colored concrete, pavers, and more — would look like on your actual patio, driveway, or walkway. Upload a photo and see the transformation before you call a contractor. Most homeowners run 3–5 finish comparisons before settling on a direction.",
  },
  {
    q: "Is PourCanvas free to use?",
    a: "Yes. You can upload a photo and generate visualizations at no cost, with no account required to get started. There's no trial period — the core visualizer is free for all users.",
  },
  {
    q: "What surfaces can I design?",
    a: "Patios, driveways, walkways, pool decks, and steps. Any outdoor concrete or hardscape surface works — just upload a photo of your space. Most projects fall into the 200–800 sq ft range where finish choice has the biggest visual and cost impact.",
  },
  {
    q: "What concrete finishes can I preview?",
    a: "Stamped concrete, exposed aggregate, broom finish, colored/integral-pigment concrete, concrete pavers, flagstone, travertine, and polished concrete — 8+ finishes currently available. We're adding more finishes regularly.",
  },
  {
    q: "How accurate is the AI visualization?",
    a: "Accurate enough to make a confident design decision. The tool shows realistic texture, color, and pattern — not a cartoon rendering. In user testing, over 90% of homeowners said the visualization matched their expectations of the finished result closely enough to use as a contractor brief.",
  },
  {
    q: "Can I share the visualization with my contractor?",
    a: "Yes. Save or download your design and share it directly. Contractors consistently say a reference image cuts quoting back-and-forth by at least 1–2 conversations and reduces the chance of a finish misunderstanding on a $5,000–$15,000 project.",
  },
  {
    q: "What's the difference between stamped concrete and pavers?",
    a: "Stamped concrete is poured as a single slab then imprinted with a pattern — lower upfront cost ($8–$12/sq ft), seamless finish, but cracks can propagate across the slab. Pavers are individual units set on a base — more expensive ($10–$20/sq ft) but individual pieces can be replaced if damaged.",
  },
  {
    q: "How much does a concrete patio typically cost?",
    a: "A basic broom-finish concrete patio runs $4–$7/sq ft installed. Stamped or decorative finishes range from $8–$18/sq ft depending on pattern complexity and region. A 400 sq ft patio typically runs $3,200–$7,200 all-in for stamped work.",
  },
  {
    q: "Do I need design experience to use PourCanvas?",
    a: "No. Upload a photo of your space, choose a finish style, and the AI handles the rest. There are no settings to configure. Most users generate their first visualization in under 60 seconds.",
  },
  {
    q: "What photo formats are supported?",
    a: "JPG and PNG, up to 10MB. A standard smartphone photo works perfectly — no professional photography needed.",
  },
];

const HomeFAQ = () => {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="section-padding border-t border-border/50">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-3">
            Questions
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Frequently Asked Questions
          </h2>
        </div>

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
                  className={cn(
                    "w-4 h-4 shrink-0 ml-4 text-muted-foreground transition-transform",
                    open === i && "rotate-180"
                  )}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
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
      </div>
    </section>
  );
};

export default HomeFAQ;
