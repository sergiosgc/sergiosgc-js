# sergiosgc-js/form-enctype-json

This is an implementation of HTML form submission in JSON. It is based on the defunct W3C html-json-forms working note:

https://www.w3.org/TR/html-json-forms/

with a functional add-on regarding proper typing of JSON fields.

# Usage

## Attaching to a form

This code will attach to any form with attribute enctype equal to `"application/json"`. So, if you create this form:

```
<form id="example" method="post" enctype="application/json" action="https://example.com/">
 <input type="text" name="first_name" value="John">
 <input type="text" name="last_name" value="Smith">
 <input type="text" name="age" value="42">
</form>
```

the form submission will be intercepted, and a Javascript HTTP Fetch will be done instead. The request will have `Content-type: application/json` and `Accepts: application/json`. The payload will be the built from the form fields:

```
{
    "first_name": "John",
    "last_name": "Smith",
    "age": "42"
}
```

## Handling submission result

Form submission ultimately results in a custom event of type `form-enctype-json-response`:

```
document.getElementById("example").addEventListener("form-enctype-json-response", function(ev) {
    console.log(ev.target); // The form
    console.log(ev.detail.status); // HTTP return code
    console.log(ev.detail.data); // JSON data parsed from the response body

});
```

If the submission results in an HTTP redirect, the browser is instructed to load the redirect location.

## JSON structure definition

Following the definition of the W3C working note, structure can be defined in dot notation to create object trees:

```
<form method="post" enctype="application/json" action="https://example.com/">
 <input type="text" name="name.first" value="John">
 <input type="text" name="name.last" value="Smith">
 <input type="text" name="age" value="42">
</form>
```

produces

```
{
    "name": {
        "first": "John",
        "last": "Smith",
    },
    "age": "42"
}
```

and with array notation `[]` to define arrays:

```
<form method="post" enctype="application/json" action="https://example.com/">
 <input type="text" name="name[]" value="John">
 <input type="text" name="name[]" value="Smith">
 <input type="text" name="age" value="42">
</form>
```

produces

```
{
    "name": ["John", "Smith"],
    "age": "42"
}
```

JSON types can be defined by adding a `sergiosgc-enc` attribute to input fields:

```
<form method="post" enctype="application/json" action="https://example.com/">
 <input type="text" name="name.first" value="John">
 <input type="text" name="name.last" value="Smith">
 <input type="text" name="age" value="42" sergiosgc-enc="integer">
</form>
```

produces:

```
{
    "name": {
        "first": "John",
        "last": "Smith",
    },
    "age": 42
}
```

Note that `age` is no longer a string, but a JSON integer. Acceptable values for `sergiosgc-enc`:

- `boolean`
- `integer`
- `float`
- `string`
- `string_to_string_array`: Split string on TAB,CR,LF and encode as array of strings

Any unknown encoding, as well as any field that has no `sergiosgc-enc` attribute is encoded as a string.

## Form submission event

Much as a regular form sends a `submit` event, this library emits a `form-enctype-json-submit` custom event right before form submission. The custom event contains a `detail` with this structure:

```
{
    url: <string>,
    method: <string>,
    json: <object>
}
```

You may modify the event detail to affect the request. The event is cancellable, and so the default behaviour can be prevented with `preventDefault()`
