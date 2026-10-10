# Work Packages

Execution model:
- I (main session) own architecture, shared components, integration, review and QA.
- Subagents get **narrow, file-disjoint packages** with explicit acceptance criteria and no commits.
- Each package ends with my review (diff read, build, `check-pages`, browser check) before the next one that depends on it.
- Parallel packages never touch the same files.

Status legend: ☐ open · ◐ in progress · ☑ done (reviewed)

## P0: Infrastructure (me, sequential)

| # | Package | Files | Acceptance |
|---|---|---|---|
| P0.1 | ☑ SeoHead `jsonLd` prop | src/components/SeoHead.tsx | Extra JSON-LD rendered via Helmet |
| P0.2 | ☑ FAQ answers in SSR (`<details>`) | src/components/FAQSection.tsx | Answers present in prerendered HTML of an existing article |
| P0.3 | ☑ Sitemap index + per-section sitemaps | scripts/generate-sitemap.mjs | /sitemap.xml = index; children core/tools/blog/materials/inspiration/palette/before-after |
| P0.4 | ☑ Types: `ToolConfig`, `ToolWidgetRef`; optional `toolWidget` on Article + MaterialPage | src/content/types.ts | tsc clean |
| P0.5 | ☑ `CURRENT_YEAR`, `track()` (Umami) helpers | src/lib/year.ts, src/lib/track.ts | — |
| P0.6 | ☑ Tool page template + layout pieces (Breadcrumbs, ResultCard, ProTips, CopyResult, RelatedTools, guide sentence) | src/pages/tools/ToolPage.tsx, src/components/tools/* | Matches guide §2 order; renders with a stub engine |
| P0.7 | ☑ LeanWidget (generic: inputs → teaser → same-tab hand-off with params) | src/components/tools/LeanWidget.tsx | Back button returns to host; events fire |
| P0.8 | ☑ Routes `/tools`, `/tools/:slug`, `/methodology`; dynamicPaths from toolPages | src/App.tsx, src/content/index.ts, src/content/tools/index.ts | Prerender emits dist/tools/*.html |
| P0.9 | ☑ /tools hub (ItemList JSON-LD), /methodology page shell | src/pages/tools/ToolsHub.tsx, src/pages/MethodologyPage.tsx | In sitemap-core |
| P0.10 | ☑ Nav: Header Tools link, Footer Free Tools column, homepage tool strip | Header.tsx, Footer.tsx, pages/Index.tsx (additive) | Visible at 375/1280px |
| P0.11 | ☑ `scripts/check-pages.mjs` + `npm run check` | scripts/, package.json | Fails on any qa-checklist automated rule |

## P1: Paving tools

| # | Package | Owner | Depends | Files | Acceptance |
|---|---|---|---|---|---|
| P1.1 | ☑ (done in final numbers round: verify-v1/v2/v3 reports) Source verification: fetch every "snippet"-sourced number in tool-specs/paving.md, replace unverifiable ones, add flagstone coverage + compactor rental sources | subagent (research) | — | `_planning/refactor-2026-10/tool-specs/paving-sources.md` | Every constant has a fetched URL + date |
| P1.2 | ☑ Paving engine + data constants + unit tests | subagent (code) | P1.1, P0.4 | src/lib/tools/paving.ts, src/lib/tools/data/paving.ts, src/lib/tools/paving.test.ts | Pure functions; tests cover each formula, waste, units, edge cases (0/huge/metric); vitest green |
| P1.3 | ☑ PavingTool UI (full) + paving LeanWidget variants | me | P0.6, P0.7, P1.2 | src/components/tools/PavingTool.tsx | URL read/write, unit toggle, mobile layout, copy result, SSR default result |
| P1.4a | ☑ Configs + copy: paver-patio-cost, paver-installation-cost, patio-cost | subagent (content) | P1.2 | src/content/tools/{3 files}.ts | Guide §2/§3: intro 40–60 words, 7–13 H2s with tables, 1,000–1,700 words, 5–9 FAQs, links per crosslinks.md, meta and intro numbers from engine |
| P1.4b | ☑ Configs + copy: paver-calculator, paver-base, paver-sand, polymeric-sand, flagstone | subagent (content) | P1.2 | src/content/tools/{5 files}.ts | Same as P1.4a |
| P1.5 | ☑ Widgets on 5 host pages (additive) + Related Tools lines; flagstone article "dry-laid vs mortared" appended section | me | P1.3, P1.4 | content configs of host pages only (`toolWidget` field, appended section) | FROZEN rules respected (title/meta/H1/intro/order unchanged; diff check) |
| P1.6 | ☑ (renders data file; content follows numbers round) /methodology content (all sources, per tool) | subagent (content) | P1.1 | src/pages/MethodologyPage.tsx data | Every number on tool pages is traceable here |
| P1.7 | ☑ QA pass: independent reviewer agent (guide compliance, copy accuracy vs engine, link map, schema) + my browser check | subagent (review) + me | all P1 | — | qa-checklist all green; reviewer findings resolved |
| P1.8 | ☐ Deploy (only on user go-ahead: commit/push to main triggers Vercel) + user submits child sitemaps in GSC | user approval | P1.7 | — | Live; sitemaps submitted |

P1.4a and P1.4b run in parallel (disjoint files). P1.1 and P0 run in parallel.

## P1b: Walkway and driveway paver cost pages
Configs only (same engine), one content subagent, then QA. Hosts: /walkway and /driveway landings get the tool strip.

## P2: Finish selector (after P1 is live and has 2+ weeks of data)
P2.1 research and scoring matrix with sources → P2.2 engine + tests → P2.3 UI → P2.4 3 configs → P2.5 widgets on 4 hosts → QA.

## P3: Content support (guide pages per guide §6, each linking a tool)
Black-concrete additions (appended sections on FROZEN pages plus new guide pages: charcoal driveway, black stamped concrete), salt-finish material page, outdoor dye-vs-stain, cool-deck explainer, modern driveway finishes matrix.

## Subagent briefing template (prepend to every package prompt)

> Repo /Users/stoffi/Documents/pourcanvas. Read `.claude/page-build-guide.md` and `_planning/refactor-2026-10/README.md` first. Only edit the files listed in your package. Do not commit. Do not change titles, meta, H1, intro, URL or section order of any page marked FROZEN in `_planning/refactor-2026-10/url-inventory.csv`. Use `CURRENT_YEAR` and never hard-code the year. Every number must come from `src/lib/tools/data/*` or the engine output; no invented figures. Report: files changed, how acceptance criteria were verified, and anything uncertain.

## Execution log (2026-10-10)
- P0 + P1 + P1b built: 10 paving tool pages, /tools hub, /methodology, widgets on 5 hosts, tool strips (home, landings), inspiration + materials hub links, FAQ answers in SSR sitewide (FAQSection, guides, HomeFAQ), sitemap index.
- Engine fixes from agent reviews: labor as share of installed range; mortared flagstone on slab (no base/sand/joints); per-sq-ft display rounding; ton/tons plural; compare view headline = cheapest option.
- QA: vitest 46 tests green; check-pages 0 failures / 0 warnings; browser: hydration clean, URL prefill, widget → same-tab hand-off → back restores scroll.
- P2: finish engine + data (sourced from finish-research.md) + UI + widget done; 3 configs in progress (agent). P3a (driveway.ts) and P3b (salt-finish, colored-concrete append, cool-deck article, pool deck widget) in progress (agents).
- P4 color chooser: NOT built — Keyword Planner shows ≤100–1K/mo per color/stain/pigment calculator term; revisit only if P2 data shows demand.

## Final state (2026-10-10, end of session)
- Built: P0, P1 (8 paving tools), P1b (walkway + driveway paver cost), P2 (finish engine + 3 selectors + widgets on 5 pages), P3 (charcoal-concrete-driveway, black-stamped-concrete, cool-deck-vs-kool-deck, /materials/salt-finish, appended sections on 5 FROZEN pages). P4 not built (low demand).
- Independent QA review: 34 findings → code + copy fixed (hand-off params, UTC dates, number inputs, URL param preservation, finish weights, cannibalization retitles, inbound links from 13 indexed pages).
- Numbers round: 3 verification agents; data file updated to fetched sources (12 installed-cost adjustments, regional factors from DoD ACF + BLS, gravel density 1.5, flagstone coverage, sod removal, basketweave waste, new bag/compactor constants (pending big-box check)); content corrected across ~20 files incl. minimal in-place number fixes on FROZEN bodies.
- QA: 53 unit tests green; check-pages 169 pages, 0 failures; FROZEN title/meta/H1/intro/H2-order unchanged.
- Committed + deployed: e161881 (2026-10-10).
- Open (needs user decision): FROZEN meta/intro numbers left as-is: black-concrete-driveway meta+intro "$6–12" (body now $8–16); modern-driveway-ideas meta "$6–20"/intro "$6–12"; best-concrete-finish-pool-deck H2s "($6–10/sq ft)" and "($3–8/sq ft)".
