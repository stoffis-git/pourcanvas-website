import { Link } from "react-router-dom";
import { toolsBySlug } from "@/content/tools";

/** "Plan it with a free tool" block for content pages. */
export function RelatedToolsList({ slugs }: { slugs: string[] }) {
  const tools = slugs.map((s) => toolsBySlug.get(s)).filter((t): t is NonNullable<typeof t> => !!t);
  if (tools.length === 0) return null;
  return (
    <div className="rounded-2xl border border-border bg-muted/30 px-6 py-6">
      <p className="font-semibold text-foreground mb-3">Plan it with a free calculator</p>
      <ul className="grid gap-3 sm:grid-cols-2">
        {tools.map((t) => (
          <li key={t.slug}>
            <Link to={`/tools/${t.slug}`} className="block rounded-xl border border-border bg-background px-4 py-3 hover:border-primary transition-colors">
              <span className="block text-sm font-semibold text-foreground">{t.h1}</span>
              <span className="block text-xs text-muted-foreground mt-0.5">{t.summary}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
