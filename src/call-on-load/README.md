# sergiosgc-js/call-on-load

Alternative to `window.addEventListener("load", <handler>)` that will still fire if the `load` event has ocurred already.

# Usage

Call `globalThis.sergiosgc.callOnLoad()` and pass it the handler:
```
window.sergiosgc.callOnLoad(() => window.console.log("I'm handling the load event"));
```
