import { useState } from "react";
import type { Pillar } from "@/content/types";

const pillarCopy: Record<Pillar, { headline: string; body: string }> = {
  patio: {
    headline: "Curious what your patio could look like?",
    body: "The AI visualizer launches soon — drop your email and be first to try it free.",
  },
  driveway: {
    headline: "Want to see this on your driveway?",
    body: "The AI visualizer launches soon — drop your email and be first to try it free.",
  },
  walkway: {
    headline: "Imagining this for your walkway?",
    body: "The AI visualizer launches soon — drop your email and be first to try it free.",
  },
};

export const PillarConversionBlock = ({ pillar }: { pillar: Pillar }) => {
  const { headline, body } = pillarCopy[pillar];
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/inspire-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, pillar, source: 'tool-waitlist-pillar' }),
      });
      if (!res.ok) throw new Error('Request failed');
      setSubmitted(true);
    } catch {
      setError('Something went wrong — please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-2xl bg-primary/10 border border-primary/20 px-6 py-8 md:px-10 md:py-10">
      <h2 className="text-xl md:text-2xl font-display font-bold text-foreground mb-2">{headline}</h2>
      <p className="text-sm md:text-base font-body text-muted-foreground mb-5">{body}</p>
      {submitted ? (
        <p className="text-sm font-semibold text-foreground">You're on the list — we'll notify you when it's ready.</p>
      ) : (
        <form onSubmit={handleSubmit} className="flex gap-2 flex-col sm:flex-row">
          <input
            type="email"
            placeholder="Your email address"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="flex-1 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
          />
          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg px-5 py-2 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 whitespace-nowrap"
          >
            {submitting ? 'Sending…' : 'Notify me'}
          </button>
        </form>
      )}
      {error && <p className="text-xs text-destructive mt-2">{error}</p>}
    </div>
  );
};
