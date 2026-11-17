#!/usr/bin/env python3
"""
PourCanvas OG Image Generator
Generates inspiration/article page OG images via Imagen 4 Ultra, uploads to Cloudflare R2.

Pipeline:
  1. For each pending CSV row, call Gemini Flash with IMAGEN_STYLE_GUIDE.md +
     randomised variation params + the row's ai_prompt → get a tight, tailored
     Imagen prompt (well under the 480-token limit).
  2. Pass that prompt to Imagen 4 Ultra → generate image.
  3. Upload to Cloudflare R2 → update CSV.

Env vars required:
    GOOGLE_API_KEY
    CF_API_TOKEN
    R2_BUCKET
    R2_PUBLIC_BASE_URL

Usage:
    python generate_og_images.py          # test run (3 images, interactive approval)
    python generate_og_images.py --full   # full run (all pending rows)
"""

import csv
import json
import os
import random
import sys
import time
import urllib.request
from io import BytesIO
from pathlib import Path

# Load .env from same directory
_env_file = Path(__file__).parent / ".env"
if _env_file.exists():
    with open(_env_file) as _f:
        for _line in _f:
            _line = _line.strip()
            if _line and not _line.startswith("#") and "=" in _line:
                _k, _, _v = _line.partition("=")
                os.environ.setdefault(_k.strip(), _v.strip())

import PIL.Image
from google import genai
from google.genai import types

# ── Config ────────────────────────────────────────────────────────────────────

CSV_PATH        = Path(__file__).parent / "master-pin-tracker.csv"
OUTPUT_DIR      = Path(__file__).parent / "generated_images"
STYLE_GUIDE     = (Path(__file__).parent / "IMAGEN_STYLE_GUIDE.md").read_text()

IMAGE_MODEL     = "imagen-4.0-ultra-generate-001"
GEMINI_MODEL    = "gemini-2.5-flash"
CALL_DELAY      = 4  # seconds between Imagen API calls

CF_ACCOUNT_ID   = "83bd2d9d5cf3eb3e2f22b511e4f6eb39"
R2_BUCKET       = os.environ.get("R2_BUCKET", "")
R2_PUBLIC_BASE  = os.environ.get("R2_PUBLIC_BASE_URL", "")

# Columns added to CSV on first run if absent; final_prompt = exact prompt sent to Imagen (prompt tracking)
NEW_COLUMNS = ["prompt_variation", "final_prompt"]

# 3 test slugs chosen for distinct quality soft-metrics:
#   1. stamped-concrete-driveway-cream   → architectural specificity
#   2. concrete-pool-deck-grey           → minimalist clarity
#   3. terracotta-stamped-concrete-driveway → color fidelity
TEST_SLUGS = [
    "stamped-concrete-driveway-cream",
    "concrete-pool-deck-grey",
    "terracotta-stamped-concrete-driveway",
]

# ── Variation parameter pools ─────────────────────────────────────────────────
# Narrow ranges — every image stays on-brand (wide establishing architectural
# shot) while the corpus avoids a templated look over time.

_CAMERA_ANGLES = [
    # establishing shots (weighted 3x — most images stay architectural)
    "straight-on eye-level establishing shot, hardscape lower half, home upper half",
    "straight-on eye-level establishing shot, hardscape lower half, home upper half",
    "straight-on eye-level establishing shot, hardscape lower half, home upper half",
    "very slight high-angle (camera at 1.5m, tilted 10 degrees down), wide establishing",
    "very slight low-angle (camera at 0.6m, tilted 5 degrees up toward the home), wide establishing",
    "three-quarter angle establishing shot, home in upper corner, surface receding diagonally",
    # close-up and texture shots
    "close-up low-angle shot, camera 0.3m from ground looking across surface, surface fills 70% of frame, home barely visible at top edge",
    "overhead shot looking straight down at surface, pattern fills entire frame, no home visible",
    # pathway / symmetrical
    "mid-range shot with path as strong leading line centered in composition, home in background",
    "perfectly symmetrical wide shot, home centered in background, driveway as central axis",
]

_FOCAL_LENGTHS = [
    "24mm equivalent",
    "28mm equivalent",
    "35mm equivalent",
    "50mm equivalent",  # tighter, compresses depth for detail shots
]

_FOREGROUND_WEIGHTS = [
    "hardscape occupies 45% of frame height",
    "hardscape occupies 50% of frame height",
    "hardscape occupies 55% of frame height",
    "hardscape occupies 70% of frame height",  # for close-up shots
    "hardscape occupies 90% of frame height",  # for detail/overhead shots
]

_DEPTH_READS = [
    "home fills top third of frame, narrow strip of sky visible above roofline",
    "home fills top half of frame, no sky visible",
    "home barely visible at top edge of frame",
    "no home visible, surface detail only",
]

# Empty strings are weighted intentionally — most images use the ai_prompt lighting.
_TIME_OVERRIDES = [
    "",
    "",
    "",
    "early morning light, cool and directional, long soft shadows",
    "bright midday, even light, no dramatic shadows",
    "golden hour, warm side light raking across surface, long shadows in joint channels",
    "post-rain, wet reflective surface, overcast ambient",
]

# Driveway-only pools — injected when ai_prompt contains "driveway" but no vehicle keyword.
_CAR_MODELS_DRIVEWAY = [
    "Toyota Corolla compact sedan",
    "Honda Accord mid-size sedan",
    "Honda CR-V crossover",
    "Toyota RAV4 SUV",
    "Ford F-150 pickup truck",
]
_GARAGE_DOORS_DRIVEWAY = [
    "traditional raised-panel garage door",
    "contemporary flush panel garage door",
    "carriage house wood-look garage door",
    "glass-panel modern garage door",
]

# Realistic US plates (states that require front plates, real formats). User decision 2026-11-16.
_PLATE_FORMATS = {"Texas": "LLL-DDDD", "New York": "LLL-DDDD", "Virginia": "LLL-DDDD", "California": "DLLLDDD", "Illinois": "LL DDDDD", "Washington": "LLLDDDD"}


def random_plate():
    state = random.choice(list(_PLATE_FORMATS))
    letters = "ABCDEFGHJKLMNPRSTUVWXYZ"
    plate = "".join(random.choice(letters) if c == "L" else str(random.randint(0, 9)) if c == "D" else c for c in _PLATE_FORMATS[state])
    return state, plate


_VEHICLE_KEYWORDS = ("sedan", "suv", "crossover", "pickup", "truck", "parked")

# ── CSV helpers ───────────────────────────────────────────────────────────────

def load_csv(path):
    with open(path, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        fieldnames = list(reader.fieldnames or [])
        rows = list(reader)
    for col in NEW_COLUMNS:
        if col not in fieldnames:
            fieldnames.append(col)
            for row in rows:
                row[col] = ""
    return rows, fieldnames


def save_csv(path, rows, fieldnames):
    with open(path, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=fieldnames)
        w.writeheader()
        w.writerows(rows)


# ── Filename derivation ───────────────────────────────────────────────────────

def make_filename(row):
    # image_filename: "/og/inspiration-stamped-concrete-driveway-cream.jpg"
    # → "inspiration-stamped-concrete-driveway-cream.jpg"
    return Path(row["image_filename"]).name


# ── Cloudflare R2 upload ──────────────────────────────────────────────────────

def upload_to_r2(img_path: Path, filename: str, max_attempts: int = 3) -> str:
    api_token = os.environ["CF_API_TOKEN"]
    url = (
        f"https://api.cloudflare.com/client/v4/accounts/{CF_ACCOUNT_ID}"
        f"/r2/buckets/{R2_BUCKET}/objects/{filename}"
    )
    data = img_path.read_bytes()
    last_err = None
    for attempt in range(1, max_attempts + 1):
        try:
            req = urllib.request.Request(
                url, data=data, method="PUT",
                headers={
                    "Authorization": f"Bearer {api_token}",
                    "Content-Type": "image/jpeg",
                },
            )
            with urllib.request.urlopen(req, timeout=30) as resp:
                body = json.loads(resp.read())
            if not body.get("success"):
                raise RuntimeError(f"CF API error: {body}")
            return f"{R2_PUBLIC_BASE.rstrip('/')}/{filename}"
        except Exception as e:
            last_err = e
            if attempt < max_attempts:
                print(f"  R2 attempt {attempt}/{max_attempts} failed: {e} — retrying in 5s...")
                time.sleep(5)
    raise last_err


# ── Prompt building (Gemini Flash + variation) ────────────────────────────────

def build_imagen_prompt(client, ai_prompt: str) -> tuple:
    """Call Gemini Flash to synthesise style guide + variation params + ai_prompt
    into a single tight Imagen 4 prompt. Returns (prompt_text, variation_label)."""
    camera   = random.choice(_CAMERA_ANGLES)
    focal    = random.choice(_FOCAL_LENGTHS)
    fg       = random.choice(_FOREGROUND_WEIGHTS)
    depth    = random.choice(_DEPTH_READS)
    time_ovr = random.choice(_TIME_OVERRIDES)

    # Compact label stored in CSV for auditing and diversity tracking
    cam_short   = "eye-lvl" if "straight" in camera else ("hi-angle" if "high" in camera else "lo-angle")
    fg_short    = fg.split("%")[0].split()[-1] + "%"
    depth_short = "sky" if "sky" in depth else "no-sky"
    time_short  = time_ovr.split(",")[0] if time_ovr else "as-prompt"
    variation_label = f"cam:{cam_short} foc:{focal} fg:{fg_short} depth:{depth_short} time:{time_short}"

    variation_block = (
        f"Camera angle: {camera}\n"
        f"Focal length: {focal}\n"
        f"Foreground weight: {fg}\n"
        f"Depth read: {depth}\n"
    )
    if time_ovr:
        variation_block += f"Time of day override: {time_ovr}\n"

    # Inject vehicle for driveway images that have no vehicle in their prompt
    prompt_lower = ai_prompt.lower()
    if "driveway" in prompt_lower and not any(kw in prompt_lower for kw in _VEHICLE_KEYWORDS):
        car  = random.choice(_CAR_MODELS_DRIVEWAY)
        door = random.choice(_GARAGE_DOORS_DRIVEWAY)
        state, plate = random_plate()
        variation_block += f"Vehicle: {car} parked in driveway, front 3/4 angle toward camera, {state} license plate reading \"{plate}\", crisp and legible\n"
        variation_block += f"Garage door: {door}\n"
        car_short  = car.split()[1][:6]  # e.g. "Accord" → "Accord"
        door_short = door.split()[0][:5]  # e.g. "contemporary" → "conte"
        variation_label += f" car:{car_short} door:{door_short}"

    meta = (
        f"{STYLE_GUIDE}\n\n"
        f"---\n"
        f"VARIATION PARAMS FOR THIS IMAGE "
        f"(apply these; override style guide defaults where they conflict):\n"
        f"{variation_block}"
        f"---\n\n"
        f"Source prompt: {ai_prompt}\n\n"
        f"Write a single Imagen 4 generation prompt incorporating the source prompt, "
        f"the style guide requirements, and the variation params above. "
        f"Output only the prompt text. Maximum 300 words. "
        f"Natural descriptive prose — no bullet points, no JSON, no headers."
    )

    response = client.models.generate_content(
        model=GEMINI_MODEL,
        contents=meta,
    )
    return response.text.strip(), variation_label


# ── Image generation ──────────────────────────────────────────────────────────

def generate_image(client, row):
    ai_prompt = row["ai_prompt"].replace(", 2:3 vertical", "").replace(" 2:3 vertical", "")
    prompt, variation_label = build_imagen_prompt(client, ai_prompt)
    print(f"  Variation: {variation_label}")
    print(f"  Prompt ({len(prompt.split())}w): {prompt[:100]}...")
    response = client.models.generate_images(
        model=IMAGE_MODEL,
        prompt=prompt,
        config=types.GenerateImagesConfig(
            number_of_images=1,
            aspect_ratio="3:4",
        ),
    )
    if response.generated_images:
        return response.generated_images[0].image.image_bytes, variation_label, prompt
    return None, variation_label, prompt


# ── Process a single row ──────────────────────────────────────────────────────

def process_row(client, row, rows, fieldnames, label):
    slug     = row["slug"]
    filename = make_filename(row)
    img_path = OUTPUT_DIR / filename

    print(f"{label} [{row['page_type']}] {slug}")

    # Image: reuse from disk if already generated
    img_bytes      = None
    variation_label = "reused"
    final_prompt    = row.get("final_prompt", "")
    if img_path.exists():
        img_bytes = img_path.read_bytes()
        print(f"  Image: reusing {filename} (on disk)")
    else:
        try:
            img_bytes, variation_label, final_prompt = generate_image(client, row)
        except Exception as e:
            print(f"  ERROR (generate): {e}")

    if img_bytes and not img_path.exists():
        try:
            img = PIL.Image.open(BytesIO(img_bytes))
            img.save(img_path, format="JPEG", quality=92)
            print(f"  Saved: {filename} ({img.size[0]}×{img.size[1]}px, {img_path.stat().st_size:,} bytes)")
        except Exception as e:
            print(f"  ERROR (save): {e}")
            img_bytes = None

    # R2 upload
    r2_url = None
    if img_bytes:
        try:
            r2_url = upload_to_r2(img_path, filename)
            print(f"  R2: {r2_url}")
        except Exception as e:
            print(f"  ERROR (R2 upload): {e}")

    # Update CSV row
    if img_bytes and r2_url:
        row["image_generated"]  = "completed"
        row["r2_url"]           = r2_url
        row["prompt_variation"] = variation_label
        row["final_prompt"]     = final_prompt
    elif img_bytes and not r2_url:
        row["image_generated"]  = "pending"  # retries upload next run
        row["prompt_variation"] = variation_label
        row["final_prompt"]     = final_prompt
    else:
        row["image_generated"]  = "error"

    save_csv(CSV_PATH, rows, fieldnames)
    return r2_url is not None


# ── Test run ──────────────────────────────────────────────────────────────────

def run_test(client, rows, fieldnames):
    slug_to_row = {r["slug"]: r for r in rows}
    test_rows = []
    for slug in TEST_SLUGS:
        if slug not in slug_to_row:
            print(f"WARNING: test slug '{slug}' not found in CSV — skipping")
            continue
        test_rows.append(slug_to_row[slug])

    if not test_rows:
        print("ERROR: No test rows found.")
        return False

    print(f"\n── Test run: {len(test_rows)} images ──────────────────────────────")
    for i, row in enumerate(test_rows):
        process_row(client, row, rows, fieldnames, label=f"[{i+1}/{len(test_rows)}]")
        if i < len(test_rows) - 1:
            time.sleep(CALL_DELAY)

    print("\n── Test images generated ─────────────────────────────────────────")
    print("Quality metrics tested:")
    print("  1. Architectural specificity  — stamped-concrete-driveway-cream")
    print("  2. Minimalist clarity         — concrete-pool-deck-grey")
    print("  3. Color fidelity             — terracotta-stamped-concrete-driveway")
    print()
    for slug in TEST_SLUGS:
        r = slug_to_row.get(slug)
        if r and r.get("r2_url"):
            print(f"  {slug}:")
            print(f"    {r['r2_url']}")
    print()
    return True


# ── Full run ──────────────────────────────────────────────────────────────────

def run_full(client, rows, fieldnames, max_images=21):
    pending = [r for r in rows if r.get("image_generated", "").strip() not in ("completed", "n/a")]
    print(f"\n── Full run: {len(pending)} pending rows ──────────────────────────")

    if not pending:
        print("All rows already completed. Nothing to do.")
        return

    completed = 0
    errors = 0
    generated_this_run = 0
    for i, row in enumerate(pending):
        ok = process_row(client, row, rows, fieldnames, label=f"[{i+1}/{len(pending)}]")
        if ok:
            completed += 1
            generated_this_run += 1
            if generated_this_run >= max_images:
                print(f"\n── Daily cap reached ({generated_this_run}/{max_images}) ─────────────────────────────────")
                print(f"Stopped after {generated_this_run} successful generations. Re-run tomorrow for remaining rows.")
                break
        else:
            errors += 1
        if i < len(pending) - 1:
            time.sleep(CALL_DELAY)

    total_done = sum(1 for r in rows if r.get("image_generated") == "completed")
    total_err  = sum(1 for r in rows if r.get("image_generated") == "error")
    total_left = sum(1 for r in rows if r.get("image_generated") not in ("completed", "error", "n/a"))

    print(f"\n── Summary ───────────────────────────────────────────────────────")
    print(f"This run:  {completed} completed, {errors} errors")
    print(f"Overall:   {total_done} completed, {total_err} errors, {total_left} remaining")
    if total_left == 0 and total_err == 0:
        print("All rows complete!")


# ── Interactive approval loop ─────────────────────────────────────────────────

def interactive_loop(client, rows, fieldnames):
    while True:
        ok = run_test(client, rows, fieldnames)
        if not ok:
            sys.exit(1)

        print("Options:")
        print("  [p] Proceed to full run")
        print("  [r] Re-run test (re-generates test images with new variations)")
        print("  [s] Edit style guide, then re-run test  (opens image-gen/IMAGEN_STYLE_GUIDE.md)")
        print("  [q] Quit (test images kept)")
        print()
        choice = input("Your choice: ").strip().lower()

        if choice == "p":
            run_full(client, rows, fieldnames)
            break
        elif choice == "r":
            # Re-mark test rows as pending so they regenerate
            slug_to_row = {r["slug"]: r for r in rows}
            for slug in TEST_SLUGS:
                r = slug_to_row.get(slug)
                if r:
                    r["image_generated"] = "pending"
                    r["r2_url"] = ""
                    img_path = OUTPUT_DIR / make_filename(r)
                    if img_path.exists():
                        img_path.unlink()
            save_csv(CSV_PATH, rows, fieldnames)
            print()
        elif choice == "s":
            print()
            print(f"Edit: {Path(__file__).parent / 'IMAGEN_STYLE_GUIDE.md'}")
            print("Save the file, then press Enter to re-run test.")
            input()
            # Reload style guide from disk
            global STYLE_GUIDE
            STYLE_GUIDE = (Path(__file__).parent / "IMAGEN_STYLE_GUIDE.md").read_text()
            # Re-mark test rows as pending
            slug_to_row = {r["slug"]: r for r in rows}
            for slug in TEST_SLUGS:
                r = slug_to_row.get(slug)
                if r:
                    r["image_generated"] = "pending"
                    r["r2_url"] = ""
                    img_path = OUTPUT_DIR / make_filename(r)
                    if img_path.exists():
                        img_path.unlink()
            save_csv(CSV_PATH, rows, fieldnames)
            print()
        elif choice == "q":
            print("Exiting. Test images have been saved and uploaded.")
            break
        else:
            print("Invalid choice. Enter p, r, s, or q.")


# ── Main ──────────────────────────────────────────────────────────────────────

def run_sync():
    import importlib.util
    sync_path = Path(__file__).parent / "sync_r2_to_content.py"
    spec = importlib.util.spec_from_file_location("sync_r2_to_content", sync_path)
    mod  = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    print("\n── Syncing R2 URLs → content files ──────────────────────────────")
    mod.sync()


def main():
    full_mode = "--full" in sys.argv
    sync_mode = "--sync" in sys.argv

    max_images = 21
    if "--max" in sys.argv:
        idx = sys.argv.index("--max")
        if idx + 1 < len(sys.argv):
            try:
                max_images = int(sys.argv[idx + 1])
            except ValueError:
                print("ERROR: --max requires an integer argument")
                sys.exit(1)

    # Env checks
    missing = [v for v in ("GOOGLE_API_KEY", "CF_API_TOKEN", "R2_BUCKET", "R2_PUBLIC_BASE_URL")
               if not os.environ.get(v)]
    if missing:
        print(f"ERROR: Missing env vars: {', '.join(missing)}")
        print("Copy image-gen/.env.example to image-gen/.env and fill in values.")
        sys.exit(1)

    if not CSV_PATH.exists():
        print(f"ERROR: CSV not found at {CSV_PATH}")
        sys.exit(1)

    if sync_mode and not full_mode:
        run_sync()
        return

    OUTPUT_DIR.mkdir(exist_ok=True)
    rows, fieldnames = load_csv(CSV_PATH)
    client = genai.Client(api_key=os.environ["GOOGLE_API_KEY"])

    total     = len(rows)
    completed = sum(1 for r in rows if r.get("image_generated") == "completed")
    pending   = sum(1 for r in rows if r.get("image_generated", "") not in ("completed", "n/a"))
    print(f"CSV: {total} total | {completed} completed | {pending} pending")
    print(f"R2 bucket: {os.environ['R2_BUCKET']}")
    print(f"Models: {IMAGE_MODEL} (image) + {GEMINI_MODEL} (prompt builder)\n")

    if full_mode:
        run_full(client, rows, fieldnames, max_images=max_images)
        run_sync()
    else:
        interactive_loop(client, rows, fieldnames)


if __name__ == "__main__":
    main()
