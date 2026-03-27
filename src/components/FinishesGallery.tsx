import { Link } from "react-router-dom";

const finishes = [
  { slug: "stamped-concrete",  name: "Stamped Concrete",  color: "#caaa72", desc: "Patterns that mimic stone, brick, or wood — starting around $8–$12/sq ft." },
  { slug: "exposed-aggregate", name: "Exposed Aggregate", color: "#b0a898", desc: "Pebbled texture with natural slip resistance — $6–$10/sq ft installed." },
  { slug: "broom-finish",      name: "Broom Finish",      color: "#b4b4b4", desc: "The most common finish — clean, durable, and budget-friendly at $4–$7/sq ft." },
  { slug: "colored-concrete",  name: "Colored Concrete",  color: "#cc7a4a", desc: "Integral pigment throughout the slab — lasting color without surface fading." },
  { slug: "concrete-pavers",   name: "Concrete Pavers",   color: "#a89060", desc: "Individual units that can be replaced if cracked — $10–$20/sq ft installed." },
  { slug: "flagstone",         name: "Flagstone",         color: "#8a7a60", desc: "Natural irregular slabs with an earthy, high-end look — $15–$30/sq ft." },
];

const FinishesGallery = () => (
  <section className="section-padding bg-muted/20">
    <div className="max-w-6xl mx-auto">
      <div className="text-center max-w-xl mx-auto mb-10">
        <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-3">
          Finishes
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
          Which Finish Is Right for You?
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          From stamped concrete to natural flagstone — preview any finish in your own space before committing.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        {finishes.map((f) => (
          <Link
            key={f.slug}
            to={`/materials/${f.slug}`}
            className="group flex items-start gap-4 p-5 rounded-2xl border border-border bg-card hover:border-primary/40 transition-colors"
          >
            <div
              className="w-12 h-12 rounded-xl shrink-0"
              style={{ background: f.color }}
            />
            <div>
              <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                {f.name}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  </section>
);

export default FinishesGallery;
