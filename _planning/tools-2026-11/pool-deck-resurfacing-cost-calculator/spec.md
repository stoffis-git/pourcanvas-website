# Spec: Pool Deck Resurfacing Cost Calculator

URL `/tools/pool-deck-resurfacing-cost-calculator` · engine `pool-deck` · category `paving` · config `src/content/tools/pool-deck-resurfacing-cost-calculator.ts`.

## Queries (DataForSEO, US monthly)
Primary: "pool deck resurfacing cost" 720. Secondaries: "pool deck resurfacing" 6,600 (peaks 9,900 Mar–May, Oct; CPC $16.65), "cost to resurface pool deck", "cool deck resurfacing cost", "pool deck coating cost". Related: "cool deck" 2,900, "travertine pool deck" 2,400, "stamped concrete pool deck" 1,000, "pool deck colors" 390, "best pool deck material" 260.

Lane: resurfacing, overlays, coatings, pavers/travertine over the slab = pourcanvas. Tear-out + new pour shown only as a comparison row; detail → `SLABCALC.poolDeckCost` (max 2 SlabCalc links on the page).

## Inputs (defaults = head query)
| Key | Param | Default | Options |
|---|---|---|---|
| mode | `m` | `pool` | `pool` (derive from pool) / `area` (enter sq ft) |
| poolLength | `pl` | 32 ft | 1–200 |
| poolWidth | `pw` | 16 ft | 1–200 |
| deckWidth | `dw` | 6 ft | 0.5–100 |
| shape | `sh` | `rect` | `rect` / `round` (oval, kidney, freeform) |
| area | `a` | 720 sq ft | 1–20,000 (used when mode=area) |
| method | `me` | `spray` | reseal, paint, resurfacer, spray, stamped, rubber, pavers, travertine, replace |
| condition | `c` | `sound` | sound / minor / major |
| coping | `cp` | `keep` | keep / replace |
| region | `rg` | `national` | REGION_MULTIPLIER keys |
| priority | `p` | `value` | low (lowest cost now) / value (lowest cost per year) / cool (cool, grippy) / premium (premium look) |

Metric toggle converts the length inputs (m ↔ ft) and shows m²; the URL always stores feet.

## Formulas
- Rectangle: deck = (L + 2D)(W + 2D) − L·W; coping LF = 2(L + W).
- Rounded: pool treated as an ellipse with axes L, W; perimeter P (Ramanujan); deck = P·D + π·D² (outer offset of a convex shape); coping LF = P.
- Area mode: deck = entered sq ft; coping LF = 4·√area (shown as an estimate, only used when coping = replace).
- Method cost = area × PRO[method] × region. Repair (condition) = CRACK_REPAIR[condition] × region, not applied to `replace` (tear-out removes the slab). Coping = LF × COPING_PER_LF × region.
- Total = method + repair + coping (low/typical/high each). Per sq ft = total / area.
- DIY materials (reseal, paint, resurfacer, spray only) = area × DIY[method] × region; others pro-only.
- Lifespan (years) per method; cost per year = typical total / typical lifespan.
- Suitability: condition `major` → every method that bonds to or sits on the slab (all except `replace`) is `unsuitable`; `minor` → `paint` and `reseal` flagged "cracks show through".
- Recommendation: if major → replace (or level/repair first). Else by priority: low → cheapest typical total among resurfacing methods (excluding reseal unless sound) ; value → lowest cost per year among non-replace methods; cool → spray; premium → travertine. Text names the method, total and why, plus a note when the user's chosen method differs.

## Outputs
Primary card: total range for chosen method, per sq ft, typical; deck sq ft + coping LF. Stats: surface work, crack repair, coping, DIY materials, lifespan, cost/year. Recommendation box. Comparison table (all 9 methods): total, lifespan, cost/yr, heat & slip note, suitability; tear-out row links SlabCalc. Copy result, data-basis footer, methodology link.

## Data (src/lib/tools/data/poolDeck.ts, SourcedRange pattern)
PRO per sq ft, LIFESPAN years, DIY per sq ft, CRACK_REPAIR lump sums, COPING_PER_LF. Reuse REGION_MULTIPLIER, REMOVAL_PER_SQFT.concrete and INSTALLED["plain-concrete"] for tear-out. Sources: HomeGuide (pool deck resurfacing, coping, travertine, pavers), Angi (concrete resurfacing, pool deck painting, sealing; all Oct 2026), Concrete Network (resurfacing table, pool deck cost), SKIN Microplaster, Beltway Pools, Fixr (pool deck, patio repair), ctvegas, Encore Coatings, Cal Pool. Pending: DIY resurfacer (Quikrete Re-Cap retail price/coverage from snippets; retail pages block fetches).

## H2 plan (→ coverage matrix), as built
1. Pool Deck Resurfacing Cost by Method (must 1, 6)
2. Pool Deck Square Footage by Pool Size (gap 1)
3. Pool Deck Resurfacing Cost by Deck Size (must 2)
4. Cost per Year: Which Pool Deck Surface Lasts Longest? (must 3, gap 2; resealing cycle = must 10)
5. Cool Deck Resurfacing Cost (must 5)
6. Resurface or Replace? When an Overlay Won't Work (must 4, gap 3; SlabCalc link 1 of 2, the other is the tear-out row in the tool)
7. Crack Repair and Coping Replacement Costs (gap 4)
8. Pool Deck Resurfacing Cost by Region (must 8, gap 5)
9. DIY vs Professional Pool Deck Resurfacing (must 9, 12)
10. Pool Deck Colors, Heat and Slip Resistance (must 11)
11. Pavers and Travertine Over an Existing Pool Deck (must 7)

## FAQ plan (PAA-based, 6–7)
What is the average cost to resurface a pool deck? (According to PourCanvas…) · What is the most cost-effective way to resurface a pool deck? (According to PourCanvas…) · Can I resurface my pool deck myself? · Does a cool deck go over existing concrete? · Is painting a pool deck a good idea? · How long does pool deck resurfacing last? · How much does a 20×40 pool deck cost to resurface? (derived example)

## Link plan
Body: /tools/pool-deck-finish-selector, /blog/patio/best-concrete-finish-pool-deck (link only), /blog/patio/cool-deck-vs-kool-deck, /blog/patio/pool-deck-ideas-concrete, /materials/travertine, /materials/concrete-overlay, /materials/stamped-concrete, /blog/patio/concrete-patio-resurfacing, /blog/patio/patio-resurfacing-cost, /blog/patio/concrete-patio-sealing, /blog/patio/concrete-patio-crack-repair, /materials/colored-concrete, /tools/paver-patio-cost-calculator, /methodology. SlabCalc: poolDeckCost ×1–2.
Related tools: pool-deck-finish-selector, paver-patio-cost-calculator, patio-cost-calculator, concrete-finish-selector, paver-installation-cost-calculator, paver-calculator, flagstone-calculator.
