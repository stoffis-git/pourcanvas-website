import { Star } from "lucide-react";
import Configurator from "./Configurator";

const points = [
  "Just upload a photo — zero design skills needed",
  "Compare a dozen looks side by side in seconds",
  "Share photoreal plans with your contractor",
];

const RedesignHero = () => {
  return (
    <section className="gradient-hero relative overflow-hidden px-5 pt-28 pb-16 md:px-8 md:pt-32 md:pb-24 lg:px-16">
      {/* decorative blobs */}
      <div
        className="pointer-events-none absolute right-10 top-24 h-64 w-64 opacity-30 animate-morph animate-float-slow"
        style={{ background: "#90d1bf", filter: "blur(48px)" }}
      />
      <div
        className="pointer-events-none absolute bottom-10 left-0 h-48 w-48 opacity-20 animate-morph"
        style={{ background: "#bba2eb", filter: "blur(36px)", animationDelay: "5s" }}
      />

      <div className="relative mx-auto grid max-w-6xl items-start gap-10 lg:grid-cols-[1fr_1.05fr] lg:gap-14">
        {/* Left — copy */}
        <div className="text-center lg:pt-2 lg:text-left">
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-muted-foreground">
            AI Outdoor Space Visualizer
          </p>
          <h1 className="mb-5 text-4xl font-bold leading-tight text-foreground md:text-5xl lg:text-[3.4rem]">
            Redesign your outdoor space{" "}
            <span className="gradient-text">before you spend a cent</span>
          </h1>
          <p className="mx-auto mb-6 max-w-lg text-base leading-relaxed text-muted-foreground md:text-lg lg:mx-0">
            Upload one photo of your patio, driveway, or backyard and watch AI transform it
            with beautiful, real-world finishes — stamped, exposed aggregate, stained, and more.
            See exactly how it'll look, then build it with confidence.
          </p>

          <ul className="mx-auto mb-7 max-w-md space-y-2.5 lg:mx-0">
            {points.map((p) => (
              <li key={p} className="flex items-center gap-2.5 text-sm text-foreground/80">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/25 text-[11px] font-bold text-foreground">
                  ✓
                </span>
                {p}
              </li>
            ))}
          </ul>

          <div className="flex items-center justify-center gap-3 lg:justify-start">
            <div className="flex -space-x-4">
              {["a1", "a2", "a3", "a4", "a5", "a6", "a7", "a8"].map((a) => (
                <img
                  key={a}
                  src={`/avatars/${a}.jpg`}
                  alt=""
                  loading="lazy"
                  className="h-9 w-9 rounded-full border-2 border-background object-cover"
                />
              ))}
            </div>
            <div className="text-left">
              <div className="flex text-[#e0a45e]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-current" />
                ))}
              </div>
              <p className="text-xs text-muted-foreground">50,000+ outdoor spaces reimagined</p>
            </div>
          </div>
        </div>

        {/* Right — the studio */}
        <div className="mx-auto w-full max-w-md lg:max-w-none">
          <Configurator />
        </div>
      </div>
    </section>
  );
};

export default RedesignHero;
