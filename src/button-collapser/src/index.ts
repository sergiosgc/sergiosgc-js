import "../../query-elements/src/index";
window.sergiosgc.callOnLoad(function(): void {
    var onclick = function(ev: MouseEvent): void {
        ev.preventDefault();
        if ((ev.target as any).collapsibleActionsDropdownDiv) {
            (ev.target as any).collapsibleActionsDropdownDiv.style.display = (ev.target as any).collapsibleActionsDropdownDiv.style.display == 'none' ? 'block' : 'none'
        } else {
            /*
            let buttons = (function(xpathResult) {
                let result = [];
                for(let node = xpathResult.iterateNext(); node; node = xpathResult.iterateNext()) result.push(node);
                return result;
            })(document.evaluate("following::node()", (ev.target as any), null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null)).filter( node => node.nodeType == Node.ELEMENT_NODE && node.tagName == 'A' );
            */
            let buttons = window.sergiosgc.queryElements("xpath:following::a", ev.target as Element);
            console.log(buttons);
            for (var i=0; i<buttons.length && buttons[i].classList.contains('button') && !buttons[i].classList.contains('button-collapser'); i++);
            buttons.splice(i);
            var dropdownDiv = document.createElement('DIV');
            dropdownDiv.classList.add('button-collapser-dropdown');
            dropdownDiv.style.position = 'absolute';
            dropdownDiv.style.top = "" + ((ev.target as any).offsetTop + (ev.target as any).getBoundingClientRect().height) + "px";
            dropdownDiv.style.left = "" + ((ev.target as any).offsetLeft + (ev.target as any).getBoundingClientRect().width - 30) + "px"; // Position once to get an approximate position
            buttons.map(button => dropdownDiv.appendChild(button));
            (ev.target as any).parentNode.insertBefore(dropdownDiv, ev.target);
            (function(f) {
                f();
                window.addEventListener('resize', f);
            })( function() {
                var absoluteCoords = { x: (ev.target as any).offsetLeft, y: (ev.target as any).offsetTop };
                for (var node = (ev.target as any).offsetParent; node && "static" == getComputedStyle(node).position; node = node.offsetParent) {
                    absoluteCoords.x += node.offsetLeft;
                    absoluteCoords.y += node.offsetTop;
                }
                dropdownDiv.style.top = "" + (absoluteCoords.y + (ev.target as any).getBoundingClientRect().height) + "px";
                dropdownDiv.style.left = "" + (absoluteCoords.x + (ev.target as any).getBoundingClientRect().width - 40) + "px";
                if (( rect => 
                    [ [rect.left, rect.top], [rect.right, rect.top], [rect.right, rect.bottom], [rect.left, rect.bottom] ]
                        .map( point => point[0] >= 0 && point[0] <= window.innerWidth && point[1] >= 0 && point[1] <= window.innerHeight )
                        .reduce( (acc, val) => acc || val, false)
                    )( (ev.target as any).getBoundingClientRect() )) { // If all target button corners are within viewport, try to keep list within viewport
                        if ( dropdownDiv.getBoundingClientRect().right > window.innerWidth) {
                            dropdownDiv.style.removeProperty('left');
                            dropdownDiv.style.right = "0";
                        }
                    }
            });
            (ev.target as any).collapsibleActionsDropdownDiv = dropdownDiv;
        }
        Array.prototype.slice.call(document.getElementsByClassName('button-collapser'))
            .filter( a => a.collapsibleActionsDropdownDiv )
            .filter( a => a != ev.target )
            .map( a => a.collapsibleActionsDropdownDiv.style.display = 'none' )
    }
    globalThis.sergiosgc.queryElements("css:a.button-collapser").forEach( a => a.addEventListener('click', onclick));
});