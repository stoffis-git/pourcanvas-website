# Tool Engine Spec: Paving (P1 / P1b)

One pure engine (`src/lib/tools/paving.ts`) powers 10 pages through per-page configs: different defaults, visible inputs, result emphasis and copy.

## Competitive gap (SERP research 2026-10-10)

None of 15+ tools combines a **full material takeoff** (pavers, base tons, bedding sand, polymeric bags, edge restraint) with an **installed cost** (materials vs labor, region).
- Inch Calculator: base fixed at 4", no labor.
- Omni: labor is user-typed, no base.
- outdoorbrite: closest competitor, also an AI-redesign site. Materials only, contradictory numbers, no edging.
- costmyyard: preset sizes only, no quantities.
- projectcostpro: self-contradictory figures.

**Our edge:**
- quantities and installed cost in one result
- base depth by use and soil
- edge restraint
- concrete comparison row (hand-off to slabcalc)
- dated, sourced numbers (`/methodology`)
- shareable URL plus copy result

Difficulty for a ~DR 13 site, with rollout order:

| Keyword | Difficulty | Order |
|---|---|---|
| paver patio cost / paver installation cost calculator | MEDIUM, best target (young low-DR sites rank) | 1st |
| paver base / paver sand calculator | MEDIUM-EASY | 2nd |
| flagstone calculator | EASY-MEDIUM | 2nd |
| polymeric sand calculator | MEDIUM | 2nd |
| paver calculator | HARD (Inch, Omni, Lowe's, Houzz) | Built anyway (same engine), no expectations |

## Inputs (full tool)

| Input | Values | Default |
|---|---|---|
| Size | length × width (ft/in), or total area | page config |
| Units | imperial / metric | imperial |
| Material | concrete pavers, clay brick, flagstone (dry-laid), flagstone (mortared), travertine, porcelain | page config |
| Paver size | 4×8, 6×6, 6×9, 12×12, 16×16, 24×24, custom W×L in | 6×9 (concrete), 4×8 (brick) |
| Laying pattern → waste | running/stack bond 5%, basketweave 10%, random/ashlar 10%, herringbone 45° 15%; curved edges +5% | running bond |
| Use | patio/walkway, driveway | page config |
| Soil / climate | well-drained, clay or freeze-thaw | well-drained |
| Joint width | narrow (1/8–3/8"), wide (3/4–1¼") | narrow (flagstone: wide) |
| Edge restraint | full perimeter, perimeter minus one side (against house), none | full perimeter |
| Removal | none, sod/grass, old concrete | none |
| Install | pro installed, DIY (materials only) | pro |
| Region | national, Northeast, Pacific/West Coast, Midwest, South, Mountain/Southwest | national |

The lean widget shows only length, width and material (comparator: material chips).

## Formulas

```
A        = L × W                                   (sq ft)
waste    = pattern% (+5% if curved)
paverSqft= (pw × pl) / 144
pavers   = ceil(A × (1+waste) / paverSqft)
baseIn   = use=patio ? 4 : 8 ; +2 if soil=clay/freeze-thaw     (ICPI Tech Spec 4 via calcsummit)
baseYd3  = A × baseIn/12 / 27 × 1.20 (compaction)               (outdoorbrite, activecalculator)
baseTons = baseYd3 × 1.4                                        (aggregator snippets 1.4–1.5 t/yd³)
sandYd3  = A × (1/12) / 27 ; sandTons = sandYd3 × 1.35
polyBags = ceil(A / cov) ; cov = narrow 70 sq ft, wide 33 sq ft per 50 lb   (Alliance Gator data)
edgeLF   = 2(L+W) | 2(L+W) − max(L,W) | 0
proCost  = A × rate[material] × region + removal                (low / typical / high)
diyCost  = A×(1+waste)×matRate[material] + baseTons×$35 + sandTons×$40 + delivery $75–150
           + polyBags×$30–80 + edgeLF×$2.50 + compactor rental (source TBD)
laborShare (pro) ≈ 50–60%; shown as materials vs labor split
```

## Data constants (`src/lib/tools/data/paving.ts`). Each entry carries `{ value, sourceUrl, sourceDate }`

| Key | Low / typical / high | Sources |
|---|---|---|
| installed.concretePaver | 10 / 15 / 22 $/sq ft | costmyyard 2026-09; HomeAdvisor 2026-06 ($8–25 all pavers); Lawn Love 2025-12 |
| installed.clayBrick | 12 / 18 / 26 | costmyyard 2026-09; homewyse 2026-05 ($20–26) |
| installed.flagstoneDry | 15 / 22 / 32 | thebrickyardwi 2026-03 (cites HomeGuide) |
| installed.flagstoneMortared | 20 / 30 / 45 | thebrickyardwi 2026-03 ($20–42 over slab, $23–45 wet-laid) |
| installed.travertine | 15 / 20 / 30 | stonorama 2026-06; HomeGuide (snippet $13–45) |
| installed.porcelain | 16 / 24 / 35 | costmyyard 2026-09; HomeGuide (snippet) |
| compare.plainConcrete | 6 / 9 / 14 | Lawn Love 2026-10-05; slabcalc ($6–12) |
| compare.stamped | 12 / 18 / 28 | todayshomeowner; HomeGuide (snippet) |
| compare.exposedAggregate | 9 / 13 / 18 | todayshomeowner; HomeGuide (snippet) |
| material.concretePaver | 3 / 4.5 / 6 | HomeGuide (snippet) |
| material.flagstone | 2 / 8 / 15 | thebrickyardwi |
| labor (pavers) | 4–11 $/sq ft, hard stone up to 25 | HomeAdvisor 2026-06; Lawn Love 2025-12 |
| gravel $/ton | 20–55 (+10–25 delivery) | hellogravel / stone-calculator (snippets) |
| bedding sand $/ton | 25–45 | snippets |
| polymeric $/50 lb | 30–80 | polymericsandstore 2026; Walmart; Lawn Love |
| edging material $/LF | plastic 1.5–3, aluminum 2.8–4, steel 3–6 | snippets |
| removal concrete $/sq ft | 2–6 | Lawn Love 2026-10-05 |
| removal sod $/sq ft | 1–3 | stonorama 2026-06 |
| region multipliers | NE 1.18, Pacific 1.25, Midwest 1.0, South 0.90, Mountain/SW 1.0 | projectcostpro metro table 2026-07; costmyyard state table 2026-09 (derived) |

**Before shipping, WP1 must verify every "snippet" source by fetching it, or replace it.** The HomeGuide and Angi pages returned 403 to the agent. Also open: flagstone coverage (sq ft per ton by thickness) and compactor rental price. Both need sources.

**Article reconciliation:** the FROZEN `/blog/walkway/flagstone-vs-concrete-walkway` says flagstone runs $25–45. That matches mortared/wet-laid ($20–45), but dry-laid is $15–32. Append a section "Dry-laid vs mortared flagstone cost ({YEAR} update)" to the article. Intro and meta stay unchanged.

## Outputs (result card order)

- **Cost pages:** 1) installed cost range (big), 2) per sq ft, 3) materials vs labor split, 4) "same area in concrete" row linking slabcalc, 5) collapsible material list.
- **Quantity pages:** 1) the page's primary quantity (big: pavers / base tons / sand tons / bags / flagstone tons), 2) the full takeoff, 3) DIY material cost, 4) the next-step tool.
- **Footer line:** "Based on {YEAR} U.S. installed-cost data. See methodology."
- **Copy result:** plain-text takeoff ending "Calculated with PourCanvas.com · {url with params}".

## Page configs

| Slug | Defaults | Visible inputs | Primary result | Draft title (≤60) | H1 |
|---|---|---|---|---|---|
| paver-patio-cost-calculator | 12×16, concrete pavers, patio, pro | all | installed cost | Paver Patio Cost Calculator ({Y}): $10–22 per Sq Ft | Paver Patio Cost Calculator |
| paver-installation-cost-calculator | 300 sq ft, concrete pavers, pro | all + labor split emphasized | labor vs materials | Paver Installation Cost Calculator: Labor + Materials ({Y}) | Paver Installation Cost Calculator |
| paver-calculator | 12×12, 6×9, running bond | size, paver size, pattern, use, joint, edging | paver count | Paver Calculator: How Many Pavers, Base & Sand You Need | Paver Calculator |
| paver-base-calculator | 12×16, patio | size, use, soil | base tons + yd³ + bags | Paver Base Calculator: Tons, Cubic Yards & Bags | Paver Base Calculator |
| paver-sand-calculator | 12×16 | size | bedding sand tons + bags | Paver Sand Calculator: Bedding Sand in Tons & Bags | Paver Sand Calculator |
| polymeric-sand-calculator | 12×16, narrow joints | size, joint width, paver size | 50 lb bags | Polymeric Sand Calculator: How Many Bags You Need | Polymeric Sand Calculator |
| patio-cost-calculator | 12×16, compare all | size, region, material chips | ranked materials table | Patio Cost Calculator ({Y}): Pavers vs Concrete vs Flagstone | Patio Cost Calculator |
| flagstone-calculator | 12×16, dry-laid, wide joints | size, method, thickness | tons of flagstone + cost | Flagstone Calculator: Tons, Coverage & Patio Cost ({Y}) | Flagstone Calculator |
| paver-walkway-cost-calculator [P1b] | 4×30, concrete pavers | cost set | installed cost | Paver Walkway Cost Calculator ({Y}): $ per Sq Ft | Paver Walkway Cost Calculator |
| paver-driveway-cost-calculator [P1b] | 20×24, driveway | cost set | installed cost | Paver Driveway Cost Calculator ({Y}) + Concrete Compared | Paver Driveway Cost Calculator |

**Meta descriptions and intro example numbers MUST be generated from the engine at build time:** `metaTemplate` + `engine(defaults)`. This keeps the copy and the tool identical. A unit test asserts it.

## Lean widgets (host pages)

| Host | Widget inputs | Teaser | Hand-off |
|---|---|---|---|
| /blog/walkway/flagstone-vs-concrete-walkway | L, W, material chips (flagstone / stamped / plain concrete) | "Flagstone: ~$X–Y · Stamped concrete: ~$X–Y" | /tools/patio-cost-calculator?l&w&m |
| /blog/patio/concrete-patio-vs-pavers | L, W | "Pavers ~$X–Y vs concrete ~$X–Y" | /tools/patio-cost-calculator |
| /blog/patio/stamped-concrete-vs-pavers | L, W | "Pavers ~$X–Y vs stamped ~$X–Y" | /tools/patio-cost-calculator |
| /materials/concrete-pavers | L, W, paver size | "≈N pavers + T tons base" | /tools/paver-calculator |
| /materials/flagstone | L, W, method | "≈T tons, ~$X–Y installed" | /tools/flagstone-calculator |
