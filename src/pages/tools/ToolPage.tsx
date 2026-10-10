import { Link, useParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SeoHead } from "@/components/SeoHead";
import { FAQSection } from "@/components/FAQSection";
import { PavingTool } from "@/components/tools/PavingTool";
import { FinishTool } from "@/components/tools/FinishTool";
import { toolsBySlug } from "@/content/tools";

const SITE_URL = "https://pourcanvas.com";

const fmtDate = (d: string) => new Date(d).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });

const ToolPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const tool = toolsBySlug.get(slug ?? "");

  if (!tool) return null;

  const url = `/tools/${tool.slug}`;
  const related = tool.relatedTools.map((s) => toolsBySlug.get(s)).filter((t): t is NonNullable<typeof t> => !!t);
  const [g1, g2] = tool.relatedGuides;

  return (
    <>
      <SeoHead
        title={tool.title}
        description={tool.metaDescription}
        canonical={url}
        publishedAt={tool.datePublished}
        updatedAt={tool.lastUpdated}
        keywords={tool.keywords}
        faqs={tool.faqs}
        breadcrumbs={[
          { name: "Tools", url: "/tools" },
          { name: tool.h1, url },
        ]}
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: tool.h1,
            description: tool.metaDescription,
            url: `${SITE_URL}${url}`,
            applicationCategory: "UtilitiesApplication",
            operatingSystem: "Web",
            dateModified: tool.lastUpdated,
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
            publisher: { "@type": "Organization", name: "PourCanvas", url: SITE_URL },
          },
        ]}
      />
      <Header />
      <main className="max-w-5xl mx-auto px-5 py-28 md:py-36">
        <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-2 text-xs font-body text-muted-foreground">
          <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
          <span>/</span>
          <Link to="/tools" className="hover:text-foreground transition-colors">Tools</Link>
          <span>/</span>
          <span aria-current="page" className="text-foreground/70">{tool.h1}</span>
        </nav>

        <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground leading-tight mb-4">{tool.h1}</h1>
        <p className="max-w-3xl text-base md:text-lg font-body text-foreground/80 leading-relaxed mb-3">{tool.intro}</p>
        <p className="text-xs font-body text-muted-foreground mb-8">Last updated: {fmtDate(tool.lastUpdated)}</p>

        {tool.engine === "paving" ? <PavingTool config={tool} /> : <FinishTool config={tool} />}

        <div className="max-w-3xl">
          {g1 && (
            <p className="mt-10 text-sm font-body text-foreground/80">
              For the full background, read our <Link to={g1.to} className="text-primary hover:underline">{g1.label}</Link>
              {g2 && (
                <>
                  {" "}and <Link to={g2.to} className="text-primary hover:underline">{g2.label}</Link>
                </>
              )}
              .
            </p>
          )}

          <div className="mt-10 space-y-8">
            {tool.sections.map((section) => (
              <div key={section.heading}>
                <h2 className="text-xl md:text-2xl font-display font-bold text-foreground mb-3">{section.heading}</h2>
                <div className="font-body text-foreground/80 leading-relaxed prose-table space-y-3" dangerouslySetInnerHTML={{ __html: section.body }} />
              </div>
            ))}
          </div>

          <FAQSection faqs={tool.faqs} />

          <div className="mt-12 grid gap-8 sm:grid-cols-2 border-t pt-8">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-4">Related Tools</h3>
              <ul className="space-y-2">
                {related.map((t) => (
                  <li key={t.slug}>
                    <Link to={`/tools/${t.slug}`} className="text-sm text-primary hover:underline">{t.h1}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-4">Related Guides</h3>
              <ul className="space-y-2">
                {tool.relatedGuides.map((g) => (
                  <li key={g.to}>
                    <Link to={g.to} className="text-sm text-primary hover:underline">{g.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ToolPage;
