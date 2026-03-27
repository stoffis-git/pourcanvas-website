import type { MaterialPage } from "../types";
import { stampedConcretePage } from "./stamped-concrete";
import { exposedAggregatePage } from "./exposed-aggregate";
import { broomFinishPage } from "./broom-finish";
import { coloredConcretePage } from "./colored-concrete";

export { stampedConcretePage, exposedAggregatePage, broomFinishPage, coloredConcretePage };

export const allMaterialPages: MaterialPage[] = [
  stampedConcretePage,
  exposedAggregatePage,
  broomFinishPage,
  coloredConcretePage,
];

export const materialsBySlug = new Map<string, MaterialPage>(
  allMaterialPages.map((m) => [m.slug, m])
);
