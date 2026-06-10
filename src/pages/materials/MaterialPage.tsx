import { Fragment } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SeoHead } from "@/components/SeoHead";
import { InspirationEmailCapture } from "@/components/inspiration/InspirationEmailCapture";
import { ToolWaitlistBlock } from "@/components/ToolWaitlistBlock";
import { MaterialProConBlock } from "@/components/materials/MaterialProConBlock";
import { MaterialRelatedArticles } from "@/components/materials/MaterialRelatedArticles";
import { FAQSection } from "@/components/FAQSection";
import { materialsBySlug } from "@/content";

const MaterialPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const material = materialsBySlug.get(slug ?? "");

  if (!material) return null;

  const midpoint = Math.floor(material.sections.length / 2);

  return (
    <>
      <SeoHead
        title={material.title}
        description={material.metaDescription}
        ogImage={material.ogImage}
        ogType="article"
        canonical={`/materials/${material.slug}`}
        publishedAt={material.publishedAt}
        updatedAt={material.updatedAt}
        keywords={material.targetKeywords}
        faqs={material.faqs}
        imageGallery={material.images}
        breadcrumbs={[
          { name: "Materials", url: "/materials" },
          { name: material.headline, url: `/materials/${material.slug}` },
        ]}
      />
      <Header />
      <main className="max-w-3xl mx-auto px-5 py-28 md:py-36">
        <div className="mb-4 flex items-center gap-2 text-xs font-body text-muted-foreground">
          <Link to="/materials" className="hover:text-foreground transition-colors">Materials</Link>
        </div>

        <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground leading-tight mb-4">
          {material.headline}
        </h1>

        <p className="text-xs font-body text-muted-foreground mb-8">
          {material.updatedAt
            ? `Updated ${new Date(material.updatedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`
            : new Date(material.publishedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
        </p>

        {material.images && material.images.length > 0 && (
          <figure className="mb-10 overflow-hidden rounded-2xl border border-border">
            <img
              src={material.images[0].url}
              alt={material.images[0].alt}
              width={1200}
              height={675}
              className="aspect-[16/9] w-full object-cover"
            />
          </figure>
        )}

        <p className="text-base md:text-lg font-body text-foreground/80 leading-relaxed mb-10">
          {material.intro}
        </p>

        {material.prosAndCons && <MaterialProConBlock data={material.prosAndCons} />}

        <div className="space-y-8">
          {material.sections.map((section, i) => (
            <Fragment key={section.heading}>
              <div>
                <h2 className="text-xl md:text-2xl font-display font-bold text-foreground mb-3">
                  {section.heading}
                </h2>
                <div className="font-body text-foreground/80 leading-relaxed prose-table" dangerouslySetInnerHTML={{ __html: section.body }} />
              </div>
              {i === midpoint - 1 && (
                <ToolWaitlistBlock source="tool-waitlist-material" />
              )}
            </Fragment>
          ))}
        </div>

        {material.images && material.images.length > 1 && (
          <div className="mt-12">
            <h2 className="text-xl md:text-2xl font-display font-bold text-foreground mb-5">
              {material.headline} in the real world
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {material.images.slice(1).map((img) => (
                <figure key={img.url} className="overflow-hidden rounded-xl border border-border">
                  <img
                    src={img.url}
                    alt={img.alt}
                    loading="lazy"
                    width={600}
                    height={450}
                    className="aspect-[4/3] w-full object-cover"
                  />
                  <figcaption className="px-3 py-2 text-xs font-body text-muted-foreground">
                    {img.alt}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        )}

        <InspirationEmailCapture slug={slug ?? ''} />

        {material.faqs && material.faqs.length > 0 && (
          <FAQSection faqs={material.faqs} />
        )}

        {material.relatedArticles && material.relatedArticles.length > 0 && (
          <MaterialRelatedArticles articles={material.relatedArticles} />
        )}

        {material.relatedPillars && material.relatedPillars.length > 0 && (
          <div className="mt-8 pt-8 border-t border-border/40">
            <p className="text-xs font-body text-muted-foreground mb-3">Use this finish on</p>
            <div className="flex gap-4 flex-wrap">
              {material.relatedPillars.map((pillar) => (
                <Link
                  key={pillar}
                  to={`/${pillar}`}
                  className="text-sm font-body font-medium text-primary hover:underline capitalize"
                >
                  {pillar} →
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
};

export default MaterialPage;
