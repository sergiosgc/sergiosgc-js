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
    }
}
globalThis.sergiosgc.queryElements = queryElements;