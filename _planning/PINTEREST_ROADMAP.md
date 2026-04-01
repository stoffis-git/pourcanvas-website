# PourCanvas — Pinterest Growth Roadmap

**Baseline (2026-03-28):** 23 inspiration pages live. Pinterest account day 1 — warming mode (4 pins/day max). AI tool stub. No active monetization.

---

## Strategic Frame

Pinterest is the primary acquisition channel. Every image on the site is a potential pin entry point. The funnel is:

```
Pinterest feed → Pin click → /inspiration/:slug → Browse more images → CTA → [destination TBD]
```

The site is correctly structured for this model. What it lacks right now:
- **Conversion destination** (CTA leads to stub — no rush while warming, but needed at ~200/mo visitors)
- **Pinterest mechanics** (Save button, portrait images confirmed on mobile but need verification at pin-share level)
- **Text-pin layer** (multiplies surface area from existing blog content with no new pages)
- **Image density** (1 image per concept → 3–5 images per concept = 3–5× pin entry points same URL)
- **Horizontal page types** (before/after, context-variant, palette)

---

## Phase 0 — Page Experience Fixes
**When:** Before hitting 50+ daily visitors
**Effort:** Low (frontend only)

### 0.1 Reorder Inspiration Page Scroll
Current: `Hero → Text (150–300w) → Material zoom → CTA → Related tiles`
Target: `Hero → Related tiles (3–4 images) → CTA → Text → Material zoom → FAQ`

Pinterest visitors want more visuals immediately, not a paragraph. Serve visual depth first, capture intent after. The related tiles should be a direct visual continue-browsing hook before any text appears.

### 0.2 Swap CTA Copy on Inspiration Pages
`"Try It Free"` implies a tool they can't use yet. Options until product exists:
- **Option A (email):** "Get 30 free patio design ideas" → email capture → PDF or sequence
- **Option B (neutral):** Link CTA to pillar hub ("See all [pillar] ideas →") — zero commitment
- **Option C (affiliate):** "Get a free quote from a local contractor" → referral (no product needed)

Decision needed before traffic scales. Option A builds the most durable asset.

### 0.3 Add Pinterest Save Button
Add `data-pin-do="buttonPin"` to all inspiration page hero images. Users who want to re-pin while browsing the site currently need the browser extension — this is unnecessary friction.

---

## Phase 1 — Complete Current Inspiration Catalogue
**When:** Week 1–2
**Effort:** Run image gen pipeline

Finish the 40 queued images. All 63 planned inspiration pages should be live with real CDN images (no `/og/` placeholder paths).

- Add all 40 remaining slugs to `image-gen/master-pin-tracker.csv` with `image_generated=pending`
- Run `python image-gen/generate_og_images.py --full`
- Verify all pages render correctly
- Pin 4/day during warming period: prioritize visually distinct concepts, spread across all 3 pillars

**Pin prioritization during warming:**
- Day 1–7: 1 patio / 1 driveway / 1 walkway / 1 wildcard per day
- Avoid pinning 3+ images from same concept back-to-back
- Plain image pins only at this stage — no text overlay yet

---

## Phase 2 — Text-Overlay Pin Layer
**When:** Week 2–3 (account still warming, but can start scheduling)
**Effort:** Copy generation only — no new pages needed

Each blog article → 3–4 text-overlay pin variants. These drive a different audience segment (research/cost intent vs. visual inspiration) and feed the same blog pages that already exist.

**Pin types to generate (per article):**
| Type | Formula | Example |
|------|---------|---------|
| PAIN_POINT | Specific dollar + mistake | "Spent $14k on the wrong driveway. Here's the question I didn't ask." |
| DATA_HOOK | Real number + implication | "Stamped concrete costs $8–18/sq ft. Here's what moves the number." |
| HOW_TO | 3-word actionable title | "3 Things to Check Before Signing Any Concrete Contract" |
| LIST | N items + specific qualifier | "5 Concrete Finishes That Hold Up in Freeze-Thaw Climates" |

**Priority articles for first text-pin batch:**
1. `/blog/patio/stamped-concrete-ideas`
2. `/blog/driveway/concrete-driveway-cost`
3. `/blog/patio/concrete-patio-cost`
4. `/blog/walkway/front-walkway-ideas`
5. `/blog/patio/concrete-patio-vs-pavers`

5 articles × 4 pin types = 20 new pins from zero new pages.

**Tracking:** Add as `text-pin` rows in `master-pin-tracker.csv` with `pin_type=text_overlay`, `text_overlay=[the overlay text]`, `page_created=yes`.

---

## Phase 3 — Multi-Image Inspiration Pages
**When:** Week 3–5
**Effort:** Image generation (Imagen 4 pipeline) + CSV row additions

Scale each inspiration page from 1 image → 3–5 images. Every image = a separate pin. All point to the same `/inspiration/:slug` URL. SEO authority stays consolidated; Pinterest surface area multiplies.

**Variation dimensions:**
- Lighting: morning sun / overcast / golden hour / dusk
- Setting: attached to home / pool context / garden edge / open yard
- House style: modern / craftsman / colonial / ranch / farmhouse
- Season: summer green / fall foliage / bare winter trees / spring bloom

**Priority:** Start with top 20 inspiration pages by pillar diversity.
Top 20 × 3 additional images = 60 new images → 60 new pins, zero new pages.

**CSV tracking:** `variation_num` column — `1` = original image, `2/3/4/5` = additional variations.
Image filenames: `inspiration-[slug]-v2.jpg`, `inspiration-[slug]-v3.jpg`, etc.

**Image gen:** Add variation rows to `master-pin-tracker.csv`, run pipeline. The script processes all rows where `image_generated != completed`.

---

## Phase 4 — Horizontal Page Type Expansion
**When:** Week 4–8
**Effort:** Medium (new route + page component per type, then content scales)

Four new page-per-pin formats to build alongside existing inspiration pages. Each opens a new visual keyword cluster on Pinterest.

### 4.1 Context-Variant Pages
**Route:** New slugs under `/inspiration/` (no new page component needed — uses existing `InspirationPage`)
**Pattern:** Same material, different situational context → new slug, new page, new keyword
**Examples:**
- `/inspiration/grey-stamped-concrete-patio-craftsman`
- `/inspiration/herringbone-brick-patio-colonial`
- `/inspiration/modern-driveway-concrete-farmhouse`

Captures more specific Pinterest search queries without building a new component. Just new content entries + new images.

**Target:** 30–50 context variants across top materials (2–3 contexts per material)

### 4.2 Before/After Pages
**Route:** `/before-after/:slug` (requires new page component + route + content type)
**Pattern:** Plain slab / cracked surface → transformed finish. Two images per page.
**Why:** Highest save-rate format on Pinterest. Emotional before/after is the strongest hook for homeowners planning a renovation.

**Examples:**
- `/before-after/concrete-slab-to-stamped-grey-patio`
- `/before-after/plain-driveway-to-exposed-aggregate`
- `/before-after/cracked-walkway-to-flagstone`

**Build requirement:** New `BeforeAfterPage` component + `/before-after/:slug` route + content type definition.
**Blocked in master-pin-tracker.csv** until page component exists.
**Target:** 20–30 before/after pages once component is built.

### 4.3 Color/Palette Pages
**Route:** `/palette/:slug` (requires new page component + route + content type)
**Pattern:** Organized by color family + surface. Captures color-intent searches ("warm grey patio", "charcoal driveway").

**Examples:**
- `/palette/warm-grey-patio`
- `/palette/charcoal-driveway`
- `/palette/buff-cream-walkway`
- `/palette/terracotta-outdoor`

**Build requirement:** New `PalettePage` component + `/palette/:slug` route.
**Blocked in master-pin-tracker.csv** until page component exists.
**Target:** 20–30 palette pages.

### 4.4 Text-Pin Landing Pages (no new component)
Existing blog articles already serve this function. Text-overlay pins link directly to `/blog/:pillar/:slug`.
No new pages needed — see Phase 2 for execution.

---

## Phase 5 — Monetization Integration
**When:** When reaching ~200 monthly Pinterest visitors
**Effort:** Depends on option chosen

| Option | Build time | Revenue potential | Immediate |
|--------|-----------|------------------|-----------|
| Email capture → PDF | 2–4 hours | Low direct, high list value | Yes |
| Info product (Gumroad PDF) | 4–8 hours | $5–15/sale | Yes |
| Quote evaluation tool | 1–3 days | $5–20/use | Near-term |
| AI visualization (original) | Unknown | High ceiling | Blocked on quality |

**Minimum viable:** Email capture ("Get 30 free [patio/driveway/walkway] design ideas — sent to your inbox") on inspiration pages. Replace `PillarConversionBlock` CTA destination with an email form. ESP: Mailchimp or ConvertKit free tier.

**Recommended:** Info product. "Patio Design Inspiration Pack — 60 photos + contractor checklist" → Gumroad at $9. One weekend to produce. Directly monetizes the warm Pinterest visitor without needing a live AI tool.

---

## Phase 6 — Account Authority and Scale
**When:** Month 2–6
**Effort:** Ongoing content velocity

Pinterest rewards fresh content velocity and account diversity. The account needs:
- Consistent daily pinning (maintain after warming period — 10–25 pins/day)
- Content type diversity (plain image + text overlay + before/after once built)
- Board organization (separate boards per pillar: Patio Ideas / Driveway Ideas / Walkway Ideas)
- Rich Pins enabled (adds structured data from OG tags directly to pins)

**Scale targets:**
| Month | Pages | Images | Pins live | Types |
|-------|-------|--------|-----------|-------|
| 1 | 63 | 63 | 63 | plain image |
| 2 | 70 | 120+ | 140+ | plain image + text overlay |
| 3 | 120 | 200+ | 250+ | + context-variants |
| 6 | 300+ | 500+ | 700+ | all types |

**Scale levers (priority order):**
1. More inspiration page concepts (expand clusters, add seasonal, regional)
2. More images per page (variation_num 2–5)
3. Text-overlay pins from blog content
4. Context-variant pages (no new component needed)
5. Before/after page type (after component is built)
6. Palette page type (after component is built)

**Do not:** Create 150 pins all pointing to one URL. Pinterest accounts that spam one destination get suppressed. Diversify across many concepts with 2–4 pins each.

---

## Toolchain

| Task | Tool |
|------|------|
| Content creation (articles + inspiration pages) | `/pourcanvas-pinterest` skill |
| Pin copy generation (text-overlay) | `/pourcanvas-pinterest` skill (PIN_COPY sprint) |
| Image tracking | `image-gen/master-pin-tracker.csv` |
| Image generation | `python image-gen/generate_og_images.py --full` |
| Pin scheduling | Manual (warming) → Pinterest scheduler TBD |
| State tracking | `.claude/skills/pourcanvas-pinterest/state.md` |

**Note:** `generate_og_images.py` currently reads from `.claude/skills/pourcanvas-seo/pinterest-images.csv`. Update `CSV_PATH` constant in the script to point to `image-gen/master-pin-tracker.csv` (one-line change).
