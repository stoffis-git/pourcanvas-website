import { useState } from "react";

interface Props {
  slug: string;
  pillar?: string;
  source?: string;
  pageHeadline?: string;
}

export function InspirationEmailCapture({ slug, pillar = '', source = 'inspire-pack', pageHeadline }: Props) {
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
        body: JSON.stringify({ email, slug, pillar, source }),
      });

      if (!res.ok) throw new Error('Request failed');
      setSubmitted(true);
    } catch {
      setError('Something went wrong — please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const heading = pageHeadline
    ? `Get more ${pageHeadline} ideas — free.`
    : "Get the full inspiration pack — free.";

  const description = pageHeadline
    ? `We'll send 30+ curated ${pillar} designs to your inbox.`
    : "30+ curated patio, driveway and walkway design images delivered to your inbox.";

  if (submitted) {
    return (
      <div className="rounded-2xl bg-black px-6 py-6">
        <p className="font-semibold text-white">You're on the list.</p>
        <p className="text-sm text-white/70 mt-1">Check your inbox shortly.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-black px-6 py-6">
      <p className="font-semibold text-white mb-1">{heading}</p>
      <p className="text-sm text-white/70 mb-4">{description}</p>
      <form onSubmit={handleSubmit} className="flex gap-2 flex-col sm:flex-row">
        <input
          type="email"
          placeholder="Your email address"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          className="flex-1 rounded-lg border border-white/20 bg-white/10 text-white placeholder:text-white/40 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-white/50"
        />
        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg px-5 py-2 text-sm font-medium bg-white text-black hover:opacity-80 transition-opacity disabled:opacity-50 whitespace-nowrap"
        >
          {submitting ? 'Sending…' : 'Send me the pack'}
        </button>
      </form>
      {error && <p className="text-xs text-red-400 mt-2">{error}</p>}
    </div>
  );
}
