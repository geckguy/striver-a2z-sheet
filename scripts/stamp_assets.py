#!/usr/bin/env python3
"""Stamp the site's asset URLs with a content hash.

Why this exists: GitHub Pages serves every file with `cache-control: max-age=600`. When only
`index.html` is revalidated while `app.js` is still fresh in the browser's cache, the page pairs
new markup with old script - and on 20 Sept 2026 that exact state crashed the tracker
("can't access property setAttribute, svg is null": the old script still looked for the ring the
redesign had removed). A hash in the URL makes such a mix impossible: new markup asks for a URL
the cache has never seen.

Usage:
  python3 scripts/stamp_assets.py            # rewrite site/index.html in place
  python3 scripts/stamp_assets.py --check    # exit 1 if the stamps are missing or stale

The committed index.html stays unstamped (readable diffs); the deploy workflow stamps it, so the
published page is always stamped.
"""
from __future__ import annotations

import argparse
import hashlib
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
INDEX = ROOT / "site" / "index.html"
ASSETS = {"app.js": r'(\./app\.js)(\?v=[0-9a-f]+)?"', "styles.css": r'(\./styles\.css)(\?v=[0-9a-f]+)?"'}


def digest(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()[:10]


def stamp(check: bool) -> int:
    html = INDEX.read_text()
    stamped = html
    report = []
    for name, pattern in ASSETS.items():
        asset = ROOT / "site" / name
        if not asset.exists():
            print(f"missing asset: {asset}")
            return 1
        version = digest(asset)
        stamped = re.sub(pattern, lambda m, v=version: f'{m.group(1)}?v={v}"', stamped)
        report.append((name, version))

    for name, version in report:
        if f"{name}?v={version}" not in stamped:
            print(f"FAIL: {name} is not referenced with its content hash {version}")
            return 1

    if check:
        print("stamped: " + ", ".join(f"{n}?v={v}" for n, v in report))
        return 0

    if stamped != html:
        INDEX.write_text(stamped)
    print("stamped: " + ", ".join(f"{n}?v={v}" for n, v in report))
    return 0


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true", help="verify without writing")
    args = parser.parse_args()
    return stamp(args.check)


if __name__ == "__main__":
    sys.exit(main())
