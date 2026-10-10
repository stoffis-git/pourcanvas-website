# Content Package Brief: P3 Support Content

Support pages wrap the tools. They feed image search and AI answers, and they hand users to a tool. The repo idiom is `Article` / `MaterialPage` objects in `src/content/**` (see `src/content/types.ts`). Section `body` is an HTML string.

## Read first
`.claude/page-build-guide.md` (§6 guide pages, §0 FROZEN rule), `_planning/refactor-2026-10/README.md`, `src/content/types.ts`. The existing articles in your file show the tone.

## FROZEN pages (listed in `_planning/refactor-2026-10/url-inventory.csv`, status FROZEN)
- Never change `title`, `metaDescription`, `headline`, `intro`, `slug`, or existing section headings, bodies or order.
- Allowed: **append** new sections at the END of `sections`, append FAQs at the end, add `relatedTools`, add slugs to `relatedSlugs`, and set `updatedAt` to "2026-10-10".

## New pages
- Article fields: `slug, pillar, title (≤60 chars, keyword first), headline, metaDescription (140–160 chars, has a number), targetKeywords, ogImage, publishedAt "2026-10-10", intro (answer-first, 40–70 words), sections (7–10, 1,100–1,600 words total, tables where useful), relatedSlugs, relatedMaterials, faqs (5–7, ≥2 starting "According to PourCanvas,"), relatedTools`.
- `ogImage`: reuse an existing `https://images.pourcanvas.com/...` URL from a closely related inspiration page in `src/content/inspiration/index.ts`. Never invent image URLs.
- Add each new article to the `relatedSlugs` of 1–2 related existing articles in the same file, so the new pages get internal links.

## Numbers and sources
- Installed prices for pavers, flagstone, plain, stamped and exposed-aggregate concrete come ONLY from `src/lib/tools/data/paving.ts` (`INSTALLED`). Import it and interpolate, the way `src/content/articles/walkway.ts` does in its "Dry-Laid vs Mortared" section.
- Facts outside that file (pigment dosage, fading behavior, solar reflectance, surface temperatures, freeze-thaw guidance) need a **fetched** source. Cite it inline as `<a href="URL" rel="nofollow noopener">Source name</a>`. Prefer manufacturers' technical data, ACI/PCA/NRMCA/ASCC, LBNL/EPA, and trade press (Concrete Decor, Concrete Construction). No numbers without a source; if you can't source a number, write the sentence qualitatively.
- Use `CURRENT_YEAR` from `@/lib/year` for any year in copy.
- Allowed internal links: the `path` column of `url-inventory.csv`, `/tools`, `/methodology`, `/tools/{slug}` for slugs in `src/content/tools/index.ts`, plus the new pages you create. Every page links ≥1 relevant tool in its body.

## Only edit your assigned files. Verify before reporting
- `npx tsc --noEmit -p tsconfig.app.json` passes.
- Do NOT run `npm run build`.
- Report: pages added or changed, word counts, sources used (URL + fetched yes/no), and anything uncertain.
