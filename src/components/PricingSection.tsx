import PricingCards from "./redesign/PricingCards";

const PricingSection = () => {
  return (
    <section id="pricing" className="section-padding bg-muted/20">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto mb-10 max-w-xl text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-muted-foreground">
            Pricing
          </p>
          <h2 className="mb-3 text-3xl font-bold text-foreground md:text-4xl">
            Start free. Upgrade when you're hooked.
          </h2>
          <p className="leading-relaxed text-muted-foreground">
            Preview designs free, then pick a plan with the monthly design credits you need.
            No contracts — cancel anytime.
          </p>
        </div>

        <PricingCards />
      </div>
    </section>
  );
};

export default PricingSection;
