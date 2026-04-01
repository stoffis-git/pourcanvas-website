#!/usr/bin/env python3
"""
Reddit Thread Signal Miner
Finds high-signal demand posts: 500–2000 upvotes, statement titles, after Aug 1 2025.
Usage: python3 reddit-signal-miner.py
"""

import json
import time
import urllib.request
from datetime import datetime, timezone

SUBREDDITS = [
    "freelance",
    "smallbusiness",
    "personalfinance",
    "landlord",
    "entrepreneur",
    "careerguidance",
    "legaladvice",
    "financialindependence",
]

MIN_SCORE = 500
MAX_SCORE = 2000
MIN_UTC = 1754006400  # Aug 1, 2025

HEADERS = {"User-Agent": "signal-miner/1.0"}


def fetch(url):
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=15) as resp:
        return json.loads(resp.read().decode())


def is_statement_title(title):
    """Heuristic: not a question, contains incident/problem signals."""
    t = title.strip()
    if t.endswith("?"):
        return False
    # bonus signals but not required
    return True


def score_comments(comments_data):
    """
    Returns a 1–2 sentence summary of what the top comments reveal.
    Looks for detail-adding comments vs pure sympathy.
    """
    try:
        listing = comments_data[1]["data"]["children"]
    except (IndexError, KeyError):
        return "Could not fetch comments."

    detail_keywords = [
        "same", "happened to me", "i had", "i was", "my ", "we ", "similar",
        "also", "i lost", "i paid", "i got", "i filed", "i sued",
    ]
    sympathy_only = ["sorry", "that sucks", "oof", "yikes", "wow", "terrible"]

    detail_count = 0
    sympathy_count = 0
    sample_bodies = []

    for child in listing[:5]:
        body = child.get("data", {}).get("body", "").lower()
        if not body or body == "[deleted]" or body == "[removed]":
            continue
        sample_bodies.append(body[:120])
        has_detail = any(kw in body for kw in detail_keywords)
        has_sympathy = any(kw in body for kw in sympathy_only)
        if has_detail:
            detail_count += 1
        elif has_sympathy:
            sympathy_count += 1

    total = detail_count + sympathy_count
    if total == 0:
        return "Insufficient comment data to assess signal depth."

    if detail_count >= 2:
        return (
            f"{detail_count} of top comments add personal detail or similar experiences. "
            "Strong community resonance — multiple people share the same problem."
        )
    elif detail_count == 1:
        return (
            "Mixed signal: 1 detailed follow-up story, rest mostly sympathy. "
            "Moderate demand signal."
        )
    else:
        return "Top comments are mostly sympathy/agreement with little personal detail. Weaker signal."


def mine_subreddit(sub):
    print(f"  Fetching r/{sub}...", flush=True)
    url = f"https://www.reddit.com/r/{sub}/top.json?t=year&limit=100"
    try:
        data = fetch(url)
    except Exception as e:
        print(f"  ERROR r/{sub}: {e}")
        return []

    posts = data.get("data", {}).get("children", [])
    qualifying = []

    for post in posts:
        d = post.get("data", {})
        score = d.get("score", 0)
        created = d.get("created_utc", 0)
        title = d.get("title", "")
        post_id = d.get("id", "")
        permalink = d.get("permalink", "")
        num_comments = d.get("num_comments", 0)

        if not (MIN_SCORE <= score <= MAX_SCORE):
            continue
        if created <= MIN_UTC:
            continue
        if not is_statement_title(title):
            continue

        date_str = datetime.fromtimestamp(created, tz=timezone.utc).strftime("%Y-%m-%d")

        # Fetch comments
        time.sleep(0.5)  # be polite
        comment_url = f"https://www.reddit.com/r/{sub}/comments/{post_id}.json?limit=5&sort=top"
        try:
            comments_data = fetch(comment_url)
            comment_signal = score_comments(comments_data)
        except Exception as e:
            comment_signal = f"Could not fetch comments: {e}"

        qualifying.append({
            "subreddit": f"r/{sub}",
            "title": title,
            "score": score,
            "date": date_str,
            "url": f"https://reddit.com{permalink}",
            "num_comments": num_comments,
            "comment_signal": comment_signal,
        })

        time.sleep(0.5)

    print(f"  r/{sub}: {len(qualifying)} qualifying posts")
    return qualifying


def main():
    print("Reddit Signal Miner")
    print(f"Criteria: {MIN_SCORE}–{MAX_SCORE} upvotes, after Aug 1 2025, statement titles\n")

    all_results = []
    for sub in SUBREDDITS:
        results = mine_subreddit(sub)
        all_results.extend(results)
        time.sleep(1)

    all_results.sort(key=lambda x: x["score"], reverse=True)

    print(f"\n{'='*80}")
    print(f"RESULTS: {len(all_results)} qualifying posts\n")

    if not all_results:
        print("No posts matched all criteria.")
        return

    # Print table
    col_widths = {"sub": 24, "title": 52, "score": 7, "date": 12}
    header = (
        f"{'Subreddit':<{col_widths['sub']}} "
        f"{'Score':>{col_widths['score']}} "
        f"{'Date':<{col_widths['date']}} "
        f"Title"
    )
    print(header)
    print("-" * 120)

    for r in all_results:
        title_trunc = r["title"][:70] + "…" if len(r["title"]) > 70 else r["title"]
        print(
            f"{r['subreddit']:<{col_widths['sub']}} "
            f"{r['score']:>{col_widths['score']}} "
            f"{r['date']:<{col_widths['date']}} "
            f"{title_trunc}"
        )
        print(f"  URL: {r['url']}")
        print(f"  Signal: {r['comment_signal']}")
        print()

    # Also write JSON for further processing
    out_file = "reddit-signal-results.json"
    with open(out_file, "w") as f:
        json.dump(all_results, f, indent=2)
    print(f"Full results saved to {out_file}")


if __name__ == "__main__":
    main()
