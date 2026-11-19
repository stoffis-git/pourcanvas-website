# Image improvement plan for pages with Google Images impressions (2026-11-19)

Phase A covers the definition, the page audit, the generation list and the pipeline changes. Phase B covers generating, QC, wiring and deploying.
Data: `_data/gsc/2026-11-19/api/image_page_last28.csv`, `image_query_page_last28.csv`, `image_query_last28.csv`; image sitemaps `public/sitemap-*.xml`; images in `image-gen/generated_images/` and on R2. Every image on the 20 target pages was looked at.

## 0. Findings that shape the plan

1. **Five target pages have a broken hero (HTTP 404 on R2)**, and those URLs are still in the image sitemap: `stamped-patterns-gallery.jpg` (stamped-concrete-patterns, 3,589 image impressions), `walkway-ideas-gallery.jpg` (concrete-walkway-ideas, 2,609), `patio-ideas-gallery.jpg` (concrete-patio-ideas, 1,440), `stamped-vs-pavers-comparison.jpg` (714) and `exposed-aggregate-vs-broom.jpg` (432). `concrete-walkway-cost` has no hero because `ogImage: "/og/walkway-cost.jpg"` doesn't exist (`public/og/` is gone). The materials pages have `/og/material-*.jpg` as their og:image, which is broken for social sharing.
   Outside the target set, these also return 404: `patio-resurfacing-cost.jpg`, `patio-trends-2026.jpg`, `stained-concrete-patio-gallery.jpg`, `stained-concrete-walkway-gallery.jpg`, `inspiration-exposed-aggregate-patio-tan.jpg` and `inspiration-stained-concrete-steps-warm.jpg`. They are a follow-up batch.
2. **Most images on blog pages are shared inspiration tiles** served as `cdn-cgi/image/width=600` WebP. The same file appears on up to 7 pages (for example, `inspiration-stamped-concrete-driveway-cobblestone.jpg`). Google ties an image to one landing page, so shared tiles add little to each page. Each page needs its own images that match its queries, in its own H2s.
3. **Pattern fidelity is the biggest quality problem.** Several tiles show the wrong pattern for their name:
   - "cobblestone" patio and walkway: the image shows ashlar rectangles.
   - "herringbone" patio and driveway: the image shows a running or random mix.
   - "ashlar slate" driveway: impossible diagonal X bands. This image is also the hero of black-stamped-concrete, even though it is light grey.
   - "travertine pool deck": no pool in the frame.
   The page that collects the most "stamped concrete patterns" impressions (959 at position 27) has no image that shows a pattern clearly.
4. **The #1 image page's hero has a defect.** `driveway-black-concrete.jpg` has a grey horizontal band across an empty sky, and about 35% of the frame is blank. The page ranks at position 2.4 for "black concrete" (857 impressions).
5. **The ChatGPT-era section images (2026-11-16) are the quality bar.** They show correct plates, real US homes and believable joints. Three of six on black-concrete-driveway are wet, and 2 of 4 on circular/border are wet. Wet glare hides color and finish, so the style guide now caps wet images at one per page. One brick-border image has no control joints on a two-car slab.
6. **How images are wired** (all read-only, nothing in `src/` was edited):
   - Article hero: `Article.ogImage`. It renders with `alt={article.headline}` (no custom alt) at `aspect-[2/3]` on mobile and `aspect-[4/3]` on desktop, center-cropped.
   - Section image: `ArticleSection.image` + `imageAlt`, one per H2. It renders under the body as a bare `<img>` at `aspect-video` (16:9 crop), with no `<figure>` or caption.
   - Section tiles: `ArticleSection.inspirationSlugs`, which render the inspiration page's `ogImage` through `cfImage(...,600)`.
   - Article JSON-LD `image`: when an article has tiles or section images, it lists only those and drops the hero (`ArticlePage.tsx` passes `galleryImages`, and `SeoHead` replaces the og image with them).
   - Materials: `MaterialPage.images[]`. `images[0]` is the hero (16:9 crop); `images[1..]` form the bottom gallery, with `<figcaption>` = alt, plus `ImageGallery` JSON-LD.
   - Inspiration: `ogImage` + `heroAlt`. `additionalImages` go into JSON-LD and the carousel, but the carousel renders them only as 128 px `cdn-cgi` thumbnails (only the selected image is large), so Google can index only a 128 px version. Corrected in phase B: they now also render as a full-size figure grid.
   - The image sitemap is built from `<img src>` in the prerendered HTML (`scripts/generate-sitemap.mjs`, part of `npm run build`).
   - `scripts/embed-image-metadata.mjs` writes IPTC/XMP from content alts. It now also reads section `image`/`imageAlt` pairs (see §5).

## 1. Definition: what "improving images" means here

Image impressions follow pages that rank on web, not the number of images (48 blog pages with 341 images = 25.5k impressions; 71 inspiration pages with 767 images = 1.7k). So the work goes into pages that already rank. An image counts as improved when it passes all of these:

1. **It literally depicts a query.** Every image query that lands on the page at position 5–40 with meaningful volume gets one image whose subject *is* that query. Examples: a pattern sample board for "stamped concrete patterns", a grey modern driveway for "grey modern concrete driveway", three dark test panels for "dark concrete". The named pattern, color or finish covers at least 40% of the frame in establishing shots and at least 80% in close-ups.
2. **It is technically right.**
   - Named patterns follow real geometry (ashlar slate, cobblestone, European fan, herringbone, running bond, basket weave, wood plank, random stone; specs are in the style guide).
   - Control joints are present, straight and continuous, at 8–12 ft on driveways and patios and 4–5 ft on walkways. Isolation joints appear at garages and steps.
   - Color names render as real integral or stain tones (charcoal ≠ black, terracotta ≠ fire-engine red).
   - Sizes are real: walkways 3–5 ft wide, two-car driveways 18–24 ft, bricks 8 in long.
3. **It has no realism tells:** no warped or wavy lines, melted cars, garbled or blank plates, tiled grass, cloned plants, pattern switches mid-slab, sky banding, fisheye, HDR halos or oversaturation.
4. **The page has a mix of shots.** Each page has establishing, mid-range, close-up texture and overhead pattern shots, never two with the same angle, light and season, and at most one wet image.
5. **It reads as a thumbnail.** At 200 px wide the subject is the first thing a stranger would name: one subject, joint contrast visible, no near-black or wet-glare frames on color or pattern topics.
6. **It survives the crop.** Article heroes are portrait 3:4 with the subject in the central band, because they are cropped to 2:3 and 4:3. Section, material and inspiration-detail images are landscape 3:2 with nothing important in the top or bottom 6%, because they are cropped to 16:9.
7. **Its signals match.**
   - The filename is keyword-descriptive and states what is shown.
   - The alt text says what is in the image (not the page title).
   - The caption adds one fact.
   - The image sits under the H2 that uses the same words.
   - It appears in the image sitemap through `<img src>` in the prerendered HTML.
   - It is in ImageObject JSON-LD; the hero should be included.
   - It carries IPTC/XMP (description = alt, creator, CC BY 4.0, AI DigitalSourceType).
8. **Its format is right.** JPEG with the long edge 1600 px (`take` resizes), about 150–350 KB, served from the raw R2 URL. Don't switch already-indexed images to new URLs (cdn-cgi variants are different URLs).
9. **Swap only with a reason.** SWAP is for a broken image, a pattern/color mismatch or a visible defect. Otherwise ADD. On FROZEN pages, log every swap in `_planning/refactor-2026-10/frozen-changes.md`. The ranking black hero is replaced *in place* (same URL), so the URL-level ranking signals carry over.

## 2. Per-page audit and actions

Columns: image impressions and position (last 28 days); the image queries that matter (impressions at position); current images with verdicts; actions. "Tile" means a shared inspiration tile.

### 2.1 /blog/driveway/black-concrete-driveway (4,174 impr, pos 11.9, FROZEN)
- **Queries:** black concrete 856 @2.4, concrete driveway 188 @15.8, concrete 160 @12.3, black concrete driveway 119 @1.2, dark concrete 103 @8.4, modern concrete driveway 97 @11.6, concrete driveway ideas 90 @24.7, black driveway 84 @1.9, modern concrete driveway finishes 70 @10.7, modern black concrete driveway 58 @2.4.
- **Current images:**
  - Hero `driveway-black-concrete.jpg`: modern black home, black RAV4, no readable plate, **grey band across the sky, 35% empty sky.** Weak.
  - Section images, all good, KEEP: `edge-black-integrally-colored-…-black-through.jpg`, `charcoal-integral-color-…-reads-nearly.jpg` (wet), `black-concrete-driveway-half-resealed-….jpg`, `sealed-black-concrete-driveway-meeting-faded-grey-asphalt.jpg` (wet), `black-concrete-driveway-front-white-modern-farmhouse-black.jpg`, `faded-black-concrete-driveway-lighter-tire-paths-years.jpg`.
  - Tiles: `inspiration-modern-black-concrete-driveway` (OK), `inspiration-brushed-concrete-driveway-charcoal` (pure texture, OK), `premium-slab-026/027` (OK).
- **Gaps:** nothing literally shows "dark concrete" or a black vs charcoal comparison.
- **Actions:**
  - SWAP the hero in place: `driveway-black-concrete-v2.jpg`, published over `driveway-black-concrete.jpg`.
  - ADD `black-charcoal-dark-grey-concrete-sample-panels.jpg` to H2 "Comparing Black Concrete to Other Dark Driveway Options".
  - KEEP the rest.

### 2.2 /blog/driveway/modern-driveway-ideas (3,856, pos 29.9, FROZEN)
- **Queries:** cheap concrete driveway ideas 221 @21.4, concrete driveway ideas 206 @26.2, modern driveway ideas 177 @33.7, grey modern concrete driveway 124 @13.8, modern concrete driveway finishes 98 @27.2, modern concrete driveway 78 @25.6, driveway 74 @2.9, concrete driveway designs 38 @20.2, modern stamped concrete driveway 33 @31.7.
- **Current images:**
  - Hero `driveway-modern-ideas.jpg`: charcoal broom driveway, modern home. Good, KEEP.
  - 16 tiles, mostly OK. `inspiration-large-slab-driveway-grass-joints` is weak (cars in a field, tiled grass strips) but shared, so leave it.
- **Gaps:** no grey modern driveway, nothing that reads as a cheap or budget idea, and no section images at all.
- **Actions:**
  - ADD `grey-modern-concrete-driveway-saw-cut-panels.jpg` to "Modern Concrete Driveway Finishes Compared".
  - ADD `cheap-concrete-driveway-idea-broom-finish-smooth-border.jpg` to "Driveway Design Ideas at a Glance: Cost and Style Comparison".
  - KEEP the hero.

### 2.3 /blog/patio/stamped-concrete-patterns (3,589, pos 31.1, FROZEN)
- **Queries:** stamped concrete patterns 865 @29.3, modern stamped concrete patterns 358 @19.5, stamped concrete designs 100 @28.5, modern stamped concrete patio 47 @29.5, slate stamped concrete patterns 37 @21.1, stamped concrete patterns and colors 20 @17.6, modern contemporary stamped concrete patterns 16 @28.2.
- **Current images:**
  - Hero `stamped-patterns-gallery.jpg`: **404, broken.**
  - 24 tiles. Pattern mismatches: `cobblestone-stamped-patio` and `cobblestone-stamped-walkway` (show ashlar), `herringbone-patio` and `herringbone-brick-driveway` (not herringbone), `stamped-concrete-driveway-ashlar-slate` (diagonal X bands).
  - Good tiles: `herringbone-walkway-concrete`, `herringbone-brick-walkway-red`, the wood plank pair and the flagstone set.
- **Gaps:** no image shows a pattern overview or a true pattern close-up, and nothing is "modern".
- **Actions:**
  - ADD a hero (replaces the 404): `modern-grey-ashlar-slate-stamped-concrete-patio.jpg`.
  - ADD `stamped-concrete-patterns-six-sample-panels.jpg` to "Stamped Concrete Pattern Comparison".
  - ADD `ashlar-slate-stamped-concrete-pattern-close-up.jpg` to "Ashlar Slate Stamped Concrete".
  - ADD `cobblestone-stamped-concrete-pattern-close-up.jpg` to "Cobblestone Stamped Concrete".
  - ADD `herringbone-brick-stamped-concrete-pattern-close-up.jpg` to "Herringbone Brick Stamp Patterns".
  - Optional: remove the mismatched tiles from the herringbone and cobblestone H2 tile lists (keep them elsewhere).

### 2.4 /blog/walkway/concrete-walkway-ideas (2,609, pos 28.6)
- **Queries:** concrete walkway ideas 105 @26.3, concrete front walkway ideas 79 @27.7, modern concrete walkway 48 @24.8, front yard concrete walkway ideas 32 @35.2, cement walkway ideas 29 @20.1, front entrance cement walkway designs 25 @40.2, stamped concrete walkway ideas 18 @24.0.
- **Current images:**
  - Hero `walkway-ideas-gallery.jpg`: **404, broken.**
  - 17 tiles, OK overall. `charcoal-broom-finish-walkway` is a black texture that is illegible as a thumbnail. `exposed-aggregate-walkway-tan` has a white smear artifact.
- **Gaps:** no front walkway image and nothing modern that reads as a walkway.
- **Actions:**
  - ADD a hero (replaces the 404): `concrete-front-walkway-curved-to-front-porch.jpg`.
  - ADD `modern-concrete-walkway-large-slabs-gravel-joints.jpg` to "Modern Concrete Walkway Designs".

### 2.5 /blog/driveway/stamped-concrete-driveway (2,208, pos 28.0, FROZEN)
- **Queries:** stamped concrete driveway 163 @40.8, modern stamped concrete driveway 64 @22.6, concrete driveway ideas 33 @23.2, grey modern concrete driveway 26 @18.2, stamped concrete driveway designs 23 @22.8, cheap concrete driveway ideas 21 @20.0.
- **Current images:**
  - Hero `driveway-stamped-concrete.jpg`: charcoal cobble/paver look, older CR-V with a plate. OK, KEEP.
  - Tiles: the H2 "Brick Running Bond" shows `herringbone-brick-driveway`, which is neither herringbone nor running bond.
- **Actions:**
  - ADD `modern-stamped-concrete-driveway-charcoal-slate-smooth-border.jpg` to "Ashlar Slate".
  - ADD `running-bond-brick-stamped-concrete-driveway.jpg` to "Brick Running Bond", and drop the mismatched tile from that H2.

### 2.6 /materials/colored-concrete (2,031, pos 24.7, FROZEN)
- **Queries:** concrete 187 @4.3, colored concrete 173 @26.7, dyed concrete 51 @27.9, colored concrete driveway 35 @21.7, coloured concrete driveway 22 @31.4, driveway stain colors 22 @12.2, tinted concrete 19 @23.3, charcoal color 17 @20.1, concrete driveway colors 14 @9.6.
- **Current images:** all 5 are *stained* (slate blue driveway as hero, acid patio, walnut driveway, blue-grey walkway, acid walkway). There is no integral-color image, and the hero is a portrait image cropped to 16:9.
- **Actions:**
  - SWAP the hero: insert `colored-concrete-driveway-sandstone-integral-color.jpg` as `images[0]`; the slate-blue image moves to the gallery.
  - ADD `concrete-color-samples-integral-color-and-stain.jpg` as `images[1]`.
  - Set `ogImage` to the new hero's R2 URL (currently a broken `/og/` path).

### 2.7 /blog/patio/best-concrete-finish-pool-deck (1,560, pos 30.2, FROZEN; highest image CTR, 1.1%)
- **Queries:** concrete pool deck finishes 30 @29.6 (3 clicks), modern concrete pool deck 20 @32.1, broom finish concrete pool deck 15 @18.1, modern concrete finishes 14 @29.1, broom brushed concrete pool deck 13 @23.1, modern broom finish concrete pool deck 8 @11.5, modern brushed concrete pool deck 7 @17.1, broom finish pool deck 6 @23.5.
- **Current images:**
  - Hero `patio-best-concrete-finish-pool-deck.jpg`: buff exposed aggregate, but the pool is barely visible and the thumbnail reads as "beige surface". Weak but OK; KEEP (frozen, nothing wrong with the content).
  - Tiles: `concrete-pool-deck-grey` (good), `exposed-aggregate-patio-white` (patio, no pool), `travertine-pool-deck` (**no pool in frame**).
- **Actions:**
  - ADD `broom-finish-concrete-pool-deck-modern.jpg` to "Broom Finish vs. Exposed Aggregate: The Practical Decision".
  - ADD `concrete-pool-deck-finishes-compared.jpg` to "Pool Deck Finishes Compared: Slip, Heat and Upkeep".
  - ADD `travertine-look-stamped-concrete-pool-deck.jpg` to "Travertine-Look Stamped Concrete…".

### 2.8 /blog/patio/patio-color-ideas (1,523, pos 34.4, FROZEN)
- **Queries:** colored concrete patio 60 @35.6, concrete color ideas 30 @41.8, stamped concrete patio colors 14 @47.3, concrete patio colors 9 @50.9.
- **Current images:**
  - Hero `patio-color-ideas.jpg`: tan integral patio, farmhouse. Slightly oversaturated but good; KEEP.
  - 7 tiles, OK.
  - The H2 "Slate Blue" has no image.
- **Actions:** ADD `slate-blue-concrete-patio.jpg` to "Slate Blue". KEEP the rest.

### 2.9 /blog/patio/concrete-patio-ideas (1,440, pos 34.5)
- **Queries:** stamped concrete patio ideas 68 @42.5, concrete patio ideas 51 @49.7, cement patio ideas 31 @41.5, modern concrete patio ideas 25 @48.2, poured concrete patio ideas 18 @59.7, backyard concrete patio ideas 15 @46.5.
- **Current images:** hero `patio-ideas-gallery.jpg` is **404, broken**; 19 tiles, OK.
- **Actions:** ADD a hero (replaces the 404): `backyard-concrete-patio-stamped-border-fire-pit.jpg`.

### 2.10 /inspiration/stamped-concrete-driveway-cobblestone (1,307, pos 35.9, FROZEN)
- **Queries:** stamped concrete driveway 49 @75.2, cobblestone stamped concrete 35 @23.5, stamped cobblestone concrete 22 @29.8, colored concrete driveway 21 @52.4, stamped concrete cobblestone 13 @22.8, cobblestone stamped concrete driveway 8 @14.5.
- **Current images:** hero `inspiration-stamped-concrete-driveway-cobblestone.jpg` (small cobble/ashlar mix, CR-V, reads as stamped). KEEP, because it ranks. Related tiles.
- **Gap:** there is no true cobblestone close-up, and `additionalImages` isn't rendered.
- **Actions:** ADD `cobblestone-stamped-concrete-driveway-close-up.jpg` as `additionalImages[0]`. This **requires the InspirationPage template to render `additionalImages`** (see §4.2).

### 2.11 /blog/driveway/concrete-driveway-cost (616, pos 30.1)
- **Queries:** driveway 53 @7.2, concrete 21, concrete driveway 20 @66.5, stamped concrete driveway cost 15 @30.9, concrete driveway cost 14 @42.6, plain concrete driveway 10 @44.0.
- **Current images:** hero `driveway-concrete-cost.jpg` (plain broom driveway, brick ranch, plate visible). Good. 6 tiles, OK.
- **Actions:** KEEP everything. The queries are generic or navigational, and the hero already matches "plain concrete driveway".

### 2.12 /blog/patio/stamped-concrete-vs-pavers (714, pos 30.2)
- **Queries:** modern stamped concrete patio 56 @27.7, stamped concrete paver look 15 @35.9, stamped concrete that looks like pavers 13 @38.0, gray herringbone stamped concrete 5 @37.8.
- **Current images:** hero `stamped-vs-pavers-comparison.jpg` is **404, broken**; 6 tiles (the cobblestone and herringbone patio tiles are mismatched).
- **Actions:**
  - ADD a hero (replaces the 404): `stamped-concrete-patio-meeting-paver-walkway.jpg`.
  - ADD `stamped-concrete-that-looks-like-pavers-grey.jpg` to "Appearance: How Close Does Stamped Get?".

### 2.13 /materials/broom-finish (1,056, pos 40.0, FROZEN)
- **Queries:** broom finish concrete texture 23 @65.9, light broom finish concrete 15 @57.8, concrete light broom finish 7, fine broom finish concrete 7, colored broom finish concrete 6 @39.3, medium broom finish concrete 5 @40.6.
- **Current images:** hero tan broom patio (OK), charcoal broom walkway (near-black texture, illegible as a thumbnail), broom pool deck (pool barely visible). Nothing shows light, medium and heavy texture.
- **Actions:** SWAP the hero: insert `light-medium-heavy-broom-finish-concrete-texture.jpg` as `images[0]`; the tan patio moves to the gallery. Set `ogImage`.

### 2.14 /blog/driveway/driveway-border-ideas (875, pos 31.4)
- **Queries:**
  - driveway border ideas 83 @16.0
  - asphalt driveway border ideas 46 @19.1
  - concrete driveway border ideas 41 @7.9
  - concrete driveway with paver border 33 @27.7
  - paver border ideas 21 @35.0
  - cobblestone driveway border 20 @44.2
  - concrete driveway with brick border 16 @44.2
  - asphalt driveway with concrete border 10 @51.2
  - asphalt driveway with paver border 10 @45.5
- **Current images:**
  - Hero `driveway-border-ideas.jpg`: grey driveway with a cobble border. Slight fisheye stretch but OK; KEEP.
  - Section images `light-grey-concrete-driveway-double-row-charcoal-pavers.jpg` (good) and `brick-border-across-entrance-along-sides-concrete-driveway.jpg` (good, but no control joints on a two-car slab; acceptable, keep).
  - 8 tiles.
- **Gap:** the asphalt queries (66 impressions) have no content and no image.
- **Actions:** ADD `asphalt-driveway-charcoal-paver-border.jpg`. **This is conditional:** the content agent first adds a short H2 such as "Borders for Asphalt Driveways"; without it, skip the image.

### 2.15 /materials/exposed-aggregate (732, pos 27.3, FROZEN)
- **Queries:** white exposed aggregate concrete 26 @19.4. The rest is noise ("marble run", "i am pibble").
- **Current images:** 5 driveway, patio and walkway shots, all OK.
- **Actions:** ADD `white-exposed-aggregate-concrete-close-up.jpg` as `images[1]` (gallery). Set `ogImage` to `images[0]`'s R2 URL (currently a broken `/og/` path).

### 2.16 /blog/walkway/flagstone-vs-concrete-walkway (553, pos 32.5, FROZEN)
- **Queries:** flagstone walkway with concrete 10 @33.3, stone walkway 8 @5.2, flagstone 7 @1.3, flagstone stamped concrete 12 @76.2.
- **Current images:**
  - Hero `walkway-flagstone-vs-concrete.jpg`: bluestone and concrete walks laid side by side. The layout is unnatural, but it ranks for "flagstone" @1.3, so KEEP.
  - 3 tiles, OK.
- **Actions:** ADD `flagstone-walkway-meeting-concrete-driveway.jpg` to "Transition Joints Between Flagstone and Concrete".

### 2.17 /blog/walkway/concrete-walkway-cost (523, pos 22.9)
- **Queries:** mostly noise (concrete 51 @17.0, "try square", "dr stone"); concrete walkway 8, stamped concrete walkway 8, concrete walkway cost 4.
- **Current images:** **no hero** (broken `/og/` path); 5 tiles.
- **Actions:** ADD a hero: `broom-finish-concrete-front-walkway-ranch.jpg`, and set `ogImage` to its R2 URL.

### 2.18 /blog/driveway/circular-driveway-ideas (509, pos 30.9)
- **Queries:** pervious surface 39 @10.9, circular driveway ideas 17 @53.4, circle driveway ideas 10 @42.3, round driveway ideas 8 @43.8.
- **Current images:**
  - Hero `driveway-circular-ideas.jpg`: stamped circle painted onto a flat slab, vignette, warped geometry. Weak.
  - Section images: `small-half-circle-…` and `straight-concrete-driveway-ending-round-teardrop-…` are good (both wet).
- **Actions:** KEEP for now; positions above 40 limit the gain. Follow-up candidate: swap the hero to a dry, elevated circular driveway around a center island.

### 2.19 /blog/patio/exposed-aggregate-vs-broom-finish (432, pos 29.6)
- **Queries:** mostly noise; exposed 11, aggregate 8, broom finish 7 @81.6, white exposed aggregate concrete 3.
- **Current images:** hero `exposed-aggregate-vs-broom.jpg` is **404, broken**; 7 tiles.
- **Actions:** ADD a hero (replaces the 404): `exposed-aggregate-border-broom-finish-driveway.jpg`.

### 2.20 /blog/driveway/black-stamped-concrete (282, pos 24.3)
- **Queries:** stamped concrete patterns 114 @18.4, modern stamped concrete patterns 26 @21.0, stamped concrete designs 14 @16.2, stamped concrete patterns and colors 12 @19.9, black stamped concrete 2 @6.0, deep charcoal stamped concrete 2 @11.0.
- **Current images:** the hero is `inspiration-stamped-concrete-driveway-ashlar-slate.jpg`: **light grey (not black), with impossible diagonal bands.** Tiles: the same image, plus `ashlar-slate-patio-charcoal`, the cobblestone driveway and `cobblestone-stamped-patio` (ashlar, mismatched).
- **Actions:** SWAP the hero to `black-stamped-concrete-ashlar-slate-patio.jpg` (`ogImage`). Tiles stay.

### Summary table

| Page | Swap | Add | Keep |
|---|---|---|---|
| black-concrete-driveway | hero (in place, sky band) | dark sample panels | 6 section images, 4 tiles |
| modern-driveway-ideas | – | grey modern driveway, cheap driveway idea | hero, tiles |
| stamped-concrete-patterns | – | hero (404), sample panels, ashlar/cobblestone/herringbone close-ups | good tiles (drop 4 mismatched from their H2s, optional) |
| concrete-walkway-ideas | – | hero (404), modern walkway | tiles |
| stamped-concrete-driveway | mismatched tile in "Brick Running Bond" | modern stamped driveway, running bond driveway | hero, other tiles |
| materials/colored-concrete | hero → gallery | integral-color driveway hero, color samples | 5 stained images |
| best-concrete-finish-pool-deck | – | broom pool deck, finishes compared, travertine-look pool deck | hero, tiles |
| patio-color-ideas | – | slate blue patio | hero, tiles |
| concrete-patio-ideas | – | hero (404) | tiles |
| inspiration/…-cobblestone | – | close-up (needs template render) | hero |
| concrete-driveway-cost | – | – | all |
| stamped-concrete-vs-pavers | – | hero (404), paver-look close-up | tiles |
| materials/broom-finish | hero → gallery | light/medium/heavy texture hero | 3 images |
| driveway-border-ideas | – | asphalt + paver border (needs new H2) | hero, 2 sections, tiles |
| materials/exposed-aggregate | – | white EA close-up | 5 images |
| flagstone-vs-concrete-walkway | – | flagstone/concrete transition | hero, tiles |
| concrete-walkway-cost | – | hero (missing) | tiles |
| circular-driveway-ideas | (follow-up: hero) | – | 2 sections, tiles |
| exposed-aggregate-vs-broom-finish | – | hero (404) | tiles |
| black-stamped-concrete | hero (grey, wrong geometry) | – | tiles |

## 3. Generation list (30 images, highest expected image-click gain first)

All 30 rows are in `image-gen/master-pin-tracker.csv` with:
- `image_generated=pending`, `generator=chatgpt`, `pinned=skip`, `pin_url` = the page;
- `page_headline` = `alt_text`;
- the new columns `section`, `alt_text`, `caption`, `target_query` and `replaces`;
- an `ai_prompt` written to the style guide, with region, scale cue, dry surface, and a car with a real-format plate whose state matches the region.

Article heroes use `page_type=article` (portrait 3:4). Section, material and inspiration-detail images use `article-section`, `material` or `inspiration-detail` (landscape 3:2).

"Addressable" means image-query impressions per 28 days at positions where an exact-match image can move up (sitewide). It is a rough ordering signal, not a forecast.

| # | Filename | Page | Type | Section / field | Target queries (addressable) |
|---|---|---|---|---|---|
| 1 | stamped-concrete-patterns-six-sample-panels.jpg | stamped-concrete-patterns | section | Stamped Concrete Pattern Comparison | stamped concrete patterns, designs, patterns and colors (~1,100) |
| 2 | modern-grey-ashlar-slate-stamped-concrete-patio.jpg | stamped-concrete-patterns | hero | ogImage (was 404) | modern stamped concrete patterns, modern stamped concrete patio (~440) |
| 3 | cheap-concrete-driveway-idea-broom-finish-smooth-border.jpg | modern-driveway-ideas | section | Driveway Design Ideas at a Glance… | cheap concrete driveway ideas, concrete driveway ideas (~440 on page, ~780 sitewide) |
| 4 | grey-modern-concrete-driveway-saw-cut-panels.jpg | modern-driveway-ideas | section | Modern Concrete Driveway Finishes Compared | grey modern concrete driveway, modern concrete driveway (finishes) (~360) |
| 5 | driveway-black-concrete-v2.jpg → published as driveway-black-concrete.jpg | black-concrete-driveway | hero | ogImage, same URL | black concrete, black (concrete) driveway (defends ~1,100 at pos 1–3) |
| 6 | concrete-front-walkway-curved-to-front-porch.jpg | concrete-walkway-ideas | hero | ogImage (was 404) | concrete (front) walkway ideas, cement walkway ideas (~270) |
| 7 | black-stamped-concrete-ashlar-slate-patio.jpg | black-stamped-concrete | hero | ogImage (swap) | stamped concrete patterns, black stamped concrete (~170) |
| 8 | black-charcoal-dark-grey-concrete-sample-panels.jpg | black-concrete-driveway | section | Comparing Black Concrete to Other Dark Driveway Options | dark concrete, black concrete (~100 + support) |
| 9 | colored-concrete-driveway-sandstone-integral-color.jpg | materials/colored-concrete | material | images[0] hero (+ ogImage) | colored concrete, colored/coloured concrete driveway (~245) |
| 10 | modern-stamped-concrete-driveway-charcoal-slate-smooth-border.jpg | stamped-concrete-driveway | section | Ashlar Slate | modern stamped concrete driveway, stamped concrete driveway designs (~140) |
| 11 | stamped-concrete-patio-meeting-paver-walkway.jpg | stamped-concrete-vs-pavers | hero | ogImage (was 404) | stamped concrete vs pavers, stamped concrete patio |
| 12 | backyard-concrete-patio-stamped-border-fire-pit.jpg | concrete-patio-ideas | hero | ogImage (was 404) | stamped / cement / backyard concrete patio ideas (~180, weak positions) |
| 13 | ashlar-slate-stamped-concrete-pattern-close-up.jpg | stamped-concrete-patterns | section | Ashlar Slate Stamped Concrete | slate stamped concrete patterns, ashlar slate (~80) |
| 14 | stamped-concrete-that-looks-like-pavers-grey.jpg | stamped-concrete-vs-pavers | section | Appearance: How Close Does Stamped Get? | looks like pavers, paver look, modern stamped concrete patio (~85) |
| 15 | broom-finish-concrete-pool-deck-modern.jpg | best-concrete-finish-pool-deck | section | Broom Finish vs. Exposed Aggregate… | broom (brushed) concrete pool deck, modern concrete pool deck (~70, pos 11–32) |
| 16 | concrete-pool-deck-finishes-compared.jpg | best-concrete-finish-pool-deck | section | Pool Deck Finishes Compared… | concrete pool deck finishes, modern concrete finishes (~45, CTR 10%) |
| 17 | concrete-color-samples-integral-color-and-stain.jpg | materials/colored-concrete | material | images[1] | colored/dyed/tinted concrete, concrete color ideas (~100) |
| 18 | cobblestone-stamped-concrete-pattern-close-up.jpg | stamped-concrete-patterns | section | Cobblestone Stamped Concrete | cobblestone stamped concrete (pattern fix) |
| 19 | modern-concrete-walkway-large-slabs-gravel-joints.jpg | concrete-walkway-ideas | section | Modern Concrete Walkway Designs | modern concrete walkway (ideas) (~64) |
| 20 | herringbone-brick-stamped-concrete-pattern-close-up.jpg | stamped-concrete-patterns | section | Herringbone Brick Stamp Patterns | herringbone stamped concrete (pattern fix) |
| 21 | running-bond-brick-stamped-concrete-driveway.jpg | stamped-concrete-driveway | section | Brick Running Bond | stamped concrete driveway designs (pattern fix) |
| 22 | exposed-aggregate-border-broom-finish-driveway.jpg | exposed-aggregate-vs-broom-finish | hero | ogImage (was 404) | exposed aggregate vs broom finish |
| 23 | asphalt-driveway-charcoal-paver-border.jpg | driveway-border-ideas | section | NEW H2 "Borders for Asphalt Driveways" (conditional) | asphalt driveway border ideas / with paver border (~66) |
| 24 | cobblestone-stamped-concrete-driveway-close-up.jpg | inspiration/stamped-concrete-driveway-cobblestone | inspiration-detail | additionalImages[0] (template render needed) | cobblestone stamped concrete variants (~85) |
| 25 | travertine-look-stamped-concrete-pool-deck.jpg | best-concrete-finish-pool-deck | section | Travertine-Look Stamped Concrete… | travertine stamped pool deck (tile fix) |
| 26 | light-medium-heavy-broom-finish-concrete-texture.jpg | materials/broom-finish | material | images[0] hero (+ ogImage) | broom finish concrete texture, light/medium/fine broom (~60, poor positions) |
| 27 | white-exposed-aggregate-concrete-close-up.jpg | materials/exposed-aggregate | material | images[1] | white exposed aggregate concrete (~30) |
| 28 | slate-blue-concrete-patio.jpg | patio-color-ideas | section | Slate Blue | concrete color ideas, colored concrete patio |
| 29 | flagstone-walkway-meeting-concrete-driveway.jpg | flagstone-vs-concrete-walkway | section | Transition Joints Between Flagstone and Concrete | flagstone walkway with concrete, stone walkway |
| 30 | broom-finish-concrete-front-walkway-ranch.jpg | concrete-walkway-cost | hero | ogImage (was missing) | concrete walkway (cost) |

Alt text, caption and the full ai_prompt for each row are in the ledger (`alt_text`, `caption`, `ai_prompt`). Use them verbatim when wiring. Phase B batches: **A = #1–10, B = #11–20, C = #21–30.**

## 4. Wiring per content file (phase B, after the content agent is done; re-check the H2 names first)

### 4.1 Content fields
- **`src/content/articles/patio.ts`**
  - stamped-concrete-patterns:
    - `ogImage` → #2.
    - `image` + `imageAlt` (and `imageCaption`, if §4.2 lands) on: "Stamped Concrete Pattern Comparison" (#1), "Ashlar Slate Stamped Concrete" (#13), "Cobblestone Stamped Concrete" (#18), "Herringbone Brick Stamp Patterns" (#20).
    - Optional: remove `cobblestone-stamped-patio`, `cobblestone-stamped-walkway`, `herringbone-brick-patio` and `herringbone-brick-driveway` from those two H2 tile lists.
  - concrete-patio-ideas: `ogImage` → #12.
  - stamped-concrete-vs-pavers: `ogImage` → #11; "Appearance: How Close Does Stamped Get?" `image` → #14.
  - exposed-aggregate-vs-broom-finish: `ogImage` → #22.
  - best-concrete-finish-pool-deck: "Broom Finish vs. Exposed Aggregate…" → #15; "Pool Deck Finishes Compared…" → #16; "Travertine-Look Stamped Concrete…" → #25 (optionally drop `pool-deck-travertine` from that H2).
  - patio-color-ideas: "Slate Blue" → #28.
- **`src/content/articles/driveway.ts`**
  - black-concrete-driveway: no field change for #5 (same URL); "Comparing Black Concrete to Other Dark Driveway Options" → #8.
  - modern-driveway-ideas: "Modern Concrete Driveway Finishes Compared" → #4; "Driveway Design Ideas at a Glance…" → #3.
  - stamped-concrete-driveway: "Ashlar Slate" → #10; "Brick Running Bond" → #21, and remove `herringbone-brick-driveway` from its `inspirationSlugs`.
  - black-stamped-concrete: `ogImage` → #7.
  - driveway-border-ideas: the new asphalt H2 → #23 (only if the content agent adds the H2).
- **`src/content/articles/walkway.ts`**
  - concrete-walkway-ideas: `ogImage` → #6; "Modern Concrete Walkway Designs" → #19.
  - concrete-walkway-cost: `ogImage` → #30.
  - flagstone-vs-concrete-walkway: "Transition Joints Between Flagstone and Concrete" → #29.
- **`src/content/materials/colored-concrete.ts`:** `images` = [#9, #17, slate-blue, acid patio, walnut, blue-grey walkway, acid walkway]; `ogImage` → #9's URL.
- **`src/content/materials/broom-finish.ts`:** `images` = [#26, tan patio, charcoal walkway, pool deck]; `ogImage` → #26's URL.
- **`src/content/materials/exposed-aggregate.ts`:** insert #27 at `images[1]`; `ogImage` → the `images[0]` URL.
- **`src/content/inspiration/index.ts`:** stamped-concrete-driveway-cobblestone `additionalImages: [{ url: #24, alt }]`.
- Use the image URL `https://images.pourcanvas.com/<filename>`. Alt = the ledger `alt_text`.
- Bump `updatedAt` only where body content also changes. Images alone don't need a date bump; the sitemap lastmod comes from the HTML.

### 4.2 Template changes (small; get the user's OK because they touch `src/pages` and `src/components`)
1. **`ArticlePage.tsx` section images:**
   - Wrap them in `<figure>` with `<figcaption>{section.imageCaption}</figcaption>`.
   - Add `imageCaption?: string` to `ArticleSection` in `types.ts`.
   - Change `aspect-video` to `aspect-[3/2]` so 3:2 images aren't cropped.
   - Add `width={1200} height={800}`.
   - Keep the raw R2 URL (don't move indexed images to cdn-cgi URLs).
2. **`ArticlePage.tsx` hero:** add `ogImageAlt?: string` to `Article` and render `alt={article.ogImageAlt ?? article.headline}`. Use the ledger `alt_text` for the new heroes.
3. **Article JSON-LD:** put the hero first in `galleryImages` (`{url: article.ogImage, caption: article.ogImageAlt ?? article.headline}`). Today the hero is dropped as soon as a page has tiles.
4. **`InspirationPage.tsx`:** render `additionalImages` as `<figure><img src alt loading="lazy"><figcaption>{alt}</figcaption></figure>` below the hero. Without this, #24 can't reach Google Images.

## 5. Pipeline changes made in phase A

- **`image-gen/IMAGEN_STYLE_GUIDE.md`:** all additions are marked "(2026-11-19)". The plate and vegetation rules are unchanged.
  - PRIORITY order (subject > geometry > realism > staging).
  - QUERY-FAITHFUL SUBJECT (≥40% / ≥80% of the frame, nothing competing, what "modern" means).
  - THUMBNAIL TEST (200 px).
  - CROP SAFETY (2:3 / 4:3 heroes, 16:9 sections).
  - SHOT MIX PER PAGE (no repeated angle/light/season, at most one wet image).
  - Sky-banding ban in LIGHTING.
  - NAMED PATTERN GEOMETRY (ashlar slate, cobblestone, European fan, herringbone, running bond, basket weave, wood plank, random stone, stamped vs real pavers).
  - CONTROL AND EXPANSION JOINTS (spacing, aspect, continuity, isolation joints, saw cuts on stamped).
  - SCALE cues.
  - COLOR FIDELITY (tone per color name, stain vs integral vs release, dry).
  - REGION, ARCHITECTURE, SEASON (plate state matches region; wet only on request).
  - HONEST AGE.
  - Vehicle frame cap (≤15%).
  - BANNED AI TELLS.
  - Orientation rule (portrait heroes, landscape sections/material/detail).
  - QC RUBRIC (10 pass/fail items, reviewer only).
- **`image-gen/generate_og_images.py`:**
  - The `QC RUBRIC` block is stripped before the guide goes to Gemini.
  - Close-up/overhead prompts no longer get an injected car or garage door (`_CLOSEUP_KEYWORDS`).
  - `run_full` skips `generator=chatgpt` rows, so an Imagen run can't take the queued rows.
  - The variation label now says overhead/close-up correctly.
- **`image-gen/chatgpt_images.py`:**
  - `build()` routes close-up subjects to close-up params (overhead vs low-angle as the prompt says) before the scene check. Before this, "no home visible" counted as a scene.
  - Prompts that say "dry" never get the post-rain override.
  - Landscape now applies to `article-section`, `material` and `inspiration-detail`.
  - New ledger columns: `section`, `alt_text`, `caption`, `target_query`, `replaces`.
  - `take` writes `alt_text` into XMP Description.
- **`image-gen/seed_premium_pins.py`:** `save_master` keeps every existing ledger column. Before, it rewrote the CSV with a fixed 21-column list and would have silently dropped `final_prompt`, `generator`, `chat_url` and the new columns.
- **`scripts/embed-image-metadata.mjs`:** also maps section `image`/`imageAlt` pairs to IPTC/XMP descriptions.
- **`image-gen/prompt-variation-axes.csv`:** 17 reference rows: `stamp_pattern` (8), `region` (6), `season` (3).
- **`image-gen/master-pin-tracker.csv`:** 5 new columns and 30 pending rows (183 → 213).
- Checks: free dry runs of `build()` with a stub client confirmed close-up routing, dry filtering, landscape/portrait counts (22/8), that no row gets an unwanted car, and that the QC rubric is absent from the Gemini meta prompt. `prompts` was not run.

## 6. Phase B run plan

0. **Preconditions.**
   - The content agent has finished; `git status` is clean for `src/content`.
   - `cd image-gen && source .venv/bin/activate`.
   - `.env` has `GOOGLE_API_KEY`, `CF_API_TOKEN`, `R2_BUCKET` and `R2_PUBLIC_BASE_URL`.
   - Re-check the section H2s in the ledger against the current content.
1. **Build the prompts** (Gemini Flash, small cost): `python chatgpt_images.py prompts <the 10 filenames of batch A>`. This stores `final_prompt` and `prompt_variation` and writes `image-gen/chatgpt/payload.js`. Spot-read 3 final prompts: pattern words intact, plate text intact, no car in close-ups.
2. **Generate** with a headless Chrome child, one fresh chat per image:
   `cd /tmp && claude -p --chrome --allowedTools "mcp__claude-in-chrome__*" --output-format text "<brief>" < /dev/null`
   Brief (self-contained):
   > Open a new tab at https://chatgpt.com/ (signed in). Run the JavaScript in /Users/stoffi/Documents/pourcanvas/image-gen/chatgpt/payload.js once in that tab; it seeds localStorage and returns the subject count. Then, for each id in [<stems>]: navigate to https://chatgpt.com/ for a new empty chat (no project, no old thread). Run image-gen/chatgpt/start.js with `__ID__` replaced by the id; it must return "<id> started"; on "ABORT", reload and retry once. Every 30 s, run image-gen/chatgpt/collect.js with the same id, up to 5 minutes, until it returns "OK <id> <n> <url>"; it downloads ~/Downloads/<id>-<n>.png. Append "<id> <chat url>" to /Users/stoffi/Documents/pourcanvas/image-gen/chatgpt-chats.txt. Never reuse a chat for a second image. Close every tab you opened. Finally, print one line per id: OK/FAILED, the chat URL and the file count.
3. **QC each PNG** against the QC RUBRIC at the end of `IMAGEN_STYLE_GUIDE.md`.
   - Read the image at full size, and at 200 px via `magick ~/Downloads/<id>-1.png -resize 200x /tmp/<id>-thumb.png`.
   - Check the plate text against the prompt's plate.
   - Log id, variant, the 10 items, pass/fail and a note in `_planning/images-2026-11/qc-log.csv`.
   - On FAIL: rerun `prompts <filename>` for a new variation (or reuse `final_prompt`) in a fresh chat; after 3 failures, rewrite the `ai_prompt`.
4. **Ingest passes:** `python chatgpt_images.py take <filename> <chat_url> <variant>`. This converts to JPEG at 1600 px, writes XMP, uploads to R2 and marks the row completed.
5. **Black hero in place (#5).**
   - Back up the old file: `cp generated_images/driveway-black-concrete.jpg /tmp/driveway-black-concrete-v1.jpg`.
   - `cp generated_images/driveway-black-concrete-v2.jpg generated_images/driveway-black-concrete.jpg`.
   - `python -c "import generate_og_images as og; print(og.upload_to_r2(og.OUTPUT_DIR/'driveway-black-concrete.jpg','driveway-black-concrete.jpg'))"`.
   - Purge the Cloudflare cache for `https://images.pourcanvas.com/driveway-black-concrete.jpg`, in the dashboard or via the API if the token has Zone.Cache Purge.
   - Note it in the ledger row (`replaces`).
6. Repeat steps 1–5 for batches B and C. Run #23 only if the asphalt H2 exists, and #24 only if §4.2 item 4 is approved.
7. **Wire** per §4.1 (and §4.2 if approved).
8. **Log the FROZEN changes** in `_planning/refactor-2026-10/frozen-changes.md`: the black-concrete-driveway hero (in place, sky band), the colored-concrete and broom-finish hero order, and the stamped-concrete-patterns hero (404 fix), with the before/after filenames and the evidence above. Set a GSC re-check for about 2026-12-10.
9. **Metadata:** `node scripts/embed-image-metadata.mjs` re-tags every JPG. Then re-upload only the new files (loop `og.upload_to_r2` over the 30 filenames, plus `driveway-black-concrete.jpg`).
10. **Build and verify:**
    - `npm run build` (prerender + sitemap).
    - Check that `dist/**` HTML for each target page contains the new `<img src>` and alt.
    - Check that `public/sitemap-blog.xml` and `sitemap-materials.xml` list the new image:loc entries and no longer list the 404 heroes.
    - Rerun the 404 sweep over all `<image:loc>` URLs (`curl -I` loop).
    - `node scripts/check-pages.mjs`.
11. **Deploy** through the normal process (user approval). Then:
    - Resubmit `sitemap-blog.xml` and `sitemap-materials.xml` in GSC.
    - Request indexing for the 5 biggest pages through the Chrome child: stamped-concrete-patterns, modern-driveway-ideas, black-concrete-driveway, concrete-walkway-ideas, colored-concrete.
12. **Measure** 2–4 weeks later: pull `image_query_page_last28.csv` again and compare impressions, position and clicks for each target query in §3.
