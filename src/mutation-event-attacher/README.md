# sergiosgc-js/mutation-event-attacher

Attach/detach event handlers on dynamically changing DOM

# Usage

Selectors are `queryElement` selectors. Check the relevant documentation in this repo.

Instantiate `MutationEventAttacher` with these arguments:
 - rootNode: The context node for the selector expression;
 - selector: An XPath or CSS selector defining elements where to attach the eventHandler;
 - eventName: The name of the event to listen for;
 - handlerFunction: The event handler function

Example:
```
new globalThis.MutationEventAttacher(
 document,
 'css:table.contestants tbody tr.contestant',
 'click',
 ev => console.log("Clicked on contestant " + ev.target.datalist.firstName)
);
```

The event gets handled by the handler function for existing elements, and for any new ones created dynamically.
