# sergiosgc-js/part-fetch

Handles loading of content into page slots

# Usage

## Simple content loading

Add a `part-fetch` class and a `data-src` attribute to the element:

```
<html>
 <body>
  (...)
  <div class="part-fech" data-src="https://example.com/"> </div>
  (...)
 </body>
</html>
```

## In-place link loading

Tag any A tag with class `sergiosgc-inplace`. It will be replaced with a `div`, with class `sergiosgc-inplace` and containing the contents of the result.

## Content capture

If content of a certain type is to always be loaded into a page slot, set a `data-capture` attribute to `true`

```
<html>
 <body>
  (...)
  <a href="https://example.com/a_sub_url">Click me!</a>
  <div class="part-fech" data-src="https://example.com/" data-capture="true"> </div>
  (...)
 </body>
</html>
```

If `data-capture` is true, any link on the page with the same prefix as `data-src` will be loaded into the slot, instead of causing a page refresh. In the example, the `Click me!` link causes a reload of the `div` contents, instead of regular page navigation.
