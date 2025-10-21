# sergiosgc-js/location-polyfill

Polyfill that adds setSearchParams() to window.location

# Usage

window.location.setSearchParams receives a dictionary of string parameters, keyed by strings. It changes the address to include those parameters, reloading the page.
Empty strings are considered as null, causing the parameter to be deleted from the URL.

```
window.location.setSearchParams({ foo: "bar", baz: "qux" });
```
