#!/usr/bin/env python3
"""ChatGPT backend for the PourCanvas image pipeline.

Same tracking and prompt building as generate_og_images.py, but the image is made in the ChatGPT web UI
(one fresh chat per image, via a headless Claude-in-Chrome session) instead of Imagen:
  - rows live in master-pin-tracker.csv (generator=chatgpt)
  - final prompt = Gemini Flash + IMAGEN_STYLE_GUIDE.md + random variation params (build_imagen_prompt)
  - every sent prompt is stored in final_prompt, the chat in chat_url

Usage (venv: image-gen/.venv):
  python chatgpt_images.py prompts <image_filename>...   build + store final prompts, write payload.js
  python chatgpt_images.py take <image_filename> <chat_url> [variant]   ~/Downloads/<stem>-<n>.png -> JPEG, tag, R2, CSV
Browser side: image-gen/chatgpt/start.js + collect.js (localStorage pc_subjects, keyed by filename stem).
"""
import json
import os
import subprocess
import sys
from pathlib import Path

import generate_og_images as og
from google import genai

HERE = Path(__file__).parent
PAYLOAD = HERE / "chatgpt" / "payload.js"
LANDSCAPE = "Landscape 3:2 orientation (article section image; overrides the portrait default)."
KEEP = ("Everything named in this source prompt (home, vehicle, license plate, surface details) must stay in frame; "
        "ignore any variation param that would remove it. The license plate is the only text allowed in the image.")
COLUMNS = ["prompt_variation", "final_prompt", "generator", "chat_url"]


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
    return r["page_type"] == "article-section"


def build(client, src):
    """build_imagen_prompt, but scene subjects (a home or vehicle in frame) only draw establishing-type variation params."""
    scene = any(w in src.lower() for w in ("home", "house", "parked"))
    pools = {k: list(getattr(og, k)) for k in ("_CAMERA_ANGLES", "_FOREGROUND_WEIGHTS", "_DEPTH_READS")}
    if scene:
        og._CAMERA_ANGLES = [c for c in pools["_CAMERA_ANGLES"] if "close-up" not in c and "overhead" not in c]
        og._FOREGROUND_WEIGHTS = [f for f in pools["_FOREGROUND_WEIGHTS"] if not f.split("%")[0].endswith(("70", "90"))]
        og._DEPTH_READS = [d for d in pools["_DEPTH_READS"] if "no home" not in d and "barely" not in d]
    try:
        return og.build_imagen_prompt(client, src)
    finally:
        for k, v in pools.items():
            setattr(og, k, v)


def cmd_prompts(filenames):
    rows, fields = load()
    client = genai.Client(api_key=os.environ["GOOGLE_API_KEY"])
    subjects = {}
    for fn in filenames:
        r = find(rows, fn)
        src = r["ai_prompt"] + (f" {LANDSCAPE}" if landscape(r) else "") + f" {KEEP}"
        prompt, label = build(client, src)
        tail = "\nAspect ratio: 3:2 landscape." if landscape(r) else "\nAspect ratio: 3:4 portrait."
        r.update(final_prompt=prompt + tail, prompt_variation=label, generator="chatgpt", image_generated="pending")
        subjects[Path(fn).stem] = r["final_prompt"]
        print(f"{fn}: {label}")
    og.save_csv(og.CSV_PATH, rows, fields)
    PAYLOAD.write_text(
        f"localStorage.pc_style='';localStorage.pc_subjects={json.dumps(json.dumps(subjects))};"
        "Object.keys(JSON.parse(localStorage.pc_subjects)).length"
    )
    print(f"payload: {PAYLOAD} ({len(subjects)} subjects)")


def cmd_take(fn, chat_url, variant="1"):
    rows, fields = load()
    r = find(rows, fn)
    orig = Path.home() / "Downloads" / f"{Path(fn).stem}-{variant}.png"
    out = og.OUTPUT_DIR / fn
    subprocess.run(["magick", str(orig), "-resize", "1600x>", "-strip", "-quality", "82", str(out)], check=True)
    alt = r.get("page_headline") or Path(fn).stem.replace("-", " ")
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
    elif cmd == "take":
        cmd_take(*args)
    else:
        print(__doc__)
