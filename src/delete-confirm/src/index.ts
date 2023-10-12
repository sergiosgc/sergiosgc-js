import "../../query-elements/src/index";
import "../../localization/src/index";
globalThis.sergiosgc.callOnLoad(function(): void {

const onclick = function(ev: MouseEvent): void {
    window.setTimeout(function() {
        (ev.target as HTMLElement).textContent = __('Click again to confirm deletion');
        (ev.target as HTMLElement).removeEventListener("click", onclick);
    }, 500);
    (ev.target as HTMLElement).textContent = __('Please wait...');
    ev.preventDefault();
}
globalThis.sergiosgc.queryElements('css:a.delete').forEach(a => a.addEventListener('click', onclick));

});