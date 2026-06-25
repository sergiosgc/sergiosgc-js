import "../../query-elements/src/index";
import "../../localization/src/index";

export default class DeleteConfirm {
    static click_again: string|null = null;
    static click_again_getter(): string {
        if (DeleteConfirm.click_again === null) DeleteConfirm.click_again = __('Click again to confirm deletion');
        return DeleteConfirm.click_again;
    }
    static please_wait: string|null = null;
    static please_wait_getter(): string {
        if (DeleteConfirm.please_wait === null) DeleteConfirm.please_wait = __('Please wait...');
        return DeleteConfirm.please_wait;
    }
    static attachClass = 'delete';
    static skipConfirmationClass = 'skipconfirmation';
    static waitingClass = 'delete-confirm-waiting';
    static confirmedClass = 'delete-confirm';
    static handleClick(ev: MouseEvent): void {
        let target = ev.target;
        while (target && typeof((target as HTMLElement).classList) === 'object' && (target as HTMLElement).classList.contains && !(target as HTMLElement).classList.contains(DeleteConfirm.attachClass)) {
            target = (target as HTMLElement).parentNode;
        }
        if (!target) target = ev.target;
        if (DeleteConfirm.skipConfirmationClass in (target as HTMLElement).classList) return;
        if (DeleteConfirm.confirmedClass in (target as HTMLElement).classList) return;
        window.setTimeout(function() {
            (target as HTMLElement).classList.remove(DeleteConfirm.waitingClass);
            (target as HTMLElement).classList.add(DeleteConfirm.confirmedClass);
            (target as HTMLElement).textContent = DeleteConfirm.click_again_getter();
            (target as HTMLElement).removeEventListener("click", DeleteConfirm.handleClick);
        }, 500);
        (target as HTMLElement).textContent = DeleteConfirm.please_wait_getter();
        (target as HTMLElement).classList.add(DeleteConfirm.waitingClass);
        ev.preventDefault();
    }
    static init(): void {
        globalThis.sergiosgc.queryElements('css:a.' + DeleteConfirm.attachClass).forEach(a => a.addEventListener('click', DeleteConfirm.handleClick));
        globalThis.sergiosgc.queryElements('css:button.' + DeleteConfirm.attachClass).forEach(a => a.addEventListener('click', DeleteConfirm.handleClick));
    }
}
declare global {
    interface Sergiosgc { 
        DeleteConfirm: typeof DeleteConfirm,
    }
}
globalThis.sergiosgc.DeleteConfirm = DeleteConfirm;
globalThis.sergiosgc.callOnLoad(DeleteConfirm.init);
