# sergiosgc-js/input-datetime-utc

This assists in converting timestamps between UTC and localtime on the backend and frontend respectively.

# Usage

1. For inputs, there is no need to do anything. Just use a datetime-local type for the input, and it will be converted on presentation and before submission.
2. For textual values, enclose them in an element with class `datetime-utc`

The default formatter uses ISO8601 for the format. If you want to, you can replace the formatter:
```
globalThis.sergiosgc.InputDatetimeUtc.elementDateFormatter = function(d) {
  return "The formatted datetime d";
};
// or
globalThis.sergiosgc.InputDatetimeUtc.inputDateFormatter = function(d) {
  return "The formatted datetime d";
};
```

Have a look at InputDatetimeUtc::toLocalIso8601 for the code of the default formatter.