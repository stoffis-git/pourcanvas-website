// HTML tables for finish-selector content, computed from the scoring data so copy and tool never disagree.
import { FINISHES } from "./data/finish";
import { CRITERION_LABELS, rankFinishes, type FinishInputs } from "./finish";
import { DEFAULT_FINISH_INPUTS } from "./finish";

const table = (head: string[], rows: string[][]) =>
  `<table><thead><tr>${head.map((h) => `<th>${h}</th>`).join("")}</tr></thead><tbody>${rows
    .map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join("")}</tr>`)
    .join("")}</tbody></table>`;

const dots = (n: number) => `${n}/5`;

/** Finish × criterion score matrix (1–5, higher is better). */
export function scoreMatrix() {
  return table(
    ["Finish", CRITERION_LABELS.slip, CRITERION_LABELS.freezeThaw, CRITERION_LABELS.heat, CRITERION_LABELS.upkeep, CRITERION_LABELS.cost],
    FINISHES.map((f) => [f.name, dots(f.scores.slip), dots(f.scores.freezeThaw), dots(f.scores.heat), dots(f.scores.upkeep), dots(f.scores.cost)]),
  );
}

/** Ranking for one scenario, with the top reason or warning per finish. */
export function rankingTable(over: Partial<FinishInputs>) {
  const r = rankFinishes({ ...DEFAULT_FINISH_INPUTS, ...over });
  return table(
    ["Rank", "Finish", "Score", "Why"],
    r.map((f, i) => [String(i + 1), f.name, f.avoid ? "Avoid" : `${f.score}/100`, f.avoid ? f.warnings[0] ?? "" : f.reasons[0] ?? f.warnings[0] ?? ""]),
  );
}

/** One criterion explained across finishes, using the sourced notes. */
export function criterionTable(c: "slip" | "freezeThaw" | "heat" | "upkeep" | "cost") {
  return table(["Finish", CRITERION_LABELS[c], "Why"], FINISHES.map((f) => [f.name, dots(f.scores[c]), f.notes[c]]));
}
