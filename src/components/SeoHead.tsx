import { Helmet } from "react-helmet-async";
import type { FAQ } from "@/content/types";

const SITE_URL = "https://pourcanvas.com";

interface SeoHeadProps {
  title: string;
  description: string;
  ogImage?: string;
  ogType?: "article" | "website";
  canonical?: string;
  publishedAt?: string;
  keywords?: string[];
  faqs?: FAQ[];
}

export const SeoHead = ({
  title,
  description,
  ogImage,
  ogType = "website",
  canonical,
  publishedAt,
  keywords,
  faqs,
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
      {keywords?.length && <meta name="keywords" content={keywords.join(", ")} />}
      {faqSchema && (
        <script type="application/ld+json">{faqSchema}</script>
      )}
    </Helmet>
  );
};
