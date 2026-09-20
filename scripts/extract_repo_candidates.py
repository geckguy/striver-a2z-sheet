#!/usr/bin/env python3
"""Reduce the community sheet mirrors to the only thing we use from them: GfG candidate slugs.

`data/raw/gh/*.json` holds extracts of eleven GitHub repos that mirror Striver's sheet. They are
third-party copies (not committed - `data/raw/gh/` is gitignored), several megabytes of them, and
the only useful signal is the GeeksforGeeks URL that some of those mirrors kept from the official
sheet's old four-column layout. This script keeps that signal in a small file keyed by normalized
problem title, so `scripts/match_gfg.py` stays reproducible without the mirrors on disk.

Output: data/raw/gfg_candidates_repo.json  {"<normalized title>": ["<gfg slug>", ...]}
"""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(Path(__file__).resolve().parent))
from titlematch import normalized as norm  # noqa: E402

RAW = ROOT / "data" / "raw"
MIRRORS = RAW / "gh"
SLUG_RE = re.compile(r"geeksforgeeks\.org/(?:problems/)?([^/?#]+)")


def main() -> int:
    if not MIRRORS.is_dir():
        print(f"no mirror extracts at {MIRRORS} - nothing to do")
        return 0
    candidates: dict[str, list[str]] = {}
    sources: dict[str, list[str]] = {}
    for path in sorted(MIRRORS.glob("*.json")):
        rows = json.loads(path.read_text())
        for row in rows:
            url = row.get("practiceUrl") or ""
            match = SLUG_RE.search(url)
            if not match:
                continue
            key = norm(row.get("title"))
            if not key:
                continue
            slug = match.group(1)
            bucket = candidates.setdefault(key, [])
            if slug not in bucket:
                bucket.append(slug)
                sources.setdefault(slug, []).append(path.stem)
    out = RAW / "gfg_candidates_repo.json"
    out.write_text(json.dumps(
        {"candidates": candidates, "provenance": {k: v for k, v in sources.items()}},
        ensure_ascii=False, indent=1, sort_keys=True,
    ))
    print(f"{len(candidates)} titles, {sum(len(v) for v in candidates.values())} candidate slugs "
          f"from {len(list(MIRRORS.glob('*.json')))} mirrors -> {out.name} "
          f"({out.stat().st_size / 1024:.0f} KB)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
