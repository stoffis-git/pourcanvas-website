# Numbers Verification Brief

Goal: every number on pourcanvas must trace to a source that was actually **fetched**, ideally dated 2024–2026. Snippets don't count.

## Method
- Use WebSearch with mode "extended" (standard mode returns spam) and WebFetch. If WebFetch fails on a PDF, download it with `curl -sL -o <scratch path>` and extract text, e.g. with `python3 -c` and `pypdf` if available, or `strings`.
- Some sites block fetches (HomeGuide, Angi and Lowe's often return 403). Then try another reputable source, or the page through a different URL. Never accept a snippet-only value.
- For cost ranges, collect **at least 3 independent sources** where possible: cost publishers (HomeGuide, Angi/HomeAdvisor, Lawn Love, Forbes Home, Fixr, Homewyse), manufacturers and associations, and retailer price pages.
- Recommend a low/typical/high that most sources share. Note outliers and the reason you excluded them. Patio/walkway installed prices are U.S. national averages per sq ft, installed by a pro.
- Mark each value **CONFIRMED** (current value within the consensus), **ADJUST** (give the new value), or **UNVERIFIABLE** (no fetched source found; recommend phrasing it qualitatively or removing it).

## Output
Write your report to the file named in your task. For every item give: current value → verdict → recommended value → sources (URL, page date, fetched yes) → one-line rationale. End with a summary table. Don't edit any code.
