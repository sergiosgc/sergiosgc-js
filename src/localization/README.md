# sergiosgc-js/localization

This provides a __(src: string) javascript function for string localization client-side.

# Usage

After including sergiosgc-js, provide in your page a string localization dictionary to be used by __():
```
<html>
 (...)
 <head>
 (...)
  <script src="<public path to javascript assets>/sergiosgc-js.js"></script>
  <script>
  // Option 1: provide an URL which returns a JSON dictionary (object) where keys are original strings and values are localized strings
  globalThis.sergiosgc.loadLocalizationTable("/localization-table");
  // Option 2: provide an object with the same dictionary
  globalThis.sergiosgc.loadLocalizationTable({
    "Please wait...": "Por favor aguarde...",
    "Click again to confirm deletion": "Clique de novo para confirmar",
    "Hello world!": "Olá mundo!",
  });
  </script>
```

Anywhere you need a string localized, just call __():
```
<script>
 window.console.log(__("Hello world!"));
</script>
```
