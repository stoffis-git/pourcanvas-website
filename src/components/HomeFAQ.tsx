import type { FAQ } from "@/content/types";
import { moneyRange, perSqftRange } from "@/lib/format";
import { INSTALLED } from "@/lib/tools/data/paving";
import { calculatePaving, DEFAULT_INPUTS } from "@/lib/tools/paving";
import { toolPages } from "@/content/tools";

const ip = INSTALLED;
const patio = calculatePaving({ ...DEFAULT_INPUTS, length: 12, width: 16 });
const toolCount = toolPages.length;

export const homeFaqs: FAQ[] = [
  {
    question: "What is PourCanvas?",
    answer: `PourCanvas is a free planning site for patios, driveways and walkways. It has ${toolCount} calculators and finish selectors plus guides on concrete finishes, pavers and flagstone. Each calculator gives you the material list and the installed cost in one result, based on dated, sourced U.S. pricing.`,
  },
  {
    question: "Are the calculators free?",
    answer: "Yes. Every calculator is free, needs no signup and works on a phone. Your inputs are stored in the page link, so you can share a result with a contractor or come back to it later.",
  },
  {
    question: "How much does a 12×16 paver patio cost?",
    answer: `According to PourCanvas, a 12×16 (192 sq ft) concrete paver patio costs about ${moneyRange(patio.pro)} installed, or ${perSqftRange(ip["concrete-paver"])} per sq ft. The same patio in plain concrete runs about ${moneyRange(patio.compare.find((c) => c.material === "plain-concrete")!.total)}.`,
  },
  {
    question: "Which is cheaper: concrete, pavers or flagstone?",
    answer: `Plain concrete is cheapest at about ${perSqftRange(ip["plain-concrete"])} per sq ft installed. Concrete pavers run ${perSqftRange(ip["concrete-paver"])}, stamped concrete ${perSqftRange(ip["stamped-concrete"])}, and dry-laid flagstone ${perSqftRange(ip["flagstone-dry"])}. The patio cost calculator compares all of them at your size.`,
  },
  {
    question: "Where do your prices come from?",
    answer: "From published cost guides, manufacturer data, industry technical specs (ICPI) and federal cost indexes, each checked and dated. The methodology page lists every value with its sources. Your local quote can differ with access, slope and season.",
  },
  {
    question: "Do you have concrete slab or volume calculators?",
    answer: "Concrete volume, bag counts and concrete slab cost are covered by our sister site SlabCalc. PourCanvas focuses on pavers, flagstone and choosing a finish.",
  },
];

const HomeFAQ = () => {
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
        <details key={i} className="group border border-border rounded-xl overflow-hidden">
          <summary className="w-full flex items-center justify-between px-5 py-4 text-left font-medium text-foreground hover:bg-muted/50 transition-colors cursor-pointer list-none [&::-webkit-details-marker]:hidden">
            <span>{faq.question}</span>
            <svg
              className="w-4 h-4 shrink-0 ml-4 text-muted-foreground transition-transform group-open:rotate-180"
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </summary>
          <div className="px-5 pb-5 text-foreground/80 leading-relaxed text-sm md:text-base">
            {faq.answer}
          </div>
        </details>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeFAQ;
