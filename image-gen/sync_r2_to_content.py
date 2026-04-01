#!/usr/bin/env python3
"""
Sync completed R2 image URLs into TypeScript content files.

Reads the CSV for rows with image_status=completed, then replaces the
local /og/... path in the relevant content file with the R2 URL.

Usage:
    python sync_r2_to_content.py
"""

import csv
import re
from pathlib import Path

ROOT       = Path(__file__).parent.parent
CSV_PATH   = ROOT / "image-gen" / "master-pin-tracker.csv"

CONTENT_FILES = {
    ("inspiration", "driveway"): ROOT / "src/content/inspiration/index.ts",
    ("inspiration", "patio"):    ROOT / "src/content/inspiration/index.ts",
    ("inspiration", "walkway"):  ROOT / "src/content/inspiration/index.ts",
    ("article", "driveway"):     ROOT / "src/content/articles/driveway.ts",
    ("article", "patio"):        ROOT / "src/content/articles/patio.ts",
    ("article", "walkway"):      ROOT / "src/content/articles/walkway.ts",
}


def sync():
    with open(CSV_PATH, newline="", encoding="utf-8") as f:
        rows = list(csv.DictReader(f))

    completed = [r for r in rows if r.get("image_generated") == "completed" and r.get("r2_url")]
    print(f"CSV: {len(rows)} total | {len(completed)} completed with R2 URL\n")

    # Load each unique content file once, track changes
    file_contents: dict[Path, str] = {}
    change_counts: dict[Path, int] = {}

    for row in completed:
        key   = (row["page_type"], row["pillar"])
        tfile = CONTENT_FILES.get(key)
        if tfile is None:
            print(f"  WARNING: no content file mapped for page_type={row['page_type']} pillar={row['pillar']}")
            continue

        if tfile not in file_contents:
            file_contents[tfile] = tfile.read_text(encoding="utf-8")
            change_counts[tfile] = 0

        old_path = row["image_filename"]           # e.g. /og/inspiration-xxx.jpg
        r2_url   = row["r2_url"]                   # e.g. https://images.pourcanvas.com/inspiration-xxx.jpg
        old_str  = f'"{old_path}"'
        new_str  = f'"{r2_url}"'

        if old_str in file_contents[tfile]:
            file_contents[tfile] = file_contents[tfile].replace(old_str, new_str, 1)
            change_counts[tfile] += 1
            print(f"  ✓ {row['slug']}")
        elif r2_url in file_contents[tfile]:
            print(f"  — {row['slug']} (already updated)")
        else:
            print(f"  ✗ {row['slug']} — path not found in {tfile.name}: {old_path}")

    print()
    for tfile, content in file_contents.items():
        tfile.write_text(content, encoding="utf-8")
        print(f"Wrote {change_counts[tfile]} change(s) → {tfile.relative_to(ROOT)}")

    if not file_contents:
        print("Nothing to sync.")


if __name__ == "__main__":
    sync()
