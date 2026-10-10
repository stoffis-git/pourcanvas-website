# Numbers issues: input for the final numbers-verification round

Collected during the build. The verification round resolves each issue and applies the fix: data constant, or content via an appended "update" note on FROZEN pages.

| # | Where | Issue | Found by |
|---|---|---|---|
| 1 | src/lib/tools/data/paving.ts | All `status: "pending"` constants need a fetched source (several are snippet-only: HomeGuide, Angi, aggregators). `FLAGSTONE_SQFT_PER_TON` has no source at all. | plan |
| 2 | black-concrete-driveway (FROZEN) existing heat section | Says 140–160°F; the EPA Cool Pavements Compendium says 120–150°F peak for dark pavements. | P3a agent |
| 3 | Existing articles generally | Plain concrete "$6–12/sq ft" (older sections) vs data `INSTALLED["plain-concrete"]` $6–14. | P3a agent |
| 4 | materials/concrete-pavers (not frozen) | Meta and intro say pavers "$15–30/sq ft installed" vs data $10–22. | me |
| 5 | Homepage FAQ (FROZEN /) | "broom-finish concrete patio runs $4–$7/sq ft" vs data $6–14. | me |
| 6 | blog/walkway/flagstone-vs-concrete-walkway (FROZEN) | "$25–45 flagstone" = mortared; dry-laid $15–32. Handled by an appended section; verify the ranges. | me |
| 7 | Engine | `DRIVEWAY_MULTIPLIER` 1.2 is derived, not sourced; it is also applied to the concrete comparison rows. | batch C agent |
| 8 | Engine | Clay soil raises base tons but not the installed price; curved edges raise waste but not the installed price. | batch A/C agents |
| 9 | Finish data | Sandblast cost "$2.50–5" is snippet-only (SBc S); the salt finish "avoid" rule rests on one fetched page. | finish research |
| 10 | best-concrete-finish-pool-deck (FROZEN) existing sections | Unsourced "15–25°F cooler" and "$3–8/sq ft" cool-deck coatings. | P3b agent |
| 11 | exposed-aggregate-vs-broom-finish | Unsourced slip coefficients "ASTM 0.60 / 0.45–0.55"; research found no published DCOF per finish. | P3b agent |
| 12 | salt-finish inspiration pages vs /materials/salt-finish | Inspiration pages say $7–12 and $8–14; the material page says $7–15 (INSTALLED plain + $1). | P3b agent |
