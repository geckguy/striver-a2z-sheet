#!/usr/bin/env python3
"""Merge the raw extracts into the single dataset the site loads: site/data.json.

Inputs (all optional except base_items.json):
  data/raw/base_items.json   parsed from the takeuforward sheet payload (scripts/parse_tuf.py)
  data/raw/leetcode.json     LeetCode GraphQL metadata, keyed by LC slug (scripts/fetch_leetcode.py)
  data/raw/gfg_verified.json verified GeeksforGeeks matches, keyed by tufId (GfgMatcher agent)
  data/raw/codolio.json      codolio sheet extract, keyed by normalized title (CodolioExtract agent)
  data/raw/link_health.json  per-URL HTTP status (LinkHealth agent)

Precedence for the primary link: healthy LeetCode > verified GeeksforGeeks > takeuforward practice page.
Difficulty precedence: LeetCode (authoritative for LC) > takeuforward tier alone when nothing else is known.
Every other working link is kept in altUrls so the reader can always pick a platform.
"""
from __future__ import annotations

import json
import re
import sys
from collections import Counter
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
RAW = ROOT / "data" / "raw"
OUT = ROOT / "site" / "data.json"

PLATFORM_LABEL = {
    "leetcode": "LeetCode",
    "gfg": "GeeksforGeeks",
    "codingninjas": "Coding Ninjas",
    "takeuforward": "TakeUForward",
}
LC_SLUG_RE = re.compile(r"/problems/([a-z0-9-]+)")


def load(name: str, default):
    path = RAW / name
    if not path.exists():
        print(f"  (missing {name} - continuing without it)")
        return default
    return json.loads(path.read_text())


def norm(text: str) -> str:
    """Loose key for cross-source title matching."""
    text = (text or "").lower()
    text = re.sub(r"\(.*?\)", " ", text)
    text = re.sub(r"[^a-z0-9]+", " ", text)
    stop = {"the", "a", "an", "of", "in", "on", "to", "and", "for", "with", "problem", "implement", "find"}
    return " ".join(w for w in text.split() if w not in stop)


def health(url: str | None, health_map: dict) -> tuple[str | None, bool]:
    """Return (usable url, moved).

    The status sweep is used only to drop links that positively 404/410. It never rewrites a URL:
    redirect targets carry tracking parameters (youtu.be becomes youtube.com/watch?si=... ) and
    making the shipped dataset depend on the sweep's presence would make the build non-deterministic.
    A 403 is a bot wall (LeetCode rejects plain curl), never evidence that a page is dead.
    """
    if not url:
        return None, False
    info = health_map.get(url)
    if not info:
        return url, False
    status = info.get("status")
    if isinstance(status, int) and status in (404, 410):
        return None, False
    return url, bool(info.get("moved"))


def main() -> int:
    items = load("base_items.json", None)
    if items is None:
        raise SystemExit("run scripts/parse_tuf.py first")
    leetcode = load("leetcode.json", {})
    extra = load("leetcode_extra.json", {"extra": {}, "canonical": {}})
    gfg = load("gfg_final.json", {})
    codolio = load("codolio.json", [])
    health_map = load("link_health.json", {})

    # codolio difficulty is the last-resort fallback. Its raw label "Basic" is Striver's tier,
    # not a difficulty, so only rows carrying a real Easy/Medium/Hard label are usable.
    codolio_difficulty: dict[str, str] = {}
    for row in codolio if isinstance(codolio, list) else []:
        diff = (row.get("difficultyRaw") or "").strip().title()
        if diff in ("Easy", "Medium", "Hard"):
            codolio_difficulty.setdefault(norm(row.get("title")), diff)

    # the sheet's own module order defines the step numbers the site groups by
    step_number: dict[str, int] = {}
    for item in items:
        name = (item["section"] or "").strip()
        if name and name not in step_number:
            step_number[name] = len(step_number) + 1

    problems, patches, unconfirmed = [], [], []
    for item in items:
        if item.get("layout") != "practice":
            continue
        tuf_id = item["tufId"]
        lc_match = LC_SLUG_RE.search(item.get("leetcodeUrl") or "")
        lc_slug = lc_match.group(1) if lc_match else None
        lc_meta = leetcode.get(lc_slug or "", {})
        if not lc_meta and lc_slug in extra["canonical"]:
            row = extra["canonical"][lc_slug]
            lc_meta = {"title": row["title"], "difficulty": row["difficulty"], "isPaidOnly": row["isPaidOnly"]}
            item = {**item, "leetcodeUrl": row["url"]}
            lc_slug = LC_SLUG_RE.search(row["url"]).group(1)
        added = extra["extra"].get(str(tuf_id))
        if not item.get("leetcodeUrl") and added:
            item = {**item, "leetcodeUrl": added["url"]}
            lc_slug, lc_meta = LC_SLUG_RE.search(added["url"]).group(1), added
        # The sheet sometimes links a login wall (Celebrity Problem points at
        # /accounts/login/?next=/problems/find-the-celebrity/) or a stale slug. Ship the canonical
        # URL for the confirmed slug instead, and never ship a LeetCode link that LeetCode's own
        # API has not confirmed.
        if lc_slug and lc_meta:
            item = {**item, "leetcodeUrl": f"https://leetcode.com/problems/{lc_slug}/"}
        elif lc_slug and not lc_meta:
            unconfirmed.append((item["title"], item["leetcodeUrl"]))
            item = {**item, "leetcodeUrl": None}
            lc_slug = None
        gfg_row = gfg.get(str(tuf_id)) or {}

        lc_url, _ = health(item.get("leetcodeUrl"), health_map)
        tuf_url, _ = health(item.get("tufUrl"), health_map)
        gfg_url, _ = health(gfg_row.get("url"), health_map)
        article_url, _ = health(item.get("articleUrl"), health_map)
        video_url, _ = health(item.get("videoUrl"), health_map)

        if lc_url and lc_slug and not lc_meta:
            patches.append((item["title"], lc_url))

        if lc_url:
            platform, url = "leetcode", lc_url
        elif gfg_url:
            platform, url = "gfg", gfg_url
        else:
            platform, url = "takeuforward", tuf_url

        alt: list[dict] = []
        for plat, cand in (("leetcode", lc_url), ("gfg", gfg_url), ("takeuforward", tuf_url)):
            if cand and cand != url:
                alt.append({"platform": plat, "url": cand})

        # LeetCode is authoritative for its own problems; a GfG page we actually fetched beats a
        # third-party tracker; codolio is the last resort.
        if platform == "leetcode" and lc_meta.get("difficulty"):
            difficulty, source = lc_meta["difficulty"], "leetcode"
        elif gfg_row.get("gfgDifficulty") in ("Easy", "Medium", "Hard"):
            difficulty, source = gfg_row["gfgDifficulty"], "gfg"
        elif codolio_difficulty.get(norm(item["title"])):
            difficulty, source = codolio_difficulty[norm(item["title"])], "codolio"
        else:
            difficulty, source = "", ""

        problems.append(
            {
                "id": f"a2z-{tuf_id}",
                "order": 0,
                "title": item["title"],
                "step": step_number[(item["section"] or "").strip()],
                "stepTitle": (item["section"] or "").strip(),
                "topic": (item["topic"] or "").strip(),
                "tier": item.get("tier") or "",
                "difficulty": difficulty,
                "difficultySource": source,
                "platform": platform,
                "url": url,
                "altUrls": alt,
                "article": article_url,
                "video": video_url,
                "premium": bool(lc_meta.get("isPaidOnly")),
                "duration": item.get("duration") or "",
                "slug": item.get("slug") or "",
                "lcSlug": lc_slug or "",
            }
        )

    # sheet order == the order the takeuforward outline lists them in
    order_of = {item["tufId"]: n for n, item in enumerate(items)}
    problems.sort(key=lambda p: order_of[int(p["id"].split("-")[1])])
    for n, problem in enumerate(problems, 1):
        problem["order"] = n

    sections, seen = [], set()
    for problem in problems:
        if problem["stepTitle"] not in seen:
            seen.add(problem["stepTitle"])
            sections.append(problem["stepTitle"])

    lc_confirmed = sum(1 for p in problems if p["difficultySource"] == "leetcode")
    gfg_difficulty = sum(1 for p in problems if p["difficultySource"] == "gfg")

    data = {
        "meta": {
            "title": "Striver's A2Z DSA Sheet",
            "problemCount": len(problems),
            "stepCount": len(sections),
            "generated": date.today().isoformat(),
            "source": "https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/",
            "steps": [
                {
                    "n": n,
                    "title": name,
                    "count": sum(1 for p in problems if p["stepTitle"] == name),
                }
                for n, name in enumerate(sections, 1)
            ],
            "platforms": dict(Counter(p["platform"] for p in problems)),
            "withDifficulty": sum(1 for p in problems if p["difficulty"]),
            "sources": {
                "order,titles,links": "takeuforward.org sheet payload",
                "difficulty": ", ".join(
                    name for name, count in (
                        ("leetcode.com GraphQL", lc_confirmed),
                        ("geeksforgeeks.org pages", gfg_difficulty),
                        ("codolio.com", codolio_difficulty),
                    ) if count
                ),
                "gfgLinks": "verified GeeksforGeeks matches" if gfg else "n/a",
            },
        },
        "problems": problems,
    }

    errors = validate(data)
    if errors:
        print(json.dumps({k: v for k, v in data["meta"].items() if k != "steps"}, ensure_ascii=False, indent=1))
        print("\nVALIDATION FAILURES - refusing to write site/data.json:")
        for error in errors:
            print("  ✗", error)
        return 1

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(data, ensure_ascii=False, separators=(",", ":")))
    size = OUT.stat().st_size / 1024
    print(json.dumps({k: v for k, v in data["meta"].items() if k != "steps"}, ensure_ascii=False, indent=1))
    print("steps:")
    for step in data["meta"]["steps"]:
        print(f"  {step['n']:>2}. {step['title']:<28} {step['count']:>3}")
    print(f"\nwrote {OUT} ({size:.0f} KB)")
    print(f"difficulty sources: {Counter(p['difficultySource'] or 'unknown' for p in problems)}")
    print(f"alt-link coverage: {sum(1 for p in problems if p['altUrls'])}/{len(problems)}")
    if unconfirmed:
        print(f"dropped {len(unconfirmed)} leetcode link(s) LeetCode's API could not confirm:")
        for title, url in unconfirmed:
            print(f"  - {title}: {url}")
    if patches:
        print("leetcode URLs whose slug GraphQL could not resolve (check canonically):")
        for title, url in patches:
            print(f"  - {title}: {url}")
    print("validation: ok")
    return 0


def validate(data: dict) -> list[str]:
    problems, errors = data["problems"], []
    ids = [p["id"] for p in problems]
    if len(set(ids)) != len(ids):
        errors.append("duplicate ids")
    if [p["order"] for p in problems] != list(range(1, len(problems) + 1)):
        errors.append("order is not 1..n")
    for p in problems:
        if p["platform"] == "leetcode":
            if not p["lcSlug"]:
                errors.append(f"{p['id']}: leetcode platform without a slug")
            if p["url"] != f"https://leetcode.com/problems/{p['lcSlug']}/":
                errors.append(f"{p['id']}: non-canonical leetcode url {p['url']!r}")
            # LeetCode's GraphQL API confirms the slug and gives the difficulty in one response,
            # so a LeetCode row without a LeetCode-sourced difficulty means the link is unverified.
            if p["difficultySource"] != "leetcode":
                errors.append(f"{p['id']}: leetcode link not confirmed by the LeetCode API")
        if not p["title"]:
            errors.append(f"{p['id']}: empty title")
        if not p["url"] or not p["url"].startswith("http"):
            errors.append(f"{p['id']}: bad url {p['url']!r}")
        if p["platform"] not in PLATFORM_LABEL:
            errors.append(f"{p['id']}: unknown platform {p['platform']!r}")
        if p["difficulty"] and p["difficulty"] not in ("Easy", "Medium", "Hard"):
            errors.append(f"{p['id']}: bad difficulty {p['difficulty']!r}")
        if p["tier"] and p["tier"] not in ("basic", "core", "pro"):
            errors.append(f"{p['id']}: bad tier {p['tier']!r}")
        if p["platform"] == "gfg" and "geeksforgeeks.org" not in p["url"]:
            errors.append(f"{p['id']}: gfg platform without gfg url")
        if p["platform"] == "leetcode" and "leetcode.com" not in p["url"]:
            errors.append(f"{p['id']}: leetcode platform without leetcode url")
        if p["platform"] == "takeuforward" and "takeuforward.org" not in p["url"]:
            errors.append(f"{p['id']}: takeuforward platform without takeuforward url")
    listed = sum(s["count"] for s in data["meta"]["steps"])
    if listed != len(problems):
        errors.append(f"step counts sum to {listed}, not {len(problems)}")
    if len(data["meta"]["steps"]) != data["meta"]["stepCount"]:
        errors.append("stepCount mismatch")
    if [s["n"] for s in data["meta"]["steps"]] != list(range(1, data["meta"]["stepCount"] + 1)):
        errors.append("step numbers are not 1..stepCount")
    for p in problems:
        if not isinstance(p["step"], int) or not 1 <= p["step"] <= data["meta"]["stepCount"]:
            errors.append(f"{p['id']}: step {p['step']!r} out of range")
        if p["stepTitle"] != data["meta"]["steps"][p["step"] - 1]["title"]:
            errors.append(f"{p['id']}: stepTitle {p['stepTitle']!r} disagrees with step {p['step']}")
    return errors


if __name__ == "__main__":
    sys.exit(main())
