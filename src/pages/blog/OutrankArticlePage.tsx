import { useParams, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SeoHead } from "@/components/SeoHead";
import { outrankBySlug } from "@/content/outrank";

const OutrankArticlePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const article = slug ? outrankBySlug.get(slug) : undefined;

  if (!article) return null;

  const url = `/blog/guides/${article.slug}`;

  return (
    <>
      <SeoHead
        title={article.title}
        description={article.metaDescription}
        ogImage={article.image || undefined}
        ogType="article"
        canonical={url}
        publishedAt={article.publishedAt}
        updatedAt={article.updatedAt}
        keywords={article.tags}
        breadcrumbs={[
          { name: "Blog", url: "/blog" },
          { name: article.title, url },
        ]}
      />
      <Header />
      <main className="max-w-3xl mx-auto px-5 py-28 md:py-36">
        <div className="mb-4 flex items-center gap-2 text-xs font-body text-muted-foreground">
          <Link to="/blog" className="hover:text-foreground transition-colors">Blog</Link>
          <span>/</span>
          <span>Guides</span>
        </div>

        {article.image.startsWith("https://") && (
          <img
            src={article.image}
            alt={article.title}
            className="w-full rounded-2xl object-cover aspect-video mb-8"
            draggable={false}
          />
        )}

        <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground leading-tight mb-4">
          {article.title}
        </h1>

        <p className="text-xs font-body text-muted-foreground mb-8">
          {new Date(article.updatedAt ?? article.publishedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" })}
        </p>

        <div
          className="font-body text-foreground/80 leading-relaxed prose-table space-y-4 [&_h2]:text-xl [&_h2]:md:text-2xl [&_h2]:font-display [&_h2]:font-bold [&_h2]:text-foreground [&_h2]:mt-8 [&_h3]:font-semibold [&_h3]:text-foreground [&_img]:rounded-xl [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_a]:underline [&_iframe]:w-full [&_iframe]:aspect-video"
          dangerouslySetInnerHTML={{ __html: article.html }}
        />
      </main>
      <Footer />
    </>
  );
};

export default OutrankArticlePage;
