#!/usr/bin/env python3
"""Two conservative LeetCode fixes, both verified against LeetCode itself.

1. canonical slugs: a few links inside the takeuforward payload point at slugs LeetCode has
   since renamed (`coin-change-2`, `implement-strstr`). Resolve them to the live slug.
2. extra links: codolio lists a LeetCode link for some problems whose takeuforward row has
   none, but its mapping is sloppy ("Reverse an array" -> reverse-string, "Power Set" ->
   subsets). Accept one only when the LeetCode problem's own title is an exact normalized
   match for the sheet's title - no fuzzy credit.

Output: data/raw/leetcode_extra.json  {"extra": {...}, "canonical": {...}}
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
    "{title difficulty isPaidOnly questionFrontendId}}"
)
LC_SLUG_RE = re.compile(r"/problems/([a-z0-9-]+)")

LC_HOST_RE = re.compile(r"leetcode\.com/(?:problems/|accounts/login/\?next=/problems/)([a-z0-9-]+)")


def lc_slug(url: str | None) -> str | None:
    """LeetCode slug from a problem URL, including the sheet's login-wall form.

    The sheet links "Celebrity Problem" at /accounts/login/?next=/problems/find-the-celebrity/,
    so a plain /problems/ match is not enough on its own, and matching /problems/ without requiring
    the leetcode.com host would also swallow takeuforward's /plus/dsa/problems/<slug> URLs.
    """
    if not url or "leetcode.com" not in url:
        return None
    match = LC_SLUG_RE.search(url)
    return match.group(1) if match else None

RENAMED = {
    "coin-change-2": ["coin-change-ii"],
    "implement-strstr": ["find-the-index-of-the-first-occurrence-in-a-string"],
}
SUSPECT = {"coin-change-2", "implement-strstr"}


def norm(text: str) -> str:
    text = (text or "").lower()
    text = re.sub(r"\(.*?\)", " ", text)
    text = re.sub(r"[^a-z0-9]+", " ", text)
    stop = {"the", "a", "an", "of", "in", "on", "to", "and", "for", "with", "problem"}
    return " ".join(w for w in text.split() if w not in stop)


def question(slug: str, attempts: int = 3) -> dict | None:
    body = json.dumps({"query": QUERY, "variables": {"t": slug}})
    for attempt in range(attempts):
        proc = subprocess.run(
            [
                "curl", "-sS", "--max-time", "25", "-X", "POST",
                "https://leetcode.com/graphql",
                "-H", "content-type: application/json",
                "-H", "user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
                "-H", f"referer: https://leetcode.com/problems/{slug}/",
                "-d", body,
            ],
            capture_output=True,
            text=True,
        )
        try:
            data = json.loads(proc.stdout)
        except json.JSONDecodeError:
            data = None
        got = ((data or {}).get("data") or {}).get("question")
        if got and got.get("difficulty"):
            return got
        time.sleep(1.0 * (attempt + 1))
    return None


def main() -> int:
    items = json.loads((RAW / "base_items.json").read_text())
    codolio = json.loads((RAW / "codolio.json").read_text())

    by_title: dict[str, list[str]] = {}
    for row in codolio:
        slug = lc_slug(row.get("problemUrl"))
        if slug:
            by_title.setdefault(norm(row.get("title")), []).append(slug)

    no_lc = [i for i in items if i["layout"] == "practice" and not i.get("leetcodeUrl")]
    candidates: dict[str, list[str]] = {}
    unresolved: list[str] = []
    for item in no_lc:
        suspect = lc_slug(item.get("leetcodeUrl"))
        if suspect in SUSPECT:
            candidates[item["tufId"]] = []
            unresolved.append(suspect)
        for slug in by_title.get(norm(item["title"]), []):
            candidates.setdefault(item["tufId"], []).append(slug)
    for old, options in RENAMED.items():
        candidates[f"canonical:{old}"] = options

    slugs = sorted({s for v in candidates.values() for s in v})
    print(f"{len(slugs)} candidate slugs to check across {len(candidates)} problems/renames")
    with ThreadPoolExecutor(max_workers=6) as pool:
        metas = dict(zip(slugs, pool.map(question, slugs)))

    extra, canonical, rejected = {}, {}, []
    for key, slug_list in candidates.items():
        if isinstance(key, str) and key.startswith("canonical:"):
            old = key.split(":", 1)[1]
            for slug in slug_list:
                if slug in metas:
                    canonical[old] = {
                        "url": f"https://leetcode.com/problems/{slug}/",
                        "title": metas[slug]["title"],
                        "difficulty": metas[slug]["difficulty"],
                        "isPaidOnly": metas[slug]["isPaidOnly"],
                    }
                    break
            continue
        item = next(i for i in no_lc if i["tufId"] == key)
        for slug in slug_list:
            meta = metas.get(slug)
            if not meta:
                continue
            target = norm(item["title"])
            if norm(meta["title"]) == target:
                extra[key] = {
                    "url": f"https://leetcode.com/problems/{slug}/",
                    "title": meta["title"],
                    "difficulty": meta["difficulty"],
                    "isPaidOnly": meta["isPaidOnly"],
                    "match": "exact-title",
                }
                break
            rejected.append((item["title"], slug, meta["title"]))

    (RAW / "leetcode_extra.json").write_text(
        json.dumps({"extra": extra, "canonical": canonical}, ensure_ascii=False, indent=1)
    )
    print(f"accepted {len(extra)} extra leetcode links, {len(canonical)} canonical renames")
    for tid, row in extra.items():
        title = next(i["title"] for i in no_lc if i["tufId"] == tid)
        print(f"  + {title} -> {row['url']} ({row['difficulty']})")
    for old, row in canonical.items():
        print(f"  ~ {old} -> {row['url']} ({row['difficulty']})")
    if rejected:
        print(f"\nrejected {len(rejected)} fuzzy codolio suggestions, e.g.:")
        for sheet_title, slug, lc_title in rejected[:8]:
            print(f"  - {sheet_title!r} vs leetcode {lc_title!r} ({slug})")
    missing = [s for s in slugs if s not in metas]
    if missing:
        print(f"\ncould not resolve on leetcode ({len(missing)}): {missing}")
    if unresolved:
        print(f"stale takeuforward leetcode links handled via RENAMED: {sorted(set(unresolved))}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
