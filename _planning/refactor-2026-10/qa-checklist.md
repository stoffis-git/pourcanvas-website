# QA Checklist

## Automated: `scripts/check-pages.mjs` (runs on `dist/` after build)

**Every page:**
- [ ] exactly one `<title>`, one meta description (140–160 chars on tool pages), one canonical without query params
- [ ] exactly one `BreadcrumbList` JSON-LD; every JSON-LD block parses
- [ ] H1 count = 1
- [ ] no hard-coded past year in title/meta ("2025" on a 2026 build)
- [ ] internal links resolve to a prerendered file (no 404s)
- [ ] if `FAQPage` JSON-LD exists, every answer text also appears in the HTML body

**`/tools/*` pages:**
- [ ] `SoftwareApplication` JSON-LD with `offers.price "0"`, `dateModified`
- [ ] the default result value from the engine appears in the HTML (the config exposes `expectedDefaultResult`)
- [ ] intro (first `<p>` after H1) is 40–60 words and contains a digit
- [ ] 7–13 H2s; `<main>` word count 1,000–1,800; 25–35 internal links in `<main>`
- [ ] "Last updated" present; Related Tools ≥6, Related Guides ≥5
- [ ] listed in `sitemap-tools.xml` with lastmod

**FROZEN pages** (`url-inventory.csv`):
- [ ] title, meta description, canonical, H1 and intro text are byte-identical to the baseline snapshot (`scripts/check-pages.mjs --snapshot` writes `_planning/refactor-2026-10/frozen-baseline.json` before P1.5)
- [ ] H2 order unchanged; new H2s only appended at the end

**Sitemaps:**
- [ ] `/sitemap.xml` is an index; child URL counts sum to the number of prerendered pages (minus 404)

## Unit tests (vitest)

- [ ] engine formulas: known cases, e.g. 12×12 with 6×9 pavers at 5% waste → expected count; 12×16 patio base tons; metric round-trip
- [ ] `metaDescription` and intro example numbers equal the engine output for config defaults
- [ ] URL params parse/serialize round-trip; invalid params fall back to defaults

## Manual (me, browser at 375px + 1280px)

- [ ] tool works without layout shift; results update on input; mobile "Calculate" scrolls to result
- [ ] widget → teaser → "See full breakdown" opens the tool in the same tab with prefilled inputs; Back returns to the article scroll position
- [ ] copy result contains the share URL
- [ ] Umami events visible (`widget_submit`, `widget_handoff`, `tool_calculate`, `tool_copy`)
- [ ] Rich Results Test on 1 tool page + 1 host page (SoftwareApplication, FAQ, Breadcrumb)

## Independent review (subagent, per phase)

A reviewer agent that did not write the code checks:
- guide compliance
- copy numbers vs engine/data
- crosslink map coverage (`crosslinks.md`)
- no slabcalc-lane cannibalization (no concrete cost/volume calculators)
- FROZEN diffs

Findings go to me for fixing; the reviewer re-checks.
