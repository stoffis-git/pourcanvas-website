import { Check, X, Minus } from "lucide-react";

type Cell = "yes" | "no" | "partial";

const columns = ["Samples & showrooms", "Generic AI room apps", "Hiring a designer"];

const rows: { feature: string; pour: Cell; others: Cell[] }[] = [
  { feature: "See it on your actual space", pour: "yes", others: ["no", "partial", "yes"] },
  { feature: "Built only for outdoor concrete", pour: "yes", others: ["partial", "no", "partial"] },
  { feature: "16 real concrete finishes", pour: "yes", others: ["partial", "no", "partial"] },
  { feature: "Results in seconds", pour: "yes", others: ["no", "yes", "no"] },
  { feature: "Contractor-ready image to share", pour: "yes", others: ["no", "no", "yes"] },
  { feature: "Starts free", pour: "yes", others: ["no", "partial", "no"] },
];

function Icon({ v }: { v: Cell }) {
  if (v === "yes") return <Check className="mx-auto h-5 w-5 text-[#6bb8a3]" />;
  if (v === "partial") return <Minus className="mx-auto h-5 w-5 text-muted-foreground/60" />;
  return <X className="mx-auto h-5 w-5 text-muted-foreground/40" />;
}

const ComparisonSection = () => {
  return (
    <section className="section-padding">
      <div className="mx-auto max-w-5xl">
        <div className="mx-auto mb-10 max-w-xl text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-widest text-muted-foreground">
            Why PourCanvas
          </p>
          <h2 className="text-3xl font-bold text-foreground md:text-4xl">
            PourCanvas vs. everybody else
          </h2>
        </div>

        <div className="overflow-hidden rounded-3xl border border-border">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-sm">
              <thead>
                <tr>
                  <th className="w-[34%] bg-card px-5 py-4 text-left font-medium text-muted-foreground">
                    {/* corner */}
                  </th>
                  <th className="bg-gradient-to-b from-primary/20 to-primary/5 px-4 py-4 text-center">
                    <span className="font-display text-base font-bold text-foreground">PourCanvas</span>
                  </th>
                  {columns.map((c) => (
                    <th key={c} className="bg-card px-4 py-4 text-center align-middle font-medium text-muted-foreground">
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={r.feature} className={i % 2 ? "bg-card/40" : "bg-background"}>
                    <td className="px-5 py-4 text-left font-medium text-foreground">{r.feature}</td>
                    <td className="bg-primary/[0.07] px-4 py-4">
                      <Icon v={r.pour} />
                    </td>
                    {r.others.map((v, j) => (
                      <td key={j} className="px-4 py-4">
                        <Icon v={v} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          <Check className="mr-1 inline h-3.5 w-3.5 text-[#6bb8a3]" /> full ·
          <Minus className="mx-1 inline h-3.5 w-3.5" /> partial ·
          <X className="mx-1 inline h-3.5 w-3.5" /> none
        </p>
      </div>
    </section>
  );
};

export default ComparisonSection;
