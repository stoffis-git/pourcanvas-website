import { useState } from "react";
import { Check, Home, HardHat } from "lucide-react";

export interface Plan {
  id: string;
  name: string;
  tagline: string;
  monthly: number;
  yearly: number; // effective per-month price when billed yearly
  yearlyTotal: number;
  designs: string;
  icon: typeof Home;
  highlight?: boolean;
  cta: string;
  features: string[];
}

export const PLANS: Plan[] = [
  {
    id: "homeowner",
    name: "Homeowner",
    tagline: "Plan your own project",
    monthly: 19,
    yearly: 9,
    yearlyTotal: 108,
    designs: "100 designs / month",
    icon: Home,
    cta: "Start with Homeowner",
    features: [
      "100 redesigns every month",
      "All 16 concrete finishes",
      "HD watermark-free downloads",
      "Side-by-side before / after",
      "Unused designs roll over 1 month",
    ],
  },
  {
    id: "pro",
    name: "Contractor Pro",
    tagline: "For pros who quote daily",
    monthly: 29,
    yearly: 15,
    yearlyTotal: 179,
    designs: "1,000 designs / month",
    icon: HardHat,
    highlight: true,
    cta: "Go Pro",
    features: [
      "1,000 redesigns every month",
      "All 16 finishes + creative mode",
      "4K downloads & client exports",
      "Commercial usage license",
      "Priority rendering queue",
    ],
  },
];

interface PricingCardsProps {
  /** tighter spacing for the paywall modal */
  compact?: boolean;
}

const PricingCards = ({ compact = false }: PricingCardsProps) => {
  const [yearly, setYearly] = useState(true);

  return (
    <div>
      {/* Billing toggle */}
      <div className="mb-6 flex items-center justify-center gap-3">
        <span className={`text-sm font-medium ${yearly ? "text-muted-foreground" : "text-foreground"}`}>
          Monthly
        </span>
        <button
          role="switch"
          aria-checked={yearly}
          aria-label="Toggle yearly billing"
          onClick={() => setYearly((v) => !v)}
          className="relative h-7 w-[52px] shrink-0 rounded-full bg-primary/25 transition-colors"
        >
          <span
            className="absolute left-1 top-1 h-5 w-5 rounded-full bg-primary shadow-sm transition-transform duration-200 ease-out"
            style={{ transform: yearly ? "translateX(24px)" : "translateX(0px)" }}
          />
        </button>
        <span className={`text-sm font-medium ${yearly ? "text-foreground" : "text-muted-foreground"}`}>
          Yearly
        </span>
        <span className="rounded-full bg-accent/40 px-2.5 py-1 text-xs font-semibold text-foreground">
          Save 50%
        </span>
      </div>

      <div className={`grid gap-4 sm:grid-cols-2 ${compact ? "" : "max-w-3xl mx-auto"}`}>
        {PLANS.map((plan) => {
          const Icon = plan.icon;
          const price = yearly ? plan.yearly : plan.monthly;
          return (
            <div
              key={plan.id}
              className={`relative flex flex-col rounded-3xl border p-6 transition-all ${
                plan.highlight
                  ? "border-primary/60 bg-gradient-to-b from-primary/10 to-transparent shadow-lg shadow-primary/10"
                  : "border-border bg-background"
              }`}
            >
              {plan.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-foreground px-3 py-1 text-xs font-semibold uppercase tracking-wide text-background">
                  Most popular
                </span>
              )}

              <div className="mb-1 flex items-center gap-2.5">
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                    plan.highlight ? "bg-primary/25" : "bg-muted"
                  }`}
                >
                  <Icon className="h-5 w-5 text-foreground" />
                </span>
                <div>
                  <p className="font-display text-lg font-semibold leading-none text-foreground">
                    {plan.name}
                  </p>
                  <p className="text-xs text-muted-foreground">{plan.tagline}</p>
                </div>
              </div>

              <div className="mb-1 mt-4 flex items-end gap-1.5">
                <span className="text-4xl font-bold text-foreground">${price}</span>
                <span className="mb-1 text-sm text-muted-foreground">/ month</span>
              </div>
              <p className="mb-4 text-sm text-muted-foreground">
                {yearly ? `Billed $${plan.yearlyTotal}/year · ` : ""}
                {plan.designs}
              </p>

              <ul className="mb-6 space-y-2.5">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-foreground/90">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#6bb8a3]" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`mt-auto rounded-full px-6 py-3 text-sm font-semibold transition-opacity hover:opacity-90 ${
                  plan.highlight ? "text-[#2d2a26]" : "border border-border text-foreground"
                }`}
                style={
                  plan.highlight
                    ? { background: "linear-gradient(135deg, #90d1bf, #9dde90)" }
                    : undefined
                }
              >
                {plan.cta}
              </button>
            </div>
          );
        })}
      </div>

      <p className="mt-5 text-center text-xs text-muted-foreground">
        Or keep using <span className="font-medium text-foreground">3 free designs every 24 hours</span> — no card required. Cancel anytime.
      </p>
    </div>
  );
};

export default PricingCards;
