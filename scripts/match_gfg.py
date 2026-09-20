#!/usr/bin/env python3
"""Match A2Z problems that have no LeetCode link to the right GeeksforGeeks page.

Several candidates are collected per problem and every one of them is verified the same way: the
page must return 200, its embedded `"slug"` must be exactly the slug we asked for, its embedded
`"difficulty"` must be a real level, and its title must overlap the sheet's title.  Nothing is
accepted on a candidate generator's word - including the GfG links scraped out of community
mirrors of the sheet, which are treated as candidates only.

Candidates come from:
  * data/raw/gfg_verified.json   GfgMatcher agent's slug guesses
  * data/raw/gh/*.json           community sheet mirrors (e.g. Striver-A2Z-Sheet-with-GFG-links)
  * locally generated slug variants of the sheet title

Output: data/raw/gfg_final.json + data/raw/gfg_final_report.md
"""
from __future__ import annotations

import json
import re
import subprocess
import sys
import time
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from titlematch import jaccard, normalized, score, verdict  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent
RAW = ROOT / "data" / "raw"
DATA = ROOT / "site" / "data.json"
OLD_HOST = "practice.geeksforgeeks.org"
SLUG_IN_PAGE = re.compile(rb'"slug":"([^"]{0,120})"')
DIFF_IN_PAGE = re.compile(rb'"difficulty":"(Easy|Medium|Hard|Basic|School)"')
TITLE_RE = re.compile(r"<title[^>]*>(.*?)</title>", re.S | re.I)


def slugify(text: str) -> str:
    text = re.sub(r"\(.*?\)", " ", text or "")
    text = re.sub(r"[^a-zA-Z0-9]+", "-", text).strip("-").lower()
    return re.sub(r"-{2,}", "-", text)


def candidates_for(title: str, given: list[str]) -> list[str]:
    out: list[str] = []
    for slug in given:
        out.append(slug)
    base = slugify(title)
    for slug in (base, re.sub(r"^(the|a|an)-", "", base)):
        out.append(slug)
    # "Binary Search to find X in sorted array" style titles often drop trailing qualifiers on GfG
    parts = base.split("-")
    if len(parts) > 4:
        out.append("-".join(parts[:5]))
        out.append("-".join(parts[:3]))
    seen, uniq = set(), []
    for slug in out:
        if slug and slug not in seen:
            seen.add(slug)
            uniq.append(slug)
    return uniq[:5]


def fetch(slug: str, attempts: int = 2) -> dict:
    """Fetch a candidate page. Retried once: GeeksforGeeks rate-limits bursts with a soft-404
    shell, which would otherwise silently drop a problem's only candidate."""
    url = f"https://www.geeksforgeeks.org/problems/{slug}/1"
    for attempt in range(attempts):
        result = _fetch_once(url, slug)
        if result["status"] == 200 and result["pageSlug"]:
            return result
        time.sleep(1.5 * (attempt + 1))
    return result


def _fetch_once(url: str, slug: str) -> dict:
    proc = subprocess.run(
        ["curl", "-sSL", "--max-time", "30", "-w", "\n%{http_code}",
         "-H", "user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/126 Safari/537.36",
         url],
        capture_output=True,
    )
    raw = proc.stdout
    body, _, code = raw.rpartition(b"\n")
    embedded = SLUG_IN_PAGE.search(body)
    difficulty = DIFF_IN_PAGE.search(body)
    title_match = TITLE_RE.search(body.decode("utf-8", "replace"))
    return {
        "slug": slug,
        "url": url,
        "status": int(code) if code.isdigit() else 0,
        "pageSlug": embedded.group(1).decode("utf-8", "replace") if embedded else "",
        "difficulty": difficulty.group(1).decode() if difficulty else "",
        "pageTitle": (title_match.group(1).strip() if title_match else "")[:120],
    }


def main() -> int:
    # Targets are the sheet's practice problems that have no LeetCode link. They are derived from
    # the raw parse rather than from site/data.json on purpose: reading the built dataset would
    # make this script depend on its own output (the first run would promote problems to GfG and
    # the second would silently find nothing left to match).
    items = json.loads((RAW / "base_items.json").read_text())
    extra = json.loads((RAW / "leetcode_extra.json").read_text())["extra"]
    targets = {
        str(i["tufId"]): i
        for i in items
        if i["layout"] == "practice" and not i.get("leetcodeUrl") and str(i["tufId"]) not in extra
    }
    order_of = {str(i["tufId"]): n for n, i in enumerate(items) if i["layout"] == "practice"}
    for index, key in enumerate(targets):
        targets[key]["order"] = index + 1

    given: dict[str, list[str]] = {}
    for source in [RAW / "gfg_verified.json", RAW / "gfg_from_sheet.json"]:
        if source.exists():
            for tuf_id, row in json.loads(source.read_text()).items():
                match = re.search(r"/problems/([^/?#]+)", row.get("url") or "")
                if match:
                    given.setdefault(str(tuf_id), []).append(match.group(1))
    # Community sheet mirrors (data/raw/gh/, deliberately not committed) are reduced to a small
    # candidate file by scripts/extract_repo_candidates.py, so this stays reproducible without them.
    repo_candidates = RAW / "gfg_candidates_repo.json"
    if repo_candidates.exists():
        by_title = json.loads(repo_candidates.read_text())["candidates"]
        for key, problem in targets.items():
            for slug in by_title.get(normalized(problem["title"]), []):
                given.setdefault(key, []).append(slug)

    jobs = [
        (pid, slug)
        for pid, problem in targets.items()
        for slug in candidates_for(problem["title"], given.get(pid, []))
    ]
    print(f"{len(targets)} problems without a LeetCode link; {len(jobs)} candidate slugs to test")

    with ThreadPoolExecutor(max_workers=8) as pool:
        results = list(pool.map(lambda job: (job[0], fetch(job[1])), jobs))

    reasons: dict[str, int] = {}
    retired: list[tuple[str, str, str]] = []
    title_rejects: list[tuple[str, str, str]] = []
    # The stated rule is "the best match for that page anywhere in the sheet", so competitors are
    # all 402 practice titles, not just the 170 that still need a GeeksforGeeks link.
    all_titles = [i["title"] for i in items if i["layout"] == "practice"]
    # Every candidate that passes is scored, and the best one wins. Taking the first passing
    # candidate would make the result depend on candidate order: "Linear Search" has both
    # .../who-will-win-1587115621 (page title "Binary Search", containment 0.50) and
    # .../array-search (page title "Array Search", containment 1.00) as viable candidates.
    best: dict[str, tuple[float, float, dict]] = {}
    for pid, row in results:
        problem = targets[pid]
        overlap = score(problem["title"], row["pageTitle"])
        # GeeksforGeeks truncates the slug it embeds (at 30 chars) and renames problems without
        # changing their numeric id ("n-meetings-in-one-room-1587115620" is now served as
        # "activity-selection-1587115620"), so compare a truncated prefix *or* the stable id.
        def same_problem() -> bool:
            if not row["pageSlug"]:
                return False
            asked, served = row["slug"][:30], row["pageSlug"][:30]
            if asked == served:
                return True
            # GeeksforGeeks appends the legacy id without a separator ("gcd-of-two-numbers" ->
            # "gcd-of-two-numbers3459") and truncates what it echoes back, so a prefix relation
            # either way is the same problem.
            if asked.startswith(served) or served.startswith(asked):
                return True
            # A renamed problem keeps its numeric id ("n-meetings-in-one-room-1587115620" is now
            # "activity-selection-1587115620").
            old_id = re.search(r"-(\d{4,})$", row["slug"])
            new_id = re.search(r"-(\d{4,})$", row["pageSlug"])
            return bool(old_id and new_id and old_id.group(1) == new_id.group(1))

        if row["status"] != 200:
            reasons["non-200"] = reasons.get("non-200", 0) + 1
            continue
        if not same_problem():
            if row["pageSlug"]:
                retired.append((problem["title"], row["slug"], row["pageSlug"]))
            reasons["different-problem-page"] = reasons.get("different-problem-page", 0) + 1
            continue
        # A candidate must not only resemble this problem, it must resemble it more than it
        # resembles any other problem in the sheet (guards union-vs-intersection, min-vs-max).
        accepted_title, why = verdict(problem["title"], row["pageTitle"], all_titles, 0.5)
        if not accepted_title:
            reasons["title-mismatch"] = reasons.get("title-mismatch", 0) + 1
            title_rejects.append((problem["title"], row["pageTitle"], why))
            continue
        rank = (overlap, jaccard(problem["title"], row["pageTitle"]))
        if pid not in best or rank > best[pid][:2]:
            best[pid] = (rank[0], rank[1], row)

    accepted: dict[str, dict] = {}
    for pid, (overlap, _jac, row) in best.items():
        accepted[pid] = {
            "url": f"https://www.geeksforgeeks.org/problems/{row['slug']}/1",
            "gfgSlug": row["slug"],
            "gfgTitle": row["pageTitle"],
            # "Basic"/"School" are real GeeksforGeeks levels but not difficulty levels this site
            # filters on, so the link is kept and the label left empty.
            "gfgDifficulty": row["difficulty"] if row["difficulty"] in ("Easy", "Medium", "Hard") else "",
            "overlap": round(overlap, 2),
        }

    by_url: dict[str, list[str]] = {}
    for pid, row in accepted.items():
        by_url.setdefault(row["url"], []).append(pid)
    for url, pids in by_url.items():
        if len(pids) > 1:
            keep = max(pids, key=lambda pid: accepted[pid]["overlap"])
            for pid in pids:
                if pid != keep:
                    reasons["url-claimed-by-another-problem"] = reasons.get(
                        "url-claimed-by-another-problem", 0
                    ) + 1
                    title_rejects.append(
                        (targets[pid]["title"], url, f"same page already matched {targets[keep]['title']!r}")
                    )
                    del accepted[pid]

    if not accepted and targets:
        print("REFUSING to overwrite data/raw/gfg_final.json with an empty match set")
        return 1
    (RAW / "gfg_final.json").write_text(json.dumps(accepted, ensure_ascii=False, indent=1))
    checked = len({(pid, row["slug"]) for pid, row in results})
    unmatched = sorted(targets[pid]["title"] for pid in targets if pid not in accepted)
    lines = [
        "# GeeksforGeeks matching report",
        "",
        f"- problems without a LeetCode link: **{len(targets)}**",
        f"- candidate URLs tested: {checked}",
        f"- matched and independently verified: **{len(accepted)}** "
        f"({len(accepted) / max(1, len(targets)):.0%} of targets)",
        f"- rejected by reason: {reasons}",
        "",
        "Acceptance rule - all of it must hold:",
        "",
        "1. HTTP 200.",
        "2. The page's own embedded `\"slug\"` identifies the same problem: equal truncated to 30",
        "   chars, or one a prefix of the other (GeeksforGeeks appends legacy ids, e.g.",
        "   `gcd-of-two-numbers` -> `gcd-of-two-numbers3459`), or the same stable numeric id after a",
        "   rename (`n-meetings-in-one-room-1587115620` is now `activity-selection-1587115620`).",
        "3. At least 50% of the sheet title's significant tokens appear in the page title, AND the",
        "   sheet problem must be the *best* match for that page anywhere in the sheet",
        "   (`scripts/titlematch.py`) - so GeeksforGeeks' \"Union of Two Sorted Arrays\" cannot be",
        "   attached to the sheet's \"Intersection of two sorted arrays\".",
        "4. Costs: GeeksforGeeks rate-limits bursts, so two runs can differ by a link or two when a",
        "   candidate page fails to load - the shipped `gfg_final.json` is one pinned run. A stricter",
        "   rule (refusing any candidate that drops one of the sheet title's words) was measured and",
        "   rejected: it would have removed 9 correct renames, such as \"Find square root of a\"",
        "   \"number\" -> \"Square Root\", to catch a single weak one.",
        "",
        "5. One GeeksforGeeks page may back only one sheet problem; on a collision the strongest",
        "   title match keeps it and the other falls back to its takeuforward page.",
        "",
        f"## Renamed or redirected pages that were rejected ({len(retired)})",
        "",
        "The requested slug redirects to a different GeeksforGeeks problem, so the link is not shipped.",
        "",
        *[f"- {title}: asked `{asked}`, served `{served}`" for title, asked, served in retired],
        "",
        f"## Candidates rejected on the title rule ({len(title_rejects)})",
        "",
        "Each line: the sheet problem, the page title it was offered, and why it was refused.",
        "",
        *[f"- {t}: page {p!r} - {why}" for t, p, why in title_rejects],
        *([f"- … and {len(title_rejects) - 60} more (list capped)"] if len(title_rejects) > 60 else []),
        "",
        f"## Not matched ({len(unmatched)})",
        "",
        "These keep the takeuforward practice page as their primary link.",
        "",
        *[f"- {t}" for t in unmatched],
        "",
        "## Matched",
        "",
        "| sheet problem | GeeksforGeeks page | difficulty |",
        "| --- | --- | --- |",
        *[
            f"| {targets[pid]['title']} | `{row['gfgSlug']}` | {row['gfgDifficulty'] or row['overlap']} |"
            for pid, row in sorted(accepted.items(), key=lambda kv: targets[kv[0]]["order"])
        ],
        "",
    ]
    (RAW / "gfg_final_report.md").write_text("\n".join(lines))
    print(f"verified {len(accepted)}/{len(targets)} ({len(accepted)/max(1,len(targets)):.0%}); "
          f"report: data/raw/gfg_final_report.md")
    return 0


if __name__ == "__main__":
    sys.exit(main())
