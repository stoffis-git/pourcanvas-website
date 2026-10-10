import type { PavingInputs } from "@/lib/tools/paving";
import type { AnyMaterial } from "@/lib/tools/data/paving";
import type { FinishInputs } from "@/lib/tools/finish";
import type { FinishId } from "@/lib/tools/data/finish";

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
  | "concrete-overlay"
  | "salt-finish";

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
  /** Real finish photos: images[0] renders as the hero, the rest as a gallery; all feed ImageGallery schema. */
  images?: { url: string; alt: string }[];
  publishedAt: string;
  updatedAt?: string;
  intro: string;
  sections: ArticleSection[];
  prosAndCons?: MaterialProCon;
  relatedPillars: Pillar[];
  relatedArticles?: MaterialRelatedArticle[];
  faqs?: FAQ[];
  toolWidget?: ToolWidgetRef;
  relatedTools?: string[];
}

/** Lean tool widget embedded below the intro of a content page; hands off to /tools/{tool}. */
export interface ToolWidgetRef {
  tool: string;
  variant: "compare" | "pavers" | "flagstone" | "finish";
  heading: string;
  defaults?: Partial<PavingInputs>;
  compareMaterials?: AnyMaterial[];
  finishDefaults?: Partial<FinishInputs>;
  /** Finish selector widgets: also report this finish's rank in the teaser. */
  focusFinish?: FinishId;
}

export interface ArticleSection {
  heading: string;
  body: string;
  image?: string;
  imageAlt?: string;
  inspirationSlugs?: string[];
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
  updatedAt?: string;
  intro: string;
  sections: ArticleSection[];
  relatedSlugs?: string[];
  relatedMaterials?: Material[];
  faqs?: FAQ[];
  toolWidget?: ToolWidgetRef;
  relatedTools?: string[];
}

export interface InspirationPage {
  slug: string;
  title: string;
  headline: string;
  metaDescription: string;
  ogImage: string;
  heroAlt: string;
  dominantColor?: string;
  additionalImages?: { url: string; alt: string }[];
  contentBlock: string;
  targetKeywords: string[];
  pillar?: Pillar;
  faqs?: FAQ[];
  relatedArticles?: MaterialRelatedArticle[];
}

export interface BeforeAfterPage {
  slug: string;
  title: string;
  headline: string;
  metaDescription: string;
  ogImage: string;
  heroAlt: string;
  contentBlock: string;
  pillar: Pillar;
}

export interface PalettePage {
  slug: string;
  title: string;
  headline: string;
  metaDescription: string;
  ogImage: string;
  heroAlt: string;
  contentBlock: string;
  pillar: Pillar;
}

export type PavingView = "cost" | "pavers" | "base" | "sand" | "poly" | "flagstone" | "compare";

export interface ToolConfig {
  slug: string;
  engine: "paving" | "finish";
  category: "paving" | "finish";
  /** <title>, no site suffix (guide §3). */
  title: string;
  h1: string;
  /** Hub card + Related Tools blurb. */
  summary: string;
  metaDescription: string;
  /** 40–60 words, answer-first, numbers from the engine. The only text above the tool. */
  intro: string;
  datePublished: string;
  lastUpdated: string;
  pavingDefaults?: Partial<PavingInputs>;
  pavingView?: PavingView;
  finishDefaults?: Partial<FinishInputs>;
  tips: string[];
  sections: ArticleSection[];
  faqs: FAQ[];
  relatedTools: string[];
  relatedGuides: { label: string; to: string }[];
  nextStep?: { slug: string; label: string };
  /** Text that must appear in the prerendered HTML (QA). */
  expectedDefaultResult: string;
  keywords: string[];
}
