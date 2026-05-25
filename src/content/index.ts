import { patioArticles } from "./articles/patio";
import { drivewayArticles } from "./articles/driveway";
import { walkwayArticles } from "./articles/walkway";
import { inspirationPages } from "./inspiration";
import type { Article, InspirationPage, Pillar } from "./types";

export { patioArticles, drivewayArticles, walkwayArticles };
export { inspirationPages } from "./inspiration";
export { beforeAfterPages } from "./before-after";
export { palettePages } from "./palette";
export { allMaterialPages, materialsBySlug } from "./materials";
export type { Article, ArticleSection, InspirationPage, BeforeAfterPage, PalettePage, Pillar, MaterialPage, Material } from "./types";

export const allArticles: Article[] = [
  ...patioArticles,
  ...drivewayArticles,
  ...walkwayArticles,
];

export const articlesBySlug = new Map<string, Article>(
  allArticles.map((a) => [`${a.pillar}/${a.slug}`, a])
);

export const articlesByPillar: Record<Pillar, Article[]> = {
  patio: patioArticles,
  driveway: drivewayArticles,
  walkway: walkwayArticles,
};

export const inspirationBySlug = new Map<string, InspirationPage>(
  inspirationPages.map((p) => [p.slug, p])
);

export const inspirationByPillar: Record<Pillar, InspirationPage[]> = {
  patio:    inspirationPages.filter((p) => p.pillar === "patio"),
  driveway: inspirationPages.filter((p) => p.pillar === "driveway"),
  walkway:  inspirationPages.filter((p) => p.pillar === "walkway"),
};

export const pillarMeta: Record<Pillar, { title: string; description: string; headline: string }> = {
  patio: {
    title: "Concrete Patio Ideas: 45+ Designs and Inspiration | PourCanvas",
    headline: "Concrete Patio Ideas",
    description:
      "45+ concrete patio ideas from $6/sq ft broom finish to $20/sq ft stamped stone — stamped patterns, exposed aggregate, modern slabs, pool decks, and budget designs.",
  },
  driveway: {
    title: "Concrete Driveway Ideas: 25+ Designs for Every Budget | PourCanvas",
    headline: "Concrete Driveway Ideas",
    description:
      "25+ concrete driveway ideas from broom finish ($6/sq ft) to stamped ashlar slate ($18+) — charcoal, exposed aggregate, two-tone borders, and modern dark finishes.",
  },
  walkway: {
    title: "Concrete Walkway Ideas: 20+ Paths, Steps and Sidewalks | PourCanvas",
    headline: "Concrete Walkway Ideas",
    description:
      "20+ concrete walkway ideas from $6/sq ft broom finish to $18/sq ft stamped flagstone — front paths, garden walks, entry steps, and modern geometric designs.",
  },
};
