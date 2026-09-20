# Link health report: Striver A2Z sheet external links

**Input snapshot:** `data/raw/base_items.json`, mtime 2026-09-20 20:23, sha256 `43bb387d231b78197bfbc7e1090ca45036ad04c7027f10ac9fa90df6ce9a5786`. Checked revision = that snapshot; re-run if the file changes.

Every `tufUrl`, `leetcodeUrl`, `articleUrl` and `videoUrl` in that revision was collected, deduplicated by exact URL string, and probed. Outputs: `data/raw/link_health.json` (one entry per unique URL), this report.

## Method

Exactly one GET per unique URL, redirects followed, body discarded:

```bash
curl -sSL -o /dev/null -w '%{http_code} %{url_effective}' --max-time 25 -A \
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' \
  -- '<url>'
```

- 12 concurrent workers; each URL fetched once and retried only on curl-level failure (non-zero exit, unparsable `%{http_code}`). **0 of the 1124 URLs needed that retry**: every curl call exited 0, so every `status` below is verbatim `%{http_code}`.
- `link_health.json` keys are the exact URL strings; values are `{status, finalUrl, kind, moved}`. `status` is an integer exactly when curl printed one (a URL is recorded `200` only where that curl call printed `200`); it would be the string `curl_exit_<n>` for a curl-level failure; no such entry exists in this run. `finalUrl` is `%{url_effective}`, `moved` is `finalUrl != url`.
- **Every non-200 URL was re-probed serially, one request at a time** to rule out concurrency/rate-limit artefacts; results are unchanged.

## Totals

| kind | unique URLs | 200 | non-200 |
|---|---:|---:|---:|
| tuf | 442 | 440 | 2 |
| leetcode | 222 | 0 | 222 |
| article | 159 | 159 | 0 |
| video | 301 | 301 | 0 |
| **all** | **1124** | **900** | **224** |

Status codes observed: `200` ×900, `403` ×222, `404` ×2.

Collection before dedup (this revision):

| kind | rows carrying the field | raw mentions | unique URLs |
|---|---:|---:|---:|
| tuf | 445 | 445 | 442 |
| leetcode | 227 | 227 | 222 |
| article | 159 | 159 | 159 |
| video | 339 | 339 | 301 |

(`tufUrl` is present on all 445 rows: 402 practice, 38 concept lessons, 5 contest rows. 1170 mentions collapse to 1124 unique URLs: 38 duplicate video links, 5 duplicate LeetCode links, 3 duplicate takeuforward links; all 159 article links are distinct. No URL appears under two kinds.)

## Non-200 URLs, grouped by status

### status `403`: 222 URL(s)

Serial re-probe (one request at a time) on all 222: `403` ×222.

- `https://leetcode.com/accounts/login/?next=/problems/find-the-celebrity/`  
  kind **leetcode** · finalUrl `https://leetcode.com/accounts/login/?next=/problems/find-the-celebrity/` · curl exit 0 · used by: Celebrity Problem (tufId 957)
- `https://leetcode.com/problems/01-matrix/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/01-matrix/` · curl exit 0 · used by: Distance of nearest cell having one (tufId 530)
- `https://leetcode.com/problems/3sum/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/3sum/` · curl exit 0 · used by: 3 Sum (tufId 27)
- `https://leetcode.com/problems/4sum/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/4sum/` · curl exit 0 · used by: 4 Sum (tufId 28)
- `https://leetcode.com/problems/accounts-merge/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/accounts-merge/` · curl exit 0 · used by: Accounts merge (tufId 511)
- `https://leetcode.com/problems/add-two-numbers/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/add-two-numbers/` · curl exit 0 · used by: Add two numbers in Linked List (tufId 625)
- `https://leetcode.com/problems/alien-dictionary/solution/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/alien-dictionary/solution/` · curl exit 0 · used by: Alien Dictionary (tufId 503)
- `https://leetcode.com/problems/all-nodes-distance-k-in-binary-tree/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/all-nodes-distance-k-in-binary-tree/` · curl exit 0 · used by: Print all nodes at a distance of K in BT (tufId 121)
- `https://leetcode.com/problems/armstrong-number/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/armstrong-number/` · curl exit 0 · used by: Check if the Number is Armstrong (tufId 366)
- `https://leetcode.com/problems/assign-cookies/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/assign-cookies/` · curl exit 0 · used by: Assign Cookies (tufId 541)
- `https://leetcode.com/problems/asteroid-collision/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/asteroid-collision/` · curl exit 0 · used by: Asteroid Collision (tufId 967)
- `https://leetcode.com/problems/balanced-binary-tree/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/balanced-binary-tree/` · curl exit 0 · used by: Check for balanced binary tree (tufId 127)
- `https://leetcode.com/problems/best-time-to-buy-and-sell-stock-ii/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/best-time-to-buy-and-sell-stock-ii/` · curl exit 0 · used by: Best time to buy and sell stock II (tufId 302)
- `https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iii/description/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iii/description/` · curl exit 0 · used by: Best time to buy and sell stock III (tufId 303)
- `https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iv/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iv/` · curl exit 0 · used by: Best time to buy and sell stock IV (tufId 304)
- `https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-transaction-fee/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-transaction-fee/` · curl exit 0 · used by: Best time to buy and sell stock with transaction fees (tufId 305)
- `https://leetcode.com/problems/best-time-to-buy-and-sell-stock/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/best-time-to-buy-and-sell-stock/` · curl exit 0 · used by: Best time to buy and sell stock (tufId 301)
- `https://leetcode.com/problems/binary-search-tree-iterator/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/binary-search-tree-iterator/` · curl exit 0 · used by: BST iterator (tufId 96)
- `https://leetcode.com/problems/binary-search/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/binary-search/` · curl exit 0 · used by: Search X in sorted array (tufId 81)
- `https://leetcode.com/problems/binary-subarrays-with-sum/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/binary-subarrays-with-sum/` · curl exit 0 · used by: Binary Subarrays With Sum (tufId 923)
- `https://leetcode.com/problems/binary-tree-inorder-traversal/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/binary-tree-inorder-traversal/` · curl exit 0 · used by: Inorder Traversal (tufId 133); Morris Inorder Traversal (tufId 139); Morris Preorder Traversal (tufId 138)
- `https://leetcode.com/problems/binary-tree-level-order-traversal/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/binary-tree-level-order-traversal/` · curl exit 0 · used by: Level Order Traversal (tufId 134)
- `https://leetcode.com/problems/binary-tree-maximum-path-sum/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/binary-tree-maximum-path-sum/` · curl exit 0 · used by: Maximum path sum (tufId 132)
- `https://leetcode.com/problems/binary-tree-postorder-traversal/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/binary-tree-postorder-traversal/` · curl exit 0 · used by: Postorder Traversal (tufId 135)
- `https://leetcode.com/problems/binary-tree-preorder-traversal/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/binary-tree-preorder-traversal/` · curl exit 0 · used by: Preorder Traversal (tufId 137)
- `https://leetcode.com/problems/binary-tree-right-side-view/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/binary-tree-right-side-view/` · curl exit 0 · used by: Right/Left View of BT (tufId 123)
- `https://leetcode.com/problems/binary-tree-zigzag-level-order-traversal/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/binary-tree-zigzag-level-order-traversal/` · curl exit 0 · used by: Zig Zag or Spiral Traversal (tufId 126)
- `https://leetcode.com/problems/boundary-of-binary-tree/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/boundary-of-binary-tree/` · curl exit 0 · used by: Boundary Traversal (tufId 116)
- `https://leetcode.com/problems/burst-balloons/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/burst-balloons/` · curl exit 0 · used by: Burst balloons (tufId 326)
- `https://leetcode.com/problems/candy/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/candy/` · curl exit 0 · used by: Candy (tufId 544)
- `https://leetcode.com/problems/capacity-to-ship-packages-within-d-days/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/capacity-to-ship-packages-within-d-days/` · curl exit 0 · used by: Capacity to Ship Packages Within D Days (tufId 161)
- `https://leetcode.com/problems/cheapest-flights-within-k-stops/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/cheapest-flights-within-k-stops/` · curl exit 0 · used by: Cheapest flight within K stops (tufId 519)
- `https://leetcode.com/problems/check-if-array-is-sorted-and-rotated/#:~:text=Input%3A%20nums%20%3D%20%5B2%2C,no%20rotation)%20to%20make%20nums.`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/check-if-array-is-sorted-and-rotated/#:~:text=Input%3A%20nums%20%3D%20%5B2%2C,no%20rotation)%20to%20make%20nums.` · curl exit 0 · used by: Check if the Array is Sorted II (tufId 379)
- `https://leetcode.com/problems/climbing-stairs/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/climbing-stairs/` · curl exit 0 · used by: Climbing stairs (tufId 287)
- `https://leetcode.com/problems/coin-change-2/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/coin-change-2/` · curl exit 0 · used by: Coin change II (tufId 316)
- `https://leetcode.com/problems/coin-change/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/coin-change/` · curl exit 0 · used by: Minimum coins (tufId 319)
- `https://leetcode.com/problems/combination-sum-ii/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/combination-sum-ii/` · curl exit 0 · used by: Combination Sum II (tufId 865)
- `https://leetcode.com/problems/combination-sum-iii/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/combination-sum-iii/` · curl exit 0 · used by: Combination Sum III (tufId 866)
- `https://leetcode.com/problems/combination-sum/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/combination-sum/` · curl exit 0 · used by: Combination Sum (tufId 864)
- `https://leetcode.com/problems/construct-binary-search-tree-from-preorder-traversal/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/construct-binary-search-tree-from-preorder-traversal/` · curl exit 0 · used by: Construct a BST from a preorder traversal (tufId 101)
- `https://leetcode.com/problems/construct-binary-tree-from-inorder-and-postorder-traversal/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/construct-binary-tree-from-inorder-and-postorder-traversal/` · curl exit 0 · used by: Construct a BT from Postorder and Inorder (tufId 109)
- `https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/` · curl exit 0 · used by: Construct a BT from Preorder and Inorder (tufId 110)
- `https://leetcode.com/problems/copy-list-with-random-pointer/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/copy-list-with-random-pointer/` · curl exit 0 · used by: Clone a LL with random and next pointer (tufId 611)
- `https://leetcode.com/problems/count-and-say/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/count-and-say/` · curl exit 0 · used by: Count and say (tufId 982)
- `https://leetcode.com/problems/count-complete-tree-nodes/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/count-complete-tree-nodes/` · curl exit 0 · used by: Count total nodes in a complete BT (tufId 117)
- `https://leetcode.com/problems/count-number-of-nice-subarrays/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/count-number-of-nice-subarrays/` · curl exit 0 · used by: Count number of Nice subarrays (tufId 924)
- `https://leetcode.com/problems/count-primes/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/count-primes/` · curl exit 0 · used by: Count primes in range L to R (tufId 651)
- `https://leetcode.com/problems/course-schedule-ii/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/course-schedule-ii/` · curl exit 0 · used by: Course Schedule II (tufId 505)
- `https://leetcode.com/problems/course-schedule/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/course-schedule/` · curl exit 0 · used by: Detect a cycle in an undirected graph (tufId 501); Detect a cycle in a directed graph (tufId 500); Course Schedule I (tufId 504)
- `https://leetcode.com/problems/critical-connections-in-a-network/discuss/382385/find-bridges-in-a-graph`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/critical-connections-in-a-network/discuss/382385/find-bridges-in-a-graph` · curl exit 0 · used by: Bridges in graph (tufId 497)
- `https://leetcode.com/problems/delete-node-in-a-bst/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/delete-node-in-a-bst/` · curl exit 0 · used by: Delete a node in BST (tufId 102)
- `https://leetcode.com/problems/delete-node-in-a-linked-list/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/delete-node-in-a-linked-list/` · curl exit 0 · used by: Deletion of the head of LL (tufId 352)
- `https://leetcode.com/problems/delete-operation-for-two-strings/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/delete-operation-for-two-strings/` · curl exit 0 · used by: Minimum insertions or deletions to convert string A to B (tufId 311)
- `https://leetcode.com/problems/delete-the-middle-node-of-a-linked-list/#:~:text=You%20are%20given%20the%20head,than%20or%20equal%20to%20x%20.`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/delete-the-middle-node-of-a-linked-list/#:~:text=You%20are%20given%20the%20head,than%20or%20equal%20to%20x%20.` · curl exit 0 · used by: Delete the middle node in LL (tufId 619)
- `https://leetcode.com/problems/diameter-of-binary-tree/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/diameter-of-binary-tree/` · curl exit 0 · used by: Diameter of Binary Tree (tufId 130)
- `https://leetcode.com/problems/distinct-subsequences/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/distinct-subsequences/` · curl exit 0 · used by: Distinct subsequences (tufId 306)
- `https://leetcode.com/problems/divide-two-integers/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/divide-two-integers/` · curl exit 0 · used by: Divide two numbers without multiplication and division (tufId 140)
- `https://leetcode.com/problems/edit-distance/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/edit-distance/` · curl exit 0 · used by: Edit distance (tufId 307)
- `https://leetcode.com/problems/fibonacci-number/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/fibonacci-number/` · curl exit 0 · used by: Fibonacci Number (tufId 381)
- `https://leetcode.com/problems/find-a-peak-element-ii/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/find-a-peak-element-ii/` · curl exit 0 · used by: Find Peak Element - II (tufId 65)
- `https://leetcode.com/problems/find-eventual-safe-states/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/find-eventual-safe-states/` · curl exit 0 · used by: Find eventual safe states (tufId 506)
- `https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/` · curl exit 0 · used by: First and last occurrence (tufId 85)
- `https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/` · curl exit 0 · used by: Find minimum in Rotated Sorted Array (tufId 83)
- `https://leetcode.com/problems/find-peak-element/#:~:text=Find%20Peak%20Element%20%2D%20LeetCode&text=A%20peak%20element%20is%20an,to%20any%20of%20the%20peaks.`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/find-peak-element/#:~:text=Find%20Peak%20Element%20%2D%20LeetCode&text=A%20peak%20element%20is%20an,to%20any%20of%20the%20peaks.` · curl exit 0 · used by: Find peak element (tufId 75)
- `https://leetcode.com/problems/find-the-city-with-the-smallest-number-of-neighbors-at-a-threshold-distance/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/find-the-city-with-the-smallest-number-of-neighbors-at-a-threshold-distance/` · curl exit 0 · used by: Find the city with the smallest number of neighbors (tufId 521)
- `https://leetcode.com/problems/find-the-smallest-divisor-given-a-threshold/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/find-the-smallest-divisor-given-a-threshold/` · curl exit 0 · used by: Find the smallest divisor (tufId 93)
- `https://leetcode.com/problems/flatten-binary-tree-to-linked-list/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/flatten-binary-tree-to-linked-list/` · curl exit 0 · used by: Flatten Binary Tree to Linked List (tufId 486)
- `https://leetcode.com/problems/flood-fill/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/flood-fill/` · curl exit 0 · used by: Flood fill algorithm (tufId 531)
- `https://leetcode.com/problems/frequency-of-the-most-frequent-element/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/frequency-of-the-most-frequent-element/` · curl exit 0 · used by: Highest Occurring Element in an Array (tufId 344)
- `https://leetcode.com/problems/fruit-into-baskets/description/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/fruit-into-baskets/description/` · curl exit 0 · used by: Fruit Into Baskets (tufId 926)
- `https://leetcode.com/problems/generate-parentheses/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/generate-parentheses/` · curl exit 0 · used by: Generate Parentheses (tufId 876)
- `https://leetcode.com/problems/house-robber-ii/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/house-robber-ii/` · curl exit 0 · used by: House robber (tufId 290)
- `https://leetcode.com/problems/house-robber/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/house-robber/` · curl exit 0 · used by: Maximum sum of non adjacent elements (tufId 291)
- `https://leetcode.com/problems/implement-queue-using-stacks/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/implement-queue-using-stacks/` · curl exit 0 · used by: Implement Queue using Stack (tufId 389)
- `https://leetcode.com/problems/implement-stack-using-queues/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/implement-stack-using-queues/` · curl exit 0 · used by: Implement Stack using Queue (tufId 392)
- `https://leetcode.com/problems/implement-strstr/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/implement-strstr/` · curl exit 0 · used by: KMP Algorithm or LPS array (tufId 977)
- `https://leetcode.com/problems/implement-trie-prefix-tree/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/implement-trie-prefix-tree/` · curl exit 0 · used by: Trie Implementation and Operations (tufId 1028)
- `https://leetcode.com/problems/inorder-successor-in-bst/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/inorder-successor-in-bst/` · curl exit 0 · used by: Inorder successor and predecessor in BST (tufId 103)
- `https://leetcode.com/problems/insert-interval/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/insert-interval/` · curl exit 0 · used by: Insert Interval (tufId 546)
- `https://leetcode.com/problems/insert-into-a-binary-search-tree/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/insert-into-a-binary-search-tree/` · curl exit 0 · used by: Insert a given node in BST (tufId 104)
- `https://leetcode.com/problems/intersection-of-two-linked-lists/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/intersection-of-two-linked-lists/` · curl exit 0 · used by: Find the intersection point of Y LL (tufId 621)
- `https://leetcode.com/problems/is-graph-bipartite/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/is-graph-bipartite/` · curl exit 0 · used by: Bipartite graph (tufId 499)
- `https://leetcode.com/problems/isomorphic-strings/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/isomorphic-strings/` · curl exit 0 · used by: Isomorphic Strings (tufId 393)
- `https://leetcode.com/problems/jump-game-ii/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/jump-game-ii/` · curl exit 0 · used by: Jump Game II (tufId 595)
- `https://leetcode.com/problems/jump-game/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/jump-game/` · curl exit 0 · used by: Jump Game - I (tufId 542)
- `https://leetcode.com/problems/koko-eating-bananas/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/koko-eating-bananas/` · curl exit 0 · used by: Koko eating bananas (tufId 94)
- `https://leetcode.com/problems/kth-largest-element-in-a-stream/#:~:text=Implement%20KthLargest%20class%3A,largest%20element%20in%20the%20stream.`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/kth-largest-element-in-a-stream/#:~:text=Implement%20KthLargest%20class%3A,largest%20element%20in%20the%20stream.` · curl exit 0 · used by: Kth largest element in a stream of running integers (tufId 567)
- `https://leetcode.com/problems/kth-missing-positive-number/#:~:text=Given%20an%20array%20arr%20of,13%2C...%5D.`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/kth-missing-positive-number/#:~:text=Given%20an%20array%20arr%20of,13%2C...%5D.` · curl exit 0 · used by: Kth Missing Positive Number (tufId 600)
- `https://leetcode.com/problems/kth-smallest-element-in-a-bst/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/kth-smallest-element-in-a-bst/` · curl exit 0 · used by: Kth Smallest and Largest element in BST (tufId 105)
- `https://leetcode.com/problems/largest-divisible-subset/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/largest-divisible-subset/` · curl exit 0 · used by: Largest Divisible Subset (tufId 603)
- `https://leetcode.com/problems/largest-odd-number-in-string/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/largest-odd-number-in-string/` · curl exit 0 · used by: Largest Odd Number in a String (tufId 394)
- `https://leetcode.com/problems/largest-rectangle-in-histogram/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/largest-rectangle-in-histogram/` · curl exit 0 · used by: Largest rectangle in a histogram (tufId 959)
- `https://leetcode.com/problems/lemonade-change/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/lemonade-change/` · curl exit 0 · used by: Lemonade Change (tufId 543)
- `https://leetcode.com/problems/letter-combinations-of-a-phone-number/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/letter-combinations-of-a-phone-number/` · curl exit 0 · used by: Letter Combinations of a Phone Number (tufId 875)
- `https://leetcode.com/problems/lfu-cache/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/lfu-cache/` · curl exit 0 · used by: LFU Cache (tufId 960)
- `https://leetcode.com/problems/linked-list-cycle-ii/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/linked-list-cycle-ii/` · curl exit 0 · used by: Find the starting point in LL (tufId 622)
- `https://leetcode.com/problems/linked-list-cycle/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/linked-list-cycle/` · curl exit 0 · used by: Detect a loop in LL (tufId 620)
- `https://leetcode.com/problems/longest-common-prefix/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/longest-common-prefix/` · curl exit 0 · used by: Longest Common Prefix (tufId 395)
- `https://leetcode.com/problems/longest-consecutive-sequence/solution/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/longest-consecutive-sequence/solution/` · curl exit 0 · used by: Longest Consecutive Sequence in an Array (tufId 563)
- `https://leetcode.com/problems/longest-happy-prefix/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/longest-happy-prefix/` · curl exit 0 · used by: Longest happy prefix (tufId 978)
- `https://leetcode.com/problems/longest-palindromic-subsequence/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/longest-palindromic-subsequence/` · curl exit 0 · used by: Longest palindromic subsequence (tufId 310)
- `https://leetcode.com/problems/longest-repeating-character-replacement/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/longest-repeating-character-replacement/` · curl exit 0 · used by: Longest Repeating Character Replacement (tufId 927)
- `https://leetcode.com/problems/longest-string-chain/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/longest-string-chain/` · curl exit 0 · used by: Longest String Chain (tufId 640)
- `https://leetcode.com/problems/longest-substring-with-at-most-k-distinct-characters/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/longest-substring-with-at-most-k-distinct-characters/` · curl exit 0 · used by: Longest Substring With At Most K Distinct Characters (tufId 928)
- `https://leetcode.com/problems/longest-substring-without-repeating-characters/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/longest-substring-without-repeating-characters/` · curl exit 0 · used by: Longest Substring Without Repeating Characters (tufId 929)
- `https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/` · curl exit 0 · used by: LCA in BST (tufId 106)
- `https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/` · curl exit 0 · used by: LCA in BT (tufId 118)
- `https://leetcode.com/problems/majority-element-ii/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/majority-element-ii/` · curl exit 0 · used by: Majority Element-II (tufId 23)
- `https://leetcode.com/problems/majority-element/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/majority-element/` · curl exit 0 · used by: Majority Element-I (tufId 22)
- `https://leetcode.com/problems/making-a-large-island/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/making-a-large-island/` · curl exit 0 · used by: Making a large island (tufId 512)
- `https://leetcode.com/problems/max-consecutive-ones-iii/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/max-consecutive-ones-iii/` · curl exit 0 · used by: Max Consecutive Ones III (tufId 930)
- `https://leetcode.com/problems/max-consecutive-ones/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/max-consecutive-ones/` · curl exit 0 · used by: Maximum Consecutive Ones (tufId 42)
- `https://leetcode.com/problems/maximal-rectangle/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/maximal-rectangle/` · curl exit 0 · used by: Maximum Rectangles (tufId 962)
- `https://leetcode.com/problems/maximum-depth-of-binary-tree/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/maximum-depth-of-binary-tree/` · curl exit 0 · used by: Maximum Depth in BT (tufId 131)
- `https://leetcode.com/problems/maximum-number-of-non-overlapping-substrings/discuss/766485/kosaraju-algorithm-on`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/maximum-number-of-non-overlapping-substrings/discuss/766485/kosaraju-algorithm-on` · curl exit 0 · used by: Kosaraju's algorithm (tufId 498)
- `https://leetcode.com/problems/maximum-points-you-can-obtain-from-cards/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/maximum-points-you-can-obtain-from-cards/` · curl exit 0 · used by: Maximum Points You Can Obtain from Cards (tufId 922)
- `https://leetcode.com/problems/maximum-product-subarray/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/maximum-product-subarray/` · curl exit 0 · used by: Maximum Product Subarray in an Array (tufId 24)
- `https://leetcode.com/problems/maximum-sum-bst-in-binary-tree/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/maximum-sum-bst-in-binary-tree/` · curl exit 0 · used by: Largest BST in Binary Tree (tufId 98)
- `https://leetcode.com/problems/maximum-width-of-binary-tree/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/maximum-width-of-binary-tree/` · curl exit 0 · used by: Maximum Width of BT (tufId 119)
- `https://leetcode.com/problems/maximum-xor-of-two-numbers-in-an-array/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/maximum-xor-of-two-numbers-in-an-array/` · curl exit 0 · used by: Maximum XOR of two numbers in an array (tufId 1024)
- `https://leetcode.com/problems/maximum-xor-with-an-element-from-array/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/maximum-xor-with-an-element-from-array/` · curl exit 0 · used by: Maximum Xor with an element from an array (tufId 1025)
- `https://leetcode.com/problems/median-of-two-sorted-arrays/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/median-of-two-sorted-arrays/` · curl exit 0 · used by: Median of 2 sorted arrays (tufId 77)
- `https://leetcode.com/problems/merge-intervals/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/merge-intervals/` · curl exit 0 · used by: Merge Intervals (tufId 712)
- `https://leetcode.com/problems/merge-sorted-array/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/merge-sorted-array/` · curl exit 0 · used by: Merge two sorted arrays without extra space (tufId 25)
- `https://leetcode.com/problems/merge-two-sorted-lists/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/merge-two-sorted-lists/` · curl exit 0 · used by: Merge two Sorted Lists (tufId 613)
- `https://leetcode.com/problems/middle-of-the-linked-list/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/middle-of-the-linked-list/` · curl exit 0 · used by: Find Middle of Linked List (tufId 448)
- `https://leetcode.com/problems/min-stack/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/min-stack/` · curl exit 0 · used by: Implement Min Stack (tufId 958)
- `https://leetcode.com/problems/minimize-max-distance-to-gas-station/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/minimize-max-distance-to-gas-station/` · curl exit 0 · used by: Minimize Max Distance to Gas Station (tufId 78)
- `https://leetcode.com/problems/minimum-add-to-make-parentheses-valid/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/minimum-add-to-make-parentheses-valid/` · curl exit 0 · used by: Minimum number of bracket reversals to make an expression balanced (tufId 983)
- `https://leetcode.com/problems/minimum-bit-flips-to-convert-number/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/minimum-bit-flips-to-convert-number/` · curl exit 0 · used by: Minimum Bit Flips to Convert Number (tufId 141)
- `https://leetcode.com/problems/minimum-insertion-steps-to-make-a-string-palindrome/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/minimum-insertion-steps-to-make-a-string-palindrome/` · curl exit 0 · used by: Minimum insertions to make string palindrome (tufId 312)
- `https://leetcode.com/problems/minimum-number-of-days-to-make-m-bouquets/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/minimum-number-of-days-to-make-m-bouquets/` · curl exit 0 · used by: Minimum days to make M bouquets (tufId 95)
- `https://leetcode.com/problems/minimum-path-sum/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/minimum-path-sum/` · curl exit 0 · used by: Minimum Falling Path Sum (tufId 298)
- `https://leetcode.com/problems/minimum-window-substring/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/minimum-window-substring/` · curl exit 0 · used by: Minimum Window Substring (tufId 931)
- `https://leetcode.com/problems/most-stones-removed-with-same-row-or-column/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/most-stones-removed-with-same-row-or-column/` · curl exit 0 · used by: Most stones removed with same row or column (tufId 513)
- `https://leetcode.com/problems/move-zeroes/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/move-zeroes/` · curl exit 0 · used by: Move Zeros to End (tufId 46)
- `https://leetcode.com/problems/n-queens/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/n-queens/` · curl exit 0 · used by: N Queen (tufId 870)
- `https://leetcode.com/problems/next-greater-element-i/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/next-greater-element-i/` · curl exit 0 · used by: Next Greater Element (tufId 968)
- `https://leetcode.com/problems/next-greater-element-ii/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/next-greater-element-ii/` · curl exit 0 · used by: Next Greater Element - 2 (tufId 969)
- `https://leetcode.com/problems/next-permutation/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/next-permutation/` · curl exit 0 · used by: Next Permutation (tufId 31)
- `https://leetcode.com/problems/non-overlapping-intervals/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/non-overlapping-intervals/` · curl exit 0 · used by: Non-overlapping Intervals (tufId 550)
- `https://leetcode.com/problems/number-of-enclaves/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/number-of-enclaves/` · curl exit 0 · used by: Number of enclaves (tufId 533)
- `https://leetcode.com/problems/number-of-islands-ii/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/number-of-islands-ii/` · curl exit 0 · used by: Number of islands II (tufId 514)
- `https://leetcode.com/problems/number-of-islands/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/number-of-islands/` · curl exit 0 · used by: Number of islands (tufId 534)
- `https://leetcode.com/problems/number-of-longest-increasing-subsequence/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/number-of-longest-increasing-subsequence/` · curl exit 0 · used by: Number of Longest Increasing Subsequences (tufId 780)
- `https://leetcode.com/problems/number-of-operations-to-make-network-connected/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/number-of-operations-to-make-network-connected/` · curl exit 0 · used by: Number of operations to make network connected (tufId 515)
- `https://leetcode.com/problems/number-of-provinces/#:~:text=A%20province%20is%20a%20group,the%20total%20number%20of%20provinces.`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/number-of-provinces/#:~:text=A%20province%20is%20a%20group,the%20total%20number%20of%20provinces.` · curl exit 0 · used by: Number of provinces (tufId 535)
- `https://leetcode.com/problems/number-of-substrings-containing-all-three-characters/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/number-of-substrings-containing-all-three-characters/` · curl exit 0 · used by: Number of Substrings Containing All Three Characters (tufId 925)
- `https://leetcode.com/problems/number-of-ways-to-arrive-at-destination/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/number-of-ways-to-arrive-at-destination/` · curl exit 0 · used by: Number of ways to arrive at destination (tufId 524)
- `https://leetcode.com/problems/odd-even-linked-list/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/odd-even-linked-list/` · curl exit 0 · used by: Segregate odd and even nodes in Linked List (tufId 628)
- `https://leetcode.com/problems/online-stock-span/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/online-stock-span/` · curl exit 0 · used by: Stock span problem (tufId 964)
- `https://leetcode.com/problems/palindrome-linked-list/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/palindrome-linked-list/` · curl exit 0 · used by: Check if LL is palindrome or not (tufId 618)
- `https://leetcode.com/problems/palindrome-number/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/palindrome-number/` · curl exit 0 · used by: Palindrome Number (tufId 374)
- `https://leetcode.com/problems/palindrome-partitioning-ii/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/palindrome-partitioning-ii/` · curl exit 0 · used by: Palindrome partitioning II (tufId 329)
- `https://leetcode.com/problems/parsing-a-boolean-expression/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/parsing-a-boolean-expression/` · curl exit 0 · used by: Different Ways to Evaluate a Boolean Expression (tufId 276)
- `https://leetcode.com/problems/partition-array-for-maximum-sum/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/partition-array-for-maximum-sum/` · curl exit 0 · used by: Partition Array for Maximum Sum (tufId 810)
- `https://leetcode.com/problems/partition-array-into-two-arrays-to-minimize-sum-difference/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/partition-array-into-two-arrays-to-minimize-sum-difference/` · curl exit 0 · used by: Partition a set into two subsets with minimum absolute sum difference (tufId 320)
- `https://leetcode.com/problems/partition-equal-subset-sum/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/partition-equal-subset-sum/` · curl exit 0 · used by: Partition equal subset sum (tufId 321)
- `https://leetcode.com/problems/pascals-triangle/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/pascals-triangle/` · curl exit 0 · used by: Pascal's Triangle I (tufId 813)
- `https://leetcode.com/problems/path-with-minimum-effort/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/path-with-minimum-effort/` · curl exit 0 · used by: Path with minimum effort (tufId 525)
- `https://leetcode.com/problems/powx-n/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/powx-n/` · curl exit 0 · used by: Pow(x,n) (tufId 877)
- `https://leetcode.com/problems/rearrange-array-elements-by-sign/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/rearrange-array-elements-by-sign/` · curl exit 0 · used by: Rearrange array elements by sign (tufId 34)
- `https://leetcode.com/problems/recover-binary-search-tree/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/recover-binary-search-tree/` · curl exit 0 · used by: Correct BST with two nodes swapped (tufId 97)
- `https://leetcode.com/problems/remove-duplicates-from-sorted-array/#:~:text=Input%3A%20nums%20%3D%20%5B0%2C,%2C%203%2C%20and%204%20respectively.`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/remove-duplicates-from-sorted-array/#:~:text=Input%3A%20nums%20%3D%20%5B0%2C,%2C%203%2C%20and%204%20respectively.` · curl exit 0 · used by: Remove duplicates from sorted array (tufId 47)
- `https://leetcode.com/problems/remove-k-digits/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/remove-k-digits/` · curl exit 0 · used by: Remove K Digits (tufId 970)
- `https://leetcode.com/problems/remove-nth-node-from-end-of-list/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/remove-nth-node-from-end-of-list/` · curl exit 0 · used by: Remove Nth node from the back of the LL (tufId 626)
- `https://leetcode.com/problems/repeated-string-match/discuss/416144/Rabin-Karp-algorithm-C%2B%2B-implementation`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/repeated-string-match/discuss/416144/Rabin-Karp-algorithm-C%2B%2B-implementation` · curl exit 0 · used by: Rabin Karp Algorithm (tufId 979)
- `https://leetcode.com/problems/reverse-integer/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/reverse-integer/` · curl exit 0 · used by: Reverse a number (tufId 376)
- `https://leetcode.com/problems/reverse-linked-list/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/reverse-linked-list/` · curl exit 0 · used by: Reverse a LL (tufId 627)
- `https://leetcode.com/problems/reverse-nodes-in-k-group/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/reverse-nodes-in-k-group/` · curl exit 0 · used by: Reverse LL in group of given size K (tufId 614)
- `https://leetcode.com/problems/reverse-pairs/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/reverse-pairs/` · curl exit 0 · used by: Reverse Pairs (tufId 26)
- `https://leetcode.com/problems/reverse-words-in-a-string/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/reverse-words-in-a-string/` · curl exit 0 · used by: Reverse every word in a string (tufId 984)
- `https://leetcode.com/problems/rotate-array/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/rotate-array/` · curl exit 0 · used by: Left Rotate Array by One (tufId 40); Left Rotate Array by K Places (tufId 39)
- `https://leetcode.com/problems/rotate-image/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/rotate-image/` · curl exit 0 · used by: Rotate matrix by 90 degrees (tufId 35)
- `https://leetcode.com/problems/rotate-list/description/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/rotate-list/description/` · curl exit 0 · used by: Rotate a LL (tufId 615)
- `https://leetcode.com/problems/rotate-string/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/rotate-string/` · curl exit 0 · used by: Rotate String (tufId 398)
- `https://leetcode.com/problems/rotting-oranges/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/rotting-oranges/` · curl exit 0 · used by: Rotten Oranges (tufId 536)
- `https://leetcode.com/problems/same-tree/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/same-tree/` · curl exit 0 · used by: Check if two trees are identical or not (tufId 129)
- `https://leetcode.com/problems/search-a-2d-matrix-ii/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/search-a-2d-matrix-ii/` · curl exit 0 · used by: Search in 2D matrix - II (tufId 68)
- `https://leetcode.com/problems/search-a-2d-matrix/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/search-a-2d-matrix/` · curl exit 0 · used by: Search in a 2D Matrix (tufId 69)
- `https://leetcode.com/problems/search-in-a-binary-search-tree/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/search-in-a-binary-search-tree/` · curl exit 0 · used by: Search in BST (tufId 108)
- `https://leetcode.com/problems/search-in-rotated-sorted-array-ii/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/search-in-rotated-sorted-array-ii/` · curl exit 0 · used by: Search in rotated sorted array-II (tufId 88)
- `https://leetcode.com/problems/search-in-rotated-sorted-array/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/search-in-rotated-sorted-array/` · curl exit 0 · used by: Search in rotated sorted array-I (tufId 87)
- `https://leetcode.com/problems/search-insert-position/#:~:text=Search%20Insert%20Position%20%2D%20LeetCode&text=Given%20a%20sorted%20array%20of,(log%20n)%20runtime%20complexity.`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/search-insert-position/#:~:text=Search%20Insert%20Position%20%2D%20LeetCode&text=Given%20a%20sorted%20array%20of,(log%20n)%20runtime%20complexity.` · curl exit 0 · used by: Search insert position (tufId 89)
- `https://leetcode.com/problems/serialize-and-deserialize-binary-tree/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/serialize-and-deserialize-binary-tree/` · curl exit 0 · used by: Serialize and De-serialize BT (tufId 112)
- `https://leetcode.com/problems/set-matrix-zeroes/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/set-matrix-zeroes/` · curl exit 0 · used by: Set Matrix Zeroes (tufId 911)
- `https://leetcode.com/problems/shortest-common-supersequence/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/shortest-common-supersequence/` · curl exit 0 · used by: Shortest common supersequence (tufId 313)
- `https://leetcode.com/problems/shortest-path-in-binary-matrix/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/shortest-path-in-binary-matrix/` · curl exit 0 · used by: Shortest Distance in a Binary Maze (tufId 527)
- `https://leetcode.com/problems/single-element-in-a-sorted-array/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/single-element-in-a-sorted-array/` · curl exit 0 · used by: Single element in sorted array (tufId 90)
- `https://leetcode.com/problems/single-number/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/single-number/` · curl exit 0 · used by: Single Number - I (tufId 143)
- `https://leetcode.com/problems/sliding-window-maximum/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/sliding-window-maximum/` · curl exit 0 · used by: Sliding Window Maximum (tufId 963)
- `https://leetcode.com/problems/sort-characters-by-frequency/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/sort-characters-by-frequency/` · curl exit 0 · used by: Sort Characters by Frequency (tufId 399)
- `https://leetcode.com/problems/sort-colors/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/sort-colors/` · curl exit 0 · used by: Sort an array of 0's 1's and 2's (tufId 36)
- `https://leetcode.com/problems/sort-list/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/sort-list/` · curl exit 0 · used by: Sort LL (tufId 616)
- `https://leetcode.com/problems/spiral-matrix/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/spiral-matrix/` · curl exit 0 · used by: Print the matrix in spiral manner (tufId 33)
- `https://leetcode.com/problems/split-array-largest-sum/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/split-array-largest-sum/` · curl exit 0 · used by: Split array - largest sum (tufId 79)
- `https://leetcode.com/problems/subarray-sum-equals-k/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/subarray-sum-equals-k/` · curl exit 0 · used by: Count subarrays with given sum (tufId 561)
- `https://leetcode.com/problems/subarrays-with-k-different-integers/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/subarrays-with-k-different-integers/` · curl exit 0 · used by: Subarrays with K Different Integers (tufId 988)
- `https://leetcode.com/problems/subsets-ii/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/subsets-ii/` · curl exit 0 · used by: Subsets II (tufId 868)
- `https://leetcode.com/problems/subsets/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/subsets/` · curl exit 0 · used by: Power Set Bit Manipulation (tufId 142)
- `https://leetcode.com/problems/sudoku-solver/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/sudoku-solver/` · curl exit 0 · used by: Sudoku Solver (tufId 873)
- `https://leetcode.com/problems/sum-of-subarray-minimums/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/sum-of-subarray-minimums/` · curl exit 0 · used by: Sum of Subarray Minimums (tufId 971)
- `https://leetcode.com/problems/sum-of-subarray-ranges/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/sum-of-subarray-ranges/` · curl exit 0 · used by: Sum of Subarray Ranges (tufId 972)
- `https://leetcode.com/problems/surrounded-regions/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/surrounded-regions/` · curl exit 0 · used by: Surrounded Regions (tufId 537)
- `https://leetcode.com/problems/symmetric-tree/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/symmetric-tree/` · curl exit 0 · used by: Check for symmetrical BTs (tufId 128)
- `https://leetcode.com/problems/target-sum/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/target-sum/` · curl exit 0 · used by: Target sum (tufId 324)
- `https://leetcode.com/problems/trapping-rain-water/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/trapping-rain-water/` · curl exit 0 · used by: Trapping Rainwater (tufId 965)
- `https://leetcode.com/problems/triangle/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/triangle/` · curl exit 0 · used by: Triangle (tufId 299)
- `https://leetcode.com/problems/two-sum-iv-input-is-a-bst/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/two-sum-iv-input-is-a-bst/` · curl exit 0 · used by: Two sum in BST (tufId 99)
- `https://leetcode.com/problems/two-sum/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/two-sum/` · curl exit 0 · used by: Two Sum (tufId 37)
- `https://leetcode.com/problems/unique-paths-ii/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/unique-paths-ii/` · curl exit 0 · used by: Unique paths II (tufId 300)
- `https://leetcode.com/problems/unique-paths/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/unique-paths/` · curl exit 0 · used by: Grid unique paths (tufId 297)
- `https://leetcode.com/problems/valid-anagram/#:~:text=Given%20two%20strings%20s%20and,the%20original%20letters%20exactly%20once.&text=Constraints%3A,.length%20%3C%3D%205%20*%2010`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/valid-anagram/#:~:text=Given%20two%20strings%20s%20and,the%20original%20letters%20exactly%20once.&text=Constraints%3A,.length%20%3C%3D%205%20*%2010` · curl exit 0 · used by: Valid Anagram (tufId 400)
- `https://leetcode.com/problems/valid-palindrome/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/valid-palindrome/` · curl exit 0 · used by: Check if String is Palindrome or Not (tufId 378)
- `https://leetcode.com/problems/valid-parentheses/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/valid-parentheses/` · curl exit 0 · used by: Balanced Paranthesis (tufId 966)
- `https://leetcode.com/problems/valid-parenthesis-string/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/valid-parenthesis-string/` · curl exit 0 · used by: Valid Paranthesis Checker (tufId 545)
- `https://leetcode.com/problems/validate-binary-search-tree/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/validate-binary-search-tree/` · curl exit 0 · used by: Check if a tree is a BST or not (tufId 100)
- `https://leetcode.com/problems/vertical-order-traversal-of-a-binary-tree/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/vertical-order-traversal-of-a-binary-tree/` · curl exit 0 · used by: Vertical Order Traversal (tufId 125)
- `https://leetcode.com/problems/wildcard-matching/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/wildcard-matching/` · curl exit 0 · used by: Wildcard matching (tufId 314)
- `https://leetcode.com/problems/word-ladder-ii/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/word-ladder-ii/` · curl exit 0 · used by: Word ladder II (tufId 510)
- `https://leetcode.com/problems/word-ladder/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/word-ladder/` · curl exit 0 · used by: Word ladder I (tufId 509)
- `https://leetcode.com/problems/word-search/`  
  kind **leetcode** · finalUrl `https://leetcode.com/problems/word-search/` · curl exit 0 · used by: Word Search (tufId 874)

### status `404`: 2 URL(s)

Serial re-probe (one request at a time) on all 2: `404` ×2.

- `https://takeuforward.org/practice/dsa/contest`  
  kind **tuf** · finalUrl `https://takeuforward.org/practice/dsa/contest` · curl exit 0 · used by: Contest (tufId 275); Contest (tufId 328); Contest (tufId 338); Contest (tufId 333)
- `https://takeuforward.org/practice/dsa/dp-contest-2`  
  kind **tuf** · finalUrl `https://takeuforward.org/practice/dsa/dp-contest-2` · curl exit 0 · used by: Contest (tufId 348)

### The 2 `404`s are real dead links: `base_items.json` needs a patch

Genuine 404s, not soft-404s: a deliberately bogus practice slug on the same host also returns HTTP 404 with `Page Not Found`, so takeuforward's status code is trustworthy. Each of these was probed three times in total (once in the sweep, twice serially) and returned 404 every time:

| dead URL | sheet row(s) | sheet row title | status |
|---|---|---|---|
| `https://takeuforward.org/practice/dsa/contest` | 275, 328, 338, 333 | Contest | 404 |
| `https://takeuforward.org/practice/dsa/dp-contest-2` | 348 | Contest | 404 |

These 5 rows (`layout: null`, all titled `Contest`) lost their URLs in the 20:23 revision of `base_items.json`: the 20:19 revision had `/practice/dsa/contest/{275,333,338,348}?category=…`, which all returned **200**. The authoritative hrefs are still in the source scrape `data/raw/tuf_sheet.html` (node `id` → `href`), and one of them (`contest/328`) was wrong in the 20:19 revision too (`…/minimum-cost-to-cut-the-stick?category=mcm-dp`, a 200 page but the wrong one). Verified replacements, all probed **200** (one request at a time):

| sheet tufId | recommended `tufUrl` | status |
|---|---|---|
| 275 | `https://takeuforward.org/practice/dsa/contest/275?category=arrays&source=strivers-a2z-dsa-sheet` | 200 |
| 328 | `https://takeuforward.org/practice/dsa/contest/328?category=binary-search&source=strivers-a2z-dsa-sheet` | 200 |
| 333 | `https://takeuforward.org/practice/dsa/contest/333?category=binary-search-trees&source=strivers-a2z-dsa-sheet` | 200 |
| 338 | `https://takeuforward.org/practice/dsa/contest/338?category=binary-trees&source=strivers-a2z-dsa-sheet` | 200 |
| 348 | `https://takeuforward.org/practice/dsa/contest/348?category=dynamic-programming&source=strivers-a2z-dsa-sheet` | 200 |

Side note for whoever owns the parser: the sheet's own counter says `contestCount: 16` (`data/raw/tuf_sheet.html`) and the scrape contains 16 `/practice/dsa/contest/<id>` hrefs, but `base_items.json` carries only 5 contest rows: the other 11 contests never made it into the item list.

## Redirects followed (all 200)

238 of 1124 URLs answered 200 from a different URL than requested:

| requested host | final host | count |
|---|---|---:|
| youtu.be | www.youtube.com | 238 |

All 238 are `youtu.be/<id>` → `https://www.youtube.com/watch?si=<token>&v=<id>&feature=youtu.be` (HTTP 200), YouTube's normal short-link behaviour; per-URL `finalUrl` is in `link_health.json`. No `tufUrl`, `articleUrl` or `www.youtube.com` video URL redirected; for `leetcodeUrl` a redirect cannot be observed with curl at all (see below).

## LeetCode: the 403s are a bot wall, not dead links

All 222 `leetcode.com` URLs returned **403 to curl**, identically: at concurrency 12, serially, and with a full browser header set added (`Accept`, `Accept-Language`, `Sec-Fetch-*`, `sec-ch-ua*`, `Upgrade-Insecure-Requests`, `--compressed`), sampled URLs still 403 (`https://leetcode.com/accounts/login/?next=/problems/find-the-celebrity/`, `https://leetcode.com/problems/01-matrix/`, `https://leetcode.com/problems/3sum/` …). curl's TLS fingerprint is what Cloudflare rejects, so for these URLs HTTP status from curl carries no information; the dataset records the observation, not a verdict. Three independent checks show the pages are alive:

1. **Real browser (headless Chromium).** `https://leetcode.com/problems/3sum/` → `…/3sum/description/`, title `3Sum - LeetCode`, problem statement rendered. Same for the spot-checks in the tables below.
2. **GraphQL existence sweep**: batched `POST https://leetcode.com/graphql` with `query($t:String!){question(titleSlug:$t){title difficulty isPaidOnly}}`, 12 slugs per request (HTTP 200, no auth). **219 of the 221 distinct slugs in the sheet resolve to a live problem**; the two that return `null` are `coin-change-2` and `implement-strstr`, the known renames.
3. **Published problem list**: `GET https://leetcode.com/api/problems/all/` (HTTP 200, 4059 problems). 219 of the 221 `/problems/` URLs here contain a slug present in that list; the misses are `coin-change-2`, `implement-strstr`: the two known renames (the login-wall URL has no slug and is not part of this count). Cross-check of the 220 slugs in Main's own GraphQL dump `data/raw/leetcode.json`: **220/220 titles and 220/220 `isPaidOnly` flags match the live list** (0 title and 0 paid-flag mismatches).

### URLs that need a patch in `base_items.json`

| sheet URL | sheet row | slug live now? | canonical slug | GraphQL | browser |
|---|---|---|---|---|---|
| `https://leetcode.com/problems/coin-change-2/` | Coin change II (tufId 316) | no, renamed | `coin-change-ii` | `Coin Change II` / Medium | `/problems/coin-change-2/` → `/problems/coin-change-ii/description/`, `Coin Change II - LeetCode` |
| `https://leetcode.com/problems/implement-strstr/` | KMP Algorithm or LPS array (tufId 977) | no, renamed | `find-the-index-of-the-first-occurrence-in-a-string` | `Find the Index of the First Occurrence in a String` / Easy | `/problems/implement-strstr/` → `…/find-the-index-of-the-first-occurrence-in-a-string/description/` (LeetCode #28) |
| `https://leetcode.com/accounts/login/?next=/problems/find-the-celebrity/` | Celebrity Problem (tufId 957) | n/a, a login-wall URL rather than a problem page | `find-the-celebrity` | `Find the Celebrity` / Medium / paid-only | `/problems/find-the-celebrity/` loads (`Find the Celebrity - LeetCode`) but body says `Subscribe to unlock` |

Recommended replacements (all resolve in GraphQL, all load in a browser): `https://leetcode.com/problems/coin-change-ii/`, `https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string/`, `https://leetcode.com/problems/find-the-celebrity/`.

### Non-canonical URL shapes that nonetheless work (no patch needed, browser-checked)

| sheet URL | browser outcome |
|---|---|
| `…/problems/critical-connections-in-a-network/discuss/382385/find-bridges-in-a-graph` | → `…/solutions/382385/find-bridges-in-a-graph/`, title `Critical Connections in a Network - LeetCode` |
| `…/problems/maximum-number-of-non-overlapping-substrings/discuss/766485/kosaraju-algorithm-on` | → `…/solutions/766485/kosaraju-algorithm-on/` |
| `…/problems/repeated-string-match/discuss/416144/Rabin-Karp-algorithm-C%2B%2B-implementation` | → `…/solutions/416144/Rabin-Karp-algorithm-C++-implementation/` |
| `…/problems/alien-dictionary/solution/` | → `…/editorial/` (problem is premium) |

Shape census of the 222 `leetcodeUrl` values: 204 plain `/problems/<slug>/`, 9 with a `#:~:text=` highlight fragment, 3 `/description/`, 3 `/discuss/<id>/<slug>`, 2 `/solution/`, 1 login-wall. Fragments are client-side only, so they cannot break a link.

### Premium (paid-only) problems linked from the sheet

8 of the 222 LeetCode links point at paid-only problems and show a subscribe/login wall to logged-out visitors: `alien-dictionary`, `armstrong-number`, `boundary-of-binary-tree`, `find-the-celebrity`, `inorder-successor-in-bst`, `longest-substring-with-at-most-k-distinct-characters`, `minimize-max-distance-to-gas-station`, `number-of-islands-ii` (ascertained from LeetCode's own `isPaidOnly` flag / GraphQL `isPaidOnly`). A badge would be honest; the links are valid.

## Revision churn during this run (context, not an error)

`base_items.json` was rewritten at 20:23, mid-sweep: 18 `tufUrl` values changed. 14 of those changes are fixes (rows that wrongly pointed at `/practice/dsa/contest/<id>` now point at their real practice page, and the new URLs are all 200); the other 5 rows are the contest rows, which now point at the two dead URLs above. The 18 pre-change URLs are absent from `link_health.json` because they are no longer in the file; all 18 returned **200** when probed. Verify against sha256 `43bb387d231b78197bfbc7e1090ca45036ad04c7027f10ac9fa90df6ce9a5786` before trusting this report.

## Cross-check against a sibling agent's artifact

`data/raw/verify_links.json` (written by another agent at 20:25) covers 402 takeuforward practice URLs with status `[200]`, a fetched `pageTitle` and a title-`overlap` score. Its key set (402 of 402 keys) is a strict subset of the 442 `tufUrl`s here, and **0 URLs disagree with this report** (which is status-only). It is the stronger artifact for those 402 rows, since a 200 with a mismatched `pageTitle` would catch a wrong-page link that a status code cannot.

## Reproduction

```bash
# 1. collect + dedupe from the pinned snapshot -> urlmap (1124 unique URLs)
jq -r '[.[] | {title,tufId, urls:[{u:.tufUrl,k:"tuf"},{u:.leetcodeUrl,k:"leetcode"},
  {u:.articleUrl,k:"article"},{u:.videoUrl,k:"video"}]}]
  | [.[] as $i | $i.urls[] | select(.u!=null and .u!="") | {u:.u,k:.k,title:$i.title,tufId:$i.tufId}]
  | group_by(.u) | map({url:.[0].u,kinds:([.[].k]|unique),uses:[.[]|{title,tufId,k}]})
  | sort_by(.url)' data/raw/base_items.json > /tmp/urlmap.json
# 2. probe: 12 workers, the curl command above, retry only on curl-level failure
# 3. serial re-probe of every non-200 URL; GraphQL sweep; browser spot-checks
```
