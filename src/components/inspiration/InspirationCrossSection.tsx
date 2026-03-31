import { inspirationPages } from "@/content";
import type { Pillar } from "@/content/types";
import { InspirationTile } from "./InspirationTile";

function slugHash(s: string): number {
  return Math.abs([...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) | 0, 0));
}

const ALL_PILLARS: Pillar[] = ["patio", "driveway", "walkway"];

export const InspirationCrossSection = ({
  currentSlug,
  currentPillar,
}: {
  currentSlug: string;
  currentPillar: Pillar;
}) => {
  const otherPillars = ALL_PILLARS.filter((p) => p !== currentPillar);

  const tiles = otherPillars.flatMap((pillar) => {
    const pages = inspirationPages.filter(
      (p) => p.pillar === pillar && p.ogImage.startsWith("https://")
    );
    if (pages.length === 0) return [];
    const offset = slugHash(currentSlug + pillar) % pages.length;
    return [...pages.slice(offset), ...pages.slice(0, offset)].slice(0, 2);
  });

  if (tiles.length < 2) return null;

  return (
    <div className="mt-8 pt-6 border-t border-border/20">
      <p className="text-xs font-body font-medium text-muted-foreground uppercase tracking-widest mb-3">
        Explore other projects
      </p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {tiles.map((page) => (
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
