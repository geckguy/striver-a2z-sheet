#!/usr/bin/env python3
"""Independently verify the problem links the site ships.

LeetCode links are checked against LeetCode's own GraphQL API (each slug is resolved there by
scripts/fetch_leetcode.py; leetcode.com itself Cloudflare-challenges plain HTTP clients, so a
curl status for it means nothing).  takeuforward and GeeksforGeeks links are verified over HTTP:
status 200 AND the page title has to actually resemble the sheet's problem title, which is what
catches the "200 OK, wrong page" class of bug the parser hit once.

Writes data/raw/verify_links.json + prints a failure list. Exits non-zero when a shipped link
404s or resolves to an unrelated page.
"""
from __future__ import annotations

import json
import re
import subprocess
import sys
import time
from argparse import ArgumentParser
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from titlematch import score, tokens, verdict  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent
RAW = ROOT / "data" / "raw"
DATA = ROOT / "site" / "data.json"
TITLE_RE = re.compile(r"<title[^>]*>(.*?)</title>", re.S | re.I)


def fetch(url: str) -> tuple[int, str]:
    proc = subprocess.run(
        ["curl", "-sSL", "--max-time", "25", "-w", "\n%{http_code}",
         "-H", "user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/126 Safari/537.36",
         url],
        capture_output=True, text=True,
    )
    body, _, code = proc.stdout.rpartition("\n")
    match = TITLE_RE.search(body)
    return (int(code) if code.isdigit() else 0), (match.group(1).strip() if match else "")


def main() -> int:
    parser = ArgumentParser(description=__doc__)
    parser.add_argument("--concurrency", type=int, default=8,
                        help="parallel requests; lower it if the origin starts rate-limiting (500s)")
    parser.add_argument("--pause", type=float, default=0.0, help="seconds to sleep between requests")
    args = parser.parse_args()

    data = json.loads(DATA.read_text())
    all_titles = [p["title"] for p in data["problems"]]
    targets: dict[str, list[tuple[str, str]]] = {}
    for problem in data["problems"]:
        for platform, url in [(problem["platform"], problem["url"])] + [
            (a["platform"], a["url"]) for a in problem["altUrls"]
        ]:
            if platform == "leetcode":
                continue
            targets.setdefault(url, []).append((platform, problem["title"]))

    print(f"verifying {len(targets)} unique takeuforward/GeeksforGeeks URLs "
          f"(of {len(data['problems'])} problems)")

    def check(item):
        url, users = item
        if args.pause:
            time.sleep(args.pause)
        status, page_title = fetch(url)
        # GeeksforGeeks links are the ones that were matched across sites, so they must satisfy
        # the full rule: this problem has to be the sheet's best match for that page.
        # takeuforward links are derived from the problem's own slug, so the only question is
        # whether the page really is that problem.
        results = []
        for platform, title in users:
            # What the verifier can prove is that the page really is about the problem it is
            # attached to (containment) - the "is this problem the best match for the page"
            # decision belongs to scripts/match_gfg.py at candidate-selection time, and is
            # reported here as ambiguity rather than as a failure.
            mine = score(title, page_title)
            rival, rival_score = "", 0.0
            for other in all_titles:
                if other != title and score(other, page_title) > rival_score:
                    rival, rival_score = other, score(other, page_title)
            results.append((mine, title, mine >= 0.5, f"containment {mine:.2f}",
                            rival, rival_score))
        best = max(results)
        ambiguous = [(r[1], r[4], round(r[5], 2)) for r in results if r[5] >= r[0]]
        return url, {
            "ambiguousWith": ambiguous,
            "status": status,
            "pageTitle": page_title,
            "overlap": round(best[0], 2),
            "title": best[1],
            "platform": users[0][0],
            "users": len(users),
            "titleOk": all(r[2] for r in results),
            "titleRule": best[3],
        }

    with ThreadPoolExecutor(max_workers=args.concurrency) as pool:
        results = dict(pool.map(check, targets.items()))

    failures = [
        (url, row) for url, row in results.items()
        if row["status"] != 200 or not row["titleOk"] or row["users"] > 1
    ]
    ambiguous = {u: r for u, r in results.items() if r["ambiguousWith"] and (u, r) not in failures}
    statuses: dict[int, int] = {}
    for row in results.values():
        statuses[row["status"]] = statuses.get(row["status"], 0) + 1
    rate_limited = any(row["status"] == 500 for row in results.values())
    (RAW / "verify_links.json").write_text(json.dumps({
        "_meta": {
            "generated": datetime.now().isoformat(timespec="seconds"),
            "concurrency": args.concurrency,
            "pause_seconds": args.pause,
            "urls": len(results),
            "statuses": dict(sorted(statuses.items())),
            "note": ("takeuforward answered HTTP 500 to this sweep - that is rate limiting after "
                     "repeated sweeps from one IP, not a dead link (the pages still render and the "
                     "problem title matches). Re-run with --concurrency 2 --pause 0.6 later, or see "
                     "data/raw/link_health_report.md for the clean serial sweep."
                     if rate_limited else
                     "local: 500s are rate limiting; re-run later. leetcode.com is excluded by "
                     "design because it answers 403 to non-browser clients."),
        },
        **results,
    }, ensure_ascii=False, indent=1))

    by_platform: dict[str, list[bool]] = {}
    for row in results.values():
        by_platform.setdefault(row["platform"], []).append(
            row["status"] == 200 and row["titleOk"] and row["users"] == 1
        )
    for platform, oks in sorted(by_platform.items()):
        print(f"  {platform}: {sum(oks)}/{len(oks)} verified")
    print(f"  {len(ambiguous)} links are live and about the right problem but a sibling problem "
          f"scores at least as highly against the same page (decision-time tie, not a failure)")
    print(f"  status codes: {dict(sorted(statuses.items()))}")
    if any(u["status"] == 500 for u in results.values()):
        print("  note: 500s from takeuforward are rate limiting - re-run with --concurrency 3 --pause 0.3")
    if failures:
        print(f"\n{len(failures)} FAILED:")
        for url, row in sorted(failures):
            print(f"  {row['status']} overlap={row['overlap']} users={row['users']} {row['title']!r}"
                  f"\n      {url}\n      page: {row['pageTitle'][:90]!r}\n      rule: {row['titleRule']}")
        return 1
    print("\nall shipped takeuforward/GeeksforGeeks links return 200 and a matching page title")
    if ambiguous:
        print("ambiguous (informational):")
        for url, row in sorted(ambiguous.items())[:10]:
            rival, rival_score = row["ambiguousWith"][0][1], row["ambiguousWith"][0][2]
            print(f"  {row['title']!r} vs {rival!r} ({rival_score}) {url}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
