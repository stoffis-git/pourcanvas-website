import { Fragment } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SeoHead } from "@/components/SeoHead";
import { InspirationUpsellTile } from "@/components/inspiration/InspirationUpsellTile";
import { FAQSection } from "@/components/FAQSection";
import { articlesBySlug } from "@/content";

const materialLabels: Record<string, string> = {
  "stamped-concrete": "Stamped Concrete",
  "exposed-aggregate": "Exposed Aggregate",
  "broom-finish": "Broom Finish",
  "colored-concrete": "Colored Concrete",
  "concrete-pavers": "Concrete Pavers",
  flagstone: "Flagstone",
  travertine: "Travertine",
  "polished-concrete": "Polished Concrete",
  "concrete-overlay": "Concrete Overlay",
};

const ArticlePage = () => {
  const { pillar, slug } = useParams<{ pillar: string; slug: string }>();
  const article = articlesBySlug.get(`${pillar}/${slug}`);

  if (!article) return null;

  const midpoint = Math.floor(article.sections.length / 2);

  return (
    <>
      <SeoHead
        title={article.title}
        description={article.metaDescription}
        ogImage={article.ogImage}
        ogType="article"
        canonical={`/blog/${article.pillar}/${article.slug}`}
        publishedAt={article.publishedAt}
        keywords={article.targetKeywords}
        faqs={article.faqs}
      />
      <Header />
      <main className="max-w-3xl mx-auto px-5 py-28 md:py-36">
        <div className="mb-4 flex items-center gap-2 text-xs font-body text-muted-foreground">
          <Link to="/blog" className="hover:text-foreground transition-colors">Blog</Link>
          <span>/</span>
          <Link to={`/blog/${article.pillar}`} className="hover:text-foreground transition-colors capitalize">
            {article.pillar}
          </Link>
        </div>

        {article.ogImage?.startsWith("https://") && (
          <img
            src={article.ogImage}
            alt={article.headline}
            className="w-full rounded-2xl object-cover aspect-[2/3] md:aspect-[4/3] mb-8"
            draggable={false}
          />
        )}

        <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground leading-tight mb-4">
          {article.headline}
        </h1>

        <p className="text-xs font-body text-muted-foreground mb-8">
          {new Date(article.publishedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
        </p>

        <p className="text-base md:text-lg font-body text-foreground/80 leading-relaxed mb-10">
          {article.intro}
        </p>

        <div className="space-y-8">
          {article.sections.map((section, i) => (
            <Fragment key={section.heading}>
              <div>
                <h2 className="text-xl md:text-2xl font-display font-bold text-foreground mb-3">
                  {section.heading}
                </h2>
                <p className="font-body text-foreground/80 leading-relaxed">{section.body}</p>
                {section.image && (
                  <img
                    src={section.image}
                    alt={section.imageAlt ?? section.heading}
                    className="mt-4 w-full rounded-xl object-cover aspect-video"
                  />
                )}
              </div>
              {i === midpoint - 1 && (
                <InspirationUpsellTile
                  headline="See what this could look like in your space"
                  body="Upload a photo of your patio, driveway, or walkway and get an AI-generated preview in seconds."
                />
              )}
            </Fragment>
          ))}
        </div>

        <div className="mt-12">
          <InspirationUpsellTile
            headline="Ready to visualize your project?"
            body="PourCanvas turns your photo into a concrete design preview. Free to try, no account needed."
          />
        </div>

        {article.faqs && article.faqs.length > 0 && (
          <FAQSection faqs={article.faqs} />
        )}

        {article.relatedMaterials && article.relatedMaterials.length > 0 && (
          <div className="mt-10 border-t pt-8">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-4">
              Material guides
            </h3>
            <ul className="space-y-2">
              {article.relatedMaterials.map((slug) => (
                <li key={slug}>
                  <Link
                    to={`/materials/${slug}`}
                    className="text-sm text-primary hover:underline"
                  >
                    {materialLabels[slug] ?? slug}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
};

export default ArticlePage;
