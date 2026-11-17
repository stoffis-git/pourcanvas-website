#!/usr/bin/env python3
"""
Premium Concrete Image Generator
Generates photorealistic poured-concrete-at-home images via Imagen 4 Ultra.

One shot type: low ground-level camera looking across a poured concrete surface
toward a modest residential home. Concrete fills ~50% of frame, home fills the rest.

Usage:
    python generate_premium_slabs.py              # plan 10 images, confirm, generate
    python generate_premium_slabs.py --dry-run    # plan only, no API calls
    python generate_premium_slabs.py --yes        # skip confirmation prompt
    python generate_premium_slabs.py --count 5   # generate N images (default 10)

Env vars (from image-gen/.env):
    GOOGLE_API_KEY
    CF_API_TOKEN
    R2_BUCKET
    R2_PUBLIC_BASE_URL
"""

import csv
import json
import os
import random
import shutil
import sys
import time
import urllib.request
from datetime import date
from io import BytesIO
from pathlib import Path

# ── Load .env ─────────────────────────────────────────────────────────────────

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

CSV_PATH    = Path(__file__).parent / "premium-slab-tracker.csv"
OUTPUT_DIR  = Path(__file__).parent / "generated_images"

IMAGE_MODEL   = "imagen-4.0-ultra-generate-001"
CALL_DELAY    = 4
DEFAULT_COUNT = 10

CF_ACCOUNT_ID  = "83bd2d9d5cf3eb3e2f22b511e4f6eb39"
R2_BUCKET      = os.environ.get("R2_BUCKET", "")
R2_PUBLIC_BASE = os.environ.get("R2_PUBLIC_BASE_URL", "")

CSV_FIELDNAMES = [
    "id", "filename",
    "concrete_tone", "concrete_finish", "setting", "camera", "home_style", "greenery", "light",
    "final_prompt", "r2_url",
    "generated_date", "status", "notes",
]

# ── Variance pools ────────────────────────────────────────────────────────────

# 3 tones × 3 finishes = 9 surface combos
_CONCRETE = [
    # (tone_label, tone_desc, finish_label, finish_desc)
    ("light-grey",   "light grey",  "broom",    "broom finish, uniform parallel texture lines across the surface"),
    ("light-grey",   "light grey",  "raw",      "smooth raw trowel finish, faint aggregate variation in the surface"),
    ("light-grey",   "light grey",  "polished", "lightly polished, subtle low sheen, surface reads as clean and precise"),
    ("charcoal",     "charcoal",    "broom",    "broom finish, texture lines clearly visible across the dark surface"),
    ("charcoal",     "charcoal",    "raw",      "smooth raw pour, slight surface variation, dark and matte"),
    ("charcoal",     "charcoal",    "polished", "lightly polished charcoal surface, low sheen, control joints sharp"),
    ("near-black",   "near-black",  "broom",    "broom finish, deep near-black surface with subtle texture lines"),
    ("near-black",   "near-black",  "raw",      "smooth near-black raw pour, troweled matte finish"),
    ("near-black",   "near-black",  "polished", "lightly polished near-black concrete, slight sheen, expansion joints clean"),
]

# 5 outdoor settings — each is (setting_label, setting_desc)
_SETTINGS = [
    ("driveway",      "wide driveway leading to a single-car garage"),
    ("driveway",      "double-width driveway approaching a two-car garage"),
    ("patio",         "backyard patio extending from the rear of the house"),
    ("patio",         "front courtyard patio beside the entry"),
    ("front-path",    "entry path from the street to the front door"),
    ("side-entry",    "side-yard path leading to a covered back entrance"),
    ("entry-porch",   "covered front porch with one step down to the path"),
    ("front-stoop",   "open front stoop with low concrete steps to the yard"),
]

# 8 home styles — modern and minimalist bungalows only
_HOMES = [
    "single-storey white rendered bungalow with dark window frames",
    "low-profile single-storey home with dark painted timber board cladding",
    "single-storey white render home with a flat roof, floor-to-ceiling glazing, and a deep roof overhang",
    "minimalist single-storey home, board-formed concrete facade, recessed entry, flat roof",
    "low-profile bungalow with white render walls, black steel window frames, and a cantilevered flat roof",
    "single-storey flat-roof home with concrete-and-timber facade",
    "dark grey fibre cement bungalow, black window frames and a carport",
    "single-storey dark Corten steel and render home, clean rectangular form, no ornamentation",
]

# 6 greenery descriptions — always included, varies the landscaping feel
_GREENERY = [
    "lush green lawn on both sides, mature deciduous trees in the background",
    "clipped box hedges bordering the path, a large tree overhanging the frame",
    "mixed cottage garden beds with flowering perennials at the edges, green lawn beyond",
    "tall established trees casting dappled shade across the ground, tidy low planting",
    "native grasses and low shrubs along the sides, open blue sky above",
    "overgrown cottage verge with wildflowers at the edges, old street trees behind",
]

# 6 lighting conditions — 5 daytime variants, 1 golden hour (~17% chance)
_LIGHT = [
    "bright sunny midday, high sun, hard crisp shadows, vivid contrast",
    "bright sunny afternoon, crisp hard shadows falling across the concrete",
    "mid-morning sun with soft tree-canopy shadows dappled on the surface",
    "late afternoon sun, long diagonal shadows stretching across the concrete",
    "clear blue-sky morning, even direct sun with no cloud cover",
    "golden hour, warm low side light raking across the concrete surface",
]

# Optional props — vary by setting type, blanks mean no prop
_DRIVEWAY_PROPS = [
    "a silver Honda CR-V parked in the driveway, rear 3/4 angle toward the garage",
    "a dark grey Toyota RAV4 parked in the driveway, front 3/4 angle",
    "a white sedan parked in the driveway near the garage door",
    "",
    "",
    "",
]

_PATIO_PROPS = [
    "a small bistro table with two chairs sitting on the patio",
    "a four-seat outdoor dining set on the patio, chairs tucked in",
    "a pair of lounge chairs with a low side table on the patio",
    "",
    "",
    "",
]

# 3 camera setups — vary height and horizontal angle
_CAMERA = [
    # A — low + straight-on
    (
        "camera",
        "Camera at 0.6m height, straight-on perpendicular to the building. "
        "Surface fills the lower half of frame, building facade dead ahead.",
    ),
    # B — low + oblique
    (
        "camera-oblique",
        "Camera at 0.5m height, angled 35–40° off-axis to the building. "
        "Strong diagonal perspective lines receding toward the building corner.",
    ),
    # C — eye-level + 3/4
    (
        "camera-3q",
        "Camera at standing eye-level (1.6m), 3/4 angle toward the building. "
        "Building occupies the upper half of frame; concrete ground plane recedes in perspective.",
    ),
]


# ── Prompt building ───────────────────────────────────────────────────────────

_PLATE_FORMATS = {"Texas": "LLL-DDDD", "New York": "LLL-DDDD", "Virginia": "LLL-DDDD", "California": "DLLLDDD", "Illinois": "LL DDDDD", "Washington": "LLLDDDD"}


def random_plate():
    state = random.choice(list(_PLATE_FORMATS))
    letters = "ABCDEFGHJKLMNPRSTUVWXYZ"
    return state, "".join(random.choice(letters) if c == "L" else str(random.randint(0, 9)) if c == "D" else c for c in _PLATE_FORMATS[state])


def build_prompt(camera_desc, tone_desc, finish_desc, setting_desc, home, greenery, light, prop):
    prop_clause = f" {prop}." if prop else ""
    if "parked" in prop:  # user decision 2026-11-16: realistic, legible plates
        state, plate = random_plate()
        prop_clause += f" The car carries a realistic {state} license plate reading \"{plate}\", crisp and legible."
    return (
        f"{camera_desc} "
        f"{tone_desc.capitalize()} poured concrete {setting_desc}, "
        f"{home} visible ahead. {greenery.capitalize()}. {light.capitalize()}.{prop_clause} "
        f"The surface is a raw cast-in-place concrete pour — {finish_desc} — "
        f"control joints and expansion joints visible. Not tiles, not pavers, not slabs. "
        f"Portrait 3:4. Photorealistic photograph. No people, no text."
    )


# ── CSV helpers ───────────────────────────────────────────────────────────────

def load_csv():
    if not CSV_PATH.exists():
        return []
    with open(CSV_PATH, newline="", encoding="utf-8") as f:
        return list(csv.DictReader(f))


def save_csv(rows):
    """Atomic write: temp file → rename. A crash never truncates the CSV."""
    tmp = CSV_PATH.with_suffix(".tmp")
    with open(tmp, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=CSV_FIELDNAMES, extrasaction="ignore")
        w.writeheader()
        w.writerows(rows)
    shutil.move(str(tmp), str(CSV_PATH))


# ── Filename sequencing (disk-based, CSV-independent) ─────────────────────────

def next_sequence_number() -> int:
    existing = sorted(OUTPUT_DIR.glob("premium-slab-[0-9]*.jpg"))
    if not existing:
        return 1
    try:
        return int(existing[-1].stem.split("-")[-1]) + 1
    except ValueError:
        return len(existing) + 1


# ── R2 upload ─────────────────────────────────────────────────────────────────

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


# ── Batch planning ────────────────────────────────────────────────────────────

def plan_row(seq: int) -> dict:
    tone_label, tone_desc, finish_label, finish_desc = random.choice(_CONCRETE)
    setting_label, setting_desc                      = random.choice(_SETTINGS)
    camera_label, camera_desc                        = random.choice(_CAMERA)
    home                                             = random.choice(_HOMES)
    greenery                                         = random.choice(_GREENERY)
    light                                            = random.choice(_LIGHT)

    # Props: only for driveway and patio settings
    prop = ""
    if "driveway" in setting_label:
        prop = random.choice(_DRIVEWAY_PROPS)
    elif "patio" in setting_label:
        prop = random.choice(_PATIO_PROPS)

    final_prompt = build_prompt(camera_desc, tone_desc, finish_desc, setting_desc, home, greenery, light, prop)

    return {
        "id":             f"pslab-{seq:03d}",
        "filename":       f"premium-slab-{seq:03d}.jpg",
        "concrete_tone":  tone_label,
        "concrete_finish": finish_label,
        "setting":        setting_label,
        "camera":         camera_label,
        "home_style":     home[:60],
        "greenery":       greenery[:60],
        "light":          light[:60],
        "final_prompt":   final_prompt,
        "r2_url":         "",
        "generated_date": "",
        "status":         "pending",
        "notes":          "",
    }


def make_batch(count: int) -> list:
    start = next_sequence_number()
    return [plan_row(start + i) for i in range(count)]


def print_batch(batch: list):
    print(f"\n{'─'*72}")
    print(f"  Planned batch: {len(batch)} images  (next: {batch[0]['id']})")
    print(f"{'─'*72}")
    for i, row in enumerate(batch, 1):
        surface = f"{row['concrete_tone']} / {row['concrete_finish']}"
        print(f"  {i:2}. [{surface:<22}] {row['setting']:<14} {row['light'][:45]}")
        print(f"       → {row['final_prompt'][:90]}…")
    print(f"{'─'*72}\n")


# ── Image generation ──────────────────────────────────────────────────────────

def generate_image(client, row: dict) -> bytes | None:
    prompt = row["final_prompt"]
    print(f"  Prompt ({len(prompt.split())}w): {prompt[:110]}...")
    response = client.models.generate_images(
        model=IMAGE_MODEL,
        prompt=prompt,
        config=types.GenerateImagesConfig(
            number_of_images=1,
            aspect_ratio="3:4",
        ),
    )
    if response.generated_images:
        return response.generated_images[0].image.image_bytes
    return None


# ── Process single row ────────────────────────────────────────────────────────

def process_row(client, row: dict, label: str):
    filename = row["filename"]
    img_path = OUTPUT_DIR / filename
    print(f"\n{label} {row['id']} — {row['concrete_tone']}/{row['concrete_finish']} {row['setting']}")

    try:
        img_bytes = generate_image(client, row)
    except Exception as e:
        print(f"  ERROR (generate): {e}")
        row["status"] = "error"
        row["notes"]  = str(e)[:120]
        save_csv(load_csv() + [row])
        return False

    if not img_bytes:
        print("  ERROR: no image bytes returned")
        row["status"] = "error"
        row["notes"]  = "no image bytes"
        save_csv(load_csv() + [row])
        return False

    try:
        img = PIL.Image.open(BytesIO(img_bytes))
        img.save(img_path, format="JPEG", quality=92)
        print(f"  Saved: {filename} ({img.size[0]}×{img.size[1]}px, {img_path.stat().st_size:,} bytes)")
    except Exception as e:
        print(f"  ERROR (save): {e}")
        row["status"] = "error"
        row["notes"]  = str(e)[:120]
        save_csv(load_csv() + [row])
        return False

    try:
        r2_url = upload_to_r2(img_path, filename)
        print(f"  R2: {r2_url}")
        row["r2_url"]         = r2_url
        row["generated_date"] = date.today().isoformat()
        row["status"]         = "completed"
    except Exception as e:
        print(f"  ERROR (R2): {e}")
        row["status"] = "pending"
        row["notes"]  = str(e)[:120]
        save_csv(load_csv() + [row])
        return False

    save_csv(load_csv() + [row])
    return True


# ── Main ──────────────────────────────────────────────────────────────────────

def main():
    dry_run  = "--dry-run" in sys.argv
    auto_yes = "--yes" in sys.argv or "-y" in sys.argv

    count = DEFAULT_COUNT
    if "--count" in sys.argv:
        idx = sys.argv.index("--count")
        try:
            count = int(sys.argv[idx + 1])
        except (IndexError, ValueError):
            print("ERROR: --count requires an integer, e.g. --count 5")
            sys.exit(1)

    if not dry_run:
        missing = [v for v in ("GOOGLE_API_KEY", "CF_API_TOKEN", "R2_BUCKET", "R2_PUBLIC_BASE_URL")
                   if not os.environ.get(v)]
        if missing:
            print(f"ERROR: Missing env vars: {', '.join(missing)}")
            sys.exit(1)

    OUTPUT_DIR.mkdir(exist_ok=True)
    existing_rows = load_csv()

    print(f"\nPremium Concrete Generator")
    print(f"CSV: {CSV_PATH.name} ({len(existing_rows)} existing rows)")
    print(f"Next sequence from disk: pslab-{next_sequence_number():03d}")
    print(f"This run: {count} images")

    while True:
        batch = make_batch(count)
        print_batch(batch)

        if dry_run:
            print("Dry run — no images generated.")
            return

        if auto_yes:
            print("Auto-confirming (--yes).")
            break

        choice = input("Generate? [y / n to re-plan / q to quit]: ").strip().lower()
        if choice == "y":
            break
        elif choice == "n":
            print("\nRe-rolling batch…\n")
            continue
        elif choice == "q":
            print("Exiting.")
            return
        else:
            print("Enter y, n, or q.")

    client = genai.Client(api_key=os.environ["GOOGLE_API_KEY"])

    completed = 0
    errors    = 0
    for i, row in enumerate(batch):
        ok = process_row(client, row, label=f"[{i+1}/{count}]")
        if ok:
            completed += 1
        else:
            errors += 1
        if i < len(batch) - 1:
            time.sleep(CALL_DELAY)

    print(f"\n{'─'*72}")
    print(f"  Done: {completed} completed, {errors} errors")
    print(f"  CSV: {CSV_PATH}")
    if completed:
        print(f"\n  Generated:")
        for row in batch:
            if row["status"] == "completed":
                print(f"    {row['r2_url']}")
    print(f"{'─'*72}\n")

    # Auto-seed new images into master-pin-tracker.csv and inspiration/index.ts
    if completed:
        import subprocess
        seed_script = Path(__file__).parent / "seed_premium_pins.py"
        subprocess.run([sys.executable, str(seed_script)], check=False)


if __name__ == "__main__":
    main()
