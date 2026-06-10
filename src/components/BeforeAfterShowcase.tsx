import ImageCompareSlider from "./ImageCompareSlider";
import patioBefore from "@/assets/patio-before.jpg";
import patioAfter from "@/assets/patio-after.jpg";

const transformations = [
  { img: "/studio/before-after-slab-to-stamped-grey.jpg", label: "Plain slab → Stamped grey" },
  { img: "/studio/before-after-cracked-to-flagstone.jpg", label: "Cracked concrete → Flagstone" },
  { img: "/studio/before-after-plain-to-exposed-aggregate.jpg", label: "Plain pour → Exposed aggregate" },
];

const BeforeAfterShowcase = () => {
  return (
    <section className="section-padding bg-muted/20">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto mb-10 max-w-xl text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-muted-foreground">
            Real Transformations
          </p>
          <h2 className="mb-3 text-3xl font-bold text-foreground md:text-4xl">
            From tired slab to showpiece
          </h2>
          <p className="leading-relaxed text-muted-foreground">
            Every result below started as a single phone photo. Drag the slider, then scroll
            through finishes generated in seconds.
          </p>
        </div>

        <div className="mx-auto mb-10 max-w-4xl">
          <ImageCompareSlider
            beforeImage={patioBefore}
            afterImage={patioAfter}
            beforeLabel="Current"
            afterLabel="Redesigned"
          />
          <p className="mt-3 text-center text-xs text-muted-foreground">← Drag to compare →</p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {transformations.map((t) => (
            <figure
              key={t.img}
              className="group overflow-hidden rounded-3xl border border-border bg-card"
            >
              <div className="relative">
                <img
                  src={t.img}
                  alt={t.label}
                  loading="lazy"
                  className="aspect-[3/4] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
                <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-between px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-white">
                  <span className="rounded-full bg-black/45 px-2 py-0.5 backdrop-blur">Before</span>
                  <span className="rounded-full bg-black/45 px-2 py-0.5 backdrop-blur">After</span>
                </div>
              </div>
              <figcaption className="px-4 py-3 text-sm font-medium text-foreground">
                {t.label}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BeforeAfterShowcase;
