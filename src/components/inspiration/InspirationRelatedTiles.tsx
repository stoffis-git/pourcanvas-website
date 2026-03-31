import { inspirationPages } from "@/content";
import type { Pillar } from "@/content/types";
import { InspirationTile } from "./InspirationTile";

const pillarLabel: Record<Pillar, string> = {
  patio: "Patio",
  driveway: "Driveway",
  walkway: "Walkway",
};

function slugHash(s: string): number {
  return Math.abs([...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) | 0, 0));
}

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
      const aScore = a.ogImage.startsWith("https://") ? 0 : 1;
      const bScore = b.ogImage.startsWith("https://") ? 0 : 1;
      if (aScore !== bScore) return aScore - bScore;
      return (slugHash(currentSlug + a.slug) % 97) - (slugHash(currentSlug + b.slug) % 97);
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
          <InspirationTile
            key={page.slug}
            slug={page.slug}
            ogImage={page.ogImage}
            heroAlt={page.heroAlt}
            headline={page.headline}
          />
        ))}
      </div>
    </div>
  );
};
