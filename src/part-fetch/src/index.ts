import "../../sergiosgc/src/index";
import "../../xpath-observer/src/index";

(function() {
    const observer = new sergiosgc.XPathObserver("//div[contains(concat(' ', @class, ' '), ' part-fetch ')]", document);
    observer.addEventListener("xpathobserver.node.new", function(ev: Event) {
        const customEvent = ev as CustomEvent;
        const partFetch = customEvent.detail.target;
        if (!partFetch) return;
        const src = partFetch.dataset.src;
        if (!src) return;

        const loadInto = (url: string): Promise<void> => {
            partFetch.classList.add("empty");
            partFetch.classList.add("loading");
            return fetch(url, {
                headers: { "Accept": "text/html" },
            }).then(response => response.text()).then(text => {
                partFetch.classList.remove("empty");
                partFetch.classList.remove("loading");
                partFetch.innerHTML = text;
            });
        };

        loadInto(src).catch(error => console.error(error));

        if (partFetch.getAttribute("data-capture-src")) {
            const srcAbsolute = new URL(src, location.href).href;
            window.navigation.addEventListener("navigate", function(ev: NavigateEvent) {
                if (!ev.canIntercept || ev.hashChange || ev.downloadRequest !== null) return;
                if (!ev.destination.url.startsWith(srcAbsolute)) return;
                ev.intercept({
                    handler: () => loadInto(ev.destination.url),
                });
            });
        }
    });
})();