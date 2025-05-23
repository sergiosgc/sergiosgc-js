# sergiosgc-js/drag-and-drop-helper

Simplified drag and drop in HTML/Javascript

DragAndDropHelper assumes an opinionated approach to drag and drop operations in an HTML document:
 - You have a set of draggable elements that can be described by an xpath or css expression;
 - You have a set of candidate drop targets that can be described by an xpath or css expression, and further rejected by an evaluation in presence of the transfer data;
 - The data to be transferred by drag and drop is available when dragging starts, and can be JSON encoded;
 - You don't want to react to events while dragging, other than setting classes on the dragged element and hovered drop targets;

# Usage

Selector expressions are queryElements expressions. Check the relevant documentation in this repo.

Instantiate `globalThis.sergiosgc.DragAndDropHelper` with these arguments:
 - rootNode: The rootNode from where to evaluate the following two arguments;
 - draggableSelector: A queryElements expression that results in the elements that can be dragged;
 - droppableSelector: A queryElements expression that results in the elements that _may_ be drop targets (further refined by validDropTargetCallback)
 - transferDataCallback: A function that returns the transfer data as any type that can be JSON encoded. It will be called when drag starts and receives two arguments:
   - An element, the target of the drag start event;
   - The drag start event (DragEvent type)

   It may be null, meaning no data is transferred.
 - eventNameOrCallback: Either a string with the name of the CustomEvent to be emited, or a callback. If null, the default is "dragandrop". The callback function should return either a string (the event name), or a CustomEvent instance. It gets passed, as arguments:
   - The drop event target, an HTMLElement;
   - The drop event, a DragEvent.
   If null, defaults to `draganddrop`;
 - validDropTargetCallback: A callback, returning true if a target is a valid drop target, false otherwise. It gets passed, as arguments:
   - The target to be evaluated, an HTMLElement;
   - The DragEvent that originated the query.
   If null, no candidate drop targets are ever rejected;
 - hoverClass: Class to be assigned to valid drop targets being hovered. null if class setting is not required;
 - onDragClass: Class to be assigned to elements being dragged. null if class setting is not required;

When the whole drag and drop completes, a CustomEvent will be fired from the drop target. Listen to the event. The event `detail` property contains the transferred data (actually parsed data, not a JSON string).
