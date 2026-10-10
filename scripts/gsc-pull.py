#!/usr/bin/env python3
"""Pull Search Console data for pourcanvas.com via the API.

Auth: gcloud auth application-default login --scopes=https://www.googleapis.com/auth/webmasters.readonly,https://www.googleapis.com/auth/cloud-platform
Usage: python3 scripts/gsc-pull.py [--inspect]
Writes CSVs to _data/gsc/<today>/api/.
"""
import csv, datetime as dt, json, os, subprocess, sys, urllib.parse, urllib.request
import xml.etree.ElementTree as ET

SITE = "sc-domain:pourcanvas.com"
QUOTA_PROJECT = "gen-lang-client-0767192177"
START = "2026-03-01"
TODAY = dt.date.today()
END = (TODAY - dt.timedelta(days=1)).isoformat()
OUT = os.path.join(os.path.dirname(__file__), "..", "_data", "gsc", TODAY.isoformat(), "api")

TOKEN = subprocess.check_output(["gcloud", "auth", "application-default", "print-access-token"], text=True).strip()


def call(url, body):
    req = urllib.request.Request(url, data=json.dumps(body).encode(), method="POST", headers={
        "Authorization": f"Bearer {TOKEN}", "x-goog-user-project": QUOTA_PROJECT, "Content-Type": "application/json"})
    with urllib.request.urlopen(req) as r:
        return json.load(r)


def query(dims, start=START, end=END, search_type="web", filters=None):
    url = f"https://www.googleapis.com/webmasters/v3/sites/{urllib.parse.quote(SITE, safe='')}/searchAnalytics/query"
    rows, offset = [], 0
    while True:
        body = {"startDate": start, "endDate": end, "dimensions": dims, "type": search_type,
                "rowLimit": 25000, "startRow": offset, "dataState": "all"}
        if filters:
            body["dimensionFilterGroups"] = [{"filters": filters}]
        batch = call(url, body).get("rows", [])
        rows += batch
        if len(batch) < 25000:
            return rows
        offset += 25000


def save(name, dims, rows):
    path = os.path.join(OUT, f"{name}.csv")
    with open(path, "w", newline="") as f:
        w = csv.writer(f)
        w.writerow(dims + ["clicks", "impressions", "ctr", "position"])
        for r in rows:
            w.writerow(r["keys"] + [r["clicks"], r["impressions"], round(r["ctr"], 4), round(r["position"], 2)])
    print(f"{name}: {len(rows)} rows")


def inspect_urls():
    sitemap = urllib.request.urlopen("https://pourcanvas.com/sitemap.xml").read()
    ns = {"s": "http://www.sitemaps.org/schemas/sitemap/0.9"}
    urls = [e.text for e in ET.fromstring(sitemap).findall(".//s:loc", ns)]
    path = os.path.join(OUT, "url_inspection.csv")
    with open(path, "w", newline="") as f:
        w = csv.writer(f)
        w.writerow(["url", "verdict", "coverageState", "indexingState", "lastCrawlTime", "googleCanonical", "userCanonical"])
        for u in urls:
            try:
                r = call("https://searchconsole.googleapis.com/v1/urlInspection/index:inspect",
                         {"inspectionUrl": u, "siteUrl": SITE})["inspectionResult"]["indexStatusResult"]
            except Exception as e:
                r = {"verdict": f"ERROR {e}"}
            w.writerow([u, r.get("verdict"), r.get("coverageState"), r.get("indexingState"),
                        r.get("lastCrawlTime"), r.get("googleCanonical"), r.get("userCanonical")])
    print(f"url_inspection: {len(urls)} urls")


if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
    d28 = (TODAY - dt.timedelta(days=28)).isoformat()
    d56 = (TODAY - dt.timedelta(days=56)).isoformat()
    d29 = (TODAY - dt.timedelta(days=29)).isoformat()
    save("query_page_all", ["query", "page"], query(["query", "page"]))
    save("query_page_last28", ["query", "page"], query(["query", "page"], start=d28))
    save("query_page_prev28", ["query", "page"], query(["query", "page"], start=d56, end=d29))
    save("query_all", ["query"], query(["query"]))
    save("query_week", ["query", "date"], query(["query", "date"], start=d56))
    save("query_device", ["query", "device"], query(["query", "device"]))
    save("query_country", ["query", "country"], query(["query", "country"]))
    save("page_date", ["page", "date"], query(["page", "date"]))
    save("image_query_page", ["query", "page"], query(["query", "page"], search_type="image"))
    save("image_date", ["date"], query(["date"], search_type="image"))
    save("web_date", ["date"], query(["date"]))
    if "--inspect" in sys.argv:
        inspect_urls()
