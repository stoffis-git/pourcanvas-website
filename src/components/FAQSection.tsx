import { useState } from "react";
import { cn } from "@/lib/utils";
import type { FAQ } from "@/content/types";

interface FAQSectionProps {
  faqs: FAQ[];
  heading?: string;
  className?: string;
}

export function FAQSection({ faqs, heading = "Frequently Asked Questions", className }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (!faqs || faqs.length === 0) return null;

  return (
    <section className={cn("mt-12 border-t pt-10", className)}>
      <h2 className="text-xl md:text-2xl font-display font-bold text-foreground mb-6">{heading}</h2>
      <div className="space-y-2">
        {faqs.map((faq, index) => (
          <div key={index} className="border border-border rounded-lg overflow-hidden">
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full flex items-center justify-between px-5 py-4 text-left font-body font-medium text-foreground hover:bg-muted/50 transition-colors"
              aria-expanded={openIndex === index}
            >
              <span>{faq.question}</span>
              <svg
                className={cn(
                  "w-4 h-4 shrink-0 ml-4 text-muted-foreground transition-transform",
                  openIndex === index && "rotate-180"
                )}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {openIndex === index && (
              <div className="px-5 pb-5 font-body text-foreground/80 leading-relaxed text-sm md:text-base">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
