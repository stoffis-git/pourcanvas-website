// Post-build HTML assertions (see _planning/refactor-2026-10/qa-checklist.md).
// Usage: node scripts/check-pages.mjs [--verbose]
import { readdirSync, readFileSync, existsSync, writeFileSync } from "fs";
import { join, relative } from "path";

const DIST = "dist";
const verbose = process.argv.includes("--verbose");
const YEAR = new Date().getFullYear();

const files = [];
(function walk(dir) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const f = join(dir, e.name);
    if (e.isDirectory() && e.name !== "server" && e.name !== "assets") walk(f);
    else if (e.name.endsWith(".html")) files.push(f);
  }
})(DIST);

const urlOf = (f) => {
  const r = relative(DIST, f);
  return r === "index.html" ? "/" : "/" + r.replace(/\.html$/, "");
};
const pages = new Map(files.map((f) => [urlOf(f), readFileSync(f, "utf-8")]));
pages.delete("/404");

const decode = (s) => s.replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&");
const text = (h) => decode(h.replace(/<script[\s\S]*?<\/script>/g, " ").replace(/<style[\s\S]*?<\/style>/g, " ").replace(/<!--[\s\S]*?-->/g, "").replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
const all = (h, re) => [...h.matchAll(re)];
const main = (h) => (h.match(/<main[\s\S]*?<\/main>/) ?? h.match(/<body[\s\S]*<\/body>/) ?? [""])[0];

const errors = [];
const warns = [];
const fail = (u, m) => errors.push(`${u}: ${m}`);
const warn = (u, m) => warns.push(`${u}: ${m}`);

const frozenPath = "_planning/refactor-2026-10/frozen-baseline.json";
const frozen = existsSync(frozenPath) ? JSON.parse(readFileSync(frozenPath, "utf-8")) : {};

// --snapshot: re-take the FROZEN baseline after a documented change (see frozen-changes.md).
if (process.argv.includes("--snapshot")) {
  const snap = {};
  for (const u of Object.keys(frozen)) {
    const h = pages.get(u);
    if (!h) continue;
    snap[u] = {
      title: (h.match(/<title[^>]*>([\s\S]*?)<\/title>/) ?? [])[1]?.trim(),
      meta: (h.match(/<meta[^>]*name="description"[^>]*content="([^"]*)"/) ?? [])[1],
      canonical: (h.match(/<link[^>]*rel="canonical"[^>]*href="([^"]*)"/) ?? [])[1],
      h1: (h.match(/<h1[^>]*>([\s\S]*?)<\/h1>/) ?? [])[1]?.trim(),
      h2: [...h.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/g)].map((x) => x[1].replace(/<[^>]+>/g, "").trim()),
    };
  }
  writeFileSync(frozenPath, JSON.stringify(snap, null, 1));
  console.log(`[check-pages] baseline re-snapshotted for ${Object.keys(snap).length} FROZEN pages`);
  process.exit(0);
}

for (const [u, h] of pages) {
  const titles = all(h, /<title[^>]*>([\s\S]*?)<\/title>/g);
  if (titles.length !== 1) fail(u, `title count ${titles.length}`);
  const metas = all(h, /<meta[^>]*name="description"[^>]*content="([^"]*)"/g);
  if (metas.length !== 1) fail(u, `meta description count ${metas.length}`);
  const canon = all(h, /<link[^>]*rel="canonical"[^>]*href="([^"]*)"/g);
  if (canon.length > 1) fail(u, "multiple canonicals");
  if (canon[0] && canon[0][1].includes("?")) fail(u, "canonical has query params");
  const h1 = all(h, /<h1[\s>]/g).length;
  if (h1 !== 1) fail(u, `h1 count ${h1}`);

  const ld = all(h, /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g).map((m) => {
    try {
      return JSON.parse(m[1]);
    } catch {
      fail(u, "invalid JSON-LD");
      return {};
    }
  });
  const types = ld.map((o) => o["@type"]);
  const bc = types.filter((t) => t === "BreadcrumbList").length;
  if (bc > 1) fail(u, `BreadcrumbList count ${bc}`);
  const faq = ld.find((o) => o["@type"] === "FAQPage");
  if (faq) {
    const body = decode(text(main(h)));
    for (const q of faq.mainEntity) {
      const snippet = decode(q.acceptedAnswer.text).replace(/\s+/g, " ").slice(0, 60);
      if (!body.includes(snippet)) fail(u, `FAQ answer not in HTML: "${snippet}"`);
    }
  }
  const t = titles[0]?.[1] ?? "";
  const m = metas[0]?.[1] ?? "";
  for (const y of [YEAR - 1, YEAR - 2]) if (u.startsWith("/tools") && (t + m).includes(String(y))) fail(u, `stale year ${y} in title/meta`);

  const hrefs = all(main(h) + (h.match(/<footer[\s\S]*?<\/footer>/) ?? [""])[0], /href="(\/[^"#?]*)/g).map((x) => x[1].replace(/\/$/, "") || "/");
  for (const href of new Set(hrefs)) {
    if (/\.(xml|png|jpe?g|webp|svg|ico|txt)$/.test(href) || href.startsWith("/api")) continue;
    if (!pages.has(href)) fail(u, `broken internal link ${href}`);
  }

  if (u.startsWith("/tools/")) {
    if (!types.includes("SoftwareApplication")) fail(u, "missing SoftwareApplication");
    if (m.length < 140 || m.length > 160) warn(u, `meta length ${m.length}`);
    if (t.length > 65) warn(u, `title length ${t.length}`);
    const mh = main(h);
    const intro = (mh.match(/<\/h1>\s*<p[^>]*>([\s\S]*?)<\/p>/) ?? [])[1] ?? "";
    const iw = text(intro).split(" ").length;
    if (iw < 40 || iw > 65) warn(u, `intro ${iw} words`);
    if (!/\d/.test(intro)) fail(u, "intro has no number");
    const h2 = all(mh, /<h2[\s>]/g).length;
    // +2 for the tool's "Your project" panel and the FAQ heading
    if (h2 < 9 || h2 > 15) warn(u, `h2 count ${h2}`);
    const words = text(mh).split(" ").length;
    // includes the tool UI text (~400–500 words)
    if (words < 1400 || words > 2300) warn(u, `main words ${words}`);
    const links = all(mh, /<a [^>]*href="\//g).length;
    if (links < 20 || links > 45) warn(u, `internal links in main ${links}`);
    if (!/Last updated/.test(mh)) fail(u, "no Last updated");
    if (verbose) console.log(`${u}  words=${words} h2=${h2} links=${links} intro=${iw} meta=${m.length} title=${t.length}`);
  }

  const f = frozen[u];
  if (f) {
    const cur = {
      title: t.trim(),
      meta: m,
      canonical: canon[0]?.[1],
      h1: (h.match(/<h1[^>]*>([\s\S]*?)<\/h1>/) ?? [])[1]?.trim(),
      h2: all(h, /<h2[^>]*>([\s\S]*?)<\/h2>/g).map((x) => x[1].replace(/<[^>]+>/g, "").trim()),
    };
    for (const k of ["title", "meta", "canonical", "h1"]) if (cur[k] !== f[k]) fail(u, `FROZEN ${k} changed`);
    // Baseline headings must all still appear, in the same relative order (new sections may be added after content sections).
    let k = 0;
    for (const x of cur.h2) if (k < f.h2.length && x === f.h2[k]) k++;
    const prefixOk = k === f.h2.length;
    if (!prefixOk) fail(u, "FROZEN h2 order changed (new sections must be appended)");
  }
}

// sitemaps
const idx = existsSync(join(DIST, "sitemap.xml")) ? readFileSync(join(DIST, "sitemap.xml"), "utf-8") : "";
if (!idx.includes("<sitemapindex")) errors.push("sitemap.xml is not an index");
const childLocs = all(idx, /<loc>https:\/\/pourcanvas\.com\/([^<]+)<\/loc>/g).map((x) => x[1]);
let count = 0;
for (const c of childLocs) count += all(readFileSync(join(DIST, c), "utf-8"), /<url>/g).length;
if (count !== pages.size) errors.push(`sitemap URL count ${count} != pages ${pages.size}`);

for (const w of warns) console.log("WARN ", w);
for (const e of errors) console.log("FAIL ", e);
console.log(`[check-pages] ${pages.size} pages, ${errors.length} failures, ${warns.length} warnings`);
process.exit(errors.length ? 1 : 0);
