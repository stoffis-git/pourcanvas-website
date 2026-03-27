# PatioCanvas Material Content Brief — SEO Materials Program

## Purpose

This document defines the content production pipeline for PatioCanvas's `/materials` dimension. Material hub pages are parallel to the `/blog` project pillars — where blog articles are organized by *what you're building* (patio, driveway, walkway), material pages are organized by *what it's built from* (stamped concrete, exposed aggregate, etc.).

**How to add a new material page:**
1. Pick a row from the tables below and set its status to `IN PROGRESS`
2. Write content to spec (see Content Rules below)
3. Create `src/content/materials/[slug].ts` following the existing Phase 1 files as a template
4. Export from `src/content/materials/index.ts` and add to `allMaterialPages`
5. Add `relatedMaterials` back-references in the relevant article `.ts` files
6. Add an OG image to `public/og/` (see Image Specs)
7. Run `npm run build` — new page appears in `dist/materials/[slug].html`
8. Commit and push — Vercel auto-deploys

---

## Phase 1 — Core Concrete Finishes

The four most-searched concrete finish terms. These are already written and live.

| Slug | Headline | Primary Keyword | Related Articles | Status |
|------|----------|-----------------|-----------------|--------|
| `stamped-concrete` | Stamped Concrete | stamped concrete | patio/stamped-concrete-ideas, driveway/stamped-concrete-driveway | **LIVE** |
| `exposed-aggregate` | Exposed Aggregate Concrete | exposed aggregate concrete | driveway/exposed-aggregate-driveway, patio/concrete-patio-cost | **LIVE** |
| `broom-finish` | Broom Finish Concrete | broom finish concrete | patio/concrete-patio-cost, driveway/concrete-driveway-cost | **LIVE** |
| `colored-concrete` | Colored Concrete | colored concrete | patio/patio-color-ideas, patio/concrete-patio-cost | **LIVE** |

---

## Phase 2 — Comparison Materials + Nav Link

Add these after Phase 1 is indexed and receiving traffic. "Materials" nav link added to site header alongside Phase 2.

| Slug | Headline | Primary Keyword | Related Articles | Target Words | Status |
|------|----------|-----------------|-----------------|--------------|--------|
| `concrete-pavers` | Concrete Pavers | concrete pavers | patio/concrete-patio-vs-pavers | 900 | **LIVE** |
| `flagstone` | Flagstone | flagstone walkway | walkway/flagstone-vs-concrete-walkway, patio/concrete-patio-vs-pavers | 900 | **LIVE** |

### Content spec for Phase 2

**`concrete-pavers`** — target homeowners comparing poured concrete vs pavers. Sections: what concrete pavers are (different from poured concrete), pros/cons, cost ($15–30/sq ft installed), patterns and styles, maintenance, and when to choose pavers over stamped concrete. Cross-link to `patio/concrete-patio-vs-pavers`.

**`flagstone`** — target homeowners considering natural stone for walkways or patios. Sections: types of flagstone (bluestone, limestone, slate, travertine), cost ($25–45/sq ft), setting methods (dry vs mortared vs stepping stones), maintenance, how it compares to stamped concrete. Cross-link to `walkway/flagstone-vs-concrete-walkway`.

---

## Phase 3 — Long-Tail Materials + Matrix Pages

Phase 3 adds lower-volume but high-intent material pages, plus optional matrix pages combining material + project (e.g., `/materials/stamped-concrete/patio`).

### Phase 3a — Additional material hubs

| Slug | Headline | Primary Keyword | Target Words | Status |
|------|----------|-----------------|--------------|--------|
| `travertine` | Travertine Pool Deck | travertine pool deck | 800 | **LIVE** |
| `polished-concrete` | Polished Concrete Outdoor | polished concrete outdoor | 800 | **LIVE** |
| `concrete-overlay` | Concrete Overlay | concrete overlay | 900 | **LIVE** |

### Phase 3b — Matrix pages (optional, high SEO value)

Matrix pages live at `/materials/[material]/[pillar]` (e.g., `/materials/stamped-concrete/patio`). They are thin combination pages targeting the intersection query ("stamped concrete patio") that cross-link both the material hub and the relevant pillar article.

These require a `MatrixPage` route and template. Build only after Phase 1 and 2 pages are indexed and performing.

| Slug | Target Keyword | Status |
|------|---------------|--------|
| `stamped-concrete/patio` | stamped concrete patio | TODO |
| `stamped-concrete/driveway` | stamped concrete driveway | TODO |
| `exposed-aggregate/driveway` | exposed aggregate driveway | TODO |
| `exposed-aggregate/patio` | exposed aggregate patio | TODO |

---

## Content Rules

### Material Hub Pages
- **Word count:** 900–1,200 words (intro + 5–7 sections)
- **Structure:** `intro` (2–3 sentences) + `sections[]` (each: `heading`, `body`) + `prosAndCons` (5 pros, 5 cons)
- **Upsell tiles:** injected automatically — one mid-article, one at bottom
- **Links:** `relatedArticles` must include at least 2 cross-links to project pillar articles
- **Back-references:** add `relatedMaterials` to the relevant article `.ts` files — both directions must be wired before publishing
- **Tone:** practical, factual, homeowner-focused. Lead with what the material *is*, then cost, then tradeoffs
- **No AI fluff:** avoid "it's worth noting", "at the end of the day", "in conclusion"

### Pros/Cons Block
Every material page should include a `prosAndCons` object with 4–6 items in each list. The block renders as a two-column green/red card above the sections.

---

## Image Specs

All OG/hero images go in `public/og/`.

| Spec | Value |
|------|-------|
| Format | JPEG |
| Dimensions | 1200 × 630 px minimum |
| File size | < 300 KB |
| Naming | `material-[slug].jpg` (e.g., `material-stamped-concrete.jpg`) |

---

## SEO Architecture Notes

- `/materials` is a **parallel dimension** to `/blog` — not a sub-section of it. The URL structure reflects this: no nesting under `/blog`.
- Material pages target **material-intent queries** ("what is stamped concrete", "stamped concrete pros cons", "exposed aggregate cost"). Blog articles target **project-intent queries** ("stamped concrete patio ideas", "driveway resurfacing").
- **Bidirectional linking** between the two dimensions is what builds authority. Every material hub links out to 2+ project articles. Every project article with a `relatedMaterials` field links back to its material hubs.
- Header nav link for `/materials` added at Phase 2.

---

## Keyword Strategy

- **Phase 1 targets:** high-volume, finish-specific queries — "stamped concrete", "exposed aggregate concrete", "broom finish concrete", "colored concrete"
- **Phase 2 targets:** comparison material terms — "concrete pavers", "flagstone" — where users are deciding between materials
- **Phase 3 targets:** long-tail combinations and niche materials — "travertine pool deck", "polished concrete outdoor"
- **Cluster logic:** material pages should cluster around their related project articles, not around each other
