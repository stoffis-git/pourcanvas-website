# Verification V1: installed costs, material-only, driveway and region multipliers

File: `src/lib/tools/data/paving.ts`. Verified 2026-10-10. No code edited.

Method notes
- Every source below was fetched (WebFetch, curl, or the BLS API) in this session. Values seen only in search snippets are marked as "snippet" and were not used as evidence.
- **Blocked (403) and therefore unverifiable:** all HomeGuide pages (`homeguidePavers`, `homeguideAggregate`), Angi, Forbes Home, Networx, and bls.gov HTML. HomeGuide figures appear only second-hand (e.g. CostMyYard quotes HomeGuide). **Recommendation:** remove `S.homeguidePavers` and `S.homeguideAggregate` as sources. Replace `S.todayshomeowner`, which points at the site root, with the specific article URL below.
- **Homewyse caveat:** its headline per-sq-ft figure is for a default 129 sq ft job and includes minimum-labor charges, so it runs high for small decorative concrete. Its line items are obfuscated in the static HTML (every row shows the same value), so only the headline number is usable.
- **ProjectCostPro:** its metro table is internally implausible (Atlanta +16%, Miami 0%, Houston +7%, Boston +12%). Its per-material table ($22–$38/sq ft for concrete pavers) also contradicts its own FAQ ($8–$15). **Recommendation:** drop `S.projectcostpro` as a source.
- **CostMyYard:** our `concrete-paver` and `clay-brick` installed numbers are an exact copy of its table (10/15/22, 12/18/26). It is a calculator site that cites HomeGuide and Angi. I treat it as one source, not an independent consensus.

---

## 1. INSTALLED (pro, patio/walkway, U.S. national, $/sq ft)

### 1.1 Concrete pavers: current 10 / 15 / 22 → **ADJUST → 8 / 14 / 22**
| Source | Range | Date | Fetched |
|---|---|---|---|
| HomeAdvisor walkway costs — https://www.homeadvisor.com/cost/patios-and-walkways/ | concrete pavers $8–15 | 2026-06-17 | yes |
| HomeAdvisor paver patio — https://www.homeadvisor.com/cost/outdoor-living/install-a-brick-paver-patio | paver patios $8–25 overall; labor $5–10 | 2026-06-17 | yes |
| LawnStarter paver patio — https://www.lawnstarter.com/blog/cost/paver-patio-price/ | concrete $8–16 | 2024-12-02 | yes |
| Cost to Renovate — https://www.costtorenovate.com/projects/exterior/patio-installation/ | standard $8–12, premium interlocking $12–18 | 2026-03 | yes |
| Concrete Network — https://www.concretenetwork.com/stamped-concrete/cost.html | pavers ~$10–23 | 2026-01-26 | yes |
| Minimal and Modern — https://www.minimalandmodern.com/paver-installation-cost-per-square-foot-a-complete-guide/ | basic concrete pavers $8–12 | 2026-05-05 | yes |
| CostMyYard — https://costmyyard.com/calculators/paver-patio-cost/ | 10 / 15 / 22 | 2026-09 | yes |
| Lawn Love — https://lawnlove.com/blog/paver-patio-cost/ | all pavers $8–24 | 2025-12-27 | yes |

Rationale: five of seven sources start at $8, and only CostMyYard and Concrete Network start at $10. The median midpoint is about $13–14. The high end of $22 holds once premium lines are included (Concrete Network $23, Cost to Renovate premium $18).

### 1.2 Clay brick pavers: current 12 / 18 / 26 → **CONFIRMED**
| Source | Range | Date | Fetched |
|---|---|---|---|
| Homewyse brick paver patio — https://www.homewyse.com/services/cost_to_install_brick_paver_patio.html | $20.03–25.95 | 2026-05 | yes |
| LawnStarter (above) | brick $14–24 | 2024-12-02 | yes |
| HomeAdvisor walkway (above) | brick $8–20 | 2026-06-17 | yes |
| CostMyYard (above) | 12 / 18 / 26 | 2026-09 | yes |

Rationale: the midpoints are 14, 19, 23 and 19, which put the typical value around 18–19. The high end of 25–26 is shared by three of the four sources. HomeAdvisor's $8 low is an outlier because that page covers walkways and brick veneer.

### 1.3 Flagstone, dry-laid: current 15 / 22 / 32 → **CONFIRMED**
| Source | Range | Date | Fetched |
|---|---|---|---|
| The Brickyard — https://www.thebrickyardwi.com/feeds/blog/flagstone-patio-cost | dry-laid $15–32 | 2026-03-25 | yes |
| HomeAdvisor flagstone patio — https://www.homeadvisor.com/cost/outdoor-living/install-flagstone-patio/ | $15–30 | 2026-06-20 | yes |
| HomeAdvisor flagstone prices — https://www.homeadvisor.com/cost/outdoor-living/flagstone-prices-install-costs | $15–22 (incl. mortar) | 2026-06-20 | yes |
| Lawn Masters — https://lawnmasters.com/costs/flagstone-prices | $15–22 | 2026-07-08 | yes |
| Lawn Love paver patio (above) | flagstone patio $15–25 | 2025-12-27 | yes |
| HomeAdvisor walkway (above) | flagstone $15–30 | 2026-06-17 | yes |
| Homewyse flagstone patio — https://www.homewyse.com/services/cost_to_install_flagstone_patio.html | $24.88–32.06 (6" gravel + sand bed) | 2026-05 | yes |

Rationale: every source has a $15 floor, the typical value sits around $20–23, and the high end is $30–32.

### 1.4 Flagstone, mortared: current 20 / 30 / 45 → **CONFIRMED (thin evidence)**
| Source | Range | Date | Fetched |
|---|---|---|---|
| The Brickyard (above) | mortar-set over existing slab $20–42; wet-set on new concrete $23–45 | 2026-03-25 | yes |
| HomeAdvisor flagstone patio (above) | project totals: dry-laid $1,900–4,400, mortar-set $2,000–5,000, wet-laid $2,700–7,000 | 2026-06-20 | yes |

Rationale: only The Brickyard gives a per-sq-ft split. HomeAdvisor's totals put wet-laid at about 1.4–1.6× dry-laid, and 22 × 1.4 ≈ 30, which supports the typical value. Keep the values and add HomeAdvisor as a second source.

### 1.5 Travertine pavers: current 15 / 20 / 30 → **ADJUST → 15 / 20 / 27**
| Source | Range | Date | Fetched |
|---|---|---|---|
| Stonorama — https://www.stonorama.com/blogs/news/travertine-pavers-cost-guide | $15–27, avg $20 | 2026-06-28 | yes |
| Homewyse travertine — https://www.homewyse.com/services/cost_to_install_travertine_pavers.html | $20.37–26.24 | 2026-05 | yes |
| Cost to Renovate (above) | $15–25 | 2026-03 | yes |
| CostMyYard, citing HomeGuide (above) | $13–45 | 2026-09 | yes (second-hand) |

Rationale: three of the four sources top out at $25–27. The $45 figure is HomeGuide's second-hand premium tail, so I excluded it.

### 1.6 Porcelain pavers: current 16 / 24 / 35 → **CONFIRMED**
| Source | Range | Date | Fetched |
|---|---|---|---|
| Cost to Renovate (above) | $15–22 | 2026-03 | yes |
| NT Pavers — https://ntpavers.com/how-much-do-porcelain-pavers-cost/ | $18–30 | 2026-09-08 | yes |
| CostMyYard (above) | 18 / 28 / 40 | 2026-09 | yes |

Rationale: the low end is $15–18, the typical value about $22–28, and the high end $30–40. The current values sit inside that spread.

### 1.7 Plain concrete (broom): current 6 / 9 / 14 → **ADJUST → 6 / 9 / 12**
| Source | Range | Date | Fetched |
|---|---|---|---|
| Lawn Love concrete patio — https://lawnlove.com/blog/concrete-patio-cost/ | gray slab $4–9 | 2026-10-05 | yes |
| HomeAdvisor concrete patio — https://www.homeadvisor.com/cost/patios-and-walkways/install-concrete-patio/ | no-design slab $4–7; standard gray $5–12 | 2026-06-17 | yes |
| HomeAdvisor walkway (above) | poured concrete $6–12 | 2026-06-17 | yes |
| Concrete Network prices — https://www.concretenetwork.com/concrete-prices.html | plain slab $6.50–10.50; patio $5–18 | 2026-07-14 | yes |
| Today's Homeowner — https://todayshomeowner.com/concrete/cost/cost-to-pour-a-concrete-patio/ | plain $8–15, broom $9–18 | 2025-03-18 | yes |
| Homewyse concrete patio — https://www.homewyse.com/services/cost_to_install_concrete_patio.html | $10.30–12.64 (129 sq ft, no base) | 2026-05 | yes |
| SlabCalc patio — https://www.slabcalc.co/calculators/concrete-patio-cost-calculator | broom $6–12 | 2026-09-25 | yes |

Rationale: the median high is about $12. Today's Homeowner is high across all finishes and dated 2025, so I treated it as an outlier. The value 6 / 9 / 12 also matches SlabCalc.

### 1.8 Stamped concrete: current 12 / 18 / 28 → **ADJUST → 8 / 15 / 28**
| Source | Range | Date | Fetched |
|---|---|---|---|
| HomeAdvisor stamped — https://www.homeadvisor.com/cost/patios-and-walkways/stamped-concrete-patio-install/ | $8–28 (basic $8–12, border $12–18, hand-tooled $18–28) | 2026-06-19 | yes |
| Concrete Network stamped — https://www.concretenetwork.com/stamped-concrete/cost.html | basic $10–14, mid $14–20, high-end $20+ | 2026-01-26 | yes |
| Concrete Network prices (above) | $10–20 | 2026-07-14 | yes |
| HomeAdvisor walkway (above) | $8–20 | 2026-06-17 | yes |
| SlabCalc stamped — https://www.slabcalc.co/calculators/stamped-concrete-cost-calculator | $8–18; premium $16–28 | 2026-09-28 | yes |
| Today's Homeowner (above) | $14–30 | 2025-03-18 | yes |
| Lawn Love concrete (above) | $5–10 | 2026-10-05 | yes (low outlier) |
| Homewyse stamped patio — https://www.homewyse.com/services/cost_to_install_stamped_concrete_patio.html | $23.87–29.04 | 2026-05 | yes (high outlier) |

Rationale: the basic tier starts at $8–10 in every tiered source, so a $12 low misstates entry-level stamping. The median midpoint is about $15. A high of $28 matches the premium tier in both HomeAdvisor and SlabCalc. I excluded Lawn Love ($5–10, below the cost of plain concrete plus the stamping add-on) and Homewyse (small-job minimums).

### 1.9 Exposed aggregate: current 9 / 13 / 18 → **ADJUST → 8 / 12 / 16**
| Source | Range | Date | Fetched |
|---|---|---|---|
| HomeAdvisor concrete driveway — https://www.homeadvisor.com/cost/garages/install-a-concrete-driveway/ | $8–12, avg $10 | 2026-06-20 | yes |
| HomeAdvisor concrete patio (above) | +$2–3 over plain ($4–7) | 2026-06-17 | yes |
| SlabCalc finish estimator — https://www.slabcalc.co/calculators/finish-type-cost-estimator | $8–16 | 2026-09-28 | yes |
| SlabCalc patio (above) | $8–12 | 2026-09-25 | yes |
| Today's Homeowner (above) | $10–18 | 2025-03-18 | yes |
| Homewyse exposed aggregate patio — https://www.homewyse.com/services/cost_to_install_exposed_aggregate_patio.html | $13.73–16.77 | 2026-05 | yes |

Rationale: plain concrete (6 / 9 / 12) plus the commonly cited $2–4 premium gives about 8 / 11.5 / 16. The median midpoint across sources is about $11–12. $18 appears only in Today's Homeowner, which runs high throughout.

---

## 2. MATERIAL_ONLY ($/sq ft, DIY)

### 2.1 Concrete pavers: current 3 / 4.5 / 6 → **ADJUST → 3 / 5 / 8**
| Source | Range | Date | Fetched |
|---|---|---|---|
| Pavingstone Supply retail list — https://pavingstonesupply.com/concretepricing/ | $3.93–9.38 (one outlier at $13.13); most lines $4.80–7.30 | 2026-08-10 | yes |
| HomeAdvisor paver patio (above) | interlocking $3–6, avg $4.50; Pavestone $3–5 | 2026-06-17 | yes |
| Lawn Love paver patio (above) | concrete $4–6, interlocking $3–6 | 2025-12-27 | yes |
| Minimal and Modern (above) | $4–10 | 2026-05-05 | yes |

Rationale: the typical value is right. The high of $6 excludes the premium manufacturer lines, which run $7–9 at retail.

### 2.2 Clay brick: current 4 / 6 / 9 → **ADJUST → 4 / 7 / 10**
| Source | Range | Date | Fetched |
|---|---|---|---|
| Lawn Love paver patio (above) | $4–8; thin brick $3–6 | 2025-12-27 | yes |
| Pavingstone Supply (above) | Mutual Materials red clay $7.70 | 2026-08-10 | yes |
| South Shore Landscape Supply — https://sslandscapesupply.com/product/brick-pine-hall-paver/ | Pine Hall clay paver $2.10 each, ≈ $9.45/sq ft at 4.5 per sq ft (my arithmetic; the listing gives no size) | 2026-10 | yes |
| Minimal and Modern (above) | $5–15 | 2026-05-05 | yes |
| HomeAdvisor paver patio (above) | $10–20 (outlier; probably includes setting) | 2026-06-17 | yes |

Rationale: actual retail full-depth clay pavers cost $7.70–9.45/sq ft, above the current typical. Drop the "derived" note and cite the retail sources.

### 2.3 Flagstone (dry and mortared): current 2 / 8 / 15 → **ADJUST → 2 / 5 / 15**
| Source | Range | Date | Fetched |
|---|---|---|---|
| HomeAdvisor flagstone prices (above) | $2–6 standard; some types $10–15; $200–550/ton, avg $350; 70–140 sq ft/ton | 2026-06-20 | yes |
| Lawn Masters (above) | $2–6 standard, $10–15 premium | 2026-07-08 | yes |
| The Brickyard (above) | $2–15 | 2026-03-25 | yes |
| HomeAdvisor flagstone patio (above) | $4–6 | 2026-06-20 | yes |
| Lawn Love paver patio (above) | $13–30 (outlier) | 2025-12-27 | yes |

Rationale: standard stone costs $2–6 per sq ft. Per-ton math gives the same answer: $350 per ton ÷ 70–140 sq ft per ton ≈ $2.50–5. A typical value of $8 is closer to premium stone. The mortared variant uses the same stone, so the same values apply.

### 2.4 Travertine: current 5 / 8 / 15 → **ADJUST → 4 / 6 / 12**
| Source | Range | Date | Fetched |
|---|---|---|---|
| Stonorama (above) | $5 / $8 / $15; tumbled $5–9, polished silver up to $15 | 2026-06-28 | yes |
| Travertine Mart — https://travertinemart.com/products-page/travertine-pavers | 1.25" buy-now $3.85–7.99; 2" $6.49–11.79 | 2026-10 | yes |
| MegaStone USA — https://www.megastoneusa.com/product-page/16x24-ivory-tumbled-travertine-pavers | 16x24 ivory 1.25" $5.25 | 2026-10 | yes |

Rationale: standard 1.25" tumbled pavers retail at about $4–6, and 2" pool-deck grade at $8–12. Stonorama's high of $15 is polished premium color, and it sells the product it is pricing.

### 2.5 Porcelain: current 8 / 11 / 15 → **ADJUST → 6 / 9 / 15**
| Source | Range | Date | Fetched |
|---|---|---|---|
| NT Pavers (above) | $8–15 | 2026-09-08 | yes |
| Floorlife MSI Arterra 2cm — https://floorlife.com/collections/msi-arterra-porcelain-pavers-coping | $6.99–9.19 | 2026-10 | yes |
| Minimal and Modern (above) | $12–25+ | 2026-05-05 | yes (high outlier) |

Rationale: mainstream 2 cm retail is $7–9/sq ft before freight. Keep $15 as the high for designer lines.

---

## 3. DRIVEWAY_MULTIPLIER: current 1.2 → **CONFIRMED (re-source)**

Like-for-like comparisons from the same publisher:

| Source | Patio / walkway | Driveway | Ratio (mid) | Fetched |
|---|---|---|---|---|
| HomeAdvisor plain concrete (patio vs driveway pages) | $4–7 | $6–8 | 1.27 | yes (2026-06-17 / 06-20) |
| Concrete Network prices | patio $5–18 | driveway $5–21 | 1.13 | yes (2026-07-14) |
| SlabCalc stamped | patio $8–16 | driveway $10–18 | 1.17 | yes (2026-09-28) |
| SlabCalc concrete cost — https://www.slabcalc.co/calculators/concrete-cost-calculator | patio $6–12 | driveway $7–13 | 1.11 | yes (2026) |
| LawnStarter concrete pavers (patio page vs https://www.lawnstarter.com/blog/cost/paver-driveway-price/) | $8–16 | $10–20 | 1.25 | yes (2024-12 / 2025-12-27) |
| HomeAdvisor concrete pavers (walkway vs https://www.homeadvisor.com/cost/garages/install-driveway-pavers/) | $8–15 | $10–25 | 1.52 | yes (2026-06) |

Excluded:
- Homewyse brick paver driveway vs patio ($19.75–25.79 vs $20.03–25.95, ratio ≈ 1.0) and Homewyse concrete driveway vs patio ($9.59–11.78 vs $10.30–12.64, ratio 0.93). Homewyse uses an identical spec for both (mortar-set on existing slab; a 4" slab with no base), so the ratio reflects no structural difference.
- LawnStarter brick, where the driveway range ($10–20) sits below the patio range ($14–24), from different articles.
- HomeAdvisor's overall $8–25 vs $10–50 (ratio 1.8), which mixes premium materials.

Rationale: concrete comparisons cluster at 1.1–1.27 and paver comparisons at 1.25–1.5. A single 1.2 sits at the center of the concrete data and the low end of the paver data, so it is defensible as a blended value. If the tool can split the multiplier, use **pavers 1.25, concrete 1.15**. The current source (`S.homeadvisor`, the brick paver patio page) does not compare driveways to patios per sq ft. Replace it with the HomeAdvisor concrete driveway and concrete patio pages, Concrete Network, and LawnStarter.

---

## 4. REGION_MULTIPLIER

Region membership: Census Northeast; Pacific = CA, OR, WA (AK and HI shown separately); Census Midwest; Census South; Mountain = AZ, CO, ID, MT, NV, NM, UT, WY.

| Index (all relative to U.S. = 1.00) | NE | Pacific | MW | South | Mtn |
|---|---|---|---|---|---|
| DoD Area Cost Factors 2024 (USACE PAX 3.2.1, 29 Mar 2024; all-construction, 63/35/2 material/labor/equipment; state values, population-weighted by me) | 1.09 | 1.19 (1.23 incl. AK/HI) | 0.99 | 0.88 | 0.98 |
| BLS OEWS May 2025, construction laborers 47-2061, mean hourly, employment-weighted | 1.18 | 1.22 | 1.11 | 0.84 | 0.93 |
| BLS OEWS May 2025, cement masons 47-2051, mean hourly | 1.14 | 1.25 | 1.09 | 0.85 | 0.98 |
| BLS OEWS May 2025, landscaping workers 37-3011, mean hourly, employment-weighted | 1.07 | 1.12 | 0.99 | 0.91 | 1.03 |
| Labor blend for paving (0.55 × average of the three wage indices + 0.45 × materials at 1.0) | 1.07 | 1.11 | 1.03 | 0.93 | 0.99 |
| CostMyYard state table, 300 sq ft paver patio (index not disclosed; regional averages are mine) | ~1.10 | ~1.11 | ~1.06 | ~0.92 | ~0.97 |
| SlabCalc concrete cost regional ranges (midpoint ÷ national $9; unsourced, sister site) | 1.28 | 1.22 | 1.00 | 0.89 | 1.00 |

Sources:
- DoD ACF: https://usace.contentdm.oclc.org/digital/api/collection/p16021coll8/id/4495/download (PDF, dated 2024-03-29, fetched and parsed with pdftotext).
- BLS OEWS May 2025: fetched through the BLS Public API v1 (https://api.bls.gov/publicAPI/v1/timeseries/data/), series `OEUS{FIPS}00000000000{SOC}03` for wages and `…01` for employment. National means are $20.33 (37-3011), $25.02 (47-2061) and $28.87 (47-2051). bls.gov HTML returned 403, but the API returned 2025 annual values. I weighted cement mason wages by construction-laborer employment.
- CostMyYard: https://costmyyard.com/calculators/paver-patio-cost/ (2026-09, fetched).
- SlabCalc: https://www.slabcalc.co/calculators/concrete-cost-calculator (2026, fetched).

| Region | Current | Verdict | Recommended | Rationale |
|---|---|---|---|---|
| Northeast | 1.18 | **ADJUST** | **1.10** | DoD ACF 1.09, CostMyYard 1.10 and the labor blend 1.07 agree. Only raw laborer wages (1.18) and unsourced SlabCalc (1.28) reach 1.18. |
| Pacific | 1.25 | **ADJUST** | **1.18** | DoD ACF 1.19 for the contiguous states. The labor indices run 1.12–1.25, and CostMyYard and the labor blend give 1.11. 1.25 is the top of the evidence. |
| Midwest | 1.00 | **CONFIRMED** | 1.00 | ACF 0.99, labor blend 1.03, CostMyYard 1.06, SlabCalc 1.00. |
| South | 0.90 | **CONFIRMED** | 0.90 | ACF 0.88, CostMyYard 0.92, labor blend 0.93, SlabCalc 0.89. |
| Mountain / SW | 1.00 | **CONFIRMED** | 1.00 (0.98 acceptable) | ACF 0.98, CostMyYard 0.97, labor blend 0.99, SlabCalc 1.00. |

Replace `S.projectcostpro` (unreliable, see top) with the DoD ACF and BLS OEWS sources on /methodology. Big metros (NYC, SF Bay, Boston, Seattle) run well above their regional factor. The DoD ACF lists individual installations; for example Massachusetts is 1.18 and California 1.24. Add a note that metro pricing can exceed the regional multiplier.

---

## 5. SlabCalc (sister site) vs pourcanvas: inconsistencies

| Finish | pourcanvas current | SlabCalc | Conflict | Clears with recommended values? |
|---|---|---|---|---|
| Plain / broom | 6 / 9 / 14 | patio page $6–12; cost calc $6–12 (most $8–10); **stamped page "plain broom-finish $4–8"** | our high of 14 is above SlabCalc's 12 | yes, 6 / 9 / 12 |
| Stamped | 12 / 18 / 28 | $8–18 headline; tiers $8–12 / $12–16 / $16–28; patio $8–16 | our low of 12 conflicts with SlabCalc's $8; our typical of 18 equals SlabCalc's headline maximum | yes, 8 / 15 / 28 |
| Exposed aggregate | 9 / 13 / 18 | patio page $8–12; finish estimator $8–16; cost calc "add $3–8" | our high of 18 is above both; SlabCalc disagrees with itself | yes, 8 / 12 / 16 (matches finish estimator) |
| Driveway multiplier | 1.2 | stamped patio $8–16 vs driveway $10–18 (1.17); slab patio $6–12 vs driveway $7–13 (1.11) | none | — |
| Regional | NE 1.18, Pac 1.25 | implied NE 1.28, West 1.22, MW 1.00, Mtn 1.00, SE 0.89 | SlabCalc's NE is above every other index | recommend SlabCalc also move to about NE 1.10 / West 1.18 |

SlabCalc's internal inconsistencies, which should be fixed on that site:
1. The calculator widget's "Professional Installation $3.00–8.00/sq ft" contradicts the headline $6–12 (patio page) and $8–18 (stamped page).
2. The stamped page gives plain broom at $4–8, while the patio and cost-calculator pages give $6–12.
3. Exposed aggregate is $8–12 on the patio page and $8–16 on the finish estimator.
4. Pro Tips say stamped adds "$2–4" and colored "$1–3", which conflicts with the body text ($8–18 total; colored +$2–5). On the cost calculator, decorative finishes add "$2–4" in Pro Tips but "$3–8" in the body.
5. The finish estimator lists polished at $5–12 in the summary but $8–15 in the table, and stained at $6–15 vs $6–12 / $6–13.

---

## Summary

| Constant | Current | Verdict | Recommended |
|---|---|---|---|
| INSTALLED concrete-paver | 10 / 15 / 22 | ADJUST | 8 / 14 / 22 |
| INSTALLED clay-brick | 12 / 18 / 26 | CONFIRMED | 12 / 18 / 26 |
| INSTALLED flagstone-dry | 15 / 22 / 32 | CONFIRMED | 15 / 22 / 32 |
| INSTALLED flagstone-mortared | 20 / 30 / 45 | CONFIRMED (thin) | 20 / 30 / 45 |
| INSTALLED travertine | 15 / 20 / 30 | ADJUST | 15 / 20 / 27 |
| INSTALLED porcelain | 16 / 24 / 35 | CONFIRMED | 16 / 24 / 35 |
| INSTALLED plain-concrete | 6 / 9 / 14 | ADJUST | 6 / 9 / 12 |
| INSTALLED stamped-concrete | 12 / 18 / 28 | ADJUST | 8 / 15 / 28 |
| INSTALLED exposed-aggregate | 9 / 13 / 18 | ADJUST | 8 / 12 / 16 |
| MATERIAL_ONLY concrete-paver | 3 / 4.5 / 6 | ADJUST | 3 / 5 / 8 |
| MATERIAL_ONLY clay-brick | 4 / 6 / 9 | ADJUST | 4 / 7 / 10 |
| MATERIAL_ONLY flagstone-dry | 2 / 8 / 15 | ADJUST | 2 / 5 / 15 |
| MATERIAL_ONLY flagstone-mortared | 2 / 8 / 15 | ADJUST | 2 / 5 / 15 |
| MATERIAL_ONLY travertine | 5 / 8 / 15 | ADJUST | 4 / 6 / 12 |
| MATERIAL_ONLY porcelain | 8 / 11 / 15 | ADJUST | 6 / 9 / 15 |
| DRIVEWAY_MULTIPLIER | 1.2 | CONFIRMED (re-source) | 1.2 (or pavers 1.25 / concrete 1.15) |
| REGION northeast | 1.18 | ADJUST | 1.10 |
| REGION pacific | 1.25 | ADJUST | 1.18 |
| REGION midwest | 1.00 | CONFIRMED | 1.00 |
| REGION south | 0.90 | CONFIRMED | 0.90 |
| REGION mountain | 1.00 | CONFIRMED | 1.00 |

Source hygiene for `paving.ts`:
- Remove `homeguidePavers`, `homeguideAggregate` and `projectcostpro`.
- Fix the `todayshomeowner` URL.
- Add HomeAdvisor (walkway, concrete patio, concrete driveway, stamped, flagstone), Concrete Network, LawnStarter, Cost to Renovate, NT Pavers, Lawn Masters, Pavingstone Supply, Travertine Mart, Floorlife, DoD ACF 2024 and BLS OEWS May 2025.
