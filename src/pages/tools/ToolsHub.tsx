import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SeoHead } from "@/components/SeoHead";
import { TOOL_CATEGORIES, toolPages } from "@/content/tools";

const SITE_URL = "https://pourcanvas.com";

const ToolsHub = () => (
  <>
    <SeoHead
      title="Free Paving, Patio & Concrete Finish Calculators"
      description="Free paver, flagstone, base, sand and patio cost calculators, plus concrete finish selectors for patios, driveways and pool decks. No signup, instant results."
      canonical="/tools"
      breadcrumbs={[{ name: "Tools", url: "/tools" }]}
      jsonLd={[
        {
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "PourCanvas calculators",
          itemListElement: toolPages.map((t, i) => ({
            "@type": "ListItem",
            position: i + 1,
            url: `${SITE_URL}/tools/${t.slug}`,
            name: t.h1,
          })),
        },
      ]}
    />
    <Header />
    <main className="max-w-5xl mx-auto px-5 py-28 md:py-36">
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground leading-tight mb-4">Free Paving & Patio Calculators</h1>
      <p className="max-w-3xl text-base md:text-lg font-body text-foreground/80 leading-relaxed mb-12">
        Plan a patio, walkway or driveway in minutes. Every calculator gives you the material list and the installed cost together, uses dated, sourced U.S. pricing, and lets you share your result with a link.
      </p>
      {TOOL_CATEGORIES.map((cat) => {
        const tools = toolPages.filter((t) => t.category === cat.id);
        if (tools.length === 0) return null;
        return (
          <section key={cat.id} className="mb-12">
            <h2 className="text-xl md:text-2xl font-display font-bold text-foreground mb-2">{cat.title}</h2>
            <p className="text-sm text-muted-foreground mb-5">{cat.blurb}</p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {tools.map((t) => (
                <Link key={t.slug} to={`/tools/${t.slug}`} className="rounded-2xl border border-border bg-muted/20 p-5 hover:border-primary transition-colors">
                  <h3 className="font-semibold text-foreground mb-1">{t.h1}</h3>
                  <p className="text-sm text-muted-foreground">{t.summary}</p>
                </Link>
              ))}
            </div>
          </section>
        );
      })}
      <p className="text-sm text-muted-foreground">
        Pouring concrete instead? Concrete volume and cost calculators live on our sister site{" "}
        <a href="https://www.slabcalc.co/calculators" className="text-primary hover:underline">SlabCalc</a>. How we source every number:{" "}
        <Link to="/methodology" className="text-primary hover:underline">methodology</Link>.
      </p>
    </main>
    <Footer />
  </>
);

export default ToolsHub;
