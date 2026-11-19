// Phase 4 browser check: node _planning/tools-2026-11/stamped-concrete-vs-pavers-cost-calculator/browser-check.mjs [baseUrl]
import { chromium } from "playwright";

const base = process.argv[2] ?? "http://localhost:4317";
const url = `${base}/tools/stamped-concrete-vs-pavers-cost-calculator`;
const out = [];
const ok = (name, cond, extra = "") => out.push(`${cond ? "PASS" : "FAIL"} ${name}${extra ? ` (${extra})` : ""}`);

// Optional: CHROME_PATH=/path/to/chrome-headless-shell when the bundled browser version is not installed.
const browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {});
for (const width of [375, 1280]) {
  const ctx = await browser.newContext({ viewport: { width, height: 900 }, permissions: ["clipboard-read", "clipboard-write"] });
  const page = await ctx.newPage();
  const errors = [];
  // Resource failures are reported via "response" so analytics rejecting localhost (umami 400) can be ignored.
  page.on("console", (m) => m.type() === "error" && !m.text().startsWith("Failed to load resource") && errors.push(m.text()));
  page.on("response", (r) => r.status() >= 400 && !r.url().includes("umami") && errors.push(`HTTP ${r.status()} ${r.url()}`));
  page.on("pageerror", (e) => errors.push(String(e)));
  await page.goto(url, { waitUntil: "networkidle" });
  const primary = page.getByTestId("primary-result");
  const before = await primary.textContent();
  ok(`${width}px default result`, before === "$3,600–5,400", before);

  await page.fill("#svp-length", "20");
  await page.selectOption("#svp-use", "driveway");
  await page.selectOption("#svp-design", "basic");
  await page.selectOption("#svp-climate", "mild");
  await page.selectOption("#svp-years", "30");
  await page.waitForTimeout(300);
  const after = await primary.textContent();
  ok(`${width}px result updates`, after !== before, after);
  const qs = new URL(page.url()).searchParams;
  ok(`${width}px URL params`, qs.get("l") === "20" && qs.get("u") === "driveway" && qs.get("sd") === "basic" && qs.get("cl") === "mild" && qs.get("y") === "30", page.url());
  const verdict = await page.getByTestId("verdict").textContent();
  await page.reload({ waitUntil: "networkidle" });
  ok(`${width}px reload restores`, (await primary.textContent()) === after && (await page.inputValue("#svp-design")) === "basic", await primary.textContent());
  ok(`${width}px verdict restored`, (await page.getByTestId("verdict").textContent()) === verdict);

  await page.getByRole("button", { name: "Copy result" }).click();
  await page.waitForTimeout(200);
  const clip = await page.evaluate(() => navigator.clipboard.readText()).catch(() => "");
  ok(`${width}px copy`, clip.includes("Calculated with PourCanvas.com") && clip.includes("STAMPED CONCRETE VS PAVERS"), clip.split("\n")[0]);

  await page.getByRole("button", { name: "Metric" }).click();
  await page.waitForTimeout(100);
  ok(`${width}px metric`, (await page.inputValue("#svp-length")) === "6.1", await page.inputValue("#svp-length"));
  await page.getByRole("button", { name: "Copy result" }).click();
  await page.waitForTimeout(200);
  const clipM = await page.evaluate(() => navigator.clipboard.readText()).catch(() => "");
  ok(`${width}px copy uses metric units`, /6\.1 x 6\.1 m = .* m²/.test(clipM) && clipM.includes("/m²"), clipM.split("\n")[1]);
  const assumptions = await page.getByTestId("assumptions").textContent();
  ok(`${width}px assumptions line`, /Assumes pro upkeep/.test(assumptions ?? "") && /one crack repair every 15/.test(assumptions ?? ""), assumptions); // mild + 30 yrs: 2 repairs counted

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  ok(`${width}px no horizontal overflow`, overflow <= 0, `overflow ${overflow}px`);
  const wideTables = await page.evaluate(() =>
    [...document.querySelectorAll("main table")].filter((t) => t.getBoundingClientRect().right > window.innerWidth + 1).length,
  );
  ok(`${width}px tables fit`, wideTables === 0, `${wideTables} wider than viewport`);
  ok(`${width}px no console errors`, errors.length === 0, errors.join(" | ").slice(0, 300));
  await page.screenshot({ path: `/tmp/svp-${width}.png`, fullPage: false });
  await ctx.close();
}
await browser.close();
console.log(out.join("\n"));
