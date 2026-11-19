# Tool Build Schedule (tools 3–6, one every two weeks)

A T3 Code scheduled task runs every Tuesday at 09:00. It builds the first row whose `due` date is today or earlier and whose status is `scheduled`. The process is `tool-build-process.md`, phases 1–6. The user approved publishing (merge to main + push) on 2026-11-19.

| # | due | status | slug (confirm in Phase 1) | primary keyword | demand (US/mo, DataForSEO 2026-11-19) |
|---|---|---|---|---|---|
| 1 | 2026-11-19 | done 2026-11-19 | stamped-concrete-vs-pavers-cost-calculator | stamped concrete vs pavers cost | 880 + 480 + 390 + 210 |
| 2 | 2026-11-19 | done 2026-11-19 | pool-deck-resurfacing-cost-calculator | pool deck resurfacing cost | 6,600 + 720 (+ cool deck 2,900) |
| 3 | 2026-12-01 | scheduled | stamped-concrete-color-picker | stamped concrete colors | 1,900; concrete stain colors 5,400; color combinations 90 |
| 4 | 2026-12-15 | scheduled | stamped-concrete-pattern-selector | stamped concrete patterns | 50K (head; ranks image pos ~27); ashlar slate 2,400; wood stamped 1,300; cobblestone 390 |
| 5 | 2026-12-29 | scheduled | driveway-material-cost-comparison | cheapest driveway material | cheap driveway ideas 1,000; cheapest driveway material 320; asphalt vs concrete driveway 4,400; gravel vs concrete 140; pavers vs concrete driveway 210 |
| 6 | 2027-01-12 | scheduled | ribbon-driveway-calculator | ribbon driveway | 880 (ad competition 3); circular driveway dimensions 140 |

## Per-tool notes

**3. Stamped concrete color picker.** Inputs: base color, release (antiquing) color, pattern, home exterior/trim color, sun exposure. Outputs: a rendered swatch preview (CSS/SVG texture, no stock photos), matching color names from the major color systems (verify each name on the manufacturer's chart, e.g. Brickform, Solomon, Increte, Butterfield), heat/fading notes (reuse the black concrete fade data), and a combination verdict. Links: /materials/colored-concrete (indexed winner), /blog/patio/patio-color-ideas, /blog/driveway/concrete-driveway-color-guide, /materials/stamped-concrete, /blog/patio/stamped-concrete-patterns. Image pipeline: add 3–6 real-looking combination photos via `image-gen/` (see `_planning/images-2026-11/`).

**4. Stamped concrete pattern selector.** Tool inputs: surface (patio/driveway/pool deck/walkway), home style, slip/barefoot use, budget tier, DIY vs pro. Output: ranked patterns with cost tier, slip/heat notes and a pattern-geometry illustration. Support pages, only if the Phase 1 SERP shows single-pattern intent: ashlar slate, wood plank, cobblestone stamped concrete. Use the guide-page anatomy (§6) with pattern close-ups from the image pipeline. These feed the head page /blog/patio/stamped-concrete-patterns (FROZEN: additive links only).

**5. Driveway material cost comparison.** Inputs: driveway size, region, climate, horizon years. Materials: gravel, asphalt, plain concrete (link slabcalc for detail), stamped/exposed aggregate, pavers, permeable pavers/grass pavers. Outputs: upfront vs lifetime cost, cheapest-by-horizon verdict. Host widget candidates: /blog/driveway/concrete-driveway-vs-asphalt, /blog/driveway/modern-driveway-ideas (FROZEN, widget only per guide §9).

**6. Ribbon driveway calculator.** Inputs: driveway length, strip width, strip spacing (track width), material (concrete strips, pavers, stone), center infill (grass/gravel/pebbles). Outputs: strip area, materials, cost vs full-width driveway, % permeable surface. Add a circular-driveway size widget to /blog/driveway/circular-driveway-ideas (indexed, ~1,660 impressions/28d): additive only. Links: driveway-border-ideas, inspiration/large-slab-driveway-grass-joints.

## Log
- 2026-11-19: schedule created; tools 1–2 started.
- 2026-11-19: tools 1–2 live (commit 0840bb8): builder (Opus, worktree) → independent QA (Sonnet, ship after fixes) → fixes → merge, build, check-pages 0 failures, 103 tests → push; 5–6 inbound contextual links each; both URLs at the top of the indexing priority list.
