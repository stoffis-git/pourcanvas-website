import { ToolWaitlistBlock } from "@/components/ToolWaitlistBlock";

const CtaSection = () => {
  return (
    <section className="gradient-hero section-padding">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          Ready to Reimagine Your Outdoor Space?
        </h2>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          Join thousands of homeowners finding inspiration for their next concrete project. It's free to start.
        </p>
        <ToolWaitlistBlock source="tool-waitlist-cta" />
      </div>
    </section>
  );
};

export default CtaSection;
