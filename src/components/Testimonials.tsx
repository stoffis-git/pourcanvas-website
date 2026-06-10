import { Star, Home, HardHat, Ruler } from "lucide-react";

const quotes = [
  {
    name: "Marcus T.",
    role: "Homeowner, Austin TX",
    icon: Home,
    text: "I uploaded a photo of our cracked patio and had eight finish options in under a minute. Showed the stamped-cobblestone render to our contractor and that's exactly what we poured.",
  },
  {
    name: "Diane R.",
    role: "Concrete contractor",
    icon: HardHat,
    text: "It closes jobs. Clients can never picture 'exposed aggregate' from a sample board — now I hand them a photo of their own driveway in the finish. My quote-to-signature rate jumped.",
  },
  {
    name: "Priya S.",
    role: "Landscape designer",
    icon: Ruler,
    text: "A fast way to test surface ideas before I commit to drawings. The before/after split makes presentations effortless and the results actually look like real concrete.",
  },
];

const Testimonials = () => {
  return (
    <section className="section-padding">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto mb-10 max-w-xl text-center">
          <div className="mb-3 flex items-center justify-center gap-1 text-[#e0a45e]">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-current" />
            ))}
          </div>
          <h2 className="mb-3 text-3xl font-bold text-foreground md:text-4xl">
            Loved by homeowners and the pros they hire
          </h2>
          <p className="leading-relaxed text-muted-foreground">
            Over 10,000 outdoor concrete designs generated and counting.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {quotes.map((q) => {
            const Icon = q.icon;
            return (
              <figure
                key={q.name}
                className="flex flex-col rounded-3xl border border-border bg-card p-6"
              >
                <blockquote className="mb-5 flex-1 leading-relaxed text-foreground/90">
                  “{q.text}”
                </blockquote>
                <figcaption className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
                    <Icon className="h-5 w-5 text-foreground" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{q.name}</p>
                    <p className="text-xs text-muted-foreground">{q.role}</p>
                  </div>
                </figcaption>
              </figure>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
