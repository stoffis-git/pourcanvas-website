export type Pillar = "patio" | "driveway" | "walkway";

export interface FAQ {
  question: string;
  answer: string;
}

export type Material =
  | "stamped-concrete"
  | "exposed-aggregate"
  | "broom-finish"
  | "colored-concrete"
  | "concrete-pavers"
  | "flagstone"
  | "travertine"
  | "polished-concrete"
  | "concrete-overlay";

export interface MaterialRelatedArticle {
  pillar: Pillar;
  slug: string;
}

export interface MaterialProCon {
  pros: string[];
  cons: string[];
}

export interface MaterialPage {
  slug: Material;
  title: string;
  headline: string;
  summary: string;
  metaDescription: string;
  targetKeywords: string[];
  ogImage: string;
  publishedAt: string;
  intro: string;
  sections: ArticleSection[];
  prosAndCons?: MaterialProCon;
  relatedPillars: Pillar[];
  relatedArticles?: MaterialRelatedArticle[];
}

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
  relatedMaterials?: Material[];
  faqs?: FAQ[];
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
  faqs?: FAQ[];
}
