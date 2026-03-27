# PatioCanvas Content Brief — SEO Content Program

## Purpose

This document defines the content production pipeline for PatioCanvas's programmatic SEO program. Each row in the tables below maps directly to a data entry in `src/content/articles/[pillar].ts` (blog articles) or `src/content/inspiration/index.ts` (inspiration/landing pages).

**How to add new content:**
1. Pick a row from the tables below and set its status to `IN PROGRESS`
2. Write content to spec (see Content Rules below)
3. Add the entry to the relevant TypeScript data file
4. Add an OG image to `public/og/` (see Image Specs)
5. Run `npm run build` to verify the new page renders
6. Commit and push — Vercel auto-deploys

---

## Blog Articles

Articles live at `/blog/[pillar]/[slug]`. Each is a pillar-linked content piece targeting a specific long-tail keyword. They contain an intro, 4–6 sections, and two embedded upsell tiles (one mid-article, one at the bottom).

### Pillar: Patio — `/blog/patio`

| Slug | Title | H1 Headline | Primary Keyword | Secondary Keywords | Target Words | Status |
|------|-------|-------------|-----------------|-------------------|--------------|--------|
| `stamped-concrete-ideas` | 15 Stamped Concrete Patio Ideas for 2025 | 15 Stamped Concrete Patio Ideas That Look Expensive | stamped concrete patio ideas | stamped concrete patterns, outdoor patio design | 900 | **LIVE** |
| `concrete-patio-cost` | How Much Does a Concrete Patio Cost in 2025? | Concrete Patio Cost: What Homeowners Actually Pay | concrete patio cost | patio installation price, concrete slab cost | 900 | **LIVE** |
| `patio-color-ideas` | Best Concrete Patio Colors for a Modern Backyard | The Best Concrete Patio Colors (With Real Examples) | concrete patio colors | colored concrete, patio stain colors | 900 | **LIVE** |
| `concrete-patio-vs-pavers` | Concrete Patio vs Pavers: Which Wins in 2025? | Concrete Patio vs Pavers: An Honest Comparison | concrete patio vs pavers | patio materials comparison, pavers cost | 1000 | **LIVE** |
| `small-patio-ideas` | Small Concrete Patio Ideas That Make Any Backyard Feel Bigger | Small Concrete Patio Ideas That Actually Work | small patio ideas | small backyard patio, compact patio design | 800 | **LIVE** |
| `concrete-patio-resurfacing` | Concrete Patio Resurfacing: When It's Worth It and When to Replace | Should You Resurface or Replace Your Concrete Patio? | concrete patio resurfacing | patio renovation, resurface concrete | 900 | **LIVE** |

### Pillar: Driveway — `/blog/driveway`

| Slug | Title | H1 Headline | Primary Keyword | Secondary Keywords | Target Words | Status |
|------|-------|-------------|-----------------|-------------------|--------------|--------|
| `stamped-concrete-driveway` | Stamped Concrete Driveway Ideas: 12 Styles Worth Considering | Stamped Concrete Driveways That Boost Curb Appeal | stamped concrete driveway | driveway design ideas, decorative concrete | 900 | **LIVE** |
| `exposed-aggregate-driveway` | Exposed Aggregate Driveway: Pros, Cons, and Best Uses | Is an Exposed Aggregate Driveway Right for You? | exposed aggregate driveway | aggregate finish, textured driveway | 900 | **LIVE** |
| `concrete-driveway-cost` | Concrete Driveway Cost: What to Budget in 2025 | How Much Does a Concrete Driveway Cost? | concrete driveway cost | driveway installation price | 900 | **LIVE** |
| `driveway-resurfacing` | Driveway Resurfacing: Concrete vs Asphalt vs Overlay | Driveway Resurfacing: What's Worth the Money? | driveway resurfacing | concrete overlay, driveway repair | 900 | **LIVE** |
| `circular-driveway-ideas` | Circular Driveway Ideas: Concrete Designs That Add Curb Appeal | Circular Driveway Designs That Actually Work | circular driveway ideas | round driveway, curved driveway design | 800 | **LIVE** |

### Pillar: Walkway — `/blog/walkway`

| Slug | Title | H1 Headline | Primary Keyword | Secondary Keywords | Target Words | Status |
|------|-------|-------------|-----------------|-------------------|--------------|--------|
| `front-walkway-ideas` | 10 Concrete Front Walkway Ideas for Any Home Style | Concrete Front Walkway Ideas That Actually Look Good | concrete walkway ideas | front path ideas, walkway design | 900 | **LIVE** |
| `flagstone-vs-concrete-walkway` | Flagstone vs Concrete Walkway: Which Is Worth the Cost? | Flagstone vs Concrete Walkway: An Honest Comparison | flagstone vs concrete walkway | walkway materials comparison | 900 | **LIVE** |
| `backyard-walkway-ideas` | Backyard Walkway Ideas That Connect Your Outdoor Spaces | Backyard Walkway Ideas for Every Landscape Style | backyard walkway ideas | garden path, stepping stone walkway | 800 | **LIVE** |
| `concrete-walkway-cost` | Concrete Walkway Cost: What Homeowners Pay in 2025 | How Much Does a Concrete Walkway Cost? | concrete walkway cost | walkway installation price | 800 | **LIVE** |
| `curved-walkway-ideas` | Curved Walkway Ideas: When a Straight Path Isn't the Right Call | Curved Walkway Designs That Make Your Yard Feel Designed | curved walkway ideas | curved garden path, winding walkway | 800 | **LIVE** |

---

## Inspiration Pages (Pinterest Landing Pages)

Inspiration pages live at `/inspiration/[slug]`. These are thin-content conversion pages built for click-through traffic from Pinterest. They are a single reusable template: headline, hero image, short copy (150–300 words), upsell tile.

**These pages do NOT need long-form content.** Focus on: a clear headline, a great image, and descriptive copy that contextualizes the visual.

| Slug | Headline | Primary Keyword | Hero Image File | Status |
|------|----------|-----------------|-----------------|--------|
| `stamped-concrete-patio-grey` | Grey Stamped Concrete Patio | grey stamped concrete patio | `inspiration-grey-stamped-patio.jpg` | **LIVE** |
| `herringbone-brick-patio` | Herringbone Brick Patio | herringbone patio | `inspiration-herringbone-patio.jpg` | **LIVE** |
| `pool-deck-travertine` | Travertine Pool Deck | travertine pool deck | `inspiration-travertine-pool-deck.jpg` | **LIVE** |
| `modern-driveway-concrete` | Modern Concrete Driveway | modern concrete driveway | `inspiration-modern-driveway.jpg` | **LIVE** |
| `cobblestone-driveway-border` | Cobblestone Border Driveway | cobblestone driveway border | `inspiration-cobblestone-border-driveway.jpg` | **LIVE** |
| `pool-deck-broom-finish` | Broom Finish Pool Deck | broom finish pool deck | `inspiration-broom-finish-pool.jpg` | **LIVE** |
| `stamped-concrete-walkway-grey` | Grey Stamped Concrete Walkway | stamped concrete walkway | `inspiration-grey-stamped-walkway.jpg` | **LIVE** |
| `patio-wood-plank-concrete` | Wood Plank Concrete Patio | wood plank concrete patio | `inspiration-wood-plank-patio.jpg` | **LIVE** |
| `exposed-aggregate-patio-white` | White Exposed Aggregate Patio | exposed aggregate patio | `inspiration-white-aggregate-patio.jpg` | **LIVE** |
| `circle-patio-pattern` | Circle Pattern Stamped Patio | circle pattern patio | `inspiration-circle-pattern-patio.jpg` | **LIVE** |

**To add a new inspiration page:**
Add an entry to `src/content/inspiration/index.ts` and its OG image to `public/og/`. That's it — the template and route are already wired.

---

## Content Rules

### Blog Articles
- **Word count:** 800–1,200 words (intro + 4–6 sections)
- **Structure:** `intro` (2–3 sentences) + `sections[]` (each: `heading`, `body`, optional `image`)
- **Upsell tiles:** injected automatically — one mid-article, one at bottom. No action needed.
- **Links:** add `relatedSlugs` to cross-link within the same pillar
- **Tone:** practical, direct, homeowner-focused. No filler. Lead with the useful fact.
- **No AI fluff:** avoid "in conclusion", "it's worth noting", "at the end of the day"

### Inspiration Pages
- **Word count:** 150–300 words for `contentBlock`
- **Tone:** descriptive and visual — help the reader imagine the space. One or two practical sentences about why the look works or what it costs.
- **CTA copy:** direct — "upload a photo of your [space] and see what [this look] could look like"

---

## Image Specs

All OG/hero images go in `public/og/`.

| Spec | Value |
|------|-------|
| Format | JPEG |
| Dimensions | 1200 × 630 px minimum |
| File size | < 300 KB |
| Naming | kebab-case matching the `ogImage` field in the data file |

---

## Keyword Strategy

- **Target:** long-tail homeowner intent queries — "ideas", "cost", "how to", "best", "vs"
- **Avoid:** head terms ("concrete patio", "driveway design") — too competitive for a new domain
- **Cluster:** each article should link to 1–2 related articles in the same pillar via `relatedSlugs`
- **Inspiration pages:** target visual/descriptive terms that someone might pin — adjective + material + surface type (e.g., "grey stamped concrete patio", "herringbone brick pattern patio")
