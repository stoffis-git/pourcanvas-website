# Decisions and Evidence

## Findings that drive the refactor (2026-10-10)

1. **Traction is narrow.** 200 web clicks + 47 image clicks over 7 months. Only the black/dark concrete cluster sits on page 1 (pos 3–7); flagstone vs concrete is at pos 5–9. Image search is now about 55% of impressions.
2. **Indexing:** 51 of 150 sitemap URLs indexed. Cause is authority (DR 0, no links ever), not proven thin content, so nothing gets pruned. The user is raising DR to about 13 by about 2026-10-24 through launch platforms (not topically relevant).
3. **Tools beat content (measured on slabcalc.co):** calculator pages earn about 10x the clicks per page of guides (188 vs 18). 77% of clicks come from queries with an input-dependent answer that never contain the word "calculator". AI answers absorb pure content: slabcalc logged about 4,900 AI citations per referred visit.
4. **Validated tool demand (Keyword Planner, US/EN, bucketed):** paver calculator 10K–100K. These each have 1K–10K: paver patio cost calculator, paver installation cost calculator, paver base calculator, paver sand calculator, polymeric sand calculator, estimate paver patio cost, patio paving cost calculator. About 37 more terms sit at 100–1K. Color, stain and pigment calculators are ≤100–1K, so they were dropped to P4.
5. **Lane split with slabcalc:** slabcalc owns concrete cost and volume (concrete-cost-calculator: 1.08M impressions at pos 7; driveway, patio, stamped and pool deck cost calculators; crack analysis). It has no pavers or flagstone, and it is weak on color and stamped decisions.

## Positioning

A neutral, homeowner-facing referee for outdoor paving and decorative surfaces. It sits between:
- manufacturer catalogs (Belgard, Unilock, Solomon, Brickform): single brand, no decision help
- ConcreteNetwork: pages from 2020–2023, contractor lead-gen
- cost publishers (Angi, HomeGuide, LawnLove): lead-gen, national averages only
- local contractors: sales copy, one region

What sets pourcanvas apart: brand-neutral, numbers that change with climate and region, sources for every figure, tools whose results can be shared, and consistent original imagery.

## Lean widget → full tool (user-approved 2026-10-10)

Ranking pages get a compact widget: 2–3 inputs and one teaser result inline. A same-tab hand-off goes to `/tools/{slug}?params`. Rejected variants:
- **New-tab hand-off:** it breaks mobile back-navigation, and most traffic is mobile.
- **Redirect with no inline answer:** it feels like bait and sends users back to the search results.

## Rejected / deferred

- Quote checker: no quote-stage queries in the data.
- Pigment calculator: about 21 impressions of DIY-color intent; KP shows ≤100 per term.
- Heat checker as its own page: 1 query. The heat data lives inside the pool-deck and black-concrete content as a sourced table instead.
- Cost tools for concrete: slabcalc's lane. Hand off to it instead.
- Visualizer as the funnel target: user rejected it. The homepage stays as is, out of scope.
- Pruning unindexed pages: the cause is authority, not quality.

## Open questions

- SERP difficulty for "paver calculator": competitor research is in progress (agent). It will be added to `tool-specs/paving.md`.
- The flagstone article says $25–45/sq ft. Reconcile it with the sourced cost data. If the sourced range differs, append a "2026 update" section to the FROZEN article. Never rewrite the intro or meta.
