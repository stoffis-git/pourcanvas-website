import { useState } from "react";

interface Props {
  source?: string;
}

export function ToolWaitlistBlock({ source = 'tool-waitlist' }: Props) {
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
        body: JSON.stringify({ email, source }),
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
        <p className="text-sm text-muted-foreground mt-1">We'll notify you the moment it's ready.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-muted/30 px-6 py-6">
      <p className="font-semibold text-foreground mb-1">The AI tool is almost ready.</p>
      <p className="text-sm text-muted-foreground mb-4">
        Drop your email and we'll notify you the moment it launches — free to use.
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
          {submitting ? 'Sending…' : 'Notify me'}
        </button>
      </form>
      {error && <p className="text-xs text-destructive mt-2">{error}</p>}
    </div>
  );
}
