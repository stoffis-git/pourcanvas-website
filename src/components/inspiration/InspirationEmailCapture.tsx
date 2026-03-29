import { useState } from "react";

interface Props {
  slug: string;
  pillar?: string;
}

export function InspirationEmailCapture({ slug, pillar = '' }: Props) {
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
        body: JSON.stringify({ email, slug, pillar }),
      });

      if (!res.ok) throw new Error('Request failed');
      setSubmitted(true);
    } catch {
      setError('Something went wrong — please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="rounded-2xl border border-border bg-muted/30 px-6 py-6">
        <p className="font-semibold text-foreground">You're on the list.</p>
        <p className="text-sm text-muted-foreground mt-1">Check your inbox shortly.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-muted/30 px-6 py-6">
      <p className="font-semibold text-foreground mb-1">Get the full inspiration pack — free.</p>
      <p className="text-sm text-muted-foreground mb-4">
        20+ curated patio, driveway and walkway design images delivered to your inbox.
      </p>
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
          className="rounded-lg px-5 py-2 text-sm font-medium bg-foreground text-background hover:opacity-80 transition-opacity disabled:opacity-50 whitespace-nowrap"
        >
          {submitting ? 'Sending…' : 'Send me the pack'}
        </button>
      </form>
      {error && <p className="text-xs text-destructive mt-2">{error}</p>}
    </div>
  );
}
