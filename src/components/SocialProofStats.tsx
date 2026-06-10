import { Star, Home, HardHat, Ruler } from "lucide-react";

const stats = [
  { value: "50,000+", label: "Designs created" },
  { value: "90+", label: "Countries" },
  { value: "3,500+", label: "Contractors & pros" },
  { value: "4.9/5", label: "Avg. rating" },
];

const audiences = [
  { icon: Home, label: "Homeowners", sub: "Personal use" },
  { icon: HardHat, label: "Contractors", sub: "Professional use" },
  { icon: Ruler, label: "Designers & builders", sub: "Business use" },
];

const SocialProofStats = () => {
  return (
    <section className="section-padding">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <div className="mb-3 flex items-center justify-center gap-2">
            <div className="flex text-[#e0a45e]">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-current" />
              ))}
            </div>
            <span className="text-sm font-medium text-muted-foreground">
              Rated top-notch from 1,300+ reviews
            </span>
          </div>
          <h2 className="mb-3 text-3xl font-bold text-foreground md:text-4xl">
            50,000+ outdoor spaces reimagined worldwide
          </h2>
          <p className="leading-relaxed text-muted-foreground">
            Homeowners, contractors, and designers use PourCanvas to picture their
            concrete before a single bag is mixed.
          </p>
        </div>

        {/* Audience pills */}
        <div className="mx-auto mb-10 flex max-w-3xl flex-col gap-3 sm:flex-row">
          {audiences.map((a) => {
            const Icon = a.icon;
            return (
              <div
                key={a.label}
                className="flex flex-1 items-center gap-3 rounded-2xl border border-border bg-card px-5 py-4"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/20">
                  <Icon className="h-5 w-5 text-foreground" />
                </span>
                <div>
                  <p className="font-semibold leading-tight text-foreground">{a.label}</p>
                  <p className="text-xs text-muted-foreground">{a.sub}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Stat band */}
        <div className="grid grid-cols-2 gap-4 rounded-3xl border border-border bg-muted/30 px-6 py-8 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-display text-3xl font-bold text-foreground md:text-4xl">
                {s.value}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialProofStats;
