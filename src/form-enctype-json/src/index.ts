import "../../sergiosgc/src/index";
import "../../mutation-event-attacher/src/index";

(function() {
    const formDataToJsonType = function(form: HTMLFormElement, value: FormDataEntryValue, key: string) {
        let jsonType = "string";
        const formItem = form.elements.namedItem(key);
        if (formItem instanceof Element) {
            const sergiosgcEnc = formItem.getAttribute('sergiosgc-enc');
            if (sergiosgcEnc) jsonType = sergiosgcEnc;
        } else if (formItem instanceof NodeList) {
            const sergiosgcEnc = Array.from(formItem).map(item => item.getAttribute('sergiosgc-enc')).find(enc => enc !== null);
            if (sergiosgcEnc) jsonType = sergiosgcEnc;
        }
        const isArray = jsonType.endsWith('[]');
        if (isArray) {
            const parts = value.toString().split(',');
            return parts.map(part => {
                switch (jsonType.slice(0, -2)) {
                    case "boolean": return part === "true";
                    case "integer": return parseInt(part as string);
                    case "float": return parseFloat(part as string);
                    default: return part as string;
                }
            });
        } else {
            if (jsonType !== "string" && value == "") {
                return null;
            }
            switch (jsonType) {
                case "boolean": return value === "true";
                case "integer": return parseInt(value as string);
                case "float": return parseFloat(value as string);
                default: return value as string;
            }
        }
    }
    const convertFormToJson = function(ev: SubmitEvent) {
        const form = ev.target as HTMLFormElement;
        const formData = new FormData(form);
        const json: any = {};
        ev.preventDefault();
        ev.stopPropagation();
        for (const [key, value] of formData.entries()) {
            if (key.endsWith('[]') && key.slice(0, -2).indexOf('[]') !== -1) {
                throw new Error(`Unable to insert key ${key}, because it contains multiple nested arrays`);
            }
            if (key === "") {
                throw new Error(`Unable to insert key ${key}, because it is empty`);
            }
            let cursor = json;
            let partialKey = '';
            let keyParts = key.split('.');
            let lastKeyPart = keyParts.pop();
            if (!lastKeyPart) {
                throw new Error(`Unable to insert key ${key}, because it is empty`); // Actually impossible because of the empty string check above
            }
            for (let part of keyParts) {
                partialKey += (partialKey ? '.' : '') + part;
                if (!cursor[part]) {
                    cursor[part] = {};
                } else if (typeof cursor[part] !== 'object') {
                    throw new Error(`Unable to insert key ${partialKey}, because current entry is not a dictionary: ${cursor[part]}`);
                }
                cursor = cursor[part];
            }
            cursor[lastKeyPart as any] = formDataToJsonType(form, value, key);
        }

        const url = form.getAttribute('action') ?? (window.location.href as string);
        const method = form.getAttribute('method') ?? 'POST';
        fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(json),
            redirect: "manual"
        })
        .then(async (response) => {
            if (response.type === "opaqueredirect" || (response.status >= 300 && response.status < 400 && response.headers.has('Location'))) {
                const location = response.headers.get("Location") ?? url;
                (window.location as any) = location;
                return;
            }
            try {
                const responseData = await response.json();
                form.dispatchEvent(new CustomEvent('form-enctype-json-response', { bubbles: true, detail: responseData }));
            } catch (_) {
                console.error(`HTTP error: ${response.status} ${response.statusText}`);
            }
        })
        .catch(err => {
            console.error('Failed to submit JSON form:', err);
        });
    };

    new globalThis.sergiosgc.MutationEventAttacher(
        document.documentElement,
        'xpath://form[@enctype="application/json"]',
        'submit',
        convertFormToJson as any
    );

})();