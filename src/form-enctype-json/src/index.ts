import "../../sergiosgc/src/index";
import "../../mutation-event-attacher/src/index";

(function() {
    const stringToStringArray = function(value: string) {
        return value.split(/[\n\t\r]+/).filter((item) => item.trim() !== "");
    }
    const stringToIntegerArray = function(value: string) {
        return value.split(/[,]+/).filter((item) => item.trim() !== "").map(item => parseInt(item));
    }
    const stringToJson = function(value: string) {
        try {
            if (value == "") return null;
            return JSON.parse(value);
        } catch (error) {
            console.error("Invalid JSON value for form-enctype-json: ", value, error);
            return null;
        }
    }
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
            if (value.toString().trim() === "") {
                return [];
            }
            const parts = value.toString().split(',');
            return parts.map(part => {
                switch (jsonType.slice(0, -2)) {
                    case "boolean": return part === "true";
                    case "integer": return parseInt(part as string);
                    case "float": return parseFloat(part as string);
                    case "string_to_string_array": return stringToStringArray(part as string);
                    case "string_to_integer_array": return stringToIntegerArray(part as string);
                    case "json": return stringToJson(value as string);
                    default: return part as string;
                }
            });
        } else {
            if (value == "" && (["boolean", "integer", "float"].includes(jsonType) || /_nullonempty/.test(jsonType))) {
                return null;
            }
            switch (jsonType) {
                case "boolean": return value === "true";
                case "integer": return parseInt(value as string);
                case "float": return parseFloat(value as string);
                case "string_to_string_array": return stringToStringArray(value as string);
                case "string_to_integer_array": return stringToIntegerArray(value as string);
                case "json": return stringToJson(value as string);
                default: return value as string;
            }
        }
    }
    const convertFormToJson = function(ev: SubmitEvent) {
        const form = ev.target as HTMLFormElement;
        try {
            const acceptMediaType = form.getAttribute('accept') ?? 'application/json';
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
            const jsonSubmitEvent = new CustomEvent('form-enctype-json-submit', { 
                bubbles: true,
                cancelable: true,
                detail: {
                    url: url,
                    method: method,
                    json: json
            } });
            const runDefault = form.dispatchEvent(jsonSubmitEvent);
            if (!runDefault) return;
            fetch(jsonSubmitEvent.detail.url, {
                method: jsonSubmitEvent.detail.method,
                headers: {
                    "Content-Type": "application/json",
                    "Accept": acceptMediaType
                },
                body: JSON.stringify(jsonSubmitEvent.detail.json),
                redirect: "manual"
            })
            .then(async (response) => {
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
                if (response.type === "opaqueredirect" || (response.status >= 300 && response.status < 400 && response.headers.has('Location'))) {
                    const location = response.headers.get("Location") ?? url;
                    (window.location as any) = location;
                    return;
                }
                try {
                    const responseData = await response.json();
                    form.dispatchEvent(new CustomEvent('form-enctype-json-response', { bubbles: true, detail: {
                        status: response.status,
                        data: responseData
                    } }));
                } catch (error) {
                    const runDefault = form.dispatchEvent(new CustomEvent('form-enctype-json-response-error', { 
                        bubbles: true,
                        cancelable: true,
                        detail: {
                            response: response,
                            error: error
                        }
                    }));
                    if (!runDefault) return;
                    console.error(`HTTP error: ${response.status} ${response.statusText}`);
                }
            })
            .catch(err => {
                const runDefault = form.dispatchEvent(new CustomEvent('form-enctype-json-request-error', { 
                    bubbles: true,
                    cancelable: true,
                    detail: {
                        error: err
                    }
                }));
                if (!runDefault) return;
                console.error('Failed to submit JSON form:', err);
            });
        } catch (error) {
            const runDefault = form.dispatchEvent(new CustomEvent('form-enctype-json-request-error', { 
                bubbles: true,
                cancelable: true,
                detail: {
                    error: error
                }
            }));
            if (!runDefault) return;
            console.error('Failed to submit JSON form:', error);
        }
    }

    new globalThis.sergiosgc.MutationEventAttacher(
        document.documentElement,
        'xpath://form[@enctype="application/json"]',
        'submit',
        convertFormToJson as any
    );

})();
