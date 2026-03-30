import { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const SESSION_KEY = "inspire-popup-dismissed";

interface Props {
  slug: string;
  pillar?: string;
}

export function InspirationPopup({ slug, pillar = "" }: Props) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY)) return;
    timerRef.current = setTimeout(() => setOpen(true), 4000);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  function dismiss() {
    sessionStorage.setItem(SESSION_KEY, "1");
    setOpen(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/inspire-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, slug, pillar, source: "inspire-pack-popup" }),
      });

      if (!res.ok) throw new Error("Request failed");
      setSubmitted(true);
      sessionStorage.setItem(SESSION_KEY, "1");
      setTimeout(() => setOpen(false), 2000);
    } catch {
      setError("Something went wrong — please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(next) => { if (!next) dismiss(); }}>
      <DialogContent className="max-w-md px-6 py-8">
        {submitted ? (
          <>
            <DialogTitle className="text-lg font-semibold">You're on the list.</DialogTitle>
            <DialogDescription className="mt-1">
              Check your inbox shortly.
            </DialogDescription>
          </>
        ) : (
          <>
            <DialogTitle className="text-lg font-semibold">
              Get the full inspiration pack — free.
            </DialogTitle>
            <DialogDescription className="mt-1 mb-5">
              20+ curated patio, driveway and walkway design images delivered to your inbox.
            </DialogDescription>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
              />
              <button
                type="submit"
                disabled={submitting}
                className="rounded-lg px-5 py-2 text-sm font-medium bg-foreground text-background hover:opacity-80 transition-opacity disabled:opacity-50 whitespace-nowrap"
              >
                {submitting ? "Sending…" : "Send me the pack"}
              </button>
            </form>
            {error && <p className="text-xs text-destructive mt-2">{error}</p>}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
