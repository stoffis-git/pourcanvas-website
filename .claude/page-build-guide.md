# PourCanvas Page Build Guide (MANDATORY for every new or rebuilt page)

Derived 2026-10-10 from the page anatomy of slabcalc.co (`/Users/stoffi/Documents/slabcalc.co/slabcalc APP/`), which ranks top-10 on ~100 calculator pages. Calculator pages there earn ~10x the clicks of guide pages (188 vs 18 clicks/page), and 77% of its clicks come from queries with an input-dependent answer that never say "calculator". Pure content gets absorbed by AI answers (slabcalc measured ~4,900 AI citations per referred visit). Therefore:

## 0. Non-negotiable principles

1. **Tool first.** Every money page is built around an interactive tool that answers a question whose answer depends on the user's inputs (size, surface, climate, current state, budget, look). Content wraps the tool; it never replaces it. Pure-content pages are support assets (internal links, image search, hubs), not primary traffic bets.
2. **Pick the query, not the tool.** Target queries where the answer changes with inputs ("is flagstone cheaper than concrete", "best finish for a pool deck", "paver patio cost") even if no one types "calculator". Validate demand (Keyword Planner US/EN + GSC) before building.
3. **Stay out of slabcalc's lane.** Concrete cost/volume/quantity/crack tools belong to slabcalc.co; pourcanvas links out to the matching slabcalc calculator instead of duplicating it. Pourcanvas owns decorative decisions (color, finish, pattern, material choice, look) and non-concrete paving (pavers, flagstone).
4. **One template per page type, one config file per page.** No hand-built one-off pages.
5. **Everything that matters is in the prerendered HTML.** Default tool result, FAQ answers, tables — all present without JS/clicks.
6. **Change winners only with data.** Pages on page 1 or with top traffic ("FROZEN" in `url-inventory.csv`) may be improved, including title, meta, intro and H1, when GSC and keyword data show clear room (low CTR at a good position, a dead or shifted primary query, outdated or wrong numbers). Rules: keep the query the page currently ranks for in the title (front-loaded), never change the URL, record the reason and the before/after in `_planning/refactor-2026-10/frozen-changes.md`, re-snapshot the baseline, and re-check GSC 2–4 weeks later. Without such evidence: additive changes only. (User decision 2026-10-10.)

## 1. URL & routing

- Tools: `/tools/{topic}` or keyword-shaped `/tools/{topic}-calculator`, `/tools/{topic}-cost-calculator`, `/tools/{a}-vs-{b}`. Decide the scheme once and keep it; never rename a live URL.
- Route = one template component fed by a slug list from config files (like `src/content/*`), registered in `staticPaths`/`dynamicPaths` so `scripts/prerender.mjs` prerenders it, and added to `scripts/generate-sitemap.mjs` with `lastmod = lastUpdated` (and images).
- Every new route must appear in: sitemap, its hub page, the header/footer nav (if a hub), and ≥3 contextual links from already-indexed pages (check `_data/gsc/<date>/api/url_inspection.csv`).

## 2. Tool page anatomy (top to bottom, exact order)

1. **BreadcrumbList JSON-LD + visible breadcrumbs**: `Home / Tools / {Title}` (or `Home / {Hub} / {Title}`). Emit breadcrumb schema once only.
2. **H1** = plain "{Topic} Calculator" / "{A} vs {B}: Which Is Right for You?" — no numbers in H1.
3. **Intro, 40–60 words — the ONLY text above the tool.** Answer-first, with concrete numbers and a worked example, then an instruction line. Pattern: "As of {YEAR}, {direct answer with range}. A {typical example} runs/needs {result}; a {second example} {result}. Enter your {inputs} to get {output}."
4. **"Last updated: {Month D, YYYY}"** (from config `lastUpdated`, also feeds `dateModified` + sitemap lastmod).
5. **The tool**, immediately after the intro. Two columns on desktop, stacked on mobile:
   - Left: inputs (sensible defaults matching the head query), unit toggle (imperial/metric) where relevant, mobile "Calculate" button that scrolls to results, then **"Pro Tips"** (H3, ~5 one-liners from config).
   - Right: primary result card first (big headline answer), then secondary breakdowns, then a single CTA, then a **"Copy result"** button (plain-text summary ending "Calculated with PourCanvas.com").
   - Default inputs must produce a real result in the SSR HTML.
   - Footer line under the result naming the data basis ("Based on {YEAR} U.S. national pricing / {source}").
6. **Contextual guide sentence**: "For the full background, read our [Guide 1] and [Guide 2]." (from `relatedGuides[0..1]`).
7. **Body content, 1,000–1,700 words, 7–13 H2s.** Each H2 targets one keyword variant, 100–200 words, specific numbers, and a markdown table in almost every H2. Typical H2 set: "{Topic} by Size", "by Region/Climate", "{A} vs {B}", "What Affects {X}", "Maintenance / Lifetime", "DIY vs Contractor", "Common Mistakes". 3–20 inline contextual links (sibling tools, guides, slabcalc for concrete cost/volume).
8. **FAQ section** (H2 "Frequently Asked Questions"), 5–9 Q&As. Answers MUST be in the SSR HTML (use `<details>/<summary>` or render all answers; the current `src/components/FAQSection.tsx` only renders the open answer — fix before relying on it). Optional inline mini-tool inside an answer.
9. **Related block**: two columns, H3 "Related Tools" (6–8) and H3 "Related Guides" (5–7), anchors = real page titles.

Targets per tool page: ~1,400–1,800 words in `<main>`, 25–35 internal links in `<main>`, 40–50 unique sitewide.

## 3. Title / meta / headings

- **Title** (no site-name suffix): contains the keyword, the year for cost/price pages, and a number. Patterns:
  - `{Topic} Cost ({YEAR}): $X–Y per Sq Ft + Calculator`
  - `{Topic} Calculator: {worked example result}`
  - `{A} vs {B} ({YEAR}): Cost, Look & Lifespan Compared`
- **Meta description** 140–160 chars, starts with the question or the answer, must contain a number and 1–2 size/situation examples.
- **H2s** = keyword-variant phrases. Pro Tips and Related are H3.
- Never hard-code the year in strings; derive it from one constant.

## 4. Structured data (via `SeoHead`)

- Tool pages: `SoftwareApplication` {name, description=meta, url, applicationCategory "UtilitiesApplication", operatingSystem "Web", dateModified, offers {price "0", priceCurrency "USD"}} + `FAQPage` + `BreadcrumbList`.
- Guide pages: `Article` (headline, description, image[], datePublished, dateModified, publisher) + `ImageObject` graph (CC BY 4.0, creditText, acquireLicensePage — already in SeoHead) + `FAQPage` + `HowTo` when there are steps + `BreadcrumbList`.
- Hubs: `ItemList` of children.

## 5. Config schema (one file per page)

```ts
{
  slug, title, metaTitle, metaDescription, h1, intro,
  defaults: { /* tool inputs matching the head query */ },
  tips: string[],                       // Pro Tips, ~5
  faqs: { question, answer, miniTool?: {...} }[],
  relatedTools: string[], relatedGuides: string[],
  slabcalcLinks?: { label, url }[],     // hand-off for concrete cost/volume
  dataBasis: string,                    // "Based on 2026 U.S. national pricing (sources: …)"
  component?: string,                   // bespoke tool from a TOOL_COMPONENTS map
  bodyContent: string,                  // markdown with GFM tables
  datePublished, lastUpdated
}
```

## 6. Guide page anatomy (support pages)

Breadcrumbs → H1 (question form: "Does Black Concrete Fade? (By Climate & Method)") → answer-first intro with bold key numbers → Last updated → first paragraph links the primary tool → H2s each with a table, figures/images → "Key Takeaways" bullets → FAQ (SSR answers) → CTA box to the primary tool → Related Tools / Related Guides. Guides may embed the tool inline. Append new sections at the end; never reorder.

## 7. Authority, freshness, citation

- Year in title/intro ("As of {YEAR}"), visible Last updated, bump `lastUpdated` on real edits.
- Cite standards/sources inline (ACI, PCA, NRMCA, manufacturer data, LBNL/EPA cool-pavement data) and keep a `/methodology` page; every number on a page must be traceable.
- Branded, quotable lines in FAQ answers: "According to PourCanvas, …" with a specific number.
- Precomputed tables (by size, by climate, by material) — they feed snippets and AI answers, but the tool is what earns the click.

## 8. Link-earning packaging (every tool)

- Default-prefill via URL params (`?width=&length=&material=`); additionally write state back to the URL so results are shareable (slabcalc lacks this — do better).
- Embeddable widget (`<div class="pourcanvas-widget" data-tool="…">` + script) with "Powered by PourCanvas" attribution.
- Optional: printable/downloadable result, CSV data for research assets.

## 9. Embedded lean widget → full tool (for existing/ranking pages)

Use this to add a tool to pages that already rank (an additive block) while the full tool lives on its own URL.

- **Placement:** a compact widget block directly below the page's intro.
- **Lean inputs:** 2–3 essential inputs only (e.g. length, width, material), defaults matching the page topic.
- **Inline teaser result:** on submit, show ONE headline result in the widget (e.g. "Pavers: ~$4,200–6,800 for your 12×16 patio") — never a pure redirect without an answer.
- **Hand-off CTA:** "See full breakdown →" links to the full tool page with inputs as URL params (`/tools/{slug}?l=12&w=16&material=pavers`). Opens in the SAME tab (no `target="_blank"`) so the back button returns to the article.
- **Full tool page** reads the params, prefills, and shows the full result; its canonical is always the bare URL (no params).
- **No cannibalization:** the host page keeps its own intent (e.g. comparison/guide); the tool page targets calculator/cost intent. The widget is a small client component and adds no keyword-bearing copy to the host page.
- **Tracking:** fire an event on widget submit and on hand-off click to measure the forward rate.

## 10. Checklist before shipping a page

- [ ] Query validated (KP volume + GSC), input-dependent answer, not in slabcalc's lane
- [ ] Config file complete; route prerendered; default result + FAQ answers visible in `dist/**.html`
- [ ] Title/meta/H1 follow §3; JSON-LD per §4 validates (one BreadcrumbList)
- [ ] Intro 40–60 words, answer-first with numbers; tool directly under it
- [ ] 7–13 H2s with tables, 1,000–1,700 words, 25–35 internal links in main, slabcalc hand-off where cost/volume comes up
- [ ] In sitemap with lastmod; linked from hub + ≥3 indexed pages
- [ ] FROZEN page changes only with documented data justification (frozen-changes.md); URL never changes
