# sergiosgc-js/sooma-form

Helper for form-enctype-json forms that submit to endpoints that follow Sooma.com's typical API structure

## Motivation

JSON forms handled by form-enctype-json in this repo are submitted using the Fetch API. This means its return payload needs to be handled. In the case of Sooma.com's general API response, this can be largely automated. These API reponses are objects.

A success response will have `success` set to `true` and a `data` object:

```
{
    success: true,
    data: <An object>
}
```

An error response will have `success` set to false, an `error` object with at least a `code` string and possibly a `data` object:

```
{
    success: false,
    error: {
        code: "GenericError"
    }
}
```

In the special case of field validation errors, we get a structure like this:

```
{
    success: false,
    error: {
        code: "ValidationFailed"
    },
    data: {
        "validations": {
            <field>: [ <Array of string messages> ]
        }
    }
}
```

Handling these can be automated. These behaviours will be taken care of by sooma-form:

- If a validation failed error is received, set customValidity errors on failed form fields
- If a success response is received, and the form has a success-url attribute, redirect the page to the success url

If a response is handled, the event propagation is stopped. Application-specific cases should be handled by other `form-enctype-json-response` event handlers.

## Usage

Tag the form element with a class of `sooma-form`. Add a `success-url` attribute to the form, with the desired destination after a successful submission. Naturally, the form must have `enctype="application/json"` so it gets picked up by `form-enctype-json`. That's it.

The `success-url` accepts placeholders in the format of `{field_name}`, that will be replaced with the field from the `data` object in the response. A double bracked is used for escaping the syntax, `{{` and `}}`. For example, if you have a `success-url="/go/{where}/` and an API response of

```
{
    success: true,
    data: {
        where: "home"
        ...
    }
}
```

The resulting redirect will be `/go/home/`

Since form errors are set as [client side form validation](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms/Form_validation), this library pairs well with `styled-form-validity`.
