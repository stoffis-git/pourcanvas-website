import { Head } from "vite-react-ssg";

const SITE_URL = "https://patiocanvas.com";

interface SeoHeadProps {
  title: string;
  description: string;
  ogImage?: string;
  ogType?: "article" | "website";
  canonical?: string;
  publishedAt?: string;
  keywords?: string[];
}

export const SeoHead = ({
  title,
  description,
  ogImage,
  ogType = "website",
  canonical,
  publishedAt,
  keywords,
}: SeoHeadProps) => {
  const absoluteImage = ogImage ? `${SITE_URL}${ogImage}` : undefined;
  const absoluteCanonical = canonical ? `${SITE_URL}${canonical}` : undefined;

  return (
    <Head>
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
    </Head>
  );
};
