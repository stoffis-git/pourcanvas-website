# Content Package Brief: Paving Tool Configs

You write tool page configs in `src/content/tools/{slug}.ts`. Each file replaces an existing PLACEHOLDER. Keep the exported const name and slug exactly as they are.

## Read first
1. `.claude/page-build-guide.md`: binding rules.
2. `src/content/tools/paver-patio-cost-calculator.ts`: the **reference implementation**. Copy its structure, tone and techniques exactly.
3. `src/lib/tools/paving.ts` (engine, `PavingInputs`, `PavingResult`), `src/lib/tools/tables.ts` (HTML table helpers), `src/lib/tools/data/paving.ts` (all constants), `src/lib/format.ts`, `src/content/tools/_shared.ts` (`pavingAt`, `SLABCALC`, `a()`).
4. `_planning/refactor-2026-10/sitemap.md` (keyword per URL) and `crosslinks.md` (links per tool).

## Hard rules
- **Numbers.** Every number comes from `pavingAt(...)` results, the table helpers, or constants in `data/paving.ts`. Interpolate them and never type them by hand. The only exceptions are general, non-price facts that need no source (e.g. "a standard walkway is 3–4 ft wide", "two cars need about 20 ft of width"). No invented prices, coverage rates or percentages.
- **Year.** Use `CURRENT_YEAR`; never write 2026 in copy (dates in `datePublished`/`lastUpdated` are fine: "2026-10-10").
- **title** ≤ 60 chars, contains the primary keyword; cost pages include `(${CURRENT_YEAR})` and a number. **h1** = plain "{Topic} Calculator".
- **metaDescription** 140–160 characters. It opens with the question or the answer, contains a number and 1–2 size examples. Check the length.
- **intro** 40–60 words, answer-first, worked example(s) from the engine, ends with an instruction line ("Enter your … to get …").
- **sections**: 8–11 H2s. The total body is 1,100–1,600 words. Almost every section has a table from the helpers (pick sizes relevant to the page). Each heading targets a keyword variant. Body HTML only (`<p>`, `<ul>`, `<li>`, `<strong>`, tables from helpers). Use 6–15 internal links via `a()` across the body. Link SlabCalc only for concrete cost or volume (`SLABCALC.*`). At most 2 SlabCalc links per page.
- **faqs**: 5–7. At least 2 answers start with "According to PourCanvas," followed by a specific engine number.
- **tips**: 5 one-liners.
- **relatedTools**: 6–8 slugs from the 10 tool slugs (never self). **relatedGuides**: 5–7 items `{label, to}`. The first two are used in the sentence "For the full background, read our {g1} and {g2}." so make them lowercase descriptive phrases. Use real page titles for the rest.
- **Allowed internal URLs only:** the `path` column of `_planning/refactor-2026-10/url-inventory.csv`, `/tools`, `/methodology` and the 10 `/tools/{slug}` URLs. Never link a URL that isn't on this list.
- `expectedDefaultResult`: a string the default render shows. For cost views use `moneyRange(d.pro)`; for quantity views use the primary number formatted as the tool shows it (see `primary()` in `src/components/tools/PavingTool.tsx`: e.g. `${num(d.paverCount)} pavers`, `${num(d.baseTons, 1)} tons`, `${num(d.polyBags)} bags`).
- `keywords`: primary + secondaries from sitemap.md.
- Neutral, homeowner-facing, concrete and specific. No fluff, no "In this article", no emojis. American English.

## Only edit your own files
Edit only the files assigned to you. Never touch `index.ts`, components, engine, data or other configs. If you think the engine or data is wrong or missing something, **report it** and don't change it.

## Verify before reporting
- `npx tsc --noEmit -p tsconfig.app.json` passes.
- Write a temporary test `src/content/tools/__check_{yourname}.test.ts`. It imports your configs and logs: title length, meta length, intro word count, section count, total body word count (strip tags), internal link count in bodies, and FAQ count. Run it with `npx vitest run src/content/tools/__check_{yourname}.test.ts`. Fix anything outside the limits, then **delete the test file**.
- Do NOT run `npm run build` (the main session builds; parallel builds clash).
- Report: files changed, the metrics per page, and any data/engine concerns.
