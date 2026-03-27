import ImageCompareSlider from "./ImageCompareSlider";
import patioBefore from "@/assets/patio-before.jpg";
import patioAfter from "@/assets/patio-after.jpg";

const HeroSection = () => {
  return (
    <section className="gradient-hero section-padding pt-28 md:pt-32 relative overflow-hidden">
      {/* Decorative blobs */}
      <div
        className="absolute top-16 right-16 w-64 h-64 opacity-30 pointer-events-none animate-morph animate-float-slow"
        style={{ background: "#90d1bf", filter: "blur(40px)" }}
      />
      <div
        className="absolute bottom-16 left-8 w-48 h-48 opacity-20 pointer-events-none animate-morph"
        style={{ background: "#bba2eb", filter: "blur(30px)", animationDelay: "5s" }}
      />

      <div className="max-w-6xl mx-auto relative">
        <div className="text-center max-w-2xl mx-auto mb-10 md:mb-14">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-3">
            AI Concrete Patio & Driveway Visualizer
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-5">
            See What Your Patio <span className="gradient-text">Could Be</span>
          </h1>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
            See how stamped concrete, exposed aggregate, or colored pavers would transform your patio, driveway, or walkway — before you commit to anything.
          </p>
          <a
            href="#try-it"
            className="inline-block mt-6 rounded-full px-8 py-3 font-semibold text-sm border-0 hover:opacity-90 transition-opacity"
            style={{ background: "linear-gradient(135deg, #90d1bf, #9dde90)", color: "#2d2a26" }}
          >
            Try It Free →
          </a>
        </div>

        <div className="max-w-4xl mx-auto">
          <ImageCompareSlider
            beforeImage={patioBefore}
            afterImage={patioAfter}
            beforeLabel="Current"
            afterLabel="Inspiration"
          />
          <p className="text-center text-xs text-muted-foreground mt-3">
            ← Drag the slider to compare →
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
