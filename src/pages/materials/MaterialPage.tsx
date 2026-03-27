import { Fragment } from "react";
import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SeoHead } from "@/components/SeoHead";
import { InspirationUpsellTile } from "@/components/inspiration/InspirationUpsellTile";
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
        keywords={material.targetKeywords}
        faqs={material.faqs}
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
          {new Date(material.publishedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
        </p>

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
                <p className="font-body text-foreground/80 leading-relaxed">{section.body}</p>
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
            body="PatioCanvas turns your photo into a concrete design preview. Free to try, no account needed."
          />
        </div>

        {material.faqs && material.faqs.length > 0 && (
          <FAQSection faqs={material.faqs} />
        )}

        {material.relatedArticles && material.relatedArticles.length > 0 && (
          <MaterialRelatedArticles articles={material.relatedArticles} />
        )}
      </main>
      <Footer />
    </>
  );
};

export default MaterialPage;
