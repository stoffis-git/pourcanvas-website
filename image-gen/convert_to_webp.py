#!/usr/bin/env python3
"""
Convert all R2-hosted JPEG inspiration images to WebP and re-upload.

Downloads each .jpg from images.pourcanvas.com, converts to WebP at quality 82,
uploads the .webp back to R2, and updates the r2_url in master-pin-tracker.csv.

Run sync_r2_to_content.py after this to propagate new .webp URLs into TS files.

Requirements: pip install Pillow boto3 requests
R2 credentials: set R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY env vars.
"""

import csv
import io
import os
import sys
import tempfile
from pathlib import Path

import boto3
import requests
from PIL import Image

ROOT = Path(__file__).parent.parent
CSV_PATH = ROOT / "image-gen" / "master-pin-tracker.csv"
BUCKET = "pourcanvas-images"
WEBP_QUALITY = 82

R2_ACCOUNT_ID = os.environ.get("R2_ACCOUNT_ID", "")
R2_ACCESS_KEY = os.environ.get("R2_ACCESS_KEY_ID", "")
R2_SECRET_KEY = os.environ.get("R2_SECRET_ACCESS_KEY", "")


def r2_client():
    if not all([R2_ACCOUNT_ID, R2_ACCESS_KEY, R2_SECRET_KEY]):
        print("ERROR: Set R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY env vars.")
        sys.exit(1)
    return boto3.client(
        "s3",
        endpoint_url=f"https://{R2_ACCOUNT_ID}.r2.cloudflarestorage.com",
        aws_access_key_id=R2_ACCESS_KEY,
        aws_secret_access_key=R2_SECRET_KEY,
        region_name="auto",
    )


def convert_and_upload(s3, jpg_url: str) -> str:
    """Download jpg_url, convert to WebP, upload to R2, return new URL."""
    r = requests.get(jpg_url, timeout=30)
    r.raise_for_status()

    img = Image.open(io.BytesIO(r.content)).convert("RGB")

    buf = io.BytesIO()
    img.save(buf, "WEBP", quality=WEBP_QUALITY, method=6)
    buf.seek(0)

    # Derive R2 key: strip domain, replace .jpg with .webp
    path = jpg_url.replace("https://images.pourcanvas.com/", "")
    webp_key = path.rsplit(".", 1)[0] + ".webp"

    s3.put_object(
        Bucket=BUCKET,
        Key=webp_key,
        Body=buf,
        ContentType="image/webp",
    )

    return f"https://images.pourcanvas.com/{webp_key}"


def main():
    with open(CSV_PATH, newline="", encoding="utf-8") as f:
        rows = list(csv.DictReader(f))

    fieldnames = rows[0].keys() if rows else []
    to_convert = [
        r for r in rows
        if r.get("r2_url", "").startswith("https://images.pourcanvas.com/")
        and r["r2_url"].endswith(".jpg")
    ]

    print(f"Found {len(to_convert)} JPEGs to convert out of {len(rows)} total rows\n")

    if not to_convert:
        print("Nothing to do.")
        return

    s3 = r2_client()
    original_size_total = 0
    webp_size_total = 0

    for row in to_convert:
        jpg_url = row["r2_url"]
        slug = row.get("slug", jpg_url)
        try:
            r = requests.get(jpg_url, timeout=30)
            r.raise_for_status()
            jpg_bytes = len(r.content)

            img = Image.open(io.BytesIO(r.content)).convert("RGB")
            buf = io.BytesIO()
            img.save(buf, "WEBP", quality=WEBP_QUALITY, method=6)
            webp_bytes = buf.tell()
            buf.seek(0)

            path = jpg_url.replace("https://images.pourcanvas.com/", "")
            webp_key = path.rsplit(".", 1)[0] + ".webp"

            s3.put_object(
                Bucket=BUCKET,
                Key=webp_key,
                Body=buf,
                ContentType="image/webp",
            )

            new_url = f"https://images.pourcanvas.com/{webp_key}"
            row["r2_url"] = new_url

            saving_pct = round((1 - webp_bytes / jpg_bytes) * 100)
            print(f"  ✓ {slug}  {jpg_bytes // 1024}KB → {webp_bytes // 1024}KB  (-{saving_pct}%)")
            original_size_total += jpg_bytes
            webp_size_total += webp_bytes

        except Exception as e:
            print(f"  ✗ {slug}: {e}")

    with open(CSV_PATH, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)

    total_saving = round((1 - webp_size_total / original_size_total) * 100) if original_size_total else 0
    print(f"\nDone. Total: {original_size_total // 1024}KB → {webp_size_total // 1024}KB  (-{total_saving}%)")
    print("Run  python image-gen/sync_r2_to_content.py  to update TS content files.")


if __name__ == "__main__":
    main()
