# sergiosgc-js/query-elements

This module extends HTMLElement with two functions: `queryElements` and `queryElement`. They both serve the same purpose: provide a unified interface for querying the DOM tree with either CSS selector syntax or XPath syntax.

# Usage

Call `queryElements` on the context node. Pass it a string starting with `css:` or `xpath:`, followed by the query in the relevant syntax. The function will return an Array of HTMLElement entries. Example:

```
// XPath
document.getElementById('order-table')
 .queryElements('xpath:./tbody/tr/td[@class="date"]')
 .forEach(td => console.log("Order date: " + td.textContent));

// CSS selector
document.getElementById('order-table')
 .queryElements('css: tbody > tr > td[lass="date"]')
 .forEach(td => console.log("Order date: " + td.textContent));

```

`queryElement` is similar, except it returns the first matched HTMLElement or null if no element matches.
