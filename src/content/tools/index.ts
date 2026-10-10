import type { ToolConfig } from "../types";
import { paverPatioCostCalculator } from "./paver-patio-cost-calculator";
import { paverInstallationCostCalculator } from "./paver-installation-cost-calculator";
import { patioCostCalculator } from "./patio-cost-calculator";
import { paverWalkwayCostCalculator } from "./paver-walkway-cost-calculator";
import { paverCalculator } from "./paver-calculator";
import { paverBaseCalculator } from "./paver-base-calculator";
import { paverSandCalculator } from "./paver-sand-calculator";
import { polymericSandCalculator } from "./polymeric-sand-calculator";
import { flagstoneCalculator } from "./flagstone-calculator";
import { paverDrivewayCostCalculator } from "./paver-driveway-cost-calculator";
import { concreteFinishSelector } from "./concrete-finish-selector";
import { poolDeckFinishSelector } from "./pool-deck-finish-selector";
import { drivewayFinishSelector } from "./driveway-finish-selector";

export const toolPages: ToolConfig[] = [
  paverPatioCostCalculator,
  paverInstallationCostCalculator,
  patioCostCalculator,
  paverCalculator,
  paverBaseCalculator,
  paverSandCalculator,
  polymericSandCalculator,
  flagstoneCalculator,
  paverWalkwayCostCalculator,
  paverDrivewayCostCalculator,
  concreteFinishSelector,
  poolDeckFinishSelector,
  drivewayFinishSelector,
];

export const toolsBySlug = new Map<string, ToolConfig>(toolPages.map((t) => [t.slug, t]));

export const TOOL_CATEGORIES: { id: ToolConfig["category"]; title: string; blurb: string }[] = [
  { id: "paving", title: "Paving calculators", blurb: "Pavers, flagstone, base, sand and installed cost — quantities and prices in one result." },
  { id: "finish", title: "Finish & design tools", blurb: "Pick the right concrete finish for your surface, climate and priorities." },
];
