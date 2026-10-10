# Tool Engine Spec: Finish Selector (P2, draft, finalize after P1 ships)

Decision engine (`src/lib/tools/finish.ts`). It scores each finish against the user's situation and returns a ranked list, with reasons, why-not notes and links to /materials pages.

**Inputs:**
- surface: driveway, patio, walkway, pool deck
- climate: freeze-thaw, hot sun, wet/coastal, mild
- priority: slip resistance, barefoot comfort (heat), low upkeep, look, budget
- style: modern/minimal, traditional, rustic/natural

**Finishes:**
- broom (fine, medium or heavy)
- exposed aggregate
- salt finish
- stamped (ashlar, cobblestone, wood plank, slate)
- smooth/troweled
- sandblasted
- stained or integral color: a color modifier, not a finish

**Scoring matrix:** finish × criterion, rated 1–5, each cell with a sourced rationale. The research gaps (SERP 2026-10-10) are what we cover:
- no consumer page states the freeze-thaw risk of salt finish or exposed aggregate (trade sources JLC and Fine Homebuilding do)
- no slip or heat numbers anywhere
- ConcreteNetwork pool-deck pages date from 2021

**Heat table source plan:** LBNL Heat Island Group solar reflectance data and EPA cool pavements, plus the manufacturer claim for Kool Deck, labeled as a claim.

| Page | Defaults |
|---|---|
| concrete-finish-selector | patio, mild, look |
| pool-deck-finish-selector | pool deck, hot sun, barefoot comfort |
| driveway-finish-selector | driveway, freeze-thaw, low upkeep |

Widget hosts: best-concrete-finish-pool-deck, materials/broom-finish, materials/exposed-aggregate, blog/patio/exposed-aggregate-vs-broom-finish.

Results stay in our lane: the cost line links slabcalc (pool deck and driveway cost calculators).
