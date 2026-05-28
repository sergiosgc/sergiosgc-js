import "../../sergiosgc/src/index";
import "../../mutation-event-attacher/src/index";

(function() {
    new globalThis.sergiosgc.MutationEventAttacher(
        document.documentElement,
        "css:form.styled-validity",
        'invalid',
        function (event: Event) {
            const target = event.target as HTMLFormElement;
            if (!target) return;
            const errorMessageElement: Element | undefined | null = 
                target.parentElement?.querySelector('.error-message') ?? 
                [ target.parentElement ]
                    .filter(parent => parent?.tagName === 'LABEL')
                    .map(parent => parent?.querySelector('.error-message'))
                    .pop();
            if (!errorMessageElement) return;
            const errorMessage = target.validationMessage;
            while (errorMessageElement.firstChild) {
                errorMessageElement.firstChild?.remove();
            }
            errorMessageElement.appendChild(document.createTextNode(errorMessage));
            errorMessageElement.classList.remove('no-error');
            errorMessageElement.classList.remove('warning', 'info');
            errorMessageElement.classList.add('error');
            event.stopPropagation();
            event.preventDefault();
        },
        {
            capture: true
        }
    );
})();

