export interface OutrankArticle {
  id: string;
  slug: string;
  title: string;
  metaDescription: string;
  image: string;
  tags: string[];
  publishedAt: string;
  updatedAt?: string;
  html: string;
}

const modules = import.meta.glob<OutrankArticle>("./outrank/*.json", { eager: true, import: "default" });

export const outrankArticles: OutrankArticle[] = Object.values(modules).sort((a, b) =>
  b.publishedAt.localeCompare(a.publishedAt)
);

export const outrankBySlug = new Map(outrankArticles.map((a) => [a.slug, a]));
