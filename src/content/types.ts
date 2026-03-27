export type Pillar = "patio" | "driveway" | "walkway";

export interface ArticleSection {
  heading: string;
  body: string;
  image?: string;
  imageAlt?: string;
}

export interface Article {
  slug: string;
  pillar: Pillar;
  title: string;
  headline: string;
  metaDescription: string;
  targetKeywords: string[];
  ogImage: string;
  publishedAt: string;
  intro: string;
  sections: ArticleSection[];
  relatedSlugs?: string[];
}

export interface InspirationPage {
  slug: string;
  title: string;
  headline: string;
  metaDescription: string;
  ogImage: string;
  heroAlt: string;
  contentBlock: string;
  targetKeywords: string[];
  pillar?: Pillar;
  ctaHeadline: string;
  ctaBody: string;
}
