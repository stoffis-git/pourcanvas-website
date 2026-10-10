import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  DEFAULT_FINISH_INPUTS,
  finishInputsFromParams,
  finishParams,
  rankFinishes,
  type FinishInputs,
  type RankedFinish,
} from "@/lib/tools/finish";
import { track } from "@/lib/track";
import { FINISH_PARAM_KEYS, replaceToolParams } from "@/lib/tools/url";
import { GENERAL_WARNINGS } from "@/lib/tools/data/finish";
import type { ToolConfig } from "@/content/types";

export const FINISH_OPTIONS: { key: keyof FinishInputs; label: string; options: [string, string][] }[] = [
  { key: "surface", label: "Surface", options: [["patio", "Patio"], ["driveway", "Driveway"], ["walkway", "Walkway"], ["pool-deck", "Pool deck"]] },
  { key: "climate", label: "Climate", options: [["freeze-thaw", "Freeze-thaw winters"], ["hot-sun", "Hot, strong sun"], ["wet", "Wet or coastal"], ["mild", "Mild"]] },
  { key: "priority", label: "Top priority", options: [["slip", "Slip resistance"], ["barefoot", "Barefoot comfort"], ["upkeep", "Low upkeep"], ["look", "Best look"], ["budget", "Lowest cost"]] },
  { key: "style", label: "Style", options: [["modern", "Modern / minimal"], ["traditional", "Traditional"], ["natural", "Natural / rustic"]] },
];

export function ChipGroup({ label, value, options, onChange }: { label: string; value: string; options: [string, string][]; onChange: (v: string) => void }) {
  return (
    <fieldset className="space-y-2">
      <legend className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map(([v, l]) => (
          <button
            key={v}
            type="button"
            aria-pressed={value === v}
            onClick={() => onChange(v)}
            className={`rounded-pill border px-3 py-1.5 text-sm transition-colors ${value === v ? "border-foreground bg-foreground text-background" : "border-border bg-background text-foreground hover:border-primary"}`}
          >
            {l}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

export function FinishCard({ f, rank }: { f: RankedFinish; rank: number }) {
  return (
    <div className={`rounded-2xl border p-5 ${rank === 0 ? "border-[#2d2a26] bg-[#2d2a26] text-[#faf8f5]" : "border-border bg-background"}`}>
      <div className="flex items-baseline justify-between gap-3">
        <p className={`text-lg font-semibold ${rank === 0 ? "" : "text-foreground"}`}>
          {rank + 1}. {f.name}
        </p>
        <p className={`text-sm font-semibold ${f.avoid ? "text-destructive" : rank === 0 ? "text-[#90d1bf]" : "text-primary"}`}>{f.avoid ? "Avoid here" : `${f.score}/100`}</p>
      </div>
      {f.reasons.length > 0 && (
        <ul className={`mt-2 space-y-1 text-sm ${rank === 0 ? "text-[#faf8f5]/80" : "text-foreground/80"}`}>
          {f.reasons.map((r) => (
            <li key={r}>+ {r}</li>
          ))}
        </ul>
      )}
      {f.warnings.length > 0 && (
        <ul className={`mt-2 space-y-1 text-sm ${rank === 0 ? "text-[#faf8f5]/70" : "text-muted-foreground"}`}>
          {f.warnings.map((w) => (
            <li key={w}>– {w}</li>
          ))}
        </ul>
      )}
      {f.materialHref && (
        <Link to={f.materialHref} className={`inline-block mt-3 text-sm font-semibold hover:underline ${rank === 0 ? "text-[#90d1bf]" : "text-primary"}`}>
          {f.name} guide →
        </Link>
      )}
    </div>
  );
}

export function FinishTool({ config }: { config: ToolConfig }) {
  const defaults = useMemo(() => ({ ...DEFAULT_FINISH_INPUTS, ...config.finishDefaults }), [config]);
  const [inputs, setInputs] = useState<FinishInputs>(defaults);
  const mounted = useRef(false);
  const tracked = useRef(false);

  useEffect(() => {
    setInputs(finishInputsFromParams(new URLSearchParams(window.location.search), defaults));
    mounted.current = true;
  }, [defaults]);

  useEffect(() => {
    if (!mounted.current) return;
    replaceToolParams(FINISH_PARAM_KEYS, finishParams(inputs, defaults));
  }, [inputs, defaults]);

  const ranked = useMemo(() => rankFinishes(inputs), [inputs]);
  const resultRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const onCopy = async () => {
    const text = [
      `CONCRETE FINISH RANKING - PourCanvas.com (${new Date().toISOString().split("T")[0]})`,
      `Surface: ${inputs.surface}, climate: ${inputs.climate}, priority: ${inputs.priority}, style: ${inputs.style}`,
      ...ranked.map((f, i) => `${i + 1}. ${f.name}: ${f.avoid ? "avoid here" : `${f.score}/100`}`),
      `Calculated with PourCanvas.com · ${window.location.href}`,
    ].join("\n");
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
  const set = (k: keyof FinishInputs, v: string) => {
    setInputs((p) => ({ ...p, [k]: v }));
    if (!tracked.current) {
      tracked.current = true;
      track("tool_calculate", { tool: config.slug });
    }
  };

  return (
    <section aria-label={config.h1} className="grid gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] items-start">
      <div className="rounded-2xl border border-border bg-muted/30 p-5 md:p-6 space-y-5">
        <h2 className="text-base font-semibold text-foreground">Your project</h2>
        {FINISH_OPTIONS.map((o) => (
          <ChipGroup key={o.key} label={o.label} value={inputs[o.key]} options={o.options} onChange={(v) => set(o.key, v)} />
        ))}
        <button
          type="button"
          onClick={() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
          className="lg:hidden w-full rounded-pill py-2.5 text-sm font-semibold text-[#2d2a26]"
          style={{ background: "linear-gradient(135deg,#90d1bf,#9dde90)" }}
        >
          See ranking
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
      <div ref={resultRef} className="space-y-3 scroll-mt-24" aria-live="polite">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">Best finishes for your project</p>
        <p className="sr-only" data-testid="primary-result">{ranked[0]?.name}</p>
        {ranked.map((f, i) => (
          <FinishCard key={f.id} f={f} rank={i} />
        ))}
        <ul className="rounded-2xl border border-border bg-muted/30 px-5 py-4 space-y-1.5 text-sm text-foreground/80 list-disc pl-9">
          {GENERAL_WARNINGS.map((w) => (
            <li key={w}>{w}</li>
          ))}
        </ul>
        <button type="button" onClick={onCopy} className="rounded-pill border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted">
          {copied ? "Copied" : "Copy result"}
        </button>
        <p className="text-xs text-muted-foreground">
          Based on industry slip, freeze-thaw and solar-reflectance research. Scores weigh slip resistance, freeze-thaw durability, barefoot comfort, upkeep, cost and style for your inputs.{" "}
          <Link to="/methodology" className="underline">See methodology</Link>. Pricing a poured slab? Use{" "}
          <a href="https://www.slabcalc.co/calculators/concrete-cost-calculator" className="underline">SlabCalc</a>.
        </p>
      </div>
    </section>
  );
}
