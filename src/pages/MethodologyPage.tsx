import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SeoHead } from "@/components/SeoHead";
import {
  BASE_BAG_PRICE,
  BASE_DEPTH_IN,
  COMPACTOR_RENTAL_PER_DAY,
  FLAGSTONE_WASTE,
  PATTERN_WASTE_SOURCES,
  SAND_BAG_PRICE,
  BEDDING_SAND_IN,
  COMPACTION_FACTOR,
  DELIVERY_FLAT,
  DRIVEWAY_MULTIPLIER,
  EDGING_PRICE_PER_LF,
  FLAGSTONE_SQFT_PER_TON,
  GRAVEL_PRICE_PER_TON,
  GRAVEL_TONS_PER_YD3,
  INSTALLED,
  MATERIAL_LABELS,
  MATERIAL_ONLY,
  PATTERN_LABELS,
  PATTERN_WASTE,
  POLY_BAG_PRICE,
  POLY_COVERAGE,
  REGION_LABELS,
  REGION_MULTIPLIER,
  REMOVAL_PER_SQFT,
  SAND_PRICE_PER_TON,
  SAND_TONS_PER_YD3,
  type Source,
  type SourcedRange,
  type SourcedValue,
} from "@/lib/tools/data/paving";
import { FINISH_SOURCES } from "@/lib/tools/data/finish";
import { CURRENT_YEAR } from "@/lib/year";

type Row = { label: string; value: string; sources: Source[]; note?: string };

const range = (r: SourcedRange, unit: string) => `${unit}${r.low}–${r.high} (typical ${unit}${r.typical})`;
const rr = (label: string, r: SourcedRange, unit = "$", suffix = ""): Row => ({ label, value: `${range(r, unit)}${suffix}`, sources: r.sources, note: r.note });
const rv = (label: string, v: SourcedValue, fmt: (n: number) => string): Row => ({ label, value: fmt(v.value), sources: v.sources, note: v.note });

const groups: { title: string; rows: Row[] }[] = [
  {
    title: "Installed cost per square foot (patio / walkway, U.S. average)",
    rows: (Object.keys(INSTALLED) as (keyof typeof INSTALLED)[]).map((m) => rr(MATERIAL_LABELS[m], INSTALLED[m], "$", " / sq ft")),
  },
  {
    title: "Material-only cost per square foot (DIY)",
    rows: (Object.keys(MATERIAL_ONLY) as (keyof typeof MATERIAL_ONLY)[]).map((m) => rr(MATERIAL_LABELS[m], MATERIAL_ONLY[m], "$", " / sq ft")),
  },
  {
    title: "Adjustments",
    rows: [
      rv("Driveway multiplier, pavers", DRIVEWAY_MULTIPLIER.pavers, (n) => `×${n}`),
      rv("Driveway multiplier, poured concrete", DRIVEWAY_MULTIPLIER.concrete, (n) => `×${n}`),
      ...(Object.keys(REGION_MULTIPLIER) as (keyof typeof REGION_MULTIPLIER)[])
        .filter((r) => r !== "national")
        .map((r) => rv(`Region: ${REGION_LABELS[r]}`, REGION_MULTIPLIER[r], (n) => `×${n}`)),
      rr("Remove lawn / sod", REMOVAL_PER_SQFT.sod, "$", " / sq ft"),
      rr("Remove old concrete", REMOVAL_PER_SQFT.concrete, "$", " / sq ft"),
    ],
  },
  {
    title: "Base, sand and joints",
    rows: [
      rv("Base depth, patio / walkway", BASE_DEPTH_IN.patio, (n) => `${n} in compacted`),
      rv("Base depth, driveway", BASE_DEPTH_IN.driveway, (n) => `${n} in compacted`),
      rv("Extra base on clay / freeze-thaw soil", BASE_DEPTH_IN.poorSoilExtra, (n) => `+${n} in`),
      rv("Bedding sand layer", BEDDING_SAND_IN, (n) => `${n} in`),
      rv("Compaction allowance", COMPACTION_FACTOR, (n) => `+${Math.round((n - 1) * 100)}%`),
      rv("Gravel weight", GRAVEL_TONS_PER_YD3, (n) => `${n} tons / yd³`),
      rv("Sand weight", SAND_TONS_PER_YD3, (n) => `${n} tons / yd³`),
      rr("Gravel price", GRAVEL_PRICE_PER_TON, "$", " / ton"),
      rr("Bedding sand price", SAND_PRICE_PER_TON, "$", " / ton"),
      rr("Bulk delivery", DELIVERY_FLAT, "$", " per load"),
      rv("Polymeric sand coverage, narrow joints", POLY_COVERAGE.narrow, (n) => `${n} sq ft per 50 lb bag`),
      rv("Polymeric sand coverage, wide joints", POLY_COVERAGE.wide, (n) => `${n} sq ft per 50 lb bag`),
      rr("Polymeric sand price", POLY_BAG_PRICE, "$", " per 50 lb bag"),
      rr("Edge restraint", EDGING_PRICE_PER_LF, "$", " / linear ft"),
      rr("Paver base, 0.5 cu ft bag", BASE_BAG_PRICE, "$", " per bag"),
      rr("Paver sand, 0.5 cu ft bag", SAND_BAG_PRICE, "$", " per bag"),
      rr("Plate compactor rental (DIY estimate includes one day)", COMPACTOR_RENTAL_PER_DAY, "$", " per day"),
      rv("Flagstone waste allowance", FLAGSTONE_WASTE, (n) => `${Math.round(n * 100)}%`),
      ...(Object.keys(FLAGSTONE_SQFT_PER_TON) as (keyof typeof FLAGSTONE_SQFT_PER_TON)[]).map((t) =>
        rv(`Flagstone coverage, ${t} in thick`, FLAGSTONE_SQFT_PER_TON[t], (n) => `${n} sq ft per ton`),
      ),
    ],
  },
];

const MethodologyPage = () => (
  <>
    <SeoHead
      title="Methodology: How PourCanvas Calculators Are Built"
      description={`Every number behind the PourCanvas calculators with its source and date: installed costs, base depths, coverage rates and regional adjustments (${CURRENT_YEAR}).`}
      canonical="/methodology"
      breadcrumbs={[{ name: "Methodology", url: "/methodology" }]}
    />
    <Header />
    <main className="max-w-4xl mx-auto px-5 py-28 md:py-36">
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground leading-tight mb-4">Methodology</h1>
      <div className="space-y-4 text-base font-body text-foreground/80 leading-relaxed mb-10">
        <p>
          Every number in our <Link to="/tools" className="text-primary hover:underline">calculators</Link> comes from the tables on this page. Each value lists its sources and the date we checked them. Where sources disagree, we use the range most of them share and note the outliers.
        </p>
        <p>
          Installed costs are U.S. national averages for professional installation on a prepared, level site. Your local quote can differ with access, slope, drainage, permits and season. Regional multipliers shift the whole estimate; they are approximations, not ZIP-level pricing. Quantities include waste for cuts and breakage, and the base includes a compaction allowance.
        </p>
      </div>
      {groups.map((g) => (
        <section key={g.title} className="mb-10">
          <h2 className="text-xl md:text-2xl font-display font-bold text-foreground mb-3">{g.title}</h2>
          <div className="prose-table">
            <table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Value</th>
                  <th>Sources</th>
                </tr>
              </thead>
              <tbody>
                {g.rows.map((r) => (
                  <tr key={r.label}>
                    <td>{r.label}</td>
                    <td>
                      {r.value}
                      {r.note && <span className="block text-xs text-muted-foreground">{r.note}</span>}
                    </td>
                    <td className="text-xs">
                      {r.sources.length === 0
                        ? "Standard reference value"
                        : r.sources.map((s, i) => (
                            <span key={s.url + i}>
                              {i > 0 && "; "}
                              <a href={s.url} rel="nofollow noopener" className="text-primary hover:underline">{s.label}</a> ({s.date})
                            </span>
                          ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}
      <section className="mb-10">
        <h2 className="text-xl md:text-2xl font-display font-bold text-foreground mb-3">Laying pattern waste</h2>
        <div className="prose-table">
          <table>
            <thead>
              <tr><th>Pattern</th><th>Waste allowance</th></tr>
            </thead>
            <tbody>
              {(Object.keys(PATTERN_WASTE) as (keyof typeof PATTERN_WASTE)[]).map((p) => (
                <tr key={p}><td>{PATTERN_LABELS[p]}</td><td>{Math.round(PATTERN_WASTE[p] * 100)}% (+5% for curved edges)</td></tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Sources:{" "}
          {PATTERN_WASTE_SOURCES.map((s, i) => (
            <span key={s.url}>
              {i > 0 && "; "}
              <a href={s.url} rel="nofollow noopener" className="text-primary hover:underline">{s.label}</a> ({s.date})
            </span>
          ))}
          . No manufacturer publishes a figure for random/ashlar layouts; 10% is our estimate between basketweave and herringbone.
        </p>
      </section>
      {FINISH_SOURCES.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl md:text-2xl font-display font-bold text-foreground mb-3">Finish selector sources</h2>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            {FINISH_SOURCES.map((s) => (
              <li key={s.url}>
                <a href={s.url} rel="nofollow noopener" className="text-primary hover:underline">{s.label}</a> ({s.date})
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
    <Footer />
  </>
);

export default MethodologyPage;
