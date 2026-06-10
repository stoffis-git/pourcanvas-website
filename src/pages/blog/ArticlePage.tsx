import { Fragment } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SeoHead } from "@/components/SeoHead";
import { InspirationEmailCapture } from "@/components/inspiration/InspirationEmailCapture";
import { ToolWaitlistBlock } from "@/components/ToolWaitlistBlock";
import { FAQSection } from "@/components/FAQSection";
import { articlesBySlug, inspirationBySlug, allArticles } from "@/content";
import { InspirationTile } from "@/components/inspiration/InspirationTile";

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

  const relatedArticles = (article.relatedSlugs ?? [])
    .map((s) => allArticles.find((a) => a.slug === s))
    .filter((a): a is NonNullable<typeof a> => !!a);

  const galleryImages = article.sections
    .flatMap((s) => s.inspirationSlugs ?? [])
    .map((s) => inspirationBySlug.get(s))
    .filter((p): p is NonNullable<typeof p> => !!p && p.ogImage.startsWith("https://"))
    .map((p) => ({ url: p.ogImage, caption: p.headline }));

  return (
    <>
      <SeoHead
        title={article.title}
        description={article.metaDescription}
        ogImage={article.ogImage}
        ogType="article"
        canonical={`/blog/${article.pillar}/${article.slug}`}
        publishedAt={article.publishedAt}
        updatedAt={article.updatedAt}
        keywords={article.targetKeywords}
        faqs={article.faqs}
        breadcrumbs={[
          { name: "Blog", url: "/blog" },
          { name: article.pillar.charAt(0).toUpperCase() + article.pillar.slice(1), url: `/blog/${article.pillar}` },
          { name: article.headline, url: `/blog/${article.pillar}/${article.slug}` },
        ]}
        {...(galleryImages.length > 0 && { galleryImages })}
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
          {article.updatedAt
            ? `Updated ${new Date(article.updatedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`
            : new Date(article.publishedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
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
                <div className="font-body text-foreground/80 leading-relaxed prose-table" dangerouslySetInnerHTML={{ __html: section.body }} />
                {section.image && (
                  <img
                    src={section.image}
                    alt={section.imageAlt ?? section.heading}
                    className="mt-4 w-full rounded-xl object-cover aspect-video"
                  />
                )}
                {section.inspirationSlugs && section.inspirationSlugs.length > 0 && (
                  <div className="mt-5 grid grid-cols-2 md:grid-cols-3 gap-4">
                    {section.inspirationSlugs.map((s) => {
                      const page = inspirationBySlug.get(s);
                      if (!page || !page.ogImage.startsWith("https://")) return null;
                      return (
                        <InspirationTile
                          key={s}
                          slug={page.slug}
                          ogImage={page.ogImage}
                          heroAlt={page.heroAlt}
                          headline={page.headline}
                        />
                      );
                    })}
                  </div>
                )}
              </div>
              {i === midpoint - 1 && (
                <InspirationEmailCapture slug={slug ?? ''} pillar={pillar ?? ''} source="inspire-pack-blog" />
              )}
            </Fragment>
          ))}
        </div>

        <div className="mt-12">
          <ToolWaitlistBlock source="tool-waitlist-blog" />
        </div>

        {article.faqs && article.faqs.length > 0 && (
          <FAQSection faqs={article.faqs} />
        )}

        {relatedArticles.length > 0 && (
          <div className="mt-10 border-t pt-8">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-4">
              Related reading
            </h3>
            <ul className="space-y-2">
              {relatedArticles.map((a) => (
                <li key={a.slug}>
                  <Link
                    to={`/blog/${a.pillar}/${a.slug}`}
                    className="text-sm text-primary hover:underline"
                  >
                    {a.headline}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
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
