#!/usr/bin/env python3
"""ChatGPT backend for the PourCanvas image pipeline.

Same tracking and prompt building as generate_og_images.py, but the image is made in the ChatGPT web UI
(one fresh chat per image, via a headless Claude-in-Chrome session) instead of Imagen:
  - rows live in master-pin-tracker.csv (generator=chatgpt)
  - final prompt = Gemini Flash + IMAGEN_STYLE_GUIDE.md + random variation params (build_imagen_prompt)
  - every sent prompt is stored in final_prompt, the chat in chat_url

Usage (venv: image-gen/.venv):
  python chatgpt_images.py prompts <image_filename>...   build + store final prompts, write payload.js
  python chatgpt_images.py payload <image_filename>...   payload.js from stored final prompts (retries, no Gemini call)
  python chatgpt_images.py take <image_filename> <chat_url> [variant]   ~/Downloads/<stem>-<n>.png -> JPEG, tag, R2, CSV
Browser side: image-gen/chatgpt/start.js + collect.js (localStorage pc_subjects, keyed by filename stem).
"""
import json
import os
import re
import subprocess
import sys
from pathlib import Path

import generate_og_images as og
from google import genai

HERE = Path(__file__).parent
PAYLOAD = HERE / "chatgpt" / "payload.js"
LANDSCAPE = "Landscape 3:2 orientation (section/material/detail image; overrides the portrait default)."
PORTRAIT = "Portrait 3:4 orientation (hero image; never landscape)."
KEEP = ("Everything named in this source prompt (home, vehicle, license plate, surface details) must stay in frame; "
        "ignore any variation param that would remove it. The license plate is the only text allowed in the image; "
        "its plate number and the state name in its header are spelled exactly and correctly. "
        "Any vehicle is parked properly: all four wheels fully on the driveway surface with clear hardscape on all sides, "
        "never a wheel on lawn, gravel, pebbles, mulch or a planting bed, and parked straight in line with the driveway, "
        "never diagonal or skewed (user decision 2026-11-19).")
# section/alt_text/caption/target_query/replaces: image-SEO wiring data per row (2026-11-19)
COLUMNS = ["prompt_variation", "final_prompt", "generator", "chat_url",
           "section", "alt_text", "caption", "target_query", "replaces"]
# 3:2 landscape: article section images, material page images (16:9 hero + 4:3 gallery), inspiration detail shots
LANDSCAPE_TYPES = ("article-section", "material", "inspiration-detail")


def load():
    rows, fields = og.load_csv(og.CSV_PATH)
    for c in COLUMNS:
        if c not in fields:
            fields.append(c)
            for r in rows:
                r.setdefault(c, "")
    return rows, fields


def find(rows, filename):
    hits = [r for r in rows if r["image_filename"] == filename]
    if len(hits) != 1:
        raise SystemExit(f"{filename}: {len(hits)} rows in master-pin-tracker.csv")
    return hits[0]


def landscape(r):
    return r["page_type"] in LANDSCAPE_TYPES


def build(client, src):
    """build_imagen_prompt with pools narrowed to the subject: close-up/overhead subjects only draw close-up params,
    scene subjects (a home or vehicle in frame) only establishing-type params, dry subjects never get post-rain."""
    low = src.lower()
    closeup = any(w in low for w in og._CLOSEUP_KEYWORDS)
    scene = not closeup and any(w in low for w in ("home", "house", "parked"))
    pools = {k: list(getattr(og, k)) for k in ("_CAMERA_ANGLES", "_FOREGROUND_WEIGHTS", "_DEPTH_READS", "_TIME_OVERRIDES")}
    if "dry" in low:
        og._TIME_OVERRIDES = [t for t in pools["_TIME_OVERRIDES"] if "rain" not in t]
    if closeup:
        top = any(w in low for w in ("overhead", "top-down", "straight down"))
        og._CAMERA_ANGLES = [c for c in pools["_CAMERA_ANGLES"] if ("overhead" in c) == top and ("close-up" in c or "overhead" in c)]
        og._FOREGROUND_WEIGHTS = [f for f in pools["_FOREGROUND_WEIGHTS"] if f.split("%")[0].endswith(("70", "90"))]
        og._DEPTH_READS = [d for d in pools["_DEPTH_READS"] if "no home" in d or ("barely" in d and not top)]
    elif scene:
        og._CAMERA_ANGLES = [c for c in pools["_CAMERA_ANGLES"] if "close-up" not in c and "overhead" not in c]
        if "license plate" in low:  # straight parking: the 3/4 view must come from an off-axis camera (2026-11-19)
            og._CAMERA_ANGLES = [c for c in og._CAMERA_ANGLES if "three-quarter" in c]
        og._FOREGROUND_WEIGHTS = [f for f in pools["_FOREGROUND_WEIGHTS"] if not f.split("%")[0].endswith(("70", "90"))]
        og._DEPTH_READS = [d for d in pools["_DEPTH_READS"] if "no home" not in d and "barely" not in d]
    try:
        return og.build_imagen_prompt(client, src)
    finally:
        for k, v in pools.items():
            setattr(og, k, v)


PLATE_RE = re.compile(r'(Texas|Washington|California|Virginia|New York|Illinois) license plate reading \\?"([A-Z0-9 -]+)\\?"')


def camera_line(ai_prompt):
    """Off-axis camera sentence from the ai_prompt, appended after Gemini so it can't be dropped (2026-11-19)."""
    m = re.search(r"the camera stands [^.;]*", ai_prompt, re.I)
    return f"\nCamera: {m.group(0)}; the car itself stays parked straight." if m else ""


def plate_line(ai_prompt):
    """Exact plate text appended after Gemini, so the state name and characters survive the rewrite (2026-11-19)."""
    m = PLATE_RE.search(ai_prompt)
    return (f"\nLicense plate: a real {m.group(1)} plate reading exactly \"{m.group(2)}\", with the state name "
            f"\"{m.group(1)}\" spelled correctly in its header; every character crisp and legible. The car stands with all "
            f"four wheels fully on the driveway surface, clear hardscape on all sides. The car is parked straight, its long axis "
            f"parallel to the driveway and square to the garage door, never diagonal or skewed; the 3/4 view comes from the "
            f"camera position, not from rotating the car.") if m else ""


def cmd_prompts(filenames):
    rows, fields = load()
    client = genai.Client(api_key=os.environ["GOOGLE_API_KEY"])
    subjects = {}
    for fn in filenames:
        r = find(rows, fn)
        src = r["ai_prompt"] + f" {LANDSCAPE if landscape(r) else PORTRAIT} {KEEP}"
        prompt, label = build(client, src)
        tail = "\nAspect ratio: 3:2 landscape." if landscape(r) else "\nAspect ratio: 3:4 portrait."
        r.update(final_prompt=prompt + camera_line(r["ai_prompt"]) + plate_line(r["ai_prompt"]) + tail, prompt_variation=label, generator="chatgpt", image_generated="pending")
        subjects[Path(fn).stem] = r["final_prompt"]
        print(f"{fn}: {label}")
    og.save_csv(og.CSV_PATH, rows, fields)
    write_payload(subjects)


def write_payload(subjects):
    PAYLOAD.write_text(
        f"localStorage.pc_style='';localStorage.pc_subjects={json.dumps(json.dumps(subjects))};"
        "Object.keys(JSON.parse(localStorage.pc_subjects)).length"
    )
    print(f"payload: {PAYLOAD} ({len(subjects)} subjects)")


def cmd_payload(filenames):
    """Rebuild payload.js from the stored final_prompt (retry in a fresh chat without a new Gemini call)."""
    rows, _ = load()
    write_payload({Path(fn).stem: find(rows, fn)["final_prompt"] for fn in filenames})


def cmd_take(fn, chat_url, variant="1"):
    rows, fields = load()
    r = find(rows, fn)
    orig = Path.home() / "Downloads" / f"{Path(fn).stem}-{variant}.png"
    out = og.OUTPUT_DIR / fn
    subprocess.run(["magick", str(orig), "-resize", "1600x>", "-strip", "-quality", "82", str(out)], check=True)
    alt = r.get("alt_text") or r.get("page_headline") or Path(fn).stem.replace("-", " ")
    subprocess.run(["exiftool", "-q", "-overwrite_original",
                    "-XMP-iptcExt:DigitalSourceType=http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia",
                    f"-XMP-dc:Description={alt}", "-XMP-dc:Creator=PourCanvas", "-XMP-photoshop:Credit=PourCanvas",
                    "-XMP-dc:Rights=PourCanvas (pourcanvas.com), CC BY 4.0",
                    "-XMP-xmpRights:WebStatement=https://pourcanvas.com/terms#images", str(out)], check=True)
    r.update(r2_url=og.upload_to_r2(out, fn), image_generated="completed", generator="chatgpt", chat_url=chat_url)
    og.save_csv(og.CSV_PATH, rows, fields)
    print(fn, r["r2_url"])


if __name__ == "__main__":
    cmd, *args = sys.argv[1:] or ["help"]
    if cmd == "prompts":
        cmd_prompts(args)
    elif cmd == "payload":
        cmd_payload(args)
    elif cmd == "take":
        cmd_take(*args)
    else:
        print(__doc__)
