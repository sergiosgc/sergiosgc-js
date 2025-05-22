# sergiosgc-js/xpath-observer

Layer over MutationObserver that offers a simpler interface to observe document mutation events

# Usage

Instantiate an XPathObserver. Give it a root node to observe from (defaults to document), and an xpath expression, whose contextNode is the root node, to filter which elements are you interested in.

```
const observer = new XPathObserver("//tr", document.getElementById("contestants"));
```

Then register for events `xpathobserver.node.new` and/or `xpathobserver.node.delete`:
```
observer.addEventListener("xpathobserver.node.new", ev => console.log("New contestant: " + ev.detail.target.dataset.firstName));
observer.addEventListener("xpathobserver.node.delete", ev => console.log("Contestant dropped: " + ev.detail.target.dataset.firstName));
```
