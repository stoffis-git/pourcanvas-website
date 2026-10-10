import { SeoHead } from "@/components/SeoHead";
import Header from "@/components/Header";
import HomeHero from "@/components/home/HomeHero";
import ToolGrid from "@/components/home/ToolGrid";
import TrustBand from "@/components/home/TrustBand";
import FinishesGallery from "@/components/FinishesGallery";
import ProjectCategories from "@/components/ProjectCategories";
import HomeFAQ from "@/components/HomeFAQ";
import { homeFaqs } from "@/components/HomeFAQ";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";

const guideLinks = [
  { to: "/guides/concrete-patio", label: "The Complete Guide to Concrete Patio Design" },
  { to: "/guides/concrete-driveway", label: "The Complete Guide to Concrete Driveway Design" },
  { to: "/guides/concrete-walkway", label: "The Complete Guide to Concrete Walkway Design" },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <SeoHead
        title="Free Paver, Patio & Driveway Calculators | PourCanvas"
        description="Free paver, flagstone, patio and driveway calculators plus concrete finish selectors. Material lists and installed cost from sourced U.S. pricing. No signup."
        canonical="/"
        faqs={homeFaqs}
      />
      <Header />
      <HomeHero />
      <ToolGrid />
      <TrustBand />
      <ProjectCategories />
      <FinishesGallery />

      {/* Guide hub links */}
      <section className="section-padding border-t border-border/50">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-3">
            Design Guides
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
            Plan Your Project
          </h2>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {guideLinks.map((g) => (
              <Link
                key={g.to}
                to={g.to}
                className="rounded-xl border border-border px-5 py-3 text-sm font-medium text-foreground hover:bg-muted/50 transition-colors"
              >
                {g.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <HomeFAQ />
      <Footer />
    </div>
  );
};

export default Index;
