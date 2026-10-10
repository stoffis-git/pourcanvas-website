import { Link } from "react-router-dom";
import { TOOL_CATEGORIES, toolPages } from "@/content/tools";

/** All tools grouped by category, as cards. */
const ToolGrid = () => (
  <section className="section-padding border-t border-border/50">
    <div className="max-w-6xl mx-auto">
      <div className="text-center max-w-xl mx-auto mb-10">
        <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-3">Free tools</p>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Calculators for every step</h2>
        <p className="text-muted-foreground leading-relaxed">From choosing a material to ordering base gravel and joint sand.</p>
      </div>
      {TOOL_CATEGORIES.map((cat) => {
        const tools = toolPages.filter((t) => t.category === cat.id);
        if (tools.length === 0) return null;
        return (
          <div key={cat.id} className="mb-10">
            <h3 className="text-lg font-semibold text-foreground mb-1">{cat.title}</h3>
            <p className="text-sm text-muted-foreground mb-4">{cat.blurb}</p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {tools.map((t) => (
                <Link key={t.slug} to={`/tools/${t.slug}`} className="rounded-2xl border border-border bg-muted/20 p-5 hover:border-primary transition-colors">
                  <span className="block font-semibold text-foreground mb-1">{t.h1}</span>
                  <span className="block text-sm text-muted-foreground">{t.summary}</span>
                </Link>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  </section>
);

export default ToolGrid;
