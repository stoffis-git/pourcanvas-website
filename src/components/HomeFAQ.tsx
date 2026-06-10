import { useState } from "react";
import { cn } from "@/lib/utils";
import type { FAQ } from "@/content/types";

export const homeFaqs: FAQ[] = [
  {
    question: "What is PourCanvas?",
    answer: "PourCanvas is an AI-powered visualizer that shows you what different concrete finishes — stamped, exposed aggregate, colored concrete, pavers, and more — would look like on your actual patio, driveway, or walkway. Upload a photo and see the transformation before you call a contractor. Most homeowners compare 3–5 finishes before settling on a direction.",
  },
  {
    question: "Is PourCanvas free to use?",
    answer: "Yes — you get 3 free designs every 24 hours, no credit card required. If you need more, paid plans start at $9/month (billed yearly) for 100 designs a month, with a Contractor Pro plan for high-volume use. Cancel anytime.",
  },
  {
    question: "What surfaces can I design?",
    answer: "Patios, driveways, walkways, pool decks, and steps. Any outdoor concrete or hardscape surface will work — just upload a photo of your space. Most projects fall into the 200–800 sq ft range where finish choice has the biggest visual and cost impact.",
  },
  {
    question: "What concrete finishes can I preview?",
    answer: "Stamped concrete, exposed aggregate, broom finish, colored/integral-pigment concrete, concrete pavers, flagstone, travertine, acid-stained, salt finish, ashlar slate, cobblestone, herringbone brick, and polished concrete — 16 finishes available, with more added regularly.",
  },
  {
    question: "How accurate is the AI visualization?",
    answer: "The tool shows realistic texture, color, and pattern — not a cartoon rendering. Visualizations are accurate enough to use as a contractor brief and make confident design decisions.",
  },
  {
    question: "Can I share the visualization with my contractor?",
    answer: "Yes. You'll be able to save or download your design and share it directly. Contractors consistently say a reference image cuts quoting back-and-forth by at least 1–2 conversations and reduces the chance of a finish misunderstanding on a $5,000–$15,000 project.",
  },
  {
    question: "What's the difference between stamped concrete and pavers?",
    answer: "Stamped concrete is poured as a single slab then imprinted with a pattern — lower upfront cost ($8–$12/sq ft), seamless finish, but cracks can propagate across the slab. Pavers are individual units set on a base — more expensive ($10–$20/sq ft) but individual pieces can be replaced if damaged.",
  },
  {
    question: "How much does a concrete patio typically cost?",
    answer: "A basic broom-finish concrete patio runs $4–$7/sq ft installed. Stamped or decorative finishes range from $8–$18/sq ft depending on pattern complexity and region. A 400 sq ft patio typically runs $3,200–$7,200 all-in for stamped work.",
  },
  {
    question: "Do I need design experience to use PourCanvas?",
    answer: "No. You'll upload a photo of your space, choose a finish style, and the AI handles the rest. No settings to configure — most users will generate their first visualization in under 60 seconds.",
  },
  {
    question: "What photo formats are supported?",
    answer: "JPG and PNG, up to 10MB. A standard smartphone photo works perfectly — no professional photography needed.",
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
          {homeFaqs.map((faq, i) => (
            <div key={i} className="border border-border rounded-xl overflow-hidden">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-5 py-4 text-left font-medium text-foreground hover:bg-muted/50 transition-colors"
                aria-expanded={open === i}
              >
                <span>{faq.question}</span>
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
                  {faq.answer}
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
