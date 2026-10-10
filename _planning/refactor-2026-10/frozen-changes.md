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
