#!/usr/bin/env python3
"""Title comparison shared by the GeeksforGeeks matcher and the link verifier.

Comparing a problem title to a candidate page title in isolation is not enough: GeeksforGeeks'
"Union of Two Sorted Arrays" covers 75% of the sheet's "Intersection of two sorted arrays" (one
word apart), so a plain overlap threshold happily ships the wrong problem.  Two measures are used
together instead:

  * containment - |ours ∩ page| / |ours|.  Forgiving of renames, where the page title carries
    extra words ("Flattening of LL" vs "Flattening a Linked List"), so it is the accept threshold.
  * jaccard - |ours ∩ page| / |ours ∪ page|.  Symmetric, so it does not reward degenerate titles.
    "3 Sum" has a single significant token ("sum"), which gives it containment 1.0 against every
    page mentioning a sum; jaccard 0.33 against "Sum Of Digits" versus 1.0 for the real match.

A page is accepted only when the problem it is being attached to is the best match for that page
anywhere in the sheet: containment must beat every rival, and jaccard breaks containment ties.
"""
from __future__ import annotations

import re

STOP = {
    "the", "a", "an", "of", "in", "on", "to", "and", "for", "with", "using", "problem", "set",
    "geeksforgeeks", "practice", "easy", "medium", "hard", "level", "data", "structure",
}


def stem(word: str) -> str:
    """Crude suffix stripping, enough to equate "sorting"/"sort" and "subsequences"/"subsequence"."""
    for suffix in ("ing", "ies", "es", "s"):
        if word.endswith(suffix) and len(word) - len(suffix) >= 3:
            return word[: -len(suffix)]
    return word


def tokens(text: str) -> set[str]:
    text = re.sub(r"&#?\w+;", " ", text or "")
    words = re.sub(r"[^a-z0-9]+", " ", text.lower()).split()
    return {stem(w) for w in words if len(w) > 2 and w not in STOP}


def normalized(text: str) -> str:
    """Key for joining titles across sources: lowercase, parentheses and stopwords removed."""
    text = re.sub(r"\(.*?\)", " ", (text or "").lower())
    text = re.sub(r"[^a-z0-9]+", " ", text)
    return " ".join(word for word in text.split() if word not in STOP)


def score(our_title: str, page_title: str) -> float:
    """Containment: fraction of our title's significant tokens the page title also has."""
    ours = tokens(our_title)
    if not ours:
        return 0.0
    return len(ours & tokens(page_title)) / len(ours)


def jaccard(our_title: str, page_title: str) -> float:
    ours, theirs = tokens(our_title), tokens(page_title)
    union = ours | theirs
    return len(ours & theirs) / len(union) if union else 0.0


def verdict(our_title: str, page_title: str, other_titles, min_score: float = 0.5) -> tuple[bool, str]:
    """(accepted, reason) for attaching `page_title` to `our_title`."""
    mine = score(our_title, page_title)
    if mine < min_score:
        return False, f"containment {mine:.2f} < {min_score}"
    best_other, best_title, best_other_jac = 0.0, "", 0.0
    for title in other_titles:
        if title == our_title:
            continue
        rival = score(title, page_title)
        if rival > best_other:
            best_other, best_title, best_other_jac = rival, title, jaccard(title, page_title)
    my_jac = jaccard(our_title, page_title)
    # A rival only takes the page away when it beats us on *both* measures. Requiring both keeps
    # one-token titles from disqualifying a good match: "3 Sum" has containment 1.0 against every
    # page mentioning a sum, but its jaccard against "Sum Of Digits" is no better than ours.
    if best_other > mine and best_other_jac > my_jac:
        return False, (f"page matches {best_title!r} better on both measures "
                       f"(containment {best_other:.2f} vs {mine:.2f}, jaccard {best_other_jac:.2f} vs {my_jac:.2f})")
    return True, f"containment {mine:.2f}, jaccard {my_jac:.2f} (next best {best_other:.2f}/{best_other_jac:.2f})"
