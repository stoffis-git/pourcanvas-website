import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  calculatePoolDeck,
  DEFAULT_POOL_DECK_INPUTS,
  POOL_DECK_PARAM_KEYS,
  poolDeckInputsFromParams,
  poolDeckParams,
  type PoolDeckInputs,
  type PoolDeckResult,
} from "@/lib/tools/poolDeck";
import { DECK_CONDITION_LABELS, DECK_METHOD_LABELS, DECK_METHODS } from "@/lib/tools/data/poolDeck";
import { REGION_LABELS } from "@/lib/tools/data/paving";
import { money, moneyRange, num, perSqftRange } from "@/lib/format";
import { track } from "@/lib/track";
import { replaceToolParams } from "@/lib/tools/url";
import { NumberInput } from "./NumberInput";
import { CURRENT_YEAR } from "@/lib/year";
import type { ToolConfig } from "@/content/types";

const FT_PER_M = 3.28084;
const SQFT_PER_M2 = FT_PER_M * FT_PER_M;
const SLABCALC_POOL_DECK = "https://www.slabcalc.co/calculators/concrete-pool-deck-cost-calculator";

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

function Toggle<T extends string | boolean>({ label, value, options, onChange }: { label: string; value: T; options: [T, string][]; onChange: (v: T) => void }) {
  return (
    <div className="inline-flex rounded-pill border border-border p-0.5 text-xs" role="group" aria-label={label}>
      {options.map(([v, l]) => (
        <button
          key={String(v)}
          type="button"
          aria-pressed={value === v}
          onClick={() => onChange(v)}
          className={`px-3 py-1 rounded-pill ${value === v ? "bg-foreground text-background" : "text-muted-foreground"}`}
        >
          {l}
        </button>
      ))}
    </div>
  );
}

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-xl bg-background/70 border border-border px-4 py-3">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="text-lg font-semibold text-foreground">{value}</p>
      {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
    </div>
  );
}

const years = (r: { low: number; high: number }) => `${num(r.low)}–${num(r.high)} yrs`;

export function poolDeckCopyText(r: PoolDeckResult, inputs: PoolDeckInputs, url: string) {
  const size =
    inputs.mode === "pool"
      ? `${inputs.poolLength} x ${inputs.poolWidth} ft ${inputs.shape === "rect" ? "rectangular" : "rounded"} pool, ${inputs.deckWidth} ft deck = ${num(r.area)} sq ft`
      : `${num(r.area)} sq ft deck`;
  return [
    `POOL DECK RESURFACING ESTIMATE - PourCanvas.com (${new Date().toISOString().split("T")[0]})`,
    `Deck: ${size}`,
    `Method: ${DECK_METHOD_LABELS[inputs.method]} · condition: ${DECK_CONDITION_LABELS[inputs.condition].toLowerCase()} · ${REGION_LABELS[inputs.region]}`,
    `Installed cost: ${moneyRange(r.total)} (${perSqftRange(r.perSqft)}/sq ft, typical ${money(r.total.typical)})`,
    r.repair.typical > 0 ? `Includes crack repair: ${moneyRange(r.repair)}` : "",
    r.copingCost.typical > 0 ? `Includes coping replacement (${num(r.copingLF)} ft): ${moneyRange(r.copingCost)}` : "",
    r.diy ? `DIY materials: ${moneyRange(r.diy)}` : "",
    `Lifespan: ${years(r.lifespan)} · about ${money(r.perYear)} per year`,
    `Recommendation: ${r.recommendation}`,
    `Calculated with PourCanvas.com · ${url}`,
  ]
    .filter(Boolean)
    .join("\n");
}

export function PoolDeckTool({ config }: { config: ToolConfig }) {
  const defaults = useMemo(() => ({ ...DEFAULT_POOL_DECK_INPUTS, ...config.poolDeckDefaults }), [config]);
  const [inputs, setInputs] = useState<PoolDeckInputs>(defaults);
  const [metric, setMetric] = useState(false);
  const [copied, setCopied] = useState(false);
  const mounted = useRef(false);
  const tracked = useRef(false);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setInputs(poolDeckInputsFromParams(new URLSearchParams(window.location.search), defaults));
    mounted.current = true;
  }, [defaults]);

  useEffect(() => {
    if (!mounted.current) return;
    replaceToolParams(POOL_DECK_PARAM_KEYS, poolDeckParams(inputs, defaults));
  }, [inputs, defaults]);

  const set = (p: Partial<PoolDeckInputs>) => {
    setInputs((prev) => ({ ...prev, ...p }));
    if (!tracked.current) {
      tracked.current = true;
      track("tool_calculate", { tool: config.slug });
    }
  };

  const r = useMemo(() => calculatePoolDeck(inputs), [inputs]);
  const toLen = (ft: number) => (metric ? Math.round((ft / FT_PER_M) * 100) / 100 : ft);
  const fromLen = (v: number) => (metric ? Math.round(v * FT_PER_M * 100) / 100 : v);
  const toArea = (sf: number) => (metric ? Math.round((sf / SQFT_PER_M2) * 10) / 10 : sf);
  const fromArea = (v: number) => (metric ? Math.round(v * SQFT_PER_M2 * 10) / 10 : v);
  const lenUnit = metric ? "m" : "ft";
  const areaLabel = metric ? `${num(r.area / SQFT_PER_M2, 1)} m²` : `${num(r.area)} sq ft`;

  const onCopy = async () => {
    const text = poolDeckCopyText(r, inputs, window.location.href);
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

  return (
    <section aria-label={config.h1} className="grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] items-start">
      <div className="rounded-2xl border border-border bg-muted/30 p-5 md:p-6 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-base font-semibold text-foreground">Your pool deck</h2>
          <Toggle<boolean> label="Units" value={metric} options={[[false, "Imperial"], [true, "Metric"]]} onChange={setMetric} />
        </div>
        <Toggle label="Deck size from" value={inputs.mode} options={[["pool", "From pool size"], ["area", "Enter deck area"]]} onChange={(v) => set({ mode: v })} />
        {inputs.mode === "pool" ? (
          <div className="grid grid-cols-2 gap-3">
            <Field label={`Pool length (${lenUnit})`} htmlFor="pd-pl">
              <NumberInput id="pd-pl" value={toLen(inputs.poolLength)} onValue={(n) => set({ poolLength: fromLen(n) })} className={selectCls} />
            </Field>
            <Field label={`Pool width (${lenUnit})`} htmlFor="pd-pw">
              <NumberInput id="pd-pw" value={toLen(inputs.poolWidth)} onValue={(n) => set({ poolWidth: fromLen(n) })} className={selectCls} />
            </Field>
            <Field label={`Deck width (${lenUnit})`} htmlFor="pd-dw">
              <NumberInput id="pd-dw" value={toLen(inputs.deckWidth)} onValue={(n) => set({ deckWidth: fromLen(n) })} className={selectCls} />
            </Field>
            <Field label="Pool shape" htmlFor="pd-sh">
              <Select id="pd-sh" value={inputs.shape} onChange={(v) => set({ shape: v })} options={[["rect", "Rectangle"], ["round", "Oval / kidney / freeform"]]} />
            </Field>
          </div>
        ) : (
          <Field label={`Deck area (${metric ? "m²" : "sq ft"})`} htmlFor="pd-a">
            <NumberInput id="pd-a" value={toArea(inputs.area)} onValue={(n) => set({ area: fromArea(n) })} className={selectCls} />
          </Field>
        )}
        <div className="grid sm:grid-cols-2 gap-3">
          <Field label="Resurfacing method" htmlFor="pd-me">
            <Select id="pd-me" value={inputs.method} onChange={(v) => set({ method: v })} options={DECK_METHODS.map((m) => [m, DECK_METHOD_LABELS[m]])} />
          </Field>
          <Field label="Deck condition" htmlFor="pd-c">
            <Select id="pd-c" value={inputs.condition} onChange={(v) => set({ condition: v })} options={Object.entries(DECK_CONDITION_LABELS) as [PoolDeckInputs["condition"], string][]} />
          </Field>
          <Field label="Pool coping" htmlFor="pd-cp">
            <Select id="pd-cp" value={inputs.coping} onChange={(v) => set({ coping: v })} options={[["keep", "Keep existing coping"], ["replace", "Replace coping"]]} />
          </Field>
          <Field label="Region" htmlFor="pd-rg">
            <Select id="pd-rg" value={inputs.region} onChange={(v) => set({ region: v })} options={Object.entries(REGION_LABELS) as [PoolDeckInputs["region"], string][]} />
          </Field>
          <Field label="What matters most" htmlFor="pd-p">
            <Select
              id="pd-p"
              value={inputs.priority}
              onChange={(v) => set({ priority: v })}
              options={[["value", "Best value over time"], ["low", "Lowest cost now"], ["cool", "Cool, grippy surface"], ["premium", "Premium stone look"]]}
            />
          </Field>
        </div>
        <button
          type="button"
          onClick={() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
          className="lg:hidden w-full rounded-pill py-2.5 text-sm font-semibold text-[#2d2a26]"
          style={{ background: "linear-gradient(135deg,#90d1bf,#9dde90)" }}
        >
          See result
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
          <p className="text-xs uppercase tracking-wide text-[#faf8f5]/60">Installed cost · {DECK_METHOD_LABELS[inputs.method]}</p>
          <p className="text-3xl md:text-4xl font-bold mt-1" data-testid="primary-result">
            {moneyRange(r.total)}
          </p>
          <p className="text-sm text-[#faf8f5]/70 mt-2">
            {perSqftRange(r.perSqft)} per sq ft · typical {money(r.total.typical)}
          </p>
          <p className="text-sm text-[#faf8f5]/70 mt-1">
            {areaLabel} of deck · {metric ? `${num(r.copingLF / FT_PER_M, 1)} m` : `${num(r.copingLF)} ft`} of coping{inputs.mode === "area" ? " (est.)" : ""}
          </p>
          {config.nextStep && (
            <Link to={`/tools/${config.nextStep.slug}`} className="inline-block mt-4 text-sm font-semibold text-[#90d1bf] hover:underline">
              {config.nextStep.label} →
            </Link>
          )}
        </div>

        {r.suitability !== "ok" && (
          <p className="rounded-xl border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-foreground/90">
            {r.suitability === "unsuitable"
              ? "Not recommended on this deck: a moving or structurally cracked slab will crack any coating, overlay or paver set on it. Repair and level it first, or replace it."
              : "Paint and sealer won't hide cracks; they show through within a season. A resurfacer or cool deck texture covers them after repair."}
          </p>
        )}

        <div className="grid grid-cols-2 gap-3">
          <Stat label="Surface work" value={moneyRange(r.surface)} sub="materials + labor" />
          <Stat label="Lifespan" value={years(r.lifespan)} sub={`about ${money(r.perYear)} per year`} />
          {r.repair.typical > 0 && <Stat label="Crack repair" value={moneyRange(r.repair)} sub="included in the total" />}
          {r.copingCost.typical > 0 && <Stat label="New coping" value={moneyRange(r.copingCost)} sub={`${num(r.copingLF)} linear ft, included`} />}
          <Stat label="DIY materials" value={r.diy ? moneyRange(r.diy) : "Pro job"} sub={r.diy ? "what you'd pay doing it yourself" : "needs pro tools and skills"} />
        </div>

        <div className="rounded-2xl border border-border bg-muted/30 px-5 py-4">
          <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Our recommendation</p>
          <p className="text-sm text-foreground/90" data-testid="recommendation">{r.recommendation}</p>
        </div>

        <div className="rounded-2xl border border-border overflow-hidden">
          <div className="px-5 py-3 bg-muted/40 text-sm font-semibold text-foreground">Every method for the same {areaLabel} deck</div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-muted-foreground text-left">
                  <th className="px-4 py-2 font-medium">Method</th>
                  <th className="px-3 py-2 font-medium text-right">Installed</th>
                  <th className="px-3 py-2 font-medium text-right">Lasts</th>
                  <th className="px-3 py-2 font-medium text-right">Per year</th>
                  <th className="px-4 py-2 font-medium">Heat · grip</th>
                </tr>
              </thead>
              <tbody>
                {r.compare.map((c) => (
                  <tr key={c.method} className={`border-t border-border align-top ${c.method === inputs.method ? "bg-primary/10" : ""}`}>
                    <td className="px-4 py-2.5">
                      {c.method === "replace" ? (
                        <a href={SLABCALC_POOL_DECK} className="text-foreground hover:text-primary hover:underline">{c.label}</a>
                      ) : (
                        <button type="button" onClick={() => set({ method: c.method })} className="text-left text-foreground hover:text-primary hover:underline">
                          {c.label}
                        </button>
                      )}
                      {c.suitability === "unsuitable" && <span className="block text-xs text-destructive">Slab must be stable first</span>}
                      {c.suitability === "caution" && <span className="block text-xs text-muted-foreground">Cracks show through</span>}
                    </td>
                    <td className="px-3 py-2.5 text-right font-medium whitespace-nowrap">{moneyRange(c.total)}</td>
                    <td className="px-3 py-2.5 text-right text-muted-foreground whitespace-nowrap">{years(c.lifespan)}</td>
                    <td className="px-3 py-2.5 text-right whitespace-nowrap">{money(c.perYear)}</td>
                    <td className="px-4 py-2.5 text-xs text-muted-foreground min-w-[9rem]">
                      {c.heatSlip.heat} · {c.heatSlip.slip}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button type="button" onClick={onCopy} className="rounded-pill border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted">
            {copied ? "Copied" : "Copy result"}
          </button>
          <p className="text-xs text-muted-foreground">
            Based on {CURRENT_YEAR} U.S. national pricing (HomeGuide, Angi, Concrete Network, Fixr).{" "}
            <Link to="/methodology" className="underline">See methodology</Link>.
          </p>
        </div>
      </div>
    </section>
  );
}
