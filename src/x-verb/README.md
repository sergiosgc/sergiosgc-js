# sergiosgc-js/x-verb

This allows pages to do requests with verbs other than GET/POST and/or specific Accept headers.

# Usage

## Verb

Set the `x-verb` parameter on any link that you wish processed with a different verb:

```
<a href="https://example.com/?x-verb=HEAD">Click me</a>
```

The request will be intercepted, and executed using the Fetch API. `x-verb` is ommited from the request. Response is handled like this:

1. An `x-verb-response` custom event is fired by the document. The event details is the Fetch response. If this event is cancelled by a handler, no further processing happens.
2. If the response is not [ok](https://developer.mozilla.org/en-US/docs/Web/API/Response/ok), an `x-verb-response-error` custom event is fired by the document. The event details is the Fetch response. No further processing happens.
3. If the response was redirected, window.location is set to the new location.
4. If the response was not redirected, an `x-verb-response-success` custom event is fired, with the Fetch response in the event details.

If both `x-verb` and `x-accept` are defined, events for both are fired.

## Accept

Set the `x-accept` parameter on any link that you wish processed with a different verb.

The request will be intercepted, and executed using the Fetch API. `x-accept` is ommited from the request. Response is handled like this:

1. An `x-accept-response` custom event is fired by the document. The event details is the Fetch response. If this event is cancelled by a handler, no further processing happens.
2. If the response is not [ok](https://developer.mozilla.org/en-US/docs/Web/API/Response/ok), an `x-accept-response-error` custom event is fired by the document. The event details is the Fetch response. No further processing happens.
3. If the response was redirected, window.location is set to the new location.
4. If the response was not redirected, an `x-accept-response-success` custom event is fired, with the Fetch response in the event details.

If both `x-verb` and `x-accept` are defined, events for both are fired.

## Changing the parameter name

You may change `x-verb` and/or `x-accept` to any other string. Upon page initialization, set it:

```
sergiosgc.XVerb.verbParameter = "x-method";
sergiosgc.XVerb.acceptParameter = "x-mime";
```
