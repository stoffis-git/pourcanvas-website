import { useParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SeoHead } from "@/components/SeoHead";
import { InspirationContentBlock } from "@/components/inspiration/InspirationContentBlock";
import { InspirationPopup } from "@/components/inspiration/InspirationPopup";
import { InspirationEmailCapture } from "@/components/inspiration/InspirationEmailCapture";
import { InspirationCrossSection } from "@/components/inspiration/InspirationCrossSection";
import { palettePages } from "@/content";

const pagesBySlug = new Map(palettePages.map((p) => [p.slug, p]));

const PalettePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const page = pagesBySlug.get(slug ?? "");

  if (!page) return null;

  return (
    <>
      <SeoHead
        title={page.title}
        description={page.metaDescription}
        ogImage={page.ogImage}
        canonical={`/palette/${page.slug}`}
      />
      <Header />
      <main className="max-w-4xl mx-auto px-5 py-28 md:py-36">
        <div className="space-y-8">
          <div className="md:grid md:grid-cols-2 md:gap-10 md:items-start">
            <div className="md:sticky md:top-28">
              <img
                src={page.ogImage}
                alt={page.heroAlt}
                className="w-full rounded-xl object-cover aspect-[3/4]"
              />
            </div>
            <div className="space-y-6">
              <h1 className="hidden md:block text-4xl lg:text-5xl font-display font-bold text-foreground leading-tight">
                {page.headline}
              </h1>
              <InspirationContentBlock body={page.contentBlock} />
            </div>
          </div>
          <InspirationPopup slug={page.slug} pillar={page.pillar} />
          <InspirationEmailCapture
            slug={page.slug}
            pillar={page.pillar}
            pageHeadline={page.headline}
            source="inspire-pack-palette-inline"
          />
          <InspirationCrossSection currentSlug={page.slug} currentPillar={page.pillar} />
        </div>
      </main>
      <Footer />
    </>
  );
};

export default PalettePage;
