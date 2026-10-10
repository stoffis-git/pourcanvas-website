import type { Pillar } from "../types";

/** Most relevant tools per project type (landing pages, article fallbacks). */
export const PILLAR_TOOLS: Record<Pillar, string[]> = {
  patio: ["paver-patio-cost-calculator", "patio-cost-calculator", "paver-calculator", "concrete-finish-selector"],
  walkway: ["paver-walkway-cost-calculator", "flagstone-calculator", "paver-calculator", "concrete-finish-selector"],
  driveway: ["paver-driveway-cost-calculator", "driveway-finish-selector", "paver-base-calculator", "paver-calculator"],
};
