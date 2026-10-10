import { Link } from "react-router-dom";
import { SOURCES } from "@/lib/tools/data/paving";
import { FINISH_SOURCES } from "@/lib/tools/data/finish";

const sourceCount = new Set([...Object.values(SOURCES), ...FINISH_SOURCES].map((s) => s.url)).size;

const ITEMS = [
  {
    title: `${sourceCount} cited sources`,
    body: "Every price, depth and coverage rate traces to a dated source: cost guides, manufacturers, ICPI and federal cost data.",
  },
  {
    title: "Quantities and cost together",
    body: "Pavers, base gravel, bedding sand, joint sand and edging, plus installed price with the labor split shown.",
  },
  {
    title: "Share your result",
    body: "Every calculation lives in the link, so you can send it to a contractor or save it for later.",
  },
];

const TrustBand = () => (
  <section className="section-padding bg-muted/20">
    <div className="max-w-6xl mx-auto">
      <div className="text-center max-w-xl mx-auto mb-10">
        <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest mb-3">How the numbers work</p>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground">Estimates you can check</h2>
      </div>
      <div className="grid gap-5 md:grid-cols-3">
        {ITEMS.map((i) => (
          <div key={i.title} className="rounded-2xl border border-border bg-background p-6">
            <h3 className="font-semibold text-foreground mb-2">{i.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{i.body}</p>
          </div>
        ))}
      </div>
      <p className="text-center text-sm text-muted-foreground mt-8">
        See every value and source on the <Link to="/methodology" className="text-primary hover:underline">methodology page</Link>. Pouring a concrete slab? Volume and concrete cost calculators live on our sister site{" "}
        <a href="https://www.slabcalc.co/calculators" className="text-primary hover:underline">SlabCalc</a>.
      </p>
    </div>
  </section>
);

export default TrustBand;
