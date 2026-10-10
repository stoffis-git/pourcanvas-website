import { useState } from "react";
import { Link } from "react-router-dom";
import { DEFAULT_FINISH_INPUTS, finishParams, rankFinishes, type FinishInputs } from "@/lib/tools/finish";
import { track } from "@/lib/track";
import { toolsBySlug } from "@/content/tools";
import type { ToolWidgetRef } from "@/content/types";
import { ChipGroup, FINISH_OPTIONS } from "./FinishTool";

/** Lean finish selector: surface + climate, teaser = top pick (and the page's finish), hand-off to the full tool. */
export function FinishWidget({ widget, source }: { widget: ToolWidgetRef; source: string }) {
  const target = toolsBySlug.get(widget.tool);
  const targetDefaults: FinishInputs = { ...DEFAULT_FINISH_INPUTS, ...target?.finishDefaults };
  const [inputs, setInputs] = useState<FinishInputs>({ ...targetDefaults, ...widget.finishDefaults });
  const [done, setDone] = useState(false);
  const ranked = rankFinishes(inputs);
  const top = ranked[0];
  const focusIdx = widget.focusFinish ? ranked.findIndex((f) => f.id === widget.focusFinish) : -1;
  const focus = focusIdx >= 0 ? ranked[focusIdx] : undefined;
  const params = finishParams(inputs, targetDefaults);
  params.set("s", inputs.surface);
  params.set("c", inputs.climate);
  const href = `/tools/${widget.tool}?${params}`;

  return (
    <aside className="my-10 rounded-2xl border border-border bg-muted/30 p-5 md:p-6 space-y-4" aria-label={widget.heading}>
      <p className="text-base font-semibold text-foreground">{widget.heading}</p>
      {FINISH_OPTIONS.filter((o) => o.key === "surface" || o.key === "climate").map((o) => (
        <ChipGroup
          key={o.key}
          label={o.label}
          value={inputs[o.key]}
          options={o.options}
          onChange={(v) => {
            setInputs((p) => ({ ...p, [o.key]: v }));
            setDone(false);
          }}
        />
      ))}
      <button
        type="button"
        onClick={() => {
          setDone(true);
          track("widget_submit", { tool: widget.tool, source });
        }}
        className="rounded-pill px-5 py-2.5 text-sm font-semibold text-[#2d2a26]"
        style={{ background: "linear-gradient(135deg,#90d1bf,#9dde90)" }}
      >
        Check my project
      </button>
      {done && top && (
        <div className="rounded-xl bg-background border border-border px-4 py-3" aria-live="polite">
          {focus && focus.id !== top.id && (
            <p className="text-sm font-medium text-foreground">
              {focus.name}: {focus.avoid ? `${focus.warnings[0] ?? "not recommended here"}.` : `#${focusIdx + 1} of ${ranked.length} (${focus.score}/100).`}
            </p>
          )}
          <p className="text-sm font-medium text-foreground">
            {focus && focus.id === top.id ? `${top.name} is the top pick here` : `Top pick: ${top.name}`}
            {top.reasons[0] ? `. ${top.reasons[0]}` : ""}.
          </p>
          <Link to={href} onClick={() => track("widget_handoff", { tool: widget.tool, source })} className="inline-block mt-2 text-sm font-semibold text-primary hover:underline">
            See the full ranking →
          </Link>
        </div>
      )}
    </aside>
  );
}
