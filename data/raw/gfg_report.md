# GeeksforGeeks link verification: Striver A2Z, no-LeetCode subset

Scope: the 175 sheet items in `data/raw/no_leetcode.json` (practice problems carrying **no** LeetCode URL),
matched against real GeeksforGeeks practice pages.
Output: `data/raw/gfg_verified.json`, one entry per verified page keyed by `tufId`.

## Result (measured)

| metric | value |
|---|---|
| problems attempted | **175** |
| matched, `confidence: "verified"` (title-token coverage ≥ 0.60) | **94** |
| matched, `confidence: "weak"` (40–60%, or statement-verified rename below 40%) | **33** |
| entries in `gfg_verified.json` | **127** |
| no match: no GFG practice page for the task | **48** |
| match rate | **72.6%** (127/175) |

Every entry was fetched over HTTP during this session. `gfgTitle` is that page's literal `<title>`
(HTML entities decoded), `gfgDifficulty` its own difficulty badge value, `httpStatus` the observed
status. Where GFG 301-redirects a slug to a canonical one, `url` is the canonical target, the URL
whose body was actually parsed (noted per entry).

A candidate that could not be confirmed to be *the same problem, same required output* was dropped
rather than recorded, so the 48 no-matches are deliberate: a wrong practice link is worse than no link.

## Difficulty mix observed on the matched pages

| GFG difficulty | count |
|---|---|
| Basic | 16 |
| Easy | 38 |
| Medium | 66 |
| Hard | 7 |
| **total** | **127** |

## How the pages were fetched and checked

Extractor: one `curl` per URL, batch-driven in Python with `ThreadPoolExecutor(max_workers=10)`
(never more than 10 concurrent):

```bash
UA='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36'
curl -s -L --max-time 35 -A "$UA" \
     -w '\n@@@%{http_code}@@@%{url_effective}' -o - \
     'https://www.geeksforgeeks.org/problems/<slug>/1'
```

The final line of the response is `@@@<http_status>@@@<final_url>`; everything before it is the body,
parsed with exactly these expressions:

```python
re.search(r'<title>(.*?)</title>', body, re.S)                        # -> gfgTitle
re.search(r'<h1[^>]*>(.*?)</h1>', body, re.S)                         # -> soft-404 sentinel check
re.findall(r'"difficulty":"(Basic|Easy|Medium|Hard)"', body)      # -> gfgDifficulty
re.findall(r'"problem_level_text":"(Basic|Easy|Medium|Hard)"', body)  # fallback for gfgDifficulty
re.findall(r'"problem_name":"([^"]{1,140})"', body)               # -> real-page sentinel
```

`gfgDifficulty` is the first `"difficulty"` value found in the page's embedded JSON (the badge is
client-rendered, so there is no difficulty text node in the served HTML); the
`problem_level_text` value is used only when `difficulty` is absent. Both were always present and
always agreed on every page fetched.

### Acceptance rule (this is the verification, not the status code)

```
ACCEPT(page)  <=>  httpStatus == 200
              and  <title> != 'Practice | GeeksforGeeks | A computer science portal for geeks'
              and  'Something went wrong' not in <h1>
              and  'problem_name' present in the page's embedded JSON

coverage = |sig_tokens(sheet_title) & tokens(<title> + <h1> + slug)| / |sig_tokens(sheet_title)|
     sig_tokens: lowercase, [a-z0-9]+ runs, keep length > 2, stopwords removed
     confidence = 'verified' if coverage >= 0.60 else 'weak'
```

## Two findings that changed the approach

### 1. HTTP status cannot verify a GFG problem URL (the brief's assumption was wrong)

The brief expected GFG to return a real 404 for a missing problem. **It returns 200 for both.**
Measured directly:

```
$ curl -s -o /dev/null -w '%{http_code}\n' https://www.geeksforgeeks.org/problems/aggressive-cows/1
200
$ curl -s -o /dev/null -w '%{http_code}\n' https://www.geeksforgeeks.org/problems/definitely-not-a-real-problem-xyzqq/1
200
```

The bogus slug serves the SPA shell - `<title>Practice | GeeksforGeeks | A computer science portal
for geeks</title>`, `<h1>Oops!! Something went wrong.</h1>`, no `problem_name` - so status codes gave
zero discrimination. Every URL here was accepted on page content only, via the acceptance rule above.
Candidate probing alone (930 slugs probed, 358 real pages) was likewise gated on content, not status.

Related trap: `practiceapi.geeksforgeeks.org/api/v1/problems/<slug>/` is *not* a reliable existence
oracle either. It returns `404` (absent), `200` (present), `301` (moved - the redirect target is the
canonical slug, which is how several canonical slugs were found), and `401 Authentication required`.
The `401` case is a **false negative**: `/api/v1/problems/n-meetings-in-one-room-1587115620/` returns
401 while the web page renders fine (`<title>Activity Selection | Practice | GeeksforGeeks</title>`,
difficulty Medium). Conversely `frog-jump` and `count-inversions` return 401 *and* serve the soft-404
shell. Only the rendered page separates those two cases.

### 2. Token overlap on short titles is not enough - an equivalence gate was required

With 2-3 token titles a single shared token yields >=60% coverage, so the acceptance rule alone
produced confident-looking false positives: `Dijkstra's algorithm` -> *Kadane's Algorithm*,
`Second Largest Element` -> *Third Largest*, `Kth element of 2 sorted arrays` -> *Union of 2 Sorted
Arrays*, `Implement Stack using Arrays` -> *Stack using Linked List*, `Pattern 22` -> *Print Pattern*
(a number-sequence problem). Every surviving candidate was therefore re-checked for *same task, same
required output* against the GFG statement text, and obvious mismatches were dropped. Candidate
sources:

- **The full GFG practice catalogue**, enumerated from the site's listing endpoint
  `https://practiceapi.geeksforgeeks.org/api/vr/problems/?pageMode=explore&page=N&sortBy=submissions`
  (`total: 2989`, 30/page -> 100 pages -> **2,986 unique problems** with `slug`, `problem_name`,
  `difficulty`). Plus `https://practiceapi.geeksforgeeks.org/api/v1/problems/search/?query=<q>` for
  name lookups (the parameter is `query`, not `q`, and it only finds some phrasings). Endpoint paths
  were recovered by loading `geeksforgeeks.org/explore` in a headless browser, capturing its XHRs,
  then grepping the Next.js chunks for `url:"problems/?pageMode=explore&"`.
- **Slug candidates** generated per title (lowercase, punctuation/parentheticals stripped, spaces to
  `-`, leading article dropped, roman<->digit variants, trailing-qualifier reduction, singular/plural,
  `-problem` suffix, `LL`->`linked-list`) plus the takeuforward slug, probed against the three URL
  shapes in the brief (`/problems/<slug>/1`, `/problems/<slug>/`, `/<slug>/`).

## Which `confidence` values mean what

| tier | rule | why |
|---|---|---|
| `verified` | coverage >= 0.60, same task | the overlap came from the page's own title; names line up |
| `weak` (partial overlap) | coverage 0.40-0.60, same task | GFG renames/pluralises: `Insertion Sorting` -> *Insertion Sort*, `N meetings in one room` -> *Maximum Meetings in One Room* |
| `weak` (statement-verified rename) | coverage < 0.40 | GFG renamed the problem outright; equivalence confirmed by comparing statements/examples, evidence in `note` |

The 33 `weak` entries split as **21** partial-overlap and **12** statement-verified rename.
The rename group is where the judgement sits; each carries its evidence in `note`, e.g.
`Book Allocation Problem` -> *Allocate Minimum Pages* (identical statement), `Subsets I` ->
*Subset Sums* (both examples `[2,3] -> [0,2,3,5]`), `Find the MST weight` -> *Minimum Spanning Tree*
(statement verbatim), `Pascal's Triangle II` -> *Pascal Triangle* (both nth row, `n=4 -> [1,3,3,1]`).

One trap worth recording, because it inverts answers: **GFG's numbering of Single Number II/III is
shifted relative to LeetCode/Striver's.** Striver's *Single Number - II* (every element thrice except
one) is GFG's *Unique Number III*; Striver's *Single Number - III* (two singletons) is GFG's *Unique
Number II*. Matching on the numeral would have produced two wrong links; the statements decided it.

## Five example entries (verbatim from the fetched pages)

```
73: https://www.geeksforgeeks.org/problems/aggressive-cows/1
     sheet='Aggressive Cows'  gfgTitle='Aggressive Cows | Practice | GeeksforGeeks'  gfgDifficulty='Medium'  httpStatus=200  confidence=verified
67: https://www.geeksforgeeks.org/problems/median-in-a-row-wise-sorted-matrix1527/1
     sheet='Matrix Median'  gfgTitle='Median in a Row-Wise Sorted Matrix | Practice | GeeksforGeeks'  gfgDifficulty='Medium'  httpStatus=200  confidence=verified
805: https://www.geeksforgeeks.org/problems/the-painters-partition-problem1535/1
     sheet="Painter's Partition"  gfgTitle="The Painter's Partition Problem-II | Practice | GeeksforGeeks"  gfgDifficulty='Hard'  httpStatus=200  confidence=verified
629: https://www.geeksforgeeks.org/problems/given-a-linked-list-of-0s-1s-and-2s-sort-it/1
     sheet="Sort a Linked List of 0's 1's and 2's"  gfgTitle='Sort a linked list of 0s, 1s and 2s | Practice | GeeksforGeeks'  gfgDifficulty='Medium'  httpStatus=200  confidence=verified
812: https://www.geeksforgeeks.org/problems/pascal-triangle0652/1
     sheet="Pascal's Triangle II"  gfgTitle='Pascal Triangle | Practice | GeeksforGeeks'  gfgDifficulty='Medium'  httpStatus=200  confidence=verified
```

## No match (48 items), deliberately left unfilled

These have **no** entry in `gfg_verified.json`. In each case no GFG *practice* page performs the same
task; the closest pages are named where they exist. Guessing here would have produced working-but-wrong
links, which is the failure mode the brief forbids.

| tufId | sheet title | section | why not matched |
|---|---|---|---|
| 32 | Pascal's Triangle III | Arrays | GFG has only the nth-row variant (`pascal-triangle0652`), not the first-n-rows task |
| 107 | Floor and Ceil in a BST | Binary Search Trees | GFG splits this into separate `Floor in BST` and `Ceil in BST` pages; no single page does both |
| 111 | Requirements needed to construct a unique BT | Binary Trees | no GFG practice page for 'can a unique BT be built from a traversal pair' |
| 136 | Pre, Post, Inorder in one traversal | Binary Trees | GFG has separate BFS/DFS and in/pre/post pages; none returns all three traversals in one pass |
| 289 | Frog jump with K distances | Dynamic Programming | GFG only has the 2-step version (`geek-jump`, 'Frog Jump'); no k-distance practice page |
| 341 | Count of odd numbers in Array | Beginner Problems | closest GFG page (`count-odd-even`) returns BOTH odd and even counts; Striver wants the odd count only |
| 345 | Second Highest Occurring Element | Beginner Problems | no GFG practice page for 'second most frequent element' |
| 346 | Sum of Highest and Lowest Frequency | Beginner Problems | GFG 'Highest and Lowest Frequencies' asks for the DIFFERENCE between the two frequencies; Striver for their SUM |
| 350 | Delete Tail of Doubly Linked List | Linked-List | GFG has the singly-linked `deletion-at-the-end-of-a-linked-list`; no doubly-linked tail-delete page |
| 351 | Delete the element with value X | Linked-List | no GFG practice page for 'delete the node whose value is X' in a singly linked list |
| 353 | Deletion of the Kth element of Linked List | Linked-List | GFG's position-based delete page is for a doubly linked list; no singly-linked Kth-delete page |
| 355 | Insert before given node in Doubly Linked List | Linked-List | GFG's DLL insert page (`insert-a-node-in-doubly-linked-list`) is position-based, not node-reference-based |
| 356 | Insertion at the head of Linked List | Linked-List | GFG's singly-linked insert pages cover end-insert and position-insert; no insert-at-head page found |
| 359 | Insertion before the value X in Linked List | Linked-List | no GFG practice page for 'insert before the node whose value is X' |
| 361 | Insert node before head in Doubly Linked List | Linked-List | no GFG practice page for insert-before-head in a doubly linked list |
| 362 | Insert node before tail in Doubly Linked List | Linked-List | GFG `doubly-linked-list-tail-insert` inserts AFTER the tail; Striver's task inserts BEFORE the tail |
| 363 | Removing given node in Doubly Linked List | Linked-List | GFG's DLL delete page deletes by position, not by a given node reference |
| 368 | Count number of odd digits in a number | Beginner Problems | no GFG practice page for counting ODD digits (GFG only counts all digits) |
| 369 | Count of Prime Numbers till N | Beginner Problems | GFG `sieve-of-eratosthenes5242` returns the list of primes; Striver asks for the COUNT till N |
| 375 | Return the Largest Digit in a Number | Beginner Problems | no GFG practice page for 'largest digit in a number' |
| 401 | Pattern 1 | Beginner Problems | star-pattern printing exercise; GFG's `Print Pattern` is a different (number-sequence) problem |
| 402 | Pattern 10 | Beginner Problems | star-pattern printing exercise; GFG's `Print Pattern` is a different (number-sequence) problem |
| 403 | Pattern 11 | Beginner Problems | star-pattern printing exercise; GFG's `Print Pattern` is a different (number-sequence) problem |
| 404 | Pattern 12 | Beginner Problems | star-pattern printing exercise; GFG's `Print Pattern` is a different (number-sequence) problem |
| 405 | Pattern 13 | Beginner Problems | star-pattern printing exercise; GFG's `Print Pattern` is a different (number-sequence) problem |
| 406 | Pattern 14 | Beginner Problems | star-pattern printing exercise; GFG's `Print Pattern` is a different (number-sequence) problem |
| 407 | Pattern 15 | Beginner Problems | star-pattern printing exercise; GFG's `Print Pattern` is a different (number-sequence) problem |
| 408 | Pattern 16 | Beginner Problems | star-pattern printing exercise; GFG's `Print Pattern` is a different (number-sequence) problem |
| 409 | Pattern 17 | Beginner Problems | star-pattern printing exercise; GFG's `Print Pattern` is a different (number-sequence) problem |
| 410 | Pattern 18 | Beginner Problems | star-pattern printing exercise; GFG's `Print Pattern` is a different (number-sequence) problem |
| 411 | Pattern 19 | Beginner Problems | star-pattern printing exercise; GFG's `Print Pattern` is a different (number-sequence) problem |
| 412 | Pattern 2 | Beginner Problems | star-pattern printing exercise; GFG's `Print Pattern` is a different (number-sequence) problem |
| 413 | Pattern 20 | Beginner Problems | star-pattern printing exercise; GFG's `Print Pattern` is a different (number-sequence) problem |
| 414 | Pattern 21 | Beginner Problems | star-pattern printing exercise; GFG's `Print Pattern` is a different (number-sequence) problem |
| 415 | Pattern 22 | Beginner Problems | star-pattern printing exercise; GFG's `Print Pattern` is a different (number-sequence) problem |
| 416 | Pattern 3 | Beginner Problems | star-pattern printing exercise; GFG's `Print Pattern` is a different (number-sequence) problem |
| 417 | Pattern 4 | Beginner Problems | star-pattern printing exercise; GFG's `Print Pattern` is a different (number-sequence) problem |
| 418 | Pattern 5 | Beginner Problems | star-pattern printing exercise; GFG's `Print Pattern` is a different (number-sequence) problem |
| 419 | Pattern 6 | Beginner Problems | star-pattern printing exercise; GFG's `Print Pattern` is a different (number-sequence) problem |
| 420 | Pattern 7 | Beginner Problems | star-pattern printing exercise; GFG's `Print Pattern` is a different (number-sequence) problem |
| 421 | Pattern 8 | Beginner Problems | star-pattern printing exercise; GFG's `Print Pattern` is a different (number-sequence) problem |
| 422 | Pattern 9 | Beginner Problems | star-pattern printing exercise; GFG's `Print Pattern` is a different (number-sequence) problem |
| 526 | Print Shortest Path | Graphs | no GFG practice page for printing a Dijkstra shortest path |
| 529 | Traversal Techniques | Graphs | Striver wants BFS and DFS in one problem; GFG has `BFS of Graph` and `DFS of Graph` separately |
| 571 | Check if an array represents a min heap | Heaps | GFG `does-array-represent-heap4345` checks a MAX heap; Striver's task checks a MIN heap |
| 572 | Convert Min Heap to Max Heap | Heaps | no GFG practice page for converting a min heap into a max heap |
| 871 | Palindrome partitioning | Recursion | Striver (Recursion) wants ALL palindrome partitions; GFG's 'Palindromic Partitioning' is the min-cuts DP variant |
| 981 | Z function | Strings (Advanced Algo) | no GFG practice page for the Z-function / Z-algorithm |

Why the 48 fall out, by cause:

- **22**: star-pattern printing exercises; GFG has no practice page reproducing these shapes (its `Print Pattern` is a number-sequence problem)
- **15**: a GFG practice page exists but performs a different task or variant (different output, data structure, or split across pages)
- **11**: no GFG practice page for the task at all

## Files

| file | contents |
|---|---|
| `data/raw/gfg_verified.json` | 127 entries keyed by `tufId` (string): `title`, `url`, `gfgTitle`, `gfgDifficulty`, `httpStatus`, `confidence`, `note` |
| `data/raw/gfg_report.md` | this report |

Schema note: `gfgDifficulty` was added on request and holds the difficulty extracted from the fetched
page (`Basic` / `Easy` / `Medium` / `Hard`); it is never empty in this file. `note` is empty for a
plain match and otherwise records either the statement-level equivalence evidence (manual/rename
cases) or that `url` is GFG's canonical target for a redirecting slug.
