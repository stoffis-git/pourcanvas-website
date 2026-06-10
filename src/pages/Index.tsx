import { SeoHead } from "@/components/SeoHead";
import Header from "@/components/Header";
import RedesignHero from "@/components/redesign/RedesignHero";
import SocialProofBar from "@/components/SocialProofBar";
import HowItWorks from "@/components/HowItWorks";
import BeforeAfterShowcase from "@/components/BeforeAfterShowcase";
import ComparisonSection from "@/components/ComparisonSection";
import FinishesGallery from "@/components/FinishesGallery";
import SocialProofStats from "@/components/SocialProofStats";
import Testimonials from "@/components/Testimonials";
import ProjectCategories from "@/components/ProjectCategories";
import PricingSection from "@/components/PricingSection";
import HomeFAQ from "@/components/HomeFAQ";
import { homeFaqs } from "@/components/HomeFAQ";
import CtaSection from "@/components/CtaSection";
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
        title="AI Concrete Visualizer — See Your Patio or Driveway Resurfaced | PourCanvas"
        description="Upload a photo and see your patio, driveway, or walkway in stamped concrete, exposed aggregate, acid stain, and more. AI concrete surface visualizer — try it free."
        canonical="/"
        faqs={homeFaqs}
      />
      <Header />
      <RedesignHero />
      <SocialProofBar />
      <SocialProofStats />
      <HowItWorks />
      <BeforeAfterShowcase />
      <ComparisonSection />
      <FinishesGallery />
      <Testimonials />
      <ProjectCategories />
      <PricingSection />
      <HomeFAQ />

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

      <CtaSection />
      <Footer />
    </div>
  );
};

export default Index;
