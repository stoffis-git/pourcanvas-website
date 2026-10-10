# Target Sitemap / Information Architecture

Legend: **NEW** = to build, **FROZEN** = additive-only (see `url-inventory.csv`), **W:** = gets a lean widget (→ target tool). Phase in brackets.

## XML sitemaps (submit each separately in GSC)

`/sitemap.xml` is a **sitemap index**. The existing GSC submission keeps working. Submit each child separately as well so GSC reports indexing per section:

| Sitemap | Contents | URLs today |
|---|---|---|
| `/sitemap-core.xml` | home, pillar landings, /blog + /blog/{pillar}, /guides/*, /materials, /tools, /methodology, /terms | 13 → 15 |
| `/sitemap-tools.xml` | /tools/* | 0 → 8 (P1) → 10 (P1b) → 13 (P2) |
| `/sitemap-blog.xml` | /blog/{pillar}/{slug} | 41 |
| `/sitemap-materials.xml` | /materials/* | 9 → 10 (P3 salt-finish) |
| `/sitemap-inspiration.xml` | /inspiration/* | 77 |
| `/sitemap-palette.xml` | /palette/* | 5 |
| `/sitemap-before-after.xml` | /before-after/* | 5 |

Implemented in `scripts/generate-sitemap.mjs` (section rules in `SECTIONS`); each child also carries image entries. `robots.txt` keeps pointing at `/sitemap.xml`. Submitting the children in GSC is a manual step for the user, because the current API token is read-only.

## Tree

```
/                                          FROZEN  homepage configurator (out of scope; add "Free tools" strip [P0])
├── /tools                                 NEW [P0] hub (ItemList): Paving calculators · Finish & design tools
│   ├── /tools/paver-calculator                     NEW [P1]  "paver calculator" 10K–100K
│   ├── /tools/paver-patio-cost-calculator          NEW [P1]  4× 1K–10K cost variants
│   ├── /tools/paver-installation-cost-calculator   NEW [P1]  1K–10K + labor variants
│   ├── /tools/paver-base-calculator                NEW [P1]  1K–10K
│   ├── /tools/paver-sand-calculator                NEW [P1]  1K–10K
│   ├── /tools/polymeric-sand-calculator            NEW [P1]  1K–10K
│   ├── /tools/patio-cost-calculator                NEW [P1]  comparator: concrete/stamped/pavers/flagstone, 100–1K ×6
│   ├── /tools/flagstone-calculator                 NEW [P1]  100–1K
│   ├── /tools/paver-walkway-cost-calculator        NEW [P1b] 100–1K
│   ├── /tools/paver-driveway-cost-calculator       NEW [P1b] 100–1K
│   ├── /tools/concrete-finish-selector             NEW [P2]  types of concrete finishes / best finish
│   ├── /tools/pool-deck-finish-selector            NEW [P2]  pool deck finishes, best pool deck material
│   └── /tools/driveway-finish-selector             NEW [P2]  best concrete finish for driveway, modern finishes
├── /methodology                           NEW [P1] data sources for every number (linked from every tool result)
├── /patio  /driveway  /walkway            pillar landings (unknown to Google → link from hub + footer + tools)
├── /guides/concrete-{patio|driveway|walkway}   hub guides (2 of 3 unknown to Google)
├── /blog → /blog/{pillar} → /blog/{pillar}/{slug}   41 articles
│     FROZEN + W: /blog/walkway/flagstone-vs-concrete-walkway   W→ patio-cost-calculator (material=flagstone)
│     W: /blog/patio/concrete-patio-vs-pavers                    W→ patio-cost-calculator (material=pavers)
│     W: /blog/patio/stamped-concrete-vs-pavers                  W→ patio-cost-calculator (material=stamped)
│     FROZEN + W[P2]: /blog/patio/best-concrete-finish-pool-deck W→ pool-deck-finish-selector
│     FROZEN: black-concrete-driveway, modern-driveway-ideas, patio-color-ideas, concrete-driveway-color-guide,
│             stamped-concrete-patterns, stamped-concrete-driveway (P3 appends only)
├── /materials → /materials/{slug}
│     W: /materials/concrete-pavers         W→ paver-calculator
│     FROZEN + W: /materials/flagstone      W→ flagstone-calculator
│     FROZEN + W[P2]: /materials/broom-finish, /materials/exposed-aggregate   W→ concrete-finish-selector
│     FROZEN: /materials/colored-concrete
│     NEW [P3]: /materials/salt-finish
├── /inspiration/{slug}  (77)   image-search assets; each links 1 relevant tool [P1 for paver/flagstone/stamped tiles]
├── /palette/{slug}  (5)
├── /before-after/{slug} (5)
└── /terms
```

## Keyword → URL assignment (one primary per URL, no overlaps)

| URL | Primary | Secondary |
|---|---|---|
| /tools/paver-calculator | paver calculator | how many pavers do i need, paver patio calculator, brick paver calculator, paver stone calculator, how many pavers for a 12x12 patio |
| /tools/paver-patio-cost-calculator | paver patio cost calculator | estimate paver patio cost, cost calculator for paver patio, patio paving cost calculator, brick patio estimator, paver patio cost |
| /tools/paver-installation-cost-calculator | paver installation cost calculator | labor cost to install pavers calculator, paver patio installation cost calculator |
| /tools/paver-base-calculator | paver base calculator | how much paver base do i need |
| /tools/paver-sand-calculator | paver sand calculator | bedding sand for pavers |
| /tools/polymeric-sand-calculator | polymeric sand calculator | how much polymeric sand do i need |
| /tools/patio-cost-calculator | patio cost calculator | patio cost estimator, patio estimator, cheapest patio material, pavers vs concrete cost (tool side) |
| /tools/flagstone-calculator | flagstone calculator | how much flagstone do i need, flagstone cost calculator, flagstone patio cost |
| /tools/paver-walkway-cost-calculator | paver walkway cost calculator | |
| /tools/paver-driveway-cost-calculator | driveway paving cost calculator | paver driveway cost |
| /blog/walkway/flagstone-vs-concrete-walkway (FROZEN) | is flagstone cheaper than concrete | flagstone vs concrete (unchanged) |
| /blog/patio/concrete-patio-vs-pavers | concrete patio vs pavers | (unchanged) |

**Not ours (link to slabcalc instead):** concrete patio cost calculator, concrete driveway cost, stamped concrete cost calculator, concrete pool deck cost, any concrete volume or bags query.

## Navigation changes [P0]

- Header `navLinks`: add **Tools** (→ /tools) as the first item.
- Footer: new **Free Tools** column (paver calculator, paver patio cost, polymeric sand, patio cost comparator, flagstone calculator, all tools). Grid becomes `repeat(5,1fr)`.
- Homepage: a small "Free calculators" link strip below the hero. This is additive; nothing in the configurator changes.
