import "./../../xpathresult-polyfill/src/index";

export default class AttributeBind {
    sourceXpath: string;
    targetXpath: string;
    sourceAttribute: string;
    targetAttribute: string;
    rootNode: Node;
    observer: MutationObserver;
    nodes: Node[] = [];
    constructor(args: {
        sourceXpath: string,
        targetXpath: string, 
        sourceAttribute: string, 
        targetAttribute?: string, 
        rootNode?: Node}) {
        
        this.sourceXpath = args.sourceXpath;
        this.targetXpath = args.targetXpath;
        this.sourceAttribute = args.sourceAttribute;
        this.targetAttribute = args.targetAttribute ?? args.sourceAttribute;
        this.rootNode = args.rootNode ?? document;
        this.observer = new MutationObserver(this.handleAttributeChange.bind(this));
        const liveAttachObserver = new MutationObserver(this.attachSubsequentObservers.bind(this));
        liveAttachObserver.observe(this.rootNode, { subtree: true, childList: true, attributes: false});

        if (document.readyState == "complete") this.attachInitialObservers(); else window.addEventListener("load", this.attachInitialObservers.bind(this))
    }
    attachInitialObservers() {
        Array.from(document.evaluate(this.sourceXpath, this.rootNode)).forEach(this.attachObserver.bind(this));
    }
    attachSubsequentObservers(mutations: MutationRecord[], _observer: MutationObserver) {
        const validTargets = Array.from(document.evaluate(this.sourceXpath, this.rootNode));
        mutations.map(mutation => Array.from(mutation.addedNodes)).flat().filter( node => !this.nodes.includes(node) && validTargets.includes(node) ).map( this.attachObserver.bind(this) );
        mutations.map(mutation => Array.from(mutation.removedNodes)).flat().filter( node => this.nodes.includes(node) ).map( node => {
            this.nodes = this.nodes.filter( n => n != node );
        });
    }
    attachObserver(node: Node) {
        if (this.nodes.includes(node)) return;
        this.nodes.push(node);
        this.observer.observe(node, { attributeFilter: [ this.sourceAttribute ]});
        const targets = Array.from(document.evaluate(this.targetXpath, this.rootNode));
        targets
            .filter( target => { typeof(target[this.targetAttribute]) != 'function' } )
            .filter( target => target.getAttribute(this.targetAttribute) != (node as Element).getAttribute(this.sourceAttribute) )
            .forEach( target => target
                .setAttribute(this.targetAttribute, (node as Element).getAttribute(this.sourceAttribute)) 
            );
        targets
            .filter( target => typeof(target[this.targetAttribute]) == 'function' )
            .forEach( target => target[this.targetAttribute]( (node as Element).getAttribute(this.sourceAttribute) ) );
    }
    handleAttributeChange(mutations: MutationRecord[], _observer: MutationObserver) {
        const targets = Array.from(document.evaluate(this.targetXpath, this.rootNode));
        mutations
            .filter( m => m.attributeName != null )
            .forEach( mutation => targets
                .filter( target => typeof(target[this.targetAttribute]) != 'function' )
                .filter( target => target.getAttribute(this.targetAttribute) != (mutation.target as Element).getAttribute(this.sourceAttribute) )
                .forEach( target => target
                    .setAttribute(this.targetAttribute, (mutation.target as Element).getAttribute(this.sourceAttribute)) 
                )
            );
        mutations
            .filter( m => m.attributeName != null )
            .forEach( mutation => targets
                .filter( target => typeof(target[this.targetAttribute]) == 'function' )
                .forEach( target => target[this.targetAttribute]( (mutation.target as Element).getAttribute(this.sourceAttribute) ) )
            );
    }
}
declare global {
    interface Sergiosgc { 
        AttributeBind?: typeof AttributeBind, 
    }
}
window.sergiosgc.AttributeBind = AttributeBind;