import ImageCompareSlider from "./ImageCompareSlider";
import patioBefore from "@/assets/patio-before.jpg";
import patioAfter from "@/assets/patio-after.jpg";

const HeroSection = () => {
  return (
    <section className="section-padding pt-28 md:pt-32">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-10 md:mb-14">
          <p className="text-sm font-display font-medium text-muted-foreground uppercase tracking-widest mb-3">
            Your Patio, Reimagined
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground leading-tight mb-5">
            See What Your Patio <span className="text-primary">Could Be</span>
          </h1>
          <p className="text-base md:text-lg font-body text-muted-foreground leading-relaxed">
            Discover stunning concrete design ideas for your outdoor space. Drag the slider to reveal the transformation.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <ImageCompareSlider
            beforeImage={patioBefore}
            afterImage={patioAfter}
            beforeLabel="Current"
            afterLabel="Inspiration"
          />
          <p className="text-center text-xs font-body text-muted-foreground mt-3">
            ← Drag the slider to compare →
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
