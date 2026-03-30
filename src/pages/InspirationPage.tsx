import { useParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SeoHead } from "@/components/SeoHead";
import { InspirationImageCarousel } from "@/components/inspiration/InspirationImageCarousel";
import { InspirationContentBlock } from "@/components/inspiration/InspirationContentBlock";
import { InspirationPopup } from "@/components/inspiration/InspirationPopup";
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

  const allImages = [
    { url: page.ogImage, alt: page.heroAlt },
    ...(page.additionalImages ?? []),
  ];
  const isMulti = allImages.length >= 2;

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
          <InspirationImageCarousel images={allImages} headline={page.headline} />
          <InspirationContentBlock body={page.contentBlock} />
          {!isMulti && (
            <MaterialZoomContainer image={page.ogImage} alt={page.heroAlt} />
          )}
          <InspirationPopup slug={page.slug} pillar={page.pillar} />
          <InspirationRelatedTiles currentSlug={page.slug} pillar={page.pillar} />
          <PillarConversionBlock pillar={page.pillar} />
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
