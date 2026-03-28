import { useParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SeoHead } from "@/components/SeoHead";
import { InspirationHero } from "@/components/inspiration/InspirationHero";
import { InspirationContentBlock } from "@/components/inspiration/InspirationContentBlock";
import { PillarConversionBlock } from "@/components/inspiration/PillarConversionBlock";
import { InspirationRelatedTiles } from "@/components/inspiration/InspirationRelatedTiles";
import { MaterialZoomContainer } from "@/components/inspiration/MaterialZoomContainer";
import { FAQSection } from "@/components/FAQSection";
import { inspirationPages } from "@/content";

const inspirationBySlug = new Map(inspirationPages.map((p) => [p.slug, p]));

const InspirationPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const page = inspirationBySlug.get(slug ?? "");

  if (!page) return null;

  return (
    <>
      <SeoHead
        title={page.title}
        description={page.metaDescription}
        ogImage={page.ogImage}
        canonical={`/inspiration/${page.slug}`}
        keywords={page.targetKeywords}
      />
      <Header />
      <main className="max-w-4xl mx-auto px-5 py-28 md:py-36">
        <div className="space-y-8">
          <InspirationHero
            image={page.ogImage}
            alt={page.heroAlt}
            headline={page.headline}
          />
          <InspirationContentBlock body={page.contentBlock} />
          <MaterialZoomContainer image={page.ogImage} alt={page.heroAlt} />
          <PillarConversionBlock pillar={page.pillar} />
          <InspirationRelatedTiles currentSlug={page.slug} pillar={page.pillar} />
          {page.faqs && page.faqs.length > 0 && (
            <FAQSection faqs={page.faqs} />
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default InspirationPage;
