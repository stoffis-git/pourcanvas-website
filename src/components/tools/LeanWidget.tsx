import { useState } from "react";
import { Link } from "react-router-dom";
import { calculatePaving, DEFAULT_INPUTS, type PavingInputs } from "@/lib/tools/paving";
import { carryParams } from "@/lib/tools/url";
import { toolsBySlug } from "@/content/tools";
import { NumberInput } from "./NumberInput";
import { MATERIAL_LABELS, PAVER_SIZES, type AnyMaterial } from "@/lib/tools/data/paving";
import { moneyRange, num } from "@/lib/format";
import { track } from "@/lib/track";
import type { ToolWidgetRef } from "@/content/types";
import { FinishWidget } from "./FinishWidget";

const inputCls =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring";

/** Compact tool block for content pages: 2–3 inputs, one teaser result, same-tab hand-off to the full tool. */
export function LeanWidget({ widget, source }: { widget: ToolWidgetRef; source: string }) {
  if (widget.variant === "finish") return <FinishWidget widget={widget} source={source} />;
  return <PavingWidget widget={widget} source={source} />;
}

function PavingWidget({ widget, source }: { widget: ToolWidgetRef; source: string }) {
  const target = toolsBySlug.get(widget.tool);
  const base: PavingInputs = { ...DEFAULT_INPUTS, ...target?.pavingDefaults, ...widget.defaults };
  const [inputs, setInputs] = useState<PavingInputs>(base);
  const [done, setDone] = useState(false);
  const compareSet: AnyMaterial[] = widget.compareMaterials ?? ["concrete-paver", "plain-concrete"];

  const r = calculatePaving(inputs);
  const set = (p: Partial<PavingInputs>) => setInputs((prev) => ({ ...prev, ...p }));
  const href = `/tools/${widget.tool}?${carryParams(inputs)}`;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setDone(true);
    track("widget_submit", { tool: widget.tool, source });
  };

  let teaser: string;
  if (widget.variant === "compare") {
    teaser = r.compare
      .filter((c) => compareSet.includes(c.material))
      .map((c) => `${MATERIAL_LABELS[c.material]}: ~${moneyRange(c.total)}`)
      .join(" · ");
  } else if (widget.variant === "flagstone") {
    teaser = `~${num(r.flagstoneTons, 1)} tons of flagstone · ~${moneyRange(r.pro)} installed`;
  } else {
    teaser = `~${num(r.paverCount)} pavers + ${num(r.baseTons, 1)} tons of base · ~${moneyRange(r.pro)} installed`;
  }

  return (
    <aside className="my-10 rounded-2xl border border-border bg-muted/30 p-5 md:p-6" aria-label={widget.heading}>
      <p className="text-base font-semibold text-foreground mb-4">{widget.heading}</p>
      <form onSubmit={submit} className="grid grid-cols-2 sm:grid-cols-[1fr_1fr_1.4fr_auto] gap-3 items-end">
        {(["length", "width"] as const).map((k) => (
          <label key={k} className="space-y-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <span>{k === "length" ? "Length (ft)" : "Width (ft)"}</span>
            <NumberInput
              value={inputs[k]}
              onValue={(n) => {
                set({ [k]: n } as Partial<PavingInputs>);
                setDone(false);
              }}
              className={inputCls}
            />
          </label>
        ))}
        {widget.variant === "pavers" && (
          <label className="col-span-2 sm:col-span-1 space-y-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <span>Paver size</span>
            <select className={inputCls} value={inputs.paverSize} onChange={(e) => set({ paverSize: e.target.value })}>
              {PAVER_SIZES.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
          </label>
        )}
        {widget.variant === "flagstone" && (
          <label className="col-span-2 sm:col-span-1 space-y-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <span>Method</span>
            <select className={inputCls} value={inputs.material} onChange={(e) => set({ material: e.target.value as PavingInputs["material"] })}>
              <option value="flagstone-dry">Dry-laid</option>
              <option value="flagstone-mortared">Mortared</option>
            </select>
          </label>
        )}
        {widget.variant === "compare" && <div className="hidden sm:block" />}
        <button
          type="submit"
          className="col-span-2 sm:col-span-1 rounded-pill px-5 py-2.5 text-sm font-semibold text-[#2d2a26]"
          style={{ background: "linear-gradient(135deg,#90d1bf,#9dde90)" }}
        >
          Calculate
        </button>
      </form>
      {done && (
        <div className="mt-4 rounded-xl bg-background border border-border px-4 py-3" aria-live="polite">
          <p className="text-sm font-medium text-foreground">
            {inputs.length} × {inputs.width} ft: {teaser}
          </p>
          <Link
            to={href}
            onClick={() => track("widget_handoff", { tool: widget.tool, source })}
            className="inline-block mt-2 text-sm font-semibold text-primary hover:underline"
          >
            See full breakdown →
          </Link>
        </div>
      )}
    </aside>
  );
}
