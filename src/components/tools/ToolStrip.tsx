import { Link } from "react-router-dom";
import { toolsBySlug } from "@/content/tools";

/** Compact row of tool links (no headings, safe to add to FROZEN pages). */
export function ToolStrip({ slugs, label = "Free calculators" }: { slugs: string[]; label?: string }) {
  const tools = slugs.map((s) => toolsBySlug.get(s)).filter((t): t is NonNullable<typeof t> => !!t);
  if (tools.length === 0) return null;
  return (
    <div className="px-5">
      <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-center gap-2 text-sm">
        <span className="text-muted-foreground mr-1">{label}:</span>
        {tools.map((t) => (
          <Link key={t.slug} to={`/tools/${t.slug}`} className="rounded-pill border border-border bg-background px-3 py-1.5 text-foreground hover:border-primary transition-colors">
            {t.h1}
          </Link>
        ))}
        <Link to="/tools" className="px-2 py-1.5 text-primary hover:underline">All tools →</Link>
      </div>
    </div>
  );
}
