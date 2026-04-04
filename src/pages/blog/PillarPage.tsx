import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SeoHead } from "@/components/SeoHead";
import { articlesByPillar, pillarMeta } from "@/content";
import type { Pillar } from "@/content";

const PillarPage = () => {
  const { pillar } = useParams<{ pillar: string }>();
  const p = pillar as Pillar;
  const articles = articlesByPillar[p] ?? [];
  const meta = pillarMeta[p];

  if (!meta) return null;

  return (
    <>
      <SeoHead
        title={meta.title}
        description={meta.description}
        canonical={`/blog/${p}`}
      />
      <Header />
      <main className="max-w-6xl mx-auto px-5 py-28 md:py-36">
        <div className="mb-4">
          <Link to="/blog" className="text-xs font-body text-muted-foreground hover:text-foreground transition-colors">
            ← Blog
          </Link>
        </div>
        <div className="max-w-2xl mb-12">
          <p className="text-sm font-display font-medium text-muted-foreground uppercase tracking-widest mb-3">
            {p.charAt(0).toUpperCase() + p.slice(1)}
          </p>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground leading-tight mb-4">
            {meta.headline}
          </h1>
          <p className="text-base md:text-lg font-body text-muted-foreground">{meta.description}</p>
          <p className="text-sm font-body text-muted-foreground mt-3">
            {articles.length} articles &middot; <Link to="/materials" className="text-primary hover:underline">Browse concrete finish guides →</Link>
          </p>
        </div>

        <div className="divide-y divide-border">
          {articles.map((article) => (
            <Link
              key={article.slug}
              to={`/blog/${article.pillar}/${article.slug}`}
              className="flex items-start justify-between gap-4 py-5 group"
            >
              <div>
                <h2 className="text-lg font-body font-medium text-foreground group-hover:text-primary transition-colors mb-1">
                  {article.title}
                </h2>
                <p className="text-sm font-body text-muted-foreground line-clamp-2">
                  {article.metaDescription}
                </p>
              </div>
              <span className="text-xs font-body text-muted-foreground shrink-0 pt-1">
                {new Date(article.publishedAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
              </span>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default PillarPage;
