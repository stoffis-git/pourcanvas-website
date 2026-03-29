const categories = [
  { image: "https://images.pourcanvas.com/inspiration-grey-stamped-patio.jpg", label: "Patios", count: "2.4k ideas" },
  { image: "https://images.pourcanvas.com/inspiration-modern-driveway.jpg", label: "Driveways", count: "1.1k ideas" },
  { image: "https://images.pourcanvas.com/inspiration-concrete-pool-deck-grey.jpg", label: "Pool Decks", count: "890 ideas" },
  { image: "https://images.pourcanvas.com/inspiration-herringbone-walkway-concrete.jpg", label: "Sidewalks", count: "640 ideas" },
];

const ProjectCategories = () => {
  return (
    <section id="projects" className="section-padding">
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-xl mx-auto mb-10">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-3">
            Browse by Project
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Find Your Next Project
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat, i) => (
            <button
              key={i}
              className="group relative aspect-[3/4] rounded-3xl overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <img
                src={cat.image}
                alt={cat.label}
                loading="lazy"
                width={640}
                height={640}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/10 to-transparent" />
              <div className="absolute bottom-4 left-4 text-left">
                <p className="font-display text-lg font-semibold text-primary-foreground">
                  {cat.label}
                </p>
                <p className="font-body text-xs text-primary-foreground/70">
                  {cat.count}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProjectCategories;
