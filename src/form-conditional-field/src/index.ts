import "./../../call-on-load/src/index";
import "./../../xpath-observer/src/index";

export default class FormConditionalField {
    private form: HTMLFormElement;
    private field: string;
    private conditionArgumentFields: string[];
    private evaluationFunction: (...args: any[]) => boolean;
    private activeClass: string = "";
    private inactiveClass: string = "disabled";
    private setInactive: boolean = true;

    constructor(form: HTMLFormElement, field: string, conditionArgumentFields: string[], evaluationFunction: (...args: any[]) => boolean) {
        this.form = form;
        this.field = field;
        this.conditionArgumentFields = conditionArgumentFields;
        this.evaluationFunction = evaluationFunction;
        this.form.addEventListener('change', this.handleChange.bind(this), { once: false, passive: true });
        this.handleChange();
    }
    public static equalityEvaluationFunction(...args: any[]): boolean {
        if (args.length % 2 !== 0) return false;
        for (let i = 0; i < args.length / 2; i += 1) {
            if (args[i] !== args[i + args.length / 2]) return false;
        }
        return true;
    }
    private handleChange() {
        const field = this.form.elements.namedItem(this.field) as any;
        if (!field) return;
        const evaluationFunctionArgs = this.conditionArgumentFields.map(field => (this.form.elements.namedItem(field) as any)?.value ?? null);
        const evaluationResult = this.evaluationFunction(...evaluationFunctionArgs);
        if (evaluationResult) {
            if (this.activeClass) field.classList.add(this.activeClass);
            if (this.inactiveClass) field.classList.remove(this.inactiveClass);
            if (this.setInactive) {
                field.removeAttribute("disabled");
            }
        } else {
            if (this.inactiveClass) field.classList.add(this.inactiveClass);
            if (this.activeClass) field.classList.remove(this.activeClass);
            if (this.setInactive) {
                field.setAttribute("disabled", "disabled");
            }
        }
    }
}
declare global {
    interface Sergiosgc { 
        FormConditionalField: typeof FormConditionalField,
    }
}
globalThis.sergiosgc.FormConditionalField = FormConditionalField;
(function() {
    const observer = new sergiosgc.XPathObserver("//form//*[@data-conditional-on-value]", document.documentElement);
    observer.addEventListener("xpathobserver.node.new", ev => {
        const targetInput = (ev as any).detail.target as HTMLElement;
        if (!targetInput || !targetInput.getAttribute('name') || !targetInput.dataset.conditionalOnValue) return;
        const form = targetInput.closest('form') as HTMLFormElement;
        if (!form) return;
        const argsAndValues = targetInput.dataset.conditionalOnValue.split(';').map(
            evaluationArg => {
                const args = evaluationArg.split('=', 2);
                if (args.length !== 2) return null;
                return args;
            }
        ).filter(arg => arg !== null);
        const fieldNames = argsAndValues.map(arg => arg[0]);
        const fieldValues = argsAndValues.map(arg => arg[1]);
        new FormConditionalField(form, targetInput.getAttribute('name') as string, fieldNames, FormConditionalField.equalityEvaluationFunction.bind(null, ...fieldValues));
        targetInput.removeAttribute('data-conditional-on-value');
    });
        /*
        const form = document.getElementsByTagName('form')[0];
        if (!form) return;
        new FormConditionalField(form, 'allowed_senders.list', ['allowed_senders.type'], (...args: any[]) => {
            return args[0] === 'own_list';
        });
        */
})();