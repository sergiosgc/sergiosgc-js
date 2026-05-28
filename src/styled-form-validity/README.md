# sergiosgc-js/styled-form-validity

Expose Client Side Form Validation in the document so it can be styled with CSS

## Motivation

Client-side [form validation](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms/Form_validation) allows javascript code to validate form fields and set messages for the user to correct validation errors. CSS does allow styling of the controls, but there is no standard way of styling the information bubbles that are applied to invalid fields.

This library exposes invalid form controls validity messages into a predetermined HTML element, and cancels the native bubble. The validity information can then be styled using common CSS.

## Usage

Make it so that any element you wish to be affected has a sibling with class `error-message`. For example:

```
<div>
 <label for="foo">Name:</label>
 <input name="foo" type="text">
 <span class="error-message no-error"></span>
</div>
```

It is also acceptable for the input to be the child of a `label` and the `error-message` element to be a sibling of `label`:

```
<div>
 <label for="go">
  <input name="go" type="checkbox">
  Go for it
 </label>
 <span class="error-message no-error"></span>
</div>
```

Whenever the control becomes invalid, this will happen:

- All content of the error message element is replaced by the validity message text
- Classes `no-error`, `warning` and `info` are removed from the error message element
- Class `error` is added to the error message element
- `invalid` event propagation is stopped, so the native bubbles do not show up

This library will not remove the content once the control becomes valid. Hide it using CSS. For example:

```
div:not(:has(:invalid)) .error-message {
    display: none
}
```
