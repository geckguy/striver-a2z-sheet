#!/usr/bin/env python3
"""Fail loudly if the README's numbers drift from site/data.json.

A hand-typed README table rots the moment the pipeline reruns.  This parses the
`<!-- stats:start --> ... <!-- stats:end -->` table in README.md, recomputes every value from the
built dataset, and requires an exact one-to-one key match - so deleting a row fails too, not
just editing a stale number.

Run it after scripts/build_data.py; it is also the guard the deploy workflow could call.
"""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
README = ROOT / "README.md"
DATA = ROOT / "site" / "data.json"
BLOCK_RE = re.compile(r"<!-- stats:start -->(.*?)<!-- stats:end -->", re.S)
ROW_RE = re.compile(r"^\|\s*([a-z0-9_]+)\s*\|\s*\**(\d[\d,]*)\**\s*\|", re.M)


def measured(problems: list[dict], meta: dict) -> dict[str, int]:
    alt = [a for p in problems for a in p["altUrls"]]
    return {
        "problems": len(problems),
        "modules": len(meta["steps"]),
        "leetcode_links": sum(1 for p in problems if p["platform"] == "leetcode"),
        "gfg_links": sum(1 for p in problems if p["platform"] == "gfg"),
        "takeuforward_links": sum(1 for p in problems if p["platform"] == "takeuforward"),
        "gfg_alt_links": sum(1 for a in alt if a["platform"] == "gfg"),
        "leetcode_alt_links": sum(1 for a in alt if a["platform"] == "leetcode"),
        "with_difficulty": sum(1 for p in problems if p["difficulty"]),
        "paid_leetcodes": sum(1 for p in problems if p["premium"]),
        "with_video": sum(1 for p in problems if p["video"]),
        "with_article": sum(1 for p in problems if p["article"]),
        "with_alt_link": sum(1 for p in problems if p["altUrls"]),
    }


def main() -> int:
    data = json.loads(DATA.read_text())
    problems, meta = data["problems"], data["meta"]
    want = measured(problems, meta)

    text = README.read_text()
    block = BLOCK_RE.search(text)
    if not block:
        print("FAIL: README.md has no <!-- stats:start --> table")
        return 1

    got: dict[str, int] = {}
    for key, raw in ROW_RE.findall(block.group(1)):
        if key in got:
            print(f"FAIL: duplicate key {key!r} in the stats table")
            return 1
        got[key] = int(raw.replace(",", ""))

    failures = []
    for key, value in sorted(want.items()):
        if key not in got:
            failures.append(f"missing row: {key} (should be {value})")
        elif got[key] != value:
            failures.append(f"{key}: README says {got[key]}, data.json says {value}")
    for key in sorted(set(got) - set(want)):
        failures.append(f"unknown row: {key}")

    checked = len(got)
    print(f"compared {checked} rows (expected {len(want)})")
    if checked != len(want):
        failures.append(f"row count {checked} != expected {len(want)}")
    if failures:
        print("FAIL")
        for f in failures:
            print("  ✗", f)
        return 1
    print("README stats match site/data.json exactly")
    return 0


if __name__ == "__main__":
    sys.exit(main())
