import "../../call-on-load/src/index";

export default class XVerb {
    static verbParameter = 'x-verb';
    static navigateHandler(ev: any) {
        const url = new URL(ev.destination.url);
        const method = url.searchParams.get(XVerb.verbParameter);
        if (!method || method === 'GET') return;
        url.searchParams.delete(XVerb.verbParameter);
        ev.intercept({
            handler: async () => {
              const response = await fetch(url, { method: method });
              let executeDefault = document.dispatchEvent(new CustomEvent('x-verb-response', { bubbles: true, detail: response, cancelable: true }));
              if (!executeDefault) return;
              if (!response.ok) {
                document.dispatchEvent(new CustomEvent('x-verb-response-error', { bubbles: true, detail: response }));
                return;
              }
              if (response.redirected) {
                window.location = new URL(response.url) as any;
                return;
              }
              document.dispatchEvent(new CustomEvent('x-verb-response-success', { bubbles: true, detail: response }));
            }
          });
    }
    static init() {
        const navigation = window['navigation'] as any;
        navigation.addEventListener('navigate', XVerb.navigateHandler);
    }
}
declare global {
    interface Sergiosgc { 
        XVerb: typeof XVerb,
    }
}
globalThis.sergiosgc.XVerb = XVerb;

globalThis.sergiosgc.callOnLoad(XVerb.init);
