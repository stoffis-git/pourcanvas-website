import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

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
        <Button
          size="lg"
          className="rounded-full px-8 text-base gap-2 font-semibold border-0 hover:opacity-90 transition-opacity"
          style={{ background: "linear-gradient(135deg, #90d1bf, #9dde90)", color: "#2d2a26" }}
        >
          Start Exploring <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </section>
  );
};

export default CtaSection;
