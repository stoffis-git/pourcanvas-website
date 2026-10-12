import type { Pillar, ToolWidgetRef } from "../types";
import type { FinishId } from "@/lib/tools/data/finish";
import type { Surface } from "@/lib/tools/finish";

const SURFACE_LABEL: Record<Surface, string> = { patio: "patio", driveway: "driveway", walkway: "walkway", "pool-deck": "pool deck" };

/** Finish named in the slug (first match wins); stamped covers the brick/stone/wood patterns. */
const FINISH_KEYWORDS: [RegExp, FinishId, string][] = [
  [/stamped|cobblestone|herringbone|brick|wood-plank|ashlar|travertine/, "stamped", "stamped concrete"],
  [/salt/, "salt", "a salt finish"],
  [/aggregate/, "exposed-aggregate", "exposed aggregate"],
  [/broom|brushed/, "broom", "a broom finish"],
];

/**
 * Lean widget for image-led pages (inspiration, palette, before/after, articles without one),
 * picked from the slug: real flagstone → flagstone calculator, otherwise the finish selector
 * for the surface, focused on the finish the page shows.
 */
export function widgetForSlug(slug: string, pillar?: Pillar): ToolWidgetRef {
  const surface: Surface = slug.includes("pool")
    ? "pool-deck"
    : (pillar ??
      (slug.includes("driveway") ? "driveway" : /walkway|path|steps|entry/.test(slug) ? "walkway" : "patio"));
  const label = SURFACE_LABEL[surface];

  if (slug.includes("flagstone") && !slug.includes("stamped") && surface !== "driveway") {
    return {
      tool: "flagstone-calculator",
      variant: "flagstone",
      heading: `How much flagstone does your ${label} need?`,
      defaults: surface === "walkway" ? { length: 30, width: 4 } : undefined,
    };
  }

  const tool = surface === "pool-deck" ? "pool-deck-finish-selector" : surface === "driveway" ? "driveway-finish-selector" : "concrete-finish-selector";
  const finish = FINISH_KEYWORDS.find(([re]) => re.test(slug));
  return {
    tool,
    variant: "finish",
    heading: finish ? `Is ${finish[2]} right for your ${label}?` : `Which concrete finish suits your ${label}?`,
    finishDefaults: { surface },
    focusFinish: finish?.[1],
  };
}
