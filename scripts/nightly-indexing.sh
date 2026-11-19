#!/bin/zsh
# Nightly GSC "Request indexing" for 10 not-indexed pourcanvas URLs (scheduled 01:00 via T3 Code).
# Needs: Mac awake, Chrome running with the Claude extension, signed in to Search Console; gcloud ADC.
set -euo pipefail
cd "$(dirname "$0")/.."
DAY=$(date +%F)
DIR=_data/gsc/indexing
BATCH=$(python3 scripts/indexing-queue.py next 10 | head -1)
RESULT="$PWD/$DIR/result-$DAY.txt"
if [ ! -s "$BATCH" ]; then echo "nothing to request"; exit 0; fi
URLS=$(cut -d'|' -f1 "$BATCH" | sed 's/ *$//')
BRIEF="You are requesting indexing in Google Search Console for pourcanvas.com (property sc-domain:pourcanvas.com).
Open ONE new Chrome tab and reuse it. For each URL below, in order:
1. Go to https://search.google.com/search-console/inspect?resource_id=sc-domain%3Apourcanvas.com&id=<URL-encoded url>
2. Wait until the inspection result loads. Note the status line (e.g. 'URL is on Google' / 'URL is not on Google' and the reason).
3. If the URL is already on Google: result ALREADY_INDEXED, move on.
4. Otherwise click 'REQUEST INDEXING', wait for the live test (up to ~2 minutes) and the confirmation dialog 'Indexing requested', close the dialog. Result REQUESTED.
5. If GSC says the daily quota is exceeded: result QUOTA for this and all remaining URLs, stop.
6. Any other problem: result 'ERROR <short reason>', move on.
Do not change any GSC settings. Close the tab when done.
Your final answer must contain one line per URL, in exactly this format and nothing else on those lines:
<url> | <status shown by GSC> | <RESULT>
URLs:
$URLS"
OUT=$(cd /tmp && claude -p --chrome --allowedTools "mcp__claude-in-chrome__*" --output-format text "$BRIEF" < /dev/null || true)
echo "$OUT" > "$DIR/child-$DAY.log"
echo "$OUT" | grep -oE 'https://pourcanvas\.com[^ |`]* \| [^|]+ \| [A-Z_]+[^`]*' > "$RESULT" || true
[ -s "$RESULT" ] && python3 scripts/indexing-queue.py record "$RESULT"
cat "$RESULT" 2>/dev/null || echo "no result file written"
