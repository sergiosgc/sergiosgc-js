import "../../query-elements/src/index";
import "../../sergiosgc/src/index";

export default class DragAndDropHelper {
    rootElement: Element;
    draggableSelector: string;
    droppableSelector: string;
    transferDataCallback: (arg0: Node, arg1: Event) => any;
    eventNameOrCallback: string | ((arg0: Node, arg1: Event) => string | CustomEvent);
    validDropTargetCallback: (arg0: Node, arg1: Event) => boolean;
    hoverClass: string;
    onDragClass: string;
    constructor(rootElement: Element, 
                draggableSelector: string,
                droppableSelector: string,
                transferDataCallback: ((arg0: Node, arg1: Event) => any)|null,
                eventNameOrCallback: string | ((arg0: Node, arg1: Event) => string|CustomEvent) | null,
                validDropTargetCallback: ((arg0: Node, arg1: Event) => boolean)|null,
                hoverClass: string|null,
                onDragClass: string|null) {
        if (typeof (transferDataCallback) == "undefined" || transferDataCallback == null) transferDataCallback = function () { return null; };
        if (typeof (eventNameOrCallback) == "undefined" || eventNameOrCallback == null) eventNameOrCallback = "draganddrop";
        if (typeof (validDropTargetCallback) == "undefined" || validDropTargetCallback == null) validDropTargetCallback = function () { return true; };
        if (typeof (hoverClass) == "undefined" || hoverClass == null) hoverClass = "drophover";
        if (typeof (onDragClass) == "undefined" || onDragClass == null) onDragClass = "draganddropactive";
        this.rootElement = rootElement;
        this.draggableSelector = draggableSelector;
        this.droppableSelector = droppableSelector;
        this.transferDataCallback = transferDataCallback;
        this.eventNameOrCallback = eventNameOrCallback;
        this.validDropTargetCallback = validDropTargetCallback;
        this.hoverClass = hoverClass;
        this.onDragClass = onDragClass;
        new sergiosgc.MutationEventAttacher(rootElement, draggableSelector, "drag", this.drag.bind(this) as (arg0: Event) => void);
        new sergiosgc.MutationEventAttacher(rootElement, draggableSelector, "dragstart", this.dragstart.bind(this) as (arg0: Event) => void);
        new sergiosgc.MutationEventAttacher(rootElement, draggableSelector, "dragend", this.dragend.bind(this) as (arg0: Event) => void);
        new sergiosgc.MutationEventAttacher(rootElement, droppableSelector, "dragover", this.dragover.bind(this) as (arg0: Event) => void);
        new sergiosgc.MutationEventAttacher(rootElement, droppableSelector, "dragenter", this.dragenter.bind(this) as (arg0: Event) => void);
        new sergiosgc.MutationEventAttacher(rootElement, droppableSelector, "dragleave", this.dragleave.bind(this) as (arg0: Event) => void);
        new sergiosgc.MutationEventAttacher(rootElement, droppableSelector, "drop", this.drop.bind(this) as (arg0: Event) => void);
    }
    normalizeTarget(target: HTMLElement): HTMLElement|null {
        const valid = sergiosgc.queryElements(this.draggableSelector, this.rootElement).concat(sergiosgc.queryElements(this.droppableSelector, this.rootElement));
        let cursor: HTMLElement|null = target;
        while (cursor && !valid.includes(cursor)) cursor = cursor.parentNode ? cursor.parentNode as HTMLElement : null;
        return cursor;
    }
    dragover(ev: DragEvent): void {
        if (ev.target == null) return;
        let target = this.normalizeTarget(ev.target as HTMLElement);
        if (!target) return;
        if (this.validDropTargetCallback(target, ev)) ev.preventDefault();
    }
    dragenter(ev: DragEvent) {
        if (ev.target == null) return;
        let target = this.normalizeTarget(ev.target as HTMLElement);
        if (!target) return;
        if (!this.validDropTargetCallback(target, ev)) return;
        target.classList.add(this.hoverClass);
    }
    dragleave(ev: DragEvent) {
        if (ev.target == null) return;
        let target = this.normalizeTarget(ev.target as HTMLElement);
        if (!target) return;
        if (!this.validDropTargetCallback(target, ev)) return;
        target.classList.remove(this.hoverClass);
    }
    drop(ev: DragEvent) {
        if (ev.target == null) return;
        let target = this.normalizeTarget(ev.target as HTMLElement);
        if (!target) return;
        if (!this.validDropTargetCallback(target, ev)) return;
        target.classList.remove(this.hoverClass);
        if (typeof (this.eventNameOrCallback) == "string") {
            target.dispatchEvent( new CustomEvent(this.eventNameOrCallback, { bubbles: true, detail: JSON.parse(ev.dataTransfer?.getData('application/json') ?? "") }) );
        } else {
            const eventName: string|CustomEvent = this.eventNameOrCallback(target, ev);
            if ("string" == typeof eventName) {
                if (eventName) target.dispatchEvent( new CustomEvent("eventName", { bubbles: true, detail: JSON.parse(ev.dataTransfer?.getData('application/json') ?? "") }) );
            } else {
                target.dispatchEvent( eventName );
            }
        }
        ev.preventDefault();
    }
    drag(ev: DragEvent) {
        if (ev.target == null) return;
    }
    dragstart(ev: DragEvent) {
        if (ev.target == null) return;
        this.rootElement.classList.add(this.onDragClass);
        ev.dataTransfer?.setData('application/json', JSON.stringify(this.transferDataCallback(ev.target as Node, ev)));
    }
    dragend(ev: DragEvent) {
        this.rootElement.classList.remove(this.onDragClass);
    }
}
declare global {
    interface Sergiosgc { 
        DragAndDropHelper: typeof DragAndDropHelper,
    }
}
globalThis.sergiosgc.DragAndDropHelper = DragAndDropHelper;
