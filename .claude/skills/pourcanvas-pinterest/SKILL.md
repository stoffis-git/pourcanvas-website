---
name: pourcanvas-pinterest
description: PourCanvas Pinterest content + pin pipeline - unified closed-loop agent. Audits articles, inspiration pages, and master-pin-tracker.csv. Selects sprint mode. Creates content, adds image rows, generates text-pin copy. Updates state. Supersedes pourcanvas-seo.
tools: Read, Glob, Grep, Write, Edit, Bash
---

# PourCanvas Pinterest Agent

You are a self-directed content and Pinterest pipeline agent for PourCanvas (pourcanvas.com), an AI-powered outdoor space visualizer.

**Primary channel: Pinterest.** Every image on the site is a potential pin entry point. The funnel is: Pinterest pin → /inspiration/:slug → browse more visuals → CTA. Blog articles are secondary (Google long-tail). In every EXPANSION sprint, inspiration pages and image rows take priority over articles.

---

## Invocation Gate

**On load, do not execute automatically.** Instead:
1. Read `state.md` (for sprint history and last-run context). Then read `image-gen/master-pin-tracker.csv` and compute live counts directly from the CSV — do not use stored numbers from state.md for the status line. Compute: total rows, `image_generated=completed` count, `image_generated=pending` count, `image_generated=error` count, `pinned=live` count, `pinned=pending` count.
2. Print one-line status using CSV-derived counts: `"State loaded. Last run: [date from state.md] ([sprint mode]). CSV: [N] total rows, [N] completed images, [N] pending, [N] errors, [N] pins live, [N] ready to pin."`
3. Stop and wait for the user to explicitly say **"run"** (or "execute", "go").

Only begin the full 6-phase loop after receiving that explicit run instruction.

If the user invoked with explicit run intent (e.g., "run", "execute", "go"), skip the gate.

---

## Running the Loop

When the user triggers a run, **do not execute inline**. Use the Agent tool to launch a general-purpose subagent:

> You are running the PourCanvas Pinterest pipeline for pourcanvas.com. Working directory: /Users/stoffi/Documents/pourcanvas
>
> Execute all 6 phases (Orient → Assess → Sprint Plan → Execute → Update State → Report) as defined in the skill at `.claude/skills/pourcanvas-pinterest/SKILL.md`. Read that file first. Work autonomously. Write all changes to disk. Print phase-by-phase progress as you go.

Set `run_in_background: false` so output streams back to the user.

After launching, say: "Pinterest pipeline running - output below."

**Persistent files:**
- `.claude/skills/pourcanvas-pinterest/state.md` - single source of truth for run state
- `image-gen/master-pin-tracker.csv` - every image, pin, and variation tracked here

**Site content locations:**
- Blog articles: `src/content/articles/patio.ts`, `driveway.ts`, `walkway.ts`
- Inspiration pages: `src/content/inspiration/index.ts`
- Content types: `src/content/types.ts`

---

## PHASE 1: ORIENT

1. Read `.claude/skills/pourcanvas-pinterest/state.md`. If missing, initialize empty state.

2. Read `image-gen/master-pin-tracker.csv`. Compute:
   - `IMG_PENDING`: rows where `image_generated = pending` and `page_type != text-pin`
   - `IMG_ERROR`: rows where `image_generated = error`
   - `PIN_PENDING`: rows where `pinned = pending` and `image_generated = completed` and `page_created = yes`
   - `PIN_LIVE_NEW`: rows where `pinned = live` and `pin_date = today or yesterday` - freshly confirmed pins
   - `VAR_MAX`: for each slug, the maximum `variation_num` present
   - `PAGES_WITHOUT_VAR2`: count of inspiration page slugs where `VAR_MAX = 1`

3. Read each of the three article TS files and the inspiration index. Diff slugs against state.md:
   - Slugs in files but not in state → "newly discovered"
   - Slugs in state but missing from files → flag as "removed externally?"

4. Compute sprint-mode inputs:
   - **D2+**: count of articles with debt score ≥ 2
   - **InspDebt**: count of inspiration pages with debt score ≥ 1
   - **INSP_COUNT**: total inspiration pages in content file
   - **NEW_CONTEXT_VARIANTS**: count of context-variant rows in CSV where `page_created = no`

5. Print one-line status:
   `"State loaded. [N] articles, [N] inspiration pages. CSV: [N] total rows, [IMG_PENDING] images pending, [IMG_ERROR] errors, [PIN_PENDING] ready to pin, [PIN_LIVE_NEW] newly live. Pages without variation: [PAGES_WITHOUT_VAR2]. Last run: [date]."`

---

## PHASE 1.5: RECONCILE

Run after every ORIENT. Never skip.

1. Glob `image-gen/generated_images/*.jpg` → list of filenames on disk.

2. For each file found, locate the matching CSV row by `image_filename` basename:
   a. Row has `image_generated = pending` and file exists on disk
      → image was saved locally but R2 upload failed on a prior run.
      → Flag it in the reconcile summary as "upload retry needed".
      → Do NOT attempt to re-upload here. The Phase 4 script run (`generate_og_images.py --full`) will pick it up automatically (the script reuses files already on disk and retries the R2 upload).
   b. Row has `image_generated = completed`, `variation_num = 1`
      → Verify `ogImage` in `src/content/inspiration/index.ts` points to the CDN URL.
      → If it still shows a `/og/` path, update it to the r2_url.
   c. Row has `image_generated = completed`, `variation_num >= 2`
      → Check if r2_url appears in `additionalImages[]` for that slug in `src/content/inspiration/index.ts`.
      → If not: add `{ url: "[r2_url]", alt: "[page_headline] - variation [variation_num]" }` to the matching entry's additionalImages array.

3. If any content file was modified in step 2:
   - Run `git -C /Users/stoffi/Documents/pourcanvas add -A`
   - Run `git -C /Users/stoffi/Documents/pourcanvas commit -m "wire variation images into carousel [auto]"`
   - Run `git -C /Users/stoffi/Documents/pourcanvas push origin main`
   - Vercel deploys automatically on push. Print: `"Deployed: [N] images wired, pushed to main."`

   After that push, extract dominant colors for the newly wired slugs:
   - Run `python image-gen/extract_dominant_colors.py` from `/Users/stoffi/Documents/pourcanvas`
   - The script skips slugs that already have `dominantColor` set — only processes new ones
   - If any `dominantColor` values were added (script output shows `✓` lines):
     - Run `git -C /Users/stoffi/Documents/pourcanvas add src/content/inspiration/index.ts`
     - Run `git -C /Users/stoffi/Documents/pourcanvas commit -m "content: dominant colors for newly published inspiration images [auto]"`
     - Run `git -C /Users/stoffi/Documents/pourcanvas push origin main`
   - Print: `"Dominant colors: [N] added, [N] already set, [N] skipped (external URL)."`

4. Print reconcile summary:
   `"RECONCILE: [N] files on disk | [N] newly wired | [N] pending upload retries (will fix in Phase 4) | [N] already current"`

---

## PHASE 2: ASSESS

### Blog Article Debt (1 point per failure, max 8)

- **Title length**: `title` field > 60 characters
- **Meta quality**: `metaDescription` > 155 chars OR < 120 chars OR does not contain the first `targetKeywords` entry
- **Thin content**: `sections.length` < 4
- **Thin total length**: total word count across `intro` + all `section.body` < 900 words
- **Weak intro**: `intro` word count < 40 words
- **No cost data**: no `section.body` contains `$`, `/sq ft`, `per square foot`, or `budget`
- **Missing cross-links**: `relatedSlugs` undefined, empty, or fewer than 2 entries
- **Pillar isolation**: article makes zero reference to the other two pillar surfaces

### Blog Article GEO Score (0–4, one point each)

- **Direct answer intro**: `intro` is a self-contained citable answer to the article's primary question
- **Fact density**: at least one specific dollar figure or measurement in the first two sections
- **Comparison angle**: article includes "vs", a structured option comparison, or explicit contrast
- **FAQ potential**: at least 3 distinct questions are naturally present in the content

### Inspiration Page Debt (1 point per failure, max 4)

- **Thin content**: `contentBlock` word count < 150
- **Meta too long**: `metaDescription` > 155 characters
- **Generic CTA**: `ctaBody` does not name the specific surface/material/pattern
- **Missing pillar**: `pillar` field undefined or missing

### CSV Health Audit

After scoring content:
- Flag any inspiration page slug in the content file that has NO row in master-pin-tracker.csv
- Flag any `image_generated = error` row for investigation
- Check: are there any slugs in CSV with `page_created = no` that match content already written? If yes, mark `page_created = yes`.

**Output at end of Phase 2:**
```
ASSESS complete.
Article debt (D2+): [list slugs or "none"]
Article debt (D1): [list slugs or "none"]
GEO gaps (< 2): [list slugs]
Inspiration debt: [list slugs or "none"]
Insp page density: patio [N]/[N art] | driveway [N]/[N art] | walkway [N]/[N art]
CSV: [N] rows missing for existing pages | [N] errors
Pages without variation (v1 only): [N]
```

---

## PHASE 3: SELECT SPRINT MODE AND PLAN BATCH

Using Phase 1 and Phase 2 findings, select the first matching mode:

| Condition | Mode | Batch |
|-----------|------|-------|
| IMG_ERROR > 2 OR D2+ > 3 OR InspDebt > 3 | **CONTENT_DEBT** | Fix all D2+ articles + all insp pages with debt ≥ 1. No new content. |
| D2+ = 0, D1+ > 2 | **CONTENT_DEBT** | Lighter debt pass: up to 3 article refinements + 1 new insp page. |
| INSP_COUNT < 80 AND D2+ ≤ 1 | **NEW_INSPIRATION** | 4–6 new inspiration pages + image rows. Pillar with weakest density goes first. |
| PAGES_WITHOUT_VAR2 > 10 AND INSP_COUNT ≥ 40 | **PIN_EXPANSION** | Add variation rows (v2, v3) to 8–12 existing inspiration pages. No new pages. |
| NEW_CONTEXT_VARIANTS < 15 AND INSP_COUNT ≥ 60 | **HORIZONTAL** | 4–6 context-variant inspiration pages (no new component needed). |
| Default | **PIN_COPY** | Generate text-overlay pin copy for 3–5 blog articles. No content changes. |

**Sprint modes BLOCKED until page components exist:**
- `before-after` type → requires `/before-after/:slug` route + page component
- `palette` type → requires `/palette/:slug` route + page component
- If these are built, HORIZONTAL mode can include them.

Print sprint mode before listing items:
```
SPRINT MODE: [mode] - [one-line rationale]
D2+: [N] | InspDebt: [N] | IMG_PENDING: [N] | PAGES_WITHOUT_VAR2: [N]
```

### Concept Validation (NEW_INSPIRATION and HORIZONTAL only)

For each new inspiration page concept, score on 4 markers (0–25 each):

1. **Keyword fit (0–25):** Does the slug match a real Pinterest visual search term? Specific color + material + surface = 22+. Generic ("nice patio") = ≤10.
2. **Pillar fit (0–25):** Cleanly slots into one pillar without duplicating an existing slug?
3. **Visual Victoria match (0–25):** Would a homeowner in inspiration mode save this pin? Specific finish + setting + mood = 20+.
4. **Conversion hook (0–25):** Does the visual naturally invite "see this on my own [surface]"?

Minimum score: 65/100. Re-concept or sharpen anything below that.

Print validated batch with scores before executing.

---

## PHASE 4: EXECUTE

Work through the batch sequentially. Write all changes to disk after each item.

---

### [CONTENT_DEBT] Article Refinements

Read the TS file. Apply fixes. Write back. Print diff summary.

**Always apply:**
- Trim `title` to ≤ 60 chars
- Trim `metaDescription` to ≤ 155 chars, include primary keyword + one practical hook
- Rewrite `intro` as 40–60 word direct answer to the article's implied primary question - no preamble
- Add `relatedSlugs` with 2 in-pillar slugs if missing or < 2
- Add cost data: if no section contains a dollar figure, add a realistic 2025 range to the most relevant section
- Expand any section body < 120 words with a practical detail, contractor tip, or regional note
- **Total length pass:** after fixes, if total < 900 words, expand thinnest sections until 900–1,200. Every added sentence must contain a useful fact, cost figure, or practical detail.
- Update `publishedAt` to today's date

**Apply if GEO score < 3:**
- Rewrite intro for direct-answer quality
- Add comparison angle to most suitable section (two options, two price points, two approaches)
- Add `// GEO: FAQ candidates: [3 questions]` comment at entry end

**Diff output:**
```
REFINED: [slug]
  title: "[old]" → "[new]"
  meta: "[old]" → "[new]"
  intro: rewritten ([N] words)
  relatedSlugs: [old] → [new]
  cost data: [section or "already present"]
  GEO: [fixes or "none"]
```

---

### [CONTENT_DEBT] Inspiration Page Refinements

Read `inspiration/index.ts`. Apply fixes. Write back.

- Trim `metaDescription` to ≤ 155 chars
- Expand `contentBlock` to ≥ 150 words: what makes this look work visually, one practical note (durability, cost range, home style pairing), close with PourCanvas CTA hook
- Rewrite `ctaBody` to name the specific surface/material/pattern
- Add `pillar` field if missing

**Diff output:**
```
REFINED (insp): [slug]
  meta: "[old]" → "[new]"
  contentBlock: [N] → [N] words
  ctaBody: updated
  pillar: [added/present]
```

---

### [NEW_INSPIRATION] New Inspiration Pages

Add new `InspirationPage` object to `inspiration/index.ts`. Insert at end of array.

**Required structure:**
```typescript
{
  slug: "[adjective-material-surface]",  // visual search keyword, kebab-case
  title: "[Descriptive Headline | PourCanvas]",
  headline: "[Short visual headline - 3–6 words]",
  metaDescription: "[visual keyword + practical hook - ≤ 155 chars]",
  ogImage: "/og/inspiration-[slug].jpg",
  heroAlt: "[descriptive alt text]",
  contentBlock: "[Pinterest hook sentence - 15–25 words, standalone pin caption. Then 130–200 words: what makes this look work visually, one practical note (cost range, durability, home style), PourCanvas CTA close.]",
  targetKeywords: ["[primary visual keyword]", "[secondary]", "[tertiary]"],
  pillar: "[patio|driveway|walkway]",
  ctaHeadline: "[Short specific CTA headline]",
  ctaBody: "Upload a photo of your [surface] and see what [specific look] could look like in your space.",
},
```

**After writing the page, add CSV row** to `image-gen/master-pin-tracker.csv`:
- `slug`: the new slug
- `page_type`: `inspiration`
- `variation_num`: `1`
- `image_generated`: `pending`
- `r2_url`: (empty)
- `page_created`: `yes`
- `pinned`: `pending`
- `pin_type`: `plain_image`
- `pin_title`: ≤100 chars, keyword-first - format: `"[Visual keyword] - [secondary detail or home style]"`
- `pin_description`: 150–300 chars - follow **Pin Description Rules**. Lead with the specific finish + surface type. Include a vertical keyword. Describe what the image shows. Vary the close.
- `pin_url`: `https://pourcanvas.com/inspiration/[slug]`
- `board`: match pillar - `Patio Ideas` / `Driveway Ideas` / `Walkway Ideas`
- `ai_prompt`: build from formula - include all required fields for the pillar:
  - **Driveway**: `"photorealistic [specific finish] driveway, [home style] home, [lighting], [season if distinctive], [vehicle: one of: Toyota Corolla compact sedan / Honda Accord sedan / Honda CR-V crossover / Toyota RAV4 SUV / Ford F-150 pickup truck] parked in driveway, [garage door: one of: traditional raised-panel / contemporary flush panel / carriage house wood-look / glass-panel modern] garage door"`
  - **Patio**: `"photorealistic [specific finish] patio, [home style] home, [lighting], [season if distinctive], [furniture: one of: bistro table with two chairs / full outdoor dining set / lounge chairs with side table and folded throw / sectional with ottoman] on patio"`
  - **Walkway**: `"photorealistic [specific finish] walkway, [home/entry context], [lighting], [season if distinctive]"` (walkway props handled by suffix)
  - Pick vehicle/door/furniture to match the home style. No two rows for the same slug should share the same combination.

**Output:**
```
PUBLISHED (insp): [slug]
  headline: [headline]
  pillar: [pillar]
  contentBlock: [N] words
  CSV row added: [image_filename] - prompt: "[ai_prompt first 60 chars]..."
```

---

### [PIN_EXPANSION] Add Variation Rows

Do NOT modify any content files at this stage. Only update `image-gen/master-pin-tracker.csv`.

For each target inspiration page slug (prioritize pages with most Pinterest potential - descriptive, specific visual concepts):
1. Determine current max `variation_num` for that slug in the CSV
2. Add 2–3 new rows with incremented `variation_num` values
3. Each variation must have a visually distinct `ai_prompt` - vary: lighting condition, house style backdrop, season, setting (pool context vs garden edge vs open yard)
4. Image filename: `inspiration-[slug]-v[N].jpg`
5. `page_created`: `yes` (same page, just more images)
6. `image_generated`: `pending`
7. `pin_title`: ≤100 chars, keyword-first - reference the variation's specific setting or lighting in the subtitle (e.g. `"Grey Stamped Patio - Craftsman Home With Fall Foliage"`)
8. `pin_description`: 150–300 chars - follow **Pin Description Rules**. Describe what makes this variation visually distinct (the specific lighting, season, home style). Include a vertical keyword. Vary the close from v1.
9. `pin_url`: for v2+, append `?image=[variation_num]` to the base slug URL — e.g. `https://pourcanvas.com/inspiration/[slug]?image=2` for variation_num=2. v1 rows use the base URL with no param.
10. `board`: same as base slug's board

**After image generation completes** (r2_url populated, image_generated = completed), wire the image into the page by adding it to the `additionalImages` array in `src/content/inspiration/index.ts`:

```typescript
// In the matching InspirationPage entry:
additionalImages: [
  { url: "https://[r2_url]", alt: "[descriptive alt for this variation]" },
],
```

The `InspirationImageCarousel` component renders automatically as a single image when only `ogImage` is present, and switches to carousel-with-thumbnails as soon as `additionalImages` has 1+ entries (2+ total images). No other page changes needed.

**Output per slug:**
```
VARIATION ROWS ADDED: [slug]
  v[N]: [image_filename] - [prompt summary]
  v[N]: [image_filename] - [prompt summary]
NOTE: Run generate_og_images.py --full to generate. Then add r2_urls to additionalImages[] in inspiration/index.ts.
```

---

### [HORIZONTAL] Context-Variant Pages

Context-variants use the **existing `InspirationPage` template** - no new component needed. They are new slugs targeting the same material in a different situational context (house style, setting, season).

**Slug formula:** `[material]-[surface]-[house-style]` or `[material]-[surface]-[setting]`
Examples: `herringbone-brick-patio-craftsman`, `grey-stamped-patio-farmhouse`, `exposed-aggregate-driveway-coastal`

**Content rules:**
- `contentBlock` (100–180 words): focus on why this material suits this specific architectural or contextual setting
- `relatedSlugs`: include the base inspiration page slug + 1–2 other context variants

**After writing, add CSV row** same as NEW_INSPIRATION (including `pin_title`, `pin_description`, `pin_url`, `board`) - mark `page_created: yes`. For context-variant pages the `pin_description` should explicitly name both the surface finish and the architectural/contextual pairing in sentence 1.

**If before-after or palette components are built:**
- before-after: add rows in CSV with `page_type = before-after` and `page_created = yes`
- palette: add rows in CSV with `page_type = palette` and `page_created = yes`
- Write content entries to their respective content files (add content type definitions if not in `types.ts`)

---

### [PIN_COPY] Text-Overlay Pin Generation

Generate text-overlay pin copy sets for target blog articles. **No content file changes.** Only updates `master-pin-tracker.csv`.

For each target article, generate 4 pin copy entries (one per pin type):

| Pin type | Formula | Constraints |
|----------|---------|-------------|
| PAIN_POINT | Specific dollar + regret framing | Practical, not ragebait |
| DATA_HOOK | Real number (cost/sq ft/year) + implication | Must have specific number |
| HOW_TO | "N Things to [Action] Before [Event]" | N must be 3–5 |
| LIST | "N [Material/Surface] [Qualifier]" | Specific qualifier, not "Best" or "Top" |

**Each entry requires:**
- `text_overlay`: 5–10 words, title case, no punctuation - this is literally what appears on the pin image. Specific numbers are encouraged here (e.g. "$8–18/sq ft", "5 finishes", "3 questions").
- `pin_title`: ≤100 chars, keyword-first, includes primary keyword
- `pin_description`: 150–300 chars - follow **Pin Description Rules**. For text-pin type: lead with what the article covers, include a vertical keyword, no price ranges in the description itself (numbers belong in `text_overlay`). Vary the close.

**Self-check before adding to CSV:**
- [ ] `text_overlay` is 5–10 words
- [ ] At least one `text_overlay` entry across the 4 contains a specific dollar amount or percentage
- [ ] No entry uses "Most people don't know", "You won't believe", or urgency manipulation
- [ ] No entry is a duplicate of an existing row for the same slug
- [ ] Each `pin_description` follows Pin Description Rules (vertical keyword present, no price range, surface/topic named in sentence 1)

**Add to CSV:**
- `page_type`: `text-pin`
- `page_created`: `yes`
- `image_generated`: `n/a`
- `pin_type`: `text_overlay`
- `text_overlay`: the 5–10 word hook
- `pin_title`: the pin title
- `pin_description`: the pin description (follows Pin Description Rules)
- `pin_url`: full pourcanvas.com URL for the target article
- `board`: `Contractor Tips for Homeowners` (default for text-pins) or the relevant pillar board

**Output per article:**
```
PIN COPY: [slug]
  PAIN_POINT: "[text_overlay]"
  DATA_HOOK:  "[text_overlay]"
  HOW_TO:     "[text_overlay]"
  LIST:       "[text_overlay]"
  CSV rows added: 4
```

---

### Run Image Generation

After all content files and CSV rows have been written this sprint:

If `IMG_PENDING > 0`:
1. Before running, count `image_generated=completed` rows in the CSV. Record as `PRE_GEN_COMPLETED`.
2. Run: `python image-gen/generate_og_images.py --full --max 21`
   (Script generates images, uploads to R2, updates CSV `image_generated` + `r2_url`, runs sync on completion.)
3. Wait for completion. Print script output inline.
4. **Verification (mandatory — do not skip):** Re-read `master-pin-tracker.csv` and count `image_generated=completed` rows. Record as `POST_GEN_COMPLETED`.
   - If `POST_GEN_COMPLETED == PRE_GEN_COMPLETED`: the script did not execute or produced zero results. State explicitly: "IMAGE GENERATION DID NOT RUN — completed count unchanged ([N]). Possible causes: Bash tool not executed, env vars missing, script error." Do NOT fabricate script output. Do NOT proceed to Phase 5 until resolved or deliberately skipped.
   - If `POST_GEN_COMPLETED > PRE_GEN_COMPLETED`: print `"IMAGE GENERATION: [POST - PRE] new images completed ([PRE] → [POST])."` and continue.
5. If new images were generated, re-run PHASE 1.5 RECONCILE immediately to wire any new variation images and deploy.

If `IMG_PENDING = 0`: skip this step and note "No images pending - skipping generation."

---

## PHASE 5: UPDATE STATE

### Rewrite state.md

Write `.claude/skills/pourcanvas-pinterest/state.md` with:

```markdown
# PourCanvas Pinterest State
Last run: [YYYY-MM-DD]
Sprint mode: [mode]

## Content
Articles: patio [N] | driveway [N] | walkway [N] | total [N]
Inspiration pages: patio [N] | driveway [N] | walkway [N] | total [N]
Context variants: [N]
Before/after pages: [N] (component built: yes/no)
Palette pages: [N] (component built: yes/no)

## CSV Status
Total rows: [N]
Image generated (completed): [N]
Image pending: [N]
Image error: [N]
Pinned live: [N]
Pin pending: [N]
Text-pin rows: [N]

## Debt Backlog
D2+ articles: [list slugs or "none"]
D1 articles: [list slugs or "none"]
Inspiration debt: [list slugs or "none"]

## Article Scores (updated this run)
[slug] | debt [N]/8 | GEO [N]/4 | refined [date]
...

## Inspiration Page Scores (updated this run)
[slug] | debt [N]/4 | variation_count [N] | last touched [date]
...

## Roadmap
[list of planned items: slug | type | pillar | status]

## Next Run
Predicted sprint: [mode]
Reason: [one sentence]
Priority: [top 3 items]
```

### CSV Housekeeping

After updating state.md, scan `master-pin-tracker.csv` for any stale rows:
- Any slug that was removed from content files → add comment `# removed` in a notes column (do not delete rows)
- Any row where `r2_url` now has a real CDN URL but `image_generated` still says `pending` → update to `completed`

Do not rewrite the entire CSV unless absolutely necessary. Use targeted row updates (read CSV, update matching rows, write back).

---

## PHASE 6: REPORT

**IMPORTANT — read the CSV again right now before writing the report.** Do not use counts from Phase 1 or from memory. Re-compute: completed, errors, pending, pins_live, ready_to_pin. The sprint may have generated images between Phase 1 and Phase 6; the Phase 1 numbers are stale by the time you report. Include "Images generated this run: [post - pre]" derived from the delta.

```
## Run Summary - [date]

Sprint: [mode] | Batch size: [N]

### Content Written
New inspiration pages: [N] ([list slugs])
New context-variant pages: [N] ([list slugs])
Refined articles: [N] ([list slugs])
Refined inspiration pages: [N] ([list slugs])

### CSV Updates
New image rows added: [N] (inspiration [N] | variation [N] | horizontal [N])
Images generated this run: [post-run completed] - [pre-run completed] = [delta]
New text-pin rows: [N]
Rows ready to pin (image_generated=completed, pinned=pending): [N]

### Pin Queue - post these 4 today

Read `image-gen/master-pin-tracker.csv` now. Filter rows where `pinned = pending` AND `image_generated = completed` AND `page_created = yes`. From that filtered list, select 4 rows prioritising pillar diversity: pick 1 patio row, 1 driveway row, 1 walkway row, then 1 any. If a pillar has no eligible rows, fill with the next available.

Output the 4 rows as a literal copy-paste block with real values from the CSV - no placeholders:

```
### Pin Queue - post these 4 today

1. Board: [actual board value from CSV]
   Title: [actual pin_title from CSV]
   Description: [actual pin_description from CSV]
   URL: [actual pin_url from CSV]
   Image: image-gen/generated_images/[actual image_filename from CSV]

2. …

3. …

4. …

After posting, update master-pin-tracker.csv for each row above:
  pinned → live
  pin_date → [today's date YYYY-MM-DD]
```

If fewer than 4 rows are ready, output all available and note: "Only [N] rows ready - [N] more needed before next queue is full."

### Batch Scores
[slug/concept] - [N]/100 - tension: [one sentence]
...

### Image Generation Queue
Images to generate this sprint: [N]
Run: python image-gen/generate_og_images.py --full
New rows (work first):
  - [image_filename] - [ai_prompt first 50 chars]...

### Pillar Coverage
Patio:    [N] articles | [N] insp pages | [N] variations | [N] context-variants
Driveway: [N] articles | [N] insp pages | [N] variations | [N] context-variants
Walkway:  [N] articles | [N] insp pages | [N] variations | [N] context-variants
Weakest: [pillar] - [gap]

### Next Run
Predicted mode: [mode] - [reason]
Priority items: [top 3 with rationale]

### Blocked Items
[list any items blocked on unbuilt page components - before-after, palette]
```

---

## Personas

**Visual Victoria (primary - Pinterest)**
35–50, homeowner, inspiration mode. Pinning for a project 6–18 months out or to show a contractor.
- Triggered by: visually specific images (color + material + context), "see it in your space" framing
- Repelled by: generic, clinical, text-heavy above the fold
- Entry: /inspiration/:slug via Pinterest pin
- CTA response: low-friction visual payoff

**Planning Paul (secondary - Google)**
Researching concrete options, comparing costs, getting contractor quotes.
- Triggered by: cost tables, comparisons ("stamped vs pavers"), specific numbers
- Entry: blog articles via Google search
- CTA response: higher friction, needs to trust the site first

---

## Content Tone Rules

- Lead every section with the most useful fact, not a wind-up sentence
- Include at least one specific cost range or measurement per article
- No AI filler: avoid "it's worth noting", "dive into", "when it comes to", "in conclusion"
- Reference PourCanvas naturally in one section per article where contextually appropriate
- Text-pin copy: specific numbers always ("$8–18/sq ft", "3 questions", "5 finishes") - never vague ("many homeowners", "some materials")

---

## Keyword Reference

**Tier 1 (high volume, competitive - target with blog articles):**
stamped concrete patio, concrete driveway ideas, patio ideas, driveway makeover, concrete walkway ideas, pool deck ideas

**Tier 2 (medium volume, winnable - target with inspiration pages):**
grey stamped concrete patio, exposed aggregate driveway, flagstone patio, herringbone brick patio, modern concrete driveway, wood plank concrete patio, travertine pool deck, charcoal broom finish driveway, cobblestone driveway, terracotta stamped patio

**Tier 3 (long-tail, high intent - target with articles):**
grey stamped concrete patio ideas small backyard, exposed aggregate driveway charcoal, how much does a stamped concrete patio cost, stamped concrete vs pavers cost, concrete driveway cost per square foot

**Pinterest visual search terms (inspiration page targets):**
[color] + [material] + [surface]: grey stamped concrete patio, charcoal exposed aggregate driveway, buff stamped walkway, terracotta patio, cream concrete driveway, white aggregate patio, black concrete driveway, walnut stained driveway, blue grey walkway

**Context-variant search terms:**
[material] + [surface] + [house style]: herringbone patio craftsman home, stamped driveway colonial, modern driveway farmhouse, exposed aggregate driveway contemporary, flagstone walkway ranch

---

## Pin Description Rules

Apply these rules to every `pin_description` value written to the CSV - regardless of pin type, page type, or sprint mode.

### Rule 1 - Name the surface in sentence 1
The specific finish AND surface type must appear in the first sentence using the exact search term.
- **Not:** "Fine brushlines catch afternoon light across the pool surround…"
- **Yes:** "Broom-finish concrete pool deck creates fine directional lines across the surround…"
- Accepted surface terms: `stamped concrete [patio|driveway|walkway]`, `exposed aggregate [surface]`, `broom-finish concrete [surface]`, `acid-stained concrete [surface]`, `salt-finish concrete [surface]`, `flagstone stamped concrete [surface]`, `herringbone [material] stamped concrete [surface]`, etc.

### Rule 2 - Plant a vertical keyword
Every description must include exactly one of the following (once, naturally):
`home improvement` | `outdoor renovation` | `backyard upgrade` | `front yard project` | `outdoor living` | `backyard project` | `concrete project`

Works naturally in the close: *"Save this for your home improvement planning folder."*
Or in the body: *"A high-impact home improvement choice for any front yard."*

### Rule 3 - No price ranges
Never include `$/sq ft`, `$X–Y`, cost comparisons, or price claims in `pin_description`. Price data belongs in article body copy and `text_overlay` fields only.

### Rule 4 - Visual language for plain_image pins
For `pin_type = plain_image`: describe what the image shows - colour tone, texture quality, light, pattern geometry, architectural pairing. One sentence on the visual, one on context or pairing, one close.

For `pin_type = text_overlay`: describe what the article covers and what the reader will learn or decide. Keep it practical, not atmospheric.

### Rule 5 - Vary the close
Distribute across three close types - do not use the same pattern twice in a row for the same board:
- **Save prompt:** "Save this for your [project] planning."
- **Question:** "Could this work in your [space]?"
- **Statement:** A short declarative that closes the visual narrative.

### Rule 6 - Character limit
150–300 characters. Pinterest truncates feeds at ~300 chars. The surface type, visual hook, and vertical keyword must all land before that threshold.

### Rule 7 - No keyword inflation
Surface type appears once naturally. No comma-separated keyword lists. No "the most popular", "the best", "affordable" as a lead claim.

### Rule 8 - No em-dashes
Never use `—` in a pin description. Use a regular hyphen `-` instead.

---

## Image Prompt Formula

For all inspiration pages and variations:

**Base formula:**
```
photorealistic [specific finish] [surface type], [home/outdoor context], [lighting condition], [optional season detail], [vehicle + garage door for driveways | furniture for patios]
```

**The Python script appends a detailed suffix** covering:
- Wide establishing shot, hardscape in lower half, home in upper half
- Deep depth of field, no people, human eye-level (24–35mm equivalent)
- Material-specific texture details (relief variation, pebble density, brush marks, staining)
- Lived-in context (parked everyday car for driveways, outdoor furniture for patios, plants/bicycle for walkways)
- Portrait 3:4 aspect ratio, no text, no watermarks

**Vary across images of same slug:**
- Lighting: morning soft light / overcast / golden hour afternoon / dusk ambient
- Setting: attached to home entry / pool adjacent / open backyard / garden edge
- House style: contemporary / craftsman / colonial / ranch / farmhouse
- Season: summer green / fall foliage background / bare winter / spring bloom
- Vehicle (driveway only): compact sedan / mid-size sedan / SUV or crossover / pickup truck / minivan - match to home style (e.g. F-150 for farmhouse/ranch, CR-V for suburban, Camry for colonial, Odyssey for family home)
- Garage door (driveway only): traditional raised-panel / contemporary flush panel / carriage house wood-look / glass-panel modern - match to house style
- Patio furniture (patio only): bistro table for two / full dining set / lounge chairs with side table / sectional - match to patio scale and home style

**Do not use the same lighting + setting combination for two images of the same slug.**

---

## CSV Column Reference

| Column | Type | Values |
|--------|------|--------|
| slug | string | page URL slug |
| page_type | enum | inspiration / context-variant / before-after / palette / text-pin |
| pillar | enum | patio / driveway / walkway |
| page_headline | string | H1 text of the page |
| image_filename | string | filename only (no path) e.g. `inspiration-slug.jpg` |
| variation_num | int | 1 = original, 2–5 = additional variations |
| image_generated | enum | pending / completed / error / n/a |
| r2_url | string | full CDN URL once uploaded, empty if pending |
| page_created | enum | yes / no |
| pinned | enum | pending / live / scheduled |
| pin_date | date | YYYY-MM-DD when pinned, empty if pending |
| pin_type | enum | plain_image / text_overlay |
| text_overlay | string | overlay text (text-pin type only), empty for plain_image |
| ai_prompt | string | Imagen prompt (quoted if contains commas); "n/a" for text-pin |
| pin_title | string | ≤100 chars, keyword-first Pinterest title |
| pin_description | string | 150–300 chars - follow Pin Description Rules section below |
| pin_url | string | full pourcanvas.com URL the pin links to |
| board | string | Pinterest board name to pin to (e.g. "Patio Ideas", "Before & After") |
