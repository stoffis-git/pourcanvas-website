# Tool Page Build Process (2026-11, reusable for every new tool)

Used for tools 1–2 (built 2026-11-19) and for the scheduled tools 3–6 (`schedule.md`). One agent builds one tool end to end in its own git worktree. Afterwards an independent QA agent and the main session review it.

## Binding rules
- `.claude/page-build-guide.md` (anatomy, title/meta, JSON-LD, config schema, checklist §10).
- `_planning/refactor-2026-10/content-brief-tools.md` (hard rules for numbers, year, title/meta/intro lengths, links, verification). Where it says "10 tool slugs", read "all slugs in `src/content/tools/index.ts`".
- Reference implementations: `src/content/tools/paver-patio-cost-calculator.ts` (config), `src/lib/tools/paving.ts` + `data/paving.ts` (engine + sourced data), `src/components/tools/PavingTool.tsx` (UI), `src/lib/tools/paving.test.ts` (tests), `src/lib/tools/url.ts` (URL params).
- Stay out of slabcalc's lane: no concrete volume/cost calculator. For plain or stamped concrete pricing detail, link to `SLABCALC.*` (max 2 links). Pourcanvas owns comparisons, pavers/flagstone/stone, decorative finishes, coatings and overlays.

## Phase 1: SERP anatomy (the "framework from well-ranking sites")
1. Pull the US Google top 10 for the primary keyword and 2 secondaries. Use DataForSEO (`mcp__dataforseo__api_request`, POST `/v3/serp/google/organic/live/advanced`, `location_code` 2840, `language_code` "en", depth 10). Also note PAA questions and any featured snippet.
2. Read the top 4–5 organic pages (skip forums/videos). Use DataForSEO `/v3/on_page/content_parsing/live` or WebFetch. For each, capture: page type (tool / cost guide / comparison), word count, H2/H3 outline, tables (columns + rows), tool inputs and outputs, numbers and price ranges quoted with sources, FAQ questions, unique assets (charts, regional data, lifetime cost, photos), date freshness.
3. Write `_planning/tools-2026-11/<slug>/serp-anatomy.md`: one block per competitor, then a **coverage matrix** (subtopic × competitor), the **must-cover set** (subtopics ≥2 competitors cover), **gaps** none of them cover well, and the **intent verdict** (tool vs article SERP; which inputs searchers expect).
4. This anatomy plus guide §2 decides the page: every must-cover subtopic gets an H2 or a tool output, and at least 2 gaps become our differentiators (e.g. lifetime cost, regional factor, shareable URL, climate effect). The page must be at least as deep as the median top-5 competitor in useful content. Never pad it.

## Phase 2: Spec + data
- `_planning/tools-2026-11/<slug>/spec.md`: query + volumes, inputs (with defaults matching the head query), outputs (primary card, breakdowns, tables), formulas, URL param keys, H2 plan mapped to the coverage matrix, FAQ plan (PAA-based), link plan.
- Data: extend `src/lib/tools/data/*.ts` with the existing `SourcedRange`/`SourcedValue` pattern. Every number has ≥2 sources where possible, with label, URL and date. Reuse existing constants (e.g. `INSTALLED`, `REGION_MULTIPLIER`) instead of duplicating them. Fetch the source pages and verify the numbers. If a number is only from a snippet, mark it `status: "pending"` and report it. The /methodology page renders these files, so new data must show up there.

## Phase 3: Build
- Engine: pure functions in `src/lib/tools/<engine>.ts`, `DEFAULT_INPUTS`, `paramsFromInputs`/`inputsFromParams` (URL state both ways), metric/imperial where relevant.
- UI: follow the PavingTool/FinishTool layout (two columns, mobile Calculate button, Pro Tips H3, primary card first, single CTA, Copy result ending "Calculated with PourCanvas.com", data-basis footer). Track `tool_calculate` / `tool_copy` via `src/lib/track.ts`. The default inputs must render a real result in SSR.
- Config: `src/content/tools/<slug>.ts` per the content brief. Body 1,100–1,700 words, 8–11 H2s, tables in almost every H2, 6–15 body links (25–35 in `<main>` overall), 5–7 FAQs with ≥2 "According to PourCanvas, …" answers carrying engine numbers.
- Register: `src/content/tools/index.ts`, `ToolConfig.engine` union in `src/content/types.ts`, component switch in `src/pages/tools/ToolPage.tsx`, `/tools` hub. Sitemap + prerender pick tools up from `toolPages`; verify they do. Keep registration diffs minimal (other tools are built in parallel; the main session merges).
- Embeddable lean widget (guide §9) via `src/content/tools/widgetForSlug.ts` when the tool suits a host page. Wire it into host pages only when the brief says so.

## Phase 4: Self-test (must all pass before reporting)
- `npx tsc --noEmit -p tsconfig.app.json`
- `npx vitest run`: new engine tests (known cases computed by hand, edge cases such as 0 or huge sizes, metric round trip, URL param round trip with invalid-param fallback) plus a config test asserting that meta/intro numbers equal engine output for the defaults.
- `npm run build` in the worktree, then `node scripts/check-pages.mjs`: zero errors for the new page, no new errors elsewhere.
- In `dist/tools/<slug>.html`, check the default result, all FAQ answers, tables, one BreadcrumbList, SoftwareApplication + FAQPage JSON-LD and the Last updated date.
- Browser check with Playwright (repo has `playwright.config.ts`) or `npx vite preview` and the preview tools at 375 px and 1280 px: changing inputs updates the result, the URL params update and reload restores state, copy works, no console errors, no layout overflow on mobile.
- Metrics report: title length, meta length, intro words, H2 count, body words, `<main>` words, internal links in `<main>`, FAQ count, competitor median word count.

## Phase 5: Hand-off
Commit on the worktree branch (no push), with a message in the repo style. Report the branch, commit, metrics, data items still `pending`, and anything you could not verify. The main session merges, runs QA (independent reviewer agent), deploys and adds the URL to `_data/gsc/indexing/priority.txt`.

## Phase 6 (main session, after deploy)
- Add ≥3 contextual links from indexed pages (`_data/gsc/<latest>/api/url_inspection.csv`) to the new tool, plus the hub. FROZEN pages get additive links only.
- Put the new URL at the top of `_data/gsc/indexing/priority.txt`.
- Re-check GSC 2–4 weeks later.
