# Codolio source: extraction report

Source page (client-rendered Next.js): <https://codolio.com/question-tracker/sheet/strivers-a2z-dsa-sheet>

## Endpoint

```
GET https://node.codolio.com/api/question-tracker/v2/sheet/get-sheet-data-by-slug/strivers-a2z-dsa-sheet
```

- HTTP method: **GET**. HTTP status: `200`, `content-type: application/json; charset=utf-8`, 440,260 bytes.
- **Auth: none required.** The request was sent with no `Authorization` header and no cookie and
  succeeded, so no token/credential value is involved (nothing to redact). Headers sent were only
  `Accept`, `Origin: https://codolio.com`, `Referer: https://codolio.com/`, and a normal browser
  `User-Agent`. The api host is a public read endpoint for public sheets; the frontend calls it
  unauthenticated for logged-out visitors (the response carries per-user flags such as `isSolved:
  false` / `isStarred: false` for the anonymous viewer).
- How it was found: the route chunk `/_next/static/chunks/1733-3517f78096e6a0e1.js` and
  `9859-4908997f98867e26.js` define the service module
  `getSheetDataBySlug: e => a("/question-tracker/v2/sheet/get-sheet-data-by-slug/".concat(e))`
  where the shared helper `a` prefixes the base URL `https://node.codolio.com/api`.
- Response shape: `{status:{code,success,message,error}, data:{sheet:{...}, mappings:[...]}}`.
  `data.sheet` = sheet metadata (`name`, `slug`, `link`, `author`, `description`, `config`
  = `{topicOrder:[...18], subTopicOrder:{topic:[subtopics]}, questionOrder:[456 mapping ids]}`);
  `data.mappings` = 455 records, each with `title`, `topic`, `subTopic`, `resource` plus an
  embedded `questionId` object carrying `platform`, `difficulty`, `name`, `problemUrl`, `id`.
  `data.sheet.topics` does not exist; the topic tree is reconstructed from `config`, the same way
  the site's own minified tree builder (function `B(sheet, mappings)` in the route chunk) does:
  walk `topicOrder`, then `subTopicOrder[topic]`, filtering `mappings` by `(topic, subTopic)`.

### Reproducibility check

The endpoint was called twice (second call with no cookies and no `Origin`/`Referer`/`UA`, only
`Accept: application/json`): both returned `200` and exactly 440,260 bytes. A structural diff of
the two bodies shows **2 differing fields only**: `data.sheet.followers` (37043 → 37044) and
`data.sheet.updatedAt`, i.e. every one of the 455 mappings is byte-identical between calls. The
saved `codolio_raw.json` is the body of the first call, unmodified.

## Counts (measured)

| metric | value |
|---|---|
| total problems (`data.mappings` length) | **455** |
| problems in `codolio.json` | **455** |
| distinct topics | 18 |
| (topic, subtopic) pairs | 61 (58 distinct titles; `Lec 1 : Learning` and `Lec 2 : Medium Problems` are reused across steps) |
| listed subtopics with zero problems | 0 |
| mappings whose `subTopic` is not listed in `subTopicOrder` | 0 |
| `config.questionOrder` entries | 456: 455 mapping ids plus one stale id `68cdd0a875f6e73b0375db6e` that is not in `mappings` (ignored); every real mapping is present, so no fallback ordering was needed |
| problems with non-empty `problemUrl` | **455** |
| problems with an `http(s)://` `problemUrl` | 454 |
| problems with a placeholder `problemUrl` (`"#"`) | 1 (`Java Collections`, Step 1 / Lec 3) |
| problems with empty title after fallback | 0 |

### `platform` counts

Normalized to the frozen `data.json` enum (`leetcode | gfg | codingninjas | other`):

| platform | count |
|---|---|
| leetcode | 274 |
| other | 181 |

Raw `questionId.platform` values as returned by the API (preserved in `codolio.json` as `platformRaw`):

| platformRaw | count | normalized to |
|---|---|---|
| leetcode | 274 | leetcode |
| tuf | 172 | other |
| hackerrank | 5 | other |
| interviewbit | 3 | other |
| spoj | 1 | other |
| **total** | **455** | |

> The source has no `gfg` / `codingninjas` entries. `tuf` = takeuforward.org (Striver's own
> article/problem pages), plus a few hackerrank/interviewbit/spoj rows. All non-LeetCode rows map
> to the contract value `other`; the original string is kept per problem so the merger can choose a
> different mapping (e.g. treating `tuf` article links as `article` rather than a solve link).

### `difficulty` counts

The source uses `Basic` (17 rows) in addition to `Easy|Medium|Hard`, and the contract enum has no
`Basic`. Normalized `Basic -> Easy`:

| difficulty (normalized) | count |
|---|---|
| Easy | 146 |
| Medium | 252 |
| Hard | 57 |
| (empty) | 0 |

Raw `questionId.difficulty` as returned by the API (preserved as `difficultyRaw`):

| difficultyRaw | count |
|---|---|
| Basic | 17 |
| Easy | 129 |
| Medium | 252 |
| Hard | 57 |

## Topics, in sheet order

Order comes from `data.sheet.config.topicOrder`; problems are grouped by
`config.subTopicOrder[topic]` and sequenced inside each subtopic by `config.questionOrder`
(the same algorithm the site renders). `order` in `codolio.json` is the resulting global 1-based
index.

| # | topic | problems | subtopics |
|---|---|---|---|
| 1 | Step 1 : Learn the basics | 31 | 6 |
| 2 | Step 2 : Learn Important Sorting Techniques | 7 | 2 |
| 3 | Step 3 : Solve Problems on Arrays [Easy -> Medium -> Hard] | 40 | 3 |
| 4 | Step 4 : Binary Search [1D, 2D Arrays, Search Space] | 32 | 3 |
| 5 | Step 5 : Strings [Basic and Medium] | 15 | 2 |
| 6 | Step 6 : Learn LinkedList [Single LL, Double LL, Medium, Hard Problems] | 31 | 5 |
| 7 | Step 7 : Recursion [PatternWise] | 25 | 3 |
| 8 | Step 8 : Bit Manipulation [Concepts & Problems] | 18 | 3 |
| 9 | Step 9 : Stack and Queues [Learning, Pre-In-Post-fix, Monotonic Stack, Implementation] | 30 | 4 |
| 10 | Step 10 : Sliding Window & Two Pointer Combined Problems | 12 | 2 |
| 11 | Step 11 : Heaps [Learning, Medium, Hard Problems] | 17 | 3 |
| 12 | Step 12 : Greedy Algorithms [Easy, Medium/Hard] | 16 | 2 |
| 13 | Step 13 : Binary Trees [Traversals, Medium and Hard Problems] | 39 | 3 |
| 14 | Step 14 : Binary Search Trees [Concept and Problems] | 16 | 2 |
| 15 | Step 15 : Graphs [Concepts & Problems] | 54 | 6 |
| 16 | Step 16 : Dynamic Programming [Patterns and Problems] | 56 | 9 |
| 17 | Step 17 : Tries | 7 | 2 |
| 18 | Step 18 : Strings | 9 | 1 |

Subtopics per topic (sheet order, as listed in `config.subTopicOrder`):

1. **Step 1 : Learn the basics**: Lec 1 : Things to Know in C++/Java/Python or any language; Lec 2 : Build-up Logical Thinking; Lec 3 : Learn STL/Java-Collections or similar thing in your language; Lec 4 : Know Basic Maths; Lec 5 : Learn Basic Recursion; Lec 6 : Learn Basic Hashing
2. **Step 2 : Learn Important Sorting Techniques**: Lec 1 : Sorting-I; Lec 2 : Sorting-II
3. **Step 3 : Solve Problems on Arrays [Easy -> Medium -> Hard]**: Lec 1 : Easy; Lec 2 : Medium; Lec 3 : Hard
4. **Step 4 : Binary Search [1D, 2D Arrays, Search Space]**: Lec 1 : BS on 1D Arrays; Lec 2 : BS on Answers; Lec 3 : BS on 2D Arrays
5. **Step 5 : Strings [Basic and Medium]**: Lec 1 : Basic and Easy String Problems; Lec 2 : Medium String Problems
6. **Step 6 : Learn LinkedList [Single LL, Double LL, Medium, Hard Problems]**: Lec 1 : Learn 1D LinkedList; Lec 2 : Learn Doubly LinkedList; Lec 3 : Medium Problems of LL; Lec 4 : Medium Problems of DLL; Lec 5 : Hard Problems of LL
7. **Step 7 : Recursion [PatternWise]**: Lec 1 : Get a Strong Hold; Lec 2 : Subsequences Pattern; Lec 3 : Trying out all Combos / Hard
8. **Step 8 : Bit Manipulation [Concepts & Problems]**: Lec 1 : Learn Bit Manipulation; Lec 2 : Interview Problems; Lec 3 : Advanced Maths
9. **Step 9 : Stack and Queues [... ]**: Lec 1 : Learning; Lec 2 : Prefix, Infix, PostFix Conversion Problems; Lec 3 : Monotonic Stack/Queue Problems [VVV. Imp]; Lec 4 : Implementation Problems
10. **Step 10 : Sliding Window & Two Pointer Combined Problems**: Lec 1 : Medium Problems; Lec 2 : Hard Problems
11. **Step 11 : Heaps [Learning, Medium, Hard Problems]**: Lec 1 : Learning; Lec 2 : Medium Problems; Lec 3 : Hard Problems
12. **Step 12 : Greedy Algorithms [Easy, Medium/Hard]**: Lec 1 : Easy Problems; Lec 2 : Medium/Hard
13. **Step 13 : Binary Trees [Traversals, Medium and Hard Problems]**: Lec 1 : Traversals; Lec 2 : Medium Problems; Lec 3: Hard Problems
14. **Step 14 : Binary Search Trees [Concept and Problems]**: Lec 1 : Concepts; Lec 2 : Practice Problems
15. **Step 15 : Graphs [Concepts & Problems]**: Lec 1 : Learning; Lec 2 : Problems on BFS/DFS; Lec 3 : Topo Sort and Problems; Lec 4 : Shortest Path Algorithms and Problems; Lec 5 : MinimumSpanningTree/Disjoint Set and Problems; Lec 6 : Other Algorithms
16. **Step 16 : Dynamic Programming [Patterns and Problems]**: Lec 1 : Introduction to DP; Lec 2 : 1D DP; Lec 3 : 2D/3D DP and DP on Grids; Lec 4 : DP on Subsequences; Lec 5 : DP on Strings; Lec 6 : DP on Stocks; Lec 7 : DP on LIS; Lec 8 : MCM DP | Partition DP; Lec 9 : DP on Squares
17. **Step 17 : Tries**: Lec 1 : Theory; Lec 2: Problems
18. **Step 18 : Strings**: Lec 1 : Hard Problems

## Caveats for the merge

- **Duplicate URLs are real, not a bug.** 34 distinct `http(s)` URLs appear more than once (e.g.
  `single-number` 3x, `rotate-array` 2x, `merge-intervals` 2x) because Striver's sheet revisits the
  same problem in a later step/subtopic. Titles are likewise duplicated once (`Assign Cookies`
  appears in Step 12 Greedy and in another subtopic). Do not de-duplicate by URL.
- **`title` is sometimes null in the raw source** (6 of 455 mappings); the extract falls back to
  `questionId.name`, which is why every emitted row has a non-empty `title`. The two strings
  genuinely differ in places (e.g. mapping title `Functions (Pass by Reference and Value)` vs
  canonical `c tutorial functions`), so mapping `title` is the sheet's displayed label and
  `questionId.name` is the underlying platform name.
- `resource` (a YouTube/article link from the sheet itself) is carried through as an extra field.
- `codolio.json` is a **JSON array** of 455 objects with keys
  `sheetTitle, topic, subTopic, order, title, platform, problemUrl, difficulty` plus the
  fidelity extras `platformRaw, difficultyRaw, problemId, resource`.
- `codolio_raw.json` is the verbatim 440,260-byte API response body (byte-identical to what
  `curl` received), unmodified.
