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
                    focusReset: "manual",
                    scroll: "manual",
                });
            });
        }
    });
})();
(function() {
    const observer = new sergiosgc.XPathObserver("//a[contains(concat(' ', @class, ' '), ' sergiosgc-inplace ')]", document);
    observer.addEventListener("xpathobserver.node.new", function(ev: Event) {
        const customEvent = ev as CustomEvent;
        const anchor = customEvent.detail.target;
        if (!anchor) return;
        anchor.addEventListener("click", function(ev: Event) {
            const anchor = ev.target as HTMLAnchorElement;
            const href = anchor.getAttribute("href");
            if (!href) return;
            ev.preventDefault();
            const loadInto = (url: string): Promise<void> => {
                anchor.classList.add("loading");
                return fetch(url, {
                    headers: { "Accept": "text/html" },
                }).then(response => response.text()).then(text => {
                    const div = document.createElement("div");
                    anchor.classList.remove("loading");
                    div.setAttribute("class", anchor.getAttribute("class") ?? "");
                    div.innerHTML = text;
                    anchor.replaceWith(div);
                });
            };
            loadInto(href).catch(error => console.error(error));
        });
    });
})();