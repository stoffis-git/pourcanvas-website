# PourCanvas v2 — Product & Technical Scope

> *Last updated: March 2026*

---

## 1. Product Vision

PourCanvas v2 is a patio inspiration and redesign tool. A user uploads a single self-taken photo of their outdoor space, selects a design style from a curated list, and receives a photorealistic redesign that:

- Preserves all architecture, structure, perspective, depth-of-field, and camera characteristics of the original photo
- Identifies the usable ground area and entrance(s) as the generation canvas
- Cleans up clutter, dirty surfaces, and visual noise before redesigning
- Applies the selected style with spatial intelligence and genuine design taste — not uniform furniture dumping
- Allows selective non-ground modifications (lighting, fencing, vegetation, pergolas)
- Produces output indistinguishable from professional architectural photography

---

## 2. Core Technical Pipeline

### 2.1 High-Level Architecture

```
User Photo
    │
    ├──→ Depth Anything v2 ──────────────────────────┐
    ├──→ SAM 2 Segmentation ─────────────────────────┤
    ├──→ GroundingDINO (entrance + clutter detection) ┤
    │                                                 ▼
    │                              ControlNet Stack (Flux 1.1 Pro)
    │                                                 │
    ├──→ Style Selection                              │
         │                                           │
         ├── IP-Adapter reference image ─────────────┤
         ├── Style LoRA ──────────────────────────────┤
         └── Prompt bundle ──────────────────────────┘
                                                      │
                        ┌─────────────────────────────┤
                        │  Cleanup inpaint pass        │
                        │  LLM layout planning         │
                        │  Core generation (inpaint)   │
                        │  Pergola compositing         │
                        │  IC-Light relighting         │
                        │  Real-ESRGAN tiled upscale   │
                        │  Post-processing pass        │
                        └─────────────────────────────┘
                                                      │
                                                      ▼
                                               Final Output
```

---

### 2.2 Phase-by-Phase Pipeline Detail

#### Phase 0 — Input Preprocessing

Before any generation:

- **Depth Anything v2** — monocular depth map. This is the primary ControlNet conditioning signal. It preserves floor plane, walls, steps, and all spatial relationships throughout the generation.
- **SAM 2** — semantic segmentation. Isolates: ground/patio surface, structural elements (walls, fences, pergolas), vegetation, sky, and existing furniture. The ground mask becomes the core generation canvas.
- **GroundingDINO** — open-vocabulary object detection. Run with text queries `"door", "entrance", "gate", "threshold"` to identify and buffer-protect entrance zones. Also run with clutter queries (`"broom", "hose", "bucket", "dirty stain", "cable"`) to feed the cleanup pass.
- **Canny edge extraction** — secondary ControlNet input. Preserves architectural lines: door frames, step edges, railing outlines, keeping generated elements spatially grounded.

The final inpaint mask is computed as:
```
Final Mask = SAM2 ground mask
             MINUS entrance buffer zone (GroundingDINO + 10–15px dilation)
             MINUS structural preserve zones (walls, architecture)
```

Everything outside this mask is pixel-locked. The model cannot touch it.

---

#### Phase 1 — Cleanup Pass (pre-generation)

A dedicated inpaint step before redesign. Run separately — not combined with the redesign pass.

- Detected clutter objects (brooms, hoses, cables): inpaint with prompt `"clean patio surface, empty, neutral, photorealistic"`. Denoise strength ~0.45–0.55. Depth ControlNet at ~0.95 — minimal structural change, just removal.
- Dirty/stained walls: inpaint with wall segmentation mask + `"freshly painted render wall, clean, matte"`. Denoise ~0.50.
- Fences and vegetation adjustments: separate mask, denoise ~0.65 (you're changing the object, not just cleaning). Use style-specific vegetation vocabulary (e.g. `"lush mediterranean planting, olive, lavender, bougainvillea"`).

Output of Phase 1 is a clean, clutter-free version of the input that feeds Phase 2.

---

#### Phase 2 — LLM Layout Planning

Before touching the diffusion model for redesign, send segmentation data + depth + selected style to GPT-4o (vision) or equivalent:

**Prompt structure:**
> *"This patio is approximately [W]m × [D]m. The entrance is at [position from depth/GroundingDINO]. The usable ground mask is [described/visualised]. The user selected [STYLE]. Generate a spatial layout JSON: seating zone position, dining zone, path clearance to entrance, any pergola/pavilion position, planting zones. Respect human flow. Leave intentional negative space. Be tasteful and nuanced."*

Output is a zone-layout JSON that drives zone-specific prompts in Phase 3. This is what prevents furniture-dumping and produces genuine design concept quality.

**Style design briefs** are baked into the LLM prompt — not just an aesthetic label. Example for Mediterranean:
- Natural materials: stone, terracotta, wrought iron, linen
- Shade-first layout logic
- Layered planting with specific species
- Organic, asymmetric furniture arrangement
- Warm evening light character

---

#### Phase 3 — Core Generation

**Model:** Flux 1.1 Pro (Black Forest Labs). Chosen over SDXL for superior photorealism, material texture rendering (wood grain, stone, concrete, fabric), and prompt adherence. ControlNet adapters available via fal.ai.

**ControlNet stack:**

| ControlNet | Signal | Strength |
|---|---|---|
| Depth ControlNet | Depth Anything v2 map | 0.75–0.90 |
| Canny ControlNet | Edge map | 0.40–0.60 |
| Seg ControlNet | SAM2 segmentation | 0.60–0.75 |

**IP-Adapter:** Each style option carries a curated reference photograph (not a render or mood board — real photography) fed into IP-Adapter. This encodes color palette, material feel, furniture character, and atmosphere more reliably than text prompts alone.

**Style LoRAs:** Fine-tuned LoRA adapter per style, trained on 200–500 curated patio photographs per style. Produces style-specific furniture silhouettes and material textures that prompt engineering alone cannot achieve. Training cost: ~€2–5 per LoRA on RunPod, ~2–4 hours per style.

**Generation approach:** Inpainting (not img2img). Only the masked region (from Phase 0) is regenerated. Structural elements outside the mask are pixel-preserved. This is non-negotiable for this use case.

**Denoise strength:** 0.72–0.78 for the redesign pass. Below 0.6 produces ghosting from original furniture. Above 0.85 destroys spatial structure. Per-style calibration required.

**Regional conditioning:** Zone-specific prompts from the LLM layout (Phase 2) applied via ComfyUI regional prompting nodes or `BREAK` keyword separation. Dining zone, lounge zone, path, and planting zones each receive distinct prompts.

**Pergola/pavilion handling:** Generated as a separate composited layer. Depth map used to compute correct occlusion (furniture behind pergola posts is correctly occluded). Single-pass pergola generation in complex scenes reliably fails.

**Prompt structure per style config:**
```json
{
  "style": "mediterranean",
  "ip_adapter_reference": "refs/mediterranean_patio_01.jpg",
  "positive_prompt": "mediterranean patio, terracotta tiles, whitewashed walls, wrought iron furniture, olive trees, warm evening light, photorealistic, 8k",
  "negative_prompt": "cartoon, illustration, deformed geometry, floating objects, plastic furniture, symmetrical layout, overcrowded, catalog photo, showroom arrangement, uniform spacing, too much furniture",
  "lora_weights": ["mediterranean-outdoor-v2.safetensors"],
  "depth_controlnet_strength": 0.85,
  "canny_controlnet_strength": 0.45,
  "denoise_strength": 0.75
}
```

---

#### Phase 4 — IC-Light Relighting (Full Stack)

Optional but high-impact. IC-Light matches ambient lighting direction between the original photo's sky/shadow conditions and the generated furniture/surfaces. Dramatically increases realism, particularly for afternoon and evening scenes.

---

#### Phase 5 — Tiled Upscaling + Post-Processing

- **Real-ESRGAN** tiled upscale (2–4×). Always generate at 1024px then upscale — generating at 2k+ native produces AI-textbook surface textures.
- **Film grain overlay** — subtle 2–3%. Paradoxically makes output look more photographic.
- **Depth-of-field matching** — extract focal depth from the original depth map. Apply matching blur gradient to distant elements during upscaling. Matches the original camera's apparent aperture. Foreground sharp, background softly defocused.
- **Chromatic aberration** — very subtle lens distortion at edges.
- **GFPGAN / CodeFormer** — if any people are present in the original scene.

---

### 2.3 Quality Factor Relative Importance

| Factor | Quality Impact (1–10) | Ceiling Without It | What It Controls | Replaceability |
|---|---|---|---|---|
| **Segmentation / masking accuracy** | **9.5/10** | Everything outside mask breaks; wrong elements changed | What gets touched vs. preserved; spatial integrity | Not replaceable by any model |
| **Depth map + ControlNet conditioning** | **9/10** | Perspective breaks, furniture floats, spatial incoherence | 3D structure, camera perspective, DoF anchor | Not replaceable by prompting |
| **Inpaint strategy** (not img2img) | **8.5/10** | Architecture gets corrupted; whole image shifts style | Surgical editing; preservation of untouched zones | Critical for this use case |
| **LLM layout planning** | **8/10** | Furniture dumped uniformly; no concept; entrance blocked | Spatial intelligence, zone logic, taste, negative space | Not replaceable by diffusion alone |
| **Denoise strength tuning** | **8/10** | Ghosting artifacts or structural destruction | Balance between change and preservation | Cannot be automated — per-style calibration |
| **IP-Adapter (style reference image)** | **7.5/10** | Style feels generic despite prompting | Color palette, furniture character, material feel | Absorbs ~50% of prompt's role |
| **Model choice** (Flux vs SDXL vs older) | **7/10** | Mediocre texture, weak photorealism | Base photorealism, material rendering, coherence | Partially — newer models absorb some pipeline work |
| **Tiled upscaling + post-processing** | **7/10** | Obvious AI texture; no material detail; wrong DoF | Perceived photographic quality, material granularity | Not replaceable — generation res alone insufficient |
| **LoRA per style** | **7/10** | Correct style labels but no style soul; wrong silhouettes | Style furniture shapes, material textures, lighting character | Hard to replicate otherwise |
| **Prompt engineering** | **6/10** | Generic, tasteless output; wrong materials | Style vocabulary, material specifics, negative space | Partially absorbed by IP-Adapter + LoRA |
| **Pre-generation cleanup pass** | **6.5/10** | Clutter and dirt bleed through into redesign | Source image quality feeding generation | Skippable for very clean input photos |

**Summary:** Masking, depth conditioning, and inpaint strategy are the non-negotiable quality floor. No model version compensates for missing these. LLM layout + IP-Adapter + LoRA raise the ceiling from "impressive demo" to "product people pay for." Prompting alone is the weakest lever in a spatially-grounded task.

---

## 3. Infrastructure & Hosting

### 3.1 Architecture

```
User (Browser)
    │
    ▼
Hetzner VPS (CX32 — €14/mo)
├── Coolify (deploy orchestration, SSL, env vars)
├── Next.js app (frontend + API gateway)
├── BullMQ job queue
└── Redis (job state, queue backend)
    │
    ▼
fal.ai / Replicate (GPU inference — pay per second)
└── ComfyUI workflow (full pipeline as versioned JSON)
```

**Job flow:**
```
Client → POST /api/generate → { jobId } returned immediately (~200ms)
Client → polls GET /api/job/[jobId] every 3s
Backend (BullMQ worker) → fires pipeline to fal.ai
fal.ai → runs ComfyUI workflow → returns image URL
Backend → updates job state in Redis
Client → receives result URL
```

### 3.2 Why Hetzner over Vercel

| | Vercel Pro | Hetzner CX32 |
|---|---|---|
| Monthly cost | €20+ | €14 (already running at €5 — upgrade recommended) |
| Long-running async jobs | Workaround required | Native |
| Job queue (BullMQ) | Not possible | Runs natively |
| Background workers | ❌ | ✅ |
| WebSocket / polling | Limited | Full control |
| Cold starts | Yes | No |

The async job pattern this pipeline requires is a natural fit for a persistent server. Upgrade the current CX22 ($5/mo) to a **CX32 ($14/mo)** before launch — 4 vCPU, 8GB RAM provides enough headroom for web server + Redis + BullMQ worker running concurrently.

### 3.3 GPU Inference

GPU inference runs entirely on **fal.ai or Replicate** — managed APIs, pay per second, scale to zero. The Hetzner box never runs ML workloads directly.

**Self-hosted GPU crossover point:** Running a dedicated A100 on Hetzner GPU Cloud (~€900/mo) becomes cheaper than managed API pricing at approximately **300–400 active Designer-tier subscribers**. Below that threshold, managed API is both cheaper and operationally simpler.

### 3.4 Pipeline Orchestration

**ComfyUI** is the orchestration layer. The entire pipeline (depth extraction → segmentation → ControlNet stack → cleanup inpaint → LLM call → core generation → upscale → post) is expressed as a single workflow JSON. This workflow is:
- Versioned in git
- Swappable without code changes
- A/B testable by loading alternate workflow configs
- Callable as a REST endpoint via ComfyUI API

---

## 4. Timing & Cost

### 4.1 Phase Timing (A100 via managed API)

| Phase | MVP Stack | Full Stack | Vercel-safe? |
|---|---|---|---|
| Preprocessing (Depth + SAM2 + GroundingDINO) | 3–6s | 3–6s | ✅ |
| Cleanup inpaint pass | — | 12–20s | ✅ |
| LLM layout planning (GPT-4o) | — | 4–8s | ✅ |
| Core generation (Flux + ControlNet + inpaint) | 15–25s | 20–35s | ✅ borderline |
| Pergola compositing | — | 12–20s | ✅ |
| IC-Light relighting | — | 8–15s | ✅ |
| Tiled upscaling (Real-ESRGAN) | 6–10s | 8–14s | ✅ |
| Post-processing | 1–2s | 2–4s | ✅ |
| **Total** | **~25–45s** | **~70–120s** | MVP borderline / Full ❌ |

Note: Vercel limits are moot with the async job architecture described in 3.1. Total pipeline time is irrelevant to the HTTP request cycle.

**UX pattern for full stack:** Return a cleaned preview after Phase 1 (~20s), then the styled result after Phase 3. Users see progress rather than a blank wait screen.

### 4.2 Cost Per Generated Image

| Cost Component | MVP Stack | Full Stack |
|---|---|---|
| Depth Anything v2 + SAM2 | ~€0.008 | ~€0.008 |
| GroundingDINO (entrance + clutter) | — | ~€0.004 |
| Cleanup inpaint pass | — | ~€0.035 |
| GPT-4o layout planning | — | ~€0.018 |
| Flux 1.1 Pro generation (fal.ai) | ~€0.060 | ~€0.060 |
| IC-Light relighting pass | — | ~€0.025 |
| Real-ESRGAN tiled upscale | ~€0.012 | ~€0.018 |
| Post-processing | ~€0.003 | ~€0.005 |
| **Total COGS (managed API)** | **~€0.083** | **~€0.173** |
| **Total COGS (self-hosted A100)** | **~€0.007** | **~€0.028** |

---

## 5. Pricing Model

### 5.1 Full Product Package

| Product | Price | Generations | Quality | Notes |
|---|---|---|---|---|
| **Free** | €0 | 3 lifetime | MVP | No card required. Acquisition driver. Costs ~€0.25/user. |
| **Starter Monthly** | €12/mo | 40/mo | MVP | Casual homeowner planning one project |
| **Starter Annual** | €99/yr | 40/mo | MVP | ~31% saving vs monthly |
| **Designer Monthly** | €34/mo | 80/mo | Full | Active renovation; professional quality |
| **Designer Annual** | €279/yr | 80/mo | Full | ~32% saving vs monthly |
| **Casual Pack** | €9 | 20 credits | Full | 6-month expiry. One-off project use. |
| **Project Pack** | €19 | 50 credits | Full | 12-month expiry. Active planning phase. |

### 5.2 Margin Analysis

| Tier | Revenue/gen | COGS/gen | Gross Margin |
|---|---|---|---|
| Starter monthly | €0.30 | €0.083 (MVP) | ~72% |
| Designer monthly | €0.43 | €0.173 (Full) | ~60% |
| Casual pack | €0.45 | €0.173 | ~62% |
| Project pack | €0.38 | €0.173 | ~54% |

All margins shown before Stripe fees (~2.9% + €0.25/transaction) and Hetzner hosting.

### 5.3 Pricing Rationale

- **Free tier (3 generations)** — costs ~€0.25 per trial user total. Worth it for every tool in this category. Do not skip.
- **Starter at €12** — impulse-buy territory. No mental friction. Clear value for someone with one seasonal project.
- **Designer at €34** — corrected from an initial €29 analysis. At €29 with full stack COGS, gross margin falls to ~28% before Stripe and hosting. €34 brings margin to a sustainable ~60%.
- **Annual plans** — primary cashflow lever at early stage. 12 months upfront against ~€2/mo COGS per user is highly capital-efficient.
- **Credit packs run full stack only** — no reason to offer reduced quality to paying one-time users. Better output improves conversion and word-of-mouth.
- **No per-generation overage billing** — psychologically damaging for creative tools. Users self-censor generation when afraid of surprise charges. Upsell to packs instead.

### 5.4 Launch Recommendation

**Launch with three SKUs only:**
1. Free (3 generations, MVP)
2. Starter Monthly (€12, 40 gen, MVP)
3. Project Pack (€19, 50 credits, Full)

Add annual plans and Designer tier after first 50 paying users confirm retention. Three SKUs is enough to validate willingness-to-pay and quality bar. Complexity can come later.

---

## 6. Style System

Each style option is a configuration bundle, not just a label:

```json
{
  "style": "mediterranean",
  "ip_adapter_reference": "refs/mediterranean_patio_01.jpg",
  "positive_prompt": "mediterranean patio, terracotta tiles, whitewashed walls, wrought iron furniture, olive trees, warm evening light, photorealistic, 8k",
  "negative_prompt": "cartoon, illustration, deformed geometry, floating objects, plastic furniture, symmetrical layout, overcrowded, catalog photo, showroom arrangement, uniform spacing",
  "lora_weights": ["mediterranean-outdoor-v2.safetensors"],
  "depth_controlnet_strength": 0.85,
  "canny_controlnet_strength": 0.45,
  "denoise_strength": 0.75,
  "llm_design_brief": "Natural materials: stone, terracotta, wrought iron, linen. Shade-first layout. Layered planting with olive, lavender, bougainvillea. Organic asymmetric furniture arrangement. Warm evening light character. Leave generous negative space between zones."
}
```

IP-Adapter reference images must be **real photography**, not renders or mood boards. Behance/Pinterest render aesthetics bleed through into output and reduce photorealism.

**Planned style options (v2 launch):** Mediterranean, Scandinavian, Japanese Zen, Modern Minimalist, Rustic/Farmhouse, Tropical, Industrial, Boho/Eclectic, Classic English Garden, Contemporary Luxury.

---

## 7. MVP vs Full Stack Summary

| Capability | MVP Stack | Full Stack |
|---|---|---|
| Depth + ControlNet conditioning | ✅ | ✅ |
| SAM2 segmentation + inpaint masking | ✅ | ✅ |
| Flux 1.1 Pro generation | ✅ | ✅ |
| IP-Adapter style reference | ✅ | ✅ |
| Real-ESRGAN tiled upscale | ✅ | ✅ |
| GroundingDINO entrance detection | ❌ | ✅ |
| Pre-generation cleanup pass | ❌ | ✅ |
| LLM spatial layout planning | ❌ | ✅ |
| Style LoRAs | ❌ | ✅ |
| Pergola layer compositing | ❌ | ✅ |
| IC-Light relighting | ❌ | ✅ |
| DoF matching + film grain post | ❌ | ✅ |
| **COGS/image** | **~€0.08** | **~€0.17** |
| **Total inference time** | **~25–45s** | **~70–120s** |
| **Output quality** | Good | Photographic |

---

*PourCanvas v2 Scope — internal reference document*
