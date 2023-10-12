import "../../sergiosgc/src/index";
import "../../query-elements/src/index";

declare global {
    interface Sergiosgc { 
        overlayDialog: (url: string, eventNameOrFactory: ((arg0: any, arg1: any) => CustomEvent)|string, eventDetail: any ) => void,
    }
}
class DialogWindow extends Window {
    closeDialog: () => void = () => {};
}
globalThis.sergiosgc.overlayDialog = function(
        url: string,
        eventNameOrFactory: ((arg0: any, arg1: any) => CustomEvent)|string,
        eventDetail: any ): void {
    const div = sergiosgc.queryElement('xpath:/html/body', document.documentElement)?.appendChild(document.createElement('DIV')) as HTMLElement;
    div.classList.add('overlay-dialog-overlay');
    const iframe = div.appendChild(document.createElement('IFRAME'));
    iframe.setAttribute("src", url);
    const closeDialog = function() {
        div.classList.remove("active");
        div.classList.add("inactive");
        window.setTimeout( () => div.parentNode?.removeChild(div), 200 );
    }
    div.addEventListener('click', (ev) => ev.target == div && closeDialog() );
    iframe.addEventListener("load", function(ev) {
        if (ev.target == null) return;
        if ((ev.target as HTMLIFrameElement).contentDocument?.querySelector('body.dialog')) {
            ((ev.target as HTMLIFrameElement).contentWindow as DialogWindow).closeDialog = closeDialog;
            return;
        }
        let pre = (ev.target as HTMLIFrameElement).contentDocument?.querySelector('body > pre');
        if (!pre) return;
        let json = JSON.parse((pre.firstChild as Text).wholeText);

        const newEvent = typeof(eventNameOrFactory) == "string"
            ? new CustomEvent(eventNameOrFactory, { bubbles: true, detail: {...eventDetail, ...{dialogResponse: json }} } )
            : eventNameOrFactory(json, eventDetail);
        iframe.ownerDocument.dispatchEvent(newEvent);
        closeDialog();
    });

    div.classList.add('active');
}