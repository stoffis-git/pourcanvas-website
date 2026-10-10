# Verification v3: content-level number claims

Date: 2026-10-10. Scope: `numbers-issues.md` rows 2, 3, 4, 5, 9, 10, 11, 12; installed $/sq ft consistency scan; the finish-data facts shown on pages. No code was edited.

Conventions
- **F** means fetched and checked in the page text (WebFetch, or downloaded with curl and extracted with pdftotext). A source that returned 403 is marked as such and was not used as evidence.
- FROZEN status comes from `url-inventory.csv`. FROZEN pages get an appended "Update" sentence, section or FAQ. The exception is a number that is plainly wrong or misleading: there I propose a minimal in-place correction, flagged **OWNER DECISION**.
- `sqft(m)` is the existing helper in `driveway.ts:22`, which renders `perSqftRange(INSTALLED[m])`. For non-CompareMaterial keys, use `perSqftRange(INSTALLED["concrete-paver"])` and the like. `patio.ts` already imports `perSqftRange` and `INSTALLED`.
- The data file values I compared against (`paving.ts` INSTALLED, all `pending`): plain $6/9/14, stamped $12/18/28, exposed aggregate $9/13/18, concrete paver $10/15/22, flagstone dry $15/22/32, flagstone mortared $20/30/45, travertine $15/20/30.

---

## Sources fetched in this round

| Key | Source | Page date | What it says (quoted or close paraphrase) |
|---|---|---|---|
| EPA-C5 | EPA, *Reducing Urban Heat Islands: Compendium*, Cool Pavements ch. (draft). https://www.epa.gov/sites/default/files/2014-08/documents/coolpavescompendium_ch5.pdf | 2008 compendium, posted 2014-08 | "Conventional pavements … can reach peak summertime surface temperatures of 120–150°F". Phoenix photo: "up to 150°F". LBNL: "every 10 percent increase in solar reflectance could decrease surface temperatures by 7ºF". |
| EPA-web | EPA, "Using Cool Pavements to Reduce Heat Islands". https://www.epa.gov/heatislands/using-cool-pavements-reduce-heat-islands | updated 2025-12-19 | "asphalt can reach surface temperatures up to 152°F at mid-day"; cool pavements "remained 10 to 16°F cooler". |
| LBNL | LBNL Heat Island Group, Cool Pavements. https://heatisland.lbl.gov/coolscience/cool-pavements | ©2026 | "New cement concrete has a solar reflectance (SR) of 30–50%"; aged 20–35%; new asphalt 5%. Thermal image: light segment "about 17°C (30°F) cooler than the dark segment". |
| SciAm | Scientific American, "New NASA Heat Map Shows Scorching Streets…" | 2024-07-03 | "Streets can easily be 40 to 60 degrees F … hotter than the air temperature on very hot days." |
| UNSW16 | UNSW Home Modification Clearinghouse, *Slip Resistance of Ramps* (PDF downloaded) | 2016-07 | Concrete that is "wood floated, broom finished, or exposed aggregate" would "usually achieve P5 or R13". The table lists all three together as V / R13. |
| CNsalt | Concrete Network (A. Balogh), Rock Salt Concrete Finish. https://www.concretenetwork.com/rock-salt-finish/ | undated | "upgrading to a basic salt finish will cost as little as $1 more per square foot". Freezing areas: water "freeze[s], potentially causing spalling"; with a waterproofing sealer it "should be durable enough to endure any climate". |
| HDig | House Digest, salt finish pros and cons. https://www.housedigest.com/1601571/pros-cons-patio-salt-concrete-finish/ | 2024-06-16 | Salt finish "around $8 to $12 per square foot, according to Angi". This is secondhand: Angi itself returned 403. |
| Mud | Mudmixer, salt finish concrete. https://mudmixer.com/blogs/news/adding-texture-with-salt-finish-concrete | 2026-01-26 | "In colder climates, freeze and thaw cycles can wear the texture"; snow plows and freeze damage wear it faster. No cost given. |
| CD19 | Concrete Decor (T. Stephens), Sealing Exposed Aggregate. https://www.concretedecor.net/departments/concrete-sealers/seal-exposed-aggregate-concrete-for-best-results/ | May/Jun 2019 | Penetrating sealers "last from seven to 10 years"; acrylic "every 12 to 36 months". |
| FArmor | Foundation Armor SX5000 WB. https://www.foundationarmor.com/SX5000WB/ | current | "up to 7-10 years of life before the need to reseal". Elsewhere on the same page: "resealed every 5-7 years". |
| Prosoco | PROSOCO Siloxane PD. https://prosoco.com/product/siloxane-pd/ | current | "Up to 10-year service life". |
| LL-conc | Lawn Love, concrete patio cost. https://lawnlove.com/blog/concrete-patio-cost/ | 2026-10-05 | Gray slab "$4 to $9 per square foot"; stamped $5–10; "Adding aggregate … $2 to $3 per square foot". |
| HW | Homewyse, concrete patio. https://www.homewyse.com/services/cost_to_install_concrete_patio.html | 2026-05 | $10.30–12.64 per sq ft installed. |
| TH | Today's Homeowner, cost to pour a concrete patio. https://todayshomeowner.com/concrete/cost/cost-to-pour-a-concrete-patio/ | 2025-03-18 | Plain $8–15; broom $9–18; exposed aggregate $10–18; stamped $14–30; pavers $15–25. |
| MA-patio | Metal America, concrete patio cost 2026. https://metalamericaconcrete.com/blog/concrete-patio-cost-and-budgeting-guide-for-2026/ | 2026-03-10 | Plain broom "$6 to $10"; stamped $12–20; concrete pavers "$8 to $20 … installed". |
| MA-agg | Metal America, exposed aggregate guide. https://metalamericaconcrete.com/blog/exposed-aggregate-concrete-and-complete-guide/ | 2026-03-10 | Exposed aggregate $6–12; "premium over basic broom-finish ($6 to $8) is $0 to $4". |
| MA-pool | Metal America, pool deck resurfacing 2026. https://metalamericaconcrete.com/blog/pool-deck-resurfacing-cost-and-2026-options/ | 2026-03-10 | "Cool deck coatings cost $4 to $8 per square foot installed"; they "reduce surface temperature by 30% to 50%" (no °F). |
| CB | CountBricks, poured concrete patio cost. https://www.countbricks.com/post/poured-concrete-patios-cost | 2026-02-03 | Basic poured patio $8–20; paver patios $20–35. |
| BV-patio | Bob Vila, concrete patio cost. https://www.bobvila.com/articles/concrete-patio-cost/ | 2023-08-02 | Plain rectangle $4–7; basic slab $5–12; exposed aggregate +$2–3; broom no extra cost. |
| PD | PriceDesk exposed aggregate calculator. https://pricedesk.app/calculators/exposed-aggregate-concrete-cost-calculator/ | undated (©2026) | Example rates: broom $9, exposed aggregate $13 (+$4). Labelled "rough national ballpark". |
| CED | Civil Engineering Daily, exposed aggregate. https://civilengineeringdaily.com/exposed-aggregate-concrete/ | undated (2026 site) | Basic $8–12; patio $8–15; driveway $10–18. |
| LL-pav | Lawn Love, paver patio cost. https://lawnlove.com/blog/paver-patio-cost/ | 2025-12-27 | Paver patio $8–24 installed; installed flagstone patio about $15–25. |
| HA-pav | HomeAdvisor, brick paver patio. https://www.homeadvisor.com/cost/outdoor-living/install-a-brick-paver-patio | 2026-06-17 | Pro-installed paver patio "$8 and $25 per square foot". |
| CMY | CostMyYard paver patio calculator. https://costmyyard.com/calculators/paver-patio-cost/ | 2026-09 | Concrete pavers $10/15/22; clay brick $12/18/26; natural stone $16/26/40. |
| BY | The Brickyard, flagstone patio cost. https://www.thebrickyardwi.com/feeds/blog/flagstone-patio-cost | 2026-03-25 | Dry-laid $15–32; mortar-set **$20–42** (data file says 20–45). |
| STON | Stonorama, travertine pavers cost guide. https://www.stonorama.com/blogs/news/travertine-pavers-cost-guide | 2026-06-28 | Installed $15–27 (average $20); material $5–15. |
| SIC | StampItCrete, Kool Deck. https://stampitcrete.com/our-services/kool-deck/ | ©2026 | Kool Deck "$6 and $12 per square foot". Temperature not quantified. |
| SWX | Southwest Exteriors, Kool Deck vs Penntek. https://www.southwestexteriors.com/blog/kool-deck-vs.-penntek-industrial-coatings-which-is-better-pool-deck-coating | 2022-09-20 | Kool Deck $6–12. No degrees given. |
| OLP | Outdoor Life Pros, cool deck cost (Cape Coral FL). https://www.outdoorlifepros.com/cool-deck-coating-cost-in-cape-coral-fl-2026-pricing-guide | 2026-03-05 | Acrylic cool deck $4.00–6.50; typical pool deck $4.00–8.50. No degrees given. |
| HA-sb | HomeAdvisor, sandblast cost. https://www.homeadvisor.com/cost/cleaning-services/sandblast-an-exterior-surface | 2026-06-19 | Concrete $2.50–3.50 per sq ft. |
| BV-sb | Bob Vila, sandblasting cost. https://www.bobvila.com/articles/how-much-does-sandblasting-cost/ | 2023-12-26 | Concrete $2.50–3.50. |
| HUCK | Huckster Repellent, sandblasting costs. https://hucksterrepellent.com/sandblasting-costs/ | byline 2018-11-27, titled "2026" | Light blast (1/16 in) $2.25–4.50; medium $4.50–7.20; heavy $6.75–15.75. |
| TP | ThePricer, cost of sandblasting. https://www.thepricer.org/the-cost-of-sandblasting/ | 2026-09-03 | Masonry and concrete broad surfaces $1–5. |

Blocked (403, not used): HomeGuide (concrete patio, exposed aggregate, pool-deck resurfacing), Angi, Forbes. Fixr returned 404.

Note for the INSTALLED verification agent: `paving.ts` cites Lawn Love (`lawnloveConcrete`) for plain concrete $6–14. The live Lawn Love page (2026-10-05) says **$4–9** for a gray slab. That citation does not support the high end.

---

## Issue 2: black-concrete-driveway (FROZEN), heat section

Current text:
- `src/content/articles/driveway.ts:596`: "A black driveway in direct afternoon sun can reach 140–160°F on a 90°F day — 40–50°F hotter than the air temperature … a deep charcoal (not true black) and a UV-reflective penetrating sealer reduce surface temperatures by 10–15°F."
- `driveway.ts:621` (table): "High (140–160°F)". `driveway.ts:623`: grey concrete "Low (110–120°F)".
- `driveway.ts:673` (FAQ): the same 140–160°F vs 110–120°F claim, plus the sealer claim of 10–15°F.

Findings:
- **140–160°F → ADJUST.** The EPA's peak for conventional pavements is 120–150°F (EPA-C5), and its asphalt figure is up to 152°F at mid-day (EPA-web). Those are hot-climate peaks; the photo is from Phoenix. The 160°F upper end comes only from a burn-center physician quoted in the press (SciAm), not from a measurement study. The sentence also contradicts itself: a 90°F day plus 40–50°F gives 130–140°F, not 160°F. The 40–60°F-above-air figure (SciAm) is real but applies to "very hot days".
- **110–120°F for light grey → UNVERIFIABLE.** No fetched source gives it.
- **"UV-reflective penetrating sealer reduces 10–15°F" → UNVERIFIABLE, and likely misleading.** No source quantifies it. A clear penetrating sealer does not materially change solar reflectance. The only sourced lever is color: LBNL says about 7°F per 10 points of SR (EPA-C5), and Solomon dark tones have SR 0.15–0.22 vs about 0.35 for gray.

The section appended earlier ("How Black Concrete Fades by Climate", `driveway.ts:647`) already gives the correct EPA figure, so the page now contradicts itself. **OWNER DECISION:** I consider 140–160°F "on a 90°F day" and the sealer claim plainly misleading. Minimal in-place corrections:

- `:596`, replace the two sentences:
  > "A black driveway in direct afternoon sun gets far hotter than the air: the EPA reports peak summer surface temperatures of 120–150°F for conventional pavements, and a black slab sits at the hot end of that range."

  and
  > "If you're committed to a dark driveway in a hot climate, a deep charcoal (not true black) reflects more sunlight and runs cooler; LBNL researchers estimate about 7°F lower surface temperature for every 10-point gain in solar reflectance."
- `:621` cell: `High (up to ~150°F at peak)`. `:623` cell: `Lower (reflects 30–50% of sunlight when new)`.
- `:673` FAQ answer:
  > "Yes. Dark concrete absorbs more sunlight. The EPA reports peak summer surface temperatures of 120–150°F for conventional pavements, and a black driveway sits at the hot end of that range, while new grey concrete reflects 30–50% of sunlight (LBNL). In hot climates (zones 8–11) this is a real consideration; in northern climates it matters little in summer and helps slightly with winter ice melt. A deep charcoal rather than true black runs somewhat cooler: LBNL estimates about 7°F lower surface temperature for every 10-point gain in solar reflectance."

If the owner rejects in-place edits, append this FAQ instead:
> Q: "How hot does a black concrete driveway actually get?" A: "Update (October 2026): the EPA reports peak summer surface temperatures of 120–150°F for conventional concrete and asphalt, with asphalt measured up to 152°F at mid-day in Arizona. A black driveway sits near the top of that range. Lighter color is what lowers it: LBNL estimates about 7°F per 10-point gain in solar reflectance. A clear sealer does not change surface temperature in any measured way."

Related claims outside the issue list, which I flag but did not research further: `driveway.ts:786` (FROZEN color guide) says light-to-medium tones run "20–30°F cooler" than dark. That is plausible against the LBNL 30°F thermal image but not sourced. `materials/exposed-aggregate.ts:82,135` (FROZEN) says 10–15°F and `materials/travertine.ts:15,19,70` says 20–30°F. Neither is sourced.

---

## Issue 3: plain concrete "$6–12" (older sections) vs INSTALLED $6–14

Installed plain/broom patio, per sq ft:

| Source | Date | Range |
|---|---|---|
| Lawn Love (LL-conc) | 2026-10-05 | $4–9 |
| Metal America (MA-patio) | 2026-03-10 | $6–10 (broom) |
| Homewyse (HW) | 2026-05 | $10.30–12.64 |
| Today's Homeowner (TH) | 2025-03 | $8–15 plain, $9–18 broom |
| CountBricks (CB) | 2026-02 | $8–20 |
| Bob Vila (BV-patio) | 2023-08 | $4–7 rectangle; $5–12 basic slab |

Consensus: low end about $5–6, typical $8–10, high end $12–15. CountBricks' $20 and Lawn Love's $9 high end are outliers in opposite directions.

**Verdict:** INSTALLED $6/9/14 is **CONFIRMED** as consistent with the consensus. Final say rests with the INSTALLED agent.

What this means for the content:
- "$6–12" is acceptable.
- "$6–10" is the most common literal on the site. It understates the high end but is not wrong.
- "$4–8", "$5–8" and "$4–7" are **ADJUST**: their high end sits below the consensus typical value.

Proposed wording:
- Non-frozen pages: replace literals with `${sqft("plain-concrete")}`, which renders $6–14, and recompute dependent totals with `total("plain-concrete", area)`.
- FROZEN pages with $6–10: append the note "Update (October 2026): our current national range for plain broom-finish concrete is $6–14 per sq ft installed (typical about $9); see /methodology."
- FROZEN pages with $4–8: see the table below.

---

## Issue 4: materials/concrete-pavers (not frozen), "$15–30/sq ft installed"

Installed concrete or general paver patios, per sq ft: Lawn Love $8–24 (2025-12); HomeAdvisor $8–25 (2026-06); CostMyYard $10/15/22 (2026-09); Metal America concrete pavers $8–20 (2026-03); Today's Homeowner $15–25 (2025-03); CountBricks $20–35 (2026-02, outlier on the high side).

**Verdict: ADJUST $15–30 to $10–22** (the INSTALLED value, typical $15). $15–30 sits above every 2026 source except CountBricks.

Several statements on the page are also wrong against the data:
- `:69` says pavers cost "roughly double the cost of stamped concrete". That is **plainly wrong**: stamped is $12–28, typical $18, and pavers are typical $15.
- `:45` says "stamped concrete delivers a comparable look at significantly lower cost". That is not supported; the ranges overlap.

Exact replacements in `src/content/materials/concrete-pavers.ts`, with `P = perSqftRange(INSTALLED["concrete-paver"])` → "$10–22":
- `:16` meta: "Concrete pavers cost about $10–22/sq ft installed — more than plain poured concrete — but individual units replace in minutes. Compare styles, costs, and when pavers are worth it."
- `:21` intro: "Concrete pavers cost about $10–22 per sq ft installed (typical about $15) — more than a plain poured slab at $6–14 — but they offer one advantage no poured slab can match: …" (rest unchanged).
- `:33` Cost: "Concrete paver installation runs about $10–22 per sq ft, compared to $6–14 for plain poured concrete and $12–28 for stamped. … On a 300 sq ft patio, budget about $3,000–6,600 installed. The higher upfront cost versus a plain slab is the primary reason most homeowners choose poured concrete — but the repair advantage can offset this over time." The $3–8 materials figure can stay; HomeGuide and Lawn Love report $3–6 materials, so it is close.
- `:57` con: "More expensive than plain poured concrete ($10–22 vs $6–14/sq ft)".
- `:69` FAQ: "Concrete paver installation runs about $10–22 per sq ft … On a 300 sq ft patio, budget about $3,000–6,600 installed — similar to stamped concrete and more than a plain slab."
- `:73` FAQ: "Concrete pavers ($10–22/sq ft) and stamped concrete ($12–28/sq ft) overlap in price, but pavers offer one major advantage: …"
- `:45`: "For most budget-conscious homeowners, plain or exposed-aggregate concrete costs less; stamped concrete gives a patterned look at a similar price."

Prefer the helpers (`perSqftRange(INSTALLED[...])`) so these lines track the data file.

---

## Issue 5: homepage FAQ (FROZEN /), `src/components/HomeFAQ.tsx:30,34`

- `:34` says broom-finish patio "$4–$7/sq ft". Only Bob Vila (2023) supports it. Its $7 high end is below the low end of Homewyse, Today's Homeowner and CountBricks, and below INSTALLED typical ($9). **Plainly understated → OWNER DECISION.**
- `:34` says stamped/decorative "$8–$18" and "400 sq ft … $3,200–$7,200 all-in for stamped". Against INSTALLED stamped $12–28, 400 sq ft is $4,800–11,200. **ADJUST.**
- `:30` says stamped "$8–$12/sq ft". **Plainly wrong**: below the INSTALLED low end and below every source (Metal America $12–20, Today's Homeowner $14–30). Pavers "$10–$20" is **CONFIRMED** (data $10–22).

Minimal in-place correction (the homepage has negligible clicks: 1 impression in 28 days):
- `:30`: "Stamped concrete is poured as a single slab then imprinted with a pattern — about $12–$28/sq ft installed, seamless finish, but cracks can propagate across the slab. Pavers are individual units set on a base — about $10–$22/sq ft — and individual pieces can be replaced if damaged."
- `:34`: "A basic broom-finish concrete patio runs about $6–$14/sq ft installed (U.S. average). Stamped finishes range from about $12–$28/sq ft depending on pattern complexity and region. A 400 sq ft stamped patio typically runs $4,800–$11,200."

If the owner prefers no edit, append an FAQ instead:
> Q: "What does concrete cost per square foot in 2026?" A: "Update (October 2026): national installed averages are about $6–14/sq ft for plain broom-finish concrete, $9–18 for exposed aggregate, $12–28 for stamped, and $10–22 for concrete pavers. See our methodology page for sources."

Note: the original Q&A would still show the old numbers above this one.

---

## Issue 9: sandblast cost and the salt "avoid" rule

**Sandblast "$2.50–5" → CONFIRMED, weak.**

| Source | Date | Figure |
|---|---|---|
| HomeAdvisor (HA-sb) | 2026-06 | Concrete $2.50–3.50 |
| Bob Vila (BV-sb) | 2023-12 | Concrete $2.50–3.50 |
| Huckster (HUCK) | 2018 byline | Light blast $2.25–4.50 |
| ThePricer (TP) | 2026-09 | Concrete and masonry $1–5 |

All of these are surface-blasting (cleaning or prep) prices, not quotes for a decorative texture.

Recommended note text in `finish.ts`: "Priced as an added blasting step, roughly $2.50–5 per sq ft; deeper decorative texture costs more." Source: replace `SBc` snippets with HA-sb and HUCK.

**Salt "avoid" rule → keep, now with two fetched sources.**
- CNsalt (F) says water in the pits freezes and can spall.
- Mudmixer (2026-01-26, F) says freeze-thaw cycles wear the texture and plows and freeze damage wear it faster.

Caveat to keep visible: CNsalt also says good concrete with a waterproofing sealer "should be durable enough to endure any climate". The hard avoid for driveway, walkway and pool deck in freeze-thaw is therefore an editorial judgment built on that risk, not a published prohibition. The salt-finish material page already words this correctly (`salt-finish.ts:62`).

---

## Issue 10: best-concrete-finish-pool-deck (FROZEN), `patio.ts:757,761,776`

**"$3–8/sq ft" cool-coat → ADJUST to "about $4–8, up to $12".**

| Source | Date | Figure |
|---|---|---|
| Metal America (MA-pool) | 2026-03 | $4–8 |
| Outdoor Life Pros (OLP) | 2026-03 | $4–8.50 |
| StampItCrete (SIC) | 2026 | $6–12 |
| Southwest Exteriors (SWX) | 2022 | $6–12 |

$3 sits below every 2026 source but is not grossly misleading, so I recommend an appended update rather than an edit.

**"15–25°F cooler" → UNVERIFIABLE.** No independent measurement was found. Manufacturers and contractors give anything from "not significant" to "30–50°F". Metal America says "30–50%" with no °F. Kool Deck (Mortex, fetched in finish research) gives no number. EPA-web reports cool pavements "10 to 16°F cooler" than conventional pavement in an Arizona pilot, but those are street cool pavements, not pool-deck coatings.

Proposed appended section for this FROZEN page (after the last section):
> **Update (October 2026): cool-deck coating cost and heat, re-checked.** Current installer pricing for an acrylic cool-deck coating over a sound slab runs about $4–8 per sq ft, and $6–12 for name-brand or heavier systems (Metal America, StampItCrete, 2026). How much cooler a coating runs depends on its color and how clean it stays. We found no independent measurement for pool-deck coatings. As a guide, LBNL researchers estimate about 7°F lower surface temperature for every 10-point gain in solar reflectance (EPA Cool Pavements Compendium), and in an EPA pilot in Arizona, cool pavements ran 10–16°F cooler than conventional ones.

Sentence-level alternative, if the owner allows touching existing text: in `:757` and `:776`, replace "15–25°F" with "noticeably (light, reflective colors run cooler)".

---

## Issue 11: exposed-aggregate-vs-broom-finish (not frozen), `patio.ts:1229,1261`

**"ASTM … exceeds 0.60 wet; broom 0.45–0.55" → UNVERIFIABLE; remove it.**
- No ASTM test produces a single "slip resistance coefficient" for a finish. ASTM C1028 was withdrawn in 2014, and the current US standard, ANSI A326.3, targets tile.
- Searches found no published DCOF data by finish. The only figures are uncited vendor tables, and those put broom at 0.5–0.8, which contradicts the article anyway.
- The sourced evidence says the finishes are equivalent when new: UNSW16 (F) lists wood-floated, broom and exposed-aggregate concrete together at P5 / R13 (class V). The section's framing that "broom … can't match aggregate's inherent texture" is not supported.

Replacements:
- `:1229`, replace from "Exposed aggregate's protruding stone particles…" to the end of the section body:
  > "When new, both finishes usually reach the top wet slip-resistance class in Australian pendulum testing summarized by the UNSW Home Modification Clearinghouse (P5 / R13 for wood-floated, broom and exposed-aggregate concrete). No published test compares the two finishes by number in U.S. terms. In practice, grip depends more on upkeep: a broom texture stays grippier when it runs across the walking direction, and any glossy film sealer reduces grip on either finish. For pool decks and rainy climates, both are good choices; choose a penetrating sealer, and on aggregate ask for small or polished stones for bare feet."
- `:1261` FAQ:
  > "Both are among the most slip-resistant concrete finishes when wet. Research summarized by the UNSW Home Modification Clearinghouse puts new broom-finished and exposed-aggregate concrete in the same top wet slip class. Keep it that way with a penetrating sealer rather than a glossy film sealer, and broom across the walking direction."
- Optional: change the section heading "Slip Resistance: Aggregate Has the Edge" to "Slip Resistance: Both Grip Well When Wet".

The same page's prices (`:1204,1215,1219,1246,1256`) are covered in the scan table below.

---

## Issue 12: salt-finish inspiration pages vs /materials/salt-finish

- Material page (`salt-finish.ts:18-19`): INSTALLED plain + $1, which renders **$7–15**.
- CNsalt "as little as $1 more" is **CONFIRMED** (F).
- Angi's total of $8–12 is secondhand via House Digest (2024), because Angi returned 403. It sits inside $7–15.

**Verdict:** the material page stays as is. The inspiration pages are not frozen, so align them in place, preferably with an `INSTALLED`-derived helper in `inspiration/index.ts`. Literal values are shown here.

| Line | Current | Proposed |
|---|---|---|
| `inspiration/index.ts:383` (meta) | "costs $7–12/sq ft" | "costs about $7–15/sq ft installed (plain concrete plus about $1)" |
| `:388` | "$7–12 … above a standard broom finish ($6–10) but below exposed aggregate ($8–14) and well below stamped concrete ($12–18). On a 500 sq ft two-car driveway, budget $3,500–6,000." | "Cost: about $7–15 per sq ft installed — roughly $1 more than a plain broom finish ($6–14), usually below exposed aggregate ($9–18) and stamped concrete ($12–28). On a 500 sq ft two-car driveway, budget about $3,500–7,500." |
| `:731` | "$8–14 … with integral color - more than plain broom finish ($6–10/sq ft) but less than stamped concrete ($12–18/sq ft)" | "Practically, a salt finish costs about $1 per sq ft more than plain concrete ($7–15/sq ft installed), and integral charcoal color adds roughly $2–4 more — still usually below stamped concrete ($12–28/sq ft)." |
| `:771` | "$7–12 … with a color wash" | "Cost: about $7–15 per sq ft installed, roughly $1 more than plain broom finish; color adds to that." |
| `:891` | "comparable to broom-finish concrete: $7–11" | "Cost is close to broom-finish concrete: about $7–15 per sq ft installed, roughly $1 more than plain, depending on region and site conditions." |

Also `patio.ts:953` (concrete-patio-ideas, not frozen) says "Broom finish and salt finish … $6–10". Proposed: "…plain broom finish at $6–14 per sq ft installed and salt finish about $1 more".

---

## Finish-data facts (`src/lib/tools/data/finish.ts` notes)

| Claim | Verdict | Recommended | Sources (fetched) | Rationale |
|---|---|---|---|---|
| "gray concrete reflects 30–50% of sunlight when new" (`:105`) | **CONFIRMED** | keep | LBNL (©2026, F): "New cement concrete has a solar reflectance (SR) of 30–50%"; aged 20–35% | Verbatim match; "when new" matters and is already there. |
| "a penetrating sealer lasts about 7–10 years" (exposed aggregate, `:125`) | **CONFIRMED** (upper bound) | "a penetrating sealer can last up to about 7–10 years" | CD19 (2019, F) "seven to 10 years"; Foundation Armor (F) "up to 7-10 years" but also "resealed every 5-7 years"; Prosoco (F) "Up to 10-year service life" | Every source frames it as a ceiling, so add "up to". |
| salt "About $1 per sq ft more than broom" (`:146`) | **CONFIRMED** (single source) | "From about $1 per sq ft more than broom" | CNsalt (F) "as little as $1 more per square foot"; HDig/Angi $8–12 total is consistent | CN's wording is a floor ("as little as"). |
| exposed aggregate "About $2–4 per sq ft more than broom" (`:126`) | **CONFIRMED** | keep | LL-conc (2026-10, F) "$2 to $3"; BV-patio (2023, F) $2–3; MA-agg (2026-03, F) "$0 to $4"; PD (F) example +$4; TH ranges imply about +$1 | Independent consensus is $2–3, up to $4. The cited SC (slabcalc.co) is a sister site, not independent, so replace or supplement it with LL-conc and MA-agg. INSTALLED itself implies +$3–4 (plain 6/9/14 vs exposed aggregate 9/13/18). |
| sandblasted "roughly $2.50–5 per sq ft" (`:164`) | **CONFIRMED (weak)** | "roughly $2.50–5 per sq ft as an added blasting step; deeper texture costs more" | HA-sb (2026-06, F) $2.50–3.50; BV-sb (2023, F) $2.50–3.50; HUCK (F) light $2.25–4.50; TP (2026-09, F) $1–5 | All are surface-blasting or prep prices. No decorative-texture pricing was found. |

---

## Installed $/sq ft consistency scan

Comparison basis is the current `paving.ts` INSTALLED values (pending, being verified separately).
- **YES:** both ends within about $2 of the data range.
- **PARTIAL:** the claim sits inside the data range but cuts off the upper end by more than $2. It is not wrong, but it understates.
- **NO:** the low end is off by more than $2, the high end is off by more than about $4, or the claim contradicts the data.

The fix column says "helper" for non-frozen pages: replace the literal with `${sqft(...)}` or `perSqftRange(INSTALLED[...])`. "Append" (FROZEN) means add the plain-concrete or relevant "Update (October 2026)" note or FAQ given in Issues 3–5. Lines that are already data-driven (`driveway.ts:1014-1016, 1166-1168`, `salt-finish.ts`, `${sqft()}` in `driveway.ts:631`) are consistent and not listed.

### Articles: driveway.ts

| file:line | page (FROZEN?) | claim | consistent? | proposed fix |
|---|---|---|---|---|
| driveway.ts:33,38,42,57,70,87 | stamped-concrete-driveway (FROZEN) | stamped $12–20 | PARTIAL | Append: "Update: current national range for stamped concrete is $12–28/sq ft installed (typical $18)." |
| driveway.ts:38,70 | stamped-concrete-driveway (FROZEN) | "natural stone pavers $20–35"; ":70 concrete or natural stone paver driveways $20–35" | NO for concrete pavers (data $10–22, about $12–26 with the 1.2 driveway factor); OK for natural stone | Append a clarification that concrete paver driveways run about $12–26. |
| driveway.ts:105,110,119,160 | exposed-aggregate-driveway | exposed aggregate $8–14; broom $6–10; stamped $12–20 | PARTIAL / PARTIAL / PARTIAL | helper (`sqft("exposed-aggregate")`, `sqft("plain-concrete")`, `sqft("stamped-concrete")`) |
| driveway.ts:178,183,187,223,243,247 | concrete-driveway-cost | plain/broom **$4–8** | **NO** | helper `sqft("plain-concrete")`; recompute `:239` totals ($1,600–4,800 for 400–600 sq ft) with `total("plain-concrete", …)`; `:243` "integral color … $6–12" → "$8–18" (plain + $2–4) |
| driveway.ts:183,192,197,247 | concrete-driveway-cost | stamped $12–20; exposed aggregate $8–14 | PARTIAL | helper |
| driveway.ts:275 | driveway-resurfacing | plain **$4–8**; exposed aggregate $8–14; stamped $12–20 | **NO** / PARTIAL / PARTIAL | helper |
| driveway.ts:287 | driveway-resurfacing | new stamped pour $12–20 | PARTIAL | helper |
| driveway.ts:340,350,382 | circular-driveway-ideas | cobblestone stamp $14–20; fully stamped $14–20 | PARTIAL | helper or "$14–28" |
| driveway.ts:345,386 | circular-driveway-ideas | exposed aggregate $8–14 | PARTIAL | helper |
| driveway.ts:406,454,497 | modern-driveway-ideas (FROZEN) | charcoal broom + color $6–12 | NO (colored = plain + $2–4, so $8–18) | Append: "Update: plain concrete is $6–14/sq ft installed; integral color adds about $2–4." |
| driveway.ts:406,458,459,497 | modern-driveway-ideas (FROZEN) | stamped $14–20 | PARTIAL | Append (same note) |
| driveway.ts:456 | modern-driveway-ideas (FROZEN) | dark exposed aggregate $8–14 | PARTIAL | Append |
| driveway.ts:516,520 | concrete-driveway-vs-asphalt | concrete **$4–8** | **NO** | helper; recompute any totals derived from it |
| driveway.ts:536 | concrete-driveway-vs-asphalt | stamped $12–20 | PARTIAL | helper |
| driveway.ts:581,587,591,665 | black-concrete-driveway (FROZEN) | black integral $6–12 "= plain + $2–4" | **NO** (internally inconsistent: plain + $2–4 is $8–18) | **OWNER DECISION.** Minimal in-place fix: "$8–18 per sq ft installed — $2–4 above plain grey concrete ($6–14)"; 500 sq ft: "$4,000–9,000". Or append the Update FAQ. |
| driveway.ts:618,621,622 | black-concrete-driveway (FROZEN) | black or charcoal integral $6–12 | NO | Same as above (table cells → "$8–18") |
| driveway.ts:623 | black-concrete-driveway (FROZEN) | standard grey **$4–8** | **NO** | Cell → "$6–14" (OWNER DECISION) |
| driveway.ts:618,624 | black-concrete-driveway (FROZEN) | dark stamped $14–20 | PARTIAL | Append |
| driveway.ts:701 | driveway-border-ideas | stamped full surface $12–20 | PARTIAL | helper |
| driveway.ts:771 | concrete-driveway-color-guide (FROZEN) | stamped total $12–18 | PARTIAL | Append |
| driveway.ts:825,834,838,843,873,878 | stamped-concrete-driveway-cost | stamped $12–20 (pattern sub-ranges $12–15, $13–18, $15–20) | PARTIAL | helper for the headline range; keep the pattern sub-ranges but lift the top to the data |
| driveway.ts:834,838,843,878 | stamped-concrete-driveway-cost | plain **$5–8** | **NO** | helper `sqft("plain-concrete")`; `:838` "stamped premium is $4–12/sq ft" → derive from data (about $6–14) |
| driveway.ts:834,857,878 | stamped-concrete-driveway-cost | "natural stone or concrete pavers $20–35" | NO for concrete pavers | "concrete pavers about $12–26 for driveways; natural stone more" |
| driveway.ts:843 | stamped-concrete-driveway-cost | exposed aggregate border $8–14, field $5–8 | PARTIAL / NO | helper |
| driveway.ts:848 | stamped-concrete-driveway-cost | high-cost metros $16–22 | YES (data × 1.18–1.25 is about $14–35) | keep |

### Articles: patio.ts

| file:line | page (FROZEN?) | claim | consistent? | proposed fix |
|---|---|---|---|---|
| patio.ts:14,19,38,74 | stamped-concrete-ideas | stamped $12–18 ($14–18 wood plank) | PARTIAL | helper |
| patio.ts:28 | stamped-concrete-ideas | "actual pavers $15–30" | NO | `perSqftRange(INSTALLED["concrete-paver"])` → $10–22 |
| patio.ts:74 | stamped-concrete-ideas | broom $6–10 | PARTIAL | helper |
| patio.ts:88,93,97,153,157 | concrete-patio-cost | plain $6–10 | PARTIAL | helper; `:157` color wash "$8–14" → "$8–18" |
| patio.ts:88,102,153 | concrete-patio-cost | stamped $12–18 | PARTIAL | helper |
| patio.ts:88,112 | concrete-patio-cost | exposed aggregate $8–14 | PARTIAL | helper |
| patio.ts:125 | concrete-patio-cost | poured $6–18; "paver patios $15–30"; natural stone $25–50 | YES / **NO** / PARTIAL (flagstone 15–45) | pavers → $10–22; stone → "$15–45 (dry-laid to mortared)" |
| patio.ts:249,254,258,310 | concrete-patio-vs-pavers | concrete $6–18; pavers **$15–30** | YES / **NO** | pavers → $10–22 (helper); concrete → "$6–28 depending on finish" |
| patio.ts:289 | concrete-patio-vs-pavers | natural stone or clay brick walkway $20–35; stamped $12–18 | PARTIAL (clay 12–26, flagstone 15–45) / PARTIAL | "$12–45 depending on material"; helper for stamped |
| patio.ts:360 | small-patio-ideas | stamped $12–18; broom $6–10; color wash $8–14 | PARTIAL ×3 | helper |
| patio.ts:543,552,557,562,590 | pool-deck-ideas-concrete | broom $6–10; exposed aggregate $8–14; stamped $12–18 | PARTIAL ×3 | helper |
| patio.ts:737,772 | best-concrete-finish-pool-deck (FROZEN) | broom $6–10 | PARTIAL | Append (fold into the Issue 10 update: "Broom-finish concrete is currently $6–14/sq ft installed, exposed aggregate $9–18 and stamped $12–28.") |
| patio.ts:742,743,761 | best-concrete-finish-pool-deck (FROZEN) | exposed aggregate $10–16 | YES | keep |
| patio.ts:747,761,772 | best-concrete-finish-pool-deck (FROZEN) | travertine-stamped $12–18 | PARTIAL | Append (as above) |
| patio.ts:748 | best-concrete-finish-pool-deck (FROZEN) | actual travertine $20–40 | NO (data $15–30; Stonorama $15–27; pool-deck guides run $28–60) | Append: "travertine pavers $15–30/sq ft installed on a typical patio; complex pool decks quote higher". Flag to the INSTALLED agent: pool-deck travertine sources run much higher than the data. |
| patio.ts:753 | best-concrete-finish-pool-deck (FROZEN) | broom "$4–6 cheaper" than exposed aggregate | NO (data gap +$3–4; sources $2–3) | Append: "about $2–4 per sq ft". |
| patio.ts:761 | best-concrete-finish-pool-deck (FROZEN) | broom + light color $7–12 | PARTIAL | Append |
| patio.ts:791,804,894 | stamped-concrete-patterns (FROZEN) | stamped $12–20 | PARTIAL | Append stamped Update note |
| patio.ts:813,818,844,889,871 | stamped-concrete-patterns (FROZEN) | pattern sub-ranges $12–18 / $14–18 / $14–20 | PARTIAL | Append |
| patio.ts:894 | stamped-concrete-patterns (FROZEN) | broom $6–10 | PARTIAL | Append |
| patio.ts:938,963,981,994,1004 | concrete-patio-ideas | stamped $12–18 | PARTIAL | helper |
| patio.ts:943 | concrete-patio-ideas | large-format pavers $20–35 | YES for porcelain (16–35); NO for concrete | "porcelain or large-format pavers $16–35" |
| patio.ts:948,963,979,994,1004 | concrete-patio-ideas | exposed aggregate $8–14 | PARTIAL | helper |
| patio.ts:953,963,977,994,999,1004 | concrete-patio-ideas | broom $6–10 (salt same, `:953`) | PARTIAL | helper; salt per Issue 12 |
| patio.ts:1031,1043,1047,1089 | stamped-concrete-vs-pavers | stamped $12–18 | PARTIAL | helper |
| patio.ts:1031,1047,1089 | stamped-concrete-vs-pavers | **pavers $20–40** | **NO** (concrete $10–22, clay 12–26, travertine 15–30, porcelain 16–35) | "pavers $10–35 depending on material (concrete pavers $10–22)" via helpers; re-check `:1074` "saving $3,000–9,000" |
| patio.ts:1158 | stained-concrete-patio-ideas | broom $6–10, stamped $12–18 (300 sq ft totals) | PARTIAL | helper plus recomputed totals |
| patio.ts:1204,1215,1219,1246,1256 | exposed-aggregate-vs-broom-finish | broom $6–10; exposed aggregate $8–14; gap $800–1,600 per 400 sq ft; stamped $12–18 | PARTIAL ×3 | helper; gap "$2–4/sq ft (about $800–1,600 on 400 sq ft)" stays valid |
| patio.ts:1428 | concrete-patio-trends-2026 | dark integral broom $8–14 | PARTIAL (data-implied $8–18) | "$8–18" |

### Articles: walkway.ts

| file:line | page (FROZEN?) | claim | consistent? | proposed fix |
|---|---|---|---|---|
| walkway.ts:23,33,41,68 | front-walkway-ideas | broom $6–10 (`:68` total $720–2,160) | PARTIAL | helper; recompute total ($720–3,360 for 120 sq ft plain to stamped) |
| walkway.ts:28,33,42,68 | front-walkway-ideas | stamped $12–18 | PARTIAL | helper |
| walkway.ts:43,47 | front-walkway-ideas | exposed aggregate $8–14 | PARTIAL | helper |
| walkway.ts:94,100,104,144,168,180,184 | flagstone-vs-concrete-walkway (FROZEN) | flagstone $25–45 | PARTIAL (matches mortared 20–45; dry-laid 15–32) | Already handled by the appended section at `:160` (Issue 6). The Brickyard now says mortared $20–42, not 45. |
| walkway.ts:100,104,144,168 | flagstone-vs-concrete-walkway (FROZEN) | stamped $12–18 | PARTIAL | Append (into the Issue 6 section) |
| walkway.ts:152 | flagstone-vs-concrete-walkway (FROZEN) | New England flagstone $40–55 | YES-ish (45 × 1.18 is about $53) | keep |
| walkway.ts:180 | flagstone-vs-concrete-walkway (FROZEN) | concrete pavers $10–25; plain $6–10 | YES / PARTIAL | keep / append |
| walkway.ts:194,199 | backyard-walkway-ideas | stamped $12–18 | PARTIAL | helper |
| walkway.ts:218,251 | backyard-walkway-ideas | poured $6–18 | PARTIAL (stamped high 28) | "$6–28" |
| walkway.ts:236 | backyard-walkway-ideas | broom $6–10 → $960–1,600 per 160 sq ft | PARTIAL | helper plus total |
| walkway.ts:255 | backyard-walkway-ideas | exposed aggregate $8–14 | PARTIAL | helper |
| walkway.ts:269,274,278,328 | concrete-walkway-cost | plain $6–10 | PARTIAL | helper |
| walkway.ts:269,283,328 | concrete-walkway-cost | stamped $12–18 | PARTIAL | helper |
| walkway.ts:269,288 | concrete-walkway-cost | exposed aggregate $8–14 | PARTIAL | helper |
| walkway.ts:351 | curved-walkway-ideas | plain $6–10, stamped $12–18 | PARTIAL | helper |
| walkway.ts:373 | curved-walkway-ideas | paver $14–22 | YES | keep |
| walkway.ts:546 | stepping-stone-walkway-ideas | poured $6–18 | PARTIAL | "$6–28" |
| walkway.ts:608,622,658 | concrete-walkway-patterns | broom $6–10; stamped $12–18; exposed aggregate $8–14 | PARTIAL | helper |
| walkway.ts:632 | concrete-walkway-patterns | natural flagstone $20–40 | YES | keep |
| walkway.ts:689,739 | concrete-walkway-ideas | $6–18 by finish | PARTIAL | "$6–28" |
| walkway.ts:693,739,744 | concrete-walkway-ideas | stamped $12–18; broom $6–10; exposed aggregate $8–14 | PARTIAL | helper |
| walkway.ts:698 | concrete-walkway-ideas | charcoal broom $8–14 | PARTIAL | "$8–18" |
| walkway.ts:703,744 | concrete-walkway-ideas | flagstone $25–45 | PARTIAL (mortared only) | "$15–45 (dry-laid to mortared)" |
| walkway.ts:713 | concrete-walkway-ideas | replacement $6–18 | PARTIAL | "$6–28" |

### Materials

| file:line | page (FROZEN?) | claim | consistent? | proposed fix |
|---|---|---|---|---|
| broom-finish.ts:10,28,36,44,60,84,108 | broom-finish (FROZEN) | $6–10 (totals: 500 sq ft $3,000–5,000; 300 sq ft $1,800–3,000) | PARTIAL | Append FAQ: "Update (October 2026): our current national range is $6–14/sq ft installed (typical about $9)." |
| broom-finish.ts:60 | broom-finish (FROZEN) | stamped $12–18 | PARTIAL | Same appended FAQ ("stamped $12–28") |
| concrete-pavers.ts:16,21,33,57,69,73 | concrete-pavers | **$15–30** | **NO** | In place, per Issue 4 |
| concrete-pavers.ts:33,57 | concrete-pavers | poured $6–18; stamped $12–18 | PARTIAL | Per Issue 4 |
| exposed-aggregate.ts:10,30,42,115,131 | exposed-aggregate (FROZEN) | exposed aggregate $8–14 | PARTIAL | Append FAQ: "Update (October 2026): exposed aggregate now runs about $9–18/sq ft installed nationally (typical $13), about $2–4 more than broom ($6–14)." |
| exposed-aggregate.ts:42,66,131 | exposed-aggregate (FROZEN) | stamped $12–18; broom $6–10 | PARTIAL | Same appended FAQ |
| exposed-aggregate.ts:82 | exposed-aggregate (FROZEN) | premium over broom $2–5 | YES-ish (sources $0–4, data +$3–4) | keep |
| flagstone.ts:17,22,30,73 | flagstone (FROZEN) | $25–45 | PARTIAL (mortared range; dry-laid $15–32) | Append FAQ: "Update (October 2026): dry-laid flagstone runs about $15–32/sq ft installed and mortared about $20–45." |
| flagstone.ts:30 | flagstone (FROZEN) | concrete pavers $15–30 | NO | Same appended FAQ, adding "concrete pavers about $10–22". |
| flagstone.ts:46 | flagstone (FROZEN) | "$10–25 premium" over stamped | NO-ish (data ranges overlap) | Covered by the appended FAQ |
| stamped-concrete.ts:10,25,37,61,76,107,115 | stamped-concrete | stamped $12–18 | PARTIAL | helper `perSqftRange(INSTALLED["stamped-concrete"])` |
| stamped-concrete.ts:37,107 | stamped-concrete | broom $6–10; exposed aggregate $8–14 | PARTIAL | helper |
| stamped-concrete.ts:25,76,115 | stamped-concrete | "roughly half the cost of natural pavers"; pavers $15–30 | **NO** (concrete pavers $10–22, cheaper than or equal to stamped) | "pavers $10–22 (concrete) to $15–45 (natural stone)"; drop "half the cost" or restrict it to natural stone |
| travertine.ts:15,27,66 | travertine | travertine $20–40 | NO (high end +$10 vs data $15–30) | helper `perSqftRange(INSTALLED.travertine)`; or keep a pool-deck-specific range if the INSTALLED agent adds one (pool-deck guides run $28–60) |
| travertine.ts:27,66 | travertine | poured concrete $8–18; stamped $12–18 | PARTIAL | helper |
| salt-finish.ts | salt-finish | data-driven $7–15 | YES | — |
| colored-concrete.ts:10,23,27,86 | colored-concrete (FROZEN) | premiums only (+$1–4) | n/a | — |

### Inspiration (cost lines only), `src/content/inspiration/index.ts`

Only `stamped-concrete-driveway-cobblestone` (lines 347, 352) is FROZEN.

| line(s) | slug | claim | consistent? | proposed fix |
|---|---|---|---|---|
| 14, 144, 183, 204–212 (meta + body 551, 556, 570, 575, 607, 612), 214, 222, 234, 235, 261, 279, 370, 462, 651, 671, 711, 831, 871, 991 | stamped pages (various) | stamped $12–18 | PARTIAL | helper |
| 38, 175, 195, 462 | herringbone-brick-patio, herringbone-walkway-concrete, herringbone-brick-walkway-red | real brick pavers $20–35 | PARTIAL (clay 12–26) | "$12–26" |
| 62 | pool-deck-travertine | natural travertine $20–40 | NO | "$15–30" (or pool-deck range, see the travertine row above) |
| 85 | modern-driveway-concrete | broom + color $6–12 | PARTIAL | "$8–18" |
| 105 | cobblestone-driveway-border | stamped full surface $12–20 | PARTIAL | helper |
| 125, 279 | pool-deck-broom-finish, concrete-pool-deck-grey | broom $6–10 (+ color $8–12) | PARTIAL | helper |
| 164, 1290 | patio-wood-plank-concrete, ashlar-slate-patio-charcoal | stamped $13–19 | PARTIAL | helper |
| 184 | exposed-aggregate-patio-white | exposed aggregate $9–14 | PARTIAL | helper |
| 198, 203, 811 | exposed-aggregate-driveway-grey, exposed-aggregate-walkway-charcoal | exposed aggregate $8–14 (stamped $12–20) | PARTIAL | helper |
| 334, 475, 480, 589, 594, 1540, 1545 | exposed aggregate tan/white pages | exposed aggregate $10–16 | YES | keep |
| 190 | flagstone-patio-grey | real flagstone $25–50 | NO (high end above 45) | "$15–45 (dry-laid to mortared)" |
| 215 | flagstone-walkway-silver-grey | mortared flagstone $30–50 | PARTIAL (mortared 20–45) | "$20–45" |
| 222, 791 | flagstone-walkway-natural, flagstone-stamped-patio-buff | flagstone $20–40 | YES | keep |
| 316 | modern-black-concrete-driveway | black integral $6–12 "= plain + $2–4" | NO (inconsistent) | "$8–18 per sq ft — $2–4 above plain grey concrete" |
| 347, 352 | stamped-concrete-driveway-cobblestone (FROZEN) | stamped $12–20 | PARTIAL | Append the stamped Update sentence |
| 383, 388, 731, 771, 891 | salt pages | salt $7–12 / $8–14 / $7–11 | NO / mixed | Per Issue 12 |
| 407 | stained-concrete-walkway-blue-grey | broom base + stain $8–14 | PARTIAL | n/a (stain); optional |
| 439 vs 444 | brushed-concrete-driveway-charcoal | meta "$6–10 with pigment" vs body "$8–14" total | NO (self-contradictory) | meta → "$8–18/sq ft with pigment" |
| 444, 851, 1431 | charcoal, light-grey and warm-tan broom pages | broom $6–10 (+pigment) | PARTIAL | helper |
| 532, 537 | concrete-patio-ideas-modern-grey | broom $6–12 | YES-ish | optional helper |
| 631 | stained-concrete-driveway-slate-blue | plain replacement $6–12 | YES-ish | optional helper |
| 911 | charcoal-broom-finish-walkway | charcoal broom $8–13; plain $6–10; stamped $12–18 | PARTIAL | helper |
| 951 | cobblestone-stamped-patio | stamped $14–20 | PARTIAL | helper |
| 971, 1031 | grey-stamped-concrete-patio-craftsman, stamped-concrete-walkway-grey-ranch | stamped **$10–16** | **NO** (below the data low end and typical) | helper ($12–28) |
| 1011 | modern-driveway-concrete-farmhouse | broom/smooth $6–12 | YES-ish | optional helper |
| 1230 | herringbone-brick-driveway | brick paver driveway $18–30 | YES (clay × 1.2 is about $14–31) | keep |
| 1311 | poured-concrete-patio | poured $8–18 | PARTIAL | "$6–28 by finish" |
| 1344 | poured-concrete-driveway | $6–14 | YES | keep |
| 224 | cream-stamped-concrete-walkway | real flagstone $18–28; clay pavers $15–25 | YES / YES | keep |

### HomeFAQ (FROZEN /)

| file:line | claim | consistent? | proposed fix |
|---|---|---|---|
| HomeFAQ.tsx:30 | stamped $8–12 | **NO** | OWNER DECISION, in place: "$12–$28" (Issue 5) |
| HomeFAQ.tsx:30 | pavers $10–20 | YES | keep |
| HomeFAQ.tsx:34 | broom patio $4–7 | **NO** | OWNER DECISION, in place: "$6–$14" (Issue 5) |
| HomeFAQ.tsx:34 | decorative $8–18; 400 sq ft stamped $3,200–7,200 | NO | "$12–$28"; "$4,800–$11,200" |

Biggest gaps, in priority order:
1. Concrete pavers stated at $15–30 or $20–40: concrete-pavers.ts, patio.ts:28,125,249–310,1031–1089, stamped-concrete.ts, flagstone.ts.
2. Plain concrete stated at $4–8, $5–8 or $4–7: driveway.ts (concrete-driveway-cost, resurfacing, vs-asphalt, stamped-concrete-driveway-cost, black-concrete-driveway) and HomeFAQ.
3. Stamped stated at $8–12 or $10–16: HomeFAQ:30, inspiration 971 and 1031.
4. Black or charcoal integral stated at $6–12 while also described as "plain + $2–4".
5. Travertine stated at $20–40.

---

## Summary

| # | Item | Current → verdict | Recommended | Key sources (fetched) |
|---|---|---|---|---|
| 2 | Black driveway heat (FROZEN) | 140–160°F on a 90°F day; sealer cuts 10–15°F; grey 110–120°F → **ADJUST** / **UNVERIFIABLE** / **UNVERIFIABLE** | EPA 120–150°F peak, black at the hot end; color (not sealer) lowers heat, about 7°F per 10 pts SR. In-place fix proposed (OWNER DECISION), with an appended FAQ as fallback. | EPA-C5 (2008/2014), EPA-web (2025-12-19), LBNL (©2026), SciAm (2024-07-03) |
| 3 | Plain concrete $/sq ft | INSTALLED $6–14 → **CONFIRMED**; content "$6–12" OK, "$6–10" PARTIAL, "$4–8"/"$5–8" **ADJUST** | $6–14 via `sqft("plain-concrete")`; append notes on FROZEN pages | LL-conc, HW, TH, MA-patio, CB, BV-patio |
| 4 | Concrete pavers (not frozen) | $15–30 → **ADJUST** | $10–22 (typical $15); fix "double the cost of stamped" (wrong) | LL-pav, HA-pav, CMY, MA-patio, TH |
| 5 | Homepage FAQ (FROZEN) | broom $4–7, stamped $8–12, $3,200–7,200 → **ADJUST** (plainly low) | $6–14; $12–28; $4,800–11,200. In place (OWNER DECISION) or appended FAQ. | as #3 and #4 |
| 9 | Sandblast; salt avoid rule | $2.50–5 → **CONFIRMED (weak)**; avoid rule → kept, now on 2 fetched sources | "roughly $2.50–5 as an added blasting step; deeper texture costs more" | HA-sb, BV-sb, HUCK, TP; CNsalt, Mud |
| 10 | Pool deck cool-coat (FROZEN) | $3–8 → **ADJUST**; 15–25°F → **UNVERIFIABLE** | Append update: $4–8 typical, $6–12 branded; heat stated via the LBNL rule and the EPA pilot (10–16°F) | MA-pool, OLP, SIC, SWX, EPA-web, EPA-C5 |
| 11 | Slip coefficients (not frozen) | "ASTM >0.60 / 0.45–0.55" → **UNVERIFIABLE**, remove | Both broom and exposed aggregate reach the top wet class (P5/R13) when new | UNSW16 (PDF fetched) |
| 12 | Salt cost | material page $7–15 → **CONFIRMED**; inspiration $7–12 / $8–14 / $7–11 → **ADJUST** to $7–15 (plain + about $1) | Wording table in Issue 12 | CNsalt, HDig (Angi secondhand) |
| F1 | Gray concrete reflects 30–50% when new | **CONFIRMED** | keep | LBNL |
| F2 | Penetrating sealer about 7–10 yr | **CONFIRMED** (upper bound) | "up to about 7–10 years" | CD19, FArmor, Prosoco |
| F3 | Salt about +$1 | **CONFIRMED** (single source) | "from about $1 more" | CNsalt |
| F4 | Exposed aggregate +$2–4 over broom | **CONFIRMED** | keep; replace sister-site SC citation with LL-conc and MA-agg | LL-conc, BV-patio, MA-agg, PD |
| F5 | Sandblast $2.50–5 | **CONFIRMED (weak)** | as #9 | HA-sb, BV-sb, HUCK, TP |

Hand-offs to the INSTALLED agent:
- Lawn Love's concrete page says $4–9, not $6–14.
- The Brickyard's mortared flagstone is $20–42, not 45.
- Travertine pool-deck sources ($28–60) sit well above the $15–30 patio range.
