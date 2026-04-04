import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SeoHead } from "@/components/SeoHead";
import { articlesByPillar } from "@/content";
import type { Pillar } from "@/content";

const pillars: { id: Pillar; label: string; description: string }[] = [
  {
    id: "patio",
    label: "Patio",
    description: "Stamped patterns, color ideas, cost guides, and design inspiration for your patio.",
  },
  {
    id: "driveway",
    label: "Driveway",
    description: "Curb appeal upgrades, finish comparisons, and driveway design ideas.",
  },
  {
    id: "walkway",
    label: "Walkway",
    description: "Front path ideas, material comparisons, and concrete walkway design guides.",
  },
];

const BlogHub = () => (
  <>
    <SeoHead
      title="Concrete Patio, Driveway & Walkway Ideas | PourCanvas Blog"
      description="30+ design guides and cost breakdowns for concrete patios, driveways, and walkways. Browse by topic or surface type."
      canonical="/blog"
    />
    <Header />
    <main className="max-w-6xl mx-auto px-5 py-28 md:py-36">
      <div className="max-w-2xl mb-12">
        <p className="text-sm font-display font-medium text-muted-foreground uppercase tracking-widest mb-3">
          Ideas & Guides
        </p>
        <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground leading-tight mb-4">
          Concrete Design Blog
        </h1>
        <p className="text-base md:text-lg font-body text-muted-foreground">
          Practical guides, design ideas, and cost breakdowns for homeowners planning an outdoor concrete project. For finish-level detail, see the <Link to="/materials" className="text-primary hover:underline">concrete materials guide</Link>.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-3 mb-16">
        {pillars.map((pillar) => (
          <Link
            key={pillar.id}
            to={`/blog/${pillar.id}`}
            className="group rounded-2xl border border-border bg-card p-6 hover:border-primary/40 transition-colors"
          >
            <h2 className="text-xl font-display font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
              {pillar.label}
            </h2>
            <p className="text-sm font-body text-muted-foreground mb-4">{pillar.description}</p>
            <span className="text-xs font-body text-muted-foreground">
              {articlesByPillar[pillar.id].length} articles
            </span>
          </Link>
        ))}
      </div>

      <div>
        <h2 className="text-2xl font-display font-bold text-foreground mb-6">All Articles</h2>
        <div className="divide-y divide-border">
          {Object.entries(articlesByPillar).flatMap(([pillar, articles]) =>
            articles.map((article) => (
              <Link
                key={`${pillar}/${article.slug}`}
                to={`/blog/${article.pillar}/${article.slug}`}
                className="flex items-start justify-between gap-4 py-4 group"
              >
                <div>
                  <span className="text-xs font-body text-muted-foreground uppercase tracking-widest mb-1 block">
                    {article.pillar}
                  </span>
                  <h3 className="text-base font-body font-medium text-foreground group-hover:text-primary transition-colors">
                    {article.title}
                  </h3>
                </div>
                <span className="text-xs font-body text-muted-foreground shrink-0 pt-5">
                  {new Date(article.publishedAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                </span>
              </Link>
            ))
          )}
        </div>
      </div>
    </main>
    <Footer />
  </>
);

export default BlogHub;
