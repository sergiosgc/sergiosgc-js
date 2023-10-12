import "./../../xpathresult-polyfill/src/index";

export default class XPathObserver extends EventTarget {
    xPath: string;
    rootNode: Node;
    observer: MutationObserver;
    nodes: Node[] = [];

    constructor(xPath: string, rootNode: Node|null = null) {
        super();
        this.xPath = xPath;
        this.rootNode = rootNode ?? document;
        this.observer = new MutationObserver(this.handleDocumentMutated.bind(this));
        this.observer.observe(this.rootNode, { attributes: true, childList: true, subtree: true });
        if (document.readyState == "complete") this.handleDocumentMutatedNewNodes(); else window.addEventListener("load", this.handleDocumentMutatedNewNodes.bind(this))
    }
    handleDocumentMutated(mutations: MutationRecord[], _observer: MutationObserver) {
        let handleNewNodes = false;
        let handleDeletedNodes = false;
        for (var mutation of mutations) {
            handleNewNodes ||= mutation.type == "attributes" || mutation.addedNodes.length > 0;
            handleDeletedNodes ||= mutation.type == "attributes" || mutation.removedNodes.length > 0;
        }
        if (handleNewNodes) this.handleDocumentMutatedNewNodes();
        if (handleDeletedNodes) this.handleDocumentMutatedDeletedNodes();
    }
    handleDocumentMutatedNewNodes() {
        Array
            .from(document.evaluate(this.xPath, this.rootNode))
            .filter( n => !this.nodes.includes(n))
            .forEach( n => {
                this.nodes.push(n)
                this.dispatchEvent(new CustomEvent("xpathobserver.node.new", { "detail": { "target": n }}))
            })
    }
    handleDocumentMutatedDeletedNodes() {
        const matchingNodes = Array.from(document.evaluate(this.xPath, this.rootNode));
        const deletedNodes = this.nodes.filter( n => !matchingNodes.includes(n) )
        this.nodes = this.nodes.filter( n => !deletedNodes.includes(n) )
        deletedNodes.forEach( n => {
            this.dispatchEvent(new CustomEvent("xpathobserver.node.deleted", { "detail": { "target": n }}))
        })
    }
}
declare global {
    interface Sergiosgc { 
        XPathObserver: typeof XPathObserver,
    }
}
globalThis.sergiosgc.XPathObserver = XPathObserver;