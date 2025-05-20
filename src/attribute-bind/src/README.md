# sergiosgc-js/attribute-bind

This binds attributes of one source element and a set of destination elements. Bound attributes have the value propagated.

# Usage

Instantiate the AttributeBind class. The constructor signature is:
```
AttributeBind(sourceXpath: string, targetXpath: string, sourceAttribute: string, targetAttribute?: string, rootNode?: Node}
```

`targetAttribute` defaults to the same attribute as `sourceAttribute` and `rootNode` defaults to `document`. 

`rootNode` should be a node fit for setting up a `MutationObserver` for processing new nodes that may be created during the life of the page. `document` works, but it's best for performance if a closer element can be provided.
