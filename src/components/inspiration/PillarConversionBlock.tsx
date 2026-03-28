import { Link } from "react-router-dom";
import type { Pillar } from "@/content/types";

const pillarCopy: Record<Pillar, { headline: string; body: string; cta: string }> = {
  patio: {
    headline: "Curious what your patio could look like?",
    body: "Upload a photo and get an AI preview of any concrete finish — free, no account needed.",
    cta: "See Patio Ideas →",
  },
  driveway: {
    headline: "Want to see this on your driveway?",
    body: "Upload a photo of your driveway and get an AI-generated preview of any finish in seconds.",
    cta: "See Driveway Ideas →",
  },
  walkway: {
    headline: "Imagining this for your walkway?",
    body: "Upload a photo of your walkway and see how any concrete style would look — free to try.",
    cta: "See Walkway Ideas →",
  },
};

export const PillarConversionBlock = ({ pillar }: { pillar: Pillar }) => {
  const { headline, body, cta } = pillarCopy[pillar];
  return (
    <div className="rounded-2xl bg-primary/10 border border-primary/20 px-6 py-8 md:px-10 md:py-10 flex flex-col md:flex-row md:items-center gap-6">
      <div className="flex-1">
        <h2 className="text-xl md:text-2xl font-display font-bold text-foreground mb-2">{headline}</h2>
        <p className="text-sm md:text-base font-body text-muted-foreground">{body}</p>
      </div>
      <Link
        to={`/${pillar}`}
        className="inline-block shrink-0 bg-primary text-primary-foreground font-body font-semibold px-6 py-3 rounded-full hover:bg-primary/90 transition-colors text-sm text-center"
      >
        {cta}
      </Link>
    </div>
  );
};
