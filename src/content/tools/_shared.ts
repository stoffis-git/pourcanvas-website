import { calculatePaving, DEFAULT_INPUTS, type PavingInputs } from "@/lib/tools/paving";

/** Engine result for a config's defaults — use it for every number in intro/meta/FAQs. */
export const pavingAt = (over: Partial<PavingInputs> = {}) => calculatePaving({ ...DEFAULT_INPUTS, ...over });

export const SLABCALC = {
  patioCost: "https://www.slabcalc.co/calculators/concrete-patio-cost-calculator",
  stampedCost: "https://www.slabcalc.co/calculators/stamped-concrete-cost-calculator",
  driveCost: "https://www.slabcalc.co/calculators/concrete-driveway-cost-calculator",
  slab: "https://www.slabcalc.co/calculators/concrete-slab-calculator",
  poolDeckCost: "https://www.slabcalc.co/calculators/concrete-pool-deck-cost-calculator",
};

/** Internal link helper for HTML section bodies. */
export const a = (href: string, text: string) => `<a href="${href}">${text}</a>`;
