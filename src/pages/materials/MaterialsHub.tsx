import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SeoHead } from "@/components/SeoHead";
import { allMaterialPages } from "@/content";

const MaterialsHub = () => (
  <>
    <SeoHead
      title="Concrete Materials Guide: Finishes, Costs & Comparisons | PatioCanvas"
      description="Everything homeowners need to know about outdoor concrete finishes — stamped concrete, exposed aggregate, broom finish, colored concrete, pavers, and more."
      canonical="/materials"
    />
    <Header />
    <main className="max-w-6xl mx-auto px-5 py-28 md:py-36">
      <div className="max-w-2xl mb-12">
        <p className="text-sm font-display font-medium text-muted-foreground uppercase tracking-widest mb-3">
          Materials
        </p>
        <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground leading-tight mb-4">
          Concrete Finish Guide
        </h1>
        <p className="text-base md:text-lg font-body text-muted-foreground">
          Deep-dive guides on every major outdoor concrete finish — what each one is, what it costs, and when to use it.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {allMaterialPages.map((material) => (
          <Link
            key={material.slug}
            to={`/materials/${material.slug}`}
            className="group rounded-2xl border border-border bg-card p-6 hover:border-primary/40 transition-colors"
          >
            <h2 className="text-xl font-display font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
              {material.headline}
            </h2>
            <p className="text-sm font-body text-muted-foreground">{material.summary}</p>
          </Link>
        ))}
      </div>
    </main>
    <Footer />
  </>
);

export default MaterialsHub;
