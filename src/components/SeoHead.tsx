import { Helmet } from "react-helmet-async";
import type { FAQ } from "@/content/types";

const SITE_URL = "https://pourcanvas.com";

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface GalleryImage {
  url: string;
  caption: string;
}

interface SeoHeadProps {
  title: string;
  description: string;
  ogImage?: string;
  ogType?: "article" | "website";
  canonical?: string;
  publishedAt?: string;
  updatedAt?: string;
  keywords?: string[];
  faqs?: FAQ[];
  breadcrumbs?: BreadcrumbItem[];
  galleryImages?: GalleryImage[];
}

export const SeoHead = ({
  title,
  description,
  ogImage,
  ogType = "website",
  canonical,
  publishedAt,
  updatedAt,
  keywords,
  faqs,
  breadcrumbs,
  galleryImages,
}: SeoHeadProps) => {
  const absoluteImage = ogImage
    ? (ogImage.startsWith("http") ? ogImage : `${SITE_URL}${ogImage}`)
    : undefined;
  const absoluteCanonical = canonical ? `${SITE_URL}${canonical}` : undefined;

  const faqSchema =
    faqs && faqs.length > 0
      ? JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.answer,
            },
          })),
        })
      : null;

  const articleImage = galleryImages && galleryImages.length > 0
    ? galleryImages.map((img) => ({
        "@type": "ImageObject" as const,
        url: img.url,
        caption: img.caption,
      }))
    : absoluteImage;

  const articleSchema =
    ogType === "article"
      ? JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: title,
          description,
          ...(absoluteCanonical && { url: absoluteCanonical }),
          ...(articleImage && { image: articleImage }),
          ...(publishedAt && { datePublished: publishedAt }),
          dateModified: updatedAt ?? publishedAt ?? new Date().toISOString().split("T")[0],
          author: { "@type": "Organization", name: "PourCanvas" },
          publisher: { "@type": "Organization", name: "PourCanvas" },
        })
      : null;

  const breadcrumbSchema =
    breadcrumbs && breadcrumbs.length > 0
      ? JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: breadcrumbs.map((item, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: item.name,
            item: `${SITE_URL}${item.url}`,
          })),
        })
      : null;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {absoluteCanonical && <link rel="canonical" href={absoluteCanonical} />}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      {absoluteImage && <meta property="og:image" content={absoluteImage} />}
      {absoluteCanonical && <meta property="og:url" content={absoluteCanonical} />}
      <meta name="twitter:card" content="summary_large_image" />
      {absoluteImage && <meta name="twitter:image" content={absoluteImage} />}
      {publishedAt && <meta property="article:published_time" content={publishedAt} />}
      {(updatedAt ?? publishedAt) && (
        <meta property="article:modified_time" content={updatedAt ?? publishedAt!} />
      )}
      {keywords?.length && <meta name="keywords" content={keywords.join(", ")} />}
      {faqSchema && (
        <script type="application/ld+json">{faqSchema}</script>
      )}
      {articleSchema && (
        <script type="application/ld+json">{articleSchema}</script>
      )}
      {breadcrumbSchema && (
        <script type="application/ld+json">{breadcrumbSchema}</script>
      )}
    </Helmet>
  );
};
