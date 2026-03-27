import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import HowItWorks from "@/components/HowItWorks";
import TryItSection from "@/components/TryItSection";
import ProjectCategories from "@/components/ProjectCategories";
import CtaSection from "@/components/CtaSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <HowItWorks />
      <TryItSection />
      <ProjectCategories />
      <CtaSection />
      <Footer />
    </div>
  );
};

export default Index;
