import "../../xpathresult-polyfill/src/index";
import "../../sergiosgc/src/index";

export default function assignToElement(targetElement: string | Element, mapping: Object) {
    if (targetElement instanceof String || "string" == typeof targetElement) {
        const targetElements = globalThis.sergiosgc.queryElements(targetElement);
        targetElements.forEach( element => assignToElement(element, mapping));
        return;
    }
    for (const [path, value] of Object.entries(mapping)) {
        if (path.substring(0, 6) == "css[]:" || path.substring(0,8) == "xpath[]:") {
            const localPath = path.replace( "[]", "" );
            let referenceElementsByParent: { parent: Element, nodes: Element[] }[] = [];
            Array.from( globalThis.sergiosgc.queryElements(localPath, targetElement) )
             .forEach( (elementToClone) => {
                for (let i=0; i<referenceElementsByParent.length; i++) {
                    if (referenceElementsByParent[i]['parent'] == elementToClone.parentElement) {
                        referenceElementsByParent[i]['nodes'].push( elementToClone );
                        return;
                    }
                }
                referenceElementsByParent.push( { parent: elementToClone.parentElement as Element, nodes: [ elementToClone ] });
            });
            referenceElementsByParent.forEach( referenceElement => referenceElement.nodes.slice(1).forEach( duplicateElement => duplicateElement.remove() ) );
            if (value.array.length == 0) {
                Array
                 .from( globalThis.sergiosgc.queryElements(localPath, targetElement) )
                 .forEach( referenceElement => {
                    if ("undefined" == typeof (referenceElement as any).sergiosgc) (referenceElement as any).sergiosgc = {};
                    if ("undefined" == typeof (referenceElement as any).sergiosgc['visible-display']) (referenceElement as any).sergiosgc['visible-display'] = window.getComputedStyle(referenceElement).display;
                 });
            } else {
                Array
                 .from( globalThis.sergiosgc.queryElements(localPath, targetElement) )
                 .forEach( referenceElement => {
                    if ("undefined" != typeof (referenceElement as any).sergiosgc && 
                        "undefined" != typeof (referenceElement as any).sergiosgc['visible-display']) referenceElement.style.display = (referenceElement as any).sergiosgc['visible-display'];
                    value.array
                     .forEach( (data: any) => {
                        let hydratedMapping: { [key: string]: any } = {};
                        for (const [mappingKey, mappingExpression] of Object.entries( value.mapping )) {
                            if ("string" == typeof mappingExpression) {
                                hydratedMapping[mappingKey] = resolveMappingExpression(mappingExpression, data);
                            } else {
                                hydratedMapping[mappingKey] = {
                                    array: resolveMappingExpression((mappingExpression as any)['array'], data),
                                    mapping: (mappingExpression as any)['mapping']
                                };
                            }
                        }
                        let clonedElement = referenceElement.cloneNode(true);
                        referenceElement.parentNode?.insertBefore(clonedElement, referenceElement);
                        assignToElement(clonedElement as HTMLElement, hydratedMapping);
                     });
                     referenceElement.remove();
                 });
            }
        } else {
            globalThis.sergiosgc.queryElements(path, targetElement).forEach( element => {
                element.innerHTML = value;
            })
        }
    }
}
function resolveMappingExpression(expression: string, data: Object): any {
    if ("." != expression[0]) throw new Error("Mapping expression should start with a dot (.)");
    let [_ignore, currentIndex, remainder] = expression.match(/^\.([^.]*)(.*)/) as [string, string, string];
    if ("undefined" == typeof (data as any)[currentIndex]) return undefined;
    if ("undefined" == typeof remainder || remainder == "") return (data as any)[currentIndex];
    return resolveMappingExpression(remainder, (data as any)[currentIndex])
}
declare global {
    interface Sergiosgc { 
        assignToElement: typeof assignToElement,
    }
}
globalThis.sergiosgc.assignToElement = assignToElement;