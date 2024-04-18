import "../../xpathresult-polyfill/src/index";

export default function queryElements(path: String, rootNode: Element | null = null) : Array<HTMLElement> {
    if (rootNode == null) { rootNode = document.documentElement; }
    if (path.substring(0, 4) == "css:") return Array.from(rootNode.querySelectorAll(path.substring(4)));
    if (path.substring(0, 6) == "xpath:") return Array.from(document.evaluate(path.substring(6), rootNode as Element));
    throw new Error("path must begin with either css: or xpath:");
}
declare global {
    interface Sergiosgc { 
        queryElements: typeof queryElements,
        queryElement: (expression: string, referenceNode: Element | null) => HTMLElement | null,
    }
}
globalThis.sergiosgc.queryElements = queryElements;
globalThis.sergiosgc.queryElement = (expression: string, referenceNode: Element | null = null) => queryElements(expression, referenceNode)[0] ?? null;
declare global {
    interface Element { 
        queryElements: (expression: string) => Array<HTMLElement>, 
        queryElement: (expression: string) => HTMLElement | null,
    }
}
Element.prototype.queryElements = function(expression: string) : Array<HTMLElement> { return globalThis.sergiosgc.queryElements(expression, this ); }
Element.prototype.queryElement = function(expression: string) : HTMLElement | null { return globalThis.sergiosgc.queryElement(expression, this ); }