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

export const inspirationByPillar: Record<Pillar, InspirationPage[]> = {
  patio:    inspirationPages.filter((p) => p.pillar === "patio"),
  driveway: inspirationPages.filter((p) => p.pillar === "driveway"),
  walkway:  inspirationPages.filter((p) => p.pillar === "walkway"),
};

export const pillarMeta: Record<Pillar, { title: string; description: string; headline: string }> = {
  patio: {
    title: "Patio Design Ideas & Concrete Inspiration | PourCanvas",
    headline: "Patio Design Ideas",
    description:
      "Stamped concrete patterns and exposed aggregate finishes for outdoor patios — cost guides, color ideas, and real installs from $8 to $40 per sq ft.",
  },
  driveway: {
    title: "Driveway Design Ideas & Concrete Inspiration | PourCanvas",
    headline: "Driveway Design Ideas",
    description:
      "Stamped cobblestone and exposed aggregate driveways — curb appeal ideas and cost guides for every budget, from broom finish ($6/sq ft) to decorative patterns ($18+).",
  },
  walkway: {
    title: "Walkway Design Ideas & Concrete Inspiration | PourCanvas",
    headline: "Walkway Design Ideas",
    description:
      "Stamped flagstone and broom finish walkway ideas for every home style — front path inspiration and concrete cost guides from $6 to $16 per sq ft.",
  },
};
