import { SeoHead } from "@/components/SeoHead";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import SocialProofBar from "@/components/SocialProofBar";
import HowItWorks from "@/components/HowItWorks";
import FinishesGallery from "@/components/FinishesGallery";
import TryItSection from "@/components/TryItSection";
import ProjectCategories from "@/components/ProjectCategories";
import HomeFAQ from "@/components/HomeFAQ";
import CtaSection from "@/components/CtaSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <SeoHead
        title="AI Concrete Patio & Driveway Visualizer | PourCanvas"
        description="See what stamped concrete, exposed aggregate, or pavers would look like in your own space. Upload a photo — free AI concrete patio design tool."
        canonical="/"
      />
      <Header />
      <HeroSection />
      <SocialProofBar />
      <HowItWorks />
      <FinishesGallery />
      <TryItSection />
      <ProjectCategories />
      <HomeFAQ />
      <CtaSection />
      <Footer />
    </div>
  );
};

export default Index;
