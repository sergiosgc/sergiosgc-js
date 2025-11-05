import "../../query-elements/src/index";
import "../../localization/src/index";
globalThis.sergiosgc.callOnLoad(function(): void {

const onclick = function(ev: MouseEvent): void {
    let target = ev.target;
    while (target && !('delete' in target.classList)) target = target.parentNode;
    if (!target) target = ev.target;
    if ('skipconfirmation' in (target as HTMLElement).classList) return;
    if ('delete-confirm' in (target as HTMLElement).classList) return;
    window.setTimeout(function() {
        (target as HTMLElement).classList.remove('delete-confirm-waiting');
        (target as HTMLElement).classList.add('delete-confirm');
        (target as HTMLElement).textContent = __('Click again to confirm deletion');
        (target as HTMLElement).removeEventListener("click", onclick);
    }, 500);
    (target as HTMLElement).textContent = __('Please wait...');
    (target as HTMLElement).classList.add('delete-confirm-waiting');
    ev.preventDefault();
}
globalThis.sergiosgc.queryElements('css:a.delete').forEach(a => a.addEventListener('click', onclick));

});
