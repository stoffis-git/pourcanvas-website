import { patioArticles } from "./articles/patio";
import { drivewayArticles } from "./articles/driveway";
import { walkwayArticles } from "./articles/walkway";
import { inspirationPages } from "./inspiration";
import type { Article, InspirationPage, Pillar } from "./types";

export { patioArticles, drivewayArticles, walkwayArticles };
export { inspirationPages } from "./inspiration";
export { allMaterialPages, materialsBySlug } from "./materials";
export type { Article, ArticleSection, InspirationPage, Pillar, MaterialPage, Material } from "./types";

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
      "Explore stamped concrete patterns, patio colors, and cost guides for your next patio project.",
  },
  driveway: {
    title: "Driveway Design Ideas & Concrete Inspiration | PourCanvas",
    headline: "Driveway Design Ideas",
    description:
      "Stamped concrete driveways, exposed aggregate finishes, and curb appeal ideas for every budget.",
  },
  walkway: {
    title: "Walkway Design Ideas & Concrete Inspiration | PourCanvas",
    headline: "Walkway Design Ideas",
    description:
      "Front path ideas, flagstone patterns, and concrete walkway guides for every home style.",
  },
};
