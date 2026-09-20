# GeeksforGeeks matching report

- problems without a LeetCode link: **170**
- candidate URLs tested: 422
- matched and independently verified: **88** (52% of targets)
- rejected by reason: {'different-problem-page': 278, 'title-mismatch': 40, 'url-claimed-by-another-problem': 5}

Acceptance rule - all of it must hold:

1. HTTP 200.
2. The page's own embedded `"slug"` identifies the same problem: equal truncated to 30
   chars, or one a prefix of the other (GeeksforGeeks appends legacy ids, e.g.
   `gcd-of-two-numbers` -> `gcd-of-two-numbers3459`), or the same stable numeric id after a
   rename (`n-meetings-in-one-room-1587115620` is now `activity-selection-1587115620`).
3. At least 50% of the sheet title's significant tokens appear in the page title, AND the
   sheet problem must be the *best* match for that page anywhere in the sheet
   (`scripts/titlematch.py`) - so GeeksforGeeks' "Union of Two Sorted Arrays" cannot be
   attached to the sheet's "Intersection of two sorted arrays".
4. One GeeksforGeeks page may back only one sheet problem; on a collision the strongest
   title match keeps it and the other falls back to its takeuforward page.

## Renamed or redirected pages that were rejected (2)

The requested slug redirects to a different GeeksforGeeks problem, so the link is not shipped.

- Shortest path in DAG: asked `shortest-path-in-undirected-graph`, served `shortest-path-in-directed-acyclic-graph`
- Shortest path in undirected graph with unit weights: asked `shortest-path-in-undirected-graph`, served `shortest-path-in-directed-acyclic-graph`

## Candidates rejected on the title rule (45)

Each line: the sheet problem, the page title it was offered, and why it was refused.

- Factorial of a given number: page 'Factorial | Practice | GeeksforGeeks' - containment 0.33 < 0.5
- Factorial of a Given Number: page 'Factorial | Practice | GeeksforGeeks' - containment 0.33 < 0.5
- Check if a Number is Prime or Not: page 'Prime Number | Practice | GeeksforGeeks' - page matches 'Check for Prime Number' better on both measures (containment 0.67 vs 0.50, jaccard 0.67 vs 0.50)
- Linear Search: page 'Array Search | Practice | GeeksforGeeks' - page matches 'Search X in sorted array' better on both measures (containment 0.67 vs 0.50, jaccard 0.67 vs 0.33)
- Largest Element: page 'Largest in Array | Practice | GeeksforGeeks' - page matches 'K-th Largest element in an array' better on both measures (containment 0.67 vs 0.50, jaccard 0.67 vs 0.33)
- Find missing number: page 'Missing in Array | Practice | GeeksforGeeks' - containment 0.33 < 0.5
- Floor and Ceil in Sorted Array: page 'Floor and Ceil in Unsorted | Practice | GeeksforGeeks' - page matches 'Floor and Ceil in a BST' better on both measures (containment 0.67 vs 0.50, jaccard 0.50 vs 0.40)
- Find out how many times the array is rotated: page 'Find Kth Rotation | Practice | GeeksforGeeks' - containment 0.14 < 0.5
- Book Allocation Problem: page 'Allocate Minimum Pages | Practice | GeeksforGeeks' - containment 0.00 < 0.5
- Kth element of 2 sorted arrays: page 'K-th of Two Sorted Arrays | Practice | GeeksforGeeks' - page matches 'Union of two sorted arrays' better on both measures (containment 0.75 vs 0.50, jaccard 0.75 vs 0.40)
- Find row with maximum 1's: page 'Row with Max 1s in Rowwise Sorted | Practice | GeeksforGeeks' - containment 0.33 < 0.5
- Power Set: page 'Subsets | Practice | GeeksforGeeks' - containment 0.00 < 0.5
- Power Set: page 'All Subsequences of String | Practice | GeeksforGeeks' - containment 0.00 < 0.5
- Check if there exists a subsequence with sum K: page 'Subsequence with Sum K | Practice | GeeksforGeeks' - containment 0.40 < 0.5
- Check if there exists a subsequence with sum K: page 'Count Subsets with Sum | Practice | GeeksforGeeks' - containment 0.20 < 0.5
- Insertion at the Kth position of Linked List: page 'Insert in a Singly Linked List | Practice | GeeksforGeeks' - containment 0.40 < 0.5
- Delete Kth Element of Doubly Linked List: page 'Delete in a Doubly Linked List | Practice | GeeksforGeeks' - page matches 'Delete Tail of Doubly Linked List' better on both measures (containment 0.80 vs 0.67, jaccard 0.80 vs 0.67)
- Insert node before head in Doubly Linked List: page 'Insertion in a Doubly Linked List | Practice | GeeksforGeeks' - containment 0.43 < 0.5
- Insert node before tail in Doubly Linked List: page 'Insertion in a Doubly Linked List | Practice | GeeksforGeeks' - containment 0.43 < 0.5
- Insert node before (kth node) in Doubly Linked List: page 'Insertion in a Doubly Linked List | Practice | GeeksforGeeks' - containment 0.43 < 0.5
- Insert before given node in Doubly Linked List: page 'Insertion in a Doubly Linked List | Practice | GeeksforGeeks' - containment 0.43 < 0.5
- Add one to a number represented by LL: page 'Add 1 to a Linked List Number | Practice | GeeksforGeeks' - page matches 'Add two numbers in Linked List' better on both measures (containment 0.80 vs 0.50, jaccard 0.80 vs 0.33)
- Length of loop in LL: page 'Cycle Length in Linked List | Practice | GeeksforGeeks' - page matches 'Traversal in Linked List' better on both measures (containment 0.67 vs 0.50, jaccard 0.40 vs 0.20)
- Single Number - II: page 'Unique Number III | Practice | GeeksforGeeks' - page matches 'Single Number - III' better on both measures (containment 0.67 vs 0.50, jaccard 0.50 vs 0.25)
- Single Number - III: page 'Unique Number II | Practice | GeeksforGeeks' - containment 0.33 < 0.5
- N meetings in one room: page 'Activity Selection | Practice | GeeksforGeeks' - containment 0.00 < 0.5
- Minimum number of platforms required for a railway: page 'Minimum Platforms | Practice | GeeksforGeeks' - containment 0.40 < 0.5
- Implement stack using Linkedlist: page 'Stack using Linked List | Practice | GeeksforGeeks' - containment 0.33 < 0.5
- Implement queue using Linkedlist: page 'Queue using Linked List | Practice | GeeksforGeeks' - containment 0.33 < 0.5
- Minimum time taken to burn the BT from a given Node: page 'Burning Tree | Practice | GeeksforGeeks' - containment 0.14 < 0.5
- Heapify Algorithm: page 'Building Heap from Array | Practice | GeeksforGeeks' - containment 0.00 < 0.5
- K-th Largest element in an array: page 'Kth Largest | Practice | GeeksforGeeks' - containment 0.33 < 0.5
- Find the MST weight: page 'Minimum Spanning Tree | Practice | GeeksforGeeks' - containment 0.00 < 0.5
- Frog jump with K distances: page 'Frog Jump | Practice | GeeksforGeeks' - page matches 'Frog Jump' better on both measures (containment 1.00 vs 0.67, jaccard 1.00 vs 0.67)
- Frog jump with K distances: page 'Minimal Cost of Jumps | Practice | GeeksforGeeks' - containment 0.33 < 0.5
- Unbounded knapsack: page 'Knapsack with Duplicate Items | Practice | GeeksforGeeks' - page matches '0 and 1 Knapsack' better on both measures (containment 1.00 vs 0.50, jaccard 0.33 vs 0.25)
- Print Longest Increasing Subsequence: page 'Get Longest Increasing Subsequence | Practice | GeeksforGeeks' - page matches 'Longest Increasing Subsequence' better on both measures (containment 1.00 vs 0.75, jaccard 0.75 vs 0.60)
- Trie Implementation and Advanced Operations: page 'Implement Trie | Practice | GeeksforGeeks' - containment 0.25 < 0.5
- Print all primes till N: page 'Sieve of Eratosthenes | Practice | GeeksforGeeks' - containment 0.00 < 0.5
- Prime factorisation of a Number: page 'All Prime Factors in Sorted Order | Practice | GeeksforGeeks' - containment 0.33 < 0.5
- Sum of Array Elements II: page 'https://www.geeksforgeeks.org/problems/sum-all-array-elements/1' - same page already matched 'Sum of Array Elements'
- Reverse an array 2: page 'https://www.geeksforgeeks.org/problems/reverse-an-array/1' - same page already matched 'Reverse an array'
- Reverse a String I: page 'https://www.geeksforgeeks.org/problems/reverse-a-string/1' - same page already matched 'Reverse a String II'
- Count all subsequences with sum K: page 'https://www.geeksforgeeks.org/problems/perfect-sum-problem5633/1' - same page already matched 'Count subsets with sum K'
- Shortest path in undirected graph with unit weights: page 'https://www.geeksforgeeks.org/problems/shortest-path-in-undirected-graph-having-unit-distance/1' - same page already matched 'Print Shortest Path'

## Not matched (82)

These keep the takeuforward practice page as their primary link.

- Add one to a number represented by LL
- Book Allocation Problem
- Check if a Number is Prime or Not
- Check if an array represents a min heap
- Check if there exists a subsequence with sum K
- Convert Min Heap to Max Heap
- Count all subsequences with sum K
- Count number of odd digits in a number
- Count of Prime Numbers till N
- Count of odd numbers in Array
- Delete Kth Element of Doubly Linked List
- Delete Tail of Doubly Linked List
- Delete the element with value X
- Deletion of the Kth element of Linked List
- Factorial of a Given Number
- Factorial of a given number
- Find missing number
- Find out how many times the array is rotated
- Find row with maximum 1's
- Find the MST weight
- Floor and Ceil in Sorted Array
- Floor and Ceil in a BST
- Frog jump with K distances
- Heapify Algorithm
- Implement queue using Linkedlist
- Implement stack using Linkedlist
- Insert before given node in Doubly Linked List
- Insert node before (kth node) in Doubly Linked List
- Insert node before head in Doubly Linked List
- Insert node before tail in Doubly Linked List
- Insertion at the Kth position of Linked List
- Insertion at the head of Linked List
- Insertion before the value X in Linked List
- K-th Largest element in an array
- Kth element of 2 sorted arrays
- Largest Element
- Length of loop in LL
- Minimum number of platforms required for a railway
- Minimum time taken to burn the BT from a given Node
- Pascal's Triangle III
- Pattern 1
- Pattern 10
- Pattern 11
- Pattern 12
- Pattern 13
- Pattern 14
- Pattern 15
- Pattern 16
- Pattern 17
- Pattern 18
- Pattern 19
- Pattern 2
- Pattern 20
- Pattern 21
- Pattern 22
- Pattern 3
- Pattern 4
- Pattern 5
- Pattern 6
- Pattern 7
- Pattern 8
- Pattern 9
- Power Set
- Pre, Post, Inorder in one traversal
- Prime factorisation of a Number
- Print Longest Increasing Subsequence
- Print all primes till N
- Removing given node in Doubly Linked List
- Requirements needed to construct a unique BT
- Return the Largest Digit in a Number
- Reverse a String I
- Reverse an array 2
- Second Highest Occurring Element
- Shortest path in undirected graph with unit weights
- Single Number - II
- Single Number - III
- Sum of Array Elements II
- Sum of Highest and Lowest Frequency
- Traversal Techniques
- Trie Implementation and Advanced Operations
- Unbounded knapsack
- Z function

## Matched

| sheet problem | GeeksforGeeks page | difficulty |
| --- | --- | --- |
| Count all Digits of a Number | `count-total-digits-in-a-number` | Easy |
| Check for Perfect Number | `perfect-numbers3207` | Easy |
| Check for Prime Number | `prime-number2314` | Easy |
| GCD of Two Numbers | `gcd-of-two-numbers3459` | 0.67 |
| LCM of two numbers | `lcm-of-two-numbers` | Easy |
| Divisors of a Number | `all-divisors-of-a-number` | Easy |
| Sum of Array Elements | `sum-all-array-elements` | 0.67 |
| Check if the Array is Sorted I | `check-if-an-array-is-sorted0701` | Easy |
| Reverse an array | `reverse-an-array` | Easy |
| Reverse a String II | `reverse-a-string` | 1.0 |
| Palindrome Check | `check-palindrome--141628` | 1.0 |
| Sum of First N Numbers | `recursively-sum-n-numbers` | Easy |
| Sum of Digits in a Given Number | `sum-of-digits1742` | Easy |
| Selection Sort | `selection-sort` | Easy |
| Bubble Sort | `bubble-sort` | Easy |
| Insertion Sorting | `insertion-sort` | Easy |
| Merge Sorting | `merge-sort` | Medium |
| Quick Sorting | `quick-sort` | Medium |
| Linear Search | `who-will-win-1587115621` | 0.5 |
| Second Largest Element | `second-largest3735` | Easy |
| Union of two sorted arrays | `union-of-two-sorted-arrays-1587115621` | Medium |
| Intersection of two sorted arrays | `intersection-of-two-sorted-array-1587115620` | Easy |
| Leaders in an Array | `leaders-in-an-array-1587115620` | Easy |
| Pascal's Triangle II | `pascal-triangle0652` | Medium |
| Kadane's Algorithm | `kadanes-algorithm-1587115620` | Medium |
| Find the repeating and missing number | `find-missing-and-repeating2512` | Easy |
| Count Inversions | `inversion-of-array-1587115620` | Medium |
| Longest subarray with sum K | `longest-sub-array-with-sum-k0809` | Medium |
| Largest Subarray with Sum 0 | `largest-subarray-with-0-sum` | Medium |
| Count subarrays with given xor K | `count-subarray-with-given-xor` | Medium |
| Lower Bound | `implement-lower-bound` | Easy |
| Upper Bound | `implement-upper-bound` | Easy |
| Find square root of a number | `square-root` | Easy |
| Find Nth root of a number | `find-nth-root-of-m5843` | Medium |
| Painter's Partition | `the-painters-partition-problem1535` | Hard |
| Aggressive Cows | `aggressive-cows` | Medium |
| Matrix Median | `median-in-a-row-wise-sorted-matrix1527` | Medium |
| Subsets I | `subset-sums2234` | Medium |
| Rat in a Maze | `rat-in-a-maze-problem` | Medium |
| M Coloring Problem | `m-coloring-problem-1587115620` | Medium |
| Traversal in Linked List | `linkedlist-traversal` | 1.0 |
| Deletion of the tail of Linked List | `deletion-at-the-end-of-a-linked-list` | Easy |
| Insertion at the tail of Linked List | `linked-list-insertion-1587115620` | 0.75 |
| Convert Array to Doubly Linked List | `create-a-doubly-linked-list-from-a-given-array` | Easy |
| Sort a Linked List of 0's 1's and 2's | `given-a-linked-list-of-0s-1s-and-2s-sort-it` | Medium |
| Flattening of LL | `flattening-a-linked-list` | Medium |
| Delete all occurrences of a key in DLL | `delete-all-occurrences-of-a-given-key-in-a-doubly-linked-list` | Medium |
| Remove duplicates from sorted DLL | `remove-duplicates-from-a-sorted-doubly-linked-list` | Easy |
| Find Pairs with Given Sum in Doubly Linked List | `find-pairs-with-given-sum-in-doubly-linked-list` | Easy |
| XOR of numbers in a given range | `find-xor-of-numbers-from-l-to-r` | Easy |
| Fractional Knapsack | `fractional-knapsack-1587115620` | Easy |
| Shortest Job First | `shortest-job-first` | Medium |
| Job sequencing Problem | `job-sequencing-problem-1587115620` | Medium |
| N meetings in one room | `maximum-meetings-in-one-room` | Medium |
| Implement Stack using Arrays | `implement-stack-using-array` | 1.0 |
| Implement Queue using Arrays | `implement-queue-using-array` | 0.67 |
| Children Sum Property in Binary Tree | `children-sum-parent` | Medium |
| Top View of BT | `top-view-of-binary-tree` | Medium |
| Bottom view of BT | `bottom-view-of-binary-tree` | Medium |
| Print root to leaf path in BT | `root-to-leaf-paths` | Medium |
| Build heap from a given Array | `heapify-the-vector--102013` | Easy |
| Implement Min Heap | `min-heap-implementation` | Easy |
| Implement Max Heap | `max-heap-implementation` | Easy |
| Heap Sort | `heap-sort` | Medium |
| Connected Components | `number-of-provinces` | Medium |
| Number of distinct islands | `number-of-distinct-islands` | Medium |
| Topological sort or Kahn's algorithm | `topological-sort` | Medium |
| Shortest path in DAG | `shortest-path-in-directed-acyclic-graph` | Medium |
| Dijkstra's algorithm | `implementing-dijkstra-set-1-adjacency-matrix` | Medium |
| Print Shortest Path | `shortest-path-in-undirected-graph-having-unit-distance` | Medium |
| Minimum multiplications to reach end | `minimum-multiplications-to-reach-end` | Medium |
| Bellman ford algorithm | `distance-from-the-source-bellman-ford-algorithm` | Medium |
| Floyd warshall algorithm | `implementing-floyd-warshall2042` | Medium |
| Disjoint Set | `disjoint-set-union-find` | Medium |
| Articulation point in graph | `articulation-point2616` | Hard |
| Frog Jump | `geek-jump` | Medium |
| Ninja's training | `geeks-training` | Medium |
| Cherry pickup II | `chocolate-pickup-ii` | Hard |
| Subset sum equals to target | `subset-sum-problem-1611555638` | Medium |
| Count subsets with sum K | `perfect-sum-problem5633` | Medium |
| Count partitions with given difference | `partitions-with-given-difference` | Medium |
| 0 and 1 Knapsack | `0-1-knapsack-problem0945` | Medium |
| Rod cutting problem | `rod-cutting0840` | Medium |
| Longest Bitonic Subsequence | `longest-bitonic-subsequence0824` | Medium |
| Longest common substring | `longest-common-substring1452` | Medium |
| Matrix chain multiplication | `matrix-chain-multiplication0303` | Hard |
| Longest Word with All Prefixes | `longest-valid-word-with-all-prefixes` | Medium |
| Number of distinct substrings in a string | `count-of-distinct-substrings` | Medium |
