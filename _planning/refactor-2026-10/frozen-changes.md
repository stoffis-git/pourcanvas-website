# Changes to FROZEN Pages (Data-Justified)

The user decided on 2026-10-10 that ranking pages may be improved, including title, meta and intro, when GSC or keyword data shows room. Data source: `_data/gsc/2026-10-10/api/query_page_all.csv` and `query_page_last28.csv`, plus Keyword Planner and the verified data in `src/lib/tools/data/paving.ts`.

Re-check each page in GSC around 2026-11-07 (impressions, position and CTR for the listed queries). If a page lost position on its primary query, revert the title.

| Page | Evidence | Before | After |
|---|---|---|---|
| /blog/driveway/black-concrete-driveway | Position 2.9 (last 28 days) on "black concrete driveway" but CTR 1.1%; meta and intro said $6–12, but verified black integral concrete is plain $6–12 + $2–4 = $8–16 | T: Black Concrete Driveway Ideas: Photos, Cost, Pros & Cons · M: …($6–12/sq ft)… · I: $6–12, $3,000–6,000 | T: Black Concrete Driveway: Cost, Heat, Fading & Photos · M: $8–16/sq ft ($4,000–8,000 for 500 sq ft)… · I: $8–16, $4,000–8,000 (computed) |
| /blog/driveway/modern-driveway-ideas | "driveway design ideas 2026" fell from 3,550 impressions (all-time) to 7 in the last 28 days; "modern concrete driveway" is now the top query (pos 11.7); hard-coded year | T: Driveway Design Ideas for 2026: 10 Modern Looks That Work · H1: Driveway Design Ideas for 2026 · M: $6–20 · I: 2026, $6–12, $14–20 | T: Modern Concrete Driveway Ideas: 10 Designs With Costs ({YEAR}) · H1: Modern Concrete Driveway Ideas for {YEAR} · M: $6–28 · I: {YEAR}, $8–16, $15–28 |
| /blog/patio/best-concrete-finish-pool-deck | Volume is in "concrete finishes for pool decks", "pool deck finishes", "swimming pool concrete deck finishes" and "concrete pool deck finishes" (~710 impressions), not "best concrete finish for pool deck" (28); H2 prices outdated | T: Best Concrete Finish for Pool Decks: Which One to Choose · M: "Best concrete finish…2026 comparison" · H2s ($6–10), ($3–8) | T: Concrete Pool Deck Finishes Compared: Slip, Heat & Cost · M: "Concrete finishes for pool decks compared…" · H2s ($6–12) computed, ($4–8) |
| /blog/walkway/flagstone-vs-concrete-walkway | Meta, intro and body said flagstone $25–45 (mortared only) and stamped $12–18; verified: dry-laid $15–32, mortared $20–45, stamped $8–28, plain $6–12 | M/I/body/FAQ: $25–45 vs $12–18, $2,000–4,000 difference | M/I/body/FAQ: computed from INSTALLED; difference about $1,000–2,300 at typical prices. Title unchanged (it matches the queries) |
| /materials/flagstone | Ranks at pos 4.8 for "is flagstone cheaper than concrete"; meta and intro said $25–45, "two to three times stamped" | M/I: $25–45 | M/I: $15–32 dry-laid, $20–45 mortared vs stamped $8–28 (computed) |
| /materials/exposed-aggregate | Most impressions are driveway/patio/porch variants (exposed aggregate driveway 305, patio 251, porch 126); meta 174 chars; price $8–14 outdated | T: Exposed Aggregate Concrete: Cost, Looks and Finish Guide · M/I: $8–14 | T: Exposed Aggregate Concrete: Driveway & Patio Cost Guide · M/I: $8–16 |
| /materials/broom-finish | Driveway and patio variants (broom finish concrete driveway 75, patio 55, broom finish driveway 37); meta 182 chars; price $6–10 outdated | T: Broom Finish Concrete: Cost, Texture and Best Uses · M/I: $6–10 | T: Broom Finish Concrete: Driveway & Patio Cost, Texture · M/I: $6–12 |
| /blog/patio/patio-color-ideas | Hard-coded "2026" in title, meta and intro (year-stamped queries decay) | "2026" | `CURRENT_YEAR` (same text in 2026) |
| /blog/driveway/concrete-driveway-color-guide | Hard-coded "2026" in meta | "2026" | `CURRENT_YEAR` |

Not changed, because the data doesn't justify it:
- `/` (homepage product page, out of scope)
- stamped-concrete-patterns and stamped-concrete-driveway (low impressions, no clear signal)
- inspiration/stamped-concrete-driveway-cobblestone (pos 1–4 on "stamped cobblestone driveway", CTR 1.9%)
- colored-concrete (title already matches "dye vs stain")

## 2026-10-10 (later): homepage rework (user decision: drop the visualizer pitch)

| Page | Evidence | Before | After |
|---|---|---|---|
| / | User dropped the AI visualizer (generation was a stub; "50,000+ designs" and the testimonials were not real). Homepage GSC is negligible (343 impressions, no meaningful queries). | T: Redesign Your Patio, Driveway & Backyard with AI · Hero = configurator + paywall, pricing, social proof, testimonials, before/after "generated in seconds" | T: Free Paver, Patio & Driveway Calculators · Hero = tool pitch + live patio cost widget · Tool grid · How the numbers work (cited source count) · Project tiles (real counts) · Finishes · Guides · Tool FAQs |

Sitewide: the header CTA is now "Free Calculators" (→ /tools); the footer CTA/blurb, landing-page heroes and CTAs, guide CTAs, and the waitlist blocks became tool links; visualizer promises were removed from content; 14 dead visualizer components were deleted.

## 2026-11-16: GSC re-check (data: `_data/gsc/2026-11-16/`)

Re-check of the 2026-10-10 changes, comparing the 28 days before (Sep 12–Oct 9) with Oct 19–Nov 15: black-concrete-driveway went from 11 to 19 clicks and from position 4.8 to 4.5, and "black concrete" grew from 7 to 624 impressions. modern-driveway-ideas went from 16 to 45 clicks. best-concrete-finish-pool-deck went from 2 to 10 clicks (position 23.6 → 18.8). Those three stay as they are. exposed-aggregate is flat, and broom-finish slipped from position 11.2 to 15.0 (left alone; re-check after the November core update). flagstone lost its primary query, so it is fixed below.

| Page | Evidence | Before | After |
|---|---|---|---|
| /materials/flagstone | "is flagstone cheaper than concrete" fell from position 4.9 to 45, and the page average from 12.1 to 32.2. The Oct 10 intro hedged ("typically above stamped concrete") instead of answering, and the Cost section, FAQ and 200 sq ft example still showed the old $25–45 range, contradicting the intro. | I: "Flagstone runs $15–32 … dry-laid and $20–45 mortared — typically above stamped concrete …"; Cost/FAQ: $25–45, stone $3–8, $5,000–9,000 | I: answer-first "No, flagstone is not cheaper than concrete. It runs $15–32 … against $6–12 for plain concrete and $8–28 for stamped …"; Cost/FAQ computed from `INSTALLED`/`MATERIAL_ONLY` (stone $2–15, 200 sq ft $3,000–6,400 dry-laid / $4,000–9,000 mortared); new FAQ "Is flagstone cheaper than concrete?"; flagstone calculator link. Title unchanged. |
| /blog/driveway/black-concrete-driveway | Additive only. The page has the strongest image-search position on the site ("black concrete" image search position 2.3, 893 impressions in 28 days) | 0 section images | 6 section images (ChatGPT backend of the image-gen pipeline, prompts in `image-gen/master-pin-tracker.csv`); related tools + driveway finish selector, paver calculator. Title, meta, intro and hero image unchanged. |
| /blog/driveway/modern-driveway-ideas | Additive only. Top click page; links help Google discover the "URL is unknown" pages | — | Contextual links to exposed-aggregate-driveway and black-stamped-concrete; related links to charcoal-concrete-driveway, black-stamped-concrete, exposed-aggregate-driveway, driveway-edging-ideas, paver calculator, paver installation cost calculator. Title, meta and intro unchanged. |

Not frozen, changed on the same evidence: circular-driveway-ideas and driveway-border-ideas got two appended sections each (small circular / round vs horseshoe vs turnaround; paver border / entrance border) plus one FAQ and tool links each. Cannibalization: /materials/stamped-concrete hands "stamped concrete driveway" to the blog guide (H2 renamed, keyword removed, link moved up); concrete-patio-vs-pavers links stamped-concrete-vs-pavers for the stamped-vs-pavers cost queries; the meta description of /inspiration/modern-driveway-concrete now describes its specific look instead of the generic "modern concrete driveways".

Re-check all of the above after the November 2026 core update finishes (expected ~2026-11-24), around 2026-12-01.
