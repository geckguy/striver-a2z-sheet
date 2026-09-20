/* ==========================================================================
   Striver's A2Z DSA sheet: progress tracker
   Loads ./data.json (falls back to ./sample-data.json, then to an embedded
   copy when the page is opened from file://). All progress lives in
   localStorage; nothing is sent anywhere.
   ========================================================================== */
(function () {
  'use strict';

  /* ---------------------------------------------------------------- config */

  var KEY_SOLVED = 'a2z.solved';
  var KEY_STARRED = 'a2z.starred';
  var KEY_THEME = 'a2z.theme';
  var SHEET_URL = 'https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/';

  var PLATFORM_LABEL = {
    leetcode: 'LeetCode',
    gfg: 'GeeksforGeeks',
    takeuforward: 'takeUForward',
    other: 'the platform site'
  };
  var DIFFICULTIES = ['Easy', 'Medium', 'Hard'];
  /* Striver's own grouping for the sheet. Not a platform difficulty: 75 of the
     402 problems carry no Easy/Medium/Hard label at all. */
  var TIERS = ['basic', 'core', 'pro'];
  var TIER_LABEL = { basic: 'Basic', core: 'Core', pro: 'Pro' };

  /* Mirrors site/sample-data.json. A file:// page has an opaque origin, so
     browsers refuse to read sibling files there (fetch and XHR both fail);
     the demo subset ships as a literal too. Keep it in sync with
     sample-data.json. */
  var SAMPLE_MIRROR = {"meta":{"title":"Striver's A2Z DSA Sheet","source":"https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/","generated":"2026-09-20","problemCount":26,"stepCount":4,"steps":[{"n":1,"title":"Beginner Problems","count":8},{"n":2,"title":"Sorting","count":5},{"n":3,"title":"Arrays","count":7},{"n":5,"title":"Binary Search","count":6}],"note":"Sample subset of the real sheet: 26 problems copied verbatim from data.json, used only when data.json cannot be loaded."},"problems":[{"id":"a2z-0001","order":1,"title":"Count all Digits of a Number","step":1,"stepTitle":"Beginner Problems","topic":"Basic Maths","tier":"basic","difficulty":"Easy","difficultySource":"gfg","platform":"gfg","url":"https://www.geeksforgeeks.org/problems/count-total-digits-in-a-number/1","altUrls":[{"platform":"takeuforward","url":"https://takeuforward.org/practice/dsa/count-all-digits-of-a-number?category=basic-maths&source=strivers-a2z-dsa-sheet"}],"article":"https://takeuforward.org/blogs/data-structure-and-algorithm/count-digits-in-a-number","video":"https://youtu.be/1xNbjMdbjug","premium":false,"duration":"8 min","slug":"count-all-digits-of-a-number","lcSlug":""},{"id":"a2z-0002","order":2,"title":"Reverse a number","step":1,"stepTitle":"Beginner Problems","topic":"Basic Maths","tier":"basic","difficulty":"Medium","difficultySource":"leetcode","platform":"leetcode","url":"https://leetcode.com/problems/reverse-integer/","altUrls":[{"platform":"takeuforward","url":"https://takeuforward.org/practice/dsa/reverse-a-number?category=basic-maths&source=strivers-a2z-dsa-sheet"}],"article":"https://takeuforward.org/blogs/data-structure-and-algorithm/reverse-digits-of-a-number","video":"https://youtu.be/1xNbjMdbjug?t=930","premium":false,"duration":"7 min","slug":"reverse-a-number","lcSlug":"reverse-integer"},{"id":"a2z-0003","order":3,"title":"Palindrome Number","step":1,"stepTitle":"Beginner Problems","topic":"Basic Maths","tier":"basic","difficulty":"Easy","difficultySource":"leetcode","platform":"leetcode","url":"https://leetcode.com/problems/palindrome-number/","altUrls":[{"platform":"takeuforward","url":"https://takeuforward.org/practice/dsa/palindrome-number?category=basic-maths&source=strivers-a2z-dsa-sheet"}],"article":"https://takeuforward.org/blogs/data-structure-and-algorithm/check-whether-a-number-is-a-palindrome","video":"https://youtu.be/1xNbjMdbjug?t=1230","premium":false,"duration":"4 min","slug":"palindrome-number","lcSlug":"palindrome-number"},{"id":"a2z-0004","order":4,"title":"Check if the Number is Armstrong","step":1,"stepTitle":"Beginner Problems","topic":"Basic Maths","tier":"basic","difficulty":"Easy","difficultySource":"leetcode","platform":"leetcode","url":"https://leetcode.com/problems/armstrong-number/","altUrls":[{"platform":"takeuforward","url":"https://takeuforward.org/practice/dsa/check-if-the-number-if-armstrong?category=basic-maths&source=strivers-a2z-dsa-sheet"}],"article":"https://takeuforward.org/blogs/data-structure-and-algorithm/armstrong-number","video":"https://youtu.be/1xNbjMdbjug?t=1418","premium":true,"duration":"7 min","slug":"check-if-the-number-if-armstrong","lcSlug":"armstrong-number"},{"id":"a2z-0005","order":5,"title":"GCD of Two Numbers","step":1,"stepTitle":"Beginner Problems","topic":"Basic Maths","tier":"basic","difficulty":"","difficultySource":"","platform":"gfg","url":"https://www.geeksforgeeks.org/problems/gcd-of-two-numbers3459/1","altUrls":[{"platform":"takeuforward","url":"https://takeuforward.org/practice/dsa/gcd-of-two-numbers?category=basic-maths&source=strivers-a2z-dsa-sheet"}],"article":"https://takeuforward.org/blogs/data-structure-and-algorithm/gcd-euclidean-algorithm","video":"https://youtu.be/1xNbjMdbjug?t=2684","premium":false,"duration":"13 min","slug":"gcd-of-two-numbers","lcSlug":""},{"id":"a2z-0006","order":6,"title":"Reverse an array","step":1,"stepTitle":"Beginner Problems","topic":"Basic Arrays","tier":"basic","difficulty":"Easy","difficultySource":"gfg","platform":"gfg","url":"https://www.geeksforgeeks.org/problems/reverse-an-array/1","altUrls":[{"platform":"takeuforward","url":"https://takeuforward.org/practice/dsa/reverse-an-array?category=basic-arrays&source=strivers-a2z-dsa-sheet"}],"article":null,"video":"https://www.youtube.com/watch?v=twuC1F6gLI8&list=PLgUwDviBIf0rGlzIn_7rsaR2FQ5e6ZOL9&index=4","premium":false,"duration":"14 min","slug":"reverse-an-array","lcSlug":""},{"id":"a2z-0007","order":7,"title":"Palindrome Check","step":1,"stepTitle":"Beginner Problems","topic":"Basic Strings","tier":"core","difficulty":"","difficultySource":"","platform":"gfg","url":"https://www.geeksforgeeks.org/problems/check-palindrome--141628/1","altUrls":[{"platform":"takeuforward","url":"https://takeuforward.org/practice/dsa/palindrome-check?category=basic-strings&source=strivers-a2z-dsa-sheet"}],"article":null,"video":null,"premium":false,"duration":"7 min","slug":"palindrome-check","lcSlug":""},{"id":"a2z-0008","order":8,"title":"Rotate String","step":1,"stepTitle":"Beginner Problems","topic":"Basic Strings","tier":"core","difficulty":"Easy","difficultySource":"leetcode","platform":"leetcode","url":"https://leetcode.com/problems/rotate-string/","altUrls":[{"platform":"takeuforward","url":"https://takeuforward.org/practice/dsa/rotate-string?category=basic-strings&source=strivers-a2z-dsa-sheet"}],"article":null,"video":null,"premium":false,"duration":"13 min","slug":"rotate-string","lcSlug":"rotate-string"},{"id":"a2z-0009","order":9,"title":"Selection Sort","step":2,"stepTitle":"Sorting","topic":"Algorithms","tier":"basic","difficulty":"Easy","difficultySource":"gfg","platform":"gfg","url":"https://www.geeksforgeeks.org/problems/selection-sort/1","altUrls":[{"platform":"takeuforward","url":"https://takeuforward.org/practice/dsa/selection-sort?category=algorithms&source=strivers-a2z-dsa-sheet"}],"article":"https://takeuforward.org/blogs/data-structure-and-algorithm/selection-sort-algorithm","video":"https://youtu.be/HGk_ypEuS24?t=167","premium":false,"duration":"15 min","slug":"selection-sort","lcSlug":""},{"id":"a2z-0010","order":10,"title":"Bubble Sort","step":2,"stepTitle":"Sorting","topic":"Algorithms","tier":"basic","difficulty":"Easy","difficultySource":"gfg","platform":"gfg","url":"https://www.geeksforgeeks.org/problems/bubble-sort/1","altUrls":[{"platform":"takeuforward","url":"https://takeuforward.org/practice/dsa/bubble-sort?category=algorithms&source=strivers-a2z-dsa-sheet"}],"article":"https://takeuforward.org/blogs/data-structure-and-algorithm/bubble-sort-algorithm","video":"https://youtu.be/HGk_ypEuS24?t=1061","premium":false,"duration":"14 min","slug":"bubble-sort","lcSlug":""},{"id":"a2z-0011","order":11,"title":"Insertion Sorting","step":2,"stepTitle":"Sorting","topic":"Algorithms","tier":"basic","difficulty":"Easy","difficultySource":"gfg","platform":"gfg","url":"https://www.geeksforgeeks.org/problems/insertion-sort/1","altUrls":[{"platform":"takeuforward","url":"https://takeuforward.org/practice/dsa/insertion-sorting?category=algorithms&source=strivers-a2z-dsa-sheet"}],"article":"https://takeuforward.org/blogs/data-structure-and-algorithm/insertion-sort-algorithm","video":"https://youtu.be/HGk_ypEuS24?t=1900","premium":false,"duration":"11 min","slug":"insertion-sorting","lcSlug":""},{"id":"a2z-0012","order":12,"title":"Merge Sorting","step":2,"stepTitle":"Sorting","topic":"Algorithms","tier":"core","difficulty":"Medium","difficultySource":"gfg","platform":"gfg","url":"https://www.geeksforgeeks.org/problems/merge-sort/1","altUrls":[{"platform":"takeuforward","url":"https://takeuforward.org/practice/dsa/merge-sorting?category=algorithms&source=strivers-a2z-dsa-sheet"}],"article":"https://takeuforward.org/blogs/data-structure-and-algorithm/merge-sort-algorithm","video":"https://youtu.be/ogjf7ORKfd8","premium":false,"duration":"47 min","slug":"merge-sorting","lcSlug":""},{"id":"a2z-0013","order":13,"title":"Quick Sorting","step":2,"stepTitle":"Sorting","topic":"Algorithms","tier":"core","difficulty":"Medium","difficultySource":"gfg","platform":"gfg","url":"https://www.geeksforgeeks.org/problems/quick-sort/1","altUrls":[{"platform":"takeuforward","url":"https://takeuforward.org/practice/dsa/quick-sorting?category=algorithms&source=strivers-a2z-dsa-sheet"}],"article":"https://takeuforward.org/blogs/data-structure-and-algorithm/quick-sort-algorithm","video":"https://youtu.be/WIrA4YexLRQ","premium":false,"duration":"33 min","slug":"quick-sorting","lcSlug":""},{"id":"a2z-0014","order":14,"title":"Largest Element","step":3,"stepTitle":"Arrays","topic":"Fundamentals","tier":"basic","difficulty":"","difficultySource":"","platform":"takeuforward","url":"https://takeuforward.org/practice/dsa/largest-element?category=fundamentals&source=strivers-a2z-dsa-sheet","altUrls":[],"article":"https://takeuforward.org/blogs/data-structure-and-algorithm/find-the-largest-element-in-an-array","video":"https://youtu.be/37E9ckMDdTk?t=526","premium":false,"duration":"5 min","slug":"largest-element","lcSlug":""},{"id":"a2z-0015","order":15,"title":"Move Zeros to End","step":3,"stepTitle":"Arrays","topic":"Logic Building","tier":"basic","difficulty":"Easy","difficultySource":"leetcode","platform":"leetcode","url":"https://leetcode.com/problems/move-zeroes/","altUrls":[{"platform":"takeuforward","url":"https://takeuforward.org/practice/dsa/move-zeros-to-end?category=logic-building&source=strivers-a2z-dsa-sheet"}],"article":"https://takeuforward.org/blogs/data-structure-and-algorithm/move-zeros-to-the-end-of-an-array","video":"https://youtu.be/wvcQg43_V8U?t=1633","premium":false,"duration":"13 min","slug":"move-zeros-to-end","lcSlug":"move-zeroes"},{"id":"a2z-0016","order":16,"title":"Union of two sorted arrays","step":3,"stepTitle":"Arrays","topic":"Logic Building","tier":"core","difficulty":"Medium","difficultySource":"gfg","platform":"gfg","url":"https://www.geeksforgeeks.org/problems/union-of-two-sorted-arrays-1587115621/1","altUrls":[{"platform":"takeuforward","url":"https://takeuforward.org/practice/dsa/union-of-two-sorted-arrays?category=logic-building&source=strivers-a2z-dsa-sheet"}],"article":"https://takeuforward.org/blogs/data-structure-and-algorithm/union-of-two-sorted-arrays","video":"https://youtu.be/wvcQg43_V8U?t=2584","premium":false,"duration":"16 min","slug":"union-of-two-sorted-arrays","lcSlug":""},{"id":"a2z-0017","order":17,"title":"Leaders in an Array","step":3,"stepTitle":"Arrays","topic":"FAQs(Medium)","tier":"basic","difficulty":"Easy","difficultySource":"gfg","platform":"gfg","url":"https://www.geeksforgeeks.org/problems/leaders-in-an-array-1587115620/1","altUrls":[{"platform":"takeuforward","url":"https://takeuforward.org/practice/dsa/leaders-in-an-array?category=faqs-medium&source=strivers-a2z-dsa-sheet"}],"article":"https://takeuforward.org/blogs/data-structure-and-algorithm/leaders-in-an-array","video":"https://youtu.be/cHrH9CQ8pmY","premium":false,"duration":"11 min","slug":"leaders-in-an-array","lcSlug":""},{"id":"a2z-0018","order":18,"title":"3 Sum","step":3,"stepTitle":"Arrays","topic":"FAQs(Medium)","tier":"core","difficulty":"Medium","difficultySource":"leetcode","platform":"leetcode","url":"https://leetcode.com/problems/3sum/","altUrls":[{"platform":"takeuforward","url":"https://takeuforward.org/practice/dsa/3-sum?category=faqs-medium&source=strivers-a2z-dsa-sheet"}],"article":"https://takeuforward.org/blogs/data-structure-and-algorithm/3sum","video":"https://youtu.be/DhFh8Kw7ymk","premium":false,"duration":"37 min","slug":"3-sum","lcSlug":"3sum"},{"id":"a2z-0019","order":19,"title":"Count Inversions","step":3,"stepTitle":"Arrays","topic":"FAQs(Hard)","tier":"core","difficulty":"Medium","difficultySource":"gfg","platform":"gfg","url":"https://www.geeksforgeeks.org/problems/inversion-of-array-1587115620/1","altUrls":[{"platform":"takeuforward","url":"https://takeuforward.org/practice/dsa/count-inversions?category=faqs-hard&source=strivers-a2z-dsa-sheet"}],"article":null,"video":"https://youtu.be/AseUmwVNaoY","premium":false,"duration":"23 min","slug":"count-inversions","lcSlug":""},{"id":"a2z-0020","order":20,"title":"Reverse Pairs","step":3,"stepTitle":"Arrays","topic":"FAQs(Hard)","tier":"pro","difficulty":"Hard","difficultySource":"leetcode","platform":"leetcode","url":"https://leetcode.com/problems/reverse-pairs/","altUrls":[{"platform":"takeuforward","url":"https://takeuforward.org/practice/dsa/reverse-pairs?category=faqs-hard&source=strivers-a2z-dsa-sheet"}],"article":"https://takeuforward.org/blogs/data-structure-and-algorithm/count-reverse-pairs","video":"https://youtu.be/0e4bZaP3MDI","premium":false,"duration":"31 min","slug":"reverse-pairs","lcSlug":"reverse-pairs"},{"id":"a2z-0021","order":21,"title":"Search X in sorted array","step":5,"stepTitle":"Binary Search","topic":"Fundamentals","tier":"basic","difficulty":"Easy","difficultySource":"leetcode","platform":"leetcode","url":"https://leetcode.com/problems/binary-search/","altUrls":[{"platform":"takeuforward","url":"https://takeuforward.org/practice/dsa/search-x-in-sorted-array?category=fundamentals&source=strivers-a2z-dsa-sheet"}],"article":"https://takeuforward.org/blogs/data-structure-and-algorithm/binary-search-algorithm","video":"https://youtu.be/MHf6awe89xw","premium":false,"duration":"33 min","slug":"search-x-in-sorted-array","lcSlug":"binary-search"},{"id":"a2z-0022","order":22,"title":"Lower Bound","step":5,"stepTitle":"Binary Search","topic":"Fundamentals","tier":"basic","difficulty":"Easy","difficultySource":"gfg","platform":"gfg","url":"https://www.geeksforgeeks.org/problems/implement-lower-bound/1","altUrls":[{"platform":"takeuforward","url":"https://takeuforward.org/practice/dsa/lower-bound-?category=fundamentals&source=strivers-a2z-dsa-sheet"}],"article":"https://takeuforward.org/blogs/data-structure-and-algorithm/lower-bound-in-sorted-array","video":"https://youtu.be/6zhGS79oQ4k","premium":false,"duration":"16 min","slug":"lower-bound-","lcSlug":""},{"id":"a2z-0023","order":23,"title":"Find out how many times the array is rotated","step":5,"stepTitle":"Binary Search","topic":"Logic Building","tier":"basic","difficulty":"","difficultySource":"","platform":"takeuforward","url":"https://takeuforward.org/practice/dsa/find-out-how-many-times-the-array-is-rotated?category=logic-building&source=strivers-a2z-dsa-sheet","altUrls":[],"article":"https://takeuforward.org/blogs/data-structure-and-algorithm/rotation-count-sorted-array","video":"https://youtu.be/jtSiWTPLwd0","premium":false,"duration":"4 min","slug":"find-out-how-many-times-the-array-is-rotated","lcSlug":""},{"id":"a2z-0024","order":24,"title":"Koko eating bananas","step":5,"stepTitle":"Binary Search","topic":"On answers","tier":"core","difficulty":"Medium","difficultySource":"leetcode","platform":"leetcode","url":"https://leetcode.com/problems/koko-eating-bananas/","altUrls":[{"platform":"takeuforward","url":"https://takeuforward.org/practice/dsa/koko-eating-bananas?category=on-answers&source=strivers-a2z-dsa-sheet"}],"article":"https://takeuforward.org/blogs/data-structure-and-algorithm/koko-eating-bananas","video":"https://youtu.be/qyfekrNni90","premium":false,"duration":"20 min","slug":"koko-eating-bananas","lcSlug":"koko-eating-bananas"},{"id":"a2z-0025","order":25,"title":"Median of 2 sorted arrays","step":5,"stepTitle":"Binary Search","topic":"FAQs","tier":"pro","difficulty":"Hard","difficultySource":"leetcode","platform":"leetcode","url":"https://leetcode.com/problems/median-of-two-sorted-arrays/","altUrls":[{"platform":"takeuforward","url":"https://takeuforward.org/practice/dsa/median-of-2-sorted-arrays?category=faqs&source=strivers-a2z-dsa-sheet"}],"article":null,"video":"https://www.youtube.com/watch?v=NTop3VTjmxk&list=PLgUwDviBIf0p4ozDR_kJJkONnb1wdx2Ma&index=65","premium":false,"duration":"50 min","slug":"median-of-2-sorted-arrays","lcSlug":"median-of-two-sorted-arrays"},{"id":"a2z-0026","order":26,"title":"Find row with maximum 1's","step":5,"stepTitle":"Binary Search","topic":"2D Arrays","tier":"basic","difficulty":"","difficultySource":"","platform":"takeuforward","url":"https://takeuforward.org/practice/dsa/find-row-with-maximum-1's?category=2d-arrays&source=strivers-a2z-dsa-sheet","altUrls":[],"article":"https://takeuforward.org/blogs/data-structure-and-algorithm/find-the-row-with-maximum-1s-in-a-sorted-binary-matrix","video":"https://youtu.be/SCz-1TtYxDI","premium":false,"duration":"10 min","slug":"find-row-with-maximum-1's","lcSlug":""}]};

  /* ------------------------------------------------------------------ icons */

  var ICON = {
    /* functional affordances */
    check: '<svg class="icon" viewBox="0 0 16 16" aria-hidden="true"><path d="m3.8 8.4 2.8 2.8 5.6-6.4"/></svg>',
    star: '<svg class="icon" viewBox="0 0 16 16" aria-hidden="true"><path d="m8 2.2 1.8 3.7 4 .6-2.9 2.8.7 4-3.6-1.9-3.6 1.9.7-4L2.2 6.5l4-.6z"/></svg>',
    article: '<svg class="icon" viewBox="0 0 16 16" aria-hidden="true"><path d="M4.2 2.4h4.5l3.1 3.1v8.1H4.2z"/><path d="M8.6 2.4v3.2h3.2M6.2 9h3.6M6.2 11.2h3.6"/></svg>',
    video: '<svg class="icon" viewBox="0 0 16 16" aria-hidden="true"><rect x="2.4" y="3.8" width="11.2" height="8.4" rx="1.6"/><path d="m6.9 6.6 3.3 1.4-3.3 1.4z"/></svg>',
    chevron: '<svg class="icon" viewBox="0 0 16 16" aria-hidden="true"><path d="m6.4 3.8 4.2 4.2-4.2 4.2"/></svg>',
    external: '<svg class="icon" viewBox="0 0 16 16" aria-hidden="true"><path d="M9.4 3.2h3.4v3.4M12.6 3.4 7.8 8.2"/><path d="M11.6 9.4v3.2H3.4V4.4h3.4"/></svg>',
    /* real brand marks only; platforms without a sourceable mark stay text-only */
    plat: {
      leetcode: '<svg class="plat-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z"/></svg>',
      gfg: '<svg class="plat-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M21.45 14.315c-.143.28-.334.532-.565.745a3.691 3.691 0 0 1-1.104.695 4.51 4.51 0 0 1-3.116-.016 3.79 3.79 0 0 1-2.135-2.078 3.571 3.571 0 0 1-.13-.353h7.418a4.26 4.26 0 0 1-.368 1.008zm-11.99-.654a3.793 3.793 0 0 1-2.134 2.078 4.51 4.51 0 0 1-3.117.016 3.7 3.7 0 0 1-1.104-.695 2.652 2.652 0 0 1-.564-.745 4.221 4.221 0 0 1-.368-1.006H9.59c-.038.12-.08.238-.13.352zm14.501-1.758a3.849 3.849 0 0 0-.082-.475l-9.634-.008a3.932 3.932 0 0 1 1.143-2.348c.363-.35.79-.625 1.26-.809a3.97 3.97 0 0 1 4.484.957l1.521-1.49a5.7 5.7 0 0 0-1.922-1.357 6.283 6.283 0 0 0-2.544-.49 6.35 6.35 0 0 0-2.405.457 6.007 6.007 0 0 0-1.963 1.276 6.142 6.142 0 0 0-1.325 1.94 5.862 5.862 0 0 0-.466 1.864h-.063a5.857 5.857 0 0 0-.467-1.865 6.13 6.13 0 0 0-1.325-1.939A6 6 0 0 0 8.21 6.302a6.283 6.283 0 0 0-2.544-.49 5.7 5.7 0 0 0-1.922.357l1.489 1.489a3.993 3.993 0 0 1 4.548.95c.363.35.625.79.809 1.26.174.436.266.902.277 1.368 0 .166-.011.332-.032.498H.246c.09.51.24 1.006.45 1.481a6.02 6.02 0 0 0 1.276 1.96 6.05 6.05 0 0 0 1.958 1.317c.72.31 1.5.47 2.29.473a6.29 6.29 0 0 0 2.466-.49 5.98 5.98 0 0 0 1.932-1.317c.55-.55.96-1.19 1.23-1.903h.063a5.86 5.86 0 0 0 1.23 1.903 5.98 5.98 0 0 0 1.932 1.317 6.29 6.29 0 0 0 2.466.49 6.02 6.02 0 0 0 2.29-.473 6.05 6.05 0 0 0 1.958-1.317zM12 4.306l.66 1.42 .066.132a5.86 5.86 0 0 0-.726.045z"/></svg>'
    }
  };

  /** Brand mark for a platform, or '' when no official mark is sourceable
      (takeUForward has none, so its badge stays text-only). */
  function platIcon(platform) { return ICON.plat[platform] || ''; }

  /* ----------------------------------------------------------------- helpers */

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
  function escRe(s) { return String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

  function highlight(text, query) {
    var t = String(text == null ? '' : text);
    if (!query) return esc(t);
    var re = new RegExp(escRe(query), 'gi');
    var out = '', last = 0, m;
    while ((m = re.exec(t)) !== null) {
      if (m.index > last) out += esc(t.slice(last, m.index));
      out += '<mark>' + esc(m[0]) + '</mark>';
      last = m.index + m[0].length;
      if (m[0] === '') re.lastIndex++;
    }
    return out + esc(t.slice(last));
  }

  function el(id) { return document.getElementById(id); }
  function all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  function readSet(key) {
    try {
      var raw = JSON.parse(window.localStorage.getItem(key) || '[]');
      return new Set(Array.isArray(raw) ? raw.filter(function (x) { return typeof x === 'string'; }) : []);
    } catch (err) { return new Set(); }
  }
  function writeSet(key, set) {
    try { window.localStorage.setItem(key, JSON.stringify(Array.from(set).sort())); }
    catch (err) { /* private mode: progress simply will not persist */ }
  }
  function store(key, value) { try { window.localStorage.setItem(key, value); } catch (err) {} }
  function isNarrow() { return window.matchMedia('(max-width: 900px)').matches; }
  function reducedMotion() { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; }

  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  function longDate(iso) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(iso || ''));
    if (!m) return '';
    return Number(m[3]) + ' ' + MONTHS[Number(m[2]) - 1] + ' ' + m[1];
  }

  /* ------------------------------------------------------------------- state */

  var state = {
    problems: [],
    byId: new Map(),
    meta: { title: "Striver's A2Z DSA sheet", steps: [] },
    steps: [],
    sample: false,
    solved: readSet(KEY_SOLVED),
    starred: readSet(KEY_STARRED),
    filters: { q: '', diff: 'all', platform: 'all', status: 'all', tier: 'all', step: null },
    visible: [],
    focusIdx: -1,
    detailsId: null,
    detailsOpener: null,
    railOpen: false,
    loadNote: null,
    loadError: null
  };

  /* ------------------------------------------------------- data preparation */

  function normalise(p, i) {
    return {
      id: String(p.id || ('a2z-' + String(i + 1).padStart(4, '0'))),
      order: Number.isFinite(p.order) ? p.order : i + 1,
      title: String(p.title || 'Untitled problem'),
      step: Number.isFinite(p.step) ? p.step : 1,
      stepTitle: String(p.stepTitle || ''),
      topic: String(p.topic || ''),
      tier: TIERS.indexOf(p.tier) >= 0 ? p.tier : '',
      difficulty: DIFFICULTIES.indexOf(p.difficulty) >= 0 ? p.difficulty : '',
      difficultySource: p.difficultySource ? String(p.difficultySource) : '',
      platform: PLATFORM_LABEL[p.platform] ? p.platform : 'other',
      url: p.url ? String(p.url) : '',
      altUrls: Array.isArray(p.altUrls) ? p.altUrls.filter(function (a) { return a && a.url; }).map(function (a) {
        return { platform: PLATFORM_LABEL[a.platform] ? a.platform : 'other', url: String(a.url) };
      }) : [],
      article: p.article ? String(p.article) : '',
      video: p.video ? String(p.video) : '',
      premium: p.premium === true
    };
  }

  function acceptData(payload, note) {
    var problems = (payload && Array.isArray(payload.problems) ? payload.problems : []).map(normalise);
    if (!problems.length) throw new Error('the dataset has no problems');
    problems.sort(function (a, b) { return a.order - b.order; });
    state.problems = problems;
    state.byId = new Map(problems.map(function (p) { return [p.id, p]; }));
    state.meta = Object.assign({ title: "Striver's A2Z DSA sheet", steps: [] }, payload.meta || {});
    state.sample = Boolean(note);
    state.loadNote = note || null;
    state.loadError = null;
    buildSteps();
    /* If drawing fails, say so on the page rather than leaving a half-built shell. */
    try {
      start();
    } catch (err) {
      state.loadError = 'the page hit an unexpected error while drawing the sheet (' +
        (err && err.message ? err.message : String(err)) + ').';
      renderBanner();
    }
  }

  function buildSteps() {
    var byStep = new Map();
    state.problems.forEach(function (p) {
      if (!byStep.has(p.step)) byStep.set(p.step, []);
      byStep.get(p.step).push(p);
    });
    var titles = new Map((state.meta.steps || []).map(function (s) { return [s.n, s.title]; }));
    state.steps = Array.from(byStep.keys()).sort(function (a, b) { return a - b; }).map(function (n) {
      var list = byStep.get(n);
      return { n: n, title: titles.get(n) || list[0].stepTitle || ('Module ' + n), count: list.length };
    });
  }

  function solvedCount() {
    var n = 0;
    for (var i = 0; i < state.problems.length; i++) if (state.solved.has(state.problems[i].id)) n++;
    return n;
  }
  function stepStats(n) {
    var total = 0, done = 0;
    state.problems.forEach(function (p) {
      if (p.step !== n) return;
      total++;
      if (state.solved.has(p.id)) done++;
    });
    return { total: total, done: done };
  }

  /* --------------------------------------------------------------- filtering */

  function matches(p, f) {
    if (f.step !== null && p.step !== f.step) return false;
    if (f.diff !== 'all' && p.difficulty !== f.diff) return false;
    if (f.tier !== 'all' && p.tier !== f.tier) return false;
    if (f.platform !== 'all' && p.platform !== f.platform) return false;
    if (f.status === 'solved' && !state.solved.has(p.id)) return false;
    if (f.status === 'unsolved' && state.solved.has(p.id)) return false;
    if (f.status === 'starred' && !state.starred.has(p.id)) return false;
    /* the module name lives in stepTitle, so "binary search" finds the module
       even though its topics are named "On answers", "FAQs", ... */
    if (f.q && (p.title + ' ' + p.topic + ' ' + p.stepTitle).toLowerCase().indexOf(f.q) < 0) return false;
    return true;
  }

  function filtersActive() {
    var f = state.filters;
    return Boolean(f.q) || f.diff !== 'all' || f.platform !== 'all' || f.status !== 'all' ||
      f.tier !== 'all' || f.step !== null;
  }

  function visibleProblems() {
    return state.problems.filter(function (p) { return matches(p, state.filters); });
  }

  /* ----------------------------------------------------------- cell renderers */

  function difficultyCell(p) {
    if (p.difficulty) {
      var src = p.difficultySource ? ' (published by ' + esc(p.difficultySource) + ')' : '';
      return '<span class="pill pill-' + p.difficulty.toLowerCase() + '" title="' + esc(p.difficulty) + ' difficulty' + src + '">' +
        esc(p.difficulty) + '</span>';
    }
    /* No Easy/Medium/Hard label on this one: say so plainly rather than
       inventing a rating. The tier column already carries Striver's grouping. */
    return '<span class="dash" title="The sheet publishes no difficulty for this problem">-</span>';
  }

  function platformCell(p) {
    var label = PLATFORM_LABEL[p.platform] || 'the platform site';
    /* Rows show the primary platform only: alternates would double the meta text
       on 305 rows for something rarely needed while scanning. The exception is a
       premium primary link, where a free route to the same problem is useful
       right there. Every alternate is always listed in the details drawer. */
    var alts = (p.premium ? p.altUrls : []).map(function (a) {
      var altLabel = PLATFORM_LABEL[a.platform] || 'the platform site';
      return '<a href="' + esc(a.url) + '" target="_blank" rel="noopener" ' +
        'aria-label="Open &quot;' + esc(p.title) + '&quot; on ' + esc(altLabel) + ' instead">also ' + esc(altLabel) + '</a>';
    }).join('');
    var paid = p.premium
      ? '<span class="badge badge-premium" title="The main link needs a paid subscription, so a free alternate is listed here too">paid</span>'
      : '';
    return '<span class="badge badge-' + p.platform + '">' + platIcon(p.platform) +
      '<span class="badge-label">' + esc(label) + '</span></span>' + paid +
      (alts ? '<span class="alt-links">' + alts + '</span>' : '');
  }

  function rowHTML(p) {
    var sol = state.solved.has(p.id);
    var star = state.starred.has(p.id);
    var title = state.filters.q ? highlight(p.title, state.filters.q) : esc(p.title);
    var titleEl = p.url
      ? '<a class="row-title" href="' + esc(p.url) + '" target="_blank" rel="noopener">' + title + '</a>'
      : '<span class="row-title">' + title + '</span>';
    var tier = p.tier ? '<span class="row-tier" title="Striver groups this problem as ' + TIER_LABEL[p.tier] +
      '; that is the sheet\'s own tier, not the platform difficulty">' + TIER_LABEL[p.tier] + '</span>' : '<span class="row-tier"></span>';

    return '<div class="row' + (sol ? ' is-solved' : '') + '" data-id="' + esc(p.id) + '" tabindex="-1" role="group" ' +
      'aria-label="' + esc(p.order + '. ' + p.title) + '">' +
      '<button type="button" class="check" data-act="toggle-solved" role="checkbox" aria-checked="' + sol + '" ' +
        'aria-label="Mark ' + esc(p.title) + ' as ' + (sol ? 'not done' : 'done') + '"><span class="box">' + ICON.check + '</span></button>' +
      '<span class="row-order" aria-hidden="true">' + p.order + '</span>' +
      '<span class="row-title-cell">' + titleEl + '</span>' +
      '<span class="row-tier-cell">' + tier + '</span>' +
      '<span class="row-diff">' + difficultyCell(p) + '</span>' +
      '<span class="row-platform">' + platformCell(p) + '</span>' +
      '<span class="row-actions">' +
        (p.url ? '<a class="solve-link" href="' + esc(p.url) + '" target="_blank" rel="noopener" ' +
          'aria-label="Solve ' + esc(p.title) + ' on ' + esc(PLATFORM_LABEL[p.platform] || 'the platform site') + '">Solve</a>' : '') +
        (p.article ? '<a class="act act-optional" href="' + esc(p.article) + '" target="_blank" rel="noopener" ' +
          'aria-label="Read the write-up for ' + esc(p.title) + '" title="Write-up">' + ICON.article + '</a>' : '') +
        (p.video ? '<a class="act act-optional" href="' + esc(p.video) + '" target="_blank" rel="noopener" ' +
          'aria-label="Watch the video for ' + esc(p.title) + '" title="Video">' + ICON.video + '</a>' : '') +
        '<button type="button" class="act star" data-act="toggle-star" aria-pressed="' + star + '" ' +
          'aria-label="' + (star ? 'Remove star from ' : 'Star ') + esc(p.title) + '" title="Star">' + ICON.star + '</button>' +
        '<button type="button" class="act row-details" data-act="details" aria-expanded="false" aria-controls="details" ' +
          'aria-label="Details for ' + esc(p.title) + '" title="Details">' + ICON.chevron + '</button>' +
      '</span>' +
    '</div>';
  }

  function renderList() {
    var vis = visibleProblems();
    state.visible = vis;
    var list = el('list');

    if (!vis.length) {
      list.innerHTML = '';
      el('empty').hidden = false;
      el('listwrap').setAttribute('aria-busy', 'false');
      updateCount();
      return;
    }
    el('empty').hidden = true;

    var html = '';
    var curStep = null, curTopic = null, topicRows = [];
    function flushTopic() {
      if (curTopic === null) return;
      html += '<div class="topic-head"><span>' + esc(curTopic || 'General') + '</span>' +
        '<span class="num">' + topicRows.length + '</span></div>' + topicRows.join('');
      topicRows = [];
    }
    /* Each module is its own section, so its sticky header is pushed out by the
       next one instead of stacking on top of it. */
    function closeModule() {
      if (curStep === null) return;
      flushTopic();
      html += '</section>';
    }
    for (var i = 0; i < vis.length; i++) {
      var p = vis[i];
      if (p.step !== curStep) {
        closeModule();
        curTopic = null;
        curStep = p.step;
        var st = stepStats(curStep);
        var title = (state.steps.filter(function (s) { return s.n === curStep; })[0] || {}).title || p.stepTitle;
        var pct = st.total ? Math.round(st.done / st.total * 100) : 0;
        html += '<section class="module" data-module="' + curStep + '">' +
          '<div class="module-head" data-step="' + curStep + '">' +
          '<div class="module-head-row">' +
            '<span class="module-head-no">' + curStep + '</span>' +
            '<span class="module-head-name">' + esc(title) + '</span>' +
            '<span class="module-head-done" data-step-done="' + curStep + '">' + st.done + ' of ' + st.total + ' done, ' + pct + '%</span>' +
          '</div>' +
          '<div class="module-head-rule"><i data-step-rule="' + curStep + '" style="width:' + (st.total ? (st.done / st.total * 100) : 0) + '%"></i></div>' +
        '</div>';
      }
      if (p.topic !== curTopic) {
        flushTopic();
        curTopic = p.topic;
      }
      topicRows.push(rowHTML(p));
    }
    closeModule();

    list.innerHTML = html;
    updateFocusRing();
    updateCount();
  }

  /* --------------------------------------------------------------- progress */

  function renderProgressRule() {
    var total = state.problems.length;
    var done = solvedCount();
    var track = el('progressTrack');
    /* The markup and the script are versioned separately by the browser's cache, so a page can
       be handed one without the other. Missing nodes must skip the update, never throw: throwing
       here used to abort the whole render and leave an empty page. */
    if (!track) return;
    track.setAttribute('aria-valuemax', String(total));
    track.setAttribute('aria-valuenow', String(done));
    track.setAttribute('aria-valuetext', done + ' of ' + total + ' problems done');
    var pct = total ? done / total : 0;
    var pctEl = el('progressPct'), countEl = el('progressCount');
    if (pctEl) pctEl.textContent = pct === 0 ? '0%' : (pct < 0.01 ? '<1%' : Math.round(pct * 100) + '%');
    if (countEl) countEl.textContent = done + ' of ' + total + ' done';
  }

  function setRuleWidth(animate) {
    var total = state.problems.length;
    var fill = el('progressFill');
    if (!fill) return;
    var pct = total ? solvedCount() / total : 0;
    if (!animate || reducedMotion()) {
      fill.classList.add('no-anim');
      fill.style.width = (pct * 100).toFixed(2) + '%';
      void fill.offsetWidth;      /* commit the value before re-enabling */
      fill.classList.remove('no-anim');
      return;
    }
    fill.classList.remove('no-anim');
    fill.style.width = (pct * 100).toFixed(2) + '%';
  }

  /* ---------------------------------------------------------------- the rail */

  function renderRail() {
    el('railList').innerHTML = state.steps.map(function (s) {
      var st = stepStats(s.n);
      return '<button type="button" class="module-link' + (st.done === st.total ? ' is-done' : '') + '" data-act="filter-step" ' +
        'data-step="' + s.n + '" aria-current="' + (state.filters.step === s.n) + '" ' +
        'aria-label="Module ' + s.n + ': ' + esc(s.title) + ', ' + st.done + ' of ' + st.total + ' done">' +
        '<span class="module-no">' + s.n + '</span>' +
        '<span class="module-body"><span class="module-name">' + esc(s.title) + '</span>' +
        '<span class="module-rule"><i style="width:' + (st.total ? (st.done / st.total * 100) : 0) + '%"></i></span></span>' +
        '<span class="module-count" data-rail-count="' + s.n + '">' + st.done + '/' + st.total + '</span>' +
      '</button>';
    }).join('');
    el('railSummary').textContent = state.steps.length + ' modules';
  }

  function updateRailStats() {
    state.steps.forEach(function (s) {
      var st = stepStats(s.n);
      var btn = el('railList').querySelector('[data-act="filter-step"][data-step="' + s.n + '"]');
      if (!btn) return;
      btn.classList.toggle('is-done', st.done === st.total);
      var bar = btn.querySelector('.module-rule > i');
      if (bar) bar.style.width = (st.total ? (st.done / st.total * 100) : 0) + '%';
      var count = btn.querySelector('[data-rail-count]');
      if (count) count.textContent = st.done + '/' + st.total;
      btn.setAttribute('aria-label', 'Module ' + s.n + ': ' + s.title + ', ' + st.done + ' of ' + st.total + ' done');
    });
  }

  function updateModuleHeads() {
    all('.module-head', el('list')).forEach(function (head) {
      var n = Number(head.dataset.step);
      var st = stepStats(n);
      var pct = st.total ? Math.round(st.done / st.total * 100) : 0;
      var done = head.querySelector('[data-step-done]');
      if (done) done.textContent = st.done + ' of ' + st.total + ' done, ' + pct + '%';
      var rule = head.querySelector('[data-step-rule]');
      if (rule) rule.style.width = (st.total ? (st.done / st.total * 100) : 0) + '%';
    });
  }

  function updateCount() {
    var total = state.problems.length;
    var n = state.visible.length;
    el('results').textContent = n === total
      ? total + ' problems'
      : n + ' of ' + total + ' problems';
    el('clearFilters').hidden = !filtersActive();
    el('searchClear').hidden = !state.filters.q;

    var f = state.filters;
    var active = (f.diff !== 'all' ? 1 : 0) + (f.platform !== 'all' ? 1 : 0) + (f.tier !== 'all' ? 1 : 0) +
      (f.status !== 'all' ? 1 : 0) + (f.step !== null ? 1 : 0);
    el('filterBadge').hidden = active === 0;
    el('filterBadge').textContent = active ? String(active) : '';

    all('[data-facet]').forEach(function (btn) {
      btn.setAttribute('aria-pressed', String(state.filters[btn.dataset.facet] === btn.dataset.value));
    });
    el('platformSelect').value = state.filters.platform;
    all('[data-act="filter-step"]', el('railList')).forEach(function (b) {
      b.setAttribute('aria-current', String(Number(b.dataset.step) === state.filters.step));
    });
  }

  function refreshProgress() {
    renderProgressRule();
    setRuleWidth(true);
    updateRailStats();
    updateModuleHeads();
    renderFooter();
  }

  /* -------------------------------------------------------------- mutations */

  function rowById(id) { return el('list').querySelector('.row[data-id="' + id.replace(/"/g, '\\"') + '"]'); }

  function setSolved(id, value) {
    if (value) state.solved.add(id); else state.solved.delete(id);
    writeSet(KEY_SOLVED, state.solved);
    var problem = state.byId.get(id);
    var row = rowById(id);
    if (row) {
      var btn = row.querySelector('[data-act="toggle-solved"]');
      row.classList.toggle('is-solved', value);
      if (btn && problem) {
        btn.setAttribute('aria-checked', String(value));
        btn.setAttribute('aria-label', 'Mark ' + problem.title + ' as ' + (value ? 'not done' : 'done'));
      }
    }
    refreshProgress();
    if (state.filters.status === 'solved' || state.filters.status === 'unsolved') renderList();
    else updateCount();
    if (state.detailsId === id) renderDetailsBody();
  }

  function setStarred(id, value, btn) {
    if (value) state.starred.add(id); else state.starred.delete(id);
    writeSet(KEY_STARRED, state.starred);
    var problem = state.byId.get(id);
    if (btn && problem) {
      btn.setAttribute('aria-pressed', String(value));
      btn.setAttribute('aria-label', (value ? 'Remove star from ' : 'Star ') + problem.title);
    }
    if (state.filters.status === 'starred') renderList();
    if (state.detailsId === id) renderDetailsBody();
  }

  /* ---------------------------------------------------------------- details */

  function openDetails(id, opener) {
    state.detailsId = id;
    state.detailsOpener = opener || null;
    renderDetailsBody();
    var panel = el('details');
    panel.classList.add('is-open');
    panel.setAttribute('aria-hidden', 'false');
    if (opener) opener.setAttribute('aria-expanded', 'true');
    syncScrim();
    el('detailsClose').focus();
  }

  function closeDetails() {
    if (!state.detailsId) return;
    var panel = el('details');
    panel.classList.remove('is-open');
    panel.setAttribute('aria-hidden', 'true');
    var row = rowById(state.detailsId);
    if (row) {
      var b = row.querySelector('[data-act="details"]');
      if (b) b.setAttribute('aria-expanded', 'false');
    }
    var opener = state.detailsOpener;
    state.detailsId = null;
    state.detailsOpener = null;
    syncScrim();
    if (opener && document.contains(opener)) opener.focus();
  }

  function linkRow(url, label, icon) {
    return '<a class="detail-link" href="' + esc(url) + '" target="_blank" rel="noopener">' +
      (icon || ICON.external) + '<span>' + esc(label) + '</span>' + ICON.external + '</a>';
  }

  function renderDetailsBody() {
    var p = state.byId.get(state.detailsId);
    if (!p) return;
    var sol = state.solved.has(p.id);
    var star = state.starred.has(p.id);
    var stepTitle = (state.steps.filter(function (s) { return s.n === p.step; })[0] || {}).title || p.stepTitle;

    var links = [];
    if (p.url) links.push(linkRow(p.url, 'Solve on ' + (PLATFORM_LABEL[p.platform] || 'the platform site'), platIcon(p.platform)));
    p.altUrls.forEach(function (a) {
      links.push(linkRow(a.url, 'Solve on ' + (PLATFORM_LABEL[a.platform] || 'the platform site') + ' instead', platIcon(a.platform)));
    });
    if (p.article) links.push(linkRow(p.article, 'Read the write-up', ICON.article));
    if (p.video) links.push(linkRow(p.video, 'Watch the video', ICON.video));

    el('detailsTitle').textContent = p.title;
    el('detailsBody').innerHTML =
      '<div class="details-meta">' +
        (p.difficulty ? '<span class="pill pill-' + p.difficulty.toLowerCase() + '">' + esc(p.difficulty) + '</span>'
                      : '<span class="pill pill-tier">No published difficulty</span>') +
        '<span class="badge badge-' + p.platform + '">' + platIcon(p.platform) + esc(PLATFORM_LABEL[p.platform] || 'the platform site') + '</span>' +
        (p.premium ? '<span class="badge badge-premium">Needs a subscription</span>' : '') +
        (star ? '<span class="badge badge-premium">Starred</span>' : '') +
      '</div>' +
      '<div class="detail-row"><span class="detail-label">Module</span><span class="detail-value">' +
        p.step + '. ' + esc(stepTitle) + '</span></div>' +
      '<div class="detail-row"><span class="detail-label">Topic</span><span class="detail-value">' + esc(p.topic || '-') + '</span></div>' +
      '<div class="detail-row"><span class="detail-label">Striver tier</span><span class="detail-value">' +
        (TIER_LABEL[p.tier] || 'Not set') +
        '<span class="detail-note">The sheet groups every problem as Basic, Core or Pro. That grouping is not a difficulty rating.</span></span></div>' +
      '<div class="detail-row"><span class="detail-label">Difficulty</span><span class="detail-value">' +
        (p.difficulty
          ? esc(p.difficulty) + (p.difficultySource ? '<span class="detail-note">Published by ' + esc(p.difficultySource) + '.</span>' : '')
          : 'Not published<span class="detail-note">The sheet gives no Easy, Medium or Hard label for this problem.</span>') +
      '</span></div>' +
      '<div class="detail-row"><span class="detail-label">Position</span><span class="detail-value num">' + p.order +
        ' of ' + state.problems.length + '</span></div>' +
      '<div class="detail-links">' + (links.length ? links.join('') : '<p class="detail-note">No links recorded for this problem.</p>') + '</div>' +
      '<div class="detail-toggles">' +
        '<button type="button" class="btn' + (sol ? ' btn-primary' : '') + '" data-act="d-solved" aria-pressed="' + sol + '">' +
          ICON.check + (sol ? 'Done' : 'Mark done') + '</button>' +
        '<button type="button" class="btn' + (star ? ' btn-primary' : '') + '" data-act="d-star" aria-pressed="' + star + '">' +
          ICON.star + (star ? 'Starred' : 'Star') + '</button>' +
      '</div>' +
      '<p class="details-footnote">Progress is saved in this browser only.</p>';
  }

  /* ------------------------------------------------------------------ scrim */

  function syncScrim() {
    var show = state.railOpen || (state.detailsId && isNarrow());
    el('scrim').classList.toggle('is-open', Boolean(show));
  }

  function setRail(open) {
    state.railOpen = open;
    el('rail').classList.toggle('is-open', open);
    el('railToggle').setAttribute('aria-expanded', String(open));
    syncScrim();
    if (open) {
      var first = el('railList').querySelector('.module-link');
      if (first) first.focus();
    } else if (document.activeElement && document.activeElement.closest && document.activeElement.closest('#rail')) {
      el('railToggle').focus();
    }
  }

  function setMenu(open) {
    el('moreMenu').hidden = !open;
    el('moreBtn').setAttribute('aria-expanded', String(open));
    if (open) {
      var first = el('moreMenu').querySelector('.menu-item');
      if (first) first.focus();
    }
  }

  /* ------------------------------------------------------------ interactions */

  function toggleSolved(id) { setSolved(id, !state.solved.has(id)); }

  function focusRow(idx) {
    if (!state.visible.length) return;
    idx = Math.max(0, Math.min(state.visible.length - 1, idx));
    state.focusIdx = idx;
    var row = rowById(state.visible[idx].id);
    if (row) {
      row.scrollIntoView({ block: 'nearest' });
      if (typeof row.focus === 'function') row.focus({ preventScroll: true });
    }
    updateFocusRing();
  }

  function updateFocusRing() {
    all('.row.is-focused', el('list')).forEach(function (r) { r.classList.remove('is-focused'); });
    if (state.focusIdx < 0 || state.focusIdx >= state.visible.length) return;
    var row = rowById(state.visible[state.focusIdx].id);
    if (row) row.classList.add('is-focused');
  }

  function pulseRow(id) {
    var row = rowById(id);
    if (!row) return;
    row.scrollIntoView({ block: 'center' });
    if (reducedMotion()) { row.classList.add('is-focused'); return; }
    row.classList.add('is-pulse');
    window.setTimeout(function () { row.classList.remove('is-pulse'); }, 1600);
  }

  function applyFilters(patch) {
    Object.assign(state.filters, patch || {});
    state.focusIdx = -1;
    renderList();
  }

  function clearFilters() {
    state.filters = { q: '', diff: 'all', platform: 'all', status: 'all', tier: 'all', step: null };
    el('search').value = '';
    state.focusIdx = -1;
    renderList();
  }

  function nextUnsolved() {
    var next = state.problems.filter(function (p) { return !state.solved.has(p.id); })[0];
    if (!next) { toast('Every problem in the sheet is marked done.'); return; }
    clearFilters();
    focusRow(state.visible.findIndex(function (p) { return p.id === next.id; }));
    pulseRow(next.id);
    toast('Next unsolved: ' + next.title);
  }

  /* ------------------------------------------------------------------- toast */

  var toastTimer = null;
  function toast(message) {
    var t = el('toast');
    t.textContent = message;
    t.classList.add('is-open');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () { t.classList.remove('is-open'); }, 3600);
  }

  /* ------------------------------------------------- progress file handling */

  function exportProgress() {
    var payload = {
      version: 1,
      sheet: 'striver-a2z',
      exported: new Date().toISOString(),
      solved: Array.from(state.solved).sort(),
      starred: Array.from(state.starred).sort()
    };
    var blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'a2z-progress-' + new Date().toISOString().slice(0, 10) + '.json';
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
    toast('Exported ' + payload.solved.length + ' done and ' + payload.starred.length + ' starred.');
  }

  function importProgress(file) {
    file.text().then(function (text) {
      var data;
      try { data = JSON.parse(text); } catch (err) { toast('That file is not valid JSON, so nothing was imported.'); return; }
      if (!Array.isArray(data.solved) && !Array.isArray(data.starred)) {
        toast('That file has no "solved" or "starred" list, so nothing was imported.');
        return;
      }
      var known = new Set(state.problems.map(function (p) { return p.id; }));
      var addedSolved = 0, addedStarred = 0;
      (Array.isArray(data.solved) ? data.solved : []).forEach(function (id) {
        if (typeof id === 'string' && known.has(id) && !state.solved.has(id)) { state.solved.add(id); addedSolved++; }
      });
      (Array.isArray(data.starred) ? data.starred : []).forEach(function (id) {
        if (typeof id === 'string' && known.has(id) && !state.starred.has(id)) { state.starred.add(id); addedStarred++; }
      });
      writeSet(KEY_SOLVED, state.solved);
      writeSet(KEY_STARRED, state.starred);
      renderList();
      refreshProgress();
      toast('Imported ' + addedSolved + ' done and ' + addedStarred + ' starred. Problems already marked were left alone.');
    }).catch(function () { toast('That file could not be read, so nothing was imported.'); });
  }

  function resetProgress() {
    if (!window.confirm('Reset all progress? This clears every problem marked done or starred in this browser.')) return;
    state.solved = new Set();
    state.starred = new Set();
    writeSet(KEY_SOLVED, state.solved);
    writeSet(KEY_STARRED, state.starred);
    renderList();
    refreshProgress();
    toast('Progress reset.');
  }

  /* ------------------------------------------------------------------- theme */

  function setTheme(theme, persist) {
    document.documentElement.dataset.theme = theme;
    var btn = el('themeToggle');
    var dark = theme === 'dark';
    if (!btn) return;
    btn.innerHTML = dark
      ? '<svg class="icon" viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="3.1"/><path d="M8 1.8v1.5M8 12.7v1.5M1.8 8h1.5M12.7 8h1.5M3.6 3.6l1.1 1.1M11.3 11.3l1.1 1.1M12.4 3.6l-1.1 1.1M4.7 11.3l-1.1 1.1"/></svg>'
      : '<svg class="icon" viewBox="0 0 16 16" aria-hidden="true"><path d="M13.2 9.6A5.6 5.6 0 0 1 6.4 2.8a5.6 5.6 0 1 0 6.8 6.8z"/></svg>';
    btn.setAttribute('aria-pressed', String(dark));
    btn.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
    if (persist) store(KEY_THEME, theme);
  }

  /* ------------------------------------------------------------------ banner */

  function renderBanner() {
    var banner = el('banner');
    if (state.loadError) {
      banner.className = 'banner banner-error';
      var advice = window.location.protocol === 'file:'
        ? ' Serve this folder over HTTP, for example with <code>python3 -m http.server</code>, and reload the page.'
        : ' Reload the page; if it keeps happening the site may be mid-deploy.';
      banner.innerHTML = '<span><strong>The sheet could not be loaded.</strong> ' + esc(state.loadError) +
        advice + '</span>';
      banner.hidden = false;
      return;
    }
    if (state.sample) {
      banner.className = 'banner';
      banner.innerHTML = '<span><strong>Showing a sample of the sheet.</strong> ' + esc(state.loadNote || 'data.json was not found') +
        ', so these ' + state.problems.length + ' problems come from the copy bundled with the page. ' +
        'Progress still saves, and it applies to these sample problems.</span>';
      banner.hidden = false;
      return;
    }
    banner.hidden = true;
  }

  /* ------------------------------------------------------------------ footer */

  function renderFooter() {
    var counts = { LeetCode: 0, GeeksforGeeks: 0, takeUForward: 0 };
    var withDiff = 0, premium = 0, starred = 0;
    state.problems.forEach(function (p) {
      var label = PLATFORM_LABEL[p.platform];
      if (counts.hasOwnProperty(label)) counts[label]++;
      if (p.difficulty) withDiff++;
      if (p.premium) premium++;
      if (state.starred.has(p.id)) starred++;
    });
    var total = state.problems.length;
    var snapshot = longDate(state.meta.generated);
    el('footerCounts').innerHTML =
      'The sheet holds <span class="num">' + total + '</span> problems: <span class="num">' + counts.LeetCode + '</span> on LeetCode, ' +
      '<span class="num">' + counts.GeeksforGeeks + '</span> on GeeksforGeeks and <span class="num">' + counts.takeUForward + '</span> on takeUForward. ' +
      '<span class="num">' + withDiff + '</span> carry a published difficulty, <span class="num">' + premium + '</span> need a paid subscription' +
      (starred ? ', and you starred <span class="num">' + starred + '</span>' : '') + '.';
    el('footerSnapshot').innerHTML = snapshot
      ? 'Snapshot taken ' + esc(snapshot) + '. '
      : '';
    var source = String(state.meta.source || '');
    el('footerSheetLink').href = /^https?:\/\//.test(source) ? source : SHEET_URL;
  }

  /* ------------------------------------------------------------ data loading */

  function fetchJSON(path) {
    return fetch(path, { cache: 'no-store' }).then(function (res) {
      if (!res.ok) throw new Error(path + ' returned HTTP ' + res.status);
      return res.json();
    });
  }

  function loadData() {
    /* A file:// page has an opaque origin: fetch and XHR both fail there, so
       use the embedded copy instead of logging console errors. */
    if (window.location.protocol === 'file:') {
      try {
        acceptData(SAMPLE_MIRROR, 'the page was opened straight from disk, where browsers block reading data.json');
      } catch (err) {
        state.loadError = err.message;
        renderBanner();
      }
      return;
    }
    fetchJSON('./data.json')
      .then(function (payload) { acceptData(payload, null); })
      .catch(function (primaryErr) {
        return fetchJSON('./sample-data.json')
          .then(function (payload) {
            acceptData(payload, primaryErr.message);
          })
          .catch(function (sampleErr) {
            state.loadError = primaryErr.message + ' and ' + sampleErr.message + '.';
            renderBanner();
          });
      });
  }

  /* -------------------------------------------------------------------- boot */

  var bound = false;

  function start() {
    var title = state.meta.title || "Striver's A2Z DSA sheet";
    document.title = title + ': progress tracker';
    var titleEl = el('sheetTitle'), subEl = el('sheetSub');
    if (titleEl) titleEl.textContent = title;
    if (subEl) {
      subEl.textContent = state.problems.length + ' problems across ' + state.steps.length +
        ' modules, with a working link for every one.';
    }
    renderBanner();
    renderRail();
    renderList();
    renderProgressRule();
    renderFooter();
    el('detailsBody').innerHTML = '<p class="detail-note">Choose a problem to see its links.</p>';
    if (!bound) { bindEvents(); bound = true; }
    el('listwrap').setAttribute('aria-busy', 'false');
    /* the one orchestrated moment: the rule fills from zero on load */
    setRuleWidth(false);
    window.requestAnimationFrame(function () {
      window.requestAnimationFrame(function () { setRuleWidth(true); });
    });
  }

  function bindEvents() {
    var search = el('search');
    var onSearch = function () { applyFilters({ q: search.value.trim().toLowerCase() }); };
    search.addEventListener('input', onSearch);
    search.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && search.value) { e.stopPropagation(); search.value = ''; onSearch(); }
    });
    el('searchClear').addEventListener('click', function () { search.value = ''; onSearch(); search.focus(); });

    /* segmented difficulty: All is a real choice, the rest are mutually exclusive */
    all('.segmented [data-facet]').forEach(function (btn) {
      btn.addEventListener('click', function () { applyFilters({ diff: btn.dataset.value }); });
    });
    /* tier and status: clicking the active one clears it */
    all('.toggles [data-facet]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var facet = btn.dataset.facet;
        var next = state.filters[facet] === btn.dataset.value ? 'all' : btn.dataset.value;
        var patch = {};
        patch[facet] = next;
        applyFilters(patch);
      });
    });
    el('platformSelect').addEventListener('change', function () { applyFilters({ platform: el('platformSelect').value }); });
    el('clearFilters').addEventListener('click', function () { clearFilters(); toast('Filters cleared.'); });
    el('emptyClear').addEventListener('click', function () { clearFilters(); toast('Filters cleared.'); });
    el('filterToggle').addEventListener('click', function () {
      var open = el('filterPanel').classList.toggle('is-open');
      el('filterToggle').setAttribute('aria-expanded', String(open));
    });
    el('nextUnsolved').addEventListener('click', nextUnsolved);

    /* the list: one delegated handler for checks, stars and details */
    el('list').addEventListener('click', function (e) {
      var actEl = e.target.closest('[data-act]');
      if (actEl) {
        var act = actEl.dataset.act;
        if (act === 'toggle-solved') { toggleSolved(actEl.closest('.row').dataset.id); return; }
        if (act === 'toggle-star') {
          var rowB = actEl.closest('.row');
          setStarred(rowB.dataset.id, !state.starred.has(rowB.dataset.id), actEl);
          return;
        }
        if (act === 'details') {
          var rowC = actEl.closest('.row');
          if (state.detailsId === rowC.dataset.id) closeDetails();
          else openDetails(rowC.dataset.id, actEl);
          return;
        }
      }
      if (e.target.closest('a')) return;              /* links keep their own behaviour */
      var row = e.target.closest('.row');
      if (row) openDetails(row.dataset.id, row.querySelector('[data-act="details"]'));
    });

    /* the rail */
    el('railList').addEventListener('click', function (e) {
      var btn = e.target.closest('[data-act="filter-step"]');
      if (!btn) return;
      var n = Number(btn.dataset.step);
      applyFilters({ step: state.filters.step === n ? null : n });
      if (isNarrow()) setRail(false);
    });
    el('railToggle').addEventListener('click', function () { setRail(!state.railOpen); });

    /* the drawer */
    el('detailsClose').addEventListener('click', closeDetails);
    el('detailsBody').addEventListener('click', function (e) {
      var actEl = e.target.closest('[data-act]');
      if (!actEl || !state.detailsId) return;
      if (actEl.dataset.act === 'd-solved') toggleSolved(state.detailsId);
      if (actEl.dataset.act === 'd-star') setStarred(state.detailsId, !state.starred.has(state.detailsId), null);
    });

    /* the overflow menu */
    el('moreBtn').addEventListener('click', function () { setMenu(el('moreMenu').hidden); });
    el('moreMenu').addEventListener('click', function (e) {
      var item = e.target.closest('.menu-item');
      if (!item) return;
      setMenu(false);
      el('moreBtn').focus();
      if (item.dataset.act === 'export') exportProgress();
      if (item.dataset.act === 'import') el('importFile').click();
      if (item.dataset.act === 'reset') resetProgress();
    });
    el('importFile').addEventListener('change', function (e) {
      var file = e.target.files && e.target.files[0];
      if (file) importProgress(file);
      e.target.value = '';
    });

    el('themeToggle').addEventListener('click', function () {
      setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark', true);
    });

    el('scrim').addEventListener('click', function () {
      if (state.railOpen) setRail(false);
      if (state.detailsId) closeDetails();
    });

    document.addEventListener('click', function (e) {
      if (el('moreMenu').hidden) return;
      if (!e.target.closest('.menu-wrap')) setMenu(false);
    });

    document.addEventListener('keydown', function (e) {
      var t = e.target;
      var typing = t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || t.isContentEditable);

      if (e.key === '/' && !typing) { e.preventDefault(); el('search').focus(); el('search').select(); return; }
      if (e.key === 'Escape') {
        if (!el('moreMenu').hidden) { setMenu(false); el('moreBtn').focus(); return; }
        if (state.detailsId) { closeDetails(); return; }
        if (state.railOpen) { setRail(false); return; }
        if (state.filters.q) {
          if (t !== el('search')) e.preventDefault();
          el('search').value = '';
          applyFilters({ q: '' });
        }
        return;
      }
      if (typing) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      /* keep tab focus inside the drawer while it is open */
      if (e.key === 'Tab' && state.detailsId) {
        var focusables = all('a[href], button:not([disabled])', el('details'));
        if (focusables.length) {
          var first = focusables[0], last = focusables[focusables.length - 1];
          if (!el('details').contains(document.activeElement)) { e.preventDefault(); first.focus(); return; }
          if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); return; }
          if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); return; }
        }
      }
      if (e.key === 'j' || e.key === 'k') {
        e.preventDefault();
        var base = state.focusIdx < 0 ? (e.key === 'j' ? -1 : 0) : state.focusIdx;
        focusRow(base + (e.key === 'j' ? 1 : -1));
        return;
      }
      if (e.key === 's') {
        var focused = state.focusIdx >= 0 && state.visible[state.focusIdx];
        if (!focused) return;
        e.preventDefault();
        toggleSolved(focused.id);
        toast((state.solved.has(focused.id) ? 'Marked done: ' : 'Marked not done: ') + focused.title);
      }
    });

    var mq = window.matchMedia('(max-width: 900px)');
    var onBreakpoint = function () {
      if (!mq.matches && state.railOpen) setRail(false);
      syncScrim();
    };
    if (mq.addEventListener) mq.addEventListener('change', onBreakpoint);
    else if (mq.addListener) mq.addListener(onBreakpoint);
  }

  setTheme(document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light', false);
  loadData();
})();
