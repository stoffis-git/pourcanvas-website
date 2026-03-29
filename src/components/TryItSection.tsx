import { ToolWaitlistBlock } from "@/components/ToolWaitlistBlock";

const TryItSection = () => {
  return (
    <section id="try-it" className="section-padding">
      <div className="max-w-4xl mx-auto">
        <div className="text-center max-w-xl mx-auto mb-8">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-3">
            Coming Soon
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            AI Visualizer — In Development
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Upload a photo of your patio, driveway, or walkway and see any concrete finish applied to your actual space. Free to use.
          </p>
        </div>
        <div className="max-w-xl mx-auto">
          <ToolWaitlistBlock source="tool-waitlist-homepage" />
        </div>
      </div>
    </section>
  );
};

export default TryItSection;
