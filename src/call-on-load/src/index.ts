import "../../sergiosgc/src/index";

export default function callOnLoad(f: () => void) {
    if (document.readyState == "complete") {
        f();
    } else {
        window.addEventListener("load", f);
    }
}
declare global {
    interface Sergiosgc { 
        callOnLoad: typeof callOnLoad,
    }
}
globalThis.sergiosgc.callOnLoad = callOnLoad;