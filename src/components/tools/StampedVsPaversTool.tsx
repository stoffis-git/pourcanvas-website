import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  calculateSvp,
  SVP_DEFAULT_INPUTS,
  SVP_HORIZONS,
  SVP_PARAM_KEYS,
  SVP_PAVERS,
  svpInputsFromParams,
  svpParamsFromInputs,
  type SvpInputs,
  type SvpResult,
} from "@/lib/tools/stampedVsPavers";
import { MATERIAL_LABELS, REGION_LABELS, type Range } from "@/lib/tools/data/paving";
import { STAMPED_DESIGN_LABELS, STAMPED_DESIGN_HINTS, type StampedDesign } from "@/lib/tools/data/lifetime";
import { money, moneyRange, num, perSqftRange } from "@/lib/format";
import { track } from "@/lib/track";
import { carryParams, replaceToolParams } from "@/lib/tools/url";
import { DEFAULT_INPUTS as PAVING_DEFAULTS } from "@/lib/tools/paving";
import { NumberInput } from "./NumberInput";
import { CURRENT_YEAR } from "@/lib/year";
import type { ToolConfig } from "@/content/types";

const FT_PER_M = 3.28084;
const SQFT_PER_M2 = FT_PER_M * FT_PER_M;
const SLABCALC_STAMPED = "https://www.slabcalc.co/calculators/stamped-concrete-cost-calculator";

const selectCls =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring";

function Field({ label, children, htmlFor }: { label: string; children: ReactNode; htmlFor?: string }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className="block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </label>
      {children}
    </div>
  );
}

function Select<T extends string>({ id, value, onChange, options }: { id: string; value: T; onChange: (v: T) => void; options: [T, string][] }) {
  return (
    <select id={id} className={selectCls} value={value} onChange={(e) => onChange(e.target.value as T)}>
      {options.map(([v, l]) => (
        <option key={v} value={v}>
          {l}
        </option>
      ))}
    </select>
  );
}

const unitRate = (r: Range, metric: boolean) => (metric ? `${perSqftRange({ low: r.low * SQFT_PER_M2, typical: r.typical * SQFT_PER_M2, high: r.high * SQFT_PER_M2 })}/m²` : `${perSqftRange(r)}/sq ft`);

export function svpCopyText(r: SvpResult, inputs: SvpInputs, url: string, metric = false) {
  const m = (ft: number) => Math.round((ft / FT_PER_M) * 100) / 100;
  const size = metric
    ? `${m(inputs.length)} x ${m(inputs.width)} m = ${num(r.area / SQFT_PER_M2, 1)} m²`
    : `${inputs.length} x ${inputs.width} ft = ${num(r.area)} sq ft`;
  const ev = (side: "stamped" | "pavers") =>
    (side === "stamped" ? r.stamped : r.pavers).events
      .filter((e) => e.count > 0)
      .map((e) => `  - ${e.label}: every ${e.everyYears} yrs, ${e.count}x ${moneyRange(e.perEvent)} = ${moneyRange(e.total)}`);
  return [
    `STAMPED CONCRETE VS PAVERS - PourCanvas.com (${new Date().toISOString().split("T")[0]})`,
    `Project: ${size} ${inputs.use}, ${REGION_LABELS[inputs.region]}, ${inputs.climate === "freeze-thaw" ? "freeze-thaw winters" : "mild winters"}`,
    `${r.stamped.label}: ${moneyRange(r.stamped.upfront)} installed (${unitRate(r.stamped.perSqft, metric)})`,
    `${r.pavers.label}: ${moneyRange(r.pavers.upfront)} installed (${unitRate(r.pavers.perSqft, metric)})`,
    `Upkeep over ${r.years} years, stamped: ${moneyRange(r.stamped.upkeep)}`,
    ...ev("stamped"),
    `Upkeep over ${r.years} years, pavers: ${moneyRange(r.pavers.upkeep)}`,
    ...ev("pavers"),
    `${r.years}-year total: stamped ${moneyRange(r.stamped.lifetime)} vs pavers ${moneyRange(r.pavers.lifetime)}`,
    `Break-even: ${r.breakEvenYear ? `year ${r.breakEvenYear}` : "none within 30 years"}`,
    `Verdict: ${r.verdict}`,
    r.assumptions,
    `Calculated with PourCanvas.com · ${url}`,
  ].join("\n");
}

export function StampedVsPaversTool({ config }: { config: ToolConfig }) {
  const defaults = useMemo(() => ({ ...SVP_DEFAULT_INPUTS, ...config.svpDefaults }), [config]);
  const [inputs, setInputs] = useState<SvpInputs>(defaults);
  const [metric, setMetric] = useState(false);
  const [copied, setCopied] = useState(false);
  const mounted = useRef(false);
  const tracked = useRef(false);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setInputs(svpInputsFromParams(new URLSearchParams(window.location.search), defaults));
    mounted.current = true;
  }, [defaults]);

  useEffect(() => {
    if (!mounted.current) return;
    replaceToolParams(SVP_PARAM_KEYS, svpParamsFromInputs(inputs, defaults));
  }, [inputs, defaults]);

  const set = (p: Partial<SvpInputs>) => {
    setInputs((prev) => ({ ...prev, ...p }));
    if (!tracked.current) {
      tracked.current = true;
      track("tool_calculate", { tool: config.slug });
    }
  };

  const r = useMemo(() => calculateSvp(inputs), [inputs]);
  const toDisplay = (ft: number) => (metric ? Math.round((ft / FT_PER_M) * 100) / 100 : ft);
  const fromDisplay = (v: number) => (metric ? Math.round(v * FT_PER_M * 100) / 100 : v);

  const onCopy = async () => {
    const text = svpCopyText(r, inputs, window.location.href, metric);
    try {
      if (!navigator.clipboard) throw new Error("no clipboard");
      await navigator.clipboard.writeText(text);
      setCopied(true);
      track("tool_copy", { tool: config.slug });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copy your result:", text);
    }
  };

  const paverTool = inputs.use === "driveway" ? "paver-driveway-cost-calculator" : "paver-patio-cost-calculator";
  const paverHref = `/tools/${paverTool}?${carryParams({ ...PAVING_DEFAULTS, length: inputs.length, width: inputs.width, material: inputs.paver, use: inputs.use, region: inputs.region })}`;
  const sides = [r.stamped, r.pavers] as const;
  const marks = [5, 10, 15, 20, 25, 30].filter((y) => y <= Math.max(inputs.years, 10));

  return (
    <section aria-label={config.h1} className="grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] items-start">
      <div className="rounded-2xl border border-border bg-muted/30 p-5 md:p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-foreground">Your project</h2>
          <div className="inline-flex rounded-pill border border-border p-0.5 text-xs" role="group" aria-label="Units">
            {[false, true].map((m) => (
              <button
                key={String(m)}
                type="button"
                aria-pressed={metric === m}
                onClick={() => setMetric(m)}
                className={`px-3 py-1 rounded-pill ${metric === m ? "bg-foreground text-background" : "text-muted-foreground"}`}
              >
                {m ? "Metric" : "Imperial"}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {(["length", "width"] as const).map((k) => (
            <Field key={k} label={`${k === "length" ? "Length" : "Width"} (${metric ? "m" : "ft"})`} htmlFor={`svp-${k}`}>
              <NumberInput id={`svp-${k}`} value={toDisplay(inputs[k])} onValue={(n) => set({ [k]: fromDisplay(n) } as Partial<SvpInputs>)} className={selectCls} />
            </Field>
          ))}
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          <Field label="Project" htmlFor="svp-use">
            <Select id="svp-use" value={inputs.use} onChange={(v) => set({ use: v })} options={[["patio", "Patio / walkway"], ["driveway", "Driveway"]]} />
          </Field>
          <Field label="Climate" htmlFor="svp-climate">
            <Select id="svp-climate" value={inputs.climate} onChange={(v) => set({ climate: v })} options={[["freeze-thaw", "Freeze-thaw"], ["mild", "Mild winters"]]} />
          </Field>
          <Field label="Stamped design" htmlFor="svp-design">
            <Select id="svp-design" value={inputs.design} onChange={(v) => set({ design: v })} options={(Object.keys(STAMPED_DESIGN_LABELS) as StampedDesign[]).map((d) => [d, STAMPED_DESIGN_LABELS[d]])} />
          </Field>
          <Field label="Paver type" htmlFor="svp-paver">
            <Select id="svp-paver" value={inputs.paver} onChange={(v) => set({ paver: v })} options={SVP_PAVERS.map((m) => [m, MATERIAL_LABELS[m]])} />
          </Field>
          <Field label="Region" htmlFor="svp-region">
            <Select id="svp-region" value={inputs.region} onChange={(v) => set({ region: v })} options={Object.entries(REGION_LABELS) as [SvpInputs["region"], string][]} />
          </Field>
          <Field label="Compare over" htmlFor="svp-years">
            <Select
              id="svp-years"
              value={String(inputs.years) as `${SvpInputs["years"]}`}
              onChange={(v) => set({ years: Number(v) as SvpInputs["years"] })}
              options={SVP_HORIZONS.map((y) => [String(y) as `${SvpInputs["years"]}`, `${y} years`])}
            />
          </Field>
        </div>
        <p className="text-xs text-muted-foreground">{STAMPED_DESIGN_HINTS[inputs.design]}</p>
        <label className="flex items-center gap-2 text-sm text-foreground">
          <input type="checkbox" checked={inputs.sealPavers} onChange={(e) => set({ sealPavers: e.target.checked })} className="h-4 w-4 rounded border-border" />
          I'll also seal the pavers (optional)
        </label>
        <button
          type="button"
          onClick={() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
          className="lg:hidden w-full rounded-pill py-2.5 text-sm font-semibold text-[#2d2a26]"
          style={{ background: "linear-gradient(135deg,#90d1bf,#9dde90)" }}
        >
          Compare costs
        </button>
        {config.tips.length > 0 && (
          <div className="pt-2 border-t border-border">
            <h3 className="text-sm font-semibold text-foreground mt-4 mb-2">Pro Tips</h3>
            <ul className="space-y-1.5 text-sm text-foreground/80 list-disc pl-5">
              {config.tips.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div ref={resultRef} className="space-y-4 scroll-mt-24 min-w-0" aria-live="polite">
        <div className="rounded-2xl bg-[#2d2a26] text-[#faf8f5] p-6 md:p-7">
          <p className="text-xs uppercase tracking-wide text-[#faf8f5]/60">
            Installed cost · {num(metric ? r.area / SQFT_PER_M2 : r.area, 1)} {metric ? "m²" : "sq ft"} {inputs.use === "driveway" ? "driveway" : "patio"}
          </p>
          <div className="grid grid-cols-2 gap-4 mt-2">
            {sides.map((s, i) => (
              <div key={s.label}>
                <p className="text-sm text-[#faf8f5]/70">{i === 0 ? "Stamped concrete" : MATERIAL_LABELS[inputs.paver]}</p>
                <p className="text-2xl md:text-3xl font-bold" data-testid={i === 0 ? "primary-result" : undefined}>
                  {moneyRange(s.upfront)}
                </p>
                <p className="text-xs text-[#faf8f5]/60">{unitRate(s.perSqft, metric)}</p>
              </div>
            ))}
          </div>
          <p className="text-sm text-[#faf8f5]/80 mt-4">
            {r.cheaperUpfront === "tie"
              ? `About even up front (within ${money(r.upfrontDiff)}).`
              : `${r.cheaperUpfront === "stamped" ? "Stamped concrete costs" : "Pavers cost"} about ${money(r.upfrontDiff)} (${r.upfrontPct}%) less up front at typical prices.`}
          </p>
          <p className="text-sm text-[#faf8f5]/80 mt-1">
            {r.years}-year cost incl. upkeep: stamped {money(r.stamped.lifetime.typical)} vs pavers {money(r.pavers.lifetime.typical)} ·{" "}
            {r.breakEvenYear ? `break-even in year ${r.breakEvenYear}` : "no break-even within 30 years"}
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-muted/30 px-5 py-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">Verdict</p>
          <p className="text-sm text-foreground" data-testid="verdict">{r.verdict}</p>
        </div>

        <div className="rounded-2xl border border-border overflow-hidden">
          <div className="px-5 py-3 bg-muted/40 text-sm font-semibold text-foreground">Running total, typical prices</div>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-muted-foreground">
                <th className="px-5 py-2 text-left font-medium">Year</th>
                <th className="px-3 py-2 text-right font-medium">Stamped</th>
                <th className="px-5 py-2 text-right font-medium">Pavers</th>
              </tr>
            </thead>
            <tbody>
              {[0, ...marks].map((y) => {
                const s = r.stamped.cumulative[y];
                const p = r.pavers.cumulative[y];
                return (
                  <tr key={y} className={`border-t border-border ${y === inputs.years ? "bg-primary/10" : ""}`}>
                    <td className="px-5 py-2">{y === 0 ? "Install" : `Year ${y}`}</td>
                    <td className={`px-3 py-2 text-right whitespace-nowrap ${s < p ? "font-semibold" : ""}`}>{money(s)}</td>
                    <td className={`px-5 py-2 text-right whitespace-nowrap ${p < s ? "font-semibold" : ""}`}>{money(p)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <p className="px-5 py-3 border-t border-border text-xs text-muted-foreground" data-testid="assumptions">{r.assumptions}</p>
        </div>

        <details className="rounded-2xl border border-border" open>
          <summary className="px-5 py-3 text-sm font-semibold text-foreground cursor-pointer">Upkeep over {r.years} years</summary>
          <div className="px-5 pb-4 space-y-3 text-sm">
            {sides.map((s, i) => (
              <div key={s.label}>
                <p className="font-medium text-foreground">
                  {i === 0 ? "Stamped concrete" : "Pavers"}: {moneyRange(s.upkeep)}
                </p>
                <ul className="mt-1 space-y-0.5 text-foreground/80">
                  {s.events.map((e) => (
                    <li key={e.label}>
                      {e.label}: every {e.everyYears} years, {e.count}× {moneyRange(e.perEvent)}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </details>

        <div className="rounded-2xl border border-border overflow-hidden">
          <div className="px-5 py-3 bg-muted/40 text-sm font-semibold text-foreground">Same {num(r.area)} sq ft, every option</div>
          <table className="w-full text-sm">
            <tbody>
              {r.options.map((o) => {
                const active = o.id === inputs.paver || o.id === `stamped-${inputs.design}`;
                return (
                  <tr key={o.id} className={`border-t border-border ${active ? "bg-primary/10" : ""}`}>
                    <td className="px-5 py-2.5">{o.label}</td>
                    <td className="px-3 py-2.5 text-muted-foreground whitespace-nowrap hidden sm:table-cell">{unitRate(o.perSqft, metric)}</td>
                    <td className="px-5 py-2.5 text-right font-medium whitespace-nowrap">{moneyRange(o.total)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <p className="px-5 py-3 border-t border-border text-xs text-muted-foreground">
            Pricing a stamped quote line by line? Use the <a href={SLABCALC_STAMPED} className="text-primary hover:underline">stamped concrete cost calculator</a> on our sister site SlabCalc.
          </p>
        </div>

        <Link to={paverHref} className="inline-block text-sm font-semibold text-primary hover:underline">
          Get the full paver cost breakdown for this size →
        </Link>

        <div className="flex flex-wrap items-center gap-3">
          <button type="button" onClick={onCopy} className="rounded-pill border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted">
            {copied ? "Copied" : "Copy result"}
          </button>
          <p className="text-xs text-muted-foreground">
            Based on {CURRENT_YEAR} U.S. installed-cost and upkeep data. <Link to="/methodology" className="underline">See methodology</Link>.
          </p>
        </div>
      </div>
    </section>
  );
}
