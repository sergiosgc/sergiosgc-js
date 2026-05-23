import "../../sergiosgc/src/index";
import "../../mutation-event-attacher/src/index";

(function() {
    const convertFormToJson = function(ev: SubmitEvent) {
        const formData = new FormData(ev.target as HTMLFormElement);
        console.log(formData.get('groups'));
        ev.preventDefault();
        ev.stopPropagation();
    };

    new globalThis.sergiosgc.MutationEventAttacher(
        document.documentElement,
        'xpath://form[@enctype="application/json"]',
        'submit',
        convertFormToJson as any
    );
    console.log('form-enctype-json loaded');

})();