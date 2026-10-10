# PourCanvas Refactor 2026-10: Tool-First Hardscape Site

Owner: Claude (orchestrates subagents, reviews every package). Binding build rules: `.claude/page-build-guide.md`.
Data basis: `_data/gsc/2026-10-10/`, `_data/keyword-planner/2026-10-10/`, SERP research (summarized in `decisions.md`).

## Goal

Grow pourcanvas from a content blog (200 clicks/7 mo, DR 0) into a **tool-first site for paving and decorative-surface decisions**.
- Tools answer input-dependent questions that AI answers can't absorb.
- Content wraps the tools and feeds image search.
- slabcalc.co keeps concrete cost and volume; pourcanvas owns pavers, flagstone and hardscape quantities and costs, plus decorative decisions (finish, color, look).

## What does not change

- Every live URL stays. No pruning, no URL renames, no redirects in this refactor.
- FROZEN pages (`url-inventory.csv`, status=FROZEN) get **additive changes only**: a lean widget block, appended sections, a `lastUpdated` bump. Title, meta, H1, URL and section order stay untouched.
- The homepage configurator and paywall are out of scope.

## Deliverables in this folder

| File | Purpose |
|---|---|
| `README.md` | This brief: scope, phases, architecture, definition of done |
| `decisions.md` | Why: data findings, positioning, rejected options |
| `url-inventory.csv` | All 150 live URLs with index status, GSC metrics, top query, FROZEN flag |
| `sitemap.md` | Target information architecture: hubs, new URLs, keyword per URL, phase |
| `crosslinks.md` | Inter-hub and intra-hub link map, widget host map, slabcalc hand-offs |
| `tool-specs/*.md` | One spec per tool engine: inputs, formulas, data and sources, outputs, page configs |
| `work-packages.md` | Ordered packages with owner (me / subagent), dependencies, acceptance criteria |
| `qa-checklist.md` | Automated and manual checks run before each merge |

## Phases

| Phase | Scope | Why first |
|---|---|---|
| **P0 Infra** | ToolPage template, LeanWidget, tool config types, routes, /tools hub, nav/footer, SeoHead jsonLd (done), FAQ answers in SSR (done), analytics helper, page check script | Everything else depends on it |
| **P1 Paving tools** | Paving engine + 8 tool pages (paver calculator, paver patio cost, paver installation cost, paver base, paver sand, polymeric sand, patio cost comparator, flagstone calculator) + widgets on 5 host pages + /methodology | Validated demand (paver calculator 10K–100K, five more at 1K–10K), low ad competition, outside slabcalc's lane, builds on the flagstone foothold (pos 5–9) |
| **P1b** | paver-walkway-cost, paver-driveway-cost configs (same engine) | Cheap once the engine exists (100–1K each) |
| **P2 Finish selector** | Decision engine (surface × climate × use × look) + pages: concrete finish selector, pool deck finish selector, driveway finish selector + widgets on finish/pool pages | Demand is informational (~25K), and the existing content pages are stuck at pos 55–77 |
| **P3 Content support** | Black-concrete hub additions, salt-finish material page, outdoor dye-vs-stain, cool-deck explainer, modern driveway finishes matrix: built as guide pages that link the tools | Beachhead and image search; AI-absorbable, so secondary |
| **P4 Color chooser** | Color and method chooser (low demand, ≤1K): only if P1–P2 data justifies it | Lowest validated demand |

## Architecture (fits the existing Vite + React + prerender stack)

```
src/content/tools/              one config file per tool page (ToolConfig), index.ts exports toolPages
src/content/types.ts            + ToolConfig, ToolWidgetRef; Article/MaterialPage gain optional `toolWidget`
src/lib/tools/paving.ts         pure engine: quantities + costs (no React), unit-tested
src/lib/tools/data/paving.ts    cost/coverage constants WITH source URLs and dates (single source of truth)
src/lib/tools/finish.ts         P2 decision engine
src/lib/year.ts                 CURRENT_YEAR constant (never hard-code the year)
src/lib/track.ts                window.umami?.track wrapper
src/components/tools/           ToolLayout, PavingTool (full), LeanWidget, ResultCard, CopyResult, ProTips, RelatedTools
src/pages/tools/ToolsHub.tsx    /tools hub (ItemList JSON-LD)
src/pages/tools/ToolPage.tsx    /tools/:slug template (guide §2 anatomy)
src/pages/MethodologyPage.tsx   /methodology (sources for every number)
scripts/check-pages.mjs         post-build HTML assertions (see qa-checklist.md)
```

- Body content uses the repo idiom: `sections: { heading, body(HTML) }[]` rendered with `prose-table`. No markdown renderer is added. This overrides the guide's "markdown" wording for this repo.
- URL state: the full tool reads params on mount and writes them back with `history.replaceState`. The canonical is always the bare URL.
- SSR: the default inputs render a real result into the prerendered HTML. The engine is pure, so the same output appears on the server and the client.

## Definition of done (per page)

All items in `qa-checklist.md` pass. Plus: `npm run build` and the prerender succeed, `vitest` is green, and `scripts/check-pages.mjs` is green. I have reviewed the page in the browser at 375px and 1280px, and the widget-to-tool hand-off works with the back button.

## Measurement

Re-pull GSC with `python3 scripts/gsc-pull.py --inspect` around 2026-11-07, about 4 weeks after the P1 deploy and after the DR push. Compare `/tools/*` index status, impressions for the P1 keywords, and the widget events in Umami (`widget_submit`, `widget_handoff`, `tool_calculate`, `tool_copy`).
