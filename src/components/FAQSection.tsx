import { cn } from "@/lib/utils";
import type { FAQ } from "@/content/types";

interface FAQSectionProps {
  faqs: FAQ[];
  heading?: string;
  className?: string;
}

export function FAQSection({ faqs, heading = "Frequently Asked Questions", className }: FAQSectionProps) {
  if (!faqs || faqs.length === 0) return null;

  return (
    <section className={cn("mt-12 border-t pt-10", className)}>
      <h2 className="text-xl md:text-2xl font-display font-bold text-foreground mb-6">{heading}</h2>
      <div className="space-y-2">
        {faqs.map((faq, index) => (
          <details key={index} className="group border border-border rounded-lg overflow-hidden">
            <summary className="w-full flex items-center justify-between px-5 py-4 text-left font-body font-medium text-foreground hover:bg-muted/50 transition-colors cursor-pointer list-none [&::-webkit-details-marker]:hidden">
              <span>{faq.question}</span>
              <svg
                className="w-4 h-4 shrink-0 ml-4 text-muted-foreground transition-transform group-open:rotate-180"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <div className="px-5 pb-5 font-body text-foreground/80 leading-relaxed text-sm md:text-base">
              {faq.answer}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
