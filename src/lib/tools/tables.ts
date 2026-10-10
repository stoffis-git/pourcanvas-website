// HTML tables for tool-page body content, computed from the engine so copy and tool never disagree.
import { calculatePaving, DEFAULT_INPUTS, type PavingInputs } from "./paving";
import { INSTALLED, MATERIAL_LABELS, REGION_LABELS, REGION_MULTIPLIER, type AnyMaterial, type Region } from "./data/paving";
import { moneyRange, num, perSqftRange, tons } from "@/lib/format";

type Size = [number, number];

const table = (head: string[], rows: string[][]) =>
  `<table><thead><tr>${head.map((h) => `<th>${h}</th>`).join("")}</tr></thead><tbody>${rows
    .map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join("")}</tr>`)
    .join("")}</tbody></table>`;

const run = (over: Partial<PavingInputs>) => calculatePaving({ ...DEFAULT_INPUTS, ...over });

/** Installed cost by project size for one material. */
export function costBySize(sizes: Size[], over: Partial<PavingInputs> = {}) {
  return table(
    ["Size", "Area", "Installed cost"],
    sizes.map(([l, w]) => {
      const r = run({ ...over, length: l, width: w });
      return [`${l} × ${w} ft`, `${num(r.area)} sq ft`, moneyRange(r.pro)];
    }),
  );
}

/** Installed cost per sq ft + total for a size, several materials. */
export function materialComparison(materials: AnyMaterial[], [l, w]: Size, over: Partial<PavingInputs> = {}) {
  const r = run({ ...over, length: l, width: w });
  const rows = r.compare.filter((c) => materials.includes(c.material));
  return table(
    ["Material", "Installed per sq ft", `${l} × ${w} ft total`],
    rows.map((c) => [c.label, perSqftRange(c.perSqft), moneyRange(c.total)]),
  );
}

/** Installed per-sq-ft ranges for materials (national, patio). */
export function perSqftTable(materials: AnyMaterial[]) {
  return table(
    ["Material", "Low", "Typical", "High"],
    materials.map((m) => [MATERIAL_LABELS[m], `$${INSTALLED[m].low}`, `$${INSTALLED[m].typical}`, `$${INSTALLED[m].high}`]),
  );
}

/** Regional variation for one size. */
export function regionTable([l, w]: Size, over: Partial<PavingInputs> = {}) {
  return table(
    ["Region", "Multiplier", `${l} × ${w} ft installed`],
    (Object.keys(REGION_LABELS) as Region[]).map((rg) => {
      const r = run({ ...over, length: l, width: w, region: rg });
      return [REGION_LABELS[rg], `×${REGION_MULTIPLIER[rg].value.toFixed(2)}`, moneyRange(r.pro)];
    }),
  );
}

/** Materials vs labor split for sizes. */
export function laborSplit(sizes: Size[], over: Partial<PavingInputs> = {}) {
  return table(
    ["Size", "Materials (DIY)", "Labor (est.)", "Installed total"],
    sizes.map(([l, w]) => {
      const r = run({ ...over, length: l, width: w });
      return [`${l} × ${w} ft`, moneyRange(r.materials), moneyRange(r.labor), moneyRange(r.pro)];
    }),
  );
}

/** Quantity takeoff by size. */
export function quantityBySize(
  kind: "pavers" | "base" | "sand" | "poly" | "flagstone" | "takeoff",
  sizes: Size[],
  over: Partial<PavingInputs> = {},
) {
  const rows = sizes.map(([l, w]) => {
    const r = run({ ...over, length: l, width: w });
    const size = `${l} × ${w} ft`;
    switch (kind) {
      case "pavers":
        return [size, `${num(r.area)} sq ft`, num(r.paverCount)];
      case "base":
        return [size, `${num(r.baseYd3, 2)} yd³`, tons(r.baseTons), `${num(r.baseBags)} bags`];
      case "sand":
        return [size, `${num(r.sandYd3, 2)} yd³`, tons(r.sandTons), `${num(r.sandBags)} bags`];
      case "poly":
        return [size, `${num(r.area)} sq ft`, `${num(r.polyBags)} bags`];
      case "flagstone":
        return [size, `${num(r.area)} sq ft`, tons(r.flagstoneTons), moneyRange(r.pro)];
      case "takeoff":
        return [size, num(r.paverCount), `${num(r.baseTons, 1)} t`, `${num(r.sandTons, 1)} t`, num(r.polyBags), `${num(r.edgeLF)} ft`];
    }
  });
  const head = {
    pavers: ["Size", "Area", "Pavers needed"],
    base: ["Size", "Base volume", "Base weight", "0.5 cu ft bags"],
    sand: ["Size", "Sand volume", "Sand weight", "0.5 cu ft bags"],
    poly: ["Size", "Area", "50 lb bags"],
    flagstone: ["Size", "Area", "Flagstone", "Installed cost"],
    takeoff: ["Size", "Pavers", "Base", "Sand", "Poly bags", "Edging"],
  }[kind];
  return table(head, rows);
}
