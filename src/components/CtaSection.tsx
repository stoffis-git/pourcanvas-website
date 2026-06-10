const CtaSection = () => {
  return (
    <section className="gradient-hero section-padding">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          Ready to Reimagine Your Outdoor Space?
        </h2>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          Upload a photo and see your concrete redesigned in seconds. Preview free —
          pay only when you love the result.
        </p>
        <a
          href="#redesign"
          className="inline-block rounded-full px-8 py-3.5 font-semibold text-sm border-0 hover:opacity-90 transition-opacity"
          style={{ background: "linear-gradient(135deg, #90d1bf, #9dde90)", color: "#2d2a26" }}
        >
          Start Your Redesign →
        </a>
      </div>
    </section>
  );
};

export default CtaSection;
