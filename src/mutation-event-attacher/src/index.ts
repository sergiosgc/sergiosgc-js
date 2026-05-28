import "../../sergiosgc/src/index";
import "../../call-on-load/src/index";

export default class MutationEventAttacher {
    rootNode: Element;
    xpathOrSelector: string;
    eventName: string;
    handlerFunction: (arg0: Event) => void;
    targets: HTMLElement[] = [];
    options: boolean | AddEventListenerOptions;
    constructor(rootNode: Element,
                xpathOrSelector: string,
                eventName: string,
                handlerFunction: ((arg0: Event) => void), 
                options?: boolean | AddEventListenerOptions
            ) {
        this.rootNode = rootNode;
        this.xpathOrSelector = xpathOrSelector;
        this.eventName = eventName;
        this.handlerFunction = handlerFunction;
        this.options = options ?? false;
        sergiosgc.callOnLoad(this.init.bind(this));
    }
    init() {
        this.targets = sergiosgc.queryElements(this.xpathOrSelector, this.rootNode);
        this.targets.forEach( (target) => target.addEventListener(this.eventName, this.handlerFunction, this.options) );
        const observer = new MutationObserver(this.mutationCallback.bind(this));
        observer.observe(this.rootNode, { 
            childList: true,
            attributes: true,
            subtree: true
        })
    }
    mutationCallback() {
        let matchingNodes = sergiosgc.queryElements(this.xpathOrSelector, this.rootNode);
        let deletedTargets = this.targets.filter( (target) => !matchingNodes.includes(target) );
        let newTargets = matchingNodes.filter( (target) => !this.targets.includes(target) );
        deletedTargets.forEach( (target) => target.removeEventListener(this.eventName, this.handlerFunction));
        newTargets.forEach( (target) => target.addEventListener(this.eventName, this.handlerFunction) );
        this.targets = this.targets.concat(newTargets).filter( (target) => !deletedTargets.includes(target) );
    }
}
declare global {
    interface Sergiosgc { 
        MutationEventAttacher: typeof MutationEventAttacher,
    }
}
globalThis.sergiosgc.MutationEventAttacher = MutationEventAttacher;