import type { MaterialPage } from "../types";
import { stampedConcretePage } from "./stamped-concrete";
import { exposedAggregatePage } from "./exposed-aggregate";
import { broomFinishPage } from "./broom-finish";
import { coloredConcretePage } from "./colored-concrete";
import { concretePagersPage } from "./concrete-pavers";
import { flagstonePage } from "./flagstone";
import { travertinePage } from "./travertine";
import { polishedConcretePage } from "./polished-concrete";
import { concreteOverlayPage } from "./concrete-overlay";
import { saltFinishPage } from "./salt-finish";

export {
  stampedConcretePage,
  exposedAggregatePage,
  broomFinishPage,
  coloredConcretePage,
  concretePagersPage,
  flagstonePage,
  travertinePage,
  polishedConcretePage,
  concreteOverlayPage,
  saltFinishPage,
};

export const allMaterialPages: MaterialPage[] = [
  stampedConcretePage,
  exposedAggregatePage,
  broomFinishPage,
  coloredConcretePage,
  concretePagersPage,
  flagstonePage,
  travertinePage,
  polishedConcretePage,
  concreteOverlayPage,
  saltFinishPage,
];

export const materialsBySlug = new Map<string, MaterialPage>(
  allMaterialPages.map((m) => [m.slug, m])
);
