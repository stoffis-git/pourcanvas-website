import { DEFAULT_INPUTS, paramsFromInputs, type PavingInputs } from "./paving";

/** Rewrite only the tool's own params; keep utm_*, gclid etc. and the hash. */
export function replaceToolParams(ownKeys: string[], next: URLSearchParams) {
  const current = new URLSearchParams(window.location.search);
  for (const k of ownKeys) current.delete(k);
  next.forEach((v, k) => current.set(k, v));
  const qs = current.toString();
  window.history.replaceState(window.history.state, "", `${window.location.pathname}${qs ? `?${qs}` : ""}${window.location.hash}`);
}

export const PAVING_PARAM_KEYS = ["l", "w", "m", "ps", "pt", "c", "u", "s", "j", "e", "r", "rg", "t"];
export const FINISH_PARAM_KEYS = ["s", "c", "p", "st"];

/** Params to carry a project into another paving tool: size, material and use always, plus anything non-default. */
export function carryParams(inputs: PavingInputs, override: Partial<PavingInputs> = {}) {
  const merged = { ...inputs, ...override };
  const p = paramsFromInputs(merged, DEFAULT_INPUTS);
  p.set("l", String(merged.length));
  p.set("w", String(merged.width));
  p.set("m", merged.material);
  p.set("u", merged.use);
  return p;
}
