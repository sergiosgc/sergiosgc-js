import "../../sergiosgc/src/index";
import "../../mutation-event-attacher/src/index";

(function() {
    new globalThis.sergiosgc.MutationEventAttacher(
        document.documentElement,
        "css:form.sooma-form",
        'form-enctype-json-response',
        function (event: Event) {
            const ev = event as CustomEvent<{status: number, data: any}>;
            const form = ev.target as HTMLFormElement;
            if (ev.detail.data.success) {
                let successUrl = form.getAttribute('success-url');
                if (successUrl) {
                    const replacement_regex = /(?<pre>^|[^{]){(?<var>(?:[^{}]|}}|{{)*)}/g;
                    (window.location as any).href = successUrl.replaceAll(replacement_regex, (...args) => {
                        const groups = args.pop() as Record<string, string>;
                        const value = ev.detail.data.data[groups.var] ?? groups.var;
                        return groups.pre + value;
                    });
                    event.stopPropagation();
                    event.preventDefault();
                }
            } else {
                if (ev.detail.data.error.code == "ValidationFailed") {
                    for (const [key, value] of Object.entries(ev.detail.data.data.validations)) {
                        const errorString = (value as string[]).join("\n");
                        const control = form.elements.namedItem(key) as HTMLFormElement;
                        if (!control) continue;
                        control.setCustomValidity(errorString);
                        control.setAttribute('data-server-supplied-validation', 'true');
                        form.reportValidity();
                    }
                    event.stopPropagation();
                    event.preventDefault();
                }
            }
        }
    );
})();
