import type { Range } from "@/lib/tools/data/paving";

const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

/** $1,234 */
export const money = (n: number) => usd.format(Math.round(n));

/** Rounded to a "quote-like" figure: <1k → nearest 10, <10k → nearest 50, else nearest 100. */
export const roundCost = (n: number) => (n < 1000 ? Math.round(n / 10) * 10 : n < 10000 ? Math.round(n / 50) * 50 : Math.round(n / 100) * 100);

/** $1,900–4,200 */
export const moneyRange = (r: Range) => `${money(roundCost(r.low))}–${money(roundCost(r.high)).replace("$", "")}`;

/** $10–22 */
export const perSqftRange = (r: Range) => `$${trim(Math.round(r.low))}–${trim(Math.round(r.high))}`;

const trim = (n: number) => (Number.isInteger(n) ? String(n) : n.toFixed(2).replace(/0$/, ""));

export const num = (n: number, d = 0) => n.toLocaleString("en-US", { maximumFractionDigits: d, minimumFractionDigits: 0 });

/** "1 ton" / "2.1 tons" */
export const tons = (n: number, d = 1) => `${num(n, d)} ${num(n, d) === "1" ? "ton" : "tons"}`;
