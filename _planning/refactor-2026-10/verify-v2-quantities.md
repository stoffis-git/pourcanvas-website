# Verification v2: paving quantity and price constants

Scope: `src/lib/tools/data/paving.ts`, items 1–12 from the task. Method follows `numbers-verification-brief.md`. Every value below was read from a page or PDF that was actually fetched (WebFetch, curl + `pdftotext`, or Chrome page text). Snippet-only values are marked as such and not used for verdicts.

Checked 2026-10-10.

Blocked during this run, so not used: homedepot.com (403 / Akamai "Access Denied", also in Chrome), lowes.com, menards.com, walmart.com and angi.com (bot or CAPTCHA walls, which were not bypassed), ewingoutdoorsupply.com, forbes.com, hellogravel.com, mygravelmonkey.com, paveroutlet.com, classiclandscapes.com. HomeGuide blocks WebFetch but loaded in Chrome.

---

## 1. `BASE_DEPTH_IN`: patio 4, driveway 8, poor soil +2

| | Current | Verdict | Recommended |
|---|---|---|---|
| patio | 4 in | **CONFIRMED** | 4 |
| driveway | 8 in | **CONFIRMED** (as a typical value, not the ICPI minimum) | 8 |
| poorSoilExtra | +2 in | **CONFIRMED** (low end of ICPI's 2–4 in) | 2 |

Sources:
- ICPI Tech Spec 2, *Construction of Interlocking Concrete Pavements*, revised Feb 2020 (ORCO copy), https://www.orco.com/wp-content/uploads/2022/08/ICPI-TechSpec2-ORCO.pdf, fetched yes. It says patios and pedestrian areas need a minimum of 4 in (100 mm) compacted base on well-drained soils, and residential driveways at least 6 in (150 mm). Colder climates and continually wet or weak soils need bases at least 2 to 4 in (50–100 mm) thicker.
- ICPI Tech Spec 10, *Application Guide*, revised Mar 2022 (CMHA), https://www.cmha.org/wp-content/uploads/2023/12/TechSpec10-ApplicationGuide2022.pdf, fetched yes. Minimum base for walks is 4–6 in, for driveways 6–8 in.
- Belgard *Technical Resource Guide*, revised 12/2025, https://www.belgard.com/wp-content/uploads/sites/2/Technical-Resource-Guide_WEB_BEL25-D-516650.pdf, fetched yes. Its minimum base table gives 4 in for patios and 6 in for residential driveways.
- Belgard *Quick Reference Install Guide* (2023, uploaded 2025-11), https://www.belgardcommercial.com/wp-content/uploads/2025/11/Belgard-Concrete-Pavers-Quick-Reference-Install-Guide-2023.pdf, fetched yes. It calls for 4–8 in of base compacted in 2–4 in lifts, and 10–12 in of excavation in freeze-thaw climates.
- Unilock, *Do's and Don'ts of Paver Installation: Base Preparation*, https://unilock.com/diy/dos-and-donts-of-paver-installation-base-preparation-23/ (© 2026, undated), fetched yes. It gives 4–6 in for pedestrian walkways and 8–12 in for driveways.

Rationale: 4 in is the ICPI/Belgard minimum for patios. 8 in for driveways sits between the ICPI/Belgard minimum (6), ICPI TS10 (6–8) and Unilock (8–12), so it is a sound typical value. Copy should not call it "the ICPI minimum". +2 in is the low end of ICPI's 2–4 in.

Source fix: the current `S.icpi` label ("ICPI Tech Spec 4 (base thickness), via CalcSummit") is wrong. Tech Spec 4 covers roads and parking lots. Cite **Tech Spec 2** (and TS10) directly, using the ORCO and CMHA PDF URLs above.

## 2. `BEDDING_SAND_IN`: 1 in

**CONFIRMED** at 1 in.
- ICPI TS2 (Feb 2020, as above), fetched yes. Bedding sand is spread and screeded to a nominal 1 in (25 mm), uncompacted.
- Belgard Technical Resource Guide (12/2025) gives a bedding layer of "1-in nominal". The Belgard Quick Reference says "nominal 1" uncompacted bedding sand". Both fetched yes.
- ICPI TS10 (2022) allows 1 to 1½ in uncompacted, fetched yes.

Rationale: all three manufacturer and association documents agree on 1 in nominal.

## 3. `COMPACTION_FACTOR`: 1.2

**CONFIRMED** at 1.2, which is the low end of the consensus. See item 4 for how it combines with density.
- Toolgrit, *Aggregate Compaction & Ordering*, 2026-03-03, https://www.toolgrit.com/guides/aggregate-compaction-ordering, fetched yes. Compacted volume is typically 80–85% of loose, which works out to ×1.18–1.25.
- Smoky Mountain Stone & Gravel, *Aggregate tons vs cubic yards*, 2026-08-04, https://smokymountainsg.com/blog/33-aggregate-tons-vs-cubic-yards, fetched yes. Loose gravel compacts about 15–20%, and 5 in loose gives about 4 in finished (×1.25).
- OutdoorBrite paver calculator (current source), reviewed 2026-06-12, https://www.outdoorbrite.com/tools/paver-calculator, fetched yes. It uses +20% but cites no source, so it is weak on its own.
- Cross-check against IDOT's in-place factor (item 4): 1.80 ÷ 1.4–1.5 loose gives ×1.20–1.29.

Rationale: 1.2 falls inside every fetched range (1.18–1.29). Replace the OutdoorBrite citation with Toolgrit and Smoky Mountain.

## 4. `GRAVEL_TONS_PER_YD3` 1.4 and `SAND_TONS_PER_YD3` 1.35

| | Current | Verdict | Recommended |
|---|---|---|---|
| gravel (loose, as sold) | 1.4 | **ADJUST** | **1.5** |
| sand | 1.35 | **CONFIRMED** | 1.35 |

Gravel sources:
- Illinois DOT, *MISTIC Pay Item / Material Conversion Factor Report* (2020-06-10), https://idot.illinois.gov/content/dam/soi/en/web/idot/documents/doing-business/reports/highways/materials/mistic-pay-item-material.pdf, fetched yes (PDF). Aggregate base course A/B (crushed stone CA06) is 1.80 tons/yd³ in place. AGG BASE CSE A 4 (4 in) is 0.20 ton/yd², which also works out to 1.80 t/yd³ compacted. Open-graded CA11 (French drains) is 1.35. Porous granular is 1.50.
- Kokosing Materials tonnage calculator (© 2026), https://www.kokosing.biz/our-work/materials/aggregate/resources/tonnage-calculator/, fetched yes. It uses cy × 1.75 for base materials, 1.65 for coarse and 1.5 for fine.
- Smoky Mountain S&G (2026-08-04), fetched yes. Crusher run (limestone) is 1.4–1.5, #411 is 1.4 and #57 is 1.3.
- Toolgrit (2026-03-03), fetched yes. Loose crushed limestone base is 1.35–1.45 t/yd³.
- HomeGuide, *Gravel prices*, 2025-12-19, https://homeguide.com/costs/gravel-prices, fetched yes (Chrome). It says 1 yd³ contains 1.4–1.5 tons.
- GoodGravel, *Crusher run* (© 2026), https://goodgravel.com/gravel/types/crusher-run, fetched yes. Crusher run is 1.50–1.70 t/yd³.

Rationale (gravel): the code computes tons as compacted volume × 1.2 × 1.4 = **1.68 t per compacted yd³**. IDOT's state DOT factor for compacted dense-graded base is **1.80**, so the calculator orders about 7% too little. Raising the loose factor to 1.5 (still within the supplier range of 1.4–1.5, below Kokosing's 1.75 and GoodGravel's 1.5–1.7) gives 1.2 × 1.5 = 1.80, which matches IDOT exactly. Effect on 12×16 at 4 in: 4.0 t becomes 4.3 t. The alternative is to keep 1.4 and raise compaction to 1.29. Changing density is preferred, because 1.2 is the more widely published compaction figure.

Sand sources:
- HomeGuide, *Sand delivery cost*, 2026-06-03, https://homeguide.com/costs/sand-delivery-cost, fetched yes (Chrome). A cubic yard of sand weighs roughly 2,700 lb (about 1.35 tons). Dry sand runs 1.25–1.45 tons.
- IDOT MISTIC (above): sand backfill is 1.35 t/yd³.
- Smoky Mountain S&G: concrete sand 1.5, mason sand 1.4. Kokosing: fine materials 1.5.

Rationale (sand): 1.35 is the value given by both HomeGuide and IDOT and sits within the 1.25–1.5 range. Bedding sand is not compacted before laying, so no compaction factor applies. Optional: 1.4 would be a slightly more conservative middle value, but no change is required.

## 5. `BAG_CUFT` 0.5 and a new bag-price constant

**CONFIRMED**: 0.5 cu ft.
- Hammond Hardware, *Quikrete 1175-45 HardScapes Paver Base, Ground Gravel, 0.5 Cu. Ft.*, https://www.hammondhardware.com/p/quikrete-hardscapes-paver-base-039645117590, fetched yes. Price $7.49.
- Max Warehouse, *Quikrete HardScapes Brown Sand Paver Sand 0.5 cu ft 50 lb (1175-40)*, https://www.maxwarehouse.com/products/quikrete-paver-sand-50-lb, fetched yes. Price $6.25 each ($6.06 for 10+).
- ToolBox Supply, *Quikrete 1175-45 HardScapes Paver Base Sand, 0.5 Cu.Ft.*, https://www.toolboxsupply.com/products/quikrete-1175-45-hardscapes-paver-base-sand-0-5-cu-ft, fetched yes. Price $19.92 (online, out of stock; excluded as a shipping-loaded outlier).
- HomeGuide gravel (2025-12-19), fetched: crushed limestone runs $3–$5 per bag. HomeGuide sand (2026-06-03), fetched: a 50 lb bag of sand costs $4–$6 at home centers.
- Home Depot Pavestone 98001 (the current source) returned 403 to WebFetch, curl and Chrome, so it was **not fetched**. Search snippets only: the pallet is $824–$949 for 64 bags (about $13–15 per bag), and the Pavestone 0.5 cu ft paver sand is $5.97. Not used.

Recommended new constants (UI copy should say these are store-dependent):
- `BASE_BAG_PRICE` (0.5 cu ft paver base): low 5 / typical 7.5 / high 10
- `SAND_BAG_PRICE` (0.5 cu ft paver/bedding sand): low 4 / typical 6 / high 8

Rationale: two fetched retail prices ($7.49 base, $6.25 sand) plus HomeGuide's bag ranges. Because Home Depot and Lowe's could not be fetched, keep these `pending` until someone checks HD in a normal browser session.

## 6. `GRAVEL_PRICE_PER_TON`, `SAND_PRICE_PER_TON`, `DELIVERY_FLAT`

| | Current | Verdict | Recommended |
|---|---|---|---|
| gravel $/ton (base / crusher run) | 20 / 35 / 55 | **ADJUST** | **20 / 30 / 45** |
| sand $/ton | 25 / 35 / 45 | **ADJUST** (high only) | **25 / 35 / 50** |
| delivery flat | 50 / 100 / 150 | **CONFIRMED** | 50 / 100 / 150 |

Gravel sources:
- HomeGuide gravel prices (2025-12-19), fetched yes (Chrome). Road base $18–$30/ton (another passage gives $18–$31), crusher run $24–$34, crushed limestone $30–$38. Small quantities cost more than $100/ton.
- GravelGenie, *Gravel cost per ton*, updated 2026-09-25, https://gravelgenie.com/guides/gravel-cost-per-ton, fetched yes. Crusher run (driveway and patio base) $20–$35, #57 $25–$45, crushed limestone $25–$40.
- GoodGravel crusher run (© 2026), fetched yes. $14–$38 per ton at the quarry.
- CrushedStoneCalculator, 2026-05-07, https://crushedstonecalculator.com/crushed-stone-cost-per-ton-2026/, fetched yes. #57 limestone $35–$50.

Rationale: paver base is dense-graded crusher run or road base, and the shared band for it is about $18–$38 (midpoint about $28–30). A high of $45 covers #57 and clean stone at the upper end. $55 is above every fetched base-material range. Delivered small orders over $100/ton are covered by the separate delivery fee.

Sand sources:
- HomeGuide sand delivery (2026-06-03), fetched yes. Coarse/concrete sand $25–$50, unwashed paver sand $25–$45, washed paver sand $35–$50.
- One and Done Prep, *Cost of bulk sand*, 2026-07-24, https://oneanddoneprep.com/cost-of-bulk-sand/, fetched yes. Concrete sand $25 / $45 / $60, paver sand $40 / $55 / $80.
- Yard & Bag, *Sand prices per ton* ("as of early 2025", © 2026), https://www.yardandbag.com/articles/sand-prices-per-ton-2026/, fetched yes. Concrete sand $15–$25. Excluded as low and stale (dated early 2025).

Rationale: low 25 and typical 35 are shared by HomeGuide and One and Done. Washed bedding sand reaches $50 in both, so the high moves from 45 to 50.

Delivery sources:
- HomeGuide sand delivery (2026-06-03), fetched yes. Delivery fees alone usually run $50–$150 for local drops: $50–$100 within 10–15 miles, $100–$200 within 15–30 miles.
- GravelGenie (2026-09-25): $50–$150 within about 20 miles. GoodGravel: $50–$150 within 10–15 miles. One and Done: $50 / $100 / $200+. All fetched yes.
- HomeGuide gravel gives a different model ($10–$25 per ton, or free above 5 tons within 5 miles), noted only.

Rationale: four independent sources state $50–$150. Re-cite these instead of the generic `S.aggregate` (hellogravel.com, which now returns 403).

## 7. `POLY_BAG_PRICE` and `POLY_COVERAGE`

| | Current | Verdict | Recommended |
|---|---|---|---|
| price per 50 lb | 30 / 50 / 80 | **CONFIRMED** | 30 / 50 / 80 |
| coverage, narrow joints | 70 sq ft | **CONFIRMED** | 70 |
| coverage, wide joints | 33 sq ft | **CONFIRMED** | 33 |

Coverage sources:
- Alliance Gator, *Gator Maxx G2* product page (linked TDS dated 2025-06-02), https://alliancegator.com/gator-jointing-material/gator-maxx-g2/, fetched yes. Per 50 lb bag on 2-3/8 in pavers: narrow joints (1/8–3/8 in) 65–85 sq ft, wide joints (3/4–1-1/4 in) 22–42 sq ft. Black Diamond color: 58–76 and 20–38.
- Techniseal HP NextGel at Green Builders Supply, https://www.greenbuilderssupply.com/store/p861/Techniseal_ProSeries_HP_NextGel_Polymeric_Sand.html, fetched yes. 60–120 sq ft for narrow joints, 25–40 sq ft for wide. The Techniseal TDS (via vanbeeks.com PDF, fetched) gives joint limits but no coverage.
- Sakrete PermaSand TDS, https://www.sakrete.com/wp-content/uploads/2021/12/PermaSand-TDS.pdf, fetched yes. A 40 lb pail covers 30–45 sq ft at a 1/4 in joint on a 2 in paver (about 37–56 sq ft per 50 lb equivalent).
- DOMINATOR (Black Diamond Coatings), https://blackdiamondcoatings.com/products/dominator-polymeric-sand, fetched yes. About 80 sq ft per 40 lb bag at a 1/8 in by 1 in joint.

Rationale: 70 sits inside Gator's narrow range (65–85) and Techniseal's (60–120), and is conservative. 33 is the midpoint of Gator's 22–42 and inside Techniseal's 25–40. The current note text matches Gator exactly. Cite the Gator product page URL instead of the homepage.

Price sources:
- PolymericSandStore collection, https://polymericsandstore.com/collections/polymeric-sands, fetched yes. 50 lb pro brands: Techniseal HP NextGel $84.99, Gator Super Sand G2 $74.99 (regular $84.99), Gator Maxx G2 from $72.99 (regular $89.99), SEK PolySweep $79.99, Techniseal SmartSand $74.99.
- Green Builders Supply, Techniseal HP NextGel, fetched yes. $49.99–$57.99.
- Earthstone, Sakrete Polymeric Sand, https://earthstonerock.com/products/sakrete-polymeric-sand, fetched yes. 40 lb bag $24.99 (about $31 per 50 lb equivalent).
- Live Oak Supply, https://liveoaksupply.com/1175-56/, fetched yes. SEK PolySweep 50 lb bag $27–$33.

Rationale: big-box and budget brands run about $25–$33, dealer pro brands about $50–$58, and online pro brands with shipping about $75–$90. 30/50/80 fits all three tiers.

## 8. `EDGING_PRICE_PER_LF`: 1.5 / 2.5 / 4

**CONFIRMED.**
- Mutual Materials, *Snap Edge 8′ Edge Restraint*, https://www.mutualmaterials.com/product/edging-snap-edge-8-edge-restraint/, fetched yes. $13.80 per 8 ft ($1.73/LF). Spikes are sold separately at $0.69 each (10 in × 3/8 in).
- Sureloc Edging, *Landscape edging vs paver edging*, 2026-02-23, https://surelocedging.com/feeds/blog/landscape-edging-paver-edging, fetched yes. Plastic restraints $1.70–$3.00/LF, aluminum $2.80–$4.00/LF.
- United Turf (San Diego, the current source), 2026-07-26, https://www.unitedturf.co/resources/paver-edging-san-diego-why-it-matters-what-it-costs, fetched yes. Plastic $1–$3/LF material only. Its aluminum figure ($7–$12) is ambiguous between material and installed, so it is excluded.

Rationale: plastic plus spikes comes to about $1.70–$2.40/LF and aluminum to $2.80–$4.00, so 1.5 / 2.5 / 4 spans both. Add Mutual Materials and Sureloc as sources.

## 9. `REMOVAL_PER_SQFT`

| | Current | Verdict | Recommended |
|---|---|---|---|
| sod | 1 / 2 / 3 | **ADJUST** | **0.5 / 1 / 2** |
| concrete | 2 / 4 / 6 | **CONFIRMED** | 2 / 4 / 6 |

Sod sources:
- HomeGuide, *Sod and grass removal cost*, 2025-10-31, https://homeguide.com/costs/sod-and-grass-removal-cost, fetched yes (Chrome). Grass removal $0.50–$2.00/sq ft. Sod removal plus lawn replacement $1.00–$3.00.
- Lawn Love, *Grass removal cost*, updated 2025-12-27, https://lawnlove.com/blog/grass-removal-cost/, fetched yes. $0.60–$1.10/sq ft including labor and materials.
- GreenPal, *Grass removal cost*, 2026-02-27, https://www.yourgreenpal.com/blog/grass-removal-cost, fetched yes. $0.50–$1.20 on average. Sod removal $0.50–$2.00 with disposal billed separately.

Rationale: all three sources put sod removal at $0.50–$2.00. The current 1/2/3 matches HomeGuide's "remove and **replace** lawn" figure, not removal alone. Stonorama (the current source) is a travertine vendor and was not re-fetched.

Concrete sources:
- Lawn Love, *Concrete removal cost*, updated 2025-12-27, https://lawnlove.com/blog/concrete-removal-cost/, fetched yes. $2–$6/sq ft.
- Fixr, *Concrete removal*, updated 2025-01-31, https://www.fixr.com/costs/concrete-removal, fetched yes. $2–$6/sq ft, averaging about $4.
- HomeGuide, *Concrete removal cost*, 2025-05-27, https://homeguide.com/costs/concrete-removal-cost, fetched yes (Chrome). $3–$8/sq ft. A 10×10 slab costs $300–$800.

Rationale: two sources state exactly 2–6 with an average of 4. HomeGuide runs somewhat higher, and is noted but does not shift the consensus. Re-point the source from the Lawn Love *patio* page to the Lawn Love *concrete removal* page.

## 10. `FLAGSTONE_SQFT_PER_TON`

| | Current | Verdict | Recommended |
|---|---|---|---|
| 1 in | 150 | **ADJUST** | **130** |
| 1.5 in | 100 | **ADJUST** | **90** |
| 2 in | 80 | **CONFIRMED** | 80 |

Sources:
- Valley City Supply, *Calculating natural landscape stone* (© 2026), https://www.valleycitysupply.com/calculating-natural-landscape-stone, fetched yes. 1 in → 150, 1½ in → 100, 2 in → 80 sq ft per ton. This is where the current values come from.
- Acme Sand & Gravel, *Flagstone thickness, coverage, delivery* (2015 PDF), https://www.acmesand.com/wp-content/uploads/2015/08/Flagstone-Thickness-Coverage-Delivery08-15.pdf, fetched yes. Select Thin (1¼ in minus, ¾–1¼ in): 140–160. Select Regular (1¾ in minus): 115–125. 2 in Heavy (1½–2¼ in): 80–90. This is sandstone at about 140 lb/ft³, lighter than most stone. The PDF is old, but coverage is a physical property.
- Wicki Stone, *Stone weights and coverages*, 2025-05 PDF, https://wickistone.com/wp-content/uploads/2025/05/Stone-Weights-And-Coverages-By-Wicki-Stone.pdf, fetched yes. Irregular flagstone 1 in → 115, 1.5 in → 80, 2 in → 70.
- Earthstone Resources, *Material coverage* (© 2026), https://earthstone.us/home-2/, fetched yes. 1–1.5 in → 100–130, 1.5–2 in → 90–110.
- CalcMaterials, *Flagstone calculator* (© 2026), https://calcmaterials.com/flagstone-calculator/, fetched yes. 1 in → 110–120, 1.5 in → 75–80, 2 in → 60–80. It recommends 10–20% waste (15% for irregular random).

Rationale: suppliers split into two camps, about 150/100/80 (Valley City, Acme) and about 115/80/70 (Wicki, CalcMaterials). Earthstone sits between them. Real "1 in" irregular flag runs thicker than nominal, which is why the lower camp exists. Overstating coverage makes users order too little, so move 1 in and 1.5 in to the cross-supplier middle (130, 90). 2 in at 80 is the median (Valley 80, Acme 80–90, Wicki 70, CalcMaterials 60–80) and stays. A physics check at 165 lb/ft³ solid gives 145 / 97 / 73, consistent with the recommended values. Add these supplier URLs as sources; the `sources` arrays are currently empty.

## 11. `PATTERN_WASTE` and `CURVED_EXTRA_WASTE`

| Pattern | Current | Verdict | Recommended |
|---|---|---|---|
| running / stack bond | 5% | **CONFIRMED** | 5% |
| basketweave | 10% | **ADJUST** | **7%** |
| random / ashlar | 10% | **UNVERIFIABLE** (for pavers) | keep 10% but phrase as "about 10%"; see the flagstone note |
| herringbone (45°) | 15% | **CONFIRMED** | 15% |
| curved edges | +5% | **CONFIRMED** | +5% |

No manufacturer publishes pattern waste. Belgard's Technical Resource Guide (12/2025) and Quick Reference, Unilock's base guide, and ICPI TS2/TS10 were all fetched and searched, and none of them states a percentage. The sources below are estimating guides and calculators.
- Toolgrit, *Brick & paver estimating guide*, 2026-03-09, https://www.toolgrit.com/guides/brick-paver-estimating-guide, fetched yes. Running bond 3–5%, stack bond 2–4%, basketweave 5–8%, herringbone 90° 8–12%, 45° 10–15% (12–15% on rectangles), curves +3–5%. No percentage for random/ashlar.
- OutdoorBrite paver calculator (reviewed 2026-06-12), fetched yes. Running bond 5%, stack 3%, basketweave 5%, 90° herringbone 10%, 45° herringbone 15%.
- CalcSummit paver calculator (May 2026), https://calcsummit.com/calculators/construction/paver/, fetched yes. Running 5%, stack 5%, basketweave 7%, 90° herringbone 10%, 45° herringbone 15%, circle/fan 20%.
- WC Pavers, *Brick paver quantities*, 2026-09-16, https://wcpavers.com/brick-paver-quantities/, fetched yes. Simple running bond 5%, 45° herringbone 10–15%, borders, corners and curves about 10%.
- PaverCalculator.net, *How to add waste*, 2026-04-06, https://pavercalculator.net/blog/how-to/how-to-add-waste-for-paver-cuts-and-breakage/, fetched yes. Running bond 5–10%, herringbone 15–20%, curved 10–15%+.

Rationale: running 5% and 45° herringbone 15% are shared by every source. Basketweave is 5–8% in all three sources that list it, so 10% is above consensus; use 7%. No fetched source gives a figure for random/ashlar pavers. Curves at +5% is the top of Toolgrit's +3–5%.

Flagstone note: `paving.ts:128` reuses `PATTERN_WASTE.random` (10%) as flagstone waste. CalcMaterials (fetched) recommends 10% for cut layouts and 15% for irregular random flagstone. Consider a separate `FLAGSTONE_WASTE = 0.15` sourced to CalcMaterials, which would decouple flagstone from the unverifiable paver "random" value.

## 12. Plate compactor rental per day (new constant)

**New value**: `COMPACTOR_RENTAL_PER_DAY` low **60** / typical **95** / high **130** (standard forward plate, the DIY patio case). Add a note that a reversible plate (driveway base) runs $130–$160/day.

Sources:
- rentd, *Plate compactor rental cost (2026)*, updated July 2026, https://www.rentd.com/plate-compactor-rental/, fetched yes. All classes $50–$150/day. Single-direction $44–$56/day and $141–$202/week. Reversible $132–$158/day.
- CountBricks, Washington, 2026-03-11, https://www.countbricks.com/post/plate-compactor-rental-washington-retaining-wall-construction, fetched yes. Sunbelt $95/day ($350/week). United Rentals $99/day. **Home Depot Tool Rental $99/day** ($693/week).
- CountBricks, Austin, 2026-07-26, https://www.countbricks.com/post/plate-compactor-rental-austin-concrete-driveway, fetched yes. Sunbelt $79/day, Minuteman $80, Jon's Rental $60.
- CountBricks, New York, 2026-07-27, https://www.countbricks.com/post/plate-compactor-rental-new-york-stormwater-retention-system, fetched yes. Local yards $80–$116/day. A NY OGS contract price of $50/day is excluded as a government contract rate.
- Home Depot's own rental page (`homedepot.com/p/rental/20-in-Vibratory-Plate-Compactor-Rental-8708/316821995`) could not be fetched (403). Its price is known only through CountBricks' $99/day.

Rationale: retail daily quotes cluster between $60 and $116 (median about $95, matching HD, United and Sunbelt Washington). rentd's single-direction class rate ($44–$56) looks like a wholesale or aggregated figure and was used only for the low end. Keep this `pending` until someone confirms the Home Depot price in a normal browser.

---

## Summary table

| # | Constant | Current | Verdict | Recommended |
|---|---|---|---|---|
| 1 | BASE_DEPTH_IN.patio | 4 | CONFIRMED | 4 (cite ICPI TS2, not TS4) |
| 1 | BASE_DEPTH_IN.driveway | 8 | CONFIRMED (typical; ICPI min is 6) | 8 |
| 1 | BASE_DEPTH_IN.poorSoilExtra | 2 | CONFIRMED (ICPI 2–4) | 2 |
| 2 | BEDDING_SAND_IN | 1 | CONFIRMED | 1 |
| 3 | COMPACTION_FACTOR | 1.2 | CONFIRMED | 1.2 |
| 4 | GRAVEL_TONS_PER_YD3 | 1.4 | ADJUST | 1.5 (×1.2 = IDOT 1.80 in place) |
| 4 | SAND_TONS_PER_YD3 | 1.35 | CONFIRMED | 1.35 |
| 5 | BAG_CUFT | 0.5 | CONFIRMED | 0.5 |
| 5 | BASE_BAG_PRICE (new) | — | new, pending HD check | 5 / 7.5 / 10 |
| 5 | SAND_BAG_PRICE (new) | — | new, pending HD check | 4 / 6 / 8 |
| 6 | GRAVEL_PRICE_PER_TON | 20/35/55 | ADJUST | 20 / 30 / 45 |
| 6 | SAND_PRICE_PER_TON | 25/35/45 | ADJUST (high) | 25 / 35 / 50 |
| 6 | DELIVERY_FLAT | 50/100/150 | CONFIRMED | 50 / 100 / 150 |
| 7 | POLY_BAG_PRICE | 30/50/80 | CONFIRMED | 30 / 50 / 80 |
| 7 | POLY_COVERAGE.narrow | 70 | CONFIRMED | 70 |
| 7 | POLY_COVERAGE.wide | 33 | CONFIRMED | 33 |
| 8 | EDGING_PRICE_PER_LF | 1.5/2.5/4 | CONFIRMED | 1.5 / 2.5 / 4 |
| 9 | REMOVAL_PER_SQFT.sod | 1/2/3 | ADJUST | 0.5 / 1 / 2 |
| 9 | REMOVAL_PER_SQFT.concrete | 2/4/6 | CONFIRMED | 2 / 4 / 6 |
| 10 | FLAGSTONE_SQFT_PER_TON["1"] | 150 | ADJUST | 130 |
| 10 | FLAGSTONE_SQFT_PER_TON["1.5"] | 100 | ADJUST | 90 |
| 10 | FLAGSTONE_SQFT_PER_TON["2"] | 80 | CONFIRMED | 80 |
| 11 | PATTERN_WASTE.running-bond | 5% | CONFIRMED | 5% |
| 11 | PATTERN_WASTE.basketweave | 10% | ADJUST | 7% |
| 11 | PATTERN_WASTE.random | 10% | UNVERIFIABLE | keep 10% as "about"; add FLAGSTONE_WASTE 15% |
| 11 | PATTERN_WASTE.herringbone (45°) | 15% | CONFIRMED | 15% |
| 11 | CURVED_EXTRA_WASTE | 5% | CONFIRMED | 5% |
| 12 | COMPACTOR_RENTAL_PER_DAY (new) | — | new, pending HD check | 60 / 95 / 130 |

### Source-object fixes for `S` in paving.ts
- `icpi`: replace with ICPI Tech Spec 2 (ORCO PDF, Feb 2020) and Tech Spec 10 (CMHA PDF, Mar 2022). Optionally add Belgard TRG (12/2025) and Unilock.
- `outdoorbrite` (compaction): replace with Toolgrit aggregate compaction (2026-03-03) and Smoky Mountain S&G (2026-08-04).
- `aggregate` (hellogravel.com, now 403): replace with IDOT MISTIC (density), HomeGuide gravel (2025-12-19), GravelGenie (2026-09-25), HomeGuide sand delivery (2026-06-03).
- `gator`: point to https://alliancegator.com/gator-jointing-material/gator-maxx-g2/.
- `edging`: add Mutual Materials Snap Edge and Sureloc (2026-02-23).
- Sod removal: replace `stonorama` with HomeGuide sod/grass removal, Lawn Love grass removal and GreenPal.
- Concrete removal: replace `lawnloveConcrete` (patio page) with Lawn Love concrete removal and Fixr.
- Flagstone coverage: add Valley City Supply, Acme, Wicki Stone, Earthstone and CalcMaterials.
- `homedepotBase`: keep it, but note it could not be fetched in this run. The 0.5 cu ft size is confirmed via Hammond Hardware and Max Warehouse.
