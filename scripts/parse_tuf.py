#!/usr/bin/env python3
"""Parse Striver's A2Z DSA Sheet out of the takeuforward sheet page payload.

The sheet page (https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/)
is a Next.js App Router page: the whole syllabus ships inside the RSC flight payload
(`self.__next_f.push([1,"..."])` chunks).  We decode that payload and read two objects:

  * `<sheetId>:sheet.sheet_syllabus` holds `fields` (18 row schemas) and `rows`, where every row is
    `[schemaIndex, *values]` and rows reference each other through `children` (categories) and
    `topic_tags` / `pattern_tags` refs.
  * `...:syllabusOutline`, the canonical sidebar outline, which carries the real
    `/practice/dsa/<slug>?category=<topic>&source=strivers-a2z-dsa-sheet` href for every item.

Output: data/base_items.json (one record per unique sheet item).
"""
from __future__ import annotations

import html
import json
import re
import sys
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
RAW = ROOT / "data" / "raw"
PUSH_RE = re.compile(r"self\.__next_f\.push\((\[.*?\])\)</script>", re.S)
DEC = json.JSONDecoder()


def flight_payload(page: str) -> str:
    """Join every streamed RSC chunk into one payload string."""
    buf: list[str] = []
    for chunk in PUSH_RE.findall(page):
        try:
            arr = json.loads(chunk)
        except json.JSONDecodeError:
            continue
        if len(arr) > 1 and isinstance(arr[1], str):
            buf.append(arr[1])
    return "".join(buf)


def find_object(payload: str, key: str) -> dict:
    """Decode the JSON object literal that follows `"key":` in the payload."""
    at = payload.index(f'"{key}":')
    brace = payload.index("{", at + len(key) + 3)
    return DEC.raw_decode(payload, brace)[0]


def parse_syllabus(payload: str) -> dict:
    """Return {'fields': [...], 'rows': [...], 'roots': [...]} for the sheet syllabus."""
    for line in payload.split("\n"):
        _, _, body = line.partition(":")
        if '"sheet_syllabus"' in body and '"rows"' in body:
            return find_object(body, "sheet_syllabus")
    raise SystemExit("sheet_syllabus not found in payload")


def parse_outline(payload: str) -> dict:
    return find_object(payload, "syllabusOutline")


def flatten_outline(nodes: list[dict], path: list[str], out: list[tuple[list[str], dict]]) -> None:
    for node in nodes:
        if node.get("children"):
            flatten_outline(node["children"], path + [node["label"]], out)
        else:
            out.append((path, node))


def main() -> int:
    page = (RAW / "tuf_sheet.html").read_text(encoding="utf-8")
    payload = flight_payload(page)
    syllabus = parse_syllabus(payload)
    outline = parse_outline(payload)

    fields, rows = syllabus["fields"], syllabus["rows"]

    def rowdict(row: list) -> dict:
        return dict(zip(fields[row[0]], row[1:]))

    records: dict[int, dict] = {}
    order: list[int] = []

    def walk(index: int, path: list[str]) -> None:
        row = rowdict(rows[index])
        if row.get("type") == "category":
            for child in row.get("children") or []:
                walk(child, path + [row.get("label")])
            return
        if row["id"] not in records:
            order.append(row["id"])
            records[row["id"]] = {"path": path, "row": row}

    for root in syllabus["roots"]:
        walk(root, [])

    outline_flat: list[tuple[list[str], dict]] = []
    flatten_outline(outline["nodes"], [], outline_flat)
    # Keyed by (id, slug) for the same reason as the href map below: the outline's id namespace
    # collides with the syllabus' contest ids, and an id-keyed map lets a contest node overwrite a
    # real item's path ("Reverse a number" ended up tagged "Greedy Algorithms").
    outline_path: dict[tuple[int, str], list[str]] = {}
    for path, node in outline_flat:
        slug = (node.get("href") or "").split("?", 1)[0].rsplit("/", 1)[-1]
        outline_path[(node["id"], slug)] = path
    # The outline's `id` namespace collides with the syllabus' contest ids, so an id-keyed href
    # map hands eleven problems a contest page ("Pattern 13" -> /practice/dsa/contest/405).
    # Keep an outline href only when it actually names this item; build the rest from the slug.
    outline_href: dict[tuple[int, str], str] = {}
    for _, node in outline_flat:
        href = node.get("href") or ""
        slug = href.split("?", 1)[0].rsplit("/", 1)[-1]
        outline_href[(node["id"], slug)] = href

    contest_href = {
        node["id"]: node["href"]
        for _, node in outline_flat
        if "/contest/" in (node.get("href") or "")
    }

    def practice_url(slug: str | None, tid: int) -> tuple[str | None, bool]:
        """Return (url, from_outline) for an item's takeuforward practice page."""
        if not slug:
            return None, False
        href = outline_href.get((tid, slug))
        if href and "/contest/" not in href:
            return f"https://takeuforward.org{href}", True
        # contest rows are not problems, but they still deserve a URL that resolves
        if tid in contest_href:
            return f"https://takeuforward.org{contest_href[tid]}", True
        return f"https://takeuforward.org/practice/dsa/{slug}", False

    items = []
    for tid in order:
        rec = records[tid]
        row, path = rec["row"], rec["path"]
        slug = row.get("slug")
        tuf_url, from_outline = practice_url(slug, tid)
        items.append(
            {
                "tufId": tid,
                "slug": slug,
                "title": (row.get("label") or "").strip(),
                "layout": row.get("layoutType"),
                "section": path[0] if path else "",
                "sectionPath": path,
                "topic": path[-1] if len(path) > 1 else (path[0] if path else ""),
                "outlineTopic": (outline_path.get((tid, slug)) or [""])[-1],
                "tier": row.get("difficulty"),
                "duration": row.get("duration"),
                # canonical external URLs, derived from the sheet itself
                "tufUrl": tuf_url,
                "tufUrlFromOutline": from_outline,
                "leetcodeUrl": row.get("leetcode_link") or None,
                "articleUrl": (
                    "https://takeuforward.org" + row["free_blog_link"]
                    if row.get("free_blog_link")
                    else None
                ),
                "videoUrl": row.get("yt_video") or None,
                "isTrial": bool(row.get("is_trial")),
                "notes": row.get("notes") or None,
            }
        )

    practice = [i for i in items if i["layout"] == "practice"]
    lessons = [i for i in items if i["layout"] == "learning"]
    stats = {
        "sheet_problem_count": outline["problemCount"],
        "items": len(items),
        "practice": len(practice),
        "lessons": len(lessons),
        "other": len(items) - len(practice) - len(lessons),
        "with_leetcode": sum(1 for i in practice if i["leetcodeUrl"]),
        "with_tuf": sum(1 for i in practice if i["tufUrl"]),
        "tuf_from_outline": sum(1 for i in practice if i["tufUrlFromOutline"]),
        "tuf_from_slug": sum(1 for i in practice if i["tufUrl"] and not i["tufUrlFromOutline"]),
        "with_video": sum(1 for i in practice if i["videoUrl"]),
        "with_article": sum(1 for i in practice if i["articleUrl"]),
        "duplicate_titles": sum(c - 1 for c in Counter(i["title"] for i in practice).values() if c > 1),
        "sections": Counter(i["section"] for i in practice).most_common(),
    }
    (RAW / "base_items.json").write_text(json.dumps(items, ensure_ascii=False, indent=1))
    non_leetcode = [i for i in practice if not i["leetcodeUrl"]]
    (RAW / "no_leetcode.json").write_text(json.dumps(non_leetcode, ensure_ascii=False, indent=1))
    print(json.dumps(stats, ensure_ascii=False, indent=1))
    return 0


if __name__ == "__main__":
    sys.exit(main())
