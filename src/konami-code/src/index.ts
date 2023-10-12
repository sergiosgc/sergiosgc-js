import "./../../sergiosgc/src/index";
(() => {
    let keys = [ "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a" ];
    let nextKey = 0;

    document.addEventListener("keydown", function(ev:KeyboardEvent) {
        if (ev.key == keys[nextKey]) nextKey++; else nextKey = 0;
        if (nextKey == keys.length) {
            nextKey = 0;
            document.dispatchEvent(new CustomEvent("konamicode"));
        }
    }, { capture: true, once: false, passive: true } )
}
)();