import "../../xpathresult-polyfill/src/index";

declare global {
    interface Element { 
        templateNode: (deep: boolean, assignments: { [path: string]: string|string[]|null }) => Element,
    }
}
Element.prototype.templateNode = function(deep: boolean, assignments: { [path: string]: string[]|null|string }): Element {
    let result = this.cloneNode(deep) as Element;
    result.removeAttributeNS(null, "id");
    for (const [path, value] of Object.entries(assignments)) {
        let match;
        if (match = path.match(/^xpath:(?<pre>.*)\/@(?<attribute>[A-Za-z_][-A-Za-z0-9.]*)$/)) {
            if (!match.groups) throw new Error("Invalid expression: " + path);
            let pre = match.groups.pre;
            let attribute = match.groups.attribute;
            if (pre == "") pre = "/";
            if (value == null) {
                sergiosgc.queryElements("xpath:" + pre, result).forEach( (elm: Element) => elm.removeAttribute(attribute));
            } else if (typeof(value) == "object" && attribute == "class") {
                sergiosgc.queryElements("xpath:" + pre, result).forEach( (elm: Element) => Object.entries(value).forEach( ([_key, classVal]) => elm.classList.add(classVal)) );
            } else if (typeof(value) == "object" && attribute == "style") {
                sergiosgc.queryElements("xpath:" + pre, result).forEach( (elm: HTMLElement) => {
                    for (const [styleKey, styleValue] of Object.entries(value)) elm.style.setProperty(styleKey, styleValue);
                });
            } else {
                sergiosgc.queryElements("xpath:" + pre, result).forEach( (elm: Element) => elm.setAttributeNS(null, attribute, value as string));
            }
            continue;
        }
        sergiosgc.queryElements(path, result).forEach( (node) => {
            if (node.nodeType == Node.ELEMENT_NODE) {
                while (node.firstChild) node.removeChild(node.firstChild);
                if (typeof(value) == "string") {
                    node.appendChild(document.createTextNode(value)); 
                } else if (value) node.appendChild(document.createTextNode(value.join('')));
            }
        });
    }
    return result;
}