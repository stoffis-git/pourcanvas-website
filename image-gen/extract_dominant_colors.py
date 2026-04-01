#!/usr/bin/env python3
"""
Extract dominant color from each inspiration page hero image and patch index.ts.

Downloads each ogImage, computes dominant color via Pillow, then inserts
  dominantColor: "#rrggbb",
after the heroAlt: line in src/content/inspiration/index.ts.

Usage:
    python image-gen/extract_dominant_colors.py

Requirements: pip install Pillow requests
"""

import io
import re
import sys
from pathlib import Path

import requests
from PIL import Image

ROOT = Path(__file__).parent.parent
INDEX_TS = ROOT / "src/content/inspiration/index.ts"


def dominant_hex(url: str) -> str:
    r = requests.get(url, timeout=30)
    r.raise_for_status()
    img = Image.open(io.BytesIO(r.content)).convert("RGB")
    # Two-step resize: 50×50 first for better averaging, then collapse to 1×1
    color = img.resize((50, 50), Image.LANCZOS).resize((1, 1), Image.LANCZOS).getpixel((0, 0))
    return "#{:02x}{:02x}{:02x}".format(*color)


def parse_entries(text: str) -> list[dict]:
    slug_re = re.compile(r'slug:\s*"([^"]+)"')
    og_re = re.compile(r'ogImage:\s*"(https://[^"]+)"')
    entries = []
    for m in slug_re.finditer(text):
        slug = m.group(1)
        # Find the ogImage in the block starting at this slug match
        block = text[m.start(): m.start() + 2000]
        og = og_re.search(block)
        if og:
            entries.append({"slug": slug, "ogImage": og.group(1), "pos": m.start()})
    return entries


def patch_index(text: str, slug: str, hex_color: str) -> str:
    """Insert dominantColor after heroAlt: for this slug's block."""
    already = re.compile(rf'slug:\s*"{re.escape(slug)}".*?dominantColor:', re.DOTALL)
    if already.search(text[:text.find(f'slug: "{slug}"') + 3000]):
        return text  # already patched

    # Find the heroAlt: line in the block after this slug
    slug_pos = text.find(f'slug: "{slug}"')
    if slug_pos == -1:
        return text

    block_end = slug_pos + 3000
    hero_re = re.compile(r'([ \t]*heroAlt:\s*"[^"]*",?\n)')
    m = hero_re.search(text, slug_pos, block_end)
    if not m:
        print(f"  WARNING: heroAlt not found for {slug}")
        return text

    indent = re.match(r'([ \t]*)', m.group(1)).group(1)
    insert = f'{indent}dominantColor: "{hex_color}",\n'
    return text[: m.end()] + insert + text[m.end():]


def main():
    text = INDEX_TS.read_text(encoding="utf-8")
    entries = parse_entries(text)
    print(f"Found {len(entries)} inspiration entries\n")

    for entry in entries:
        slug = entry["slug"]
        url = entry["ogImage"]
        # Skip non-pourcanvas images
        if not url.startswith("https://images.pourcanvas.com/"):
            print(f"  — {slug}: skipped (external URL)")
            continue
        # Skip if already has dominantColor
        slug_pos = text.find(f'slug: "{slug}"')
        if "dominantColor" in text[slug_pos: slug_pos + 2000]:
            print(f"  — {slug}: already has dominantColor")
            continue
        try:
            hex_color = dominant_hex(url)
            text = patch_index(text, slug, hex_color)
            print(f"  ✓ {slug}: {hex_color}")
        except Exception as e:
            print(f"  ✗ {slug}: {e}")

    INDEX_TS.write_text(text, encoding="utf-8")
    print(f"\nDone. Patched {INDEX_TS.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
