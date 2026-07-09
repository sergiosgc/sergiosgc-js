import "../../call-on-load/src/index";

export default class XVerb {
    static verbParameter = 'x-verb';
    static acceptParameter = 'x-accept';
    static navigateHandler(ev: any) {
        const url = new URL(ev.destination.url);
        const method = url.searchParams.get(XVerb.verbParameter) ?? "GET";
        const accept = url.searchParams.get(XVerb.acceptParameter);
        if (method === 'GET' && !accept) return;
        url.searchParams.delete(XVerb.verbParameter);
        url.searchParams.delete(XVerb.acceptParameter);
        ev.intercept({
            handler: async () => {
                try {
                    let fetch_options: RequestInit = { method: method, redirect: 'follow' };
                    if (accept) {
                        fetch_options.headers = {
                            'Accept': accept
                        };
                    }
                    const response = await fetch(url, fetch_options);
                    let executeDefault = true;
                    if (method !== 'GET') {
                        executeDefault = executeDefault 
                        && document.dispatchEvent(new CustomEvent('x-verb-response', { bubbles: true, detail: response, cancelable: true }));
                    }
                    if (accept) {
                        executeDefault = executeDefault 
                        && document.dispatchEvent(new CustomEvent('x-accept-response', { bubbles: true, detail: response, cancelable: true }));
                    }
                    if (!executeDefault) return;
                    if (!response.ok) {
                        if (method !== 'GET') {
                            document.dispatchEvent(new CustomEvent('x-verb-response-error', { bubbles: true, detail: response }));
                        }
                        if (accept) {
                            document.dispatchEvent(new CustomEvent('x-accept-response-error', { bubbles: true, detail: response }));
                        }
                        return;
                    }
                    executeDefault = true;
                    if (method !== 'GET') {
                        executeDefault = executeDefault 
                        && document.dispatchEvent(new CustomEvent('x-verb-response-success', { bubbles: true, detail: response }));
                    }
                    if (accept) {
                        executeDefault = executeDefault 
                        && document.dispatchEvent(new CustomEvent('x-accept-response-success', { bubbles: true, detail: response }));
                    }
                    if (executeDefault) {
                        const contentDisposition = response.headers.get('Content-Disposition') || response.headers.get('content-disposition');
                        if (contentDisposition && contentDisposition.toLowerCase().includes('attachment')) {
                            const filenameMatch = contentDisposition.match(/filename[^;=\n]*=([^;]*)/i);
                            let filename = 'download';
                            if (filenameMatch && filenameMatch[1]) {
                                filename = filenameMatch[1].trim();
                                if (
                                    (filename.startsWith('"') && filename.endsWith('"')) ||
                                    (filename.startsWith("'") && filename.endsWith("'"))
                                ) {
                                    filename = filename.slice(1, -1);
                                }
                                if (filename.toLowerCase().startsWith("utf-8''")) {
                                    try {
                                        filename = decodeURIComponent(filename.slice(7));
                                    } catch (e) { /* fallback to original */ }
                                }
                            }
                            const blob = await response.blob();
                            const urlObject = window.URL.createObjectURL(blob);
                            const browser = window['browser' as any] as any;
                            if (typeof browser !== 'undefined' && browser.downloads && typeof browser.downloads.download === 'function') {
                                browser.downloads.download({
                                    url: urlObject,
                                    filename: filename,
                                    saveAs: true
                                }).then(() => {
                                    window.URL.revokeObjectURL(urlObject);
                                }).catch(() => {
                                    window.URL.revokeObjectURL(urlObject);
                                });
                            } else {
                                const a = document.createElement('a');
                                a.href = urlObject;
                                a.download = filename;
                                document.body.appendChild(a);
                                a.click();
                                setTimeout(() => {
                                    document.body.removeChild(a);
                                    window.URL.revokeObjectURL(urlObject);
                                }, 0);
                            }
                    
                            return;
                        }
         
                        if (response.redirected) {
                            window.location = new URL(response.url) as any;
                            return;
                        }
                    }
                } catch (error) {
                    console.error('Error:', error);
                }
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
