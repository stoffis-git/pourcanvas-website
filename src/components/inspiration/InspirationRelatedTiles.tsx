import { Link } from "react-router-dom";
import { inspirationPages } from "@/content";
import type { Pillar } from "@/content/types";

const pillarLabel: Record<Pillar, string> = {
  patio: "Patio",
  driveway: "Driveway",
  walkway: "Walkway",
};

export const InspirationRelatedTiles = ({
  currentSlug,
  pillar,
}: {
  currentSlug: string;
  pillar: Pillar;
}) => {
  const related = inspirationPages
    .filter((p) => p.pillar === pillar && p.slug !== currentSlug)
    .sort((a, b) => {
      const aHas = a.ogImage.startsWith("https://") ? 0 : 1;
      const bHas = b.ogImage.startsWith("https://") ? 0 : 1;
      return aHas - bHas;
    })
    .slice(0, 4);

  if (related.length === 0) return null;

  return (
    <div className="mt-12">
      <h2 className="text-lg md:text-xl font-display font-bold text-foreground mb-5">
        More {pillarLabel[pillar]} Ideas
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {related.map((page) => (
          <Link
            key={page.slug}
            to={`/inspiration/${page.slug}`}
            className="group block rounded-xl overflow-hidden hover:opacity-90 transition-opacity"
          >
            {page.ogImage.startsWith("https://") ? (
              <img
                src={page.ogImage}
                alt={page.heroAlt}
                className="w-full aspect-[2/3] object-cover rounded-xl"
                draggable={false}
              />
            ) : (
              <div className="w-full aspect-[2/3] rounded-xl bg-muted" />
            )}
            <p className="mt-2 text-sm font-body font-medium text-foreground leading-snug line-clamp-2">
              {page.headline}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};
