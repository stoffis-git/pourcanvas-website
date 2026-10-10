import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  calculatePaving,
  DEFAULT_INPUTS,
  inputsFromParams,
  paramsFromInputs,
  type PavingInputs,
  type PavingResult,
} from "@/lib/tools/paving";
import {
  BEDDING_SAND_IN,
  MATERIAL_LABELS,
  PATTERN_LABELS,
  PAVER_SIZES,
  REGION_LABELS,
  type AnyMaterial,
  type PavingMaterial,
} from "@/lib/tools/data/paving";
import { money, moneyRange, num, perSqftRange, tons as tonsLabel } from "@/lib/format";
import { track } from "@/lib/track";
import { carryParams, PAVING_PARAM_KEYS, replaceToolParams } from "@/lib/tools/url";
import { NumberInput } from "./NumberInput";
import { CURRENT_YEAR } from "@/lib/year";
import type { PavingView, ToolConfig } from "@/content/types";

const FT_PER_M = 3.28084;
const TONNE_PER_TON = 0.907185;
const M3_PER_YD3 = 0.764555;

type InputKey = keyof PavingInputs;

const VIEW_INPUTS: Record<PavingView, { main: InputKey[]; more: InputKey[] }> = {
  cost: { main: ["material", "use", "region", "removal"], more: ["pattern", "paverSize", "soil", "joint", "edging", "curved"] },
  pavers: { main: ["material", "paverSize", "pattern", "curved"], more: ["use", "soil", "joint", "edging", "region"] },
  base: { main: ["use", "soil"], more: ["material", "region"] },
  sand: { main: ["material"], more: ["use", "soil", "region"] },
  poly: { main: ["joint"], more: ["material", "region"] },
  flagstone: { main: ["material", "thickness", "use", "region"], more: ["soil", "edging", "removal"] },
  compare: { main: ["use", "region"], more: ["removal"] },
};

const PAVING_MATERIALS: PavingMaterial[] = ["concrete-paver", "clay-brick", "travertine", "porcelain", "flagstone-dry", "flagstone-mortared"];

/** Where each material's row in a comparison should send the user. */
export const MATERIAL_LINKS: Partial<Record<AnyMaterial, { href: string; external?: boolean; label: string }>> = {
  "concrete-paver": { href: "/tools/paver-patio-cost-calculator", label: "Paver patio cost" },
  "clay-brick": { href: "/tools/paver-patio-cost-calculator?m=clay-brick", label: "Brick patio cost" },
  travertine: { href: "/tools/paver-patio-cost-calculator?m=travertine", label: "Travertine cost" },
  porcelain: { href: "/tools/paver-patio-cost-calculator?m=porcelain", label: "Porcelain cost" },
  "flagstone-dry": { href: "/tools/flagstone-calculator", label: "Flagstone calculator" },
  "flagstone-mortared": { href: "/tools/flagstone-calculator?m=flagstone-mortared", label: "Flagstone calculator" },
  "plain-concrete": { href: "https://www.slabcalc.co/calculators/concrete-patio-cost-calculator", external: true, label: "Concrete patio cost (SlabCalc)" },
  "stamped-concrete": { href: "https://www.slabcalc.co/calculators/stamped-concrete-cost-calculator", external: true, label: "Stamped concrete cost (SlabCalc)" },
  "exposed-aggregate": { href: "https://www.slabcalc.co/calculators/concrete-patio-cost-calculator", external: true, label: "Concrete cost (SlabCalc)" },
};

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

function Option<T extends string>({ id, value, onChange, options }: { id: string; value: T; onChange: (v: T) => void; options: [T, string][] }) {
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

function InputControl({ k, inputs, set, view }: { k: InputKey; inputs: PavingInputs; set: (p: Partial<PavingInputs>) => void; view: PavingView }) {
  const id = `pv-${k}`;
  switch (k) {
    case "material": {
      const list = view === "flagstone" ? (["flagstone-dry", "flagstone-mortared"] as PavingMaterial[]) : PAVING_MATERIALS;
      return (
        <Field label="Material" htmlFor={id}>
          <Option id={id} value={inputs.material} onChange={(v) => set({ material: v })} options={list.map((m) => [m, MATERIAL_LABELS[m]])} />
        </Field>
      );
    }
    case "paverSize":
      return (
        <Field label="Paver size" htmlFor={id}>
          <Option id={id} value={inputs.paverSize} onChange={(v) => set({ paverSize: v })} options={PAVER_SIZES.map((p) => [p.id, p.label])} />
        </Field>
      );
    case "pattern":
      return (
        <Field label="Laying pattern" htmlFor={id}>
          <Option id={id} value={inputs.pattern} onChange={(v) => set({ pattern: v })} options={Object.entries(PATTERN_LABELS) as [PavingInputs["pattern"], string][]} />
        </Field>
      );
    case "use":
      return (
        <Field label="Project" htmlFor={id}>
          <Option id={id} value={inputs.use} onChange={(v) => set({ use: v })} options={[["patio", "Patio or walkway"], ["driveway", "Driveway (vehicles)"]]} />
        </Field>
      );
    case "soil":
      return (
        <Field label="Soil / climate" htmlFor={id}>
          <Option id={id} value={inputs.soil} onChange={(v) => set({ soil: v })} options={[["drained", "Well-drained soil"], ["clay", "Clay or freeze-thaw (+2 in base)"]]} />
        </Field>
      );
    case "joint":
      return (
        <Field label="Joint width" htmlFor={id}>
          <Option id={id} value={inputs.joint} onChange={(v) => set({ joint: v })} options={[["narrow", "Narrow (1/8–3/8 in)"], ["wide", "Wide (3/4–1 1/4 in)"]]} />
        </Field>
      );
    case "edging":
      return (
        <Field label="Edge restraint" htmlFor={id}>
          <Option id={id} value={inputs.edging} onChange={(v) => set({ edging: v })} options={[["full", "All sides"], ["three-sides", "Three sides (one against house)"], ["none", "None"]]} />
        </Field>
      );
    case "removal":
      return (
        <Field label="Existing surface" htmlFor={id}>
          <Option id={id} value={inputs.removal} onChange={(v) => set({ removal: v })} options={[["none", "Bare ground"], ["sod", "Lawn / sod to remove"], ["concrete", "Old concrete to remove"]]} />
        </Field>
      );
    case "region":
      return (
        <Field label="Region" htmlFor={id}>
          <Option id={id} value={inputs.region} onChange={(v) => set({ region: v })} options={Object.entries(REGION_LABELS) as [PavingInputs["region"], string][]} />
        </Field>
      );
    case "thickness":
      return (
        <Field label="Stone thickness" htmlFor={id}>
          <Option id={id} value={inputs.thickness} onChange={(v) => set({ thickness: v })} options={[["1", "1 in"], ["1.5", "1.5 in"], ["2", "2 in"]]} />
        </Field>
      );
    case "curved":
      return (
        <label className="flex items-center gap-2 text-sm text-foreground pt-6">
          <input type="checkbox" checked={inputs.curved} onChange={(e) => set({ curved: e.target.checked })} className="h-4 w-4 rounded border-border" />
          Curved edges (+5% cuts)
        </label>
      );
    default:
      return null;
  }
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

function primary(view: PavingView, r: PavingResult, metric: boolean): { label: string; value: string; sub: string } {
  const tons = (t: number) => (metric ? `${num(t * TONNE_PER_TON, 1)} tonnes` : tonsLabel(t));
  const vol = (v: number) => (metric ? `${num(v * M3_PER_YD3, 2)} m³` : `${num(v, 2)} yd³`);
  switch (view) {
    case "compare": {
      const lo = r.compare[0];
      const hi = r.compare[r.compare.length - 1];
      return { label: `Cheapest: ${lo.label}`, value: moneyRange(lo.total), sub: `up to ${moneyRange(hi.total)} for ${hi.label.toLowerCase()} · ${r.compare.length} materials compared below` };
    }
    case "cost":
      return { label: "Installed cost", value: moneyRange(r.pro), sub: `${perSqftRange(r.proPerSqft)} per sq ft · typical ${money(r.pro.typical)}` };
    case "pavers":
      return r.isFlagstone
        ? { label: "Flagstone needed", value: tons(r.flagstoneTons), sub: `incl. ${Math.round(r.wastePct * 100)}% waste` }
        : { label: "Pavers needed", value: `${num(r.paverCount)} pavers`, sub: `incl. ${Math.round(r.wastePct * 100)}% waste for cuts and breakage` };
    case "base":
      return { label: "Paver base (gravel)", value: tons(r.baseTons), sub: `${vol(r.baseYd3)} at ${r.baseInches} in compacted · ${num(r.baseBags)} bags (0.5 cu ft)` };
    case "sand":
      return { label: "Bedding sand", value: tons(r.sandTons), sub: `${vol(r.sandYd3)} at ${BEDDING_SAND_IN.value} in · ${num(r.sandBags)} bags (0.5 cu ft)` };
    case "poly":
      return { label: "Polymeric sand", value: `${num(r.polyBags)} bags`, sub: "50 lb bags" };
    case "flagstone":
      return { label: "Flagstone needed", value: tons(r.flagstoneTons), sub: `installed ${moneyRange(r.pro)} · ${perSqftRange(r.proPerSqft)} per sq ft` };
  }
}

export function copyText(r: PavingResult, inputs: PavingInputs, url: string) {
  const lines = [
    `PAVING ESTIMATE - PourCanvas.com (${new Date().toISOString().split("T")[0]})`,
    `Project: ${inputs.length} x ${inputs.width} ft = ${num(r.area)} sq ft, ${MATERIAL_LABELS[inputs.material]}, ${inputs.use}`,
    r.isFlagstone ? `Flagstone: ${num(r.flagstoneTons, 1)} tons` : `Pavers: ${num(r.paverCount)} (incl. ${Math.round(r.wastePct * 100)}% waste)`,
    `Base gravel: ${num(r.baseTons, 1)} tons (${num(r.baseYd3, 2)} yd3, ${r.baseInches} in)`,
    `Bedding sand: ${num(r.sandTons, 1)} tons (${num(r.sandYd3, 2)} yd3)`,
    `Polymeric sand: ${num(r.polyBags)} x 50 lb bags`,
    `Edge restraint: ${num(r.edgeLF)} linear ft`,
    `Installed cost (pro): ${moneyRange(r.pro)} (${perSqftRange(r.proPerSqft)}/sq ft)`,
    `DIY materials: ${moneyRange(r.diy)}`,
    `Calculated with PourCanvas.com · ${url}`,
  ];
  return lines.join("\n");
}

export function PavingTool({ config }: { config: ToolConfig }) {
  const view = config.pavingView ?? "cost";
  const defaults = useMemo(() => ({ ...DEFAULT_INPUTS, ...config.pavingDefaults }), [config]);
  const [inputs, setInputs] = useState<PavingInputs>(defaults);
  const [metric, setMetric] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [copied, setCopied] = useState(false);
  const mounted = useRef(false);
  const tracked = useRef(false);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const parsed = inputsFromParams(new URLSearchParams(window.location.search), defaults);
    if (view === "flagstone" && !parsed.material.startsWith("flagstone")) parsed.material = defaults.material;
    setInputs(parsed);
    mounted.current = true;
  }, [defaults, view]);

  useEffect(() => {
    if (!mounted.current) return;
    replaceToolParams(PAVING_PARAM_KEYS, paramsFromInputs(inputs, defaults));
  }, [inputs, defaults]);

  const set = (p: Partial<PavingInputs>) => {
    setInputs((prev) => ({ ...prev, ...p }));
    if (!tracked.current) {
      tracked.current = true;
      track("tool_calculate", { tool: config.slug });
    }
  };

  const r = useMemo(() => calculatePaving(inputs), [inputs]);
  const main = primary(view, r, metric);
  const { main: mainInputs, more } = VIEW_INPUTS[view];
  const toDisplay = (ft: number) => (metric ? Math.round((ft / FT_PER_M) * 100) / 100 : ft);
  const fromDisplay = (v: number) => (metric ? Math.round(v * FT_PER_M * 100) / 100 : v);

  const onCopy = async () => {
    try {
      if (!navigator.clipboard) throw new Error("no clipboard");
      await navigator.clipboard.writeText(copyText(r, inputs, window.location.href));
      setCopied(true);
      track("tool_copy", { tool: config.slug });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copy your result:", copyText(r, inputs, window.location.href));
    }
  };

  const showTakeoff = view !== "compare";
  const showCompare = view === "compare" || view === "cost" || view === "flagstone";

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
            <Field key={k} label={`${k === "length" ? "Length" : "Width"} (${metric ? "m" : "ft"})`} htmlFor={`pv-${k}`}>
              <NumberInput
                id={`pv-${k}`}
                value={toDisplay(inputs[k])}
                onValue={(n) => set({ [k]: fromDisplay(n) } as Partial<PavingInputs>)}
                className={selectCls}
              />
            </Field>
          ))}
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          {mainInputs.map((k) => (
            <InputControl key={k} k={k} inputs={inputs} set={set} view={view} />
          ))}
        </div>
        <button type="button" aria-expanded={showMore} onClick={() => setShowMore((s) => !s)} className="text-sm font-medium text-primary hover:underline">
          {showMore ? "Fewer options" : "More options"}
        </button>
        {showMore && (
          <div className="grid sm:grid-cols-2 gap-3">
            {more.map((k) => (
              <InputControl key={k} k={k} inputs={inputs} set={set} view={view} />
            ))}
          </div>
        )}
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

      <div ref={resultRef} className="space-y-4 scroll-mt-24" aria-live="polite">
        <div className="rounded-2xl bg-[#2d2a26] text-[#faf8f5] p-6 md:p-7">
          <p className="text-xs uppercase tracking-wide text-[#faf8f5]/60">{main.label}</p>
          <p className="text-3xl md:text-4xl font-bold mt-1" data-testid="primary-result">
            {main.value}
          </p>
          <p className="text-sm text-[#faf8f5]/70 mt-2">{main.sub}</p>
          <p className="text-sm text-[#faf8f5]/70 mt-1">
            {num(metric ? r.area / (FT_PER_M * FT_PER_M) : r.area, 1)} {metric ? "m²" : "sq ft"}
            {view !== "compare" && ` · ${MATERIAL_LABELS[inputs.material]}`}
          </p>
          {config.nextStep && (
            <Link to={`/tools/${config.nextStep.slug}?${carryParams(inputs)}`} className="inline-block mt-4 text-sm font-semibold text-[#90d1bf] hover:underline">
              {config.nextStep.label} →
            </Link>
          )}
        </div>

        {r.onSlab && (
          <p className="rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm text-foreground/80">
            Mortared flagstone is set on a concrete slab, so no gravel base or joint sand is needed. Size the slab with the{" "}
            <a href="https://www.slabcalc.co/calculators/concrete-slab-calculator" className="text-primary hover:underline">concrete slab calculator</a> on SlabCalc.
          </p>
        )}

        {(view === "cost" || view === "flagstone") && (
          <div className="grid grid-cols-2 gap-3">
            <Stat label="Materials" value={moneyRange(r.materials)} sub="what you'd pay for DIY" />
            <Stat label={r.onSlab ? "Labor + slab (est.)" : "Labor (est.)"} value={moneyRange(r.labor)} sub={r.onSlab ? "includes the concrete slab and mortar" : "installed minus materials"} />
            {r.removal.typical > 0 && <Stat label="Removal" value={moneyRange(r.removal)} sub="included in installed cost" />}
          </div>
        )}

        {showCompare && (
          <div className="rounded-2xl border border-border overflow-hidden">
            <div className="px-5 py-3 bg-muted/40 text-sm font-semibold text-foreground">
              Same {num(r.area)} sq ft in other materials
            </div>
            <table className="w-full text-sm">
              <tbody>
                {r.compare.map((c) => {
                  const base = MATERIAL_LINKS[c.material];
                  const link = base && !base.external
                    ? { ...base, href: `${base.href.split("?")[0]}?${carryParams(inputs, { material: c.material as PavingMaterial })}` }
                    : base;
                  const active = view !== "compare" && c.material === inputs.material;
                  return (
                    <tr key={c.material} className={`border-t border-border ${active ? "bg-primary/10" : ""}`}>
                      <td className="px-5 py-2.5">
                        {link ? (
                          link.external ? (
                            <a href={link.href} className="text-foreground hover:text-primary hover:underline">
                              {c.label}
                            </a>
                          ) : (
                            <Link to={link.href} className="text-foreground hover:text-primary hover:underline">
                              {c.label}
                            </Link>
                          )
                        ) : (
                          c.label
                        )}
                      </td>
                      <td className="px-3 py-2.5 text-muted-foreground whitespace-nowrap">{perSqftRange(c.perSqft)}/sq ft</td>
                      <td className="px-5 py-2.5 text-right font-medium whitespace-nowrap">{moneyRange(c.total)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {showTakeoff && (
          <details className="rounded-2xl border border-border" open={view !== "cost"}>
            <summary className="px-5 py-3 text-sm font-semibold text-foreground cursor-pointer">Full material list</summary>
            <div className="grid grid-cols-2 gap-3 p-5 pt-2">
              {r.isFlagstone ? (
                <Stat label="Flagstone" value={metric ? `${num(r.flagstoneTons * TONNE_PER_TON, 1)} t` : tonsLabel(r.flagstoneTons)} sub={`${inputs.thickness} in stone`} />
              ) : (
                <Stat label="Pavers" value={num(r.paverCount)} sub={`${PAVER_SIZES.find((p) => p.id === inputs.paverSize)?.label ?? ""}, +${Math.round(r.wastePct * 100)}%`} />
              )}
              <Stat label="Base gravel" value={metric ? `${num(r.baseTons * TONNE_PER_TON, 1)} t` : tonsLabel(r.baseTons)} sub={`${r.baseInches} in compacted`} />
              <Stat label="Bedding sand" value={metric ? `${num(r.sandTons * TONNE_PER_TON, 1)} t` : tonsLabel(r.sandTons)} sub={`${BEDDING_SAND_IN.value} in layer`} />
              <Stat label="Polymeric sand" value={`${num(r.polyBags)} bags`} sub="50 lb" />
              <Stat label="Edge restraint" value={metric ? `${num(r.edgeLF / FT_PER_M, 1)} m` : `${num(r.edgeLF)} ft`} />
              <Stat label="DIY materials" value={moneyRange(r.diy)} sub={`installed: ${moneyRange(r.pro)}`} />
            </div>
          </details>
        )}

        <div className="flex flex-wrap items-center gap-3">
          <button type="button" onClick={onCopy} className="rounded-pill border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted">
            {copied ? "Copied" : "Copy result"}
          </button>
          <p className="text-xs text-muted-foreground">
            Based on {CURRENT_YEAR} U.S. installed-cost data. <Link to="/methodology" className="underline">See methodology</Link>.
          </p>
        </div>
      </div>
    </section>
  );
}
