#!/usr/bin/env python3
"""Fetch authoritative difficulty / paid / topic-tag metadata from LeetCode's GraphQL API.

Input : data/raw/base_items.json   (only items that carry a leetcode.com URL)
Output: data/raw/leetcode.json     {slug: {title, difficulty, isPaidOnly, topicTags, frontendId}}

Public, unauthenticated endpoint; 6 workers with retry/backoff to stay polite.
"""
from __future__ import annotations

import json
import re
import subprocess
import sys
import time
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
RAW = ROOT / "data" / "raw"
QUERY = (
    "query q($t:String!){question(titleSlug:$t)"
    "{title difficulty isPaidOnly questionFrontendId topicTags{name}}}"
)
SLUG_RE = re.compile(r"/problems/([a-z0-9-]+)")


def fetch(slug: str, attempts: int = 4) -> dict | None:
    body = json.dumps({"query": QUERY, "variables": {"t": slug}})
    for attempt in range(attempts):
        proc = subprocess.run(
            [
                "curl", "-sS", "--max-time", "25", "-X", "POST",
                "https://leetcode.com/graphql",
                "-H", "content-type: application/json",
                "-H", "user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
                "-H", "referer: https://leetcode.com/problems/" + slug + "/",
                "-d", body,
            ],
            capture_output=True,
            text=True,
        )
        try:
            data = json.loads(proc.stdout)
        except json.JSONDecodeError:
            data = None
        question = ((data or {}).get("data") or {}).get("question")
        if question and question.get("difficulty"):
            return question
        time.sleep(1.5 * (attempt + 1))
    return None


def main() -> int:
    items = json.loads((RAW / "base_items.json").read_text())
    slugs: dict[str, list[str]] = {}
    for item in items:
        match = SLUG_RE.search(item.get("leetcodeUrl") or "")
        if match:
            slugs.setdefault(match.group(1), []).append(item["title"])
    print(f"{len(slugs)} unique leetcode slugs across "
          f"{sum(len(v) for v in slugs.values())} leak-sheet items")

    with ThreadPoolExecutor(max_workers=6) as pool:
        results = dict(zip(slugs, pool.map(fetch, slugs)))

    ok = {k: v for k, v in results.items() if v}
    missing = sorted(set(slugs) - set(ok))
    out = RAW / "leetcode.json"
    out.write_text(json.dumps(ok, ensure_ascii=False, indent=1, sort_keys=True))
    print(f"resolved {len(ok)}/{len(slugs)} -> {out}")
    if missing:
        print(f"unresolved ({len(missing)}): {missing}")
    paid = [s for s, v in ok.items() if v["isPaidOnly"]]
    print(f"paid-only: {len(paid)} {paid}")
    print("difficulty mix:", {d: sum(1 for v in ok.values() if v['difficulty'] == d)
                              for d in ("Easy", "Medium", "Hard")})
    return 0


if __name__ == "__main__":
    sys.exit(main())
