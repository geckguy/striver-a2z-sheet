# GfG links recovered from the official sheet snapshot: report

Artifact: `data/raw/gfg_from_sheet.json` with **10 verified entries**, keyed by bare `tufId`.
Every URL in it was fetched and checked against the live GeeksforGeeks page (see "Verification").

Source of the GfG links: `index.html` in `Shivanshumishra23/Striver-A2Z-Sheet-with-GFG-links`,
branch `main`, commit `5f1207defd36f20a4922397475e37ddf836b8a72`, a saved copy of the official
takeuforward A2Z page carrying the classic `Topic/Article | GfG | Solution | Leetcode` table
(454 rows, 442 with a resolvable GfG link). That directory (`data/raw/gh/`) was removed by the integration
owner after ingest, so the parsed rows are read from `/tmp/ghparse/shivanshu.json`.

## Result

- targets derived: **80**, of which **10** got a verified link
- targets with no candidate at all: **39**
- targets that had candidates but none verified: **31**

### Verified entries

| tufId | our title | GeeksforGeeks page | difficulty | alignment | token overlap |
|---|---|---|---|---|---|
| `289` | Frog jump with K distances | [Frog Jump](https://www.geeksforgeeks.org/problems/geek-jump/1) | Medium | anchor-window(span=6,rank=1) | 0.67 |
| `325` | Unbounded knapsack | [Knapsack with Duplicate Items](https://www.geeksforgeeks.org/problems/knapsack-with-duplicate-items4201/1) | Medium | anchor-window(span=19,rank=0) | 0.5 |
| `349` | Delete Kth Element of Doubly Linked List | [Delete in a Doubly Linked List](https://www.geeksforgeeks.org/problems/delete-node-in-doubly-linked-list/1) | Easy | anchor-window(span=21,rank=0) | 0.67 |
| `355` | Insert before given node in Doubly Linked List | [Insertion in a Doubly Linked List](https://www.geeksforgeeks.org/problems/insert-a-node-in-doubly-linked-list/1) | Easy | anchor-window(span=21,rank=0) | 0.5 |
| `360` | Insert node before (kth node) in Doubly Linked List | [Insertion in a Doubly Linked List](https://www.geeksforgeeks.org/problems/insert-a-node-in-doubly-linked-list/1) | Easy | anchor-window(span=21,rank=0) | 0.43 |
| `361` | Insert node before head in Doubly Linked List | [Insertion in a Doubly Linked List](https://www.geeksforgeeks.org/problems/insert-a-node-in-doubly-linked-list/1) | Easy | anchor-window(span=21,rank=0) | 0.43 |
| `362` | Insert node before tail in Doubly Linked List | [Insertion in a Doubly Linked List](https://www.geeksforgeeks.org/problems/insert-a-node-in-doubly-linked-list/1) | Easy | anchor-window(span=21,rank=0) | 0.43 |
| `526` | Print Shortest Path | [Shortest Path in Unweighted Graph](https://www.geeksforgeeks.org/problems/shortest-path-in-undirected-graph-having-unit-distance/1) | Medium | anchor-window(span=15,rank=0) | 0.67 |
| `623` | Length of loop in LL | [Cycle Length in Linked List](https://www.geeksforgeeks.org/problems/find-length-of-loop/1) | Medium | anchor-window(span=14,rank=0) | 0.75 |
| `851` | Print Longest Increasing Subsequence | [Get Longest Increasing Subsequence](https://www.geeksforgeeks.org/problems/printing-longest-increasing-subsequence/1) | Medium | anchor-window(span=3,rank=0) | 0.75 |

All ten were re-fetched after the run finished: 10/10 HTTP 200, the page's embedded `slug`
identifies the slug we asked for, and the page title overlaps our title by >= 0.4.

## Target set, and why the number moved

Derived exactly as instructed: practice rows in `data/raw/base_items.json` with no `leetcodeUrl`,
minus the keys of `leetcode_extra.json`, minus the keys of `gfg_final.json`.

| moment | `gfg_final.json` keys | targets |
|---|---|---|
| session start | 40 | 130 |
| mid-session | 73 | 97 |
| at production | 90 (mtime 20:53:56) | 80 |

`gfg_final.json` was being rewritten by your own pipeline while I worked, so the complement kept
shrinking. The artifact above is against the 90-key state. Re-running
`python3 /tmp/ghparse/produce.py` re-derives the set from whatever `gfg_final.json` holds then.
Note `data/raw/base_items.json` also changed under me (mtime 20:50), so counts are quoted with
their observation time rather than as absolutes.

## Alignment, and why positional matching is not enough

The classic snapshot and our modern sheet share the curriculum but order their **sections**
differently (our "Hashing" is its own section, our "Greedy" precedes "Sliding Window", our
"Binary Trees / BST / Heaps" are reordered against the classic steps), so a global monotonic
alignment is impossible. LeetCode-slug equality gives **220 anchors** (our problem <-> snapshot
row), and I aligned *locally*: a target's candidate set is the window between its two
neighbouring anchors.

Measured over the snapshot's 61 sections (`scripts/match_gfg.py`'s positional idea, evaluated
per section):

- sections with at least one anchor: **47**; sections with none: **14**
- sections where the our-side span equals the snapshot section size, i.e. exact 1:1 positional
  alignment is even possible: **3** (`9.3`, `12.2`, `17.1`)
- mean anchor agreement (share of anchors sharing the section's modal offset): **0.668**
- 16 sections have an our-side span larger than the snapshot section, since the modern sheet
  redistributed them; the worst is `5.2 Medium String Problems`, 8 snapshot rows whose anchors
  are spread over 343 of our rows.

Per-section anchor agreement (the requested evidence):

| step.topic | section | snap rows | anchors | our span | agreement | exact 1:1? |
|---|---|---|---|---|---|---|
| 1.1 | Things to Know in C++/Java/Python or any language | 9 | 0 | - | - | no |
| 1.2 | Build-up Logical Thinking | 1 | 0 | - | - | no |
| 1.3 | Learn STL/Java-Collections or similar thing in your  | 1 | 0 | - | - | no |
| 1.4 | Know Basic Maths | 7 | 3 | 5 | 0.67 | no |
| 1.5 | Learn Basic Recursion | 9 | 2 | 6 | 0.5 | no |
| 1.6 | Learn Basic Hashing | 3 | 0 | - | - | no |
| 2.1 | Sorting-I | 3 | 0 | - | - | no |
| 2.2 | Sorting-II | 4 | 0 | - | - | no |
| 3.1 | Easy | 14 | 7 | 134 | 0.43 | no |
| 3.2 | Medium | 14 | 10 | 25 | 0.2 | no |
| 3.3 | Hard | 11 | 7 | 17 | 0.29 | no |
| 4.1 | Learning BS on 1D Arrays | 13 | 8 | 22 | 0.5 | no |
| 4.2 | Applying BS on 2D Arrays | 4 | 2 | 3 | 0.5 | no |
| 4.3 | Find Answers by BS in Search Space | 14 | 8 | 13 | 0.25 | no |
| 5.1 | Basic and Easy String Problems | 7 | 5 | 5 | 1.0 | no |
| 5.2 | Medium String Problems | 8 | 2 | 343 | 0.5 | no |
| 6.1 | Learn 1D LinkedList | 5 | 1 | 1 | 1.0 | no |
| 6.2 | Learn Doubly LinkedList | 4 | 0 | - | - | no |
| 6.3 | Medium Problems of LL | 15 | 11 | 18 | 0.27 | no |
| 6.4 | Medium Problems of DLL | 3 | 0 | - | - | no |
| 6.5 | Hard Problems of LL | 4 | 3 | 6 | 0.67 | no |
| 7.1 | Get a Strong Hold | 5 | 1 | 1 | 1.0 | no |
| 7.2 | Subsequences Pattern | 12 | 7 | 61 | 0.71 | no |
| 7.3 | Trying out all Combos / Hard | 8 | 4 | 6 | 0.75 | no |
| 8.1 | Learn Bit Manipulation | 8 | 1 | 1 | 1.0 | no |
| 8.2 | Interview Problems | 5 | 1 | 1 | 1.0 | no |
| 8.3 | Advanced Maths | 5 | 1 | 1 | 1.0 | no |
| 9.1 | Learning | 8 | 4 | 12 | 0.75 | no |
| 9.2 | Prefix, Infix, PostFix Conversion Problems | 6 | 0 | - | - | no |
| 9.3 | Monotonic Stack/Queue Problems [VVV. Imp] | 12 | 10 | 12 | 0.2 | yes |
| 9.4 | Implementation Problems | 6 | 4 | 68 | 0.5 | no |
| 10.1 | Medium Problems | 8 | 7 | 10 | 0.43 | no |
| 10.2 | Hard Problems | 4 | 3 | 7 | 0.67 | no |
| 11.1 | Learning | 4 | 0 | - | - | no |
| 11.2 | Medium Problems | 7 | 0 | - | - | no |
| 11.3 | Hard Problems | 6 | 1 | 1 | 1.0 | no |
| 12.1 | Easy Problems | 5 | 3 | 12 | 0.33 | no |
| 12.2 | Medium/Hard | 11 | 6 | 11 | 0.33 | yes |
| 13.1 | Traversals | 13 | 4 | 4 | 0.5 | no |
| 13.2 | Medium Problems | 12 | 10 | 13 | 0.4 | no |
| 13.1 | Hard Problems | 14 | 10 | 12 | 0.5 | no |
| 14.1 | Concepts | 3 | 1 | 1 | 1.0 | no |
| 14.2 | Practice Problems | 13 | 10 | 10 | 1.0 | no |
| 15.1 | Learning | 6 | 0 | - | - | no |
| 15.2 | Problems on BFS/DFS | 14 | 8 | 20 | 0.38 | no |
| 15.3 | Topo Sort and Problems | 7 | 6 | 8 | 0.33 | no |
| 15.4 | Shortest Path Algorithms and Problems | 13 | 5 | 8 | 0.8 | no |
| 15.5 | MinimumSpanningTree/Disjoint Set and Problems | 11 | 5 | 5 | 0.6 | no |
| 15.6 | Other Algorithms | 3 | 1 | 1 | 1.0 | no |
| 16.1 | Introduction to DP | 1 | 0 | - | - | no |
| 16.2 | 1D DP | 5 | 1 | 1 | 1.0 | no |
| 16.3 | 2D/3D DP and DP on Grids | 7 | 4 | 4 | 1.0 | no |
| 16.4 | DP on Subsequences | 11 | 5 | 8 | 1.0 | no |
| 16.5 | DP on Strings | 10 | 8 | 9 | 0.88 | no |
| 16.6 | DP on Stocks | 6 | 5 | 5 | 0.8 | no |
| 16.7 | DP on LIS | 7 | 4 | 6 | 0.75 | no |
| 16.8 | MCM DP / Partition DP | 7 | 4 | 4 | 0.5 | no |
| 16.9 | DP on Squares | 2 | 0 | - | - | no |
| 17.1 | Theory | 1 | 1 | 1 | 1.0 | yes |
| 17.2 | Problems | 6 | 2 | 2 | 1.0 | no |
| 18.1 | Hard Problems | 9 | 4 | 7 | 0.5 | no |

Candidate ranking accuracy, measured on the 220 problems whose counterpart is known (does the
top-ranked in-window candidate recover the true row?):

- top-ranked candidate is the true row: **115**, wrong: **38** -> precision **0.752**
- the true row is inside the top 8 candidates for **122 / 220** (55.5%)
- **67** of the 220 have no bounded anchor window at all, so ranking never gets a chance

That 0.752 is *before* verification. The gate below is what makes the emitted set trustworthy:
it re-checks every proposed URL against the live page and against our own title.

## Blocks refused, with no candidate at all (39 targets)

Nothing is emitted for these: they have no bounded anchor window (or the window holds no GfG
link), so there is no positional evidence to align on. 22 of the 23 `no-anchor-window` rows are
the `Pattern 1..22` exercises, which the classic sheet itself never gave a GfG link
(section `1.2 Build-up Logical Thinking` has 1 row and 0 GfG links), and refusing them is correct,
and a global search here is exactly what produced the "Pattern 1 -> Wildcard Pattern Matching"
false positive described below.

| tufId | our title | section | why refused |
|---|---|---|---|
| `401` | Pattern 1 | Beginner Problems | no-anchor-window |
| `412` | Pattern 2 | Beginner Problems | no-anchor-window |
| `416` | Pattern 3 | Beginner Problems | no-anchor-window |
| `417` | Pattern 4 | Beginner Problems | no-anchor-window |
| `418` | Pattern 5 | Beginner Problems | no-anchor-window |
| `419` | Pattern 6 | Beginner Problems | no-anchor-window |
| `420` | Pattern 7 | Beginner Problems | no-anchor-window |
| `421` | Pattern 8 | Beginner Problems | no-anchor-window |
| `422` | Pattern 9 | Beginner Problems | no-anchor-window |
| `402` | Pattern 10 | Beginner Problems | no-anchor-window |
| `403` | Pattern 11 | Beginner Problems | no-anchor-window |
| `404` | Pattern 12 | Beginner Problems | no-anchor-window |
| `405` | Pattern 13 | Beginner Problems | no-anchor-window |
| `406` | Pattern 14 | Beginner Problems | no-anchor-window |
| `407` | Pattern 15 | Beginner Problems | no-anchor-window |
| `408` | Pattern 16 | Beginner Problems | no-anchor-window |
| `409` | Pattern 17 | Beginner Problems | no-anchor-window |
| `410` | Pattern 18 | Beginner Problems | no-anchor-window |
| `411` | Pattern 19 | Beginner Problems | no-anchor-window |
| `413` | Pattern 20 | Beginner Problems | no-anchor-window |
| `414` | Pattern 21 | Beginner Problems | no-anchor-window |
| `415` | Pattern 22 | Beginner Problems | no-anchor-window |
| `368` | Count number of odd digits in a number | Beginner Problems | no-anchor-window |
| `380` | Factorial of a Given Number | Beginner Problems | empty-window |
| `384` | Sum of Array Elements II | Beginner Problems | empty-window |
| `383` | Reverse a String I | Beginner Problems | empty-window |
| `32` | Pascal's Triangle III | Arrays | empty-window |
| `86` | Floor and Ceil in Sorted Array | Binary Search | no-gfg-in-window |
| `74` | Book Allocation Problem | Binary Search | empty-window |
| `66` | Find row with maximum 1's | Binary Search | empty-window |
| `617` | Add one to a number represented by LL | Linked-List | empty-window |
| `548` | Minimum number of platforms required for a railway | Greedy Algorithms | empty-window |
| `111` | Requirements needed to construct a unique BT | Binary Trees | empty-window |
| `573` | Heapify Algorithm | Heaps | empty-window |
| `571` | Check if an array represents a min heap | Heaps | empty-window |
| `572` | Convert Min Heap to Max Heap | Heaps | empty-window |
| `578` | K-th Largest element in an array | Heaps | empty-window |
| `653` | Print all primes till N | Maths | empty-window |
| `652` | Prime factorisation of a Number | Maths | empty-window |

## Candidates that could not be verified (31 targets)

These had at least one candidate; every candidate failed either the gate or a guard. Reasons are
per-candidate, so a target can show several.

| tufId | our title | section | reasons |
|---|---|---|---|
| `375` | Return the Largest Digit in a Number | Beginner Problems | title-overlap-0.00 |
| `371` | Factorial of a given number | Beginner Problems | title-overlap-0.00 |
| `369` | Count of Prime Numbers till N | Beginner Problems | different-problem-page, title-overlap-0.00, title-overlap-0.25 |
| `341` | Count of odd numbers in Array | Beginner Problems | different-problem-page, title-overlap-0.00, title-overlap-0.25 |
| `345` | Second Highest Occurring Element | Beginner Problems | different-problem-page, title-overlap-0.00, title-overlap-0.25 |
| `346` | Sum of Highest and Lowest Frequency | Beginner Problems | different-problem-page, title-overlap-0.00, title-overlap-0.25 |
| `377` | Check if a Number is Prime or Not | Beginner Problems | title-overlap-0.00 |
| `382` | Reverse an array 2 | Beginner Problems | guard:no-distinctive-token, title-overlap-0.00 |
| `38` | Largest Element | Arrays | guard:no-distinctive-token, title-overlap-0.00 |
| `44` | Find missing number | Arrays | different-problem-page, title-overlap-0.00 |
| `84` | Find out how many times the array is rotated | Binary Search | title-overlap-0.17 |
| `76` | Kth element of 2 sorted arrays | Binary Search | title-overlap-0.00, title-overlap-0.25 |
| `878` | Power Set | Recursion | title-overlap-0.00 |
| `879` | Check if there exists a subsequence with sum K | Recursion | title-overlap-0.00, title-overlap-0.25 |
| `353` | Deletion of the Kth element of Linked List | Linked-List | antonym(snapshot-title), different-problem-page, guard:coverage<0.5 |
| `351` | Delete the element with value X | Linked-List | antonym(snapshot-title), different-problem-page, title-overlap-0.00 |
| `356` | Insertion at the head of Linked List | Linked-List | antonym(snapshot-title), different-problem-page, guard:no-distinctive-token |
| `357` | Insertion at the Kth position of Linked List | Linked-List | antonym(snapshot-title), different-problem-page, guard:coverage<0.5 |
| `359` | Insertion before the value X in Linked List | Linked-List | antonym(snapshot-title), different-problem-page, guard:coverage<0.5 |
| `363` | Removing given node in Doubly Linked List | Linked-List | antonym(snapshot-title), different-problem-page, guard:coverage<0.5 |
| `144` | Single Number - II | Bit Manipulation | guard:no-distinctive-token, low-rank-thin-match, title-overlap-0.00 |
| `145` | Single Number - III | Bit Manipulation | title-overlap-0.00, title-overlap-0.33 |
| `391` | Implement stack using Linkedlist | Stack / Queues | title-overlap-0.00, title-overlap-0.33 |
| `388` | Implement queue using Linkedlist | Stack / Queues | title-overlap-0.00, title-overlap-0.33 |
| `136` | Pre, Post, Inorder in one traversal | Binary Trees | guard:traversal-order, title-overlap-0.00, title-overlap-0.25 |
| `120` | Minimum time taken to burn the BT from a given Node | Binary Trees | title-overlap-0.14 |
| `107` | Floor and Ceil in a BST | Binary Search Trees | antonym(snapshot-title), guard:no-distinctive-token |
| `529` | Traversal Techniques | Graphs | different-problem-page, guard:no-distinctive-token |
| `517` | Find the MST weight | Graphs | title-overlap-0.00, title-overlap-0.33 |
| `1027` | Trie Implementation and Advanced Operations | Tries | different-problem-page, title-overlap-0.00, title-overlap-0.25 |
| `981` | Z function | Strings (Advanced Algo) | different-problem-page, title-overlap-0.00 |

Reason totals across all candidates: `title-overlap` 37, `different-problem-page` 14,
`antonym(snapshot-title)` 7, `guard:no-distinctive-token` 7, `guard:coverage<0.5` 4,
`guard:qualifier` 3, `guard:antonym` 3, `low-rank-thin-match` 1, `guard:traversal-order` 1.
A recurring cause of `title-overlap-0.00` is that some GeeksforGeeks practice pages serve a
JavaScript shell whose `<title>` is the generic `"Practice | GeeksforGeeks | A computer science
portal"`, so no title comparison can succeed for them (e.g. `missing-number4257`,
`convert-min-heap-to-max-heap-1666385109`). Your gate has the same limitation.

## Acceptance rules

Main's gate is applied unchanged: HTTP 200; the page's embedded `"slug"` identifies the same
problem (equal truncated to 30 chars, either a prefix of the other, or the same trailing numeric
id); and >= 40% of our title's significant tokens appear in the fetched page title. On top of it
I added guards that the token-overlap gate cannot express, because the gate alone lets real
errors through:

| guard | what it stops |
|---|---|
| antonym | `min heap` vs `Max Heap`; `intersection` vs `Union`; `subarrays` vs `Subsets`; `Linear Search` vs `Binary Search`; `Insertion` vs `Deletion`; `singly` vs `doubly` |
| qualifier | a page claiming `doubly`/`circular`/`singly` our title never mentions |
| traversal-order | a title naming several orders (`Pre, Post, Inorder in one traversal`) matched to a page naming one (`Inorder Traversal`) |
| coverage >= 0.5 | the page must cover half of our title's significant tokens |
| distinctive token | the match must not rest only on corpus-generic words (`array`, `linked`, `list`, `pattern`); "generic" is measured, not hand-picked: a token is generic if it occurs in more than 8 of our 402 titles. Without it, `Pattern 1` -> `Wildcard Pattern Matching` scores a perfect 100% token overlap because our title has a single token. |
| low-rank-thin-match | a candidate that was not in the top 3 needs at least 2 matched tokens |

Validation of the guards:

- against **19 hand-checked false positives** gathered from my own runs and from your file: **0 slip through**
- against your `gfg_final.json`: **87 of 90 entries survive**; the 3 that do not are
  `386 Sum of First N Numbers -> Recursively Sum n Numbers`,
  `41 Linear Search -> Array Search`, and
  `880 Count all subsequences with sum K -> Count Subset wtih Sum - Limited Size`.
  The first and third are different problems under a similar name, so rejecting them is
  defensible; `41` is a GeeksforGeeks rename I could not distinguish from a false positive.

## One thing worth acting on in `gfg_final.json`

Your gate is exactly at the edge for two-token titles. The entry for `41 Linear Search` in
`data/raw/gfg_final.json` (90 keys, mtime 20:53:56) is:

```
"41": {"url": "https://www.geeksforgeeks.org/problems/who-will-win-1587115621/1",
       "gfgTitle": "Binary Search | Practice | GeeksforGeeks", "overlap": 0.5}
```

I fetched `who-will-win-1587115621` independently: HTTP 200, embedded slug
`who-will-win-1587115621`, `<title>` `"Binary Search | Practice | GeeksforGeeks"`. So the site
would link "Linear Search" to a page titled "Binary Search". It passes the 40% rule because
`linear search` and `binary search` share exactly one of two tokens, giving precisely 0.5.
An earlier state of the file (mtime 20:45) also carried `401 Pattern 1 -> Wildcard Pattern
Matching` and a `Count subarrays with given xor K -> Count Subsets with Given XOR` entry; both
have since disappeared, but the same two-token weakness produced them. Adding the antonym and
distinctive-token guards to `scripts/match_gfg.py` would close this class.

## Verification

Each emitted URL was fetched with the same curl invocation `scripts/match_gfg.py` uses
(`-sSL --max-time 30`, Chrome user-agent) and checked for status 200, slug identity, and title
overlap. The ten entries were re-verified in a second pass after the run, independent of the
pass that produced them: **10/10 pass**. Recorded titles and difficulties are the fetched page's
own `<title>` and embedded `"difficulty"`.

## Reproducing

```
python3 /tmp/ghparse/produce.py validate   # guards vs the 19 known-bad cases and your gfg_final
python3 /tmp/ghparse/produce.py            # rewrite data/raw/gfg_from_sheet.json
python3 /tmp/ghparse/measure.py            # alignment accuracy + independent URL re-verification
```

The script reads the snapshot rows from `data/raw/gh/…json` when present and falls back to
`/tmp/ghparse/shivanshu.json`.
