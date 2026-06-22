import XPathObserver from "../../xpath-observer/src/index";

export default class FetchPipeline {
    private form: HTMLFormElement;
    private source_url: string;
    private source_url_params: string[];
    private extraction_function: (data: any) => any;
    private sink_function: (data: any) => any;
    private quiescense_stamp: number|null = null;
    constructor(form: HTMLFormElement, source_url: string, extraction_function: (data: any) => any, sink_function: (data: any) => any) {
        const extractParams = (url: string): string[] => {
            const paramNames: string[] = [];
            // Regex explanation:
            // (?<!{)     - Negative lookbehind to make sure the { is not preceded by another {
            // {          - a literal {
            // ([^{}]+)   - capture one or more chars except braces (the param name)
            // }          - a literal }
            // (?!})      - Negative lookahead to make sure the } is not followed by another }
            const regex = /(?<!{){([^{}]+)}(?!})/g;
            let match;
            while ((match = regex.exec(url)) !== null) {
                paramNames.push(match[1]);
            }
            return paramNames;
        };
        this.form = form;
        this.source_url = source_url;
        this.source_url_params = extractParams(source_url);
        this.extraction_function = extraction_function;
        this.sink_function = sink_function;
        this.load_data_quiescent(null);
        this.source_url_params.forEach(param => {
            const form_element = this.form.elements[param as any] as any;
            if (!form_element) {
                console.warn("FetchPipeline: Form element not found: ", param);
                return;
            }
            form_element.addEventListener("change", this.load_data_quiescent.bind(this, null));
        });
    }
    private load_data_quiescent(quiescense_stamp: number|null) {
        if (quiescense_stamp === null) {
            this.quiescense_stamp = Math.floor(Math.random() * 1000000);
            window.setTimeout(this.load_data_quiescent.bind(this, this.quiescense_stamp), 50);
        } else if (quiescense_stamp === this.quiescense_stamp) {
            this.quiescense_stamp = null;
            this.load_data();
        }
    }
    private load_data() {
        let url = this.source_url;
        for (let i=0;i<this.source_url_params.length;i++) {
            const form_element = this.form.elements[this.source_url_params[i] as any] as any;
            if (!form_element) {
                console.warn("FetchPipeline: Form element not found: ", this.source_url_params[i]);
                continue;
            }
            url = url.replace(`{${this.source_url_params[i]}}`, form_element.value ?? '');
        }
        url = url.replace(/{{/g, '{').replace(/}}/g, '}');
        fetch(url, {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            }
        )
            .then(response => response.json())
            .then(data => {
                this.sink_function(this.extraction_function(data));
            })
            .catch(error => console.error("FetchPipeline: Error loading data from ", this.source_url, error));
    }
    private static extractDataFromAttributeSyntax(prefix: string[], fields: string[], data: any): any {
        if (prefix.length == 0) {
            return fields.map(field => data[field]);
        }
        if (Array.isArray(data[prefix[0]]) && prefix.length > 1) {
            return data[prefix[0]].map((item: any) => FetchPipeline.extractDataFromAttributeSyntax(prefix.slice(1), fields, item)).flat(2);
        }
        if (Array.isArray(data[prefix[0]])) {
            return data[prefix[0]].map((item: any) => FetchPipeline.extractDataFromAttributeSyntax(prefix.slice(1), fields, item));
        }
        return FetchPipeline.extractDataFromAttributeSyntax(prefix.slice(1), fields, data[prefix[0]]);
    }
    public static attachToElement(element: HTMLElement) {
        const sink_function_parse = (sink_function_str: string, element: HTMLElement): null|((data: any) => any) => {
            let sink_function: any = null;
            let sink_function_parts = sink_function_str.split('.');
            let index = 0;
            if (sink_function_parts[0] == 'this') {
                sink_function = element;
            } else {
                sink_function = window[sink_function_parts[0] as any];
            }
            index++;
            while (index < sink_function_parts.length) {
                if (typeof(sink_function) == 'undefined') {
                    console.error("FetchPipeline: Sink function not found: ", sink_function_parts.slice(0, index-1).join('.'));
                    return null;
                }
                sink_function = sink_function[sink_function_parts[index]];
                index++;
            }
            if (typeof(sink_function) != 'function') {
                console.error("FetchPipeline: Sink function is not a function. It is a ", typeof(sink_function), ".");
                return null;
            }
            return sink_function as (data: any) => any;
        };
        const extraction_pattern_parse = (extraction_pattern: string): [string[], string[]]|null => {
            const parts = 
            extraction_pattern
                .split(',')
                .map(part => part.trim())
                .filter(part => part !== '')
                .map(part => part.trim().split('.').map(part => part.trim()));
            for (let i=0;i<parts.length;i++) {
                for (let j=i+1;j<parts.length;j++) {
                    if (parts[i].length != parts[j].length) {
                        console.error("FetchPipeline: Extraction parts must have the same prefix. ", parts[i].join('.'), " != ", parts[j].join('.'));
                        return null;
                    }
                }
            }
            if (parts[0].length == 1) {
                return [ [], parts.map(part => part[0]) ];
            } else {
                return [ parts[0].slice(0, -1), parts.map(part => part[parts[0].length - 1]) ];
            }
        };
        const form = element.closest('form') as HTMLFormElement;
        if (!form) {
            console.error("FetchPipeline: No form found for element: ", element);
            return;
        }
        const pipeline = element.dataset.fetchPipeline;
        if (!pipeline) return;
        const [ source_url, extraction_pattern_str, sink_function_str ] = pipeline.split('|');
        if (!source_url || !extraction_pattern_str || !sink_function_str) {
            console.error("FetchPipeline: Invalid pipeline: ", pipeline);
            return;
        }
        const sink_function = sink_function_parse(sink_function_str, element);
        if (!sink_function) return;
        const extraction_pattern = extraction_pattern_parse(extraction_pattern_str);
        if (!extraction_pattern) return;
        const [ extraction_prefix, extraction_fields ] = extraction_pattern;
        const extraction_function = FetchPipeline.extractDataFromAttributeSyntax.bind(null, extraction_prefix, extraction_fields);
        new FetchPipeline(form, source_url, extraction_function, sink_function.bind(element));
    }
}
declare global {
    interface Sergiosgc { 
        FetchPipeline: typeof FetchPipeline,
    }
}
globalThis.sergiosgc.FetchPipeline = FetchPipeline;
(function() {
    const observer = new XPathObserver("//*[@data-fetch-pipeline]", document.documentElement);
    observer.addEventListener("xpathobserver.node.new", ev => FetchPipeline.attachToElement((ev as any).detail.target as HTMLElement));
})();