# PourCanvas — Kontext MVP + Full Architecture Plan

## Context

Testing confirmed Flux Kontext [max] multi-image produces production-quality redesigns
in a single API call (~20s, $0.04) vs the old EVF-SAM + Flux Fill pipeline (9 calls,
~65s, ~$0.28). The old pipeline is being scrapped. This plan defines the MVP to validate
Kontext at scale, plus the full production architecture for reference.

**Still unproven / needs local testing before building:**
- Does varied seed produce enough output variation? (core Tier 2 assumption)
- Does a tight reference crop (tiles only) reduce literal furniture copying?
- Does aspect ratio need explicit handling? (Kontext default output is 1024×1024 square)
- Is ESRGAN actually needed or is 1024×1024 Kontext output sufficient quality?
- Does adding "including all side boundary fence panels" fix the right-fence miss?

These should be tested in the fal.ai playground before writing the new route.

---

## Pre-Build Experiments (Playground, No Code)

Run these in order before building. Each takes ~20s and $0.04:

| # | Test | What to vary | Success criteria |
|---|---|---|---|
| 1 | Seed sweep | 5 runs same inputs, different seeds | Outputs are noticeably different in layout |
| 2 | Reference crop | Tight crop of tiles only (no furniture/plants) vs full image | Reduces L-bench + round table literal copy |
| 3 | Side fence fix | Add "including all side boundary fence panels" to REPAINT instruction | Right cedar fence gets painted |
| 4 | Aspect ratio | Non-square input (original garden photo is landscape 4:3) | Output not stretched/cropped wrong |
| 5 | No ESRGAN | Compare Kontext output directly vs after ESRGAN | Confirm ESRGAN adds visible value |

---

## MVP Architecture

**Goal:** single output per generation, single reference image per style, no quality gate,
validates the Kontext approach with real users.

### Process Flow

```
[User uploads garden photo]
          ↓
[Compress to 2000px max, extract width/height — existing compressImage()]
          ↓
[Select style — single dropdown, one style initially]
          ↓
[Click Generate]
          ↓
POST /api/redesign
  ├── Upload input image to fal storage → inputUrl
  ├── fal-ai/flux-pro/kontext/multi
  │     image_urls: [inputUrl, STYLE_REFERENCE_URL]
  │     prompt: style.kontextPrompt
  │     guidance_scale: style.guidanceScale  (tested sweet spot: 5.5)
  │     seed: random per request
  │     output_format: jpeg
  │     → redesignedUrl
  └── fal-ai/esrgan
        image_url: redesignedUrl
        scale: 2
        → finalUrl
          ↓
[Display single output alongside input]
[Regenerate button → new random seed, same reference]
```

**Total: ~27s, ~$0.05 per generation**

### API Shape

```typescript
// POST /api/redesign
Input:  { imageBase64, mimeType, imageWidth, imageHeight, styleId }
Output: { url: string }
```

### Files to Create / Modify

| File | Action | Change |
|---|---|---|
| `src/app/api/redesign/route.ts` | **Create** | New single-route Kontext pipeline |
| `src/styles/types.ts` | **Rewrite** | Replace Flux Fill fields with Kontext fields |
| `src/styles/configs.ts` | **Rewrite** | New kontextPrompt + guidanceScale per style |
| `src/app/page.tsx` | **Simplify** | Single API call, single output display |
| `public/refs/modern-concrete.jpg` | **Add** | Copy context_modern-concrete.png here |
| `src/app/api/generate/route.ts` | **Keep (unused)** | Don't delete yet — fallback reference |
| `src/app/api/style/route.ts` | **Keep (unused)** | Don't delete yet — fallback reference |

### New StyleConfig Interface

```typescript
export interface StyleConfig {
  id: string;
  label: string;
  description: string;
  referenceImagePath: string;  // served from /refs/{id}.jpg
  kontextPrompt: string;
  guidanceScale: number;       // tested sweet spot: 5.5
}
```

### Modern Minimalist Kontext Prompt (update after experiment results)

```
The first image is the scene to redesign. The second image is style reference only —
do not copy its layout, viewpoint, or furniture arrangement.

PRESERVE exactly — do not touch: brick walls, rendered walls, windows, door frames,
roof, soffit, sky, neighboring houses.

REMOVE completely: all loose objects, hoses, tools, garden equipment, animals,
people, nursery pots, temporary items leaning against walls.

REPLACE the entire patio and ground surface with large-format light grey porcelain
tiles in a straight grid pattern, matching the tile material and color from the
reference image.

REPAINT all fence panels dark charcoal grey — including the back fence and all
side boundary fence panels.

REPLACE any lawn with bark mulch planting beds along the fence line, add
dracaenas and agave plants.
```

### Reference Image

`public/refs/modern-concrete.jpg` (copy of the tested context_modern-concrete.png)

The `referenceImagePath` is served as a public URL: `{NEXT_PUBLIC_BASE_URL}/refs/modern-concrete.jpg`

> **Note:** Reference image must be a public URL for fal.ai to fetch it. In local dev,
> use ngrok or serve via a public tunnel, OR upload to fal storage once and hardcode the
> storage URL in the style config.

---

## Full Production Architecture

**Goal:** 2 free variations → paywall → batches of 2, multiple styles,
expandable style × plants × furniture filter axes.

### Process Flow

```
[User uploads photo]
          ↓
[Compress + extract dimensions]
          ↓
POST /api/validate  (cheap, fast)
  └── Claude Haiku: is this an outdoor redesignable space? → scene brief
      { spaceType, clutter[], constraints, cacheKey }
      Cached per session — not re-run on regenerate
          ↓
[Select style + optional filters]
  style: "modern-concrete" | "organic-warm" | ...
  plants: "sparse" | "lush" | "none"          (future axis)
  furniture: "seating" | "dining" | "none"    (future axis)
          ↓
[Click Generate → 2 free variations]
          ↓
POST /api/redesign
  ├── Upload input image to fal storage (once per session, URL cached client-side)
  ├── For each of 2 variations (parallel):
  │     ├── Sample variation anchor from style's pre-computed anchor pool
  │     │     (no runtime LLM call — pool pre-written per style)
  │     ├── Sample reference image from style's pool of 5–10 refs (no repeats per session)
  │     ├── Assemble prompt = base prompt + variation anchor + filter overrides
  │     └── fal-ai/flux-pro/kontext/multi
  │           image_urls: [inputUrl, sampledReferenceUrl]
  │           prompt: assembledPrompt
  │           guidance_scale: style.guidanceScale
  │           seed: random
  │
  ├── Quality gate per output (parallel with generation):
  │     └── Claude Haiku vision check:
  │           "Does output preserve house structure? Is ground redesigned? Score 1–5."
  │           Score < 3 → retry once (different seed + different reference sample)
  │
  └── fal-ai/esrgan × 2 (parallel, after quality gate pass)
          ↓
[Stream: return each output as it resolves — don't wait for both]
[Show 2 outputs]
          ↓
[Paywall gate → batch of 2 more]
  Each additional batch: same pipeline, new seeds + new reference samples
```

**Total per 2-variation batch: ~25–30s, ~$0.09**
**Quality gate adds: ~$0.002 + ~2s per output**

### Style DNA Structure (server-side, per style)

```typescript
interface StyleDNA {
  id: string;
  label: string;
  basePrompt: string;           // core redesign instruction
  variationAnchors: string[];   // 4–6 pre-written spatial concepts, sampled randomly
  referencePool: string[];      // 5–10 reference image URLs (fal storage)
  filterOverrides: {
    plants: Record<"sparse"|"lush"|"none", string>;  // appended to prompt
    furniture: Record<"seating"|"dining"|"none", string>;
  };
  guidanceScale: number;
  negativeInstructions: string; // what to never do for this style
}
```

### Pre-computed Assets Per Reference Image

Prepared offline, stored in style config or DB — no runtime computation:

| Asset | Format | Purpose |
|---|---|---|
| Full reference URL | fal storage URL | Primary multi-image input |
| Tile/surface crop URL | fal storage URL | Reduces literal furniture copying |
| Style DNA summary | string | Fallback if reference stripped by model |
| Variation anchors | string[] | Runtime prompt variation without LLM call |

### Product / Billing Flow

```
Free:   2 generations (1 batch) per photo upload, watermarked
Paid:   Unlock batches of 2, no watermark
        Per-photo pricing OR subscription (TBD)
```

Style selector expands per feature flag:
- Phase 1: style only (modern-concrete)
- Phase 2: + organic-warm
- Phase 3: style + plants filter
- Phase 4: style + plants + furniture

---

## Verification (MVP)

1. Upload garden photo → single output returned in <35s
2. Kontext output shows: tiles changed, fence repainted, clutter removed, house preserved
3. Regenerate button → visibly different output (different layout / planting)
4. Non-square input → output not distorted (aspect ratio handled)
5. Reference image accessible as public URL from local dev (ngrok or fal storage URL)
6. TypeScript clean: `node_modules/.bin/tsc --noEmit`
