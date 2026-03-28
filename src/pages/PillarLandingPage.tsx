import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SeoHead } from "@/components/SeoHead";
import { PillarConversionBlock } from "@/components/inspiration/PillarConversionBlock";
import { InspirationTile } from "@/components/inspiration/InspirationTile";
import { inspirationByPillar, articlesByPillar, pillarMeta } from "@/content";
import type { Pillar } from "@/content/types";

const pillarHero: Record<Pillar, { headline: string; sub: string }> = {
  patio: {
    headline: "See What Your Patio Could Look Like",
    sub: "Browse real concrete finishes, then preview them in your own space.",
  },
  driveway: {
    headline: "See What Your Driveway Could Look Like",
    sub: "Explore curb appeal ideas from stamped concrete to exposed aggregate.",
  },
  walkway: {
    headline: "See What Your Walkway Could Look Like",
    sub: "Flagstone, stamped concrete, herringbone — see it before you build it.",
  },
};

const PillarLandingPage = ({ pillar }: { pillar: Pillar }) => {
  const meta = pillarMeta[pillar];
  const hero = pillarHero[pillar];
  const inspirations = inspirationByPillar[pillar].filter((p) =>
    p.ogImage.startsWith("https://")
  );
  const articles = articlesByPillar[pillar].slice(0, 3);

  return (
    <>
      <SeoHead
        title={meta.title}
        description={meta.description}
        canonical={`/${pillar}`}
      />
      <Header />

      {/* Hero */}
      <section className="pt-28 md:pt-36 pb-16 md:pb-24 px-5">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground leading-tight mb-4">
            {hero.headline}
          </h1>
          <p className="text-lg md:text-xl font-body text-muted-foreground mb-8 max-w-2xl mx-auto">
            {hero.sub}
          </p>
          <Link
            to="/"
            className="inline-block font-body font-semibold px-8 py-4 rounded-full border-0 hover:opacity-90 transition-opacity text-base"
            style={{ background: "linear-gradient(135deg, #90d1bf, #9dde90)", color: "#2d2a26" }}
          >
            Try It Free →
          </Link>
        </div>
      </section>

      {/* Inspiration grid */}
      {inspirations.length > 0 && (
        <section className="px-5 pb-16 md:pb-24">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-8">
              {pillar.charAt(0).toUpperCase() + pillar.slice(1)} Inspiration
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {inspirations.map((page) => (
                <InspirationTile
                  key={page.slug}
                  slug={page.slug}
                  ogImage={page.ogImage}
                  heroAlt={page.heroAlt}
                  headline={page.headline}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Latest articles */}
      {articles.length > 0 && (
        <section className="px-5 pb-16 md:pb-24 border-t border-border/40 pt-12">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-8">
              {pillar.charAt(0).toUpperCase() + pillar.slice(1)} Guides
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {articles.map((article) => (
                <Link
                  key={article.slug}
                  to={`/blog/${pillar}/${article.slug}`}
                  className="group block p-6 rounded-2xl border border-border/50 hover:border-primary/30 hover:bg-primary/5 transition-all"
                >
                  <h3 className="text-base md:text-lg font-display font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {article.headline}
                  </h3>
                  <p className="text-sm font-body text-muted-foreground line-clamp-3">
                    {article.intro}
                  </p>
                </Link>
              ))}
            </div>
            <div className="mt-6">
              <Link
                to={`/blog/${pillar}`}
                className="text-sm font-body text-primary hover:underline"
              >
                View all {pillar} guides →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Pillar CTA */}
      <section className="px-5 pb-24">
        <div className="max-w-4xl mx-auto">
          <PillarConversionBlock pillar={pillar} />
        </div>
      </section>

      <Footer />
    </>
  );
};

export default PillarLandingPage;
