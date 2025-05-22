# sergiosgc-js/xpathresult-polyfill

Iterable implementation for XPathResult

# Usage

No direct call is needed. With this module loaded, you can treat XPathResults as iterable. Namely, you can call Array.from() with an XPathResult and work from there. Example:
```
Array.from(document.evaluate("//div", document, null, XPathResult.ANY_TYPE, null))
.filter( div => div.classList.contains("foo") )
.forEach( div => div.classList.add("bar") );
```
