#!/usr/bin/env python3
"""Nightly GSC "Request indexing" queue for pourcanvas.com.

  python3 scripts/indexing-queue.py next [N]        -> picks N not-indexed URLs, writes _data/gsc/indexing/batch-<date>.txt
  python3 scripts/indexing-queue.py record <file>   -> appends the Chrome child's result file to _data/gsc/indexing/log.csv

Order: URLs in _data/gsc/indexing/priority.txt first (one URL per line, # comments), then sitemap URLs by section
(tools > blog > materials > hubs > palette > before-after > inspiration). Skips URLs requested in the last
COOLDOWN_DAYS days and URLs the URL Inspection API reports as indexed.
"""
import csv, datetime as dt, importlib.util, os, sys, urllib.request
import xml.etree.ElementTree as ET

ROOT = os.path.join(os.path.dirname(__file__), "..")
DIR = os.path.join(ROOT, "_data", "gsc", "indexing")
LOG = os.path.join(DIR, "log.csv")
PRIORITY = os.path.join(DIR, "priority.txt")
COOLDOWN_DAYS = 21
SKIP = ("/terms",)
SECTION_ORDER = ["/tools/", "/blog/", "/materials/", "/guides/", "/driveway", "/patio", "/walkway", "/tools",
                 "/methodology", "/palette/", "/before-after/", "/inspiration/"]


def gsc():
    spec = importlib.util.spec_from_file_location("gsc", os.path.join(os.path.dirname(__file__), "gsc-pull.py"))
    m = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(m)
    return m


def sitemap_urls():
    ns = {"s": "http://www.sitemaps.org/schemas/sitemap/0.9"}
    index = ET.fromstring(urllib.request.urlopen("https://pourcanvas.com/sitemap.xml").read())
    urls = []
    for sm in [e.text for e in index.findall("./s:sitemap/s:loc", ns)]:
        urls += [e.text for e in ET.fromstring(urllib.request.urlopen(sm).read()).findall("./s:url/s:loc", ns)]
    return urls


def rank(url):
    path = url.replace("https://pourcanvas.com", "") or "/"
    for i, prefix in enumerate(SECTION_ORDER):
        if path.startswith(prefix):
            return i
    return len(SECTION_ORDER)


def recent_requests():
    if not os.path.exists(LOG):
        return set()
    cutoff = dt.date.today() - dt.timedelta(days=COOLDOWN_DAYS)
    with open(LOG) as f:
        return {r["url"] for r in csv.DictReader(f) if r["result"] == "REQUESTED" and dt.date.fromisoformat(r["date"]) >= cutoff}


def cmd_next(n):
    g = gsc()
    priority = []
    if os.path.exists(PRIORITY):
        priority = [l.strip() for l in open(PRIORITY) if l.strip() and not l.startswith("#")]
    rest = sorted((u for u in sitemap_urls() if u not in priority), key=rank)
    skip = recent_requests()
    batch = []
    for u in priority + rest:
        if len(batch) == n:
            break
        if u in skip or u.replace("https://pourcanvas.com", "").startswith(SKIP):
            continue
        r = g.call("https://searchconsole.googleapis.com/v1/urlInspection/index:inspect",
                   {"inspectionUrl": u, "siteUrl": g.SITE})["inspectionResult"]["indexStatusResult"]
        if r.get("verdict") == "PASS":
            continue
        batch.append((u, r.get("coverageState", "")))
    path = os.path.join(DIR, f"batch-{dt.date.today().isoformat()}.txt")
    with open(path, "w") as f:
        for u, state in batch:
            f.write(f"{u} | {state}\n")
    print(path)
    for u, state in batch:
        print(f"{u} | {state}")


def cmd_record(result_file):
    """Result lines: '<url> | <status shown by GSC> | REQUESTED|ALREADY_INDEXED|QUOTA|ERROR <detail>'."""
    new = not os.path.exists(LOG)
    today = dt.date.today().isoformat()
    with open(LOG, "a", newline="") as f:
        w = csv.writer(f)
        if new:
            w.writerow(["date", "url", "gsc_status", "result"])
        for line in open(result_file):
            parts = [p.strip() for p in line.split("|")]
            if len(parts) >= 3 and parts[0].startswith("https://"):
                w.writerow([today, parts[0], parts[1], parts[2].split()[0]])
    print(f"recorded {result_file} -> {LOG}")


if __name__ == "__main__":
    os.makedirs(DIR, exist_ok=True)
    cmd, *args = sys.argv[1:] or ["help"]
    if cmd == "next":
        cmd_next(int(args[0]) if args else 10)
    elif cmd == "record":
        cmd_record(args[0])
    else:
        print(__doc__)
