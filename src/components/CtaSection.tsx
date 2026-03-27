import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const CtaSection = () => {
  return (
    <section className="section-padding bg-card">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
          Ready to Reimagine Your Outdoor Space?
        </h2>
        <p className="font-body text-muted-foreground mb-8 leading-relaxed">
          Join thousands of homeowners finding inspiration for their next concrete project. It's free to start.
        </p>
        <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 font-body rounded-full px-8 text-base gap-2">
          Start Exploring <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </section>
  );
};

export default CtaSection;
